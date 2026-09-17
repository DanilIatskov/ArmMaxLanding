'use client'

/**
 * Квадратная кнопка перелистывания. Одна на все слайдеры сайта: первый экран
 * и блок «Как мы строим» — чтобы элементы управления везде читались
 * как одна семья.
 *
 * Рамка 2px подобрана под обводку квадрата с номером этапа: там stroke 1.5
 * в системе 40×40 при размере 56–64px даёт те же ~2 пикселя.
 *
 * `tone` переключает контраст: `light` для тёмного фона, `dark` для снимка
 * или светлой подложки.
 */
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
  // Рамка чисто белая, без приглушения: рядом стоит квадрат с номером
  // на сплошном белом, и полупрозрачные стрелки рядом с ним выглядели
  // выключенными. На снимке добавляется лёгкая подложка — иначе белый
  // контур теряется на светлых участках кадра.
  const tones = {
    light: 'border-white text-white hover:bg-white hover:text-ink-900',
    dark: 'border-white bg-ink-950/25 text-white backdrop-blur-sm hover:bg-white hover:text-ink-900',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex size-9 items-center justify-center border-2 transition-colors lg:size-10 ${tones[tone]}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-4 lg:size-[18px]" aria-hidden>
        <path
          d={direction === 'prev' ? 'M15 4l-8 8 8 8' : 'M9 4l8 8-8 8'}
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </button>
  )
}
