import { describe, it, expect } from 'vitest'
import { dailyLimitFor } from './limits'

describe('dailyLimitFor', () => {
  it('anonymous is 2', () => expect(dailyLimitFor('anonymous')).toBe(2))
  it('free is 10', () => expect(dailyLimitFor('free')).toBe(10))
  it('premium is Infinity', () => expect(dailyLimitFor('premium')).toBe(Infinity))
})
