import type { Metadata } from 'next'
import { HomeClient } from './HomeClient'
// Registry-free metadata so the grid never bundles the heavy registry
// (three.js etc.); mirrors COMPONENTS.map(toMeta).
import { COMPONENT_META } from '../lib/component-meta.generated'
import { getCategoryByLabel } from '../lib/categories'
import { SITE_URL } from '../lib/config'

const INDEX_TITLE = `All Components: Browse ${COMPONENT_META.length} Animated React Components`
const INDEX_DESCRIPTION = `Browse all ${COMPONENT_META.length} components in the AI Canvas registry: animated cards, glass morphism, backgrounds, buttons, and more. Each installable via the shadcn CLI.`

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
          url: '/AIcanvas-OG-v2.png',
          width: 1200,
          height: 630,
          alt: 'AI Canvas: native React components, design systems, and templates',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: INDEX_TITLE,
      description: INDEX_DESCRIPTION,
      images: ['/AIcanvas-OG-v2.png'],
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
      ? COMPONENT_META.filter((c) => c.tags.some((t) => t.accent && t.label === category))
      : COMPONENT_META

  return <HomeClient components={filtered} />
}
