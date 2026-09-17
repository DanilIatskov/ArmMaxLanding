import Image, { type StaticImageData } from 'next/image'
import inzhenerPlanshet from '@/assets/inzhener-planshet.jpg'
import kaska from '@/assets/kaska.jpg'
import komandaChertezhi from '@/assets/komanda-chertezhi.jpg'
import { CountUp } from './CountUp'
import { Marker } from './Marker'
import { Reveal } from './Reveal'

/**
 * «Компания в цифрах» — шахматная сетка Suffolk.
 *
 * Сила блока в пустых ячейках: они задают ритм и оставляют воздух, который
 * бриф просит у всего сайта. Заполнять их «чтобы не пустовало» нельзя —
 * блок сразу превращается в обычную плитку.
 *
 * Снимки квадратные (1254×1254) и садятся в ячейку без кадрирования.
 * Импортируются статически: Next подмешивает в имя файла хеш содержимого,
 * поэтому после замены снимка адрес меняется и старый кадр не может
 * прилететь из кэша браузера.
 */

type Cell =
  | { kind: 'title'; text: string; span: 2 }
  | { kind: 'stat'; value: string; unit?: string; label: string }
  | { kind: 'image'; src: StaticImageData; alt: string }
  | { kind: 'empty' }

const CELLS: Cell[] = [
  // Дефис здесь неразрывный (U+2011): обычный рвал название компании по строкам.
  { kind: 'title', text: 'АРММАКС\u2011СТРОЙ в цифрах', span: 2 },
  { kind: 'stat', value: '25', unit: 'лет', label: 'в строительстве' },
  { kind: 'image', src: inzhenerPlanshet, alt: 'Инженер АРММАКС-СТРОЙ с планшетом на площадке объекта капитального строительства' },

  { kind: 'stat', value: '300+', unit: 'млн ₽', label: 'объём объекта' },
  { kind: 'image', src: komandaChertezhi, alt: 'Команда АРММАКС-СТРОЙ разбирает чертежи на строительной площадке' },
  { kind: 'empty' },
  { kind: 'empty' },

  { kind: 'empty' },
  { kind: 'empty' },
  { kind: 'stat', value: '4', unit: 'награды', label: 'Минстрой и Госстройнадзор НСО' },
  { kind: 'image', src: kaska, alt: 'Каска с маркировкой АРММАКС-СТРОЙ' },
]

export function GlanceGrid() {
  return (
    <section className="bg-surface-muted py-16 md:py-section">
      <div className="mx-auto w-full max-w-[1680px] px-5 lg:px-14">
        <div className="hairline-grid grid-cols-2 border border-line lg:grid-cols-4">
          {CELLS.map((cell, i) => (
            <GlanceCell key={i} cell={cell} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function GlanceCell({ cell, index }: { cell: Cell; index: number }) {
  // Ячейки наполняются по очереди слева направо — сетка как будто заполняется.
  const delay = index * 70

  if (cell.kind === 'title') {
    return (
      <div className="col-span-2 aspect-[2/1] lg:aspect-auto">
        <Reveal delay={delay} className="flex h-full items-start p-5 md:p-10">
          <h2 className="font-condensed text-[clamp(2rem,4vw,4rem)] leading-[1.05] font-normal uppercase tracking-[0.01em]">
            {cell.text}
          </h2>
        </Reveal>
      </div>
    )
  }

  if (cell.kind === 'stat') {
    return (
      <div className="aspect-square">
        <Reveal delay={delay} className="flex h-full flex-col justify-between p-5 md:p-10">
          {/* Единица стоит под числом, а не в строку с ним: на крупном кегле
              длинное значение переносило её само и ломало ряд. */}
          <p>
            <span className="font-condensed block text-[clamp(3.25rem,7.5vw,7rem)] leading-[0.85] font-normal tracking-[-0.02em] text-ink-900">
              <CountUp value={cell.value} />
            </span>
            {cell.unit && (
              <span className="mt-2 block text-[clamp(1rem,1.5vw,1.5rem)] leading-none font-medium text-brand-500">
                {cell.unit}
              </span>
            )}
          </p>

          <p className="eyebrow flex items-start gap-2 text-body-soft md:gap-3">
            <Marker className="mt-px" />
            <span className="leading-[1.5] tracking-[0.1em] break-words md:tracking-[0.18em]">
              {cell.label}
            </span>
          </p>
        </Reveal>
      </div>
    )
  }

  if (cell.kind === 'image') {
    return (
      <div className="aspect-square p-2">
        <Reveal delay={delay} className="relative h-full w-full overflow-hidden bg-surface-sunken">
          <Image
            src={cell.src}
            alt={cell.alt}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    )
  }

  // Пустая ячейка: держит ритм сетки. На мобильном её скрываем —
  // в две колонки пустоты съедают экран.
  return <div className="hidden aspect-square lg:block" />
}
