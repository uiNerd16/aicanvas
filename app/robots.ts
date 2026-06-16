import type { MetadataRoute } from 'next'
import { SITE_URL } from './lib/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /ideation and /ideation/* are the internal dev playground (it renders
      // duplicate previews of shipped pages); keep them out of the index.
      disallow: ['/ideation', '/ideation/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
