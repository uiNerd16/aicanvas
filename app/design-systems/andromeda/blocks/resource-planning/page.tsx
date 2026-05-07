// @ts-nocheck — consumes Andromeda tokens which are not type-checked yet.
'use client'

import ResourcePlanning from '../../../../../design-systems/andromeda/examples/resource-planning'
import { tokens } from '../../../../../design-systems/andromeda/tokens'
import { BlockChrome } from '../../../../_components/BlockChrome'

export default function ResourcePlanningBlock() {
  return (
    <div
      className="relative min-h-full"
      style={{ backgroundColor: tokens.color.surface.base }}
    >
      <ResourcePlanning />
      <BlockChrome
        blockSlug="andromeda-resource-planning"
        blockName="Resource Planning"
        systemName="Andromeda"
        fallbackHref="/design-systems/andromeda/showcase"
      />
    </div>
  )
}
