import 'server-only'
import { componentCodes } from '@/app/lib/component-codes.generated'
import { getAndromedaComponent } from '@/app/_lib/andromeda/andromeda-registry'

/**
 * Returns the raw source string for a component slug, or null if unknown.
 *
 * - Standalones: from the generated code map (does not duplicate source).
 * - Individual design-system components (now free-metered, e.g.
 *   `andromeda-checkbox`): resolved from the system registry by stripping the
 *   `<system>-` prefix. Templates + whole-system aggregates are NOT served
 *   here — the gate 402s those before the source is ever needed.
 */
export async function getComponentCode(slug: string): Promise<string | null> {
  const map = componentCodes as Record<string, string>
  if (map[slug] != null) return map[slug]

  if (slug.startsWith('andromeda-')) {
    const entry = getAndromedaComponent(slug.slice('andromeda-'.length))
    if (entry) return entry.code
  }

  return null
}
