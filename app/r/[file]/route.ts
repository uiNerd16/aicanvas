import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { classifyContent } from '@/lib/registry/content-type'
import { loadContentLookup } from '@/lib/registry/lookup'
import { getEntitlement } from '@/app/lib/entitlement'
import { decide } from '@/lib/registry/entitlement'
import { dailyLimitFor } from '@/lib/registry/limits'
import { utcDay, subjectFor, currentCount, consume, ipFromHeaders, maybePruneUsage } from '@/app/lib/quota'

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

  // Kill switch: off/permissive serve everything (permissive = Plan 1 behavior,
  // plus the observability header). Default permissive until launch.
  const mode = process.env.REGISTRY_ENFORCEMENT ?? 'permissive'

  if (mode === 'enforce' && !META_FILES.has(slug)) {
    try {
      const { tier, userId } = await getEntitlement(req)
      const limit = dailyLimitFor(tier)
      const day = utcDay(new Date())
      maybePruneUsage(day) // best-effort, once/instance/day — IP-row retention
      const subject = subjectFor(userId, ipFromHeaders(req.headers), day)
      const used = await currentCount(subject, day)

      const decision = decide({ contentType, tier, dailyUsed: used, dailyLimit: limit })

      if (!decision.allow && decision.reason === 'premium-only') {
        return NextResponse.json(
          { error: 'premium-only', message: 'This is a premium component. Upgrade at https://aicanvas.me/pricing' },
          { status: 402 },
        )
      }

      // BINDING quota check = idempotent slug-aware consume (NOT decision.count,
      // which is false at the limit and would skip metering; the pre-read `used`
      // can't see that this slug was already pulled today). consume() allows an
      // already-pulled slug for free even at the limit, refuses only a NEW slug.
      const metered = contentType === 'standalone' && tier !== 'premium'
      if (metered) {
        const ok = await consume(subject, day, slug, limit)
        if (!ok) {
          return NextResponse.json(
            { error: 'quota-exceeded', message: `Daily limit reached (${limit}/day). Upgrade for unlimited at https://aicanvas.me/pricing` },
            { status: 402 },
          )
        }
      }
    } catch (err) {
      // FAIL OPEN: a Supabase/entitlement outage must never break installs for
      // paying customers. Worst case is a few uncounted free pulls. Log loudly.
      console.error('[registry gate] failing open:', err)
    }
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-AICanvas-Content-Type': contentType,
      // Per-caller once enforcing — must not be shared-cached. Permissive mode
      // keeps the short public cache (Plan 1 behavior).
      'Cache-Control': mode === 'enforce' ? 'private, no-store' : 'public, max-age=300',
    },
  })
}
