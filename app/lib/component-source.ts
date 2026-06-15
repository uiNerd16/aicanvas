import 'server-only'
import { componentCodes } from '@/app/lib/component-codes.generated'

/**
 * Returns the raw source string for a standalone component slug, or null if
 * unknown. Reuses the existing generated code map — does not duplicate source.
 * (Design-system/template source is not delivered through this path; the gate
 * 402s those before the code is needed.)
 */
export async function getComponentCode(slug: string): Promise<string | null> {
  const map = componentCodes as Record<string, string>
  return map[slug] ?? null
}
