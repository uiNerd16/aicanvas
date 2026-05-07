import { track as vercelTrack } from '@vercel/analytics'
import type { Platform } from '../components/ComponentCard'

export type CardSource = 'index' | 'homepage-hero' | 'related'

type EventMap = {
  'Component Card Click': { component: string; position: number; source: CardSource }
  'Remix Open': { component: string }
  'Remix Platform Click': { component: string; platform: Platform }
  'CLI Copy': { component: string }
  'Install Tab Switch': { component: string; tab: 'cli' | 'manual' }
  'Fullscreen Open': { component: string }
  'System Install Tier Click': { component: string; system: string }
}

export function track<K extends keyof EventMap>(name: K, props: EventMap[K]): void {
  vercelTrack(name, props)
}
