'use client'

/**
 * Квадратная кнопка перелистывания. Одна на все слайдеры сайта: первый экран
 * и блок «Как мы строим» — чтобы элементы управления везде читались
 * как одна семья.
 *
 * Рамка волосяная, а сам шеврон толстый: на равной толщине кнопка читалась
 * как пустой квадрат, стрелка в нём терялась. Подложки нет — кнопки стоят
 * поверх тёмных участков кадра и не нуждаются в ней; заливка появляется
 * только на наведении.
 *
 * `tone` нужен там, где кнопки вышли с кадра на светлый фон секции: белым
 * по светлому их попросту не видно.
 */
const TONES = {
  light: 'border-white text-white hover:bg-white hover:text-ink-900',
  dark: 'border-line-strong text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-white',
}

export function ArrowButton({
  label,
  onClick,
  direction,
  tone = 'light',
}: {
  label: string
  onClick: () => void
  direction: 'prev' | 'next'
  tone?: 'light' | 'dark'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex size-9 items-center justify-center border transition-colors lg:size-10 ${TONES[tone]}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-4 lg:size-[18px]" aria-hidden>
        <path
          d={direction === 'prev' ? 'M15 4l-8 8 8 8' : 'M9 4l8 8-8 8'}
          stroke="currentColor"
          strokeWidth="2.5"
        />
      </svg>
    </button>
  )
}
