// @ts-nocheck — imports an untyped design-system source.
// v2 component: imported through the build-time shim.
import { MusicPlayer } from '../../../lib/andromeda-v2.generated'
import type { MatrixSpec } from './types'

export const musicPlayer: MatrixSpec = {
  slug: 'music-player',
  Component: MusicPlayer,
  sizes: null,
  wide: true,
  variants: [
    { label: 'Playing', props: { playing: true, elapsed: 96 } },
    { label: 'Paused', props: { playing: false, elapsed: 96 } },
    { label: 'Liked', props: { playing: true, elapsed: 96, liked: true } },
    { label: 'Muted', props: { playing: true, elapsed: 96, volume: 0 } },
    { label: 'At the end', props: { playing: false, elapsed: 221 } },
  ],
  states: [],
  gaps: {
    Scrubbing: 'the playhead follows a pointermove on the progress track; a scrubbed player is a different elapsed value, shown above, not a different painted state',
    'Volume drag': 'same mechanism as scrubbing — the Muted case above is its endpoint',
  },
}
