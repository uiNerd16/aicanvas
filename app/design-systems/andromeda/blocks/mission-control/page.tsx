// @ts-nocheck — consumes Andromeda tokens which are not type-checked yet.
'use client'

import MissionControl from '../../../../../design-systems/andromeda/examples/mission-control'
import { tokens } from '../../../../../design-systems/andromeda/tokens'
import { BlockChrome } from '../../../../_components/BlockChrome'

// Distraction-free block. The Andromeda sidebar/topbar are suppressed for
// routes matching BLOCK_LEAF_RE (see IdeationSidebar + IdeationTopBar) so the
// dashboard fills the viewport. BlockChrome is a bottom-centred floating
// widget with Back, block name + system, and an Install CLI popover.

export default function MissionControlBlock() {
  return (
    <div
      className="relative min-h-full"
      style={{ backgroundColor: tokens.color.surface.base }}
    >
      <MissionControl />
      <BlockChrome
        blockSlug="andromeda-mission-control"
        blockName="Mission Control"
        systemName="Andromeda"
        fallbackHref="/design-systems/andromeda/showcase"
      />
    </div>
  )
}
