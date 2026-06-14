import { createHmac, timingSafeEqual } from 'node:crypto'

const TOLERANCE_SEC = 300

/**
 * Verify a `Paddle-Signature` header against the raw request body.
 * Header shape: `ts=<unix>;h1=<hex hmac>`. The HMAC is over `<ts>:<rawBody>`.
 * `now` is unix seconds (injected so this stays pure/testable).
 */
export function verifyPaddleSignature(
  rawBody: string,
  header: string | null,
  secret: string,
  now: number,
): boolean {
  if (!header || !secret) return false

  const parts = Object.fromEntries(
    header.split(';').map((kv) => {
      const i = kv.indexOf('=')
      return [kv.slice(0, i).trim(), kv.slice(i + 1).trim()]
    }),
  )
  const ts = Number(parts.ts)
  const h1 = parts.h1
  if (!ts || !h1) return false
  if (Math.abs(now - ts) > TOLERANCE_SEC) return false

  const expected = createHmac('sha256', secret).update(`${ts}:${rawBody}`).digest('hex')
  const a = Buffer.from(expected, 'hex')
  const b = Buffer.from(h1, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}
