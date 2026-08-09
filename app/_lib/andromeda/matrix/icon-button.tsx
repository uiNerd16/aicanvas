// @ts-nocheck — imports an untyped design-system source.
import { Gear } from '@phosphor-icons/react'
import { IconButton } from '../../../../design-systems/andromeda/components/IconButton'
import { CONTROL_STATES, type MatrixSpec } from './types'

export const iconButton: MatrixSpec = {
  slug: 'icon-button',
  Component: IconButton,
  sizes: ['sm', 'md', 'lg'],
  baseProps: { icon: Gear, 'aria-label': 'Settings' },
  variants: [
    { label: 'Default', props: { variant: 'default' } },
    { label: 'Outline', props: { variant: 'outline' } },
    { label: 'Ghost', props: { variant: 'ghost' } },
    { label: 'Destructive', props: { variant: 'destructive' } },
  ],
  states: [
    ...CONTROL_STATES,
    { label: 'Destructive hover', props: { variant: 'destructive' }, force: 'hover' },
    // Same reasoning as Button: pressed is declared on the variants whose
    // active: colours differ from their own rest colours.
    { label: 'Pressed (outline)', props: { variant: 'outline' }, force: 'active' },
    { label: 'Pressed (ghost)', props: { variant: 'ghost' }, force: 'active' },
  ],
  gaps: {
    'Hover lift': 'the rise and brightness bump are framer whileHover, JS, with no CSS rule to force',
    'Pressed scale': 'the press scale is framer whileTap, JS; only the active: colour half is forced here',
  },
}
