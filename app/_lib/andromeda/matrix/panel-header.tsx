// @ts-nocheck — imports an untyped design-system source.
import { ArrowClockwise } from '@phosphor-icons/react'
import { PanelHeader } from '../../../../design-systems/andromeda/components/PanelHeader'
import { IconButton } from '../../../../design-systems/andromeda/components/IconButton'
import { CornerMarkers } from '../../../../design-systems/andromeda/components/CornerMarkers'
import { tokens } from '../../../../design-systems/andromeda/tokens'
import type { MatrixSpec } from './types'

// A block header has no intrinsic width, and its whole job is to sit on a
// framed panel — so each cell supplies the panel it heads.
const panel = (size: string | undefined, props: Record<string, unknown>) => (
  <div style={{ width: 320, maxWidth: '100%', position: 'relative', background: tokens.color.surface.raised }}>
    <CornerMarkers />
    <PanelHeader size={size} title="Requests" {...props} />
  </div>
)

export const panelHeader: MatrixSpec = {
  slug: 'panel-header',
  sizes: ['sm', 'md', 'lg'],
  render: panel,
  variants: [
    { label: 'Title only', props: {} },
    {
      label: 'With actions',
      // The actions control matches the header rung by name, which is the
      // pairing the component's own JSDoc prescribes.
      props: { actions: <IconButton size="md" variant="ghost" aria-label="Refresh" icon={ArrowClockwise} /> },
    },
  ],
  // The header itself is chrome; any interaction belongs to whatever control
  // sits in its actions slot, which declares its own states.
  states: [],
}
