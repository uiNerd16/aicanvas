// The barrel. Hand-written on purpose: one import line per component means
// parallel builders adding specs never touch the same lines twice, and it
// mirrors the per-component .rules.md convention the brain already uses.
import type { MatrixSpec } from './types'
import { alert } from './alert'
import { avatar } from './avatar'
import { badge } from './badge'
import { button } from './button'
import { card } from './card'
import { checkbox } from './checkbox'
import { emptyState } from './empty-state'
import { gauge } from './gauge'
import { heatGrid } from './heat-grid'
import { iconButton } from './icon-button'
import { input } from './input'
import { navItem } from './nav-item'
import { panelHeader } from './panel-header'
import { planet } from './planet'
import { progressBar } from './progress-bar'
import { radio } from './radio'
import { searchField } from './search-field'
import { segmentedControl } from './segmented-control'
import { slider } from './slider'
import { spinner } from './spinner'
import { statTile } from './stat-tile'
import { tag } from './tag'
import { textarea } from './textarea'
import { toggle } from './toggle'

export const SPECS: readonly MatrixSpec[] = [
  alert, avatar, badge, button, card, checkbox, emptyState, gauge, heatGrid,
  iconButton, input, navItem, panelHeader, planet, progressBar, radio,
  searchField, segmentedControl, slider, spinner, statTile, tag, textarea,
  toggle,
]

export const SPEC_BY_SLUG: Record<string, MatrixSpec> = Object.fromEntries(
  SPECS.map((s) => [s.slug, s]),
)

export { matrixId, REST, CONTROL_STATES } from './types'
export type { MatrixSpec, MatrixCase } from './types'
