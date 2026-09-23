import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/ui'
import { BreadcrumbsJsonLd } from '@/components/JsonLd'
import { partners } from '@/content/projects'
import { ProjectsGrid } from '@/components/ProjectsGrid'
import { ObjectsMap } from '@/components/ObjectsMap'
import { SectionHeading } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Объекты: построено и сдано',
  description:
    'Объекты, в которых участвовала команда АРММАКС-СТРОЙ: Амурский ГПЗ, Омский НПЗ, «Сила Сибири», Арктик СПГ, космодром «Восточный». Заказчики, отрасли и объём работ.',
  alternates: { canonical: '/obekty' },
}

export default function ObjectsPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: 'Объекты', url: '/obekty' }]} />
      <PageHero
        eyebrow="Портфолио"
        title="Объекты"
        lead="Промышленные и инфраструктурные объекты, в которых участвовала команда. По каждому — заказчик, отрасль и объём работ."
        breadcrumbs={[{ name: 'Объекты', url: '/obekty' }]}
      />

      <Section tone="muted">
        <SectionHeading
          eyebrow="Объекты"
          title="Где работала команда"
          lead="Промышленные и инфраструктурные объекты федерального масштаба. Работы велись в составе ГК «АРММАКС» — той же командой, что сегодня работает в АРММАКС-СТРОЙ."
        />
        <ProjectsGrid formHref="/kontakty#zayavka" />
      </Section>

      <Section>
        <h2 className="rule-accent text-2xl">Заказчики и партнёры</h2>
        <p className="mt-8 max-w-2xl text-[15px] leading-relaxed">
          Организации, с которыми компания работала по договорам. Перечень из тендерной анкеты.
        </p>
        <ul className="mt-10 grid gap-x-10 gap-y-px border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <li key={partner.id} className="border-b border-line py-5 text-[15px]">
              {partner.name}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted">
        <h2 className="rule-accent text-2xl">География работ</h2>
        <p className="mt-8 max-w-2xl text-[15px] leading-relaxed">
          Офис в Новосибирске, объекты — по стране: от Гыданского полуострова до Амурской
          области. На карте отмечены площадки, в которых участвовала команда.
        </p>
        <ObjectsMap />
      </Section>
    </>
  )
}
