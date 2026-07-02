// @ts-nocheck — consumes Andromeda tokens which are not type-checked yet.
'use client'

import ResourcePlanning from '../../../../../design-systems/andromeda/examples/resource-planning'
import { tokens } from '../../../../../design-systems/andromeda/tokens'
import { TemplatePreviewShell } from '../../../../_components/TemplatePreviewShell'

// Distraction-free template. The Andromeda sidebar/topbar are suppressed for
// routes matching TEMPLATE_LEAF_RE (see Sidebar) so the shell owns the full
// column. TemplatePreviewShell supplies the shared top bar (logo, System /
// Template breadcrumb, desktop/mobile responsive toggles + replay, and the
// Install / Unlock-with-Premium CTA + auth), and renders the dashboard either
// full-bleed (desktop) or inside a real device-viewport iframe (mobile).

export default function ResourcePlanningTemplate() {
  return (
    <TemplatePreviewShell
      templateSlug="andromeda-resource-planning"
      templateName="Resource Planning"
      systemName="Andromeda"
      systemHref="/design-systems/andromeda"
    >
      <div
        className="relative h-full min-h-full w-full md:overflow-hidden"
        style={{ backgroundColor: tokens.color.surface.base }}
      >
        <ResourcePlanning />
      </div>
    </TemplatePreviewShell>
  )
}
