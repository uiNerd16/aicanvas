// @ts-nocheck — this spec AUTHORS JSX against untyped design-system
// components. Data-only specs in this directory need no such line.
'use client'

import { useState } from 'react'
import { Slider } from '../../../../design-systems/andromeda/components/Slider'
import { tokens } from '../../../../design-systems/andromeda/tokens'
import type { MatrixSpec } from './types'

// Static cells show where the thumb can sit; only a live one shows the readout
// tracking it. Carried over from the system page's hand-written section in the
// 2026-08-09 collapse.
function LiveSlider() {
  const [throttle, setThrottle] = useState(64)
  const [vector, setVector] = useState(12)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[5], width: 300 }}>
      <Slider label="Throttle" unit="%" value={throttle} onValueChange={setThrottle} />
      <Slider label="Thrust vector" unit="°" min={-30} max={30} value={vector} onValueChange={setVector} />
    </div>
  )
}

export const slider: MatrixSpec = {
  slug: 'slider',
  Component: Slider,
  sizes: ['sm', 'md', 'lg'],
  baseProps: { value: 64, style: { width: 300 } },
  variants: [
    { label: 'Live', node: <LiveSlider /> },
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
