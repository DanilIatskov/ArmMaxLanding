'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ArrowButton } from './ArrowButton'
import { Marker } from './Marker'
import { ButtonLink } from './ui'
import { projects } from '@/content/projects'

/**
 * «Где работала команда» — горизонтальная гармошка объектов.
 *
 * Обычная сетка из восьми одинаковых плиток проигрывала в главном: снимки
 * в ней мелкие, и опыт компании читался как список, а не как портфолио.
 * Здесь один объект раскрыт крупно, остальные стоят справа сложенной
 * гармошкой, и человек буквально листает опыт.
 *
 * Ширина — единственная анимация. Карточки делят строку через flex-grow,
 * поэтому раскрытие одной само сжимает остальные: отдельно считать ширины
 * не нужно, и сумма всегда равна строке.
 *
 * Наведение даёт лёгкий подгляд, нажатие раскрывает. Подгляд отдельной
 * величиной, а не тем же значением, что у раскрытой: иначе карточка прыгала
 * бы на всю ширину от случайного движения мышью.
 *
 * Углы прямые: скругление здесь спорило бы со всей вёрсткой — сетки, плитки
 * и кнопки на сайте квадратные.
 *
 * На узких экранах гармошка не работает: восемь вертикальных полосок
 * на телефоне нечитаемы. Там лента с прокруткой по одной карточке,
 * и край следующей виден — понятно, что список продолжается.
 */

/** Доли flex-grow. Раскрытая держит около трети строки. */
const GROW_ACTIVE = 4
const GROW_PEEK = 1.5
const GROW_IDLE = 1

/** Сколько кадр стоит раскрытым, пока листается само. */
const SLIDE_MS = 6000

