import Link from 'next/link'
import type { ComponentProps } from 'react'

/**
 * Ссылка со стрелкой, которая на наведении уезжает вправо, а следом
 * въезжает вторая — приём Suffolk. Обе стрелки живут в окне с overflow-hidden.
 */
export function ArrowLink({
  href,
  children,
  tone = 'dark',
  className = '',
  ...rest
}: { tone?: 'dark' | 'light' } & ComponentProps<typeof Link>) {
  const colors =
    tone === 'light'
      ? 'text-white hover:text-accent-400'
      : 'text-ink-900 hover:text-brand-500'

  return (
    <Link
      href={href}
      className={`group eyebrow inline-flex items-center gap-3 transition-colors ${colors} ${className}`}
      {...rest}
    >
      {children}
      <span aria-hidden className="relative block h-3 w-4 overflow-hidden">
        <Arrow className="absolute inset-0 transition-transform duration-300 ease-out group-hover:translate-x-5" />
        <Arrow className="absolute inset-0 -translate-x-5 transition-transform duration-300 ease-out group-hover:translate-x-0" />
      </span>
    </Link>
  )
}

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 12" fill="none" className={`h-3 w-4 ${className}`}>
      <path d="M0 6h14M9.5 1.5 14 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
