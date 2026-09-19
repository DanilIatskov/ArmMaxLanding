import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { Marker } from './Marker'

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1680px] px-5 lg:px-14 ${className}`}>{children}</div>
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
    dark: 'bg-ink-950 text-white/60',
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
    <header className="max-w-4xl">
      {eyebrow && (
        <p className={`eyebrow flex items-center gap-3 ${tone === 'dark' ? 'text-white/50' : 'text-body-soft'}`}>
          <Marker />
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-6 text-[clamp(1.9rem,4vw,3.5rem)] leading-[1.03] ${tone === 'dark' ? 'text-white' : ''}`}
      >
        {title}
      </h2>
      {lead && (
        <p className={`mt-8 max-w-2xl text-lg leading-relaxed ${tone === 'dark' ? 'text-white/60' : 'text-body'}`}>
          {lead}
        </p>
      )}
    </header>
  )
}

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'lg' | 'md' | 'sm'
  className?: string
}

const buttonBase =
  'inline-flex items-center justify-center gap-2 font-bold uppercase transition-colors duration-200'

/**
 * Размер задаётся свойством, а не классом снаружи: в Tailwind порядок классов
 * в атрибуте ничего не решает, побеждает тот, что идёт позже в собранном
 * файле. Переданный снаружи `px-5` проигрывал базовому `px-8` молча.
 *
 * `sm` повторяет габарит кнопок первого экрана — 36 точек в высоту.
 * Служебным элементам вроде уведомления о cookie крупнее не нужно.
 */
const buttonSizes = {
  lg: 'gap-3 px-10 py-5 text-[15px] tracking-[0.1em]',
  md: 'gap-2 px-8 py-4 text-[13px] tracking-[0.1em]',
  sm: 'gap-2 h-9 px-4 text-[12px] tracking-[0.06em]',
}

const buttonVariants = {
  primary: 'bg-brand-500 text-white hover:bg-brand-400',
  outline: 'border border-line-strong text-ink-900 hover:border-brand-500 hover:text-brand-500',
  ghost: 'border border-white/30 text-white hover:border-white hover:bg-white hover:text-ink-900',
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: ButtonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={`${buttonBase} ${buttonSizes[size]} ${buttonVariants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  )
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: ButtonProps & ComponentProps<'button'>) {
  return (
    <button
      className={`${buttonBase} ${buttonSizes[size]} ${buttonVariants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

/** Поле, которое заказчик ещё не заполнил. Видно и на сайте, и на проверке. */
export function Pending({ what }: { what: string }) {
  return (
    <span className="inline-flex items-center bg-surface-sunken px-2 py-0.5 text-sm text-body-soft italic">
      {what} — уточняется
    </span>
  )
}
