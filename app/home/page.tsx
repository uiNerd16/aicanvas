import type { Metadata } from 'next'
import { HomePageClient } from './HomePageClient'
// Registry-free metadata so the homepage never bundles the heavy registry
// (three.js etc.); mirrors COMPONENT_META.map(toMeta).
import { COMPONENT_META } from '../lib/component-meta.generated'

export const metadata: Metadata = {
  title: { absolute: 'AI Canvas — UI Components and Design Systems with AI Prompts' },
  description:
    'Animated React components with AI prompts built in. For designers, developers, and everyone in between. Browse and remix with AI for free. Design systems and templates are Premium.',
  openGraph: {
    title: 'AI Canvas — UI Components and Design Systems with AI Prompts',
    description:
      'Animated React components with AI prompts built in. For designers, developers, and everyone in between. Design systems and templates are Premium.',
    url: 'https://aicanvas.me/home',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Canvas — UI Components and Design Systems with AI Prompts',
    description:
      'Animated React components with AI prompts built in. For designers, developers, and everyone in between. Design systems and templates are Premium.',
  },
}

export default function HomePage() {
  const total = COMPONENT_META.length

  // Featured carousel — fixed 5 components, order matters (center starts at index 0)
  const FEATURED_SLUGS = ['tilted-coverflow', 'product-card-deck', 'interactive-card-stack', 'voice-chat-pill', 'sticker-wall']
  const carouselItems = FEATURED_SLUGS
    .map((slug) => COMPONENT_META.find((c) => c.slug === slug))
    .filter(Boolean)
    .map((c) => ({ slug: c!.slug, name: c!.name, description: c!.description, tags: c!.tags, image: c!.image }))

  return <HomePageClient total={total} carouselItems={carouselItems} />
}
