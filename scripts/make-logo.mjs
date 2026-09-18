/**
 * Переносит контуры логотипа из images/logo.svg в src/components/logo-paths.ts.
 *
 * Компонент Logo.tsx пишется руками — в нём логика отрисовки. Данные же
 * приходят от заказчика готовым файлом и занимают несколько килобайт:
 * переписывать их вручную при каждой замене знака бессмысленно и опасно —
 * одна потерянная цифра ломает фигуру незаметно.
 *
 * Запуск: npm run logo (после — npm run favicon и npm run og)
 */
import fs from 'node:fs'
import path from 'node:path'
import { readLogo } from './logo-source.mjs'

const { viewBox, mark, word, root } = readLogo()

const out = `// Сгенерировано: npm run logo. Руками не правим — правим images/logo.svg.
//
// Контуры фирменного логотипа: знак «М» и надпись АРММАКС / СТРОЙ.
// Как это рисуется, смотри в Logo.tsx.

export const LOGO_VIEW_BOX = '${viewBox}'

/** Знак: гранёная «М» с полосами. Стоит слева от надписи. */
export const LOGO_MARK = ${JSON.stringify(mark, null, 2)} as const

/** Надпись в две строки. */
export const LOGO_WORD = ${JSON.stringify(word, null, 2)} as const
`

fs.writeFileSync(path.join(root, 'src/components/logo-paths.ts'), out)
console.log(`Готово: src/components/logo-paths.ts — знак ${mark.paths.length} контуров, надпись ${word.paths.length}`)
