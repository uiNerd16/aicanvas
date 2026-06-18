import { NextRequest, NextResponse } from 'next/server'
import { getEntitlement } from '@/app/lib/entitlement'
import { classifyContent } from '@/lib/registry/content-type'
import { loadContentLookup } from '@/lib/registry/lookup'
import { dailyLimitFor } from '@/lib/registry/limits'
import { premiumEnabled } from '@/lib/flags'
import { utcDay, subjectFor, ipFromHeaders, usageStatus } from '@/app/lib/quota'

export const runtime = 'nodejs'

const NO_STORE = { 'Cache-Control': 'private, no-store' }
const WINDOW_MS = 24 * 60 * 60 * 1000

/**
 * Proactive limit check for the website's "Copy CLI" action: would pulling
 * <slug> right now be refused for this caller? Lets the UI pop the limit modal
 * instead of handing over a command that will 402 in the terminal. Read-only —
 * never consumes. Fails OPEN (blocked:false) so a hiccup never blocks a copy.
 *
 * `resetAt` is when the next slot frees on the rolling 24h window (oldest
 * in-window install + 24h); null when nothing is in the window.
 */
export async function GET(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get('slug') ?? ''
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'bad slug' }, { status: 400, headers: NO_STORE })
  }

  // Only meaningful when the gate is actually enforcing (matches the registry
  // route). Permissive/off → installs aren't metered, so never block a copy.
  const enforcing =
    (process.env.REGISTRY_ENFORCEMENT ?? 'permissive') === 'enforce' && premiumEnabled()
  if (!enforcing) {
    return NextResponse.json({ blocked: false, enforcing: false }, { headers: NO_STORE })
  }

  try {
    const { tier, userId } = await getEntitlement(req)
    if (tier === 'premium') {
      return NextResponse.json({ blocked: false, tier, remaining: null }, { headers: NO_STORE })
    }

    // Premium-only content (design-system aggregates / templates) is blocked
    // for any non-premium tier regardless of quota — reason 'premium-only'.
    const contentType = classifyContent(slug, loadContentLookup())
    if (contentType === 'design-system' || contentType === 'template') {
      return NextResponse.json(
        { blocked: true, reason: 'premium-only', tier },
        { headers: NO_STORE },
      )
    }

    // Metered content: blocked only at the rolling-window cap for a NEW slug.
    const limit = dailyLimitFor(tier)
    const day = utcDay(new Date())
    const subject = subjectFor(userId, ipFromHeaders(req.headers), day)
    const { used, slugCounted, oldestAt } = await usageStatus(subject, slug)
    const remaining = Math.max(0, limit - used)
    const blocked = remaining <= 0 && !slugCounted
    const resetAt = oldestAt
      ? new Date(new Date(oldestAt).getTime() + WINDOW_MS).toISOString()
      : null

    return NextResponse.json(
      { blocked, reason: blocked ? 'quota-exceeded' : null, tier, limit, used, remaining, slugCounted, resetAt },
      { headers: NO_STORE },
    )
  } catch (err) {
    console.error('[install-check] failing open:', err)
    return NextResponse.json({ blocked: false }, { headers: NO_STORE })
  }
}
