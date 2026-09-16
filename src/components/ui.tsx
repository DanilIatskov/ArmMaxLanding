import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-5 md:px-8 ${className}`}>{children}</div>
}

export function Section({
  children,
  tone = 'light',
  className = '',
  id,
}: {
  children: ReactNode
  tone?: 'light' | 'muted' | 'dark'
  className?: string
  id?: string
}) {
  const tones = {
    light: 'bg-surface',
    muted: 'bg-surface-muted',
    dark: 'bg-ink-900 text-white/70',
  }

  return (
    <section id={id} className={`py-16 md:py-section ${tones[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = 'light',
}: {
  eyebrow?: string
  title: string
  lead?: string
  tone?: 'light' | 'dark'
}) {
  return (
    <header className="max-w-3xl">
      {eyebrow && (
        <p
          className={`mb-4 text-xs font-semibold tracking-[0.2em] uppercase ${
            tone === 'dark' ? 'text-accent-400' : 'text-brand-500'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`rule-accent text-3xl md:text-[2.5rem] md:leading-[1.14] ${
          tone === 'dark' ? 'text-white' : ''
        }`}
      >
        {title}
      </h2>
      {lead && (
        <p className={`mt-7 text-lg leading-relaxed ${tone === 'dark' ? 'text-white/65' : 'text-body'}`}>
          {lead}
        </p>
      )}
    </header>
  )
}

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  className?: string
}

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-card px-7 py-4 text-sm font-semibold tracking-wide transition-colors duration-200'

const buttonVariants = {
  primary: 'bg-brand-500 text-white hover:bg-brand-400',
  outline: 'border border-line-strong text-ink-900 hover:border-brand-500 hover:text-brand-500',
  ghost: 'border border-white/25 text-white hover:border-accent-500 hover:text-accent-400',
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className = '',
  ...rest
}: ButtonProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={`${buttonBase} ${buttonVariants[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  )
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: ButtonProps & ComponentProps<'button'>) {
  return (
    <button className={`${buttonBase} ${buttonVariants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

/** Поле, которое заказчик ещё не заполнил. Видно и на сайте, и на проверке. */
export function Pending({ what }: { what: string }) {
  return (
    <span className="inline-flex items-center rounded-card bg-surface-sunken px-2 py-0.5 text-sm text-body-soft italic">
      {what} — уточняется
    </span>
  )
}