export function ProjectsAccordion({ formHref }: { formHref: string }) {
  const [active, setActive] = useState(0)
  const [peeked, setPeeked] = useState<number | null>(null)
  const total = projects.length

  const grow = (i: number) => {
    if (i === active) return GROW_ACTIVE
    if (i === peeked) return GROW_PEEK
    return GROW_IDLE
  }

  const step = (dir: 1 | -1) => setActive((i) => (i + dir + total) % total)

  /**
   * Само листается, пока на гармошку не навели.
   *
   * Пауза именно по наведению, а не по фокусу: здесь мышь и есть способ
   * выбора, и кадр не должен уезжать из-под курсора. `active` в зависимостях
   * не лишний — он перезапускает отсчёт после ручного переключения, иначе
   * следующий кадр сменился бы через остаток чужого интервала.
   */
  useEffect(() => {
    if (peeked !== null) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = setTimeout(() => setActive((i) => (i + 1) % total), SLIDE_MS)
    return () => clearTimeout(timer)
  }, [peeked, active, total])

  return (
    <>
      {/* Гармошка — от больших экранов */}
      <div
        className="mt-14 hidden gap-2 lg:mt-20 lg:flex lg:h-[560px]"
        onMouseLeave={() => setPeeked(null)}
      >
        {projects.map((project, i) => {
          const isActive = i === active
          return (
            <article
              key={project.id}
              onMouseEnter={() => setPeeked(i)}
              style={{ flexGrow: grow(i), flexBasis: 0 }}
              className="group relative isolate min-w-0 overflow-hidden bg-ink-950 transition-[flex-grow] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
            >
              <Image
                src={project.image}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 1024px) 50vw, 40vw"
                className={`-z-10 object-cover transition-transform duration-700 ease-out motion-reduce:transition-none ${
                  isActive ? 'scale-100' : 'scale-110'
                }`}
              />
              {/* Раскрытой нужен градиент слева под текст, свёрнутой — ровная
                  вуаль: у неё текст идёт и сверху, и снизу. */}
              <div
                aria-hidden
                className={`absolute inset-0 -z-10 transition-opacity duration-500 motion-reduce:transition-none ${
                  isActive
                    ? 'bg-gradient-to-r from-ink-950 from-5% via-ink-950/75 via-45% to-ink-950/25'
                    : 'bg-ink-950/65'
                }`}
              />

              {isActive ? (
                <div className="flex h-full flex-col p-10">
                  <div className="flex items-start justify-between gap-6">
                    <p className="eyebrow flex items-center gap-3 text-white/60">
                      <Marker />
                      {project.sector}
                    </p>
                    <p className="font-condensed text-sm whitespace-nowrap text-white/50">
                      <span className="text-white">{String(i + 1).padStart(2, '0')}</span>
                      {' / '}
                      {String(total).padStart(2, '0')}
                    </p>
                  </div>

                  <h3 className="mt-8 max-w-[14ch] text-[clamp(2rem,3.2vw,3.25rem)] leading-[1.05] text-white">
                    {project.title}
                  </h3>

                  <p className="mt-8 text-sm text-white/45">Заказчик</p>
                  <p className="mt-1 text-lg text-white">{project.client}</p>

                  <p className="mt-6 max-w-[42ch] text-[15px] leading-relaxed text-white/70">
                    {project.description}
                  </p>

                  <div className="mt-auto pt-8">
                    <ButtonLink href={formHref} variant="ghost">
                      Обсудить такой объект
                    </ButtonLink>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Показать объект: ${project.title}`}
                  className="flex h-full w-full flex-col p-3.5 text-left"
                >
                  <p className="font-condensed text-lg text-white/70">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-4 text-[14px] leading-tight text-white">{project.short}</h3>
                  {/* Без .eyebrow: там разрядка 0.18em, и на такой ширине
                      «магистральный нефтепровод» уезжает за край. Перенос
                      по слогам разрешён только здесь: название объекта
                      и имя заказчика рвать посреди слова нельзя. */}
                  <p className="mt-3 text-[9px] leading-[1.5] font-bold tracking-[0.06em] text-white/45 uppercase [hyphens:auto]">
                    {project.sector}
                  </p>

                  <div className="mt-auto">
                    <p className="text-[11px] text-white/45">Заказчик</p>
                    <p className="mt-1 text-[12px] leading-tight text-white/85">{project.client}</p>
                    <span
                      aria-hidden
                      className="mt-4 flex h-9 w-9 items-center justify-center border border-white/30 text-white transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-ink-950"
                    >
                      <ArrowGlyph className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              )}
            </article>
          )
        })}
      </div>

      {/* Лента — до больших экранов */}
      <MobileRail />

      {/* Под карточками: переключение слева, призыв справа */}
      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-10">
        <div className="hidden items-center gap-6 lg:col-span-5 lg:flex">
          <Counter current={active} total={total} duration={SLIDE_MS} />
          <div className="flex gap-2.5">
            <ArrowButton tone="dark" direction="prev" label="Предыдущий объект" onClick={() => step(-1)} />
            <ArrowButton tone="dark" direction="next" label="Следующий объект" onClick={() => step(1)} />
          </div>
        </div>

        <div className="lg:col-span-7">
          <NextUp formHref={formHref} />
        </div>
      </div>
    </>
  )
}

/**
 * Счётчик с дорожкой.
 *
 * `duration` включает режим таймера: дорожка заполняется за то же время,
 * что отведено кадру, и видно, сколько он ещё простоит. `key` по номеру
 * перезапускает анимацию — без него она доигрывала бы от старого места.
 *
 * Без `duration` дорожка просто показывает, как далеко пролистали: в ленте
 * листает человек, и таймеру там взяться неоткуда.
 */
function Counter({
  current,
  total,
  duration,
}: {
  current: number
  total: number
  duration?: number
}) {
  return (
    <p className="font-condensed flex items-center gap-4 text-sm text-body-soft">
      <span className="text-ink-900">{String(current + 1).padStart(2, '0')}</span>
      <span aria-hidden className="relative block h-px w-24 overflow-hidden bg-line-strong">
        {duration ? (
          <span
            key={current}
            className="slide-progress absolute inset-0 bg-brand-500"
            style={{ animationDuration: `${duration}ms` }}
          />
        ) : (
          <span
            className="absolute inset-y-0 left-0 bg-brand-500 transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        )}
      </span>
      <span>{String(total).padStart(2, '0')}</span>
    </p>
  )
}

/**
 * Замыкающий призыв. Без плашки: строка живёт прямо на фоне секции,
 * слева её держит волосяная линейка — тот же приём, что у заголовков
 * на внутренних страницах.
 */
function NextUp({ formHref }: { formHref: string }) {
  return (
    <div className="flex flex-col gap-6 border-line-strong sm:flex-row sm:items-center sm:justify-between lg:border-l lg:pl-8">
      <div>
        <p className="eyebrow text-body-soft">Что дальше</p>
        <p className="mt-3 max-w-[26ch] text-xl leading-snug font-bold">
          Список не закрыт — впереди новые объекты
        </p>
      </div>

      <ButtonLink href={formHref} className="shrink-0 self-start">
        Рассказать о своём
      </ButtonLink>
    </div>
  )
}

/**
 * Лента для узких экранов.
 *
 * Прокрутка с прилипанием: карточка занимает почти всю ширину, край следующей
 * остаётся видимым. Счётчик считается по положению прокрутки, а не по нажатиям:
 * человек листает пальцем, и кнопки об этом не знают.
 */
function MobileRail() {
  const railRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const total = projects.length

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const onScroll = () => {
      const step = rail.scrollWidth / total
      setCurrent(Math.min(total - 1, Math.round(rail.scrollLeft / step)))
    }

    rail.addEventListener('scroll', onScroll, { passive: true })
    return () => rail.removeEventListener('scroll', onScroll)
  }, [total])

  const scrollBy = (dir: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    rail.scrollBy({ left: dir * (rail.scrollWidth / total), behavior: 'smooth' })
  }

  return (
    <div className="mt-12 lg:hidden">
      {/* scroll-pl-5 в пару к px-5: без него прилипание считает начало от края
          ленты, а не от её отступа, и лента при загрузке сама прокручивается
          на ширину отступа — первая карточка встаёт впритык к краю экрана,
          мимо колонки остального текста. */}
      <div
        ref={railRef}
        className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-pl-5 px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, i) => (
          <article
            key={project.id}
            className="relative isolate h-[420px] w-[84vw] shrink-0 snap-start overflow-hidden bg-ink-950"
          >
            <Image
              src={project.image}
              alt=""
              aria-hidden
              fill
              sizes="84vw"
              className="-z-10 object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 from-10% via-ink-950/70 via-55% to-ink-950/30"
            />
            <div className="flex h-full flex-col p-7">
              <div className="flex items-start justify-between gap-4">
                <p className="eyebrow flex items-center gap-3 text-white/60">
                  <Marker />
                  {project.sector}
                </p>
                <p className="font-condensed text-sm whitespace-nowrap text-white/50">
                  <span className="text-white">{String(i + 1).padStart(2, '0')}</span>
                  {' / '}
                  {String(total).padStart(2, '0')}
                </p>
              </div>
              <h3 className="mt-auto text-[clamp(1.75rem,7vw,2.25rem)] leading-[1.1] text-white">
                {project.title}
              </h3>
              <p className="mt-5 text-xs text-white/45">Заказчик</p>
              <p className="mt-1 text-[15px] text-white">{project.client}</p>
              <p className="mt-4 text-[14px] leading-relaxed text-white/70">{project.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-5">
        <Counter current={current} total={total} />
        <div className="ml-auto flex gap-2.5">
          <ArrowButton tone="dark" direction="prev" label="Предыдущий объект" onClick={() => scrollBy(-1)} />
          <ArrowButton tone="dark" direction="next" label="Следующий объект" onClick={() => scrollBy(1)} />
        </div>
      </div>
    </div>
  )
}

function ArrowGlyph({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M5 12h13M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
    </svg>
  )
}
