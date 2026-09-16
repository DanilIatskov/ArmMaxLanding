import { services } from './services'

export const mainNav = [
  { href: '/uslugi', label: 'Услуги' },
  { href: '/kak-my-rabotaem', label: 'Как мы работаем' },
  { href: '/obekty', label: 'Объекты' },
  { href: '/o-kompanii', label: 'О компании' },
  { href: '/rekvizity', label: 'Реквизиты' },
  { href: '/kontakty', label: 'Контакты' },
] as const

export const serviceNav = services.map((s) => ({
  href: `/uslugi/${s.slug}`,
  label: s.title,
}))
