/**
 * Anonymous server-to-server PostHog capture, shared by proxy.ts (pageviews,
 * registry hits) and /api/e (client beacons).
 *
 * Privacy contract, load-bearing for the privacy policy: events are
 * anonymous ($process_person_profile: false), the default distinct_id is
 * the constant 'site' — NO visitor identifier — and the client IP never
 * reaches PostHog because every call is server-to-server. Do not weaken
 * any of these three properties.
 */

const POSTHOG_KEY = process.env.POSTHOG_KEY
const POSTHOG_HOST = process.env.POSTHOG_HOST ?? 'https://us.i.posthog.com'

export const posthogConfigured = Boolean(POSTHOG_KEY)

export async function phCapture(
  event: string,
  properties: Record<string, unknown>,
  distinctId = 'site',
): Promise<void> {
  if (!POSTHOG_KEY) return
  // Local dev must never pollute the production project — .env.local
  // carries the prod key. Vercel previews still emit (NODE_ENV is
  // 'production' there) but are separable via the env property below.
  if (process.env.NODE_ENV !== 'production') return
  try {
    await fetch(`${POSTHOG_HOST}/i/v0/e/`, {
      method: 'POST',
      // Hard timeout: phCapture is called from latency-sensitive paths
      // (edge proxy, Paddle webhook) — a hanging PostHog must never stall
      // them. A dropped count is an acceptable loss.
      signal: AbortSignal.timeout(3000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event,
        distinct_id: distinctId,
        properties: {
          ...properties,
          env: process.env.VERCEL_ENV ?? 'unknown',
          $process_person_profile: false,
        },
        timestamp: new Date().toISOString(),
      }),
    })
  } catch (err) {
    console.error('[analytics] posthog ingest failed:', err)
  }
}
