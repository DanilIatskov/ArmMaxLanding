import { partners } from '@/content/projects'

/**
 * Лента заказчиков рядом со ссылкой на страницу объектов.
 *
 * У кого файла нет, имя набрано нашим шрифтом — плотным гротеском в тех же
 * габаритах, что знаки. Это именно набор названия, а не нарисованный за них
 * знак: придумывать чужой товарный знак нельзя, он принадлежит компании
 * и выглядит иначе. Пришлют файл — подставится вместо набора.
 *
 * Право на использование самих знаков остаётся за заказчиком: файл
 * и разрешение разные вещи.
 *
 * Один знак показывается один раз, даже если он у нескольких компаний:
 * оба ГОКа входят в ГК «Колмар», и в перечне они двумя строками, а в ленте
 * «Колмар» проехал бы дважды подряд и читался как сбой.
 *
 * По краям маска: лента уезжает в ничто, а не обрывается о край колонки.
 *
 * Знаки перекрашены в фирменный тёмно-синий. Присланные файлы растровые
 * и чисто чёрные — прозрачностью их не перекрасить, получится серый. Поэтому
 * знак идёт не картинкой, а маской: сам файл задаёт форму, а цвет даёт
 * заливка. Заодно цвет знаков и набранных имён берётся из одного токена
 * и не может разойтись.
 */

/**
 * Сколько раз набор повторяется внутри одной копии.
 *
 * Копий всегда две, и уезжают они ровно на половину ленты — то есть на одну
 * копию. Значит, копия обязана быть шире контейнера, иначе после сдвига
 * содержимого не хватает на всю ширину и справа открывается пустота.
 * Пяти заказчиков хватало на 740 точек при контейнере до 1292: дыра
 * в полтысячи пикселей. Тройной набор закрывает любую ширину, какую
 * допускает макет.
 */
const REPEAT = 3

/** Секунд на один проход набора. Общая длительность умножается на повторы,
    иначе лента поехала бы втрое быстрее. */
const SECONDS_PER_SET = 38

/** Высота знака в ленте и потолок по ширине: знаки-надписи вроде «Колмара»
    втрое шире компактных и по одной высоте перетягивали бы ленту на себя. */
const LOGO_HEIGHT = 44
const LOGO_MAX_WIDTH = 190

export function ClientsMarquee() {
  const seen = new Set<string>()
  const items = partners.filter((partner) => {
    if (!partner.logo) return true
    if (seen.has(partner.logo.src)) return false
    seen.add(partner.logo.src)
    return true
  })

  const row = (copy: number) => (
    <ul
      key={copy}
      aria-hidden={copy > 0 || undefined}
      className="flex shrink-0 items-center gap-14 pr-14"
    >
      {Array.from({ length: REPEAT }).flatMap((_, pass) =>
        items.map((partner) => (
          <li
            key={`${partner.id}-${pass}`}
            // Прозрачность на самой ячейке: так знак и набранное имя
            // приглушаются одинаково.
            className="shrink-0 opacity-75 transition-opacity duration-300 hover:opacity-100"
          >
            {partner.logo ? (
              <span
                role="img"
                aria-label={partner.name}
                className="block bg-brand-800"
                style={{
                  height: LOGO_HEIGHT,
                  width: Math.min(
                    LOGO_MAX_WIDTH,
                    Math.round((LOGO_HEIGHT * partner.logo.width) / partner.logo.height),
                  ),
                  maskImage: `url(${partner.logo.src})`,
                  WebkitMaskImage: `url(${partner.logo.src})`,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              />
            ) : (
              <span className="font-condensed text-[26px] leading-none font-bold whitespace-nowrap text-brand-800 uppercase tracking-[0.04em]">
                {partner.short}
              </span>
            )}
          </li>
        )),
      )}
    </ul>
  )

  return (
    <div className="marquee relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div
        className="marquee-track flex w-max"
        style={{ animationDuration: `${SECONDS_PER_SET * REPEAT}s` }}
      >
        {[0, 1].map(row)}
      </div>
    </div>
  )
}
