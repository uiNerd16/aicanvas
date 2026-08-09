// v2 component: imported through the build-time shim, never from design-systems/
// directly, so a degraded (free-only) build still compiles.
import { Gauge } from '../../../lib/andromeda-v2.generated'
import type { MatrixSpec } from './types'

export const gauge: MatrixSpec = {
  slug: 'gauge',
  Component: Gauge,
  sizes: ['sm', 'md', 'lg'],
  variants: [
    { label: 'Accent', props: { variant: 'accent', value: 82, label: 'CPU' } },
    { label: 'Warning', props: { variant: 'warning', value: 64, label: 'FUEL' } },
    { label: 'Fault', props: { variant: 'fault', value: 12, label: 'O2' } },
    { label: 'No readout', props: { value: 68, showValue: false } },
  ],
  // A gauge is a readout, not a control. Its arc animates to the value on
  // mount, which is a transition and not a state.
  states: [],
}
