import Link from 'next/link'
import { Container } from './ui'

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
    <div className="border-b border-line bg-surface-muted">
      <Container className="py-14 md:py-20">
        {breadcrumbs && (
          <nav aria-label="Хлебные крошки" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-body-soft">
              <li>
                <Link href="/" className="hover:text-brand-500">
                  Главная
                </Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.url} className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-body">{crumb.name}</span>
                  ) : (
                    <Link href={crumb.url} className="hover:text-brand-500">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-brand-500 uppercase">{eyebrow}</p>
        )}
        <h1 className="max-w-4xl text-3xl leading-[1.12] md:text-[2.75rem]">{title}</h1>
        {lead && <p className="mt-7 max-w-2xl text-lg leading-relaxed">{lead}</p>}
      </Container>
    </div>
  )
}
