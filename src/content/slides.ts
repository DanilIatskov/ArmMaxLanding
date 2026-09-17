/**
 * Слайды первого экрана.
 *
 * Три сильнейших аргумента из брифа, по одному на слайд: одна компания
 * на всём пути, экономия на точке подключения, доведение до разрешения
 * на ввод. Заголовок каждого слайда разбит на две части — утверждение
 * набирается Bold, пояснение Regular (приём из макета).
 */

export type Slide = {
  /** Подпись вкладки под номером. */
  tab: string
  /** Утверждение — Bold. */
  lead: string
  /** Пояснение — Regular, продолжает ту же фразу. */
  rest: string
  actions: { href: string; label: string; tone: 'accent' | 'dark' }[]
}

export const slides: Slide[] = [
  {
    tab: 'Комплекс под ключ',
    lead: 'Строительство под ключ.',
    rest: 'От технических условий до ввода в эксплуатацию',
    actions: [
      { href: '/kontakty#zayavka', label: 'Оставить заявку', tone: 'accent' },
      { href: '/uslugi', label: 'Наши услуги', tone: 'dark' },
    ],
  },
  {
    tab: 'Выгодная точка подключения',
    lead: 'Точка в 500 метрах вместо 15 километров.',
    rest: 'Здесь решается стоимость инженерии',
    actions: [
      { href: '/uslugi/tehnicheskie-usloviya', label: 'Технические условия', tone: 'accent' },
      { href: '/kontakty#zayavka', label: 'Обсудить объект', tone: 'dark' },
    ],
  },
  {
    tab: 'Ввод в эксплуатацию',
    lead: 'Доводим до разрешения на ввод.',
    rest: 'Сопровождаем объект в Госстройнадзоре',
    actions: [
      { href: '/uslugi/vvod-v-ekspluataciyu', label: 'Как это устроено', tone: 'accent' },
      { href: '/o-kompanii#nagrady', label: 'Наши награды', tone: 'dark' },
    ],
  },
]

/** Сколько слайд держится до автопереключения. */
export const SLIDE_DURATION_MS = 7000
