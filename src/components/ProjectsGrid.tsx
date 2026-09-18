import Image from 'next/image'
import { ArrowLink } from './ArrowLink'
import { FacetTile } from './FacetTile'
import { Marker } from './Marker'
import { Reveal } from './Reveal'
import { projects } from '@/content/projects'

/**
 * Объекты сеткой — для страницы «Объекты».
 *
 * На главной тот же материал показан гармошкой: там секция одна из многих,
 * и ей нужен акцент. Здесь человек пришёл смотреть именно объекты, листать
 * их по одному незачем — сетка даёт все восемь сразу.
 *
 * Плитки тёмные на светлой секции. Кадр идёт в полную силу, читаемость даёт
 * скрим поверх: снимки сплошь светлые, снег и небо, и на белом фоне им
 * не от чего оттолкнуться.
 *
 * Замыкающая ячейка с призывом светлая — одна светлая клетка среди тёмных
 * держит ритм, тот же приём, что в шахматной сетке «в цифрах».
 *
 * Она растягивается на остаток ряда. Иначе в последнем ряду рядом с ней
 * зияли бы пустые клетки — сквозь них просвечивает фон-подложка сетки,
 * и это читается как недогруженный блок, а не как приём. Остаток считается
 * от числа объектов, поэтому дыра не появится и при другом их количестве.
 */

/** Классы записаны целиком: Tailwind собирает стили по исходнику, из склеенной
    строки вроде `lg:col-span-${n}` он класс не увидит. */
const SPAN_SM = { 1: 'sm:col-span-1', 2: 'sm:col-span-2' } as const
const SPAN_LG = { 1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3' } as const

/** Сколько клеток осталось до конца ряда: полный ряд — значит, целый ряд. */
const restOfRow = (count: number, columns: number) => columns - (count % columns) || columns
export function ProjectsGrid({ formHref }: { formHref: string }) {
  return (
    <ul className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
      {projects.map((project, i) => (
        <Reveal key={project.id} delay={i * 60} className="bg-ink-950">
          {/* isolate: кадр лежит на отрицательном слое, и без своего контекста
              наложения он ушёл бы под заливку плитки. */}
          <li className="group relative isolate flex h-full min-h-[300px] flex-col justify-end overflow-hidden p-8 lg:min-h-[340px] lg:p-10">
            {project.image ? (
              <Image
                src={project.image}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="-z-10 object-cover transition-transform duration-700 ease-out motion-reduce:transition-none group-hover:scale-105"
              />
            ) : (
              /* Кадра нет: подобрать отрисовку под мост, магазин или космодром
                 не вышло, а «похожая» картинка к конкретному объекту хуже, чем
                 никакой. Вместо неё фирменный узор. */
              <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-25">
                <FacetTile seed={i} cells={5} className="h-full w-full" />
              </div>
            )}
            {/* Ровный скрим гасит кадр до читаемого, градиент снизу добавляет
                плотности под сам текст. При наведении скрим отступает. */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-ink-950/72 transition-colors duration-500 motion-reduce:transition-none group-hover:bg-ink-950/45"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 from-5% via-ink-950/55 via-45% to-transparent"
            />

            <p className="eyebrow flex items-center gap-3 text-white/55">
              <Marker />
              {project.sector}
            </p>
            <h3 className="mt-5 text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] text-white">
              {project.title}
            </h3>
            <p className="mt-5 text-sm text-white/45">{project.client ? 'Заказчик' : 'Объём работ'}</p>
            <p className="mt-1 text-[15px] text-white/85">{project.client ?? project.scope}</p>
          </li>
        </Reveal>
      ))}

      <Reveal
        delay={projects.length * 60}
        className={`bg-surface ${SPAN_SM[restOfRow(projects.length, 2) as 1 | 2]} ${
          SPAN_LG[restOfRow(projects.length, 3) as 1 | 2 | 3]
        }`}
      >
        {/* Без min-height: она нужна плиткам объектов, чтобы держать ряд,
            а эта ячейка растянута на весь ряд и высоту берёт по тексту. */}
        <li className="flex h-full flex-col justify-end p-8 lg:p-10">
          <p className="eyebrow flex items-center gap-3 text-body-soft">
            <Marker tone="muted" />
            Что дальше
          </p>
          <h3 className="mt-5 text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1]">
            Список не закрыт — впереди новые объекты
          </h3>
          <div className="mt-6">
            <ArrowLink href={formHref}>Рассказать о своём</ArrowLink>
          </div>
        </li>
      </Reveal>
    </ul>
  )
}
