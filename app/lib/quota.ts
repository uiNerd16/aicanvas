import 'server-only'
import { createHmac } from 'node:crypto'
import { createAdminClient } from '@/app/lib/supabase/admin'

/** UTC calendar day as YYYY-MM-DD. */
export function utcDay(now: Date): string {
  return now.toISOString().slice(0, 10)
}

/**
 * Subject key for the counter. Anonymous IPs are hashed with a PER-DAY key
 * (HMAC of the salt and the day), so hashes cannot be linked across days and a
 * leaked salt exposes at most one day of subjects — GDPR data minimization.
 * Fails CLOSED on a missing salt: an empty salt would make subjects
 * attacker-reconstructable (targeted quota poisoning). The routes' metering
 * fail-open catches the throw, so installs keep working while the
 * misconfiguration is logged loudly.
 */
export function subjectFor(userId: string | null, ip: string | null, day: string): string {
  if (userId) return `user:${userId}`
  const salt = process.env.USAGE_IP_SALT
  if (!salt) throw new Error('USAGE_IP_SALT is not set — anonymous metering disabled')
  const dayKey = createHmac('sha256', salt).update(day).digest()
  const hash = createHmac('sha256', dayKey).update(ip ?? 'unknown').digest('hex')
  return `ip:${hash}`
}

/**
 * Idempotent slug-aware consume over a ROLLING 24h window. True when allowed:
 * a slug pulled in the last 24h (free re-access, no new unit) or the subject is
 * under the limit within the window (one new unit). The DB function does the
 * window math + a per-subject advisory lock so the limit is a hard ceiling.
 */
export async function consume(
  subject: string, slug: string, limit: number,
): Promise<boolean> {
  if (limit === Infinity) return true
  const admin = createAdminClient()
  const { data, error } = await admin.rpc('consume_quota', {
    p_subject: subject,
    p_slug: slug,
    p_limit: limit,
  })
  if (error) throw error
  return data === true
}

/**
 * Read-only usage snapshot for the website's proactive limit check (no consume).
 * `oldestAt + 24h` is when the next slot frees — the reset time shown to the
 * user. `slugCounted` means this slug is already in the window, so re-copying
 * its install command is free even at the cap.
 */
export async function usageStatus(
  subject: string, slug: string,
): Promise<{ used: number; slugCounted: boolean; oldestAt: string | null }> {
  const admin = createAdminClient()
  const { data, error } = await admin.rpc('usage_status', { p_subject: subject, p_slug: slug })
  if (error) throw error
  const row = (Array.isArray(data) ? data[0] : data) as
    | { used: number; slug_counted: boolean; oldest_at: string | null }
    | undefined
  return {
    used: row?.used ?? 0,
    slugCounted: row?.slug_counted ?? false,
    oldestAt: row?.oldest_at ?? null,
  }
}

/**
 * Read the client IP from request headers. Prefer x-real-ip (set by Vercel's
 * proxy, not client-forgeable there) over the x-forwarded-for chain, whose
 * leftmost entry can be attacker-supplied on other hosts.
 */
export function ipFromHeaders(headers: Headers): string | null {
  const real = headers.get('x-real-ip')
  if (real) return real.trim()
  const xff = headers.get('x-forwarded-for')
  return xff ? xff.split(',')[0].trim() : null
}

// Retention: hashed-IP usage rows are pseudonymous personal data, so they must
// not be kept forever. No cron on this stack — prune best-effort at most once
// per server instance per day from the hot path. The day index makes it cheap.
let lastPruneDay: string | null = null
const RETENTION_DAYS = 30

export function maybePruneUsage(day: string): void {
  if (lastPruneDay === day) return
  lastPruneDay = day
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000).toISOString().slice(0, 10)
  void createAdminClient()
    .from('usage_daily')
    .delete()
    .lt('day', cutoff)
    .then(({ error }) => {
      // Best-effort, but never silent: a denied/failing prune means the 30-day
      // retention promise in the privacy policy is not being kept.
      if (error) console.error('[usage retention] prune failed:', error)
    })
}
