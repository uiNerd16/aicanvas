import { Planet } from '../../../../design-systems/andromeda/components/Planet'
import type { MatrixSpec } from './types'

export const planet: MatrixSpec = {
  slug: 'planet',
  sizes: null,
  // Three.js needs a sized, positioned box to fill.
  render: (_size, props) => (
    <div style={{ width: 320, height: 260, position: 'relative' }}>
      <Planet {...props} />
    </div>
  ),
  variants: [
    { label: 'Default', props: {}, clientOnly: 'the particle field is built in an effect against a canvas; SSR emits an empty container' },
    { label: 'Sparse', props: { particleCount: 2000 }, clientOnly: 'same WebGL mount gate as Default' },
    { label: 'Paused', props: { paused: true }, clientOnly: 'same WebGL mount gate as Default' },
  ],
  states: [],
  gaps: {
    Rotation: 'perpetual motion with no rest frame; the paused variant above is the closest thing to a still',
  },
}
