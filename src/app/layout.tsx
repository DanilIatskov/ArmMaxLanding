import type { Metadata, Viewport } from 'next'
import { Manrope, Roboto_Condensed } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/JsonLd'
import { YandexMetrika } from '@/components/YandexMetrika'
import { CookieNotice } from '@/components/CookieNotice'
import { Splash } from '@/components/Splash'
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

/**
 * Адрес, относительно которого считаются og:url, og:image и canonical.
 *
 * Боевой домен ещё не куплен, а ссылку на превью заказчик пересылает в
 * мессенджере — и тот идёт за картинкой на боевой домен armmax.ltd,
 * так что карточка приходит пустой. Поэтому превью-сборка подставляет свой
 * адрес: SITE_ORIGIN и BASE_PATH задаёт workflow деплоя, в боевой сборке их
 * нет и берётся домен из контента.
 */
const basePath = process.env.BASE_PATH ?? ''
const siteUrl = process.env.SITE_ORIGIN ? `${process.env.SITE_ORIGIN}${basePath}` : site.url

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} — генподрядчик полного цикла в Сибири`,
    template: `%s — ${company.name}`,
  },
  description:
    'Объекты капитального строительства в Новосибирске и Сибирском федеральном округе — от технических условий до ввода в эксплуатацию. 25 лет работы, шесть наград Минстроя.',
  applicationName: company.name,
  alternates: { canonical: '/' },
  // Картинка превью лежит в public/og-preview-2.jpg и объявлена здесь руками.
  // Файловая конвенция (src/app/opengraph-image.jpg) не подошла: она молча
  // перебивает openGraph.images целиком, а подпись к картинке берёт только
  // из .alt.txt — его читает webpack-загрузчик, тогда как сборка идёт на
  // Turbopack, и alt терялся. Пересобрать картинку можно из
  // images/og-preview.html — там та же вёрстка, что на первом экране.
  // Соцсети кешируют превью по URL, поэтому новую версию кладём под новым
  // именем — номер в og-preview-2.jpg для этого и нужен. Пересобирает
  // картинку npm run og, имя задаётся там же.
  //
  // title и description здесь намеренно не заданы: openGraph наследуется
  // целиком, и с ними ссылка на любую внутреннюю страницу показывала бы
  // заголовок главной. Без них Next подставляет title и description
  // самой страницы.
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: requisites.legalName,
    url: siteUrl,
    images: [
      {
        // Адрес абсолютный, а не '/og-preview-2.jpg': на превью сайт лежит
        // в подпапке /<repo>, и путь от корня увёл бы в пустоту.
        url: `${siteUrl}/og-preview-2.jpg`,
        width: 1200,
        height: 630,
        alt: 'ООО «АРММАКС-СТРОЙ»: строительство под ключ — от технических условий до ввода в эксплуатацию. Новосибирск и Сибирский федеральный округ.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
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
    // suppressHydrationWarning — из-за заставки: скрипт в <head> успевает
    // поставить на <html> атрибут data-splash до гидратации, и React считает
    // это расхождением с серверной разметкой. Флаг гасит предупреждение
    // только для атрибутов самого <html>, внутрь дерева он не действует.
    <html
      lang="ru"
      className={`${manrope.variable} ${condensed.variable}`}
      suppressHydrationWarning
    >
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
        <WebSiteJsonLd />
        <YandexMetrika />
        <CookieNotice />
        <Splash />
      </body>
    </html>
  )
}
