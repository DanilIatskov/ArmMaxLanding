/**
 * Собирает картинку превью для ссылок: images/og-preview.html
 * → public/og-preview.jpg (1200×630).
 *
 * Логотип подставляется прямо из images/logo.svg, чтобы превью не разъезжалось
 * с сайтом при смене знака.
 *
 * Запуск: npm run og
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { readLogo, withChrome } from './logo-source.mjs'

/**
 * Имя с номером не для красоты: соцсети кешируют превью по URL и надолго.
 * Заметно поменяли картинку — поднимаем номер здесь и в src/app/layout.tsx,
 * иначе в лентах ещё долго провисит старая.
 */
const OUTPUT = 'public/og-preview-2.jpg'

const { root, inline } = readLogo()

// Фон картинки тёмный, поэтому логотип идёт ровно как в фирменном файле —
// с градиентами. Сплошной вариант нужен только на светлом.
const logo = inline('class="logo" role="img" aria-label="ARMMAX STROY"')

const html = fs
  .readFileSync(path.join(root, 'images/og-preview.html'), 'utf8')
  .replaceAll('{{ROOT}}', 'file://' + root)
  .replaceAll('{{LOGO}}', logo)

const tmp = path.join(root, 'images/.og-preview.built.html')
fs.writeFileSync(tmp, html)

const png = path.join(root, 'images/.og-preview.png')
const jpg = path.join(root, OUTPUT)

try {
  const shot = await withChrome(9362, async (send) => {
    await send('Page.enable')
    await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false })
    await send('Page.navigate', { url: 'file://' + tmp })
    // Шрифты подгружаются с Google Fonts: без паузы кадр снимается запасным.
    await new Promise((r) => setTimeout(r, 4000))
    const res = await send('Page.captureScreenshot', { format: 'png' })
    return Buffer.from(res.result.data, 'base64')
  })

  fs.writeFileSync(png, shot)
  // JPEG вместо PNG: фотография под текстом, PNG тяжелее втрое без выигрыша.
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', png, '--out', jpg], { stdio: 'ignore' })
  console.log(`Готово: ${OUTPUT}, ${(fs.statSync(jpg).size / 1024).toFixed(0)} КБ`)
} finally {
  fs.rmSync(tmp, { force: true })
  fs.rmSync(png, { force: true })
}
