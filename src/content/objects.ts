/**
 * Объекты.
 *
 * ⚠️ СЕЙЧАС ЗДЕСЬ ПРИМЕРЫ, А НЕ РЕАЛЬНЫЕ ОБЪЕКТЫ.
 *
 * Они стоят, чтобы показать раздел в работе, и обязаны уехать до запуска.
 * Сайт делается для проверки компании: службе безопасности заказчика
 * достаточно не найти подтверждения одному объекту, чтобы снять доверие
 * со всего сайта. Выдуманное портфолио здесь опаснее пустого раздела.
 *
 * Снимки тоже постановочные: их ровно три, и список специально сокращён
 * до трёх объектов, чтобы в сетке не было карточек-заглушек.
 *
 * Что нужно от заказчика на каждый объект: название, город, тип, год,
 * объём работ, площадь и фотографии с разрешением на публикацию.
 *
 * Когда придут настоящие — просто заменить массив.
 */

import type { StaticImageData } from 'next/image'
import administrativnoBytovoyKorpus from '@/assets/objects/administrativno-bytovoy-korpus.jpg'
import logisticheskiyCentr from '@/assets/objects/logisticheskiy-centr.jpg'
import proizvodstvennoSkladskoyKompleks from '@/assets/objects/proizvodstvenno-skladskoy-kompleks.jpg'

export type BuildObject = {
  slug: string
  title: string
  city: string
  /** Тип объекта: промышленный, общественный, жилой, инфраструктурный. */
  type: string
  year: number
  /** Объём работ — что делали: «генподряд», «проектирование + строительство». */
  scope: string
  area?: string
  /** Фото объекта. Без него карточка показывает серую заглушку. */
  image?: StaticImageData
  /** Метка на карте: [широта, долгота]. */
  geo?: [number, number]
}

export const objects: BuildObject[] = [
  {
    slug: 'proizvodstvenno-skladskoy-kompleks',
    title: 'Производственно-складской комплекс',
    city: 'Новосибирск',
    type: 'Промышленный',
    year: 2024,
    scope: 'Генподряд: от ТУ до ввода в эксплуатацию',
    area: '12 400 м²',
    image: proizvodstvennoSkladskoyKompleks,
  },
  {
    slug: 'logisticheskiy-centr',
    title: 'Логистический центр класса А',
    city: 'Барнаул',
    type: 'Складская логистика',
    year: 2024,
    scope: 'Проектирование и строительство',
    area: '18 600 м²',
    image: logisticheskiyCentr,
  },
  {
    slug: 'administrativno-bytovoy-korpus',
    title: 'Административно-бытовой корпус',
    city: 'Кемерово',
    type: 'Административный',
    year: 2023,
    scope: 'Общестрой, инженерия, отделка',
    area: '3 800 м²',
    image: administrativnoBytovoyKorpus,
  },
]
