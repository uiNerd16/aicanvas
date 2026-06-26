import type { ContentLookup } from './content-type'

/** Shape of registry-data/_manifest.json (written by generate-registry.mjs). */
export interface GateManifest {
  systemSlugs: string[]
  designSystemSlugs: string[]
  templateSlugs: string[]
  /** Premium-only standalone slugs (from registry-data/_premium.json at build). */
  premiumSlugs: string[]
}

/** Pure: build the classifier lookup from a manifest object. */
export function buildLookup(manifest: GateManifest): ContentLookup {
  return {
    designSystemSlugs: new Set(manifest.designSystemSlugs),
    templateSlugs: new Set(manifest.templateSlugs),
    systemSlugs: new Set(manifest.systemSlugs),
    // Tolerate an older manifest with no premiumSlugs key (defensive): no
    // premium slugs simply means nothing gates as premium-standalone.
    premiumSlugs: new Set(manifest.premiumSlugs ?? []),
  }
}
