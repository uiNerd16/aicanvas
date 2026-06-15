// TEST surface for the new Andromeda landing — hero → featured showcase →
// templates grid → components carousel. Lives at /design-systems/andromeda/overview
// while we evaluate it. If approved, page.tsx (the system root) renders
// <AndromedaOverview /> instead of <AndromedaShowcase>, and this route is removed.
import { AndromedaOverview } from './AndromedaOverview'

export const metadata = {
  title: 'Andromeda — overview (preview)',
}

export default function AndromedaOverviewPreviewPage() {
  return <AndromedaOverview />
}
