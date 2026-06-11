import type { Tier } from '../registry/entitlement'

export type SubStatus =
  | 'none' | 'active' | 'trialing' | 'past_due' | 'paused' | 'canceled'

const PREMIUM_STATUSES: ReadonlySet<SubStatus> = new Set(['active', 'trialing'])

/** Pure: maps account + subscription state to a tier. */
export function deriveTier(input: { hasUser: boolean; status: SubStatus }): Tier {
  if (!input.hasUser) return 'anonymous'
  return PREMIUM_STATUSES.has(input.status) ? 'premium' : 'free'
}
