/**
 * Разбор images/logo.svg — общий для вёрстки, фавикона и картинки превью.
 *
 * Логотип лежит одним файлом из двух групп: `mark` — гранёный знак «М»,
 * `word` — надпись АРММАКС / СТРОЙ. По этим группам скрипты его и делят:
 * фавикону нужен только знак, остальным — всё целиком.
 *
 * Делим именно по группам, а не по числу контуров: знак уже менялся, и число
 * контуров в нём поменялось с шести на четыре. Группа переживёт и следующую
 * замену.
 *
 * Заливка в исходнике условная и везде переопределяется: логотип одноцветный
 * и красится снаружи.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.join(import.meta.dirname, '..')
const SVG = path.join(ROOT, 'images/logo.svg')

function group(svg, id) {
  const m = svg.match(new RegExp(`<g id="${id}"([^>]*)>([\\s\\S]*?)</g>`))
  if (!m) throw new Error(`В images/logo.svg нет группы "${id}"`)
  return {
    transform: m[1].match(/transform="([^"]+)"/)?.[1] ?? '',
    paths: [...m[2].matchAll(/<path d="([^"]+)"/g)].map((p) => p[1]),
  }
}

export function readLogo() {
  const svg = fs.readFileSync(SVG, 'utf8')
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1]
  if (!viewBox) throw new Error('В images/logo.svg нет viewBox')

  const mark = group(svg, 'mark')
  const word = group(svg, 'word')

  return {
    viewBox,
    mark,
    word,
    root: ROOT,
    /** Разметка логотипа заданным цветом — для вставки в вёрстку превью. */
    inline: (attrs = '', color = 'currentColor') =>
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="${color}" ${attrs}>` +
      [mark, word]
        .map((g) => `<g transform="${g.transform}">${g.paths.map((d) => `<path d="${d}"/>`).join('')}</g>`)
        .join('') +
      '</svg>',
  }
}

/** Общий запуск headless Chrome: он нужен и фавикону, и превью. */
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

/**
 * Габарит группы в координатах всего логотипа.
 *
 * Считаем браузером, а не разбором чисел в контурах: у знака есть кривые
 * и своя трансформация, по числам это не восстановить. getBBox на самой
 * группе вернул бы размер до трансформации, поэтому спрашиваем родителя.
 */
export async function measureGroup(port, which) {
  const { viewBox, mark, word } = readLogo()
  const g = which === 'mark' ? mark : word
  const html = `<body style="margin:0"><svg viewBox="${viewBox}" width="800"><g id="probe">` +
    `<g transform="${g.transform}">${g.paths.map((d) => `<path d="${d}"/>`).join('')}</g>` +
    `</g></svg></body>`

  return withChrome(port, async (send) => {
    await send('Page.enable')
    await send('Runtime.enable')
    await send('Page.navigate', { url: 'data:text/html;charset=utf-8,' + encodeURIComponent(html) })
    await new Promise((r) => setTimeout(r, 800))
    const res = await send('Runtime.evaluate', {
      expression: `(()=>{const b=document.getElementById('probe').getBBox();return JSON.stringify({x:b.x,y:b.y,width:b.width,height:b.height})})()`,
      returnByValue: true,
    })
    return JSON.parse(res.result.result.value)
  })
}
