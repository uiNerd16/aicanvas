import type { ContentLookup } from './content-type'

/** Shape of registry-data/_manifest.json (written by generate-registry.mjs). */
export interface GateManifest {
  systemSlugs: string[]
  designSystemSlugs: string[]
  templateSlugs: string[]
}

/** Pure: build the classifier lookup from a manifest object. */
export function buildLookup(manifest: GateManifest): ContentLookup {
  return {
    designSystemSlugs: new Set(manifest.designSystemSlugs),
    templateSlugs: new Set(manifest.templateSlugs),
    systemSlugs: new Set(manifest.systemSlugs),
  }
}
