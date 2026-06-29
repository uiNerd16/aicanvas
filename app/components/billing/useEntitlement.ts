'use client'

import { useSyncExternalStore } from 'react'

export type Tier = 'anonymous' | 'free' | 'premium'

/**
 * Shape mirrors the server-backed entitlement, whose only load-bearing field is
 * `tier` (installs are uncounted now, so there is no live usage to track). The
 * `usedToday`/`limit` pair is vestigial: kept so the dev switcher can still
 * render the historical "under vs at limit" free-tier previews, never read by
 * production UI (only `tier` is consumed).
 */
export interface Entitlement {
  tier: Tier
  userId: string | null
  usedToday: number
  limit: number
}

/**
 * Dev-only override store so reviewers can flip every premium UI state by hand.
 * Four states instead of three tiers so the free tier can be previewed both
 * under and at the old daily limit. Installs are uncounted in production, so
 * these counts are illustration only, not a real metering signal.
 */
export type DevTierState = 'anonymous' | 'free-under' | 'free-at-limit' | 'premium'

const KEY = 'aicanvas:dev-tier'
const STATES: readonly DevTierState[] = ['anonymous', 'free-under', 'free-at-limit', 'premium']

function read(): DevTierState {
  if (typeof window === 'undefined') return 'anonymous'
  const raw = localStorage.getItem(KEY)
  return STATES.includes(raw as DevTierState) ? (raw as DevTierState) : 'anonymous'
}

const listeners = new Set<() => void>()

export function setDevTier(state: DevTierState) {
  localStorage.setItem(KEY, state)
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

const serverSnapshot = () => 'anonymous' as DevTierState

/** Current dev override state (for the switcher UI). */
export function useDevTierState(): DevTierState {
  return useSyncExternalStore(subscribe, read, serverSnapshot)
}

const ENTITLEMENTS: Record<DevTierState, Entitlement> = {
  // The usedToday/limit numbers are illustrative only (installs are uncounted);
  // they exist so the dev switcher can reproduce the old tier previews.
  'anonymous': { tier: 'anonymous', userId: null, usedToday: 2, limit: 2 },
  'free-under': { tier: 'free', userId: 'dev-stub', usedToday: 3, limit: 10 },
  'free-at-limit': { tier: 'free', userId: 'dev-stub', usedToday: 10, limit: 10 },
  'premium': { tier: 'premium', userId: 'dev-stub', usedToday: 0, limit: Infinity },
}

/**
 * DEV-ONLY STUB. Returns a fake entitlement driven by the dev override so the
 * tier-based premium UI states can be previewed by hand. Production never
 * renders these values: real gating happens server-side at the /r registry
 * gate, and only `tier` is ever read off the result.
 */
export function useEntitlement(): Entitlement {
  const state = useDevTierState()
  return ENTITLEMENTS[state]
}
