import Link from 'next/link'
import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/ui'
import { BreadcrumbsJsonLd } from '@/components/JsonLd'
import { services } from '@/content/services'

export const metadata: Metadata = {
  title: 'Услуги: строительство под ключ в Новосибирске',
  description:
    'Полный цикл по объекту капитального строительства: технические условия и точки подключения, земельный участок, проектирование АР/КЖ/КМ/АС, общестрой и инженерия, ввод в эксплуатацию.',
  alternates: { canonical: '/uslugi' },
}

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: 'Услуги', url: '/uslugi' }]} />
      <PageHero
        eyebrow="Услуги"
        title="Комплекс работ по объекту капитального строительства"
        lead="Каждый этап можно заказать отдельно, но ценность появляется, когда их ведёт одна компания: никто не теряет контекст на стыках."
        breadcrumbs={[{ name: 'Услуги', url: '/uslugi' }]}
      />

      <Section>
        <ul className="space-y-px overflow-hidden rounded-card bg-line">
          {services.map((service, i) => (
            <li key={service.slug} className="bg-surface">
              <Link
                href={`/uslugi/${service.slug}`}
                className="invert-hover group grid gap-5 p-8 md:grid-cols-12 md:gap-10 lg:p-10"
              >
                <span className="text-sm font-semibold text-brand-500 transition-colors group-hover:text-accent-400 md:col-span-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="text-xl leading-snug transition-colors group-hover:text-brand-500 md:col-span-4">
                  {service.title}
                </h2>
                <p className="text-[15px] leading-relaxed md:col-span-6">{service.short}</p>
                <span className="text-sm font-semibold text-brand-500 transition-colors group-hover:text-accent-400 md:col-span-1 md:text-right">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
