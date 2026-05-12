// @ts-nocheck — consumes Andromeda tokens which are not type-checked yet.
'use client'

import MissionControl from '../../../../../design-systems/andromeda/examples/mission-control'
import { tokens } from '../../../../../design-systems/andromeda/tokens'
import { TemplateChrome } from '../../../../_components/TemplateChrome'

// Distraction-free template. The Andromeda sidebar/topbar are suppressed for
// routes matching TEMPLATE_LEAF_RE (see IdeationSidebar + IdeationTopBar) so
// the dashboard fills the viewport. TemplateChrome is the floating widget
// with Back, template name + system, and an Install CLI popover.

export default function MissionControlTemplate() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: tokens.color.surface.base }}
    >
      <MissionControl />
      <TemplateChrome
        templateSlug="andromeda-mission-control"
        templateName="Mission Control"
        systemName="Andromeda"
        fallbackHref="/design-systems/andromeda/showcase"
      />
    </div>
  )
}
