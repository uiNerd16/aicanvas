// @ts-nocheck — consumes Andromeda tokens which are not type-checked yet.
'use client'

import ExchangeTerminal from '../../../../../design-systems/andromeda/examples/exchange-terminal'
import { tokens } from '../../../../../design-systems/andromeda/tokens'
import { TemplateChrome } from '../../../../_components/TemplateChrome'

export default function ExchangeTerminalTemplate() {
  return (
    <div
      className="relative min-h-full"
      style={{ backgroundColor: tokens.color.surface.base }}
    >
      <ExchangeTerminal />
      <TemplateChrome
        templateSlug="andromeda-exchange-terminal"
        templateName="Exchange Terminal"
        systemName="Andromeda"
        fallbackHref="/design-systems/andromeda/showcase"
      />
    </div>
  )
}
