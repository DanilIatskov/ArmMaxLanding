/**
 * Готовит знаки заказчиков: images/clients/*.png → src/assets/clients/*.png.
 *
 * Присланные файлы — чёрные на прозрачном, с широкими пустыми полями вокруг
 * знака. В ленте высотой 28 точек эти поля съели бы почти всю высоту, и знаки
 * вышли бы разного оптического размера. Поэтому кадр обрезается по непрозрачным
 * пикселям, и все знаки приводятся к одной высоте.
 *
 * Прозрачность обязана сохраниться, поэтому PNG, а не JPEG: обычный конвейер
 * картинок (npm run images) сюда не годится, он переводит всё в JPEG.
 *
 * Запуск: npm run clients
 */
import fs from 'node:fs'
import path from 'node:path'
import { withChrome } from './logo-source.mjs'

const ROOT = path.join(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'images/clients')
const OUT = path.join(ROOT, 'src/assets/clients')

/** Высота готового файла: лента показывает 28 точек, берём запас на ретину. */
const HEIGHT = 160
/** Поля вокруг знака — чтобы он не упирался в край. */
const PAD = 0.04

const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.png'))
if (!files.length) throw new Error(`В ${SRC} нет ни одного png`)

fs.mkdirSync(OUT, { recursive: true })

await withChrome(9462, async (send) => {
  await send('Runtime.enable')

  for (const file of files) {
    const base64 = fs.readFileSync(path.join(SRC, file)).toString('base64')

    const res = await send('Runtime.evaluate', {
      awaitPromise: true,
      returnByValue: true,
      expression: `(async () => {
        const img = new Image()
        img.src = 'data:image/png;base64,${base64}'
        await img.decode()

        const frame = document.createElement('canvas')
        frame.width = img.width
        frame.height = img.height
        const ctx = frame.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(img, 0, 0)
        const px = ctx.getImageData(0, 0, frame.width, frame.height).data

        // Границы знака — по альфе: фон прозрачный, поэтому цвет не важен.
        let minX = frame.width, minY = frame.height, maxX = -1, maxY = -1
        for (let y = 0; y < frame.height; y++) {
          for (let x = 0; x < frame.width; x++) {
            if (px[(y * frame.width + x) * 4 + 3] > 12) {
              if (x < minX) minX = x
              if (x > maxX) maxX = x
              if (y < minY) minY = y
              if (y > maxY) maxY = y
            }
          }
        }
        if (maxX < 0) throw new Error('кадр пустой: непрозрачных пикселей нет')

        const w = maxX - minX + 1
        const h = maxY - minY + 1
        const pad = Math.round(h * ${PAD})
        const scale = ${HEIGHT} / (h + pad * 2)

        const out = document.createElement('canvas')
        out.width = Math.round((w + pad * 2) * scale)
        out.height = ${HEIGHT}
        const g = out.getContext('2d')
        g.imageSmoothingQuality = 'high'
        g.drawImage(img, minX - pad, minY - pad, w + pad * 2, h + pad * 2, 0, 0, out.width, out.height)

        return JSON.stringify({ png: out.toDataURL('image/png').split(',')[1], w: out.width, h: out.height })
      })()`,
    })

    if (res.result?.exceptionDetails) {
      throw new Error(`${file}: ${res.result.exceptionDetails.exception?.description ?? 'ошибка в канвасе'}`)
    }

    const { png, w, h } = JSON.parse(res.result.result.value)
    const dst = path.join(OUT, file)
    fs.writeFileSync(dst, Buffer.from(png, 'base64'))
    console.log(`${file.padEnd(28)} ${w}×${h}  ${(fs.statSync(dst).size / 1024).toFixed(0)} КБ`)
  }
})
