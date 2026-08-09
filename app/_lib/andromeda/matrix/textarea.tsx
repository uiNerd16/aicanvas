import { Textarea } from '../../../../design-systems/andromeda/components/Textarea'
import { CONTROL_STATES, type MatrixSpec } from './types'

export const textarea: MatrixSpec = {
  slug: 'textarea',
  Component: Textarea,
  sizes: ['sm', 'md', 'lg'],
  baseProps: { label: 'Notes', placeholder: 'ADD A NOTE…', rows: 3, style: { width: 260 } },
  variants: [
    { label: 'Default', props: {} },
    // Same shape as Input: error is a string prop that derives the cva state
    // axis, so this case is what covers that axis.
    { label: 'Error', props: { error: 'Brief must be at least 80 characters' } },
  ],
  states: [
    ...CONTROL_STATES,
    { label: 'Error focus', props: { error: 'Brief must be at least 80 characters' }, force: 'focus' },
    { label: 'Filled', props: { defaultValue: 'Re-entry corridor confirmed. Awaiting go for deorbit burn.' } },
  ],
}
