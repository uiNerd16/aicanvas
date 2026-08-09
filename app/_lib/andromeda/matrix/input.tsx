// @ts-nocheck — imports an untyped design-system source.
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Input } from '../../../../design-systems/andromeda/components/Input'
import { CONTROL_STATES, type MatrixSpec } from './types'

export const input: MatrixSpec = {
  slug: 'input',
  Component: Input,
  sizes: ['sm', 'md', 'lg'],
  baseProps: { label: 'Node ID', placeholder: 'ND-4471' },
  variants: [
    { label: 'Default', props: {} },
    { label: 'With icon', props: { icon: MagnifyingGlass } },
    // error is a STRING prop; the cva `state` axis is DERIVED from it
    // (Input.tsx:117), never passed, so this case is what covers that axis.
    { label: 'Error', props: { error: 'Value out of range' } },
  ],
  states: [
    ...CONTROL_STATES,
    // The plain focus rule matters as much as focus-visible here: the accent
    // border comes from focus:, only the ring comes from focus-visible:, so
    // forcing one without the other would show a state users never see.
    { label: 'Error focus', props: { error: 'Value out of range' }, force: 'focus' },
    { label: 'Filled', props: { defaultValue: 'ORBITAL-7742' } },
  ],
}
