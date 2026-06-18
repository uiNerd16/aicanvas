import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { classifyContent } from '@/lib/registry/content-type'
import { loadContentLookup } from '@/lib/registry/lookup'
import { getEntitlement } from '@/app/lib/entitlement'
import { dailyLimitFor } from '@/lib/registry/limits'
import { premiumEnabled } from '@/lib/flags'
import { utcDay, subjectFor, consume, ipFromHeaders, maybePruneUsage } from '@/app/lib/quota'

export const runtime = 'nodejs'

const DATA_DIR = join(process.cwd(), 'registry-data')

// Catalog/index files — never gated, never metered (the CLI + MCP need them to
// browse; metering them would break discovery after 2 anonymous requests).
const META_FILES = new Set(['registry', 'aicanvas-mcp'])

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params
  // Only allow simple `<slug>.json` names — no path traversal.
  if (!/^[a-z0-9-]+\.json$/.test(file)) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  let body: string
  try {
    body = await readFile(join(DATA_DIR, file), 'utf8')
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  const lookup = loadContentLookup()
  const contentType = classifyContent(file, lookup)
  const slug = file.replace(/\.json$/, '')
  const mode = effectiveMode()
  const premiumContent = contentType === 'design-system' || contentType === 'template'

  // Cache policy: meta is truly public; premium content is never shared-cached
  // in ANY mode (a permissive-mode CDN entry must not survive an enforce flip);
  // standalones are per-caller once enforcing. 402/503 are always no-store.
  const cacheControl =
    contentType === 'meta'
      ? 'public, max-age=300'
      : premiumContent
        ? 'private, no-store'
        : mode === 'enforce'
          ? 'private, no-store'
          : 'public, max-age=300'

  if (mode === 'enforce' && !META_FILES.has(slug)) {
    // ── Premium-only content: fail CLOSED ─────────────────────────────────
    // Gating design systems/templates is binary and needs only the tier — if
    // entitlement errors we deny (503), never hand out the premium bytes.
    if (premiumContent) {
      let tier
      try {
        tier = (await getEntitlement(req)).tier
      } catch (err) {
        console.error('[registry gate] entitlement error on premium content — failing closed:', err)
        return paymentJson({ error: 'temporarily-unavailable', message: 'Please retry shortly.' }, 503)
      }
      if (tier !== 'premium') {
        return paymentJson(
          { error: 'premium-only', message: 'This is a premium component. Upgrade at https://aicanvas.me/pricing' },
          402,
        )
      }
    } else {
      // ── Standalone metering: fail OPEN ───────────────────────────────────
      // A Supabase outage must never break installs for paying customers;
      // worst case is a few uncounted free pulls. Log loudly.
      try {
        const { tier, userId } = await getEntitlement(req)
        if (tier !== 'premium') {
          const limit = dailyLimitFor(tier)
          const day = utcDay(new Date())
          maybePruneUsage(day) // best-effort, once/instance/day — IP-row retention
          const subject = subjectFor(userId, ipFromHeaders(req.headers), day)
          // BINDING check = idempotent slug-aware consume: an already-pulled
          // slug stays free even at the limit; only a NEW slug is refused.
          const ok = await consume(subject, slug, limit)
          if (!ok) {
            return paymentJson(
              { error: 'quota-exceeded', message: `Daily limit reached (${limit}/day). Upgrade for unlimited at https://aicanvas.me/pricing` },
              402,
            )
          }
        }
      } catch (err) {
        console.error('[registry gate] failing open (metering):', err)
      }
    }
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-AICanvas-Content-Type': contentType,
      'Cache-Control': cacheControl,
    },
  })
}

/** Enforce requires the premium UI flag, else blocked users would have no
 *  upgrade path (no pricing, no paywall CTAs). Refuse to enforce without it. */
function effectiveMode(): string {
  const mode = process.env.REGISTRY_ENFORCEMENT ?? 'permissive'
  if (mode === 'enforce' && !premiumEnabled()) {
    console.error('[registry gate] REGISTRY_ENFORCEMENT=enforce but NEXT_PUBLIC_PREMIUM_ENABLED is off — falling back to permissive')
    return 'permissive'
  }
  return mode
}

function paymentJson(bodyObj: Record<string, unknown>, status: number) {
  return NextResponse.json(bodyObj, {
    status,
    headers: { 'Cache-Control': 'private, no-store' },
  })
}
