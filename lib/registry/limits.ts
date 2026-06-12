import type { Tier } from './entitlement'

/** Daily standalone-component limits per tier. Dials — change here only. */
const LIMITS: Record<Tier, number> = {
  anonymous: 2,
  free: 10,
  premium: Infinity,
}

export function dailyLimitFor(tier: Tier): number {
  return LIMITS[tier]
}
