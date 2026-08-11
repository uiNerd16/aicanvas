// @ts-nocheck — this spec AUTHORS JSX against untyped design-system
// components. Data-only specs in this directory need no such line.
import { Planet } from '../../../../design-systems/andromeda/components/Planet'
import type { MatrixSpec } from './types'

export const planet: MatrixSpec = {
  slug: 'planet',
  sizes: null,
  // Three.js needs a sized, positioned box to fill, and this one is a
  // full-surface piece: a full-row card, not a 260px stub.
  render: (_size, props) => (
    <div style={{ width: 760, maxWidth: '100%', height: 440, position: 'relative' }}>
      <Planet {...props} />
    </div>
  ),
  wide: true,
  // ONE canonical look (2026-08-11 ruling): default particle count, in motion.
  // Count, pause and colour are props a caller reaches for; the in-surface
  // composition is the demo's job, not a variant cell's.
  variants: [
    {
      label: 'The Planet',
      props: {},
      clientOnly: 'the particle field is built in an effect against a canvas; SSR emits an empty container',
    },
  ],
  states: [],
  gaps: {
    Rotation: 'perpetual motion with no rest frame — `paused` composes a still, but the canonical look is the turning one',
  },
}
