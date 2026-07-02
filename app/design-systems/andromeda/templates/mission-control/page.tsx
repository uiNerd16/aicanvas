// @ts-nocheck — consumes Andromeda tokens which are not type-checked yet.
'use client'

import MissionControl from '../../../../../design-systems/andromeda/examples/mission-control'
import { tokens } from '../../../../../design-systems/andromeda/tokens'
import { TemplatePreviewShell } from '../../../../_components/TemplatePreviewShell'

// Distraction-free template. The Andromeda sidebar/topbar are suppressed for
// routes matching TEMPLATE_LEAF_RE (see Sidebar + IdeationTopBar) so the shell
// owns the full column. TemplatePreviewShell supplies the top bar (logo,
// System / Template breadcrumb, desktop/tablet/phone responsive toggles, and
// the Install / Unlock-with-Premium CTA + auth), and renders the dashboard
// either full-bleed (desktop) or inside a real device-viewport iframe.

export default function MissionControlTemplate() {
  return (
    <TemplatePreviewShell
      templateSlug="andromeda-mission-control"
      templateName="Mission Control"
      systemName="Andromeda"
      systemHref="/design-systems/andromeda"
    >
      <div
        className="relative h-full min-h-full w-full md:overflow-hidden"
        style={{ backgroundColor: tokens.color.surface.base }}
      >
        <MissionControl />
      </div>
    </TemplatePreviewShell>
  )
}
