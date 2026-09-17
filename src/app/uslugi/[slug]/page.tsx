import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { LeadForm } from '@/components/LeadForm'
import { Section } from '@/components/ui'
import { BreadcrumbsJsonLd } from '@/components/JsonLd'
import { getService, services } from '@/content/services'

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)

  if (!service) return {}

  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: { canonical: `/uslugi/${service.slug}` },
    // openGraph здесь не задаём: свой блок заменил бы родительский целиком
    // и страница осталась бы без картинки превью. Заголовок и описание Next
    // подставит из title и description выше.
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getService(slug)

  if (!service) notFound()

  const others = services.filter((s) => s.slug !== service.slug)

  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: 'Услуги', url: '/uslugi' },
          { name: service.title, url: `/uslugi/${service.slug}` },
        ]}
      />
      <PageHero
        eyebrow="Услуга"
        title={service.lead}
        breadcrumbs={[
          { name: 'Услуги', url: '/uslugi' },
          { name: service.title, url: `/uslugi/${service.slug}` },
        ]}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="space-y-6 text-lg leading-relaxed">
              {service.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <h2 className="rule-accent mt-14 text-2xl">Что входит</h2>
            <ul className="mt-10 space-y-5">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-4 text-[15px] leading-relaxed">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent-500" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-card border border-line bg-surface-muted p-8 lg:sticky lg:top-28">
              <h2 className="text-lg leading-snug">Обсудить объект</h2>
              <p className="mt-3 text-sm leading-relaxed">
                Опишите задачу — ответим в рабочее время.
              </p>
              <div className="mt-7">
                <LeadForm />
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="muted">
        <h2 className="rule-accent text-2xl">Другие этапы комплекса</h2>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-card bg-line md:grid-cols-2">
          {others.map((other) => (
            <li key={other.slug} className="bg-surface">
              <Link
                href={`/uslugi/${other.slug}`}
                className="invert-hover group block h-full p-8"
              >
                <h3 className="text-lg leading-snug transition-colors group-hover:text-brand-500">
                  {other.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed">{other.short}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
