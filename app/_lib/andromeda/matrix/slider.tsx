// @ts-nocheck — imports an untyped design-system source.
import { Slider } from '../../../../design-systems/andromeda/components/Slider'
import type { MatrixSpec } from './types'

export const slider: MatrixSpec = {
  slug: 'slider',
  Component: Slider,
  sizes: ['sm', 'md', 'lg'],
  baseProps: { value: 64, style: { width: 300 } },
  variants: [
    { label: 'Default', props: { showValue: false } },
    { label: 'Labelled', props: { label: 'Throttle', unit: '%' } },
    { label: 'Signed range', props: { label: 'Thrust vector', unit: '°', min: -30, max: 30, value: 12 } },
    { label: 'At minimum', props: { value: 0, showValue: false } },
  ],
  states: [
    // Both live on the thumb: a 1.25 scale on hover and an accent ring on
    // focus-visible. Neither moves a colour on the track, so the Rest cell
    // beside them is doing most of the work.
    { label: 'Hover', force: 'hover' },
    { label: 'Focus visible', force: 'focus' },
    { label: 'Disabled', props: { disabled: true } },
  ],
  gaps: {
    Dragging: 'the value follows a pointermove handler; a dragged slider is a different value, not a different painted state',
  },
}
