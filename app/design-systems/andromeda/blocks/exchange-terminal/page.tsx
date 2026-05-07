// @ts-nocheck — consumes Andromeda tokens which are not type-checked yet.
'use client'

import ExchangeTerminal from '../../../../../design-systems/andromeda/examples/exchange-terminal'
import { tokens } from '../../../../../design-systems/andromeda/tokens'
import { BlockChrome } from '../../../../_components/BlockChrome'

export default function ExchangeTerminalBlock() {
  return (
    <div
      className="relative min-h-full"
      style={{ backgroundColor: tokens.color.surface.base }}
    >
      <ExchangeTerminal />
      <BlockChrome
        blockSlug="andromeda-exchange-terminal"
        blockName="Exchange Terminal"
        systemName="Andromeda"
        fallbackHref="/design-systems/andromeda/showcase"
      />
    </div>
  )
}
