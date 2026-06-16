import type { Metadata } from 'next'
import { HomeClient } from './HomeClient'
import { COMPONENTS, toMeta } from '../lib/component-registry'
import { getCategoryByLabel } from '../lib/categories'
import { SITE_URL } from '../lib/config'

const INDEX_TITLE = `All Components: Browse ${COMPONENTS.length} Animated React Components`
const INDEX_DESCRIPTION = `Browse all ${COMPONENTS.length} components in the AI Canvas registry: animated cards, glass morphism, backgrounds, buttons, and more. Each installable via the shadcn CLI.`

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}): Promise<Metadata> {
  const { category } = await searchParams
  // When the legacy ?category= filter is in use, point the canonical at the
  // new /components/category/<slug> page so Google doesn't index the query
  // variant as a duplicate of /components.
  const cat = category ? getCategoryByLabel(category) : undefined
  const canonical = cat
    ? `${SITE_URL}/components/category/${cat.slug}`
    : `${SITE_URL}/components`

  return {
    title: { absolute: INDEX_TITLE },
    description: INDEX_DESCRIPTION,
    alternates: { canonical },
    openGraph: {
      title: INDEX_TITLE,
      description: INDEX_DESCRIPTION,
      url: `${SITE_URL}/components`,
      type: 'website',
      images: [
        {
          url: '/AIcanvas-OG.png',
          width: 1200,
          height: 630,
          alt: 'AI Canvas: animated React component registry',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: INDEX_TITLE,
      description: INDEX_DESCRIPTION,
      images: ['/AIcanvas-OG.png'],
    },
  }
}

export default async function ComponentsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const filtered =
    category && category !== 'All Components'
      ? COMPONENTS.filter((c) => c.tags.some((t) => t.accent && t.label === category))
      : COMPONENTS

  return <HomeClient components={filtered.map(toMeta)} />
}
