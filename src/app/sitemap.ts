import type { MetadataRoute } from 'next'
import { services } from '@/content/services'
import { site } from '@/content/company'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const pages = [
    { path: '', priority: 1 },
    { path: '/uslugi', priority: 0.9 },
    { path: '/kak-my-rabotaem', priority: 0.7 },
    { path: '/obekty', priority: 0.8 },
    { path: '/o-kompanii', priority: 0.7 },
    { path: '/rekvizity', priority: 0.6 },
    { path: '/kontakty', priority: 0.8 },
    { path: '/politika-konfidencialnosti', priority: 0.2 },
  ]

  return [
    ...pages.map((page) => ({
      url: `${site.url}${page.path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: page.priority,
    })),
    // Страницы услуг — основные посадочные под запросы вида «[услуга] Новосибирск».
    ...services.map((service) => ({
      url: `${site.url}/uslugi/${service.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ]
}
