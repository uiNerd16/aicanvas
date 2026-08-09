// v2 component: imported through the build-time shim.
import { DataTable } from '../../../lib/andromeda-v2.generated'
import type { MatrixSpec } from './types'

export const dataTable: MatrixSpec = {
  slug: 'data-table',
  Component: DataTable,
  sizes: null,
  wide: true,
  variants: [
    { label: 'Defaults', props: {} },
    { label: 'No selection', props: { selectedRowKey: null } },
  ],
  states: [],
  gaps: {
    'Row hover':
      'the row rule lives in the component\'s own scoped stylesheet, and this source is vault-side — the companion line that would fire it at rest belongs in that repo, not this one',
  },
}
