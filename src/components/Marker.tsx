/**
 * Квадратный маркер перед надзаголовками — опорный мотив всей вёрстки.
 * У Suffolk он красный, у нас — из палитры логотипа: знак собран
 * ровно из таких же гранёных квадратов, так что мотив свой, не заимствованный.
 */
export function Marker({
  tone = 'accent',
  className = '',
}: {
  tone?: 'accent' | 'brand' | 'muted' | 'light'
  className?: string
}) {
  const tones = {
    accent: 'bg-accent-500',
    brand: 'bg-brand-700',
    muted: 'bg-line-strong',
    light: 'bg-white/40',
  }

  return <span aria-hidden className={`inline-block h-3 w-3 shrink-0 ${tones[tone]} ${className}`} />
}
