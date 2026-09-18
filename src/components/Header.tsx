'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Logo } from './Logo'
import { Marker } from './Marker'
import { contacts } from '@/content/company'
import { services } from '@/content/services'

/**
 * Шапка по макету (Figma 11:12 — закрытая, 10:11926 — раскрытая).
 *
 * Логотип, навигация, кнопка связи и телефон в одну строку. Пункты
 * с раскрытием открывают мега-меню во всю ширину: слева серая колонка
 * с описанием и кнопкой, справа список ссылок с линейками.
 *
 * Верхней строки из макета здесь нет: на тёмном первом экране её линия
 * читалась как случайная, а единственная ссылка с неё («Реквизиты»)
 * и так открывается из раскрытия «О компании».
 *
 * Над тёмным первым экраном шапка прозрачная и светлая по тексту;
 * при прокрутке, на внутренних страницах и при раскрытом меню — белая.
 * Так же ведёт себя оригинал: на раскрытии шапка перекрашивается.
 *
 * Навигация набрана Roboto Condensed Bold, как в макете. Контейнер —
 * общий для всего сайта (`max-w-[1680px]`, отступ `--page-gutter`),
 * иначе на широком экране шапка расходится с контентом страницы.
 */

type MegaLink = { href: string; label: string }

type NavItem = {
  href: string
  label: string
  mega?: {
    title: string
    text: string
    cta: MegaLink
    links: MegaLink[]
  }
}

const NAV: NavItem[] = [
  {
    href: '/uslugi',
    label: 'Услуги',
    mega: {
      title: 'Услуги',
      text: 'Полный цикл по объекту капитального строительства. Каждый этап можно заказать отдельно, но ценность появляется, когда их ведёт одна компания.',
      cta: { href: '/uslugi', label: 'Все услуги' },
      links: services.map((s) => ({ href: `/uslugi/${s.slug}`, label: s.title })),
    },
  },
  { href: '/kak-my-rabotaem', label: 'Как мы работаем' },
  { href: '/obekty', label: 'Объекты' },
  {
    href: '/o-kompanii',
    label: 'О компании',
    mega: {
      title: 'О компании',
      text: 'ООО «АРММАКС-СТРОЙ», Новосибирск. Объекты капитального строительства от 100 млн ₽ по Сибирскому федеральному округу.',
      cta: { href: '/o-kompanii', label: 'Подробнее' },
      links: [
        { href: '/o-kompanii', label: 'История и принципы' },
        { href: '/o-kompanii#nagrady', label: 'Награды Минстроя и Госстройнадзора' },
        { href: '/rekvizity', label: 'Реквизиты и допуски' },
        { href: '/kontakty', label: 'Контакты и офис' },
      ],
    },
  },
]

/** 15px Roboto Condensed Bold, прописные — начертание навигации из макета. */
const NAV_LINK = 'font-condensed text-[15px] font-bold uppercase whitespace-nowrap transition-colors'

