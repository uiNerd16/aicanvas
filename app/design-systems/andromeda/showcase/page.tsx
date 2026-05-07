// Thin route wrapper. The full showcase body lives in AndromedaShowcase.tsx
// so the ideation Andromeda landing can render the same content without
// duplication. Counts read from the design-system config so the header stays
// in sync with the registry generator's source of truth — adding a 29th
// component or a 5th template flips the stats line on the next build.
import AndromedaShowcase from './AndromedaShowcase'
import { DESIGN_SYSTEMS } from '../../../../scripts/lib/design-systems.config.mjs'

export default function ShowcasePage() {
  const andromeda = DESIGN_SYSTEMS.find((s: { slug: string }) => s.slug === 'andromeda')
  const componentCount = andromeda?.systemEntries.length ?? 0
  const templateCount = andromeda?.templates.length ?? 0

  return (
    <AndromedaShowcase
      componentCount={componentCount}
      templateCount={templateCount}
    />
  )
}
