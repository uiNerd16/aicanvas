import type { Metadata } from 'next'
import { HomeClient } from './HomeClient'
import { COMPONENTS } from '../lib/component-registry'
import { SITE_URL } from '../lib/config'

const INDEX_TITLE = `All Components — Browse ${COMPONENTS.length} Animated React Components`
const INDEX_DESCRIPTION = `Browse all ${COMPONENTS.length} components in the AI Canvas registry — animated cards, glass morphism, backgrounds, buttons, and more. Each installable via shadcn CLI.`

export const metadata: Metadata = {
  title: { absolute: INDEX_TITLE },
  description: INDEX_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/components` },
  openGraph: {
    title: INDEX_TITLE,
    description: INDEX_DESCRIPTION,
    url: `${SITE_URL}/components`,
    type: 'website',
    images: [
      {
        url: '/AIcanvas-OG.webp',
        width: 1200,
        height: 630,
        alt: 'AI Canvas — animated React component registry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: INDEX_TITLE,
    description: INDEX_DESCRIPTION,
    images: ['/AIcanvas-OG.webp'],
  },
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

  return <HomeClient components={filtered} />
}
