// @ts-nocheck — imports an untyped design-system source.
// v2 component: imported through the build-time shim.
import { MetricChart } from '../../../lib/andromeda-v2.generated'
import type { MatrixSpec } from './types'

export const metricChart: MatrixSpec = {
  slug: 'metric-chart',
  Component: MetricChart,
  sizes: null,
  wide: true,
  baseProps: { label: '/// Station', title: 'Orbital altitude', unit: 'km' },
  variants: [
    { label: 'Accent', props: { variant: 'accent' } },
    { label: 'Warning', props: { variant: 'warning' } },
    { label: 'Fault', props: { variant: 'fault' } },
    { label: 'No badge', props: { badgeText: null } },
    { label: 'With description', props: { description: 'Mean altitude over the last 24 hours' } },
  ],
  states: [],
  gaps: {
    'Point hover': 'the readout follows a recharts pointer event, so there is no rest form to force',
  },
}
