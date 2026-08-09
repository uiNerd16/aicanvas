// @ts-nocheck — imports an untyped design-system source.
import { HeatGrid } from '../../../../design-systems/andromeda/components/HeatGrid'
import type { MatrixSpec } from './types'

export const heatGrid: MatrixSpec = {
  slug: 'heat-grid',
  Component: HeatGrid,
  // Geometry is per-cell (cellSize, gap), not a named size ladder.
  sizes: null,
  variants: [
    { label: 'Low', props: { value: 25, label: 'Low' } },
    { label: 'Mid', props: { value: 60, label: 'Window risk' } },
    { label: 'High', props: { value: 85, label: 'High' } },
    { label: 'Dense', props: { value: 60, cellSize: 16, gap: 2, cols: 12, label: 'Dense' } },
    { label: 'No readout', props: { value: 60, showValue: false } },
  ],
  states: [],
}
