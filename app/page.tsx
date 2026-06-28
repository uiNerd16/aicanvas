import type { Metadata } from 'next'
import { HomePageClient } from './home/HomePageClient'
// Registry-free metadata so the homepage never bundles the heavy registry
// (three.js etc.); mirrors COMPONENT_META.map(toMeta).
import { COMPONENT_META } from './lib/component-meta.generated'
import { SITE_URL } from './lib/config'

const HOMEPAGE_TITLE = `AI Canvas — ${COMPONENT_META.length} Animated React Components with AI Reproduction Prompts`
const HOMEPAGE_DESCRIPTION = `Open-source registry of ${COMPONENT_META.length} animated React components. Free to browse and remix with AI. Install components with one command up to a daily limit, or go Premium for design systems and unlimited installs.`

export const metadata: Metadata = {
  title: { absolute: HOMEPAGE_TITLE },
  description: HOMEPAGE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    url: SITE_URL,
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
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    images: ['/AIcanvas-OG-v2.png'],
  },
}

export default function HomePage() {
  const total = COMPONENT_META.length

  // Pick up to 6 components with images for the hero showcase cycling card
  const withImages = COMPONENT_META.filter((c) => c.image).slice(0, 6).map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    tags: c.tags,
    image: c.image,
  }))

  // Fallback: if fewer than 4 have images, pad with imageless ones
  const showcase =
    withImages.length >= 4
      ? withImages
      : [
          ...withImages,
          ...COMPONENT_META.filter((c) => !c.image)
            .slice(0, 6 - withImages.length)
            .map((c) => ({
              slug: c.slug,
              name: c.name,
              description: c.description,
              tags: c.tags,
              image: c.image,
            })),
        ]

  // Featured carousel — fixed 5 components, order matters (center starts at index 0)
  const FEATURED_SLUGS = ['3d-product-card', 'ai-job-cards', 'task-cards', 'particle-sphere', 'label-cards', 'traveldeck']
  const carouselItems = FEATURED_SLUGS
    .map((slug) => COMPONENT_META.find((c) => c.slug === slug))
    .filter(Boolean)
    .map((c) => ({ slug: c!.slug, name: c!.name, description: c!.description, tags: c!.tags, image: c!.image, badge: c!.badge }))

  return <HomePageClient total={total} showcase={showcase} carouselItems={carouselItems} />
}
