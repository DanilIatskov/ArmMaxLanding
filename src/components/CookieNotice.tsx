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
 * Белая плашка с отступами от краёв, а не полоса во всю ширину: так она
 * читается как элемент поверх страницы, а не как часть подвала, и не режет
 * первый экран пополам. Ни рамки, ни тени — форму держат сам отступ
 * и заливка. Рамки нет, форму задаёт мягкая тень: плашка висит над
 * страницей и должна отделяться и от светлой секции, и от снимка.
 */
export function CookieNotice() {
  const consent = useCookieConsent()

  if (consent !== null) return null

  const choose = (value: 'accepted' | 'declined') => writeConsent(value)

  return (
    <div
      role="dialog"
      aria-label="Файлы cookie"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] p-4 lg:p-6"
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-[1680px] flex-col gap-5 bg-surface p-5 shadow-float lg:flex-row lg:items-center lg:gap-10 lg:p-7">
        {/* Текст короткий намеренно: на телефоне полоса и так съедает низ
            экрана, а длинное объяснение живёт на странице политики. */}
        <p className="flex-1 text-[14px] leading-relaxed lg:text-[15px]">
          Сайт использует cookie: часть нужна для работы, остальные — чтобы считать
          посещаемость. Подробнее в{' '}
          <Link href="/politika-cookie" className="text-ink-900 underline underline-offset-4 transition-colors hover:text-brand-500">
            политике cookie
          </Link>{' '}
          и{' '}
          <Link href="/politika-konfidencialnosti" className="text-ink-900 underline underline-offset-4 transition-colors hover:text-brand-500">
            политике обработки данных
          </Link>.
        </p>

        {/* Кнопки в строку и на телефоне: столбиком полоса вырастала до трети
            экрана. Отказ таким же по весу, как согласие, — выбор из одной
            кнопки выбором не является. */}
        <div className="flex shrink-0 gap-2.5">
          <Button className="flex-1 px-4 lg:flex-none lg:px-8" onClick={() => choose('accepted')}>
            Принимаю
          </Button>
          <Button
            variant="outline"
            className="flex-1 px-4 lg:flex-none lg:px-8"
            onClick={() => choose('declined')}
          >
            Только нужные
          </Button>
        </div>
      </div>
    </div>
  )
}
