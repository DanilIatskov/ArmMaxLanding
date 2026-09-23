import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { Pending, Section } from '@/components/ui'
import { BreadcrumbsJsonLd } from '@/components/JsonLd'
import { contacts, requisites } from '@/content/company'

export const metadata: Metadata = {
  // absolute: имя компании уже в заголовке, шаблон дописал бы его второй раз
  title: { absolute: 'Реквизиты ООО «АРММАКС-СТРОЙ» — ИНН, ОГРН, адрес' },
  description:
    'Полные реквизиты ООО «АРММАКС-СТРОЙ»: наименование, ИНН, КПП, ОГРН, юридический адрес, банковские реквизиты и контакты.',
  alternates: { canonical: '/rekvizity' },
}

/** Страница для службы безопасности заказчика: всё в одном месте, без поиска по сайту. */
export default function RequisitesPage() {
  const rows: { label: string; value: string | null }[] = [
    { label: 'Полное наименование', value: requisites.fullLegalName },
    { label: 'Сокращённое наименование', value: requisites.legalName },
    { label: 'ИНН', value: requisites.inn },
    { label: 'КПП', value: requisites.kpp },
    { label: 'ОГРН', value: requisites.ogrn },
    { label: 'Дата регистрации', value: requisites.registeredAt },
    { label: 'ОКВЭД', value: requisites.okved },
    { label: 'Юридический адрес', value: requisites.legalAddress },
    { label: 'Фактический адрес', value: requisites.actualAddress },
    { label: 'Директор', value: requisites.director },
    { label: 'Телефон', value: contacts.phone.display },
    { label: 'Электронная почта', value: contacts.email },
  ]

  const bankRows: { label: string; value: string | null }[] = [
    { label: 'Банк', value: requisites.bank.name },
    { label: 'Расчётный счёт', value: requisites.bank.account },
    { label: 'Корреспондентский счёт', value: requisites.bank.corrAccount },
    { label: 'БИК', value: requisites.bank.bik },
  ]

  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: 'Реквизиты', url: '/rekvizity' }]} />
      <PageHero
        eyebrow="Реквизиты"
        title="Реквизиты компании"
        lead="Данные для проверки контрагента и подготовки договора."
        breadcrumbs={[{ name: 'Реквизиты', url: '/rekvizity' }]}
      />

      <Section>
        <div className="max-w-3xl">
          <dl className="divide-y divide-line border-y border-line">
            {rows.map((row) => (
              <div key={row.label} className="grid gap-2 py-5 sm:grid-cols-5 sm:gap-8">
                <dt className="text-sm text-body-soft sm:col-span-2">{row.label}</dt>
                <dd className="text-[15px] text-ink-900 sm:col-span-3">
                  {row.value ?? <Pending what="Данные" />}
                </dd>
              </div>
            ))}
          </dl>

          <h2 className="rule-accent mt-16 text-2xl">Банковские реквизиты</h2>
          <dl className="mt-10 divide-y divide-line border-y border-line">
            {bankRows.map((row) => (
              <div key={row.label} className="grid gap-2 py-5 sm:grid-cols-5 sm:gap-8">
                <dt className="text-sm text-body-soft sm:col-span-2">{row.label}</dt>
                <dd className="text-[15px] text-ink-900 sm:col-span-3">
                  {row.value ?? <Pending what="Данные" />}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>
    </>
  )
}
