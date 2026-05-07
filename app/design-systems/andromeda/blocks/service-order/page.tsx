// @ts-nocheck — consumes Andromeda tokens which are not type-checked yet.
'use client'

import ServiceOrder from '../../../../../design-systems/andromeda/examples/service-order'
import { tokens } from '../../../../../design-systems/andromeda/tokens'
import { BlockChrome } from '../../../../_components/BlockChrome'

export default function ServiceOrderBlock() {
  return (
    <div
      className="relative min-h-full"
      style={{ backgroundColor: tokens.color.surface.base }}
    >
      <ServiceOrder />
      <BlockChrome
        blockSlug="andromeda-service-order"
        blockName="Service Order"
        systemName="Andromeda"
        fallbackHref="/design-systems/andromeda/showcase"
      />
    </div>
  )
}
