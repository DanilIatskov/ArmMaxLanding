'use client'

import { useState } from 'react'
import { ArrowButton } from './ArrowButton'
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

  // По кругу: с последнего этапа стрелка «вперёд» возвращает на первый.
  const go = (next: number) => setActive((next + services.length) % services.length)

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
                <StepTile index={active} onGo={go} />
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
function StepTile({ index, onGo }: { index: number; onGo: (next: number) => void }) {
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

      {/* Счётчик этапов: надпись, крупный номер и общее количество.
          Видно не только где ты сейчас, но и сколько всего осталось. */}
      <div className="absolute bottom-5 left-5 text-white">
        <p className="eyebrow text-white/75">Этап</p>

        <p className="mt-1 flex items-baseline gap-2.5">
          <span className="font-condensed text-[clamp(2.75rem,5.5vw,3.75rem)] leading-none font-bold">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-condensed text-[17px] leading-none font-normal text-white/50">
            / {String(services.length).padStart(2, '0')}
          </span>
        </p>
      </div>

      {/* Перелистывание в паре с номером: он слева внизу, стрелки справа. */}
      <div className="absolute right-5 bottom-5 flex gap-2.5">
        <ArrowButton
          tone="dark"
          direction="prev"
          label="Предыдущий этап"
          onClick={() => onGo(index - 1)}
        />
        <ArrowButton
          tone="dark"
          direction="next"
          label="Следующий этап"
          onClick={() => onGo(index + 1)}
        />
      </div>
    </div>
  )
}
