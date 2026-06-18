export type ContentType =
  | 'standalone'
  | 'design-system-component'
  | 'design-system'
  | 'template'
  | 'meta'

export interface ContentLookup {
  /** Slugs of individual design-system components (carry a `designSystem` flag). */
  designSystemSlugs: Set<string>
  /** Slugs of design-system templates (e.g. andromeda-mission-control). */
  templateSlugs: Set<string>
  /** Bare system names whose whole-system aggregates are premium (e.g. andromeda). */
  systemSlugs: Set<string>
}

// Catalog/index files the CLI and MCP need to browse — never gated, never metered.
const META_SLUGS = new Set(['registry', 'aicanvas-mcp'])

/**
 * Classify a registry slug (with or without a trailing `.json`).
 *
 * The registry contains more than per-component files. `generate-registry.mjs`
 * also emits, per design system, three whole-system aggregates:
 *   <system>.json         (the system as one item)
 *   <system>-all.json     (system + every template, the entire premium catalog)
 *   <system>-tokens.json  (the token foundation)
 * These are matched EXACTLY, not by an `<system>-*` prefix, because a
 * standalone can legitimately share a system's name prefix — e.g.
 * `andromeda-button` is a free standalone, not part of the Andromeda system.
 * A broad prefix would wrongly gate it. Real design-system components and
 * templates are caught by the explicit lookup sets above instead.
 */
export function classifyContent(slugOrFile: string, lookup: ContentLookup): ContentType {
  const slug = slugOrFile.replace(/\.json$/, '')

  if (META_SLUGS.has(slug)) return 'meta'
  if (lookup.templateSlugs.has(slug)) return 'template'

  // Whole-system aggregates stay premium-only (the "install the entire
  // system" items). Matched EXACTLY (see note above) so a standalone sharing
  // the name prefix — e.g. `andromeda-button` — is not caught here.
  for (const system of lookup.systemSlugs) {
    if (slug === system || slug === `${system}-all` || slug === `${system}-tokens`) {
      return 'design-system'
    }
  }

  // Individual design-system components are FREE-METERED like standalones
  // (anon 2 / free 10 / premium unlimited). Only templates and the whole-
  // system aggregates above are premium-only.
  if (lookup.designSystemSlugs.has(slug)) return 'design-system-component'

  return 'standalone'
}
