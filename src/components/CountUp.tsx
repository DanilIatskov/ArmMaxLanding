'use client'

import { useCallback, useRef, useState } from 'react'

/**
 * Отсчёт числа от нуля, когда ячейка попадает в кадр.
 *
 * Значение приходит строкой («25», «300+»), потому что у него бывает
 * приставка и хвост: отсчитываем только числовую часть, остальное
 * стоит на месте.
 *
 * На сервере и до запуска в разметке лежит итоговое значение — так его
 * видят поисковики и читает скринридер, даже если анимация не выполнится.
 * Подмена на ноль происходит в ref-колбэке, то есть до отрисовки кадра,
 * и внутри <Reveal>, который в этот момент ещё прозрачен, поэтому
 * подмены не видно.
 */

const PARTS = /^(\D*)(\d+)(.*)$/

export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const parsed = value.match(PARTS)
  const target = parsed ? Number(parsed[2]) : null

  const [current, setCurrent] = useState<number | null>(null)
  const frame = useRef<number | null>(null)

  const ref = useCallback(
    (node: HTMLSpanElement | null) => {
      if (!node || target === null) return

      // Просили меньше движения — показываем итог сразу.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      if (typeof IntersectionObserver === 'undefined') return

      setCurrent(0)

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          observer.disconnect()

          const startedAt = performance.now()
          const tick = (now: number) => {
            const t = Math.min(1, (now - startedAt) / duration)
            // easeOutCubic: быстрый разгон и мягкая остановка на итоговом числе.
            const eased = 1 - Math.pow(1 - t, 3)
            setCurrent(Math.round(target * eased))
            if (t < 1) frame.current = requestAnimationFrame(tick)
          }
          frame.current = requestAnimationFrame(tick)
        },
        { rootMargin: '0px 0px -15% 0px' },
      )

      observer.observe(node)

      return () => {
        observer.disconnect()
        if (frame.current) cancelAnimationFrame(frame.current)
      }
    },
    [target, duration],
  )

  if (!parsed || target === null) return <>{value}</>

  const [, prefix, , suffix] = parsed

  return (
    <span ref={ref}>
      {prefix}
      {/* Моноширинные цифры: число растёт, а соседние знаки не дёргаются. */}
      <span className="tabular-nums">{current ?? target}</span>
      {suffix}
    </span>
  )
}
