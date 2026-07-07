import type { MetadataRoute } from 'next'
import { COMPONENTS } from './lib/component-registry'
import { CATEGORIES } from './lib/categories'
import { COLLECTIONS, collectionMembers } from './lib/collections'
import { SITE_URL } from './lib/config'
import { ANDROMEDA_COMPONENT_META } from './_lib/andromeda/andromeda-meta'
import { DESIGN_SYSTEMS } from '../scripts/lib/design-systems.config.mjs'

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

  // Only list collections that actually render (the page 404s below 3
  // members), so the sitemap never advertises a URL that would 404.
  const collectionPages: MetadataRoute.Sitemap = COLLECTIONS.filter(
    (c) => collectionMembers(c, COMPONENTS).length >= 3,
  ).map((c) => ({
    url: `${SITE_URL}/components/collection/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Design systems. Each system's canonical landing is its bare root
  // (/design-systems/<slug>), followed by the raw component grid (/showcase)
  // and its template routes. Generated from the shared config so new systems
  // and templates land in the sitemap automatically.
  const designSystemPages: MetadataRoute.Sitemap = DESIGN_SYSTEMS.flatMap(
    (s: { slug: string; templates?: { slug: string }[] }) => [
      {
        url: `${SITE_URL}/design-systems/${s.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/design-systems/${s.slug}/showcase`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      ...(s.templates ?? []).map((t) => ({
        url: `${SITE_URL}/design-systems/${s.slug}/templates/${t.slug.replace(
          new RegExp(`^${s.slug}-`),
          '',
        )}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ],
  )

  // Andromeda per-component pages (/design-systems/andromeda/<component>).
  const andromedaComponentPages: MetadataRoute.Sitemap = ANDROMEDA_COMPONENT_META.map(
    (c: { slug: string }) => ({
      url: `${SITE_URL}/design-systems/andromeda/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }),
  )

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
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/mcp`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/lab`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...designSystemPages,
    ...categoryPages,
    ...collectionPages,
    ...componentPages,
    ...andromedaComponentPages,
  ]
}
