// Live registry-pull count for the homepage stats strip.
//
// Source: PostHog. proxy.ts logs one `registry_hit` event per /r/*.json request
// — shadcn CLI, our MCP, browsers and directory crawlers alike.
//
// The homepage therefore advertises PULLS SERVED, never "installs". Roughly two
// thirds of the volume is crawlers indexing the registry, so labelling this as
// installs would overstate adoption by ~7x. The honest install number lives in
// the "Top components — REAL CLI installs (shadcn only)" PostHog insight, which
// filters user_agent = 'shadcn'. Keep the homepage label about requests served.
//
// Requires POSTHOG_PERSONAL_API_KEY — server-only, NEVER prefixed NEXT_PUBLIC_.
// Without the key, or on any error, we render FALLBACK_PULLS. The homepage must
// never break, hang, or show a wrong number because an analytics API had a bad
// day, so every failure path lands on the fallback.
//
// CACHING: via unstable_cache, deliberately NOT route-level `revalidate`. The
// root layout builds a Supabase server client, which reads cookies and opts
// every page out of static rendering — so the homepage is server-rendered per
// request and an `export const revalidate` would be a no-op. unstable_cache is
// independent of render mode, so PostHog is queried at most once a day no
// matter how many visitors arrive.

import { unstable_cache } from 'next/cache'

// NOT the same host as proxy.ts. POSTHOG_HOST is the *ingest* endpoint
// (us.i.posthog.com); the query API lives on the app host (us.posthog.com).
// Reusing POSTHOG_HOST here would POST the query at the ingest host and always
// fall back. Kept as its own var so the two can never be confused again.
const POSTHOG_API_HOST = process.env.POSTHOG_API_HOST ?? 'https://us.posthog.com'
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID ?? '405886'

/**
 * Conservative floor. True as of 2026-07-28 (actual: 25,775) and the underlying
 * count only ever increases, so this stays true even if it goes unmaintained.
 * Shown whenever the live query is unavailable. Bump it now and then.
 */
export const FALLBACK_PULLS = 25_000

/** One PostHog query per day, not one per visitor. */
const REVALIDATE_SECONDS = 86_400

/** Never let a slow analytics API block a page render for long. */
const TIMEOUT_MS = 5_000

async function fetchRegistryPulls(): Promise<number> {
  const key = process.env.POSTHOG_PERSONAL_API_KEY
  if (!key) return FALLBACK_PULLS

  try {
    const res = await fetch(`${POSTHOG_API_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: {
          kind: 'HogQLQuery',
          query: "select count() from events where event = 'registry_hit'",
        },
      }),
      // No fetch-level cache options: unstable_cache below is the single
      // caching layer, so there is only one revalidate window to reason about.
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) throw new Error(`PostHog responded ${res.status}`)

    const json = await res.json()
    const value = Number(json?.results?.[0]?.[0])

    // A malformed or partial response must never make the public number shrink:
    // a homepage stat that goes backwards looks worse than one that is stale.
    if (!Number.isFinite(value) || value < FALLBACK_PULLS) return FALLBACK_PULLS

    return Math.floor(value)
  } catch (err) {
    console.error('[registry-stats] PostHog query failed, using fallback:', err)
    return FALLBACK_PULLS
  }
}

/**
 * The homepage entry point. Hits PostHog at most once per REVALIDATE_SECONDS
 * across all visitors and both homepage routes; every other request is served
 * from Next's cache. Tagged so a future `revalidateTag('registry-pulls')` can
 * force a refresh without waiting out the window.
 */
export const getRegistryPulls = unstable_cache(
  fetchRegistryPulls,
  ['registry-pulls'],
  { revalidate: REVALIDATE_SECONDS, tags: ['registry-pulls'] },
)
