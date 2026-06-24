import { describe, it, expect } from 'vitest'
import { mapSubscriptionFields } from './sub-mapping'

describe('mapSubscriptionFields', () => {
  it('maps a full active subscription', () => {
    const out = mapSubscriptionFields({
      status: 'active',
      id: 'sub_123',
      customer_id: 'ctm_123',
      current_billing_period: { ends_at: '2026-07-23T00:00:00Z' },
      items: [{ price: { billing_cycle: { interval: 'month' } } }],
    })
    expect(out).toEqual({
      status: 'active',
      paddle_subscription_id: 'sub_123',
      paddle_customer_id: 'ctm_123',
      current_period_end: '2026-07-23T00:00:00Z',
      plan: 'monthly',
    })
  })

  it('STEP 2 FIX: seeds current_period_end from next_billed_at when current_billing_period is absent (subscription.created shape)', () => {
    const out = mapSubscriptionFields({
      status: 'active',
      id: 'sub_123',
      items: [{ next_billed_at: '2026-07-23T00:00:00Z', price: { billing_cycle: { interval: 'month' } } }],
    })
    expect(out.current_period_end).toBe('2026-07-23T00:00:00Z')
    expect(out.status).toBe('active')
  })

  it('prefers current_billing_period.ends_at over next_billed_at', () => {
    const out = mapSubscriptionFields({
      status: 'active',
      current_billing_period: { ends_at: '2026-08-01T00:00:00Z' },
      items: [{ next_billed_at: '2026-09-01T00:00:00Z' }],
    })
    expect(out.current_period_end).toBe('2026-08-01T00:00:00Z')
  })

  it('maps an annual plan from the billing interval', () => {
    const out = mapSubscriptionFields({ status: 'active', items: [{ price: { billing_cycle: { interval: 'year' } } }] })
    expect(out.plan).toBe('annual')
  })

  it('maps every modeled status and leaves an unmodeled one undefined (caller ignores)', () => {
    expect(mapSubscriptionFields({ status: 'trialing' }).status).toBe('trialing')
    expect(mapSubscriptionFields({ status: 'past_due' }).status).toBe('past_due')
    expect(mapSubscriptionFields({ status: 'paused' }).status).toBe('paused')
    expect(mapSubscriptionFields({ status: 'canceled' }).status).toBe('canceled')
    expect(mapSubscriptionFields({ status: 'something_new' }).status).toBeUndefined()
  })

  it('sets only the fields present (so a spread can never null out ids/period)', () => {
    const out = mapSubscriptionFields({ status: 'active' })
    expect(out).toEqual({ status: 'active' })
    expect('paddle_customer_id' in out).toBe(false)
    expect('current_period_end' in out).toBe(false)
  })
})
