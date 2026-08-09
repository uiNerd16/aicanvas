// @ts-nocheck — imports an untyped design-system source.
import { SearchField } from '../../../../design-systems/andromeda/components/SearchField'
import type { MatrixSpec } from './types'

export const searchField: MatrixSpec = {
  slug: 'search-field',
  Component: SearchField,
  sizes: ['sm', 'md', 'lg'],
  baseProps: { placeholder: 'Search anything', style: { width: 320 } },
  variants: [
    { label: 'Default', props: {} },
    { label: 'Custom shortcut', props: { shortcut: '⌘ F' } },
    { label: 'No shortcut', props: { shortcut: null } },
    { label: 'With value', props: { defaultValue: 'orbital launch' } },
  ],
  states: [{ label: 'Disabled', props: { disabled: true } }],
  gaps: {
    Hover:
      'the border and background come from React state (isHover / isFocus drive inline styles), not CSS pseudo-classes, so no attribute can force them',
    Focus:
      'same mechanism as hover — the focus ring is an inline style keyed off component state, not a focus-visible rule',
  },
}
