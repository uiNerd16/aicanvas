import { describe, it, expect } from 'vitest'
import { isWellFormedToken, extractToken } from './token'

describe('isWellFormedToken', () => {
  it('accepts a valid aic_ hex token', () => {
    expect(isWellFormedToken('aic_' + 'a'.repeat(48))).toBe(true)
  })
  it('rejects wrong prefix', () => {
    expect(isWellFormedToken('tok_' + 'a'.repeat(48))).toBe(false)
  })
  it('rejects non-hex / wrong length', () => {
    expect(isWellFormedToken('aic_zzz')).toBe(false)
    expect(isWellFormedToken('aic_' + 'a'.repeat(47))).toBe(false)
    expect(isWellFormedToken('aic_' + 'A'.repeat(48))).toBe(false)
  })
})

describe('extractToken', () => {
  it('reads ?token= from a URL', () => {
    const tok = 'aic_' + 'b'.repeat(48)
    expect(extractToken(new Request('https://x.dev/r/a.json?token=' + tok))).toBe(tok)
  })
  it('reads Authorization: Bearer', () => {
    const tok = 'aic_' + 'c'.repeat(48)
    const req = new Request('https://x.dev/r/a.json', { headers: { Authorization: 'Bearer ' + tok } })
    expect(extractToken(req)).toBe(tok)
  })
  it('ignores a malformed query token', () => {
    expect(extractToken(new Request('https://x.dev/r/a.json?token=nope'))).toBeNull()
  })
  it('returns null when absent', () => {
    expect(extractToken(new Request('https://x.dev/r/a.json'))).toBeNull()
  })
})
