import { company, contacts, requisites, site } from '@/content/company'

/**
 * Микроразметка организации.
 *
 * Задача — чтобы при поиске «АРММАКС-СТРОЙ» Яндекс показывал именно эту компанию,
 * а не однофамильцев: «Армакс» в Курске, armax.group, ООО «Армакс Строй» в Омске,
 * дорожную Armax и компанию по утилизации. Поэтому здесь максимум
 * идентифицирующих данных: полное наименование, ИНН, адрес, телефоны.
 */
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${site.url}/#organization`,
    name: requisites.legalName,
    alternateName: [company.name, company.latinName],
    url: site.url,
    description: company.tagline,
    telephone: [contacts.phonePrimary.display, contacts.phoneSecondary.display],
    email: contacts.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'RU',
      addressRegion: 'Новосибирская область',
      addressLocality: 'Новосибирск',
      streetAddress: 'ул. Б. Хмельницкого, 33/1, офис 6',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: contacts.geo.lat,
      longitude: contacts.geo.lon,
    },
    openingHours: 'Mo-Fr 09:00-18:00',
    areaServed: { '@type': 'AdministrativeArea', name: 'Сибирский федеральный округ' },
    // ИНН и ОГРН — то, по чему компанию сверяет служба безопасности.
    // Пока заказчик не подтвердил юрлицо, поля не выводим: неверный ИНН хуже отсутствующего.
    ...(requisites.inn ? { taxID: requisites.inn } : {}),
    ...(requisites.ogrn ? { identifier: requisites.ogrn } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function BreadcrumbsJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.url}`,
    })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
