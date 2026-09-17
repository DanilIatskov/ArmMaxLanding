import {
  LOGO_GRADIENTS,
  LOGO_MARK_COUNT,
  LOGO_MARK_MERGED,
  LOGO_SHAPES,
  LOGO_VIEW_BOX,
} from './logo-paths'

/**
 * Логотип АРММАКС-СТРОЙ — гранёный знак «М» и надпись.
 *
 * Контуры лежат в logo-paths.ts и переносятся туда из фирменного файла
 * командой `npm run logo`. Здесь только то, как их рисовать.
 *
 * Два состояния, потому что знак объёмный:
 *
 * `surface="dark"` — на тёмной шапке и в подвале логотип идёт белым, как
 * в фирменном файле: грани залиты градиентами от белого к серо-синему,
 * и «М» читается объёмной.
 *
 * `surface="light"` — на светлой шапке те же градиенты почти сливаются
 * с фоном, поэтому знак берётся сплошным currentColor. Светотень уходит,
 * но «М» не теряется: она задана силуэтом — две стойки и провал между ними.
 *
 * В сплошном варианте грани знака слиты в один контур. Порознь каждая
 * сглаживается сама по себе, и на общих рёбрах остаются светлые волосяные
 * швы: два соседних контура закрывают пограничный пиксель наполовину
 * каждый, а не целиком. В градиентном варианте контуры остаются
 * раздельными — там грани и должны различаться по цвету.
 *
 * Идентификаторы градиентов разведены по размеру логотипа: на странице
 * одновременно живут мобильный, десктопный и подвальный, а повторяющийся
 * id в документе — уже не тот id. Поэтому один размер используется один раз.
 */

const HEIGHTS = {
  sm: 'h-[30px]',
  md: 'h-[38px]',
  lg: 'h-[52px]',
} as const

export function Logo({
  size = 'md',
  surface = 'dark',
}: {
  size?: 'sm' | 'md' | 'lg'
  surface?: 'dark' | 'light'
}) {
  const gid = `logo-${size}`

  return (
    <svg
      viewBox={LOGO_VIEW_BOX}
      className={`${HEIGHTS[size]} w-auto`}
      fill="currentColor"
      role="img"
      aria-label="АРММАКС-СТРОЙ"
    >
      {surface === 'dark' ? (
        <>
          {LOGO_SHAPES.map((shape) => (
            <path
              key={shape.d}
              d={shape.d}
              fill={'gradient' in shape ? `url(#${gid}-${shape.gradient})` : shape.color}
            />
          ))}

          <defs>
            {LOGO_GRADIENTS.map((gradient) => (
              <linearGradient
                key={gradient.id}
                id={`${gid}-${gradient.id}`}
                x1={gradient.coords.x1}
                y1={gradient.coords.y1}
                x2={gradient.coords.x2}
                y2={gradient.coords.y2}
                gradientUnits="userSpaceOnUse"
              >
                {gradient.stops.map((stop, i) => (
                  <stop key={i} offset={stop.offset} stopColor={stop.color} />
                ))}
              </linearGradient>
            ))}
          </defs>
        </>
      ) : (
        <>
          <path d={LOGO_MARK_MERGED} />
          {LOGO_SHAPES.slice(LOGO_MARK_COUNT).map((shape) => (
            <path key={shape.d} d={shape.d} />
          ))}
        </>
      )}
    </svg>
  )
}
