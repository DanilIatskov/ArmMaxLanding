import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { LeadForm } from '@/components/LeadForm'
import { Section } from '@/components/ui'
import { BreadcrumbsJsonLd } from '@/components/JsonLd'
import { contacts } from '@/content/company'

export const metadata: Metadata = {
  // absolute: имя компании уже в заголовке, шаблон дописал бы его второй раз
  title: { absolute: 'Контакты АРММАКС-СТРОЙ — телефон, адрес, Новосибирск' },
  description:
    'Телефоны, почта и адрес офиса ООО «АРММАКС-СТРОЙ» в Новосибирске: ул. Пролетарская, 54. Форма заявки на строительство.',
  alternates: { canonical: '/kontakty' },
}

export default function ContactsPage() {
  const messengers = contacts.messengers.filter((m) => m.href)

  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: 'Контакты', url: '/kontakty' }]} />
      <PageHero
        eyebrow="Контакты"
        title="Связаться с нами"
        lead="Позвоните или оставьте заявку — ответим в рабочее время."
        breadcrumbs={[{ name: 'Контакты', url: '/kontakty' }]}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <dl className="space-y-8">
              <div>
                <dt className="text-sm text-body-soft">Телефоны</dt>
                <dd className="mt-3 space-y-2">
                  <a
                    href={contacts.phonePrimary.href}
                    className="block text-2xl font-semibold text-ink-900 hover:text-brand-500"
                  >
                    {contacts.phonePrimary.display}
                  </a>
                  <a
                    href={contacts.phoneSecondary.href}
                    className="block text-lg text-body hover:text-brand-500"
                  >
                    {contacts.phoneSecondary.display}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-sm text-body-soft">Электронная почта</dt>
                <dd className="mt-3">
                  <a href={`mailto:${contacts.email}`} className="text-lg text-ink-900 hover:text-brand-500">
                    {contacts.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-sm text-body-soft">Офис</dt>
                <dd className="mt-3 text-lg text-ink-900">{contacts.office}</dd>
              </div>

              <div>
                <dt className="text-sm text-body-soft">Часы работы</dt>
                <dd className="mt-3 text-lg text-ink-900">{contacts.hours}</dd>
              </div>

              {messengers.length > 0 && (
                <div>
                  <dt className="text-sm text-body-soft">Мессенджеры</dt>
                  <dd className="mt-3 flex flex-wrap gap-3">
                    {messengers.map((m) => (
                      <a
                        key={m.label}
                        href={m.href!}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="rounded-card border border-line-strong px-5 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:border-brand-500 hover:text-brand-500"
                      >
                        {m.label}
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div id="zayavka" className="scroll-mt-28 lg:col-span-7">
            <div className="rounded-card border border-line bg-surface-muted p-8 lg:p-10">
              <h2 className="text-2xl">Оставить заявку</h2>
              <p className="mt-4 text-[15px] leading-relaxed">
                Коротко опишите объект: что, где и на какой стадии. Так первый разговор будет
                предметным.
              </p>
              <div className="mt-8">
                <LeadForm />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <h2 className="rule-accent text-2xl">Как доехать</h2>
        <p className="mt-8 max-w-2xl text-[15px] leading-relaxed">
          {contacts.office}. Здесь появится карта проезда.
        </p>
        <div
          aria-hidden
          className="mt-10 aspect-[21/9] w-full rounded-card border border-dashed border-line-strong bg-surface"
        />
      </Section>
    </>
  )
}
