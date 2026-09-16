import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { ButtonLink, Section } from '@/components/ui'
import { BreadcrumbsJsonLd } from '@/components/JsonLd'
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
        lead="Город, тип объекта, объём работ и год. Раздел ведёт администратор сайта."
        breadcrumbs={[{ name: 'Объекты', url: '/obekty' }]}
      />

      <Section>
        {objects.length > 0 ? (
          <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {objects.map((object) => (
              <li key={object.slug} className="overflow-hidden rounded-card bg-surface shadow-card">
                <div className="aspect-[4/3] bg-surface-sunken" />
                <div className="p-7">
                  <p className="text-sm text-body-soft">
                    {object.city} · {object.type} · {object.year}
                  </p>
                  <h2 className="mt-3 text-lg leading-snug">{object.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed">{object.scope}</p>
                  {object.area && <p className="mt-2 text-sm text-body-soft">{object.area}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="max-w-2xl rounded-card border border-dashed border-line-strong p-10">
            <h2 className="text-xl leading-snug">Раздел готовится</h2>
            <p className="mt-5 text-[15px] leading-relaxed">
              Вёрстка карточек и карта с метками готовы — не хватает материалов. Для каждого объекта
              нужны: название, город, тип, год, объём работ и фотографии, которые разрешено
              публиковать.
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
          Работаем по Сибирскому федеральному округу. Карта с метками объектов появится здесь после
          подключения Яндекс.Карт — ключ задаётся переменной NEXT_PUBLIC_YANDEX_MAPS_API_KEY.
        </p>
        <div
          aria-hidden
          className="mt-10 aspect-[21/9] w-full rounded-card border border-dashed border-line-strong bg-surface"
        />
      </Section>
    </>
  )
}
