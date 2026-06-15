import { describe, it, expect } from 'vitest'
import { createHmac } from 'node:crypto'
import { verifyPaddleSignature } from './paddle-signature'

const SECRET = 'pdl_ntfset_test'
const BODY = '{"event_type":"subscription.activated"}'

function sign(ts: number, body = BODY, secret = SECRET): string {
  const h1 = createHmac('sha256', secret).update(`${ts}:${body}`).digest('hex')
  return `ts=${ts};h1=${h1}`
}

describe('verifyPaddleSignature', () => {
  const now = 1_750_000_000

  it('accepts a correctly signed, in-window request', () => {
    expect(verifyPaddleSignature(BODY, sign(now), SECRET, now)).toBe(true)
  })
  it('rejects a tampered body', () => {
    expect(verifyPaddleSignature(BODY + 'x', sign(now), SECRET, now)).toBe(false)
  })
  it('rejects the wrong secret', () => {
    expect(verifyPaddleSignature(BODY, sign(now), 'wrong', now)).toBe(false)
  })
  it('rejects a stale timestamp (replay outside tolerance)', () => {
    expect(verifyPaddleSignature(BODY, sign(now), SECRET, now + 400)).toBe(false)
  })
  it('rejects a missing or malformed header', () => {
    expect(verifyPaddleSignature(BODY, null, SECRET, now)).toBe(false)
    expect(verifyPaddleSignature(BODY, 'garbage', SECRET, now)).toBe(false)
  })
  it('rejects when the secret is empty (fail closed)', () => {
    expect(verifyPaddleSignature(BODY, sign(now, BODY, ''), '', now)).toBe(false)
  })
})
