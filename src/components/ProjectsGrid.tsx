import Image from 'next/image'
import { ArrowLink } from './ArrowLink'
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
 * Девятая ячейка с призывом осталась светлой — одна светлая клетка среди
 * тёмных держит ритм, тот же приём, что в шахматной сетке «в цифрах».
 */
export function ProjectsGrid({ formHref }: { formHref: string }) {
  return (
    <ul className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
      {projects.map((project, i) => (
        <Reveal key={project.id} delay={i * 60} className="bg-ink-950">
          {/* isolate: кадр лежит на отрицательном слое, и без своего контекста
              наложения он ушёл бы под заливку плитки. */}
          <li className="group relative isolate flex h-full min-h-[300px] flex-col justify-end overflow-hidden p-8 lg:min-h-[340px] lg:p-10">
            <Image
              src={project.image}
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="-z-10 object-cover transition-transform duration-700 ease-out motion-reduce:transition-none group-hover:scale-105"
            />
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
            <p className="mt-5 text-sm text-white/45">Заказчик</p>
            <p className="mt-1 text-[15px] text-white/85">{project.client}</p>
          </li>
        </Reveal>
      ))}

      <Reveal delay={projects.length * 60} className="bg-surface">
        <li className="flex h-full min-h-[300px] flex-col justify-end p-8 lg:min-h-[340px] lg:p-10">
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
