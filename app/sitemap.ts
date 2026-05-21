import type { MetadataRoute } from 'next'
import { COMPONENTS } from './lib/component-registry'
import { CATEGORIES } from './lib/categories'
import { SITE_URL } from './lib/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const componentPages: MetadataRoute.Sitemap = COMPONENTS.map((c) => ({
    url: `${SITE_URL}/components/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/components/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/components`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...categoryPages,
    ...componentPages,
  ]
}
