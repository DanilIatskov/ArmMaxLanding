import Link from 'next/link'
import { Container } from './ui'
import { FacetTile } from './FacetTile'
import { Marker } from './Marker'

/**
 * Шапка внутренней страницы. Тёмная, с той же гранёной стеной, что в блоке
 * «Объекты капитального строительства»: страницы получают общий вход,
 * а не разъезжаются по оформлению.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumbs,
}: {
  eyebrow?: string
  title: string
  lead?: string
  breadcrumbs?: { name: string; url: string }[]
}) {
  return (
    // pt компенсирует фиксированную шапку: 76px на мобильном, 100px от lg.
    <div className="relative overflow-hidden bg-ink-950 pt-[76px] text-white lg:pt-[100px]">
      {/* Маска гасит стену к центру, чтобы она читалась как уходящая за край. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 hidden h-full w-[38%] opacity-40 [mask-image:linear-gradient(to_left,black_35%,transparent)] lg:block"
      >
        <FacetTile seed={3} cells={6} className="h-full w-full" />
      </div>

      <Container className="relative py-14 md:py-24">
        {breadcrumbs && (
          <nav aria-label="Хлебные крошки" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-white/45">
              <li>
                <Link href="/" className="transition-colors hover:text-accent-400">
                  Главная
                </Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.url} className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-white/75">{crumb.name}</span>
                  ) : (
                    <Link href={crumb.url} className="transition-colors hover:text-accent-400">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <p className="eyebrow flex items-center gap-3 text-white/55">
            <Marker />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-6 max-w-5xl text-[clamp(2.1rem,5vw,4.25rem)] leading-[1.02] text-white">
          {title}
        </h1>
        {lead && <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65">{lead}</p>}
      </Container>
    </div>
  )
}
