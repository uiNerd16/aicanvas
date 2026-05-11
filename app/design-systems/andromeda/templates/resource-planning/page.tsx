// @ts-nocheck — consumes Andromeda tokens which are not type-checked yet.
'use client'

import ResourcePlanning from '../../../../../design-systems/andromeda/examples/resource-planning'
import { tokens } from '../../../../../design-systems/andromeda/tokens'
import { TemplateChrome } from '../../../../_components/TemplateChrome'

export default function ResourcePlanningTemplate() {
  return (
    <div
      className="relative min-h-full"
      style={{ backgroundColor: tokens.color.surface.base }}
    >
      <ResourcePlanning />
      <TemplateChrome
        templateSlug="andromeda-resource-planning"
        templateName="Resource Planning"
        systemName="Andromeda"
        fallbackHref="/design-systems/andromeda/showcase"
      />
    </div>
  )
}