export function Header() {
  const [mega, setMega] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Каждая страница начинается с тёмного блока (первый экран или PageHero),
  // поэтому шапка вверху прозрачная везде, а не только на главной.
  const light = scrolled || open || mega !== null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMega(null)
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Меню занимает весь экран — страница под ним прокручиваться не должна.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const activeItem = NAV.find((item) => item.label === mega)

  return (
    <header
      onMouseLeave={() => setMega(null)}
      className={`fixed inset-x-0 top-0 z-50 flex flex-col transition-colors duration-300 ${
        light
          ? 'border-b border-line bg-surface'
          : 'bg-transparent'
      } ${open ? 'h-dvh lg:h-auto' : ''}`}
    >
      <div className="mx-auto w-full max-w-[1680px] px-5 lg:px-14">
        <div className="flex items-center justify-between gap-6 py-4 lg:items-end lg:pt-5 lg:pb-6">
          <div className="flex flex-1 justify-start">
            <Link
              href="/"
              aria-label="АРММАКС-СТРОЙ — на главную"
              onClick={() => setMega(null)}
              className={`shrink-0 transition-opacity hover:opacity-70 ${light ? 'text-ink-900' : 'text-white'}`}
            >
              <span className="lg:hidden">
                <Logo size="sm" />
              </span>
              <span className="hidden lg:block">
                <Logo />
              </span>
            </Link>
          </div>

          <nav className="hidden items-center lg:flex" aria-label="Основная навигация">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setMega(item.mega ? item.label : null)}
                  onFocus={() => setMega(item.mega ? item.label : null)}
                  aria-expanded={item.mega ? mega === item.label : undefined}
                  className={`${NAV_LINK} px-3.5 py-3.5 xl:px-4 ${
                    light
                      ? active || mega === item.label
                        ? 'text-brand-500'
                        : 'text-ink-900 hover:text-brand-500'
                      : active || mega === item.label
                        ? 'text-accent-400'
                        : 'text-white hover:text-accent-400'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden flex-1 items-center justify-end gap-6 lg:flex">
            <Link
              href="/kontakty#zayavka"
              onMouseEnter={() => setMega(null)}
              className={`${NAV_LINK} flex h-9 items-center px-4 tracking-[0.03em] ${
                light
                  ? 'bg-brand-500 text-white hover:bg-brand-400'
                  : 'bg-white text-ink-900 hover:bg-accent-400'
              }`}
            >
              Связаться
            </Link>
            {/* До xl телефон прячем: он не сжимается и выдавливает навигацию
                из центра. Связаться всё равно есть кнопкой, а номер стоит
                в подвале и на странице контактов. */}
            <a
              href={contacts.phonePrimary.href}
              onMouseEnter={() => setMega(null)}
              className={`font-condensed hidden text-[17px] font-bold whitespace-nowrap transition-colors xl:block ${
                light ? 'text-ink-900 hover:text-brand-500' : 'text-white hover:text-accent-400'
              }`}
            >
              {contacts.phonePrimary.display}
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[6px] lg:hidden"
          >
            <span
              className={`block h-[2px] w-6 transition-all ${light ? 'bg-ink-900' : 'bg-white'} ${open ? 'translate-y-[8px] rotate-45' : ''}`}
            />
            <span className={`block h-[2px] w-6 transition-all ${light ? 'bg-ink-900' : 'bg-white'} ${open ? 'opacity-0' : ''}`} />
            <span
              className={`block h-[2px] w-6 transition-all ${light ? 'bg-ink-900' : 'bg-white'} ${open ? '-translate-y-[8px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* У панели нет тени: при размытии 8px и сдвиге 2px она вылезала выше
          самой панели и читалась серой полосой под шапкой. Панель и так отделена
          границей, а мягкая тень выбивалась из плоской вёрстки с волосяными линиями. */}
      {activeItem?.mega && (
        <div className="hidden border-t border-line bg-surface lg:block">
          <div className="flex">
            {/* Без max-width: `pl-edge` растёт вместе с шириной окна, и при
                фиксированном потолке колонки место под текст схлопывалось —
                на 2560px от неё оставалось 24 пикселя. Проценты растут вместе
                с отступом, поэтому текст всегда получает свою долю. */}
            <div className="pl-edge w-[38%] shrink-0 bg-surface-muted py-7 pr-10">
              <h2 className="font-condensed text-[22px] leading-tight font-bold uppercase text-ink-900">
                {activeItem.mega.title}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-body-soft">{activeItem.mega.text}</p>
              <Link
                href={activeItem.mega.cta.href}
                onClick={() => setMega(null)}
                className="font-condensed mt-9 inline-flex h-9 items-center bg-brand-500 px-4 text-[15px] font-bold tracking-[0.03em] text-white uppercase transition-colors hover:bg-brand-400"
              >
                {activeItem.mega.cta.label}
              </Link>
            </div>

            <ul className="pr-edge flex-1 py-7 pl-10 xl:pl-16">
              {activeItem.mega.links.map((child) => (
                <li key={child.href} className="border-b border-line last:border-0">
                  <Link
                    href={child.href}
                    onClick={() => setMega(null)}
                    className="flex items-center gap-4 py-3.5 text-[17px] font-bold text-body-soft transition-colors hover:text-ink-900"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {open && (
        <div id="mobile-nav" className="flex flex-1 flex-col overflow-y-auto border-t border-line bg-surface lg:hidden">
          <nav className="flex flex-col px-5 py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-condensed flex items-center gap-4 border-b border-line py-5 text-2xl font-bold uppercase text-ink-900"
              >
                <Marker tone={pathname === item.href ? 'accent' : 'muted'} />
                {item.label}
              </Link>
            ))}
            {[
              { href: '/rekvizity', label: 'Реквизиты' },
              { href: '/kontakty', label: 'Контакты' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-condensed flex items-center gap-4 border-b border-line py-5 text-2xl font-bold uppercase text-ink-900"
              >
                <Marker tone={pathname === item.href ? 'accent' : 'muted'} />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto px-5 pt-10 pb-10">
            <a
              href={contacts.phonePrimary.href}
              onClick={() => setOpen(false)}
              className="font-condensed text-3xl font-bold text-brand-500"
            >
              {contacts.phonePrimary.display}
            </a>
            <p className="mt-3 text-sm text-body-soft">{contacts.hours}</p>
          </div>
        </div>
      )}
    </header>
  )
}
