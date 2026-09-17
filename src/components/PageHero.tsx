import Link from 'next/link'
import { Container } from './ui'
import { Marker } from './Marker'

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
    // Компенсация фиксированной шапки: 76px на мобильном, 100px от lg.
    <div className="border-b border-line bg-surface-muted pt-[76px] lg:pt-[100px]">
      <Container className="py-14 md:py-24">
        {breadcrumbs && (
          <nav aria-label="Хлебные крошки" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-body-soft">
              <li>
                <Link href="/" className="transition-colors hover:text-brand-500">
                  Главная
                </Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.url} className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-body">{crumb.name}</span>
                  ) : (
                    <Link href={crumb.url} className="transition-colors hover:text-brand-500">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <p className="eyebrow flex items-center gap-3 text-body-soft">
            <Marker />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-6 max-w-5xl text-[clamp(2.1rem,5vw,4.25rem)] leading-[1.02]">{title}</h1>
        {lead && <p className="mt-8 max-w-2xl text-lg leading-relaxed">{lead}</p>}
      </Container>
    </div>
  )
}
