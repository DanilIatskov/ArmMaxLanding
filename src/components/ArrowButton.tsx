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
 */
export function ArrowButton({
  label,
  onClick,
  direction,
}: {
  label: string
  onClick: () => void
  direction: 'prev' | 'next'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-9 items-center justify-center border border-white text-white transition-colors hover:bg-white hover:text-ink-900 lg:size-10"
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
