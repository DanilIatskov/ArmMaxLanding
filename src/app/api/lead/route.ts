import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type Lead = {
  name?: unknown
  phone?: unknown
  message?: unknown
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

  if (!name || !phone) {
    return NextResponse.json({ error: 'Заполните имя и телефон' }, { status: 400 })
  }

  // 152-ФЗ: без согласия заявку не принимаем и не храним.
  if (body.consent !== true && body.consent !== 'on') {
    return NextResponse.json({ error: 'Нужно согласие на обработку персональных данных' }, { status: 400 })
  }

  const lead = { name, phone, message, receivedAt: new Date().toISOString() }

  // TODO: доставка заявки. По брифу — на почту и в CRM.
  // Почта: SMTP российского провайдера (заявки не должны уходить через зарубежный сервис).
  // CRM: заказчик её внедряет, какую именно — не сказал. Как выяснится, добавить вебхук.
  // Пока пишем в лог сервера, чтобы ни одна заявка не потерялась молча.
  console.info('[lead]', JSON.stringify(lead))

  if (!process.env.LEAD_EMAIL_TO) {
    console.warn('[lead] LEAD_EMAIL_TO не задан — заявка никуда не отправлена, только записана в лог')
  }

  return NextResponse.json({ ok: true })
}
