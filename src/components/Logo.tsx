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
 */

const HEIGHTS = {
  sm: 'h-[30px]',
  md: 'h-[38px]',
  lg: 'h-[52px]',
} as const

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <svg
      viewBox={LOGO_VIEW_BOX}
      className={`${HEIGHTS[size]} w-auto`}
      fill="currentColor"
      role="img"
      aria-label="АРММАКС-СТРОЙ"
    >
      {[LOGO_MARK, LOGO_WORD].map((group, i) => (
        <g key={i} transform={group.transform}>
          {group.paths.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      ))}
    </svg>
  )
}
