import { NextRequest, NextResponse } from 'next/server'
import { getEntitlement } from '@/app/lib/entitlement'
import { classifyContent } from '@/lib/registry/content-type'
import { loadContentLookup } from '@/lib/registry/lookup'
import { dailyLimitFor } from '@/lib/registry/limits'
import { premiumEnabled } from '@/lib/flags'
import { utcDay, subjectFor, consume, ipFromHeaders } from '@/app/lib/quota'
import { getComponentCode } from '@/app/lib/component-source'

export const runtime = 'nodejs'

const NO_STORE = { 'Cache-Control': 'private, no-store' }

/**
 * On-demand source for the web Code tab. Gated so premium/over-limit users
 * never receive the bytes. Mirrors the registry-route gate: premium-only
 * content fails CLOSED on entitlement errors; standalone metering fails open.
 * Permissive/off: serve source (today's behavior). Enforce additionally
 * requires the premium UI flag (no upgrade path without it).
 */
export async function GET(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get('slug') ?? ''
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'bad slug' }, { status: 400, headers: NO_STORE })
  }

  const code = await getComponentCode(slug)
  if (code == null) {
    return NextResponse.json({ error: 'not found' }, { status: 404, headers: NO_STORE })
  }

  let mode = process.env.REGISTRY_ENFORCEMENT ?? 'permissive'
  if (mode === 'enforce' && !premiumEnabled()) {
    console.error('[component-code gate] enforce without premium UI — falling back to permissive')
    mode = 'permissive'
  }

  if (mode === 'enforce') {
    const lookup = loadContentLookup()
    const contentType = classifyContent(slug, lookup)

    if (contentType === 'design-system' || contentType === 'template') {
      // Premium-only: fail CLOSED — never hand out premium bytes on error.
      let tier
      try {
        tier = (await getEntitlement(req)).tier
      } catch (err) {
        console.error('[component-code gate] entitlement error — failing closed:', err)
        return NextResponse.json({ error: 'temporarily-unavailable' }, { status: 503, headers: NO_STORE })
      }
      if (tier !== 'premium') {
        return NextResponse.json({ error: 'premium-only' }, { status: 402, headers: NO_STORE })
      }
    } else if (contentType === 'standalone' || contentType === 'design-system-component') {
      // Standalones AND individual design-system components are free-metered.
      // Metering: fail OPEN (an outage must not break the Code tab).
      try {
        const { tier, userId } = await getEntitlement(req)
        if (tier !== 'premium') {
          const limit = dailyLimitFor(tier)
          const day = utcDay(new Date())
          const subject = subjectFor(userId, ipFromHeaders(req.headers), day)
          // Idempotent slug-aware consume: re-opening the Code tab of a
          // component already pulled today is free, even at the limit.
          if (!(await consume(subject, slug, limit))) {
            return NextResponse.json({ error: 'quota-exceeded', limit }, { status: 402, headers: NO_STORE })
          }
        }
      } catch (err) {
        console.error('[component-code gate] failing open (metering):', err)
      }
    }
  }

  return NextResponse.json({ code }, { headers: NO_STORE })
}
