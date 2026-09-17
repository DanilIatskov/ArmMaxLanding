'use client'

import Image from 'next/image'
import heroStroyka from '@/assets/hero-stroyka.jpg'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Marker } from './Marker'
import { company } from '@/content/company'
import { SLIDE_DURATION_MS, slides } from '@/content/slides'

/**
 * Первый экран — слайдер по макету (Figma 4:4386).
 *
 * Заголовок каждого слайда набран смешанными начертаниями в одном абзаце:
 * Bold на утверждении, Regular на пояснении (Figma 10:9523). Кнопки —
 * 10:9525. Внизу вкладки по 278px: полоса прогресса, номер и подпись;
 * неактивные приглушены, активная заполняет полосу за время показа.
 *
 * Автопрокрутка останавливается на наведении и фокусе внутри слайдера,
 * а при `prefers-reduced-motion` не запускается вовсе — иначе экран
 * уезжает из-под человека, который не успел дочитать.
 */
export function Hero() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [autoplay, setAutoplay] = useState(false)

  const go = useCallback((next: number) => {
    setActive((next + slides.length) % slides.length)
  }, [])

  // Автопрокрутку включаем только после монтирования и только если человек
  // не просил убрать анимацию.
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setAutoplay(!media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (!autoplay || paused) return
    const timer = setTimeout(() => go(active + 1), SLIDE_DURATION_MS)
    return () => clearTimeout(timer)
  }, [active, autoplay, paused, go])

  const slide = slides[active]

  return (
    <section
      className="relative flex min-h-[92svh] flex-col overflow-hidden bg-ink-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <HeroBackdrop />

      <div className="relative flex flex-1 items-center pt-32 pb-12 lg:pt-36">
        <div className="mx-auto w-full max-w-[1680px] px-5 lg:px-14">
          <p className="eyebrow flex items-center gap-3 text-white/60">
            <Marker />
            {company.city} · {company.region}
          </p>

          {/* key перезапускает подъём на каждом слайде. */}
          <div key={active}>
            <h1 className="rise font-condensed mt-8 text-[clamp(2rem,4.5vw,4.5rem)] leading-[1.06] font-bold tracking-[-0.007em] text-white uppercase lg:max-w-[min(1150px,72vw)]">
              {slide.lead}{' '}
              <span className="font-normal">{slide.rest}</span>
            </h1>

            <div className="rise mt-8 flex flex-wrap gap-4" style={{ animationDelay: '160ms' }}>
              {slide.actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`font-condensed flex h-9 items-center px-4 text-[16px] font-bold tracking-[0.02em] text-white uppercase transition-colors ${
                    action.tone === 'accent'
                      ? 'bg-brand-500 hover:bg-brand-400'
                      : 'bg-ink-800 hover:bg-ink-700'
                  }`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SlideNav active={active} paused={paused} autoplay={autoplay} onGo={go} />
    </section>
  )
}

function SlideNav({
  active,
  paused,
  autoplay,
  onGo,
}: {
  active: number
  paused: boolean
  autoplay: boolean
  onGo: (next: number) => void
}) {
  return (
    <div className="relative">
      <div className="mx-auto flex w-full max-w-[1680px] items-center gap-8 px-5 pt-6 pb-12 lg:gap-[60px] lg:px-14 lg:pt-8 lg:pb-20">
        <div role="tablist" aria-label="Слайды" className="flex min-w-0 flex-1 gap-[25px]">
          {slides.map((slide, i) => {
            const current = i === active
            return (
              <button
                key={slide.tab}
                role="tab"
                aria-selected={current}
                onClick={() => onGo(i)}
                className={`flex max-w-[278px] flex-1 flex-col text-left transition-opacity duration-300 ${
                  current ? 'opacity-100' : 'opacity-60 hover:opacity-85'
                } ${current ? '' : 'hidden md:flex'}`}
              >
                <span className="relative block h-px w-full bg-white/50">
                  {current && (
                    <span
                      // key перезапускает заливку полосы с началом слайда.
                      key={active}
                      className="slide-progress absolute top-[-2px] left-0 block h-[5px] w-full bg-accent-500"
                      style={{
                        animationDuration: `${SLIDE_DURATION_MS}ms`,
                        animationPlayState: paused || !autoplay ? 'paused' : 'running',
                      }}
                    />
                  )}
                </span>

                <span className="font-condensed mt-3 block text-[22px] leading-none font-bold tracking-[-0.03em] text-white">
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <span className="font-condensed mt-2 block truncate text-[16px] leading-tight font-normal tracking-[-0.02em] text-white lg:text-[18px]">
                  {slide.tab}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <ArrowButton label="Предыдущий слайд" onClick={() => onGo(active - 1)} direction="prev" />
          <ArrowButton label="Следующий слайд" onClick={() => onGo(active + 1)} direction="next" />
        </div>
      </div>
    </div>
  )
}

function ArrowButton({
  label,
  onClick,
  direction,
}: {
  label: string
  onClick: () => void
  direction: 'prev' | 'next'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full border border-white/70 text-white transition-colors hover:border-white hover:bg-white hover:text-ink-900 lg:size-10"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-4 lg:size-[18px]" aria-hidden>
        <path
          d={direction === 'prev' ? 'M15 4l-8 8 8 8' : 'M9 4l8 8-8 8'}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  )
}

/**
 * Фон первого экрана — снимок стройки в фирменной синеве, с огранкой
 * прямо в кадре. Левая часть тёмная, поэтому заголовок читается поверх неё
 * без тяжёлой заливки: хватает мягкого градиента.
 *
 * `priority` здесь обязателен — это самый крупный элемент первого экрана,
 * и без него он грузится последним и портит LCP.
 *
 * Снимок импортируется статически: в имени файла оказывается хеш содержимого,
 * поэтому после замены адрес меняется сам и старый кадр не залипает в кэше.
 */
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-ink-950">
      <Image
        src={heroStroyka}
        alt=""
        fill
        priority
        sizes="100vw"
        // На узком экране кадрируем вправо: там кран и корпус, а центр — пустая застройка.
        className="object-cover object-right md:object-center"
      />

      {/* На широком экране текст занимает левую треть — там и затемняем.
          На узком он идёт во всю ширину, и градиент слева направо просто
          закрыл бы снимок целиком, поэтому там ровная вуаль. */}
      <div className="absolute inset-0 bg-ink-950/65 md:hidden" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-ink-950/85 via-ink-950/45 to-ink-950/10 md:block" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink-950 to-transparent" />
    </div>
  )
}
