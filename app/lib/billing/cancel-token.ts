import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

// ─── cancel-token ─────────────────────────────────────────────────────────────
// A short-lived, signed token that authorizes executing ONE specific
// cancellation. The link in the §312k Eingangsbestätigung email carries it;
// clicking the link proves the recipient controls the account email (ownership)
// without requiring a login — so a stranger who merely guesses an email can't
// cancel someone else's subscription.
//
// HMAC key: a dedicated CANCEL_LINK_SECRET if set, otherwise the server-only
// SUPABASE_SECRET_KEY (present anywhere this code can reach Paddle/the DB).

function secret(): string {
  const s = process.env.CANCEL_LINK_SECRET || process.env.SUPABASE_SECRET_KEY
  if (!s) throw new Error('No signing secret for cancel tokens (set CANCEL_LINK_SECRET or SUPABASE_SECRET_KEY)')
  return s
}

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromB64url(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
}

export type CancelClaims = {
  /** Paddle subscription ids to cancel. One token covers ALL of an email's
   *  active subscriptions (a customer can rarely have more than one). */
  sids: string[]
  /** Account email the request came from (audit / display). */
  email: string
  /** Ordinary vs extraordinary cancellation (§312k Abs. 2 Nr. 1). */
  kind: 'ordentlich' | 'ausserordentlich'
  /** Stated reason — only for an extraordinary cancellation. */
  reason?: string
  /** Expiry, unix seconds. */
  exp: number
}

export function signCancelToken(claims: CancelClaims): string {
  const payload = b64url(Buffer.from(JSON.stringify(claims)))
  const sig = b64url(createHmac('sha256', secret()).update(payload).digest())
  return `${payload}.${sig}`
}

/** Returns the claims if the token is well-formed, unexpired, and authentic; else null. */
export function verifyCancelToken(token: string, now: number = Date.now()): CancelClaims | null {
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [payload, sig] = parts
  const expected = b64url(createHmac('sha256', secret()).update(payload).digest())
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const raw = JSON.parse(fromB64url(payload).toString('utf8')) as Record<string, unknown>
    // Back-compat: legacy tokens carried a single `sid`; normalize to `sids`.
    const sids = Array.isArray(raw.sids)
      ? raw.sids
      : typeof raw.sid === 'string'
        ? [raw.sid]
        : null
    if (!sids || sids.length === 0 || !sids.every((s) => typeof s === 'string')) return null
    if (typeof raw.email !== 'string' || typeof raw.exp !== 'number') return null
    if (raw.kind !== 'ordentlich' && raw.kind !== 'ausserordentlich') return null
    if (raw.exp * 1000 < now) return null
    return {
      sids: sids as string[],
      email: raw.email,
      kind: raw.kind,
      reason: typeof raw.reason === 'string' ? raw.reason : undefined,
      exp: raw.exp,
    }
  } catch {
    return null
  }
}
