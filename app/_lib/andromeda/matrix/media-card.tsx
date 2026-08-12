// v2 component: imported through the build-time shim.
import { MediaCard } from '../../../lib/andromeda-v2.generated'
import type { MatrixSpec } from './types'

export const mediaCard: MatrixSpec = {
  slug: 'media-card',
  Component: MediaCard,
  sizes: null,
  variants: [
    { label: 'Play action', props: { code: 'MIX-01', title: 'Your mix', meta: 'Updates daily', action: 'play' } },
    {
      label: 'CTA action',
      props: {
        code: 'CH-04',
        title: 'Deep focus',
        meta: 'Ambient · 2h',
        action: 'cta',
        ctaLabel: 'Open',
        image: 'https://ik.imagekit.io/aitoolkit/andromeda/signal-room/mix-03.webp',
      },
    },
    { label: 'No action', props: { code: 'CH-09', title: 'Static art', meta: 'Cover only', action: 'none' } },
    { label: 'Playing', props: { code: 'MIX-01', title: 'Your mix', meta: 'Now playing', playing: true } },
    // stacked is a structurally different render path (image block + plain-surface caption block, no scrim) — worth its own case, not just a prop tweak
    {
      label: 'Stacked',
      props: {
        layout: 'stacked',
        code: 'CH-12',
        title: 'Reactor telemetry',
        meta: 'Live feed',
        action: 'cta',
        ctaLabel: 'Open',
        image: 'https://ik.imagekit.io/aitoolkit/andromeda/signal-room/mix-02.webp',
      },
    },
  ],
  states: [],
  gaps: {
    'Card hover':
      'the reveal is a rule in the component\'s own scoped stylesheet, and this source is vault-side — the companion line that would fire it at rest belongs in that repo, not this one',
  },
}
