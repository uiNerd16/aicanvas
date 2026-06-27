import { NextResponse } from 'next/server'
import { loadContentLookup } from '@/lib/registry/lookup'
import { premiumEnabled } from '@/lib/flags'

export const runtime = 'nodejs'

/**
 * Public premium health surface. One glance confirms the gate is armed and how
 * many premium components are actually loaded (counts/mode ONLY — never source).
 * Use after every deploy: premiumStandaloneCount should equal the manifest, and
 * `degraded` must be false. See the ops review (F5/F10).
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
    },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}
