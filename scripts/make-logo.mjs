/**
 * Переносит контуры логотипа из images/logo.svg в src/components/logo-paths.ts.
 *
 * Компонент Logo.tsx пишется руками — в нём логика состояний. Данные же
 * (контуры и градиенты) занимают несколько килобайт и приходят от заказчика
 * готовым файлом, поэтому переписывать их вручную при каждой смене знака
 * бессмысленно и опасно: одна потерянная цифра ломает фигуру незаметно.
 *
 * Запуск: npm run logo (после — npm run favicon и npm run og)
 */
import fs from 'node:fs'
import path from 'node:path'
import { readLogo } from './logo-source.mjs'

const { viewBox, mark, word, root } = readLogo()

const svg = fs.readFileSync(path.join(root, 'images/logo.svg'), 'utf8')

// Градиенты: id укорачиваем до paintN — полный из Figma несёт номер кадра,
// который к делу не относится и меняется от экспорта к экспорту.
const gradients = [...svg.matchAll(/<linearGradient id="([^"]+)"([^>]*)>([\s\S]*?)<\/linearGradient>/g)].map(
  ([, id, attrs, body]) => ({
    id: id.replace(/_linear.*$/, ''),
    coords: Object.fromEntries(
      [...attrs.matchAll(/(\w+)="([^"]*)"/g)].map(([, k, v]) => [k, v]),
    ),
    stops: [...body.matchAll(/<stop([^>]*)\/>/g)].map(([, a]) => {
      const attr = Object.fromEntries([...a.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, k, v]) => [k, v]))
      // offset у первой точки в исходнике опущен: по спецификации это 0.
      // Пишем явно — иначе у контрольных точек разный набор полей, и вывод
      // типов в TSX спотыкается на отсутствующем свойстве.
      return { offset: attr.offset ?? '0', color: attr['stop-color'] }
    }),
  }),
)

const shortFill = (d) => {
  const m = svg.match(new RegExp(`<path d="${d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" fill="([^"]+)"`))
  const fill = m?.[1] ?? '#fff'
  return fill.startsWith('url(#') ? { gradient: fill.slice(5, -1).replace(/_linear.*$/, '') } : { color: fill }
}

const shapes = [...mark, ...word].map((d) => ({ d, ...shortFill(d) }))

const out = `// Сгенерировано: npm run logo. Руками не правим — правим images/logo.svg.
//
// Контуры фирменного логотипа. Первые ${mark.length} — грани знака «М»,
// остальные — надпись. Как это рисуется, смотри в Logo.tsx.

export const LOGO_VIEW_BOX = '${viewBox}'

/** Сколько контуров приходится на знак: остальное — надпись. */
export const LOGO_MARK_COUNT = ${mark.length}

/** Знак одним контуром — для сплошной заливки без швов на стыках граней. */
export const LOGO_MARK_MERGED = '${mark.join(' ')}'

export const LOGO_SHAPES = ${JSON.stringify(shapes, null, 2)} as const

export const LOGO_GRADIENTS = ${JSON.stringify(gradients, null, 2)} as const
`

fs.writeFileSync(path.join(root, 'src/components/logo-paths.ts'), out)
console.log(`Готово: src/components/logo-paths.ts — контуров ${shapes.length}, градиентов ${gradients.length}`)
