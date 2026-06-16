// /design-systems/andromeda is the Andromeda system landing — the page the
// sidebar's "Andromeda" link points at. It renders the overview (hero →
// featured showcase → templates → components). The raw component grid lives at
// /design-systems/andromeda/showcase; the former /overview preview URL
// 301-redirects here (next.config.ts).
import { AndromedaOverview } from './AndromedaOverview'

export const metadata = {
  title: 'Andromeda Design System for Dashboards and Control Panels',
  description:
    'A complete, token-driven design system for dashboards, control panels, and data-dense tools. Around 32 components and 4 templates, all live and installable.',
  alternates: { canonical: '/design-systems/andromeda' },
}

export default function AndromedaPage() {
  return <AndromedaOverview />
}
