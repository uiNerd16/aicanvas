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

/** How many UNIQUE components this subject has pulled today (row count). */
export async function currentCount(subject: string, day: string): Promise<number> {
  const admin = createAdminClient()
  const { count } = await admin
    .from('usage_daily')
    .select('*', { count: 'exact', head: true })
    .eq('subject', subject)
    .eq('day', day)
  return count ?? 0
}

/**
 * Idempotent slug-aware consume. True when allowed: already-pulled slug
 * (free re-access, no new unit) or under the limit (one new unit).
 */
export async function consume(
  subject: string, day: string, slug: string, limit: number,
): Promise<boolean> {
  if (limit === Infinity) return true
  const admin = createAdminClient()
  const { data, error } = await admin.rpc('consume_quota', {
    p_subject: subject,
    p_day: day,
    p_slug: slug,
    p_limit: limit,
  })
  if (error) throw error
  return data === true
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
