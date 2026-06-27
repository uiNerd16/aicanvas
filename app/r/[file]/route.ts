import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { classifyContent } from '@/lib/registry/content-type'
import { loadContentLookup } from '@/lib/registry/lookup'
import { getEntitlement } from '@/app/lib/entitlement'
import { dailyLimitFor } from '@/lib/registry/limits'
import { premiumEnabled } from '@/lib/flags'
import { utcDay, subjectFor, consume, ipFromHeaders, maybePruneUsage } from '@/app/lib/quota'
import { extractToken } from '@/lib/identity/token'

export const runtime = 'nodejs'

const DATA_DIR = join(process.cwd(), 'registry-data')

// 'meta' content (catalog/index files + the free token foundation) is never
// gated or metered — see classifyContent. The gate below skips it via the
// contentType check, so there's no slug list to maintain here.

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
  // premium-standalone gates exactly like a design system / template: binary,
  // fail-closed, never free-metered, never shared-cached.
  const premiumContent =
    contentType === 'design-system' ||
    contentType === 'template' ||
    contentType === 'premium-standalone'

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

  // ── Mode-INDEPENDENT gating for closed content ────────────────────────────
  // Premium gating must NOT hang off REGISTRY_ENFORCEMENT: closed-source bytes
  // can never be served free just because the flag is permissive (the prod
  // default). Both branches below are inert until a premium slug exists or the
  // manifest goes missing, so current free / DS / template / meta behaviour is
  // byte-for-byte unchanged.
  if (contentType !== 'meta' && lookup.degraded) {
    // Missing _manifest.json → cannot tell a premium standalone from a free one
    // → fail CLOSED for all non-meta, in ANY mode. Loud + temporary, never a leak.
    console.error('[registry gate] degraded lookup (manifest missing) — failing closed on', slug)
    return paymentJson({ error: 'temporarily-unavailable', message: 'Please retry shortly.' }, 503)
  }
  if (contentType === 'premium-standalone') {
    // Closed-source standalone: ALWAYS requires premium entitlement, in any mode.
    // Fail CLOSED on any entitlement error — never hand out premium bytes.
    let tier
    try {
      tier = (await getEntitlement(req)).tier
    } catch (err) {
      console.error('[registry gate] entitlement error on premium standalone — failing closed:', err)
      return paymentJson({ error: 'temporarily-unavailable', message: 'Please retry shortly.' }, 503)
    }
    if (tier !== 'premium') {
      // Free / anon: don't 402 (shadcn renders that as a cryptic, misleading
      // error). Serve a 200 PLACEHOLDER item — the install succeeds and drops a
      // single clearly-labelled file pointing to /pricing. ZERO real source.
      return premiumStub(body, slug)
    }
  }

  if (mode === 'enforce' && contentType !== 'meta') {
    // ── Premium DESIGN SYSTEMS / TEMPLATES: fail CLOSED ───────────────────
    // The existing soft-gate model — gated only when enforcing. (premium-
    // standalone is gated mode-independently above, so it is excluded here.)
    if (contentType === 'design-system' || contentType === 'template') {
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
    } else if (contentType === 'standalone' || contentType === 'design-system-component') {
      // ── Free metering: fail OPEN ───────────────────────────────────────
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

  // Token propagation: the shadcn CLI fetches each registryDependency URL
  // VERBATIM (no auth header, no query token). They ship as bare aicanvas.me /r
  // URLs, so a premium/gated dependency would 402 on that follow-up fetch and
  // abort the whole install. If THIS request carried a token the gate already
  // honored, stamp it onto every aicanvas.me /r dependency so the CLI's next
  // fetch is authorized too. It propagates the whole chain automatically: each
  // rewritten dep URL carries the token, so when the CLI fetches it, this route
  // re-runs and rewrites that file's deps in turn (resource-planning ->
  // andromeda -> andromeda-tokens). Anon requests (no token) are untouched —
  // deps stay bare and 402 correctly.
  const token = extractToken(req)
  let outBody = body
  let outCache = cacheControl
  if (token) {
    try {
      const parsed = JSON.parse(body)
      const deps = parsed?.registryDependencies
      if (Array.isArray(deps)) {
        const stamped = deps.map((d: unknown) => (typeof d === 'string' ? withToken(d, token) : d))
        if (stamped.some((d, i) => d !== deps[i])) {
          parsed.registryDependencies = stamped
          outBody = JSON.stringify(parsed)
          outCache = 'private, no-store' // a token-bearing body must never be shared-cached
        }
      }
    } catch {
      // Non-JSON / malformed body: serve as-is (defensive; registry files are JSON).
    }
  }

  return new NextResponse(outBody, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-AICanvas-Content-Type': contentType,
      'Cache-Control': outCache,
    },
  })
}

