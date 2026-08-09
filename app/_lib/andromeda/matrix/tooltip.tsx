// @ts-nocheck — this spec AUTHORS JSX against untyped design-system
// components. Data-only specs in this directory need no such line.
import { ArrowClockwise } from '@phosphor-icons/react'
import { Tooltip } from '../../../../design-systems/andromeda/components/Tooltip'
import { IconButton } from '../../../../design-systems/andromeda/components/IconButton'
import type { MatrixSpec } from './types'

export const tooltip: MatrixSpec = {
  slug: 'tooltip',
  sizes: null,
  render: (_size, props) => (
    <Tooltip label="Refresh" {...props}>
      <IconButton aria-label="Refresh" icon={ArrowClockwise} />
    </Tooltip>
  ),
  // The four sides are the whole API surface. They look identical until the
  // bubble is up, which is what the gap below is about — the page is live, so
  // hovering any cell answers it.
  variants: [
    { label: 'Top', props: { position: 'top' } },
    { label: 'Bottom', props: { position: 'bottom' } },
    { label: 'Left', props: { position: 'left' } },
    { label: 'Right', props: { position: 'right' } },
  ],
  states: [],
  gaps: {
    Open: 'the bubble mounts from React state on mouseenter and animates through AnimatePresence — there is no open prop and no CSS rule an attribute could fire',
  },
}
