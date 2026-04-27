import { redirect } from 'next/navigation'

// /ideation lands you directly on the Andromeda showcase — that's the only
// design system shipped today, and the systems overview page was retired.
// Add a chooser back here when a second system goes live.
export default function IdeationRoot() {
  redirect('/ideation/design-systems/andromeda')
}
