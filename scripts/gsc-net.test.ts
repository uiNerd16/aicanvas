import { describe, it, expect } from 'vitest'
import { withTimeout, withRetry, guardedCall } from './gsc-net'

describe('withTimeout', () => {
  it('resolves with the value when the promise settles in time', async () => {
    await expect(withTimeout(Promise.resolve(42), 1000, 'ok')).resolves.toBe(42)
  })

  it('rejects with a timeout error when the promise never settles', async () => {
    const never = new Promise<number>(() => {}) // hangs forever — the exact bug we guard against
    await expect(withTimeout(never, 20, 'stall')).rejects.toThrow(/timed out after 20ms: stall/)
  })

  it('propagates the underlying rejection unchanged', async () => {
    await expect(withTimeout(Promise.reject(new Error('boom')), 1000, 'x')).rejects.toThrow('boom')
  })
})

describe('withRetry', () => {
  it('returns on the first success without retrying', async () => {
    let calls = 0
    const r = await withRetry(async () => (calls++, 'v'), 2, 1)
    expect(r).toBe('v')
    expect(calls).toBe(1)
  })

  it('retries once then succeeds', async () => {
    let calls = 0
    const r = await withRetry(
      async () => {
        calls++
        if (calls === 1) throw new Error('transient')
        return 'ok'
      },
      2,
      1,
    )
    expect(r).toBe('ok')
    expect(calls).toBe(2)
  })

  it('rethrows the last error after exhausting attempts', async () => {
    let calls = 0
    await expect(
      withRetry(async () => {
        calls++
        throw new Error(`fail-${calls}`)
      }, 2, 1),
    ).rejects.toThrow('fail-2')
    expect(calls).toBe(2)
  })
})

describe('guardedCall', () => {
  it('passes a fast successful call straight through', async () => {
    await expect(guardedCall(() => Promise.resolve('data'), 'label')).resolves.toBe('data')
  })
})
