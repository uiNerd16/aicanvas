import 'server-only'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ContentLookup } from './content-type'
import { buildLookup, type GateManifest } from './manifest'

let cached: ContentLookup | null = null

/**
 * Load the classifier lookup from registry-data/_manifest.json — written by
 * scripts/generate-registry.mjs from what it ACTUALLY emits, so the paywall
 * classifier can never drift from the registry contents (the previous
 * approach read a designSystem flag off the component registry, which no
 * entry set, silently classifying every design-system component as a free
 * standalone). The underscore name keeps it unservable via /r (filename
 * regex rejects it); outputFileTracingIncludes bundles it on Vercel.
 *
 * If the manifest is missing (build misconfiguration), fall back to a
 * minimal hardcoded set so SYSTEM aggregates and templates still gate, and
 * log loudly — never fail silently open for the whole catalog.
 */
export function loadContentLookup(): ContentLookup {
  if (cached) return cached
  try {
    const raw = readFileSync(join(process.cwd(), 'registry-data', '_manifest.json'), 'utf8')
    cached = buildLookup(JSON.parse(raw) as GateManifest)
  } catch (err) {
    console.error('[registry gate] _manifest.json missing/unreadable — using minimal fallback:', err)
    cached = buildLookup({
      systemSlugs: ['andromeda'],
      designSystemSlugs: [],
      templateSlugs: [
        'andromeda-mission-control',
        'andromeda-service-order',
        'andromeda-resource-planning',
        'andromeda-signal-room',
      ],
    })
  }
  return cached
}
