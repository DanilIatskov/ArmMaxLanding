import type { StaticImageData } from 'next/image'

import amurskiyGpz from '@/assets/projects/amurskiy-gpz.webp'
import arcticSpg from '@/assets/projects/arctic-spg.webp'
import gydan from '@/assets/projects/gydan.webp'
import kuyumbaTayshet from '@/assets/projects/kuyumba-tayshet.webp'
import muzeyTransneft from '@/assets/projects/muzey-transneft.webp'
import omskiyNpz from '@/assets/projects/omskiy-npz.webp'
import opSvobodnyy from '@/assets/projects/op-svobodnyy.webp'
import silaSibiriKs7 from '@/assets/projects/sila-sibiri-ks7.webp'

import kolmar from '@/assets/clients/kolmar.png'
import magnit from '@/assets/clients/magnit.png'
import sibelektroterm from '@/assets/clients/sibelektroterm.png'
import transneftKozmino from '@/assets/clients/transneft-kozmino.png'

/**
 * Объекты, в которых участвовала команда, и заказчики из тендерной анкеты.
 *
 * ВАЖНО, ПЕРЕД ЗАПУСКОМ ПРОЧИТАТЬ.
 *
 * Работы по этому списку велись не от ООО «АРММАКС-СТРОЙ», а в составе
 * ГК «Армакс» — так сказал заказчик. Для сайта это принципиально: его
 * открывает служба безопасности партнёра, чтобы проверить компанию. Если
 * подать чужие по документам объекты как свои, проверка не найдёт
 * подтверждения — и потеряно будет доверие ко всему сайту, а не к одной
 * строке. Поэтому в блоке прямо сказано, что участие шло в составе группы.
 *
 * Объём работ по каждому объекту (`scope`) заказчик прислал сам — это его
 * формулировки, не наши предположения. Менять их без него нельзя: «раздел КЖ»
 * и «генподряд» для проверяющего разные вещи.
 *
 * TODO до запуска: письменное согласие заказчиков на упоминание. Названия
 * и товарные знаки принадлежат им, а в договорах с компаниями такого масштаба
 * обычно есть пункт о неразглашении и о согласовании публикаций.
 */

/** Объект, в котором участвовала команда. */
export type Project = {
  id: string
  /** Как объект называют в отрасли. */
  title: string
  /** Заказчик или владелец объекта. `null` — заказчик не назван. */
  client: string | null
  /** Отрасль — по ней объекты и группируются в глазах проверяющего. */
  sector: string
  /** Имя для узкой карточки гармошки: там на длинное не хватает ширины. */
  short: string
  /** Что именно делали. Формулировка заказчика, дословно. */
  scope: string
  /**
   * Кадр к объекту.
   *
   * ЭТО НЕ ФОТОСЪЁМКА ОБЪЕКТОВ. Кадры отрисованные, снимков самих площадок
   * у нас нет.
   *
   * `null` — кадра нет вовсе: подобрать отрисовку под мост, магазин или
   * космодром не вышло, а ставить «похожую» картинку к конкретному объекту
   * хуже, чем не ставить никакой. Такие карточки идут с фирменным узором.
   */
  image: StaticImageData | null
}

