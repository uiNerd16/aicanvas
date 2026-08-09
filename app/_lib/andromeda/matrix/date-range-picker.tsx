// @ts-nocheck — imports an untyped design-system source.
import { DateRangePicker } from '../../../../design-systems/andromeda/components/DateRangePicker'
import type { MatrixSpec } from './types'

const noop = () => {}
// Fixed dates, never `new Date()`: a matrix that renders a different month on
// every build is a diff that never settles.
const RANGE = { start: new Date(2026, 6, 20), end: new Date(2026, 7, 20) }
const SHORT = { start: new Date(2026, 7, 1), end: new Date(2026, 7, 14) }

export const dateRangePicker: MatrixSpec = {
  slug: 'date-range-picker',
  sizes: null,
  // staticOpen, never defaultOpen: several popovers open on one page with the
  // dismissers live means the first click anywhere collapses all of them, which
  // reads as a bug. staticOpen pins each one independently.
  overflow: true,
  render: (_size, props) => <DateRangePicker value={RANGE} onChange={noop} {...props} />,
  variants: [
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
