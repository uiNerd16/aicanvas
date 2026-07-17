import { NextResponse } from 'next/server'
import { loadContentLookup } from '@/lib/registry/lookup'
import { premiumEnabled } from '@/lib/flags'

export const runtime = 'nodejs'

// Guarded require — NOT a static import — so a fork/typecheck with no injected
// build-info still compiles. inject-premium always writes at least a null stub.
type BuildInfo = { sha: string | null; pinnedSha: string | null; appSha: string | null }
let PREMIUM_BUILD: BuildInfo = { sha: null, pinnedSha: null, appSha: null }
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  PREMIUM_BUILD = (require('@/app/lib/premium-build-info.generated') as {
    PREMIUM_BUILD: BuildInfo
  }).PREMIUM_BUILD
} catch {
  /* no premium injected — free-only build */
}

/**
 * Public premium health surface. One glance confirms the gate is armed and how
 * many premium components are actually loaded (counts/mode ONLY — never source).
 * Use after every deploy: premiumStandaloneCount should equal the manifest,
 * `degraded` must be false, and `premiumSha` must equal `pinnedSha` (proving prod
 * is serving the exact premium commit recorded in premium.lock.json). The
 * publish-premium command polls this to confirm a release actually went live.
 *
 * `deployedSha` is the PUBLIC app commit this build was built from — a different
 * axis from premiumSha/pinnedSha, which track the premium VAULT pin. Without it a
 * caller cannot tell whether the response came from the deploy it just pushed or
 * from the previous one: every value above stays valid and healthy while a new
 * build is still BUILDING, or after one FAILED, so polling them alone reports
 * success on a deploy that never landed. verify-live.sh compares this to the
 * pushed HEAD. Safe to expose: this repo is public, so the sha is public already.
 * It is stamped into the generated build-info at BUILD time by inject-premium.mjs
 * (NOT read from process.env here) — a runtime read would depend on Vercel's
 * "expose System Environment Variables" project setting, and would go silently
 * null if that were off.
 */
export async function GET() {
  const lookup = loadContentLookup()
  const premiumStandalones = [...lookup.premiumSlugs].sort()
  const enforceActive =
    (process.env.REGISTRY_ENFORCEMENT ?? 'permissive') === 'enforce' && premiumEnabled()
  return NextResponse.json(
    {
      enforceActive,
      premiumStandaloneCount: premiumStandalones.length,
      premiumStandalones,
      degraded: lookup.degraded === true,
      premiumSha: PREMIUM_BUILD.sha,
      pinnedSha: PREMIUM_BUILD.pinnedSha,
      deployedSha: PREMIUM_BUILD.appSha,
    },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}
