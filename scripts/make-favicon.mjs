/**
 * Собирает фавикон из вектора логотипа: images/logo.svg
 * → src/app/icon.png (256×256) и src/app/apple-icon.png (180×180).
 *
 * Берётся только знак «М», без надписи: на вкладке 16×16 от слова остаётся
 * серая полоска. Знак кадрируется по своему габариту с полями в 10% —
 * в исходнике вокруг него пустое место под надпись, и без обрезки знак
 * ужался бы до нескольких пикселей.
 *
 * Знак берётся фирменный, с градиентами, и кладётся на тёмный квадрат —
 * тот же цвет, что у themeColor сайта. На светлом фоне эти градиенты
 * почти сливались бы с ним, а на тёмном знак читается как в оригинале.
 *
 * ImageMagick и PIL в проекте нет, поэтому рисует headless Chrome.
 *
 * Запуск: npm run favicon
 */
import fs from 'node:fs'
import path from 'node:path'
import { readLogo, bounds, withChrome } from './logo-source.mjs'

/** Тот же тёмный, что в viewport.themeColor. */
const BACKDROP = '#0b1028'
const PAD = 0.1

const { mark, markElements, defs, root } = readLogo()
const box = bounds(mark)

// Квадрат по большей стороне: иначе знак растянет.
const side = Math.max(box.width, box.height)
const pad = side * PAD
const size = side + pad * 2
const viewBox = [
  box.minX - (size - box.width) / 2,
  box.minY - (size - box.height) / 2,
  size,
  size,
].join(' ')

const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="512" height="512">
<rect x="${box.minX - size}" y="${box.minY - size}" width="${size * 3}" height="${size * 3}" fill="${BACKDROP}"/>
${markElements.join('\n')}
${defs}
</svg>`

const files = await withChrome(9360, async (send) => {
  await send('Page.enable')
  await send('Runtime.enable')

  const render = async (px) => {
    await send('Emulation.setDeviceMetricsOverride', { width: px, height: px, deviceScaleFactor: 1, mobile: false })
    const page = `<body style="margin:0">${markup.replace('width="512" height="512"', `width="${px}" height="${px}"`)}</body>`
    await send('Page.navigate', { url: 'data:text/html;charset=utf-8,' + encodeURIComponent(page) })
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
