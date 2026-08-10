// @ts-nocheck — this spec AUTHORS JSX against untyped design-system
// components. Data-only specs in this directory need no such line.
'use client'

import { useState } from 'react'
import { DateRangePicker } from '../../../../design-systems/andromeda/components/DateRangePicker'
import type { MatrixSpec } from './types'

// Fixed dates, never `new Date()`: a matrix that renders a different month on
// every build is a diff that never settles. That fixes the STARTING value only;
// each case seeds its own state from these and moves from there.
const RANGE = { start: new Date(2026, 6, 20), end: new Date(2026, 7, 20) }
const SHORT = { start: new Date(2026, 7, 1), end: new Date(2026, 7, 14) }

// Anchor-then-confirm is a two-click behaviour with a hover preview in between,
// and it only reads if the pick STICKS: the component is controlled-only, so a
// frozen `value` beside a handler that drops the new range repaints the seed and
// the picker looks broken. Every case runs through this wrapper — its own seed
// in, live from the first click. Clearing the preset on that first pick is the
// component's real behaviour, not decoration. Carried over from the system
// page's hand-written section in the 2026-08-09 collapse.
function LiveDateRangePicker({ value = RANGE, presetLabel = null, ...props }) {
  const [range, setRange] = useState(value)
  const [preset, setPreset] = useState(presetLabel)
  return (
    <DateRangePicker
      value={range}
      presetLabel={preset}
      onChange={(next) => {
        setRange(next)
        setPreset(null)
      }}
      {...props}
    />
  )
}

export const dateRangePicker: MatrixSpec = {
  slug: 'date-range-picker',
  sizes: null,
  // staticOpen, never defaultOpen: several popovers open on one page with the
  // dismissers live means the first click anywhere collapses all of them, which
  // reads as a bug. staticOpen pins each one independently.
  overflow: true,
  render: (_size, props) => <LiveDateRangePicker {...props} />,
  variants: [
    { label: 'Live', props: { presetLabel: 'Last month' } },
    { label: 'With preset', props: { presetLabel: 'Last month' } },
    { label: 'No preset', props: { value: SHORT } },
    { label: 'Open', props: { staticOpen: true } },
  ],
  states: [
    // Both fired by the companion lines that live beside the real rules in
    // DateRangePicker's own scoped stylesheet. The descendant form is safe
    // here: a picker has exactly one trigger.
    { label: 'Trigger hover', force: 'hover' },
    { label: 'Trigger focus visible', force: 'focus' },
    { label: 'Trigger open', props: { staticOpen: true } },
  ],
  gaps: {
    'Day hover': 'each day cell paints from its own :hover rule in the same stylesheet; forcing one would need a marker on that cell, which the component does not expose',
    'Range preview': 'the in-between band follows a pointer-driven anchor/hover pair held in component state, so it has no rest form',
  },
}
