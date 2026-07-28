import type { Metadata } from 'next'
import { HomePageClient } from './HomePageClient'
// Registry-free metadata so the homepage never bundles the heavy registry
// (three.js etc.); mirrors COMPONENT_META.map(toMeta).
import { COMPONENT_META } from '../lib/component-meta.generated'
import { getRegistryPulls } from '../lib/registry-stats'

// Same ISR window as the root homepage — this route renders the same page, so
// it must not fall out of sync and hit PostHog on a different schedule.
export const revalidate = 86400

// Mirrors the root homepage metadata (this route renders the same page);
// canonical points at the root so search engines fold the two together.
const HOMEPAGE_TITLE = 'React Component Registry: Components, Blocks & Design Systems | AI Canvas'
const HOMEPAGE_DESCRIPTION = 'Install finished React components, blocks, and design systems with one shadcn CLI command. Real, editable code you own, no AI tokens spent.'

export const metadata: Metadata = {
  title: { absolute: HOMEPAGE_TITLE },
  description: HOMEPAGE_DESCRIPTION,
  alternates: { canonical: 'https://aicanvas.me' },
  openGraph: {
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    url: 'https://aicanvas.me/home',
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

export default async function HomePage() {
  const total = COMPONENT_META.length
  const pulls = await getRegistryPulls()

  // Featured carousel — fixed 5 components, order matters (center starts at index 0)
  const FEATURED_SLUGS = ['tilted-coverflow', 'product-card-deck', 'interactive-card-stack', 'voice-chat-pill', 'sticker-wall']
  const carouselItems = FEATURED_SLUGS
    .map((slug) => COMPONENT_META.find((c) => c.slug === slug))
    .filter(Boolean)
    .map((c) => ({ slug: c!.slug, name: c!.name, description: c!.description, tags: c!.tags, image: c!.image, badge: c!.badge }))

  return <HomePageClient total={total} pulls={pulls} carouselItems={carouselItems} />
}
