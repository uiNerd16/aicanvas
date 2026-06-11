'use client'

import { useSyncExternalStore } from 'react'

export type Tier = 'anonymous' | 'free' | 'premium'

/**
 * Shape mirrors the future server-backed entitlement (Plan 2's getEntitlement
 * returns `{ tier, userId }`; Plan 3 adds usage) so the swap is mechanical.
 */
export interface Entitlement {
  tier: Tier
  userId: string | null
  usedToday: number
  limit: number
}

/**
 * Dev-only override store so reviewers can flip every premium UI state by
 * hand before any backend exists. Four states instead of three tiers so the
 * free tier can be previewed both under and at its daily limit.
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
  // Anonymous previews AT the 2/day limit so the wall is visible by default.
  'anonymous': { tier: 'anonymous', userId: null, usedToday: 2, limit: 2 },
  'free-under': { tier: 'free', userId: 'dev-stub', usedToday: 3, limit: 10 },
  'free-at-limit': { tier: 'free', userId: 'dev-stub', usedToday: 10, limit: 10 },
  'premium': { tier: 'premium', userId: 'dev-stub', usedToday: 0, limit: Infinity },
}

/**
 * STUB. Returns a fake entitlement driven by the dev override.
 * Replaced by the real server-backed entitlement in Plan 3.
 */
export function useEntitlement(): Entitlement {
  const state = useDevTierState()
  return ENTITLEMENTS[state]
}
