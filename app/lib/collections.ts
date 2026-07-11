// Programmatic collection pages (/components/collection/<slug>).
//
// Collections are CROSS-CUTTING views over the component library — stack-based
// (Motion, Canvas) or use-case-based (dashboards, AI apps). They deliberately
// do NOT mirror the categories in `categories.ts` (those already have their
// own pages at /components/category/<slug>); a 1:1 duplicate would compete
// with the category page for the same queries.
//
// Membership is explicit slugs, a predicate over ComponentMeta, or the union
// of both. Curated `slugs` lists only name FREE components (stable across the
// free-only and premium-injected builds); predicates may additionally pick up
// premium components in production builds, which then render with their
// Premium badge. Every collection must keep at least 3 members — the page
// 404s below that rather than shipping a skeleton page.

import type { ComponentMeta } from './component-registry'

export type Collection = {
  /** URL segment under /components/collection/. */
  slug: string
  /** SERP / browser-tab title. */
  title: string
  /** Meta description. */
  description: string
  /** On-page heading above the grid. */
  h1: string
  /** 2-3 sentence on-page intro under the heading. */
  intro: string
  /** Explicit members (free slugs only — see note above). */
  slugs?: readonly string[]
  /** Predicate members, unioned with `slugs`. */
  match?: (c: ComponentMeta) => boolean
}

function hasStack(c: ComponentMeta, label: string): boolean {
  return c.tags.some((t) => !t.accent && t.label === label)
}

export const COLLECTIONS: readonly Collection[] = [
  {
    slug: 'framer-motion-components',
    title: 'Framer Motion Components for React: Animated + Tailwind',
    description:
      'Animated React components built with Motion (Framer Motion) and Tailwind CSS. Copy-paste ready, installable via the shadcn CLI.',
    h1: 'Framer Motion Components for React',
    intro:
      'Every component in this collection animates with Motion, the library formerly known as Framer Motion. Copy the source, install it with the shadcn CLI, or remix it with AI.',
    match: (c) => hasStack(c, 'Motion'),
  },
  {
    slug: 'canvas-animation-components',
    title: 'Canvas Animation Components for React: Performant + Copy-Paste',
    description:
      'React components that render animations on HTML canvas: particle fields, noise backgrounds, generative grids. Installable via the shadcn CLI.',
    h1: 'Canvas Animation Components for React',
    intro:
      'These components draw straight to an HTML canvas for smooth, GPU-friendly animation at any size: particle fields, noise backgrounds, and generative grids. Each one is self-contained React and TypeScript, ready to copy or install with the shadcn CLI.',
    match: (c) => hasStack(c, 'Canvas'),
  },
  {
    slug: 'react-particle-effect-components',
    title: 'React Particle Effect Components: Canvas + Motion',
    description:
      'React particle effect components: constellations, magnetic dots, particle spheres, and bursts. Copy-paste ready, installable via the shadcn CLI.',
    h1: 'React Particle Effect Components',
    intro:
      'Particle systems for React, from ambient background constellations to celebratory bursts. Built with canvas and Motion for smooth performance, and ready to copy, install, or remix with AI.',
    slugs: [
      'particle-sphere',
      'particle-constellation',
      'magnetic-dots',
      'bubble-field',
      'sphere-lines',
      'emoji-burst',
      'noise-field',
    ],
  },
  {
    slug: 'react-widgets-for-saas-dashboards',
    title: 'React Widgets for SaaS Dashboards: Animated + Compact',
    description:
      'Animated React widgets for SaaS dashboards: progress, calendars, task cards, notifications, and user menus. Installable via the shadcn CLI.',
    h1: 'React Widgets for SaaS Dashboards',
    intro:
      'Compact, animated widgets that slot into a product dashboard: progress and charging indicators, calendars, task cards, notifications, and user menus. Each one is copy-paste ready and installable with the shadcn CLI.',
    slugs: [
      'crypto-swap',
      'upload-progress',
      'radial-cards',
      'flip-calendar',
      'charging-widget',
      'task-cards',
      'glass-progress',
      'glass-notification',
      'glass-user-menu',
      'glass-search-bar',
    ],
  },
  {
    slug: 'react-components-for-ai-apps',
    title: 'React Components for AI Apps: Chat, Compose, Voice',
    description:
      'React components for AI products: chat composers, voice pills, AI job cards, and playful assistants. Installable via the shadcn CLI.',
    h1: 'React Components for AI Apps',
    intro:
      'Interface pieces for AI products: a glassmorphism chat composer, a voice chat pill, AI job cards, and a curious 3D assistant. Copy the source, install with the shadcn CLI, or remix with AI.',
    slugs: ['curious-ai', 'ai-job-cards', 'glass-ai-compose', 'voice-chat-pill'],
  },
  {
    slug: 'react-loading-and-progress-components',
    title: 'React Loading and Progress Components: Animated + Copy-Paste',
    description:
      'Animated React loading and progress components: upload progress, steppers, loaders, and charging indicators. Installable via the shadcn CLI.',
    h1: 'React Loading and Progress Components',
    intro:
      'Loaders, steppers, and progress indicators that make waiting feel intentional. Built with Tailwind CSS and Motion, ready to copy and paste or install via the shadcn CLI.',
    slugs: [
      'upload-progress',
      'glass-progress',
      'glass-stepper',
      'runway-loader',
      'charging-widget',
    ],
  },
  {
    slug: 'react-date-and-time-components',
    title: 'React Date and Time Components: Calendars + Clocks',
    description:
      'Animated React date and time components: flip calendars, neon clocks, and scheduling cards. Installable via the shadcn CLI.',
    h1: 'React Date and Time Components',
    intro:
      'Calendars, clocks, and scheduling cards with personality. Each component is self-contained React and TypeScript, ready to copy or install with the shadcn CLI.',
    slugs: ['flip-calendar', 'neon-clock', 'task-cards'],
  },
  {
    slug: 'react-components-for-ecommerce',
    title: 'React Components for Ecommerce: Product Cards + Checkout',
    description:
      'Animated React components for online stores: product card decks, cover-flow carousels, and swap widgets. Installable via the shadcn CLI.',
    h1: 'React Components for Ecommerce',
    intro:
      'Product showcases and checkout-adjacent widgets for online stores: card decks, cover-flow and cube carousels, and a swap widget. Copy the source, install with the shadcn CLI, or remix with AI.',
    slugs: ['product-card-deck', 'tilted-coverflow', 'cube-carousel', 'crypto-swap'],
  },
] as const

/** Members of a collection within the given meta list (slugs ∪ match). */
export function collectionMembers(
  collection: Collection,
  meta: readonly ComponentMeta[],
): ComponentMeta[] {
  return meta.filter(
    (c) => collection.slugs?.includes(c.slug) || collection.match?.(c) === true,
  )
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug)
}

/** Collections a single component belongs to (for cross-links on its page). */
export function collectionsForComponent(c: ComponentMeta): Collection[] {
  return COLLECTIONS.filter(
    (col) => col.slugs?.includes(c.slug) || col.match?.(c) === true,
  )
}
