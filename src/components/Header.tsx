'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Logo } from './Logo'
import { mainNav } from '@/content/nav'
import { contacts } from '@/content/company'
import { Container } from './ui'

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-sm">
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" aria-label="АРММАКС-СТРОЙ — на главную">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Основная навигация">
            {mainNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`text-sm font-medium transition-colors ${
                    active ? 'text-brand-500' : 'text-body hover:text-ink-900'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={contacts.phonePrimary.href}
              className="text-[15px] font-semibold whitespace-nowrap text-ink-900 transition-colors hover:text-brand-500"
            >
              {contacts.phonePrimary.display}
            </a>
            <Link
              href="/kontakty#zayavka"
              className="rounded-card bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
            >
              Связаться
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span
              className={`block h-[2px] w-6 bg-ink-900 transition-transform ${open ? 'translate-y-[7px] rotate-45' : ''}`}
            />
            <span className={`block h-[2px] w-6 bg-ink-900 transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span
              className={`block h-[2px] w-6 bg-ink-900 transition-transform ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </Container>

      {open && (
        <div id="mobile-nav" className="border-t border-line bg-surface lg:hidden">
          <Container className="flex flex-col py-4">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 text-base font-medium text-ink-900 last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={contacts.phonePrimary.href}
              onClick={() => setOpen(false)}
              className="pt-5 text-lg font-semibold text-brand-500"
            >
              {contacts.phonePrimary.display}
            </a>
          </Container>
        </div>
      )}
    </header>
  )
}
