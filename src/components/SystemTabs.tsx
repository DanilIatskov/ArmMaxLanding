'use client'

import { useState } from 'react'
import { ArrowLink } from './ArrowLink'
import Image from 'next/image'
import { Marker } from './Marker'
import { services } from '@/content/services'

/**
 * «Комплекс АРММАКС» — блок How we build с сайта Suffolk:
 * слева список этапов-вкладок, справа панель с раскрытием выбранного.
 */
export function SystemTabs() {
  const [active, setActive] = useState(0)
  const service = services[active]

  return (
    <section className="bg-surface-muted py-16 md:py-section">
      <div className="mx-auto w-full max-w-[1680px] px-5 lg:px-14">
        <header className="max-w-3xl">
          <p className="eyebrow flex items-center gap-3 text-body-soft">
            <Marker />
            Комплекс АРММАКС
          </p>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,4rem)] leading-[1]">Как мы строим</h2>
        </header>

        <div className="mt-12 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div role="tablist" aria-label="Этапы комплекса" className="flex flex-col">
              {services.map((item, i) => {
                const selected = i === active
                return (
                  <button
                    key={item.slug}
                    role="tab"
                    id={`system-tab-${i}`}
                    aria-selected={selected}
                    aria-controls="system-panel"
                    onClick={() => setActive(i)}
                    className={`flex items-start gap-3 border-b py-4 text-left text-[15px] leading-snug transition-colors ${
                      selected
                        ? 'border-brand-500 font-bold text-ink-900'
                        : 'border-line text-body hover:text-ink-900'
                    }`}
                  >
                    <Marker tone={selected ? 'accent' : 'muted'} className="mt-1" />
                    {item.title}
                  </button>
                )
              })}
            </div>

            <div className="mt-10">
              <ArrowLink href="/uslugi">Все услуги комплекса</ArrowLink>
            </div>
          </div>

          <div
            role="tabpanel"
            id="system-panel"
            aria-labelledby={`system-tab-${active}`}
            className="lg:col-span-8"
          >
            <div className="grid gap-8 sm:grid-cols-12 sm:gap-10">
              <div className="sm:col-span-5">
                <StepTile index={active} />
              </div>

              <div className="flex flex-col sm:col-span-7">
                <p className="eyebrow text-brand-500">
                  Этап {String(active + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-4 text-2xl leading-snug">{service.title}</h3>
                <p className="mt-5 text-[15px] leading-relaxed">{service.short}</p>

                <ul className="mt-7 space-y-2.5">
                  {service.bullets.slice(0, 4).map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-body-soft">
                      <Marker tone="muted" className="mt-1.5 h-1.5 w-1.5" />
                      {bullet}
                    </li>
                  ))}
                </ul>

                <div className="mt-9">
                  <ArrowLink href={`/uslugi/${service.slug}`}>Подробнее об этапе</ArrowLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Кадр этапа с номером поверх. */
function StepTile({ index }: { index: number }) {
  const service = services[index]

  // 9:12 — оно же 3:4. Исходники горизонтальные (4:3), так что кадр режется
  // по бокам: в рамку попадает около 56% ширины по центру.
  return (
    <div className="relative aspect-[3/4] overflow-hidden bg-ink-900">
      <Image
        // key на слаге перезапускает проявление кадра при смене вкладки.
        key={service.slug}
        src={service.image}
        alt={service.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="rise object-cover"
      />

      {/* Затемнение снизу: без него номер тонет в светлых кадрах. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />

      {/* Номер в квадратной рамке — тот же мотив, что у маркеров по всей вёрстке.
          Рамка обводится при смене вкладки, как полоса прогресса в слайдере
          первого экрана. Периметр 152 = 4 × 38 при стороне 38 в системе 40×40. */}
      <span className="absolute bottom-5 left-5 flex size-14 items-center justify-center text-white lg:size-16">
        <svg viewBox="0 0 40 40" className="absolute inset-0 size-full" aria-hidden>
          <rect x="1" y="1" width="38" height="38" fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1} />
          <rect
            // key перезапускает обводку на каждом этапе.
            key={service.slug}
            className="ring-draw"
            x="1"
            y="1"
            width="38"
            height="38"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            style={{ '--len': 152 } as React.CSSProperties}
          />
        </svg>
        <span className="font-condensed text-[20px] leading-none font-normal lg:text-[24px]">
          {String(index + 1).padStart(2, '0')}
        </span>
      </span>
    </div>
  )
}
