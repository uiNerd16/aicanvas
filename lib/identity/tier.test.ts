import { describe, it, expect } from 'vitest'
import { deriveTier } from './tier'

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
})
