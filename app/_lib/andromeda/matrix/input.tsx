// @ts-nocheck — this spec AUTHORS JSX against an untyped design-system
// component. Data-only specs in this directory need no such line.
'use client'

import { useState } from 'react'
import { Eye, EyeSlash, LockKey, MagnifyingGlass } from '@phosphor-icons/react'
import { Input } from '../../../../design-systems/andromeda/components/Input'
import { CONTROL_STATES, type MatrixSpec } from './types'

const BASE_PROPS = { label: 'Node ID', placeholder: 'ND-4471' }

function LivePasswordInput({ size, ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <Input
      {...BASE_PROPS}
      {...props}
      size={size}
      type={visible ? 'text' : 'password'}
      trailingIcon={visible ? EyeSlash : Eye}
      trailingIconLabel={visible ? 'Hide password' : 'Show password'}
      onTrailingIconClick={() => setVisible((value) => !value)}
    />
  )
}

export const input: MatrixSpec = {
  slug: 'input',
  Component: Input,
  sizes: ['sm', 'md', 'lg'],
  baseProps: BASE_PROPS,
  // A custom renderer keeps the password toggle live in every rung. A `node`
  // would bypass the size ramp, while the ordinary cases still need the same
  // base-prop merge the matrix's default renderer supplies.
  render: (size, props, c) =>
    c?.label === 'Password' ? (
      <LivePasswordInput {...props} size={size} />
    ) : (
      <Input {...BASE_PROPS} {...props} size={size} />
    ),
  variants: [
    { label: 'Default', props: {} },
    { label: 'With icon', props: { icon: MagnifyingGlass } },
    {
      label: 'Password',
      props: {
        label: 'Password',
        type: 'password',
        defaultValue: 'ORBITAL-7742',
        icon: LockKey,
      },
    },
    // error is a STRING prop; the cva `state` axis is DERIVED from it
    // (Input.tsx:130), never passed, so this case is what covers that axis.
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
