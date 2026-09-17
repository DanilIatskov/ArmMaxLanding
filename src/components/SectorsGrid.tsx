import Link from 'next/link'
import { ArrowLink } from './ArrowLink'
import { FacetTile } from './FacetTile'
import { Marker } from './Marker'
import { Reveal } from './Reveal'
import { sectors } from '@/content/sectors'

/**
 * Тёмный блок с сеткой направлений — приём Skender «Expertise for every market».
 * Каждая строка подчёркнута и работает как ссылка: под эти формулировки
 * позже встанут посадочные страницы под запросы вида «[объект] Новосибирск».
 *
 * Справа от заголовка пустовало место — туда уходит гранёная стена,
 * обрезанная краем экрана. Она приглушена маской и не спорит с текстом,
 * но грани в ней продолжают дышать, так что блок не выглядит мёртвым.
 */
export function SectorsGrid() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-16 text-white md:py-section">
      {/* Маска гасит стену к центру, поэтому она читается как уходящая
          за край, а не как приклеенный прямоугольник. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 hidden h-full w-[38%] opacity-40 [mask-image:linear-gradient(to_left,black_35%,transparent)] lg:block"
      >
        <FacetTile seed={5} cells={6} className="h-full w-full" />
      </div>

      <div className="relative mx-auto w-full max-w-[1680px] px-5 lg:px-14">
        <Reveal>
          <header className="max-w-4xl">
            <p className="eyebrow flex items-center gap-3 text-white/50">
              <Marker />
              Что строим
            </p>
            <h2 className="mt-6 text-[clamp(2rem,5vw,4.5rem)] leading-[1] text-white">
              Объекты капитального строительства
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60">
              Берёмся за объекты от 300 млн рублей и ведём их целиком. Дачное строительство —
              не наш профиль, и мы говорим об этом сразу.
            </p>
          </header>
        </Reveal>

        <Reveal delay={120}>
          <ul className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {sectors.map((sector) => (
              <li key={sector} className="flex">
                <Link
                  href="/kontakty#zayavka"
                  className="group flex h-full w-full items-end justify-between gap-4 border-b border-white/20 pt-5 pb-4 text-[clamp(1.05rem,1.6vw,1.4rem)] leading-snug font-semibold tracking-[-0.01em] text-white transition-colors hover:border-accent-500"
                >
                  {sector}
                  <span
                    aria-hidden
                    className="translate-x-0 text-accent-500 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-14">
          <ArrowLink href="/kontakty#zayavka" tone="light">
            Обсудить объект
          </ArrowLink>
        </div>
      </div>
    </section>
  )
}
