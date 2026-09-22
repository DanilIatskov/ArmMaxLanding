import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import brigadaChertezhi from '@/assets/brigada-chertezhi.webp'
import kaska from '@/assets/kaska.webp'
import geodezistTaheometr from '@/assets/geodezist-taheometr.webp'
import { awards } from '@/content/company'
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

/*
  Число наград берётся из данных: при добавлении скана цифра в сетке меняется
  сама. Раньше она стояла строкой, и после пополнения раздела наград сайт
  обещал «4 награды» рядом со списком из шести.

  `as number` обязателен: массив объявлен `as const`, и без приведения
  TypeScript считает длину литералом 6 — любое сравнение с другим числом он
  тогда объявляет заведомо ложным и роняет сборку.
*/
const AWARDS_COUNT = awards.length as number

/** Склонение по числу: 1 награда, 2 награды, 5 наград. */
function plural(n: number, one: string, few: string, many: string): string {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return many
  const mod10 = n % 10
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}

type Cell =
  | { kind: 'title'; text: string; span: 2 }
  | { kind: 'stat'; value: string; unit?: string; label: string; dark?: boolean; href?: string }
  | { kind: 'image'; src: StaticImageData; alt: string }
  | { kind: 'empty' }

/*
  Инверсия ячеек с текстом. Часть из них тёмные по умолчанию — они разбивают
  белое поле сетки; на ховере каждая ячейка меняется на противоположную,
  поэтому приём читается как одно правило, а не как два разных состояния.

  Цвет заливки — токен `ink-invert`, тот же, что у класса `.invert-hover`
  в globals.css. Здесь свой набор классов, а не общий класс: только тут
  есть ячейки, тёмные по умолчанию, и акцентные цвета единиц.

  Базовый белый фон ячейке даёт `.hairline-grid > *` из слоя components;
  утилиты Tailwind лежат слоем выше и перебивают его при той же специфичности.
*/
const CELL_BASE = 'group transition-colors duration-300'
const CELL_LIGHT = `${CELL_BASE} hover:bg-ink-invert`
const CELL_DARK = `${CELL_BASE} bg-ink-invert hover:bg-surface`

const CELLS: Cell[] = [
  // Дефис здесь неразрывный (U+2011): обычный рвал название компании по строкам.
  { kind: 'title', text: 'АРММАКС\u2011СТРОЙ в цифрах', span: 2 },
  { kind: 'stat', value: '25', unit: 'лет', label: 'в строительстве', href: '/o-kompanii' },
  { kind: 'image', src: geodezistTaheometr, alt: 'Геодезист АРММАКС-СТРОЙ с тахеометром на зимней площадке' },

  { kind: 'stat', value: '100+', unit: 'млн ₽', label: 'объём объекта', dark: true, href: '#zayavka' },
  { kind: 'image', src: brigadaChertezhi, alt: 'Бригада АРММАКС-СТРОЙ разбирает чертежи на промышленной площадке' },
  { kind: 'empty' },
  { kind: 'empty' },

  { kind: 'empty' },
  { kind: 'empty' },
  { kind: 'stat', value: String(AWARDS_COUNT), unit: plural(AWARDS_COUNT, 'награда', 'награды', 'наград'), label: 'Минстрой и Госстройнадзор НСО', href: '/o-kompanii#nagrady' },
  { kind: 'image', src: kaska, alt: 'Каска с маркировкой АРММАКС-СТРОЙ' },
]

export function GlanceGrid() {
  return (
    // Снизу отступа нет: дальше идёт «Как мы строим» на том же фоне,
    // и два вертикальных поля складывались в 240px пустоты. Расстояние
    // между блоками задаёт верхнее поле следующей секции.
    <section className="bg-surface-muted pt-16 md:pt-section">
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
  /*
    Ячейки наполняются по очереди слева направо — сетка как будто заполняется.

    Задержка считается от места в ряду, а не от номера в сетке. Раньше было
    index * 70, и нижний ряд ждал до 700 мс после того, как уже попал в кадр:
    человек видел пустые клетки и думал, что сайт не догрузился. В ряду четыре
    ячейки, шаг 60 мс — весь каскад укладывается в 180 мс, эффект читается,
    ожидание — нет.
  */
  const delay = (index % 4) * 60

  if (cell.kind === 'title') {
    return (
      // Заголовок блока без ховера: он не цифра, выворачивать его не за что.
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
    const dark = cell.dark === true

    // Ячейка с адресом становится ссылкой целиком: цифра и подпись работают
    // как одна мишень, а тянуться к мелкому тексту внизу не приходится.
    const Cell = cell.href ? Link : 'div'
    const cellProps = cell.href ? { href: cell.href } : {}

    return (
      <div className={`aspect-square ${dark ? CELL_DARK : CELL_LIGHT}`}>
        <Cell {...(cellProps as { href: string })} className="block h-full">
        <Reveal delay={delay} className="flex h-full flex-col justify-between p-5 md:p-10">
          {/* Единица стоит под числом, а не в строку с ним: на крупном кегле
              длинное значение переносило её само и ломало ряд. */}
          <p>
            <span
              className={`font-condensed block text-[clamp(3.25rem,7.5vw,7rem)] leading-[0.85] font-normal tracking-[-0.02em] transition-colors duration-300 ${
                dark ? 'text-white group-hover:text-ink-900' : 'text-ink-900 group-hover:text-white'
              }`}>
              <CountUp value={cell.value} />
            </span>
            {cell.unit && (
              <span className={`mt-2 block text-[clamp(1rem,1.5vw,1.5rem)] leading-none font-medium transition-colors duration-300 ${
                  dark ? 'text-accent-400 group-hover:text-brand-500' : 'text-brand-500 group-hover:text-accent-400'
                }`}>
                {cell.unit}
              </span>
            )}
          </p>

          <p className={`eyebrow flex items-start gap-2 transition-colors duration-300 md:gap-3 ${
              dark ? 'text-white/70 group-hover:text-body-soft' : 'text-body-soft group-hover:text-white/70'
            }`}>
            <Marker className="mt-px" />
            <span className="leading-[1.5] tracking-[0.1em] break-words md:tracking-[0.18em]">
              {cell.label}
            </span>
          </p>
        </Reveal>
        </Cell>
      </div>
    )
  }

  if (cell.kind === 'image') {
    return (
      // Без aspect-square: ячейку растягивает строка. Квадрат тут жёстко
      // фиксировал высоту, и если соседняя ячейка с цифрой перерастала свой
      // квадрат (подпись ушла на лишнюю строку), снимок оставался низким
      // и снизу вылезала серая подложка сетки. В Chrome не воспроизводилось,
      // в Safari на iOS — да.
      <div className="p-2">
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
  return <div className="hidden lg:block" />
}
