import type { ContentType } from './content-type'

export type Tier = 'anonymous' | 'free' | 'premium'

export interface DecisionInput {
  contentType: ContentType
  tier: Tier
  dailyUsed: number
  dailyLimit: number
}

export type Decision =
  | { allow: true; count: boolean }
  | { allow: false; reason: 'premium-only' | 'quota-exceeded'; count: false }

/**
 * Pure entitlement decision. No I/O.
 *
 * - `meta` (catalog/index files): always free, never metered — the CLI and MCP
 *   need them to browse, and metering them would break discovery after 2 pulls.
 * - `premium` tier: everything allowed, never metered.
 * - design systems + templates: premium-only for non-premium tiers.
 * - standalone + design-system-component (non-premium): drawn from the shared daily pool.
 *
 * NOTE: for standalone the quota check here is advisory (it feeds the
 * observability header). The BINDING check in Plan 3 is an idempotent,
 * slug-aware consume that also lets a user re-access a component they already
 * pulled today, even at the limit.
 */
export function decide(input: DecisionInput): Decision {
  const { contentType, tier, dailyUsed, dailyLimit } = input

  if (contentType === 'meta') return { allow: true, count: false }

  if (tier === 'premium') return { allow: true, count: false }

  if (contentType === 'design-system' || contentType === 'template') {
    return { allow: false, reason: 'premium-only', count: false }
  }

  // standalone + design-system-component, non-premium
  if (dailyUsed >= dailyLimit) {
    return { allow: false, reason: 'quota-exceeded', count: false }
  }
  return { allow: true, count: true }
}
