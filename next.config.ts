import type { NextConfig } from 'next'

/**
 * STATIC_EXPORT=1 — сборка под GitHub Pages: статика, без сервера.
 * В этом режиме не работают роут-хендлеры (/api/lead) и заголовки из headers(),
 * поэтому превью на Pages — только для показа вёрстки. Боевой хостинг — обычный
 * `next build` + `next start` на сервере в РФ (требование 152-ФЗ к заявкам).
 */
const isStaticExport = process.env.STATIC_EXPORT === '1'

/** На github.io сайт живёт в подпапке /<repo>, на своём домене — в корне. */
const basePath = process.env.BASE_PATH ?? ''

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Сайт проверяют со смартфона службы безопасности заказчиков — держим картинки лёгкими.
  images: isStaticExport
    ? // Оптимизатор картинок — серверный, на Pages его нет.
      { unoptimized: true }
    : {
        formats: ['image/avif', 'image/webp'],
        /**
         * Обрезаем набор ширин сверху. По умолчанию Next готов отдать
         * до 3840 точек, а исходники у нас не больше 1600 — крупные варианты
         * только зря гоняют оптимизатор.
         *
         * Дело не только в экономии: пока ширина элемента не посчитана,
         * браузер берёт из srcset самый большой вариант. В ленте объектов
         * так и вышло — первая карточка просила 3840, запрос подвисал,
         * и снимок не появлялся вовсе.
         */
        deviceSizes: [640, 750, 828, 1080, 1200, 1600],
      },

  ...(isStaticExport
    ? {
        output: 'export' as const,
        basePath,
        // Без слеша GitHub Pages не отдаёт вложенные маршруты вида /uslugi/proektirovanie.
        trailingSlash: true,
      }
    : {
        async headers() {
          return [
            {
              source: '/:path*',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
              ],
            },
          ]
        },
      }),
}

export default nextConfig
