import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock only the two database clients. The token parsing, the revoked filter
// contract, and the tier derivation all run for real.
const rows: { user_api_keys: unknown; user_subscriptions: unknown } = {
  user_api_keys: null,
  user_subscriptions: null,
}
function table(name: keyof typeof rows) {
  const q = {
    select: () => q,
    eq: () => q,
    maybeSingle: async () => ({ data: rows[name], error: null }),
    update: () => ({ eq: () => ({ then: (cb: () => void) => Promise.resolve().then(cb) }) }),
  }
  return q
}
vi.mock('@/app/lib/supabase/admin', () => ({
  createAdminClient: () => ({ from: (name: keyof typeof rows) => table(name) }),
}))
vi.mock('@/app/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: null } }) } }),
}))

import { getEntitlement } from './entitlement'

const TOKEN = 'aic_' + 'a'.repeat(48)
const req = () => new Request(`https://aicanvas.me/r/x.json?token=${TOKEN}`)

beforeEach(() => {
  rows.user_api_keys = null
  rows.user_subscriptions = null
})

describe('getEntitlement (token path)', () => {
  it('a token past its old expiry date still resolves to the account and its tier', async () => {
    rows.user_api_keys = { user_id: 'u1', expires_at: '2020-01-01T00:00:00Z' }
    rows.user_subscriptions = { status: 'active', current_period_end: null }
    expect(await getEntitlement(req())).toEqual({ tier: 'premium', userId: 'u1' })
  })

  it('a token with no subscription is the free tier, not anonymous', async () => {
    rows.user_api_keys = { user_id: 'u2' }
    expect(await getEntitlement(req())).toEqual({ tier: 'free', userId: 'u2' })
  })

  it('an unknown or revoked token is anonymous', async () => {
    expect(await getEntitlement(req())).toEqual({ tier: 'anonymous', userId: null })
  })

  it('a lapsed subscription is free even with a valid token', async () => {
    rows.user_api_keys = { user_id: 'u3' }
    rows.user_subscriptions = { status: 'canceled', current_period_end: '2020-01-01T00:00:00Z' }
    expect(await getEntitlement(req())).toEqual({ tier: 'free', userId: 'u3' })
  })
})
