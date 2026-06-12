import { NextRequest, NextResponse } from 'next/server'
import { getEntitlement } from '@/app/lib/entitlement'
import { classifyContent } from '@/lib/registry/content-type'
import { loadContentLookup } from '@/lib/registry/lookup'
import { decide } from '@/lib/registry/entitlement'
import { dailyLimitFor } from '@/lib/registry/limits'
import { utcDay, subjectFor, currentCount, consume, ipFromHeaders } from '@/app/lib/quota'
import { getComponentCode } from '@/app/lib/component-source'

export const runtime = 'nodejs'

/**
 * On-demand source for the web Code tab. Gated so premium/over-limit users
 * never receive the bytes. Mirrors the registry-route gate (same flag, same
 * fail-open). Permissive/off: serve source (today's behavior).
 */
export async function GET(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get('slug') ?? ''
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'bad slug' }, { status: 400 })
  }

  const code = await getComponentCode(slug)
  if (code == null) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const mode = process.env.REGISTRY_ENFORCEMENT ?? 'permissive'
  if (mode === 'enforce') {
    try {
      const lookup = loadContentLookup()
      const contentType = classifyContent(slug, lookup)
      const { tier, userId } = await getEntitlement(req)
      const limit = dailyLimitFor(tier)
      const day = utcDay(new Date())
      const subject = subjectFor(userId, ipFromHeaders(req.headers), day)
      const used = await currentCount(subject, day)

      const decision = decide({ contentType, tier, dailyUsed: used, dailyLimit: limit })
      if (!decision.allow && decision.reason === 'premium-only') {
        return NextResponse.json({ error: 'premium-only', limit }, { status: 402 })
      }
      // Idempotent slug-aware consume: re-opening the Code tab of a component
      // already pulled today is free, even at the limit.
      const metered = contentType === 'standalone' && tier !== 'premium'
      if (metered && !(await consume(subject, day, slug, limit))) {
        return NextResponse.json({ error: 'quota-exceeded', limit }, { status: 402 })
      }
    } catch (err) {
      console.error('[component-code gate] failing open:', err)
    }
  }

  return NextResponse.json({ code })
}
