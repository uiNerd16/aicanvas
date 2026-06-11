import { describe, it, expect } from 'vitest'
import { decide } from './entitlement'

describe('decide', () => {
  it('meta files are always free and never counted', () => {
    expect(decide({ contentType: 'meta', tier: 'anonymous', dailyUsed: 99, dailyLimit: 2 }))
      .toEqual({ allow: true, count: false })
  })

  it('premium tier gets everything, uncounted', () => {
    expect(decide({ contentType: 'design-system', tier: 'premium', dailyUsed: 0, dailyLimit: Infinity }))
      .toEqual({ allow: true, count: false })
    expect(decide({ contentType: 'standalone', tier: 'premium', dailyUsed: 999, dailyLimit: Infinity }))
      .toEqual({ allow: true, count: false })
  })

  it('design systems and templates are premium-only for non-premium', () => {
    expect(decide({ contentType: 'design-system', tier: 'free', dailyUsed: 0, dailyLimit: 10 }))
      .toEqual({ allow: false, reason: 'premium-only', count: false })
    expect(decide({ contentType: 'template', tier: 'anonymous', dailyUsed: 0, dailyLimit: 2 }))
      .toEqual({ allow: false, reason: 'premium-only', count: false })
  })

  it('standalone under the limit is allowed and counted', () => {
    expect(decide({ contentType: 'standalone', tier: 'free', dailyUsed: 3, dailyLimit: 10 }))
      .toEqual({ allow: true, count: true })
  })

  it('standalone at the limit is refused', () => {
    expect(decide({ contentType: 'standalone', tier: 'anonymous', dailyUsed: 2, dailyLimit: 2 }))
      .toEqual({ allow: false, reason: 'quota-exceeded', count: false })
  })
})
