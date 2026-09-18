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
 * Шрифты для вёрстки превью — те же, что на сайте.
 *
 * Берём их из сборки, а не с Google Fonts: раньше вёрстка тянула стили
 * по сети, и когда запрос не проходил, кадр молча снимался запасным шрифтом.
 * Он шире фирменного, заголовок разъезжался на лишнюю строку, и заметить это
 * можно было только глазом на готовой картинке.
 *
 * next/font при сборке скачивает шрифты и кладёт рядом с CSS, поэтому здесь
 * достаточно собрать оттуда @font-face и развернуть относительные адреса
 * в абсолютные.
 */
function fontFaces(root) {
  const chunks = path.join(root, '.next/static/chunks')
  if (!fs.existsSync(chunks)) {
    throw new Error('Нет папки .next — сначала соберите проект: npm run build')
  }

  const rules = fs
    .readdirSync(chunks)
    .filter((f) => f.endsWith('.css'))
    .flatMap((f) => fs.readFileSync(path.join(chunks, f), 'utf8').match(/@font-face\{[^}]*\}/g) ?? [])
    .map((rule) => rule.replaceAll('../media/', 'file://' + path.join(root, '.next/static/media/')))

  if (!rules.length) {
    throw new Error('В .next не нашлось ни одного @font-face — пересоберите проект')
  }

  return `<style>${rules.join('')}</style>`
}

/**
 * Имя с номером не для красоты: соцсети кешируют превью по URL и надолго.
 * Заметно поменяли картинку — поднимаем номер здесь и в src/app/layout.tsx,
 * иначе в лентах ещё долго провисит старая.
 */
const OUTPUT = 'public/og-preview-2.jpg'

const { root, inline } = readLogo()

// Фон картинки тёмный — логотип идёт белым.
const logo = inline('class="logo" role="img" aria-label="АРММАКС-СТРОЙ"', '#ffffff')

const html = fs
  .readFileSync(path.join(root, 'images/og-preview.html'), 'utf8')
  .replaceAll('{{FONTS}}', fontFaces(root))
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
    await send('Runtime.enable')
    await send('Page.navigate', { url: 'file://' + tmp })

    // Проверяем не document.fonts.check — он отвечает «да», когда текст можно
    // отрисовать хоть чем-нибудь, в том числе запасным шрифтом. Меряем ширину:
    // узкий Roboto Condensed заметно уже системного гротеска, и если ширины
    // совпали, значит шрифт не применился.
    const ready = await send('Runtime.evaluate', {
      awaitPromise: true,
      returnByValue: true,
      expression: `(async () => {
        await document.fonts.ready
        const width = (family) => {
          const el = document.createElement('span')
          el.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:700 76px ' + family
          el.textContent = 'ТЕХНИЧЕСКИХ УСЛОВИЙ'
          document.body.appendChild(el)
          const w = el.offsetWidth
          el.remove()
          return w
        }
        for (let i = 0; i < 40; i++) {
          if (width('"Roboto Condensed", sans-serif') < width('sans-serif') * 0.92) return 'ok'
          await new Promise((r) => setTimeout(r, 250))
        }
        return 'fallback'
      })()`,
    })

    if (ready.result?.result?.value !== 'ok') {
      throw new Error('Фирменный шрифт не применился — картинка вышла бы запасным. Пересоберите проект (npm run build) и повторите.')
    }

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
