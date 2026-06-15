import { describe, it, expect } from 'vitest'
import { isPremiumEnabled } from './flags'

describe('isPremiumEnabled', () => {
  it('true only for the literal "true"', () => {
    expect(isPremiumEnabled('true')).toBe(true)
    expect(isPremiumEnabled('false')).toBe(false)
    expect(isPremiumEnabled('1')).toBe(false)
    expect(isPremiumEnabled('TRUE')).toBe(false)
    expect(isPremiumEnabled('')).toBe(false)
    expect(isPremiumEnabled(undefined)).toBe(false)
  })
})
