// The barrel. Hand-written on purpose: one import line per component means
// parallel builders adding specs never touch the same lines twice, and it
// mirrors the per-component .rules.md convention the brain already uses.
import type { MatrixSpec } from './types'
import { badge } from './badge'
import { button } from './button'
import { input } from './input'

export const SPECS: readonly MatrixSpec[] = [badge, button, input]

export const SPEC_BY_SLUG: Record<string, MatrixSpec> = Object.fromEntries(
  SPECS.map((s) => [s.slug, s]),
)

export { matrixId, REST, CONTROL_STATES } from './types'
export type { MatrixSpec, MatrixCase } from './types'
