import { track as vercelTrack } from '@vercel/analytics'

export type CardSource = 'index' | 'homepage-hero' | 'related'

type EventMap = {
  'Component Card Click': { component: string; position: number; source: CardSource }
  'Remix Open': { component: string }
  // Replaced 'Remix Platform Click' — the per-platform dropdown is gone;
  // one general prompt is copied from the Remix panel instead.
  'Remix Prompt Copy': { component: string }
  'CLI Copy': { component: string }
  'Install Tab Switch': { component: string; tab: 'cli' | 'manual' }
  'Fullscreen Open': { component: string }
  'System Install Tier Click': { component: string; system: string }
}

export function track<K extends keyof EventMap>(name: K, props: EventMap[K]): void {
  vercelTrack(name, props)
}
