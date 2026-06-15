import { describe, it, expect } from 'vitest'
import { deriveTier, isPremiumNow } from './tier'

describe('deriveTier', () => {
  it('no user is anonymous', () => {
    expect(deriveTier({ hasUser: false, status: 'none' })).toBe('anonymous')
  })
  it('logged-in with no subscription is free', () => {
    expect(deriveTier({ hasUser: true, status: 'none' })).toBe('free')
  })
  it('active subscription is premium', () => {
    expect(deriveTier({ hasUser: true, status: 'active' })).toBe('premium')
  })
  it('trialing is premium', () => {
    expect(deriveTier({ hasUser: true, status: 'trialing' })).toBe('premium')
  })
  it('canceled / past_due / paused fall back to free', () => {
    expect(deriveTier({ hasUser: true, status: 'canceled' })).toBe('free')
    expect(deriveTier({ hasUser: true, status: 'past_due' })).toBe('free')
    expect(deriveTier({ hasUser: true, status: 'paused' })).toBe('free')
  })
  it('an expired period revokes premium even when status is stale-active', () => {
    expect(deriveTier({ hasUser: true, status: 'active', currentPeriodEnd: '2020-01-01T00:00:00Z' })).toBe('free')
  })
})

describe('isPremiumNow', () => {
  const now = new Date('2026-06-12T12:00:00Z')
  it('active with a future period end is premium', () => {
    expect(isPremiumNow('active', '2027-01-01T00:00:00Z', now)).toBe(true)
  })
  it('active with a PAST period end is NOT premium (dropped-cancel guard)', () => {
    expect(isPremiumNow('active', '2026-01-01T00:00:00Z', now)).toBe(false)
  })
  it('active with no recorded period end trusts the status', () => {
    expect(isPremiumNow('active', null, now)).toBe(true)
  })
  it('non-premium statuses are never premium', () => {
    expect(isPremiumNow('canceled', '2027-01-01T00:00:00Z', now)).toBe(false)
    expect(isPremiumNow('none', null, now)).toBe(false)
  })
})
