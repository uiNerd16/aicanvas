// @ts-nocheck — imports an untyped design-system source.
import { CornerMarkers } from '../../../../design-systems/andromeda/components/CornerMarkers'
import { tokens } from '../../../../design-systems/andromeda/tokens'
import type { MatrixSpec } from './types'

// The markers position themselves against the nearest position:relative
// ancestor, so a cell with no box has nothing to bracket.
export const cornerMarkers: MatrixSpec = {
  slug: 'corner-markers',
  sizes: null,
  render: (_size, props) => (
    <div
      style={{
        position: 'relative',
        width: 180,
        height: 100,
        background: tokens.color.surface.raised,
      }}
    >
      <CornerMarkers {...props} />
    </div>
  ),
  variants: [
    { label: 'Default', props: {} },
    { label: 'Larger', props: { size: 18 } },
    { label: 'Inset', props: { offset: 6 } },
    { label: 'Accent', props: { color: tokens.color.accent[300] } },
    { label: 'Heavy', props: { borderWidth: 2 } },
  ],
  states: [],
}
