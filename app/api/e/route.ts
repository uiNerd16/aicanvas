/**
 * First-party analytics beacon relay. The browser sends allowlisted UI
 * events here (via app/lib/analytics.ts track()/beacon() and SiteBeacon);
 * this route forwards them server-to-server to PostHog.
 *
 * Why a relay instead of a client SDK: the client IP stops here — the
 * analytics store only ever sees Vercel's edge. No cookie, no visitor id,
 * no fingerprint. Privacy contract details: app/lib/analytics-server.ts.
 *
 * Abuse posture: the event allowlist plus a same-origin check stop drive-by
 * junk, not a determined attacker — anyone faking an Origin header can still
 * submit events. Known ceiling, accepted: worst case is noise in a free
 * analytics project. Add a per-IP rate limit if it ever actually happens.
 */

import { phCapture, posthogConfigured } from '../../lib/analytics-server'
import { BEACON_EVENTS } from '../../lib/analytics'

export const runtime = 'edge'

const ALLOWED = new Set<string>(BEACON_EVENTS)

const MAX_PROPS = 10
const MAX_VALUE_LENGTH = 300
// PostHog-reserved keys the client is allowed to set — everything else
// starting with $ is dropped so a forged beacon cannot inject reserved
// properties (e.g. $ip) into the store.
const DOLLAR_ALLOWED = new Set(['$pathname', '$referrer', '$current_url'])

export async function POST(request: Request): Promise<Response> {
  // Analytics never fails loud: every path returns 204, errors included.
  try {
    if (!posthogConfigured) return new Response(null, { status: 204 })

    // Same-origin only. sendBeacon always carries Origin; a request with a
    // foreign one is not ours. Host comparison (not a hardcoded domain) so
    // preview deployments keep working.
    const origin = request.headers.get('origin')
    if (origin !== null && new URL(origin).host !== new URL(request.url).host) {
      return new Response(null, { status: 204 })
    }

    const body: unknown = await request.json()
    if (typeof body !== 'object' || body === null) return new Response(null, { status: 204 })
    const { event, props } = body as { event?: unknown; props?: unknown }
    if (typeof event !== 'string' || !ALLOWED.has(event)) {
      return new Response(null, { status: 204 })
    }

    // Keep only primitive props, capped in count and length — the beacon
    // payload is caller-controlled and PostHog storage is forever.
    const clean: Record<string, string | number | boolean> = {}
    if (typeof props === 'object' && props !== null) {
      for (const [key, value] of Object.entries(props).slice(0, MAX_PROPS)) {
        if (key.startsWith('$') && !DOLLAR_ALLOWED.has(key)) continue
        if (typeof value === 'string') clean[key] = value.slice(0, MAX_VALUE_LENGTH)
        else if (typeof value === 'number' || typeof value === 'boolean') clean[key] = value
      }
    }

    await phCapture(event, {
      ...clean,
      country: request.headers.get('x-vercel-ip-country') ?? undefined,
      region: request.headers.get('x-vercel-ip-country-region') ?? undefined,
    })
  } catch {
    /* malformed beacon — drop it */
  }
  return new Response(null, { status: 204 })
}
