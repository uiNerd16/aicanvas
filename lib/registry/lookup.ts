import type { ContentLookup } from './content-type'
import { COMPONENTS, DESIGN_SYSTEM_META } from '@/app/lib/component-registry'

let cached: ContentLookup | null = null

/**
 * Build (once) the lookup sets the classifier needs, from the registry's own
 * source of truth:
 * - `designSystemSlugs`: components carrying a `designSystem` flag.
 * - `systemSlugs` + `templateSlugs`: from DESIGN_SYSTEM_META, which mirrors
 *   what `generate-registry.mjs` emits (system aggregates + templates).
 *
 * Server-only: imports the full component registry. Only the `/r` route uses it.
 */
export function loadContentLookup(): ContentLookup {
  if (cached) return cached

  const designSystemSlugs = new Set<string>()
  const templateSlugs = new Set<string>()
  const systemSlugs = new Set<string>()

  for (const entry of COMPONENTS) {
    if (entry.designSystem) designSystemSlugs.add(entry.slug)
  }
  for (const meta of Object.values(DESIGN_SYSTEM_META)) {
    systemSlugs.add(meta.slug)
    for (const t of meta.templates) templateSlugs.add(t.slug)
  }

  cached = { designSystemSlugs, templateSlugs, systemSlugs }
  return cached
}
