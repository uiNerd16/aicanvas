// @ts-nocheck — imports an untyped design-system source.
import { Compass } from '@phosphor-icons/react'
import { NavItem } from '../../../../design-systems/andromeda/components/NavItem'
import { tokens } from '../../../../design-systems/andromeda/tokens'
import { CONTROL_STATES, type MatrixSpec } from './types'

// A nav row has no intrinsic width — it fills its rail. Without a container it
// shrink-wraps to its label and the hover fill reads as a chip, not a row.
const rail = (props: Record<string, unknown>) => (
  <div style={{ width: props.collapsed ? 56 : 220, background: tokens.color.surface.raised }}>
    <NavItem icon={Compass} label="Overview" {...props} />
  </div>
)

export const navItem: MatrixSpec = {
  slug: 'nav-item',
  sizes: null,
  render: (_size, props) => rail(props),
  variants: [
    { label: 'Default', props: {} },
    { label: 'Active', props: { active: true } },
    { label: 'Collapsed', props: { collapsed: true } },
    { label: 'Collapsed active', props: { collapsed: true, active: true } },
  ],
  states: [
    ...CONTROL_STATES,
    { label: 'Pressed', force: 'active' },
    { label: 'Active hover', props: { active: true }, force: 'hover' },
  ],
  gaps: {
    'Active indicator slide': 'the accent edge marker moves between rows with a shared framer layoutId; a single row at rest has nothing to slide from',
  },
}
