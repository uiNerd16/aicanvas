// @ts-nocheck — this spec AUTHORS JSX against untyped design-system
// components. Data-only specs in this directory need no such line.
import { Gear, Keyboard, SignOut, UserCircle } from '@phosphor-icons/react'
import { UserMenu } from '../../../../design-systems/andromeda/components/UserMenu'
import type { MatrixSpec } from './types'

const ITEMS = [
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'preferences', label: 'Preferences', icon: Gear },
  { id: 'shortcuts', label: 'Keyboard shortcuts', icon: Keyboard },
  { id: 'sep1', type: 'separator' },
  { id: 'signout', label: 'Sign out', icon: SignOut, destructive: true },
]

const SRC =
  'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

export const userMenu: MatrixSpec = {
  slug: 'user-menu',
  sizes: ['sm', 'md', 'lg'],
  overflow: true,
  render: (size, props) => (
    <div style={{ minHeight: props.staticOpen ? 260 : undefined }}>
      <UserMenu name="OPS-01" src={SRC} status="online" size={size} items={ITEMS} {...props} />
    </div>
  ),
  variants: [
    { label: 'Closed', props: {} },
    { label: 'Open down', props: { staticOpen: true, placement: 'bottom', align: 'end' } },
    { label: 'Open up', props: { staticOpen: true, placement: 'top', align: 'end' } },
    { label: 'Align start', props: { staticOpen: true, placement: 'bottom', align: 'start' } },
  ],
  states: [],
  gaps: {
    'Item hover':
      'rows are DATA (an items array), not elements the caller can reach, and the hover rule in the component\'s stylesheet is per-row — marking one would mean lighting all of them',
    'Trigger open':
      'the pressed-and-held trigger look is keyed off data-state, which the component sets itself from its own open state; the Open cases above show it',
  },
}
