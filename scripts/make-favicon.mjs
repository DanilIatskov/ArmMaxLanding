/**
 * Собирает фавикон из присланного оригинала логотипа: images/logo.jpg
 * → src/app/icon.png (256×256) и src/app/apple-icon.png (180×180).
 *
 * Зачем скрипт, а не ручной кроп: в оригинале знак занимает чуть больше
 * половины кадра, и в поле вкладки 16×16 от него осталось бы несколько
 * пикселей краски. Границы знака ищутся по пикселям, кадр обрезается по ним,
 * поля — 10%. Так знак читается на вкладке и остаётся фирменным один в один.
 *
 * ImageMagick и PIL в проекте нет, поэтому обрезка и пересчёт идут в canvas
 * внутри headless Chrome — он и так нужен для съёмки превью ссылок.
 *
 * Запуск: npm run favicon
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.join(import.meta.dirname, '..')
const SOURCE = path.join(ROOT, 'images/logo.jpg')
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9334

if (!fs.existsSync(SOURCE)) {
  console.error(`Нет исходника: ${SOURCE}`)
  process.exit(1)
}

const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  '--disable-gpu',
  'about:blank',
], { stdio: 'ignore' })

// Ждём, пока Chrome поднимет отладочный порт: сразу после spawn его ещё нет.
let targets
for (let attempt = 0; attempt < 40; attempt++) {
  await new Promise((r) => setTimeout(r, 250))
  try {
    targets = await (await fetch(`http://localhost:${PORT}/json/list`)).json()
    if (targets.some((t) => t.type === 'page')) break
  } catch {}
}
if (!targets?.some((t) => t.type === 'page')) {
  chrome.kill()
  throw new Error('Chrome не поднялся')
}

const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl)
await new Promise((r) => { ws.onopen = r })

let id = 0
const pending = new Map()
ws.onmessage = (m) => {
  const data = JSON.parse(m.data)
  if (pending.has(data.id)) {
    pending.get(data.id)(data)
    pending.delete(data.id)
  }
}
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id
    pending.set(i, r)
    ws.send(JSON.stringify({ id: i, method, params }))
  })

await send('Runtime.enable')

const base64 = fs.readFileSync(SOURCE).toString('base64')
const response = await send('Runtime.evaluate', {
  awaitPromise: true,
  returnByValue: true,
  expression: `(async () => {
    const img = new Image()
    img.src = 'data:image/jpeg;base64,${base64}'
    await img.decode()

    const frame = document.createElement('canvas')
    frame.width = img.width
    frame.height = img.height
    const ctx = frame.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(img, 0, 0)
    const px = ctx.getImageData(0, 0, frame.width, frame.height).data

    // Границы знака — всё, что заметно темнее фона. Порог 245, а не 255:
    // JPEG размывает белый до ~250, но краска знака сильно ниже.
    let minX = frame.width, minY = frame.height, maxX = -1, maxY = -1
    for (let y = 0; y < frame.height; y++) {
      for (let x = 0; x < frame.width; x++) {
        const i = (y * frame.width + x) * 4
        if (px[i] < 245 || px[i + 1] < 245 || px[i + 2] < 245) {
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
    }
    if (maxX < 0) throw new Error('Знак не найден: кадр целиком светлее порога')

    // Кадрируем квадратом по большей стороне — иначе знак растянет.
    const markWidth = maxX - minX + 1
    const markHeight = maxY - minY + 1
    const side = Math.max(markWidth, markHeight)
    const box = side + Math.round(side * 0.10) * 2
    const sx = minX - (box - markWidth) / 2
    const sy = minY - (box - markHeight) / 2

    const render = (size) => {
      const out = document.createElement('canvas')
      out.width = out.height = size
      const g = out.getContext('2d')
      g.imageSmoothingQuality = 'high'
      // Оригинал — JPEG без прозрачности: подкладываем тот же белый,
      // иначе по краям знака полезет чёрный фон канваса.
      g.fillStyle = '#ffffff'
      g.fillRect(0, 0, size, size)
      g.drawImage(img, sx, sy, box, box, 0, 0, size, size)
      return out.toDataURL('image/png').split(',')[1]
    }

    return JSON.stringify({
      mark: { minX, minY, maxX, maxY, box },
      icon: render(256),
      appleIcon: render(180),
    })
  })()`,
})

ws.close()
chrome.kill()

if (response.result?.exceptionDetails) {
  throw new Error(response.result.exceptionDetails.exception?.description ?? 'Ошибка в канвасе')
}

const result = JSON.parse(response.result.result.value)
fs.writeFileSync(path.join(ROOT, 'src/app/icon.png'), Buffer.from(result.icon, 'base64'))
fs.writeFileSync(path.join(ROOT, 'src/app/apple-icon.png'), Buffer.from(result.appleIcon, 'base64'))

console.log(`Знак в оригинале: ${JSON.stringify(result.mark)}`)
console.log('Готово: src/app/icon.png (256), src/app/apple-icon.png (180)')