/**
 * Free/anon request for a premium standalone → a 200 PLACEHOLDER registry item.
 * The CLI install SUCCEEDS and writes ONE clearly-labelled file pointing to
 * /pricing (far clearer than shadcn's cryptic 402 rendering), and it carries
 * ZERO real source — the placeholder replaces every file's content and drops
 * the npm deps.
 */
function premiumStub(realBody: string, slug: string): NextResponse {
  let title = slug
  let parsed: Record<string, unknown> = {}
  try {
    parsed = JSON.parse(realBody)
    if (typeof parsed.title === 'string') title = parsed.title
  } catch {
    /* defaults below */
  }
  // The message must be RENDERABLE, not a comment — shadcn's add transform
  // strips comments. A string const + JSX text both survive and show the upgrade
  // path when the placeholder is used.
  const msg =
    `"${title}" is a premium AI Canvas component. ` +
    `This is a placeholder — unlock the real source with an AI Canvas Premium ` +
    `account at https://aicanvas.me/pricing`
  const stub =
    `const PREMIUM_NOTICE =\n` +
    `  ${JSON.stringify(msg)}\n\n` +
    `export default function PremiumLocked() {\n` +
    `  return (\n` +
    `    <div style={{ padding: 24, fontFamily: 'ui-monospace, monospace', fontSize: 13, lineHeight: 1.6, color: '#9aa3af' }}>\n` +
    `      {PREMIUM_NOTICE}\n` +
    `    </div>\n` +
    `  )\n` +
    `}\n`
  const files = Array.isArray(parsed.files)
    ? (parsed.files as Array<Record<string, unknown>>).map((f) => ({ ...f, content: stub }))
    : [{ path: `components/aicanvas/${slug}.tsx`, type: 'registry:ui', target: `components/aicanvas/${slug}.tsx`, content: stub }]
  const item = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: slug,
    type: 'registry:ui',
    title: `${title} (Premium — locked)`,
    description: 'Premium AI Canvas component. Upgrade to install the real source: https://aicanvas.me/pricing',
    dependencies: [],
    registryDependencies: [],
    files,
  }
  return NextResponse.json(item, {
    status: 200,
    headers: { 'Cache-Control': 'private, no-store', 'X-AICanvas-Content-Type': 'premium-standalone' },
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

/**
 * Append a token to our OWN /r registry-dependency URLs so the shadcn CLI's
 * verbatim follow-up fetch of a dependency is authorized. Leaves non-aicanvas
 * URLs, bare component names, and already-tokened URLs untouched. URLSearchParams
 * handles the `?` vs `&` separator automatically.
 */
function withToken(dep: string, token: string): string {
  let u: URL
  try {
    u = new URL(dep)
  } catch {
    return dep // bare component name, not a URL
  }
  if (u.hostname !== 'aicanvas.me') return dep // foreign registry — never stamp our token on it
  if (!u.pathname.startsWith('/r/')) return dep // non-/r aicanvas URL
  if (u.searchParams.has('token')) return dep // already carries a token
  u.searchParams.set('token', token)
  return u.toString()
}
