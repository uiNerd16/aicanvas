// @ts-nocheck — consumes Andromeda tokens which are not type-checked yet.
'use client'

import ServiceOrder from '../../../../../design-systems/andromeda/examples/service-order'
import { tokens } from '../../../../../design-systems/andromeda/tokens'
import { TemplateChrome } from '../../../../_components/TemplateChrome'

export default function ServiceOrderTemplate() {
  return (
    <div
      className="relative min-h-full"
      style={{ backgroundColor: tokens.color.surface.base }}
    >
      <ServiceOrder />
      <TemplateChrome
        templateSlug="andromeda-service-order"
        templateName="Service Order"
        systemName="Andromeda"
        fallbackHref="/design-systems/andromeda/showcase"
      />
    </div>
  )
}
