import { ProgressBar } from '../../../../design-systems/andromeda/components/ProgressBar'
import type { MatrixSpec } from './types'

export const progressBar: MatrixSpec = {
  slug: 'progress-bar',
  Component: ProgressBar,
  sizes: null,
  wide: true,
  variants: [
    { label: 'Default', props: { label: 'Storage used', value: 72, variant: 'default' } },
    { label: 'Warning', props: { label: 'Bandwidth', value: 48, variant: 'warning' } },
    { label: 'Fault', props: { label: 'Memory critical', value: 91, variant: 'fault' } },
    { label: 'Empty', props: { label: 'Queue', value: 0 } },
    { label: 'Full', props: { label: 'Sync', value: 100 } },
  ],
  states: [],
}
