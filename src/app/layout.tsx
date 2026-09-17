import type { Metadata, Viewport } from 'next'
import { Manrope, Roboto_Condensed } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { OrganizationJsonLd } from '@/components/JsonLd'
import { YandexMetrika } from '@/components/YandexMetrika'
import { company, requisites, site } from '@/content/company'

// Manrope: плотный гротеск с полной кириллицей. Референсы (suffolk.com,
// skender.com) держатся на характерном гротеске с тугим трекингом — на Roboto
// этот тон не собирается, он слишком нейтральный.
const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

// Roboto Condensed — логотип, навигация, заголовок первого экрана и крупные
// цифры. В заголовке работают два веса сразу: Bold на утверждении,
// Regular на пояснении; цифры набраны Light.
// Узкий рубленый гротеск: набирает много пунктов меню в одну строку
// и держит логотип плотным пятном без иконки.
const condensed = Roboto_Condensed({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '700'],
  variable: '--font-roboto-condensed',
  display: 'swap',
})

/**
 * Превью-сборка (GitHub Pages) не должна попадать в индекс: дубль сайта
 * в выдаче конкурирует с боевым доменом и сливает его позиции.
 */
const noindex = process.env.NOINDEX === '1'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${requisites.legalName} — строительство под ключ в Новосибирске`,
    template: `%s — ${company.name}`,
  },
  description:
    'ООО «АРММАКС-СТРОЙ» — генподряд и строительство объектов капитального строительства в Новосибирске и Сибирском федеральном округе: технические условия, земельный участок, проектирование, общестрой, ввод в эксплуатацию.',
  applicationName: company.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: requisites.legalName,
    url: site.url,
    title: `${requisites.legalName} — строительство под ключ`,
    description: company.tagline,
  },
  robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  ...(site.yandexVerification ? { verification: { yandex: site.yandexVerification } } : {}),
}

export const viewport: Viewport = {
  themeColor: '#0b1028',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${condensed.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-card focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-white"
        >
          Перейти к содержанию
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <OrganizationJsonLd />
        <YandexMetrika />
      </body>
    </html>
  )
}
