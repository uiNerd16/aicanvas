// /design-systems/andromeda is the Andromeda overview. It renders the
// same showcase body as /design-systems/andromeda/showcase so the bare
// system URL lands on the system overview, not the Mission Control
// template (which now lives at /templates/mission-control).
import AndromedaShowcase from './showcase/AndromedaShowcase'
import { DESIGN_SYSTEMS } from '../../../scripts/lib/design-systems.config.mjs'

export default function AndromedaOverviewPage() {
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
