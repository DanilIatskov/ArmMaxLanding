'use client'

import Link from 'next/link'
import { Button } from './ui'
import { useCookieConsent, writeConsent } from '@/lib/cookie-consent'

/**
 * Уведомление о cookie.
 *
 * Показывается, пока человек не выбрал. Кнопки две, и это не формальность:
 * баннер с одним «Принимаю» ничего не решает — выбора в нём нет, а значит
 * нет и согласия. «Только необходимые» оставляет сайт работать и не пускает
 * Метрику.
 *
 * До первого кадра в браузере компонент не рисует ничего: на сервере
 * localStorage недоступен, и разметка с баннером разошлась бы с той,
 * что получится после чтения хранилища.
 *
 * Строка во всю ширину окна, низкая. Ширина здесь работает на текст:
 * в узкой карточке пришлось бы отделаться общими словами, а в строке
 * помещается по делу — что именно за cookie, зачем и что с аналитикой.
 *
 * Кнопки мелкие: это служебное сообщение, а не призыв к действию, и
 * состязаться по весу с кнопками первого экрана ему незачем.
 *
 * Рамки нет, форму задаёт мягкая тень — строка висит над страницей
 * и должна отделяться и от светлой секции, и от снимка на первом экране.
 */
export function CookieNotice() {
  const consent = useCookieConsent()

  if (consent !== null) return null

  const choose = (value: 'accepted' | 'declined') => writeConsent(value)

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-notice-title"
      className="fixed inset-x-0 bottom-0 z-[60] bg-surface shadow-float-up"
    >
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:gap-10 lg:px-14 lg:py-5">
        <div className="flex-1">
          <h2 id="cookie-notice-title" className="text-[15px] leading-snug">
            Про файлы cookie
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-body-soft">
            Необходимые запоминают ваш выбор в этой строке — без них сайт не работает.
            Аналитические подключаются только после вашего согласия.
            {/* Подробности только на широком экране: на телефоне строка от них
                вырастала вдвое, а место под них есть как раз здесь. */}
            <span className="hidden lg:inline">
              {' '}
              Их ставит Яндекс.Метрика, чтобы считать посещаемость; данные в ней обезличены,
              и по ним нельзя установить личность. Рекламных cookie на сайте нет.
            </span>{' '}
            Подробнее — в{' '}
            <Link
              href="/politika-cookie"
              className="text-ink-900 underline underline-offset-4 transition-colors hover:text-brand-500"
            >
              политике cookie
            </Link>{' '}
            и{' '}
            <Link
              href="/politika-konfidencialnosti"
              className="text-ink-900 underline underline-offset-4 transition-colors hover:text-brand-500"
            >
              политике обработки персональных данных
            </Link>
            .
          </p>
        </div>

        {/* Отказ такой же по весу, как согласие: выбор из одной кнопки
            выбором не является. */}
        <div className="flex shrink-0 gap-2.5">
          <Button
            size="sm"
            className="flex-1 whitespace-nowrap lg:flex-none"
            onClick={() => choose('accepted')}
          >
            Принимаю
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 whitespace-nowrap lg:flex-none"
            onClick={() => choose('declined')}
          >
            Только нужные
          </Button>
        </div>
      </div>
    </div>
  )
}
