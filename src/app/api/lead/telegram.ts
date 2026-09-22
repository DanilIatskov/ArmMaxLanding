/**
 * Доставка заявок в Telegram.
 *
 * Почта и CRM по брифу остаются, но пока их нет, а заявки терять нельзя:
 * Telegram доходит мгновенно и читается с телефона на объекте, что для
 * строительной компании важнее красивого письма.
 *
 * Токен и список получателей живут в переменных окружения, а не в коде.
 * Причина простая: репозиторий публичный. Токен бота — это полный доступ к
 * нему: кто его нашёл, тот читает все входящие сообщения и пишет от имени
 * компании. В открытом коде его находят за часы — по GitHub ходят
 * автоматические сканеры, которые ищут ровно такие строки.
 *
 * Получателей несколько: заявка уходит каждому. Это не рассылка «на всякий
 * случай», а страховка от одного телефона — если у одного отключён интернет,
 * заявку увидит второй.
 */

export type Lead = {
  name: string
  phone: string
  message: string
  /** С какой страницы отправлена — контекст для первого звонка. */
  page?: string
  receivedAt: string
}

/**
 * Адрес Telegram Bot API.
 *
 * По умолчанию — официальный, но с российских хостингов подсети Telegram
 * закрыты, и запрос просто виснет до таймаута. На такой случай адрес
 * подменяется своим прокси (TELEGRAM_API_BASE), который принимает тот же
 * путь /bot<токен>/sendMessage и передаёт его дальше.
 */
function apiBase(): string {
  const base = (process.env.TELEGRAM_API_BASE ?? '').trim()
  return (base || 'https://api.telegram.org').replace(/\/+$/, '')
}

/** Кому шлём. Пусто — значит доставка не настроена, и это видно в логе. */
function recipients(): string[] {
  return (process.env.TELEGRAM_CHAT_IDS ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
}

/**
 * Экранирование под HTML-разметку Telegram.
 *
 * Обязательно: в имени или сообщении может прийти «<», и тогда Telegram
 * отвечает «can't parse entities» — заявка не доходит вовсе. Человек при
 * этом видит «спасибо, заявка принята».
 */
function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function format(lead: Lead): string {
  const when = new Date(lead.receivedAt).toLocaleString('ru-RU', {
    timeZone: 'Asia/Novosibirsk',
    dateStyle: 'short',
    timeStyle: 'short',
  })

  /*
    Порядок строк — порядок действий. Заявку открывают, чтобы перезвонить,
    поэтому сверху имя и номер, а не заголовки полей: подписи «Имя» и
    «Телефон» занимают строку и ничего не объясняют — и так видно, где что.

    Номер моноширинным: в Telegram такой текст копируется одним касанием.

    Время и страница уходят вниз курсивом. Это справка — по ней видно, что
    человек читал перед звонком, но ради неё уведомление не открывают.
  */
  const lines = [
    '<b>Заявка с сайта</b>',
    '',
    `<b>${esc(lead.name)}</b>`,
    `<code>${esc(lead.phone)}</code>`,
  ]

  if (lead.message) lines.push('', esc(lead.message))

  const footer = [when]
  if (lead.page) footer.push(`страница ${esc(lead.page)}`)
  lines.push('', `<i>${footer.join(' · ')}</i>`)

  return lines.join('\n')
}

/**
 * Отправка. Возвращает, сколько получателей заявку получили.
 *
 * Исключения наружу не выпускаются: упавший Telegram не повод отдавать
 * человеку ошибку, если заявка уже записана в лог. Решение о том, что
 * показать отправителю, принимает сам роут.
 */
export async function sendLeadToTelegram(lead: Lead): Promise<{ sent: number; total: number }> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chats = recipients()

  if (!token || chats.length === 0) return { sent: 0, total: 0 }

  const text = format(lead)

  const results = await Promise.all(
    chats.map(async (chat_id) => {
      try {
        const res = await fetch(`${apiBase()}/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id,
            text,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
          // Телеграм отвечает быстро; если не ответил за 8 секунд — не заставляем
          // человека ждать ответа формы дольше, заявка уже в логе.
          signal: AbortSignal.timeout(8000),
        })

        if (!res.ok) {
          const detail = await res.text().catch(() => '')
          console.error('[lead] telegram отказал', res.status, detail.slice(0, 300))
          return false
        }

        return true
      } catch (error) {
        console.error('[lead] telegram недоступен', error)
        return false
      }
    }),
  )

  return { sent: results.filter(Boolean).length, total: chats.length }
}
