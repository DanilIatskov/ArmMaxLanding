import Link from 'next/link'
import { Logo } from './Logo'
import { Marker } from './Marker'
import { serviceNav } from '@/content/nav'
import { company, contacts, requisites } from '@/content/company'

const BIG_NAV = [
  { href: '/uslugi', label: 'Услуги' },
  { href: '/obekty', label: 'Объекты' },
  { href: '/o-kompanii', label: 'О компании' },
  { href: '/rekvizity', label: 'Реквизиты' },
  { href: '/kontakty', label: 'Контакты' },
]

export function Footer() {
  return (
    <footer className="bg-ink-950 pt-16 pb-10 text-white/55 md:pt-24">
      <div className="mx-auto w-full max-w-[1680px] px-5 lg:px-14">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block text-white transition-opacity hover:opacity-80">
              <Logo size="lg" />
            </Link>
            <p className="mt-7 max-w-xs text-[15px] leading-relaxed">{company.tagline}</p>
          </div>

          {/* Крупная навигация — приём из футера Suffolk. */}
          <nav className="lg:col-span-4" aria-label="Разделы сайта">
            <ul>
              {BIG_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group font-condensed flex items-center gap-4 py-2 text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.3] font-bold uppercase text-white transition-colors hover:text-accent-400"
                  >
                    <Marker tone="light" className="opacity-25 transition-opacity group-hover:opacity-100" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid gap-12 sm:grid-cols-2 lg:col-span-4">
            <nav aria-label="Услуги">
              <h2 className="eyebrow mb-5 text-white/40">Услуги</h2>
              <ul className="space-y-3 text-sm">
                {serviceNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-accent-400">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="eyebrow mb-5 text-white/40">Контакты</h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href={contacts.phonePrimary.href} className="text-lg font-bold text-white">
                    {contacts.phonePrimary.display}
                  </a>
                </li>
                <li>
                  <a href={contacts.phoneSecondary.href} className="transition-colors hover:text-accent-400">
                    {contacts.phoneSecondary.display}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contacts.email}`} className="transition-colors hover:text-accent-400">
                    {contacts.email}
                  </a>
                </li>
                <li className="pt-1 leading-relaxed">{contacts.office}</li>
                <li>{contacts.hours}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {requisites.legalName}
          </p>
          <div className="flex flex-col gap-2 md:flex-row md:gap-8">
            <Link href="/politika-konfidencialnosti" className="transition-colors hover:text-accent-400">
              Политика обработки персональных данных
            </Link>
            <Link href="/politika-cookie" className="transition-colors hover:text-accent-400">
              Политика использования cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
