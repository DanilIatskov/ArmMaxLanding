/**
 * Собирает фавикон из вектора логотипа: images/logo.svg
 * → src/app/icon.png (256×256) и src/app/apple-icon.png (180×180).
 *
 * Берётся только знак «М», без надписи: на вкладке 16×16 от слова остаётся
 * серая полоска. Знак белый на тёмном квадрате — том же цвете, что
 * у viewport.themeColor.
 *
 * Знак кадрируется по своему габариту с полями в 12%: в общем файле вокруг
 * него пустое место под надпись, и без обрезки он ужался бы до нескольких
 * пикселей. Габарит меряется браузером — у контуров есть кривые и своя
 * трансформация, по числам это не восстановить.
 *
 * ImageMagick и PIL в проекте нет, поэтому рисует headless Chrome.
 *
 * Запуск: npm run favicon
 */
import fs from 'node:fs'
import path from 'node:path'
import { readLogo, measureGroup, withChrome } from './logo-source.mjs'

/** Тот же тёмный, что в viewport.themeColor. */
const BACKDROP = '#0b1028'
const PAD = 0.12

const { mark, root } = readLogo()
const box = await measureGroup(9390, 'mark')

// Квадрат по большей стороне: иначе знак растянет.
const side = Math.max(box.width, box.height)
const size = side * (1 + PAD * 2)
const viewBox = [
  box.x - (size - box.width) / 2,
  box.y - (size - box.height) / 2,
  size,
  size,
].join(' ')

const draw = (px) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${px}" height="${px}">
<rect x="${box.x - size}" y="${box.y - size}" width="${size * 3}" height="${size * 3}" fill="${BACKDROP}"/>
<g transform="${mark.transform}" fill="#ffffff">
${mark.paths.map((d) => `<path d="${d}"/>`).join('\n')}
</g>
</svg>`

const files = await withChrome(9391, async (send) => {
  await send('Page.enable')

  const render = async (px) => {
    await send('Emulation.setDeviceMetricsOverride', { width: px, height: px, deviceScaleFactor: 1, mobile: false })
    await send('Page.navigate', {
      url: 'data:text/html;charset=utf-8,' + encodeURIComponent(`<body style="margin:0">${draw(px)}</body>`),
    })
    await new Promise((r) => setTimeout(r, 600))
    const shot = await send('Page.captureScreenshot', { format: 'png' })
    return Buffer.from(shot.result.data, 'base64')
  }

  return { icon: await render(256), apple: await render(180) }
})

fs.writeFileSync(path.join(root, 'src/app/icon.png'), files.icon)
fs.writeFileSync(path.join(root, 'src/app/apple-icon.png'), files.apple)

console.log(`Габарит знака: ${JSON.stringify(box)}`)
console.log('Готово: src/app/icon.png (256), src/app/apple-icon.png (180)')
