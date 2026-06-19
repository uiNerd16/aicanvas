import type { Tier } from './entitlement'

// The free cap can be overridden via FREE_DAILY_LIMIT (server-only) for local
// testing — set it in .env.local. Unset (e.g. production) → defaults to 10.
const FREE_DAILY_LIMIT = Number(process.env.FREE_DAILY_LIMIT) || 10

/** Daily standalone-component limits per tier. Dials — change here only. */
const LIMITS: Record<Tier, number> = {
  anonymous: 2,
  free: FREE_DAILY_LIMIT,
  premium: Infinity,
}

export function dailyLimitFor(tier: Tier): number {
  return LIMITS[tier]
}
