// @ts-nocheck — authors JSX against untyped design-system components.
// v2 component: imported through the build-time shim.
import { Burst } from '../../../lib/andromeda-v2.generated'
import type { MatrixSpec } from './types'

export const burst: MatrixSpec = {
  slug: 'burst',
  sizes: null,
  // Full-surface piece: a full-row card, sized so the convergence has somewhere
  // to converge from.
  render: (_size, props) => (
    <div style={{ width: 760, maxWidth: '100%', height: 440, position: 'relative' }}>
      <Burst {...props} />
    </div>
  ),
  wide: true,
  // ONE canonical look (2026-08-11 ruling): default density. How much of the
  // endpoint lattice wires back to the focus is a prop, not a look to shop for.
  variants: [{ label: 'The convergence', props: {} }],
  states: [],
  gaps: {
    'Reduced motion':
      'a media query, not a prop — prefers-reduced-motion paints one composed still frame, with no rAF at all, so no cell can force it',
  },
}
