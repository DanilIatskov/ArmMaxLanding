/**
 * Разбор images/logo.svg — общий для сборки фавикона и картинки превью.
 *
 * Логотип лежит одним файлом на восемь контуров: шесть на гранёный знак «М»
 * и два на надпись. Заливки в исходнике — градиенты от белого к серо-синему;
 * и фавикону, и превью нужен один сплошной цвет, поэтому берём только
 * геометрию.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.join(import.meta.dirname, '..')
const SVG = path.join(ROOT, 'images/logo.svg')

const MARK_PATHS = 6

export function readLogo() {
  const svg = fs.readFileSync(SVG, 'utf8')
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1]
  const paths = [...svg.matchAll(/<path d="([^"]+)" fill="[^"]+"\s*\/>/g)].map((m) => m[1])
  // Те же контуры целиком, с фирменными заливками, и блок градиентов к ним.
  const elements = svg.match(/<path d="[^"]+" fill="[^"]+"\s*\/>/g) ?? []
  const defs = svg.match(/<defs>[\s\S]*<\/defs>/)?.[0] ?? ''

  if (!viewBox || paths.length <= MARK_PATHS) {
    throw new Error(`images/logo.svg разобрать не удалось: контуров ${paths.length}, viewBox ${viewBox}`)
  }

  return {
    viewBox,
    mark: paths.slice(0, MARK_PATHS),
    word: paths.slice(MARK_PATHS),
    root: ROOT,
    /** Контуры знака с фирменными градиентами и сами градиенты. */
    markElements: elements.slice(0, MARK_PATHS),
    defs,
    /** Исходник целиком, без внешних width/height — для вставки в вёрстку. */
    inline: (attrs = '') =>
      svg.replace(/<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" ${attrs}>`),
  }
}

/** Габарит набора контуров — чтобы кадрировать знак без ручных замеров. */
export function bounds(paths) {
  const nums = paths.join(' ').match(/-?\d+(\.\d+)?/g)?.map(Number) ?? []
  // В этих контурах только прямые: команды M/L/V/H/Z, поэтому числа идут
  // парами координат, кроме V и H. Разбираем команды, а не поток чисел.
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const d of paths) {
    let x = 0, y = 0
    for (const [, cmd, args] of d.matchAll(/([MLVHZ])([^MLVHZ]*)/gi)) {
      const v = args.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? []
      const upper = cmd.toUpperCase()
      if (upper === 'M' || upper === 'L') {
        for (let i = 0; i + 1 < v.length; i += 2) { x = v[i]; y = v[i + 1]; track() }
      } else if (upper === 'V') {
        for (const n of v) { y = n; track() }
      } else if (upper === 'H') {
        for (const n of v) { x = n; track() }
      }
      function track() {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (!nums.length || minX === Infinity) throw new Error('габарит знака посчитать не удалось')
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY }
}

/** Общий запуск headless Chrome: он нужен обоим скриптам. */
export async function withChrome(port, fn) {
  const { spawn } = await import('node:child_process')
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new', `--remote-debugging-port=${port}`, '--disable-gpu', '--hide-scrollbars', 'about:blank',
  ], { stdio: 'ignore' })

  let targets
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 250))
    try {
      targets = await (await fetch(`http://localhost:${port}/json/list`)).json()
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
    if (pending.has(data.id)) { pending.get(data.id)(data); pending.delete(data.id) }
  }
  const send = (method, params = {}) => new Promise((r) => {
    const i = ++id
    pending.set(i, r)
    ws.send(JSON.stringify({ id: i, method, params }))
  })

  try {
    return await fn(send)
  } finally {
    ws.close()
    chrome.kill()
  }
}
