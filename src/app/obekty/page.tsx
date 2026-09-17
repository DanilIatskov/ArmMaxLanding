import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { ButtonLink, Section } from '@/components/ui'
import { BreadcrumbsJsonLd } from '@/components/JsonLd'
import { ObjectCard } from '@/components/ObjectCard'
import { objects } from '@/content/objects'

export const metadata: Metadata = {
  title: 'Объекты — построено и сдано',
  description:
    'Объекты капитального строительства, реализованные АРММАКС-СТРОЙ в Новосибирске и Сибирском федеральном округе: тип объекта, город, объём работ и год.',
  alternates: { canonical: '/obekty' },
}

export default function ObjectsPage() {
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: 'Объекты', url: '/obekty' }]} />
      <PageHero
        eyebrow="Портфолио"
        title="Объекты"
        lead="Город, тип объекта, объём работ и год."
        breadcrumbs={[{ name: 'Объекты', url: '/obekty' }]}
      />

      <Section>
        {objects.length > 0 ? (
          <>
            <ul className="grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
              {objects.map((object) => (
                <li key={object.slug} className="h-full bg-surface">
                  <ObjectCard object={object} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="max-w-2xl border border-dashed border-line-strong p-10">
            <h2 className="text-xl leading-snug">Раздел готовится</h2>
            <p className="mt-5 text-[15px] leading-relaxed">
              Готовим материалы по объектам. Скоро здесь появятся карточки с городом, типом,
              годом и объёмом работ.
            </p>
            <div className="mt-8">
              <ButtonLink href="/kontakty#zayavka" variant="outline">
                Связаться
              </ButtonLink>
            </div>
          </div>
        )}
      </Section>

      <Section tone="muted">
        <h2 className="rule-accent text-2xl">География работ</h2>
        <p className="mt-8 max-w-2xl text-[15px] leading-relaxed">
          Работаем по Сибирскому федеральному округу. Здесь появится карта с метками объектов.
        </p>
        <div
          aria-hidden
          className="mt-10 aspect-[21/9] w-full rounded-card border border-dashed border-line-strong bg-surface"
        />
      </Section>
    </>
  )
}
