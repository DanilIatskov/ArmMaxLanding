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

/**
 * Сайт как объект.
 *
 * Организация уже описана выше, но поисковику нужно ещё и «чей это сайт»:
 * WebSite с ссылкой на ту же организацию склеивает домен, название и юрлицо в
 * одну сущность. Без него страницы существуют сами по себе, и в карточке
 * компании Яндекс охотнее показывает данные со сторонних каталогов, чем с
 * самого сайта.
 */
export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: site.url,
    name: requisites.legalName,
    alternateName: company.name,
    inLanguage: 'ru-RU',
    publisher: { '@id': `${site.url}/#organization` },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
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
