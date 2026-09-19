import { LOGO_MARK, LOGO_VIEW_BOX, LOGO_WORD } from './logo-paths'

/**
 * Логотип АРММАКС-СТРОЙ: знак «М» с полосами слева, надпись справа.
 *
 * Контуры лежат в logo-paths.ts и переносятся туда из фирменного файла
 * командой `npm run logo`. Здесь только то, как их рисовать.
 *
 * Логотип одноцветный, заливка — currentColor. Цвет задаётся снаружи обычным
 * text-*: белый на тёмной шапке и в подвале, тёмный на светлой шапке. Ни
 * второго файла, ни переключателя темы не нужно.
 *
 * `animated` собирает логотип по частям: секции знака поднимаются с общей
 * линии основания, затем проявляется надпись. Включено в шапке и на заставке.
 *
 * Навязчивым это не становится: анимация на CSS играет при создании элемента,
 * а шапка живёт в корневой разметке и при переходах внутри сайта
 * не пересоздаётся. То есть сборка видна один раз за загрузку страницы,
 * а не на каждый клик по меню.
 */

const HEIGHTS = {
  sm: 'h-[30px]',
  md: 'h-[38px]',
  lg: 'h-[52px]',
} as const

/** Шаг задержки между секциями. Знак собирается слева направо. */
const STEP_MS = 90

export function Logo({
  size = 'md',
  animated = false,
}: {
  size?: keyof typeof HEIGHTS
  animated?: boolean
}) {
  // Секции идут в разметке справа налево (сначала «М», потом полосы),
  // а расти должны слева направо — поэтому задержка считается с конца.
  const markDelay = (i: number) => (LOGO_MARK.paths.length - 1 - i) * STEP_MS
  const wordDelay = LOGO_MARK.paths.length * STEP_MS

  return (
    <svg
      viewBox={LOGO_VIEW_BOX}
      className={`${HEIGHTS[size]} w-auto`}
      fill="currentColor"
      role="img"
      aria-label="АРММАКС-СТРОЙ"
    >
      <g transform={LOGO_MARK.transform} className={animated ? 'logo-build-mark' : undefined}>
        {LOGO_MARK.paths.map((d, i) => (
          <path
            key={d}
            d={d}
            style={animated ? { animationDelay: `${markDelay(i)}ms` } : undefined}
          />
        ))}
      </g>

      <g transform={LOGO_WORD.transform} className={animated ? 'logo-build-word' : undefined}>
        {LOGO_WORD.paths.map((d, i) => (
          <path
            key={d}
            d={d}
            style={animated ? { animationDelay: `${wordDelay + i * 70}ms` } : undefined}
          />
        ))}
      </g>
    </svg>
  )
}
