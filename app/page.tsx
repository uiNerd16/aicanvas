import type { Metadata } from 'next'
import { HomePageClient } from './home/HomePageClient'
import { COMPONENTS } from './lib/component-registry'

export const metadata: Metadata = {
  title: { absolute: 'AI Canvas — AI Native Components for Designers and Developers' },
  description:
    'Free animated React components with AI prompts for Claude Code, Lovable, and V0. Install with one command or remix with AI. Always free, always open source.',
  openGraph: {
    title: 'AI Canvas — AI Native Components for Designers and Developers',
    description:
      'Free animated React components with AI prompts for Claude Code, Lovable, and V0. Install with one command or remix with AI.',
    url: 'https://aicanvas.me',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Canvas — AI Native Components for Designers and Developers',
    description:
      'Free animated React components with AI prompts for Claude Code, Lovable, and V0. Install with one command or remix with AI.',
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
