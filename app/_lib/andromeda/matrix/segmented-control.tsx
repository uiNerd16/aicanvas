// @ts-nocheck — imports an untyped design-system source.
import { ChartBar, ChartLine } from '@phosphor-icons/react'
import { SegmentedControl } from '../../../../design-systems/andromeda/components/SegmentedControl'
import type { MatrixSpec } from './types'

const noop = () => {}

const ICONS = [
  { value: 'line', icon: ChartLine, ariaLabel: 'Line chart' },
  { value: 'bars', icon: ChartBar, ariaLabel: 'Bar chart' },
]
const PERIODS = [
  { value: '1d', label: '1D' },
  { value: '1w', label: '1W' },
  { value: '1m', label: '1M' },
  { value: 'all', label: 'ALL' },
]

export const segmentedControl: MatrixSpec = {
  slug: 'segmented-control',
  sizes: ['sm', 'md', 'lg'],
  // The sliding indicator is a shared framer layoutId, so every instance on the
  // page needs its own group or they fight over one marker. A matrix renders
  // the same control many times over, which makes this mandatory, not optional.
  render: (size, props, c) => (
    <SegmentedControl
      size={size}
      layoutGroupId={`andromeda-matrix-segmented-${c?.label ?? 'x'}-${size}`.replace(/\s+/g, '-')}
      options={PERIODS}
      value="1w"
      onChange={noop}
      {...props}
    />
  ),
  variants: [
    { label: 'Labels', props: {} },
    { label: 'Icons', props: { options: ICONS, value: 'line' } },
    // Selection is a prop, so it costs nothing to show it selected somewhere
    // other than the first segment — which is where the indicator's position
    // actually becomes informative.
    { label: 'Last selected', props: { value: 'all' } },
  ],
  states: [],
  gaps: {
    Hover:
      'segments are DATA (an options array), not elements the caller can reach, and the hover rule in the component\'s stylesheet is per-segment — marking one would mean lighting every unselected segment at once',
  },
}
