/**
 * Знак АРММАКС — гранёная «М».
 *
 * Оригинал прислан растром 300×300 на белом фоне: на тёмной шапке он не живёт
 * и на ретине сыпется. Силуэт перерисован в вектор, огранка собирается кодом —
 * сетка 5×5, каждая клетка режется по диагонали и красится из палитры логотипа.
 * Клип по контуру «М» оставляет от сетки только буквy.
 */

const FACETS = [
  '#2e3192', '#1b75bc', '#00adef', '#4752a2', '#242d66',
  '#1b75bc', '#4752a2', '#2e3192', '#00adef', '#1b75bc',
  '#00adef', '#242d66', '#4752a2', '#2e3192', '#00adef',
  '#4752a2', '#2e3192', '#1b75bc', '#242d66', '#4752a2',
  '#242d66', '#00adef', '#2e3192', '#1b75bc', '#242d66',
]

/** Контур «М» с клиновидными основаниями ножек — отсылка к засечкам оригинала. */
const M_PATH =
  'M20 30 H65 L100 95 L135 30 H180 V170 L162.5 188 L145 170 V88 L100 145 L55 88 V170 L37.5 188 L20 170 Z'

const CELL = 40

export function LogoMark({ className }: { className?: string }) {
  const id = 'armmaks-m'

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="АРММАКС-СТРОЙ">
      <defs>
        <clipPath id={id}>
          <path d={M_PATH} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: 25 }, (_, i) => {
          const col = i % 5
          const row = Math.floor(i / 5)
          const x = col * CELL
          const y = row * CELL
          // Направление диагонали чередуется в шахматном порядке — грани
          // не выстраиваются в полосы, как на оригинальном знаке.
          const flip = (col + row) % 2 === 0

          return (
            <g key={i}>
              <polygon
                points={
                  flip
                    ? `${x},${y} ${x + CELL},${y} ${x},${y + CELL}`
                    : `${x},${y} ${x + CELL},${y} ${x + CELL},${y + CELL}`
                }
                fill={FACETS[i]}
              />
              <polygon
                points={
                  flip
                    ? `${x + CELL},${y} ${x + CELL},${y + CELL} ${x},${y + CELL}`
                    : `${x},${y} ${x + CELL},${y + CELL} ${x},${y + CELL}`
                }
                fill={FACETS[(i + 7) % 25]}
              />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={`text-[15px] font-bold tracking-[0.14em] ${
            tone === 'light' ? 'text-white' : 'text-ink-900'
          }`}
        >
          АРММАКС
        </span>
        <span
          className={`mt-1 text-[11px] font-medium tracking-[0.26em] ${
            tone === 'light' ? 'text-white/55' : 'text-body-soft'
          }`}
        >
          СТРОЙ
        </span>
      </span>
    </span>
  )
}
