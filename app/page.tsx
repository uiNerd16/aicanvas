import type { Metadata } from 'next'
import { HomePageClient } from './home/HomePageClient'
import { COMPONENTS } from './lib/component-registry'
import { SITE_URL } from './lib/config'

const HOMEPAGE_TITLE = `AI Canvas — ${COMPONENTS.length} Animated React Components with AI Reproduction Prompts`
const HOMEPAGE_DESCRIPTION = `Free, open-source registry of ${COMPONENTS.length} animated React components built with Tailwind CSS and Framer Motion. Install with one command or remix with AI prompts for Claude Code, Lovable, and v0.`

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
        url: '/AIcanvas-OG.png',
        width: 1200,
        height: 630,
        alt: 'AI Canvas — animated React component registry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    images: ['/AIcanvas-OG.png'],
  },
}

export default function HomePage() {
  const total = COMPONENTS.length

  // Pick up to 6 components with images for the hero showcase cycling card
  const withImages = COMPONENTS.filter((c) => c.image).slice(0, 6).map((c) => ({
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
          ...COMPONENTS.filter((c) => !c.image)
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
  const FEATURED_SLUGS = ['ai-job-cards', 'task-cards', 'particle-sphere', 'label-cards', 'traveldeck']
  const carouselItems = FEATURED_SLUGS
    .map((slug) => COMPONENTS.find((c) => c.slug === slug))
    .filter(Boolean)
    .map((c) => ({ slug: c!.slug, name: c!.name, description: c!.description, tags: c!.tags, image: c!.image }))

  return <HomePageClient total={total} showcase={showcase} carouselItems={carouselItems} />
}
