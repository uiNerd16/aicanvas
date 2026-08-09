import { Avatar } from '../../../../design-systems/andromeda/components/Avatar'
import type { MatrixSpec } from './types'

export const avatar: MatrixSpec = {
  slug: 'avatar',
  Component: Avatar,
  sizes: ['sm', 'md', 'lg'],
  baseProps: { name: 'Reza Quinn' },
  variants: [
    { label: 'Initials', props: {} },
    { label: 'Online', props: { status: 'online' } },
    { label: 'Caution', props: { status: 'caution' } },
    { label: 'Fault', props: { status: 'fault' } },
    { label: 'Offline', props: { status: 'offline' } },
  ],
  states: [
    // The whole hover treatment is a 1.05 scale on the tile — no colour moves —
    // so this cell is only legible next to its own Rest baseline.
    { label: 'Hover', force: 'hover' },
  ],
}
