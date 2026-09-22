import { NextResponse } from 'next/server'
import { sendLeadToTelegram } from './telegram'

export const runtime = 'nodejs'

type Lead = {
  name?: unknown
  phone?: unknown
  message?: unknown
  page?: unknown
  consent?: unknown
  company_website?: unknown
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(request: Request) {
  let body: Lead

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
  }

  // Honeypot заполнен — это бот. Отвечаем успехом, чтобы не подсказывать.
  if (str(body.company_website, 200)) {
    return NextResponse.json({ ok: true })
  }

  const name = str(body.name, 120)
  const phone = str(body.phone, 30)
  const message = str(body.message, 2000)
  const page = str(body.page, 200)

  if (!name || !phone) {
    return NextResponse.json({ error: 'Заполните имя и телефон' }, { status: 400 })
  }

  // 152-ФЗ: без согласия заявку не принимаем и не храним.
  if (body.consent !== true && body.consent !== 'on') {
    return NextResponse.json({ error: 'Нужно согласие на обработку персональных данных' }, { status: 400 })
  }

  const lead = { name, phone, message, page, receivedAt: new Date().toISOString() }

  /*
    Лог пишем всегда и первым делом. Доставка может отказать — Telegram лежит,
    токен отозвали, почта не настроена, — но заявка к этому моменту уже в
    журнале сервера, и её можно достать руками. Молча потерянная заявка для
    подрядчика дороже любой ошибки в интерфейсе.
  */
  console.info('[lead]', JSON.stringify(lead))

  const telegram = await sendLeadToTelegram(lead)

  if (telegram.total === 0) {
    console.warn('[lead] Telegram не настроен: нет TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_IDS')
  }

  /*
    Ни один канал не сработал — честно отвечаем ошибкой. Показать «заявка
    принята», когда её никто не увидит, хуже, чем попросить позвонить:
    человек уйдёт в уверенности, что с ним свяжутся.

    TODO: почта и CRM по брифу. Почта — SMTP российского провайдера, заявки с
    персданными не должны уходить за периметр РФ. CRM заказчик ещё выбирает.
  */
  if (telegram.total > 0 && telegram.sent === 0) {
    return NextResponse.json(
      { error: 'Не получилось отправить заявку. Позвоните нам, пожалуйста: +7 (983) 300-70-07' },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
