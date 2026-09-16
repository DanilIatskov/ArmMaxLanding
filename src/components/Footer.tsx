import Link from 'next/link'
import { Logo } from './Logo'
import { Container } from './ui'
import { mainNav, serviceNav } from '@/content/nav'
import { company, contacts, requisites } from '@/content/company'

export function Footer() {
  return (
    <footer className="bg-ink-900 pt-16 pb-8 text-white/60">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo tone="light" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed">{company.tagline}</p>
          </div>

          <nav aria-label="Услуги">
            <h2 className="mb-5 text-sm font-semibold tracking-wide text-white">Услуги</h2>
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

          <nav aria-label="Разделы сайта">
            <h2 className="mb-5 text-sm font-semibold tracking-wide text-white">Компания</h2>
            <ul className="space-y-3 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-accent-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-5 text-sm font-semibold tracking-wide text-white">Контакты</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={contacts.phonePrimary.href} className="text-base font-semibold text-white">
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

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {requisites.legalName}
          </p>
          <Link href="/politika-konfidencialnosti" className="transition-colors hover:text-accent-400">
            Политика обработки персональных данных
          </Link>
        </div>
      </Container>
    </footer>
  )
}
