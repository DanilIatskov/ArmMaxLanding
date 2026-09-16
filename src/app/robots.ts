import type { MetadataRoute } from 'next'
import { site } from '@/content/company'

// Чтение process.env делает роут динамическим — в статическом экспорте это ошибка сборки.
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  // Превью на GitHub Pages закрываем целиком — см. комментарий в layout.tsx.
  if (process.env.NOINDEX === '1') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
