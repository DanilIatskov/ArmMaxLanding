/**
 * Гранёная плитка из палитры логотипа: прореженная сетка треугольников.
 *
 * Узор задаётся `seed`, поэтому у каждого этапа он свой, но при перерисовке
 * не прыгает случайно. По умолчанию узор кадрируется по контейнеру
 * (`fit="cover"`) и держит углы 45° при любой его форме. Грани въезжают волной по диагонали и дальше медленно
 * дышат — анимация целиком на CSS, без таймеров в JS. Смена `seed` через `key`
 * на вызывающей стороне перезапускает въезд.
 */
export function FacetTile({
  seed = 0,
  cells = 5,
  fit = 'cover',
  className = '',
}: {
  seed?: number
  cells?: number
  /**
   * `cover` — узор кадрируется по контейнеру и держит углы 45°.
   * `stretch` — растягивается под форму контейнера; годится только там,
   * где пропорции фиксированы, иначе грани перекашивает при сжатии окна.
   */
  fit?: 'cover' | 'stretch'
  className?: string
}) {
  const size = 200 / cells
  const id = `facet-${cells}`

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden preserveAspectRatio={fit === 'cover' ? 'xMidYMid slice' : 'none'}>
      <defs>
        <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00adef" />
          <stop offset="100%" stopColor="#2e3192" />
        </linearGradient>
      </defs>

      {Array.from({ length: cells * cells }, (_, i) => {
        const col = i % cells
        const row = Math.floor(i / cells)
        const n = (col * 3 + row * 5 + seed * 2) % 8

        // Часть клеток намеренно пустая — так узор дышит.
        if (n > 4) return null

        const x = col * size
        const y = row * size
        const enter = (col + row) * 55

        return (
          <polygon
            key={i}
            className="facet"
            points={
              n % 2 === 0
                ? `${x},${y} ${x + size},${y} ${x},${y + size}`
                : `${x + size},${y} ${x + size},${y + size} ${x},${y + size}`
            }
            fill={`url(#${id}-grad)`}
            style={
              {
                '--o': 0.3 + (n % 3) * 0.22,
                // Въезд идёт волной по диагонали; дыхание стартует только
                // после него и вразнобой. Если запустить их вместе, дыхание
                // перебьёт въезд: при двух анимациях на одно свойство
                // выигрывает последняя в списке.
                animationDelay: `${enter}ms, ${enter + 550 + ((col * 7 + row * 11) % 9) * 600}ms`,
              } as React.CSSProperties
            }
          />
        )
      })}
    </svg>
  )
}