export const projects: readonly Project[] = [
  {
    id: 'arctic-spg',
    title: 'Арктик СПГ',
    client: 'НОВАТЭК',
    sector: 'Сжижение природного газа',
    short: 'Арктик СПГ',
    scope: 'Инфраструктура',
    image: arcticSpg,
  },
  {
    id: 'gydan',
    title: 'Гыдан',
    client: 'НОВАТЭК',
    sector: 'Освоение месторождения',
    short: 'Гыдан',
    scope: 'Инфраструктура',
    image: gydan,
  },
  {
    id: 'muzey-transneft',
    title: 'Музей «Транснефть», Москва',
    client: 'Транснефть',
    sector: 'Общественное здание',
    short: 'Музей «Транснефть»',
    scope: 'Раздел КЖ',
    image: muzeyTransneft,
  },
  {
    id: 'omskiy-npz',
    title: 'Омский НПЗ',
    client: 'Газпром нефть',
    sector: 'Нефтепереработка',
    short: 'Омский НПЗ',
    scope: 'Реконструкция СМ 7-16',
    image: omskiyNpz,
  },
  {
    id: 'kuyumba-tayshet',
    title: 'ГРВЛ «Куюмба — Тайшет»',
    client: 'Транснефть',
    sector: 'Магистральный нефтепровод',
    short: 'Куюмба — Тайшет',
    scope: 'Инженерия, общестрой',
    image: kuyumbaTayshet,
  },
  {
    id: 'amurskiy-gpz',
    title: 'Амурский ГПЗ',
    client: 'Газпром',
    sector: 'Газопереработка',
    short: 'Амурский ГПЗ',
    scope: 'Фундаменты, раздел КЖ',
    image: amurskiyGpz,
  },
  {
    id: 'op-svobodnyy',
    title: 'ОП «Свободный»',
    client: 'Газпром',
    sector: 'Обустройство площадки',
    short: 'ОП «Свободный»',
    scope: 'Раздел КЖ',
    image: opSvobodnyy,
  },
  {
    id: 'sila-sibiri-ks7',
    title: 'Газопровод «Сила Сибири» (КС-7)',
    client: 'Газпром',
    sector: 'Компрессорная станция',
    short: '«Сила Сибири» (КС-7)',
    scope: 'Компрессорная станция КС-7',
    image: silaSibiriKs7,
  },
  {
    id: 'lpds-sokur',
    title: 'ЛПДС «Сокур»',
    client: 'Транснефть',
    sector: 'Нефтеперекачивающая станция',
    short: 'ЛПДС «Сокур»',
    scope: 'Резервуары В-1, В-2; пожаротушение, общестрой',
    image: null,
  },
  {
    id: 'magnit',
    title: 'Объекты сети «Магнит»',
    client: 'Магнит',
    sector: 'Торговая недвижимость',
    short: '«Магнит»',
    scope: 'Общестрой',
    image: null,
  },
  {
    id: 'most-ob',
    title: 'Четвёртый мост через Обь',
    client: null,
    sector: 'Транспортная инфраструктура',
    short: 'Мост через Обь',
    scope: 'Сети водоснабжения и водоотведения, консалтинг, стройнадзор',
    image: null,
  },
  {
    id: 'vostochnyy',
    title: 'Космодром «Восточный»',
    client: null,
    sector: 'Космическая инфраструктура',
    short: 'Космодром «Восточный»',
    scope: 'Раздел КЖ',
    image: null,
  },
] as const

/**
 * Заказчики и партнёры из тендерной анкеты компании.
 *
 * Отдельно от объектов выше: это перечень контрагентов, а не список работ.
 * Смешивать их нельзя — проверяющий читает эти два списка по-разному.
 * «Магнит» есть в обоих, и это не ошибка: он и контрагент, и объект.
 */
export type Partner = {
  id: string
  /** Полное имя с формой собственности — для перечня на странице объектов. */
  name: string
  /** Короткое — для бегущей ленты, туда длинное не влезает. */
  short: string
  /**
   * Знак компании. `null` — файла нет, в ленте едет название.
   *
   * Знаки чёрные на прозрачном, поэтому работают только на светлом фоне —
   * лента как раз на нём. Готовит их `npm run clients`: обрезает пустые поля
   * и приводит к одной высоте.
   *
   * У обоих ГОКов знак один: они входят в ГК «Колмар». В перечне это разные
   * юрлица и остаются двумя строками, а в ленте знак показывается один раз.
   *
   * Разрешение на использование знаков — по-прежнему за заказчиком: файл
   * и право на него разные вещи.
   */
  logo: StaticImageData | null
}

export const partners: readonly Partner[] = [
  { id: 'magnit', name: 'ПАО «Магнит»', short: 'Магнит', logo: magnit },
  { id: 'sibelektroterm', name: 'АО «СКБ Сибэлектротерм»', short: 'Сибэлектротерм', logo: sibelektroterm },
  /** TODO: знака «Триады» заказчик не прислал — в ленте пока название. */
  { id: 'triada', name: 'НПП «Триада»', short: 'Триада', logo: null },
  { id: 'gok-denisovskiy', name: 'АО «ГОК Денисовский»', short: 'ГОК Денисовский', logo: kolmar },
  { id: 'gok-inaglinskiy', name: 'АО «ГОК Инаглинский»', short: 'ГОК Инаглинский', logo: kolmar },
  {
    id: 'transneft-kozmino',
    name: 'ООО «Транснефть-порт Козьмино»',
    short: 'Транснефть-порт Козьмино',
    logo: transneftKozmino,
  },
] as const
