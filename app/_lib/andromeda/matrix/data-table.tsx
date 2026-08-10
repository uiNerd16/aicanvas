// v2 component: imported through the build-time shim.
import { DataTable } from '../../../lib/andromeda-v2.generated'
import type { MatrixSpec } from './types'

export const dataTable: MatrixSpec = {
  slug: 'data-table',
  Component: DataTable,
  sizes: null,
  wide: true,
  // The per-row info bubble is position:absolute with no portal, so it needs the
  // same two escapes a popover case needs: the body must not become a scroll
  // container, and the showcase section must not sit in a paint-contained box.
  // No case passes staticOpen, so the coverage test does not demand this line —
  // the mobile layout does. Below the md breakpoint the info column appears and
  // its Tooltip opens up, on the side the renderer reads off the wrapper's
  // data-tooltip-placement.
  //
  // The horizontal scroll it gives up was never doing anything, at EITHER width.
  // The table is width:100% with table-layout:fixed, so its floor is whichever
  // explicit column widths are being DISPLAYED, and that is two different
  // numbers: 192 above md (duration + plays + last), 40 below it (the info
  // column alone, since those three go display:none there). The narrowest body
  // either page produces is ~590 above md, and below md the table is down to two
  // columns, so neither floor is ever reached. No box of our own to shrink
  // either, so this needs no minWidth:0 companion.
  //
  // The 33px reserve does NOT hold this bubble on its own — it is the last 33 of
  // 71, and the sum is worth writing down because the margin is 1px. Room above
  // the FIRST row's trigger, the tightest one:
  //   reserve 33 + thead row 26 + the cell's spacing[3] 12 padding-top   = 71
  // Bubble, at the four folded columns this spec renders (artist, duration,
  // plays, last):
  //   4 x size.xs 10 line box + 3 x spacing[1] 4 grid gap
  //     + 2 x spacing[1] 4 padding + 2 x 1px border                      = 62
  //   + its spacing[2] 8 offset from the trigger                         = 70
  // Matrix.tsx's 33 is derived for a ONE-LINE label, so it never covered this by
  // itself; the thead row and the cell padding are what make it fit. A FIFTH
  // folded column adds 14 (row + gap) and puts the bubble 13px short. Re-derive
  // it here, not there, if a token or the column list moves.
  overflow: true,
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
