// Migration scaffold, deleted in phase 5 when this collapses onto /system.
// noindex + no nav link; it is publicly reachable once merged, which is fine —
// it renders only what the public component pages already render.
import AndromedaReview from './AndromedaReview'

export const metadata = {
  title: 'Andromeda review',
  robots: { index: false, follow: false },
}

export default function AndromedaReviewPage() {
  return <AndromedaReview />
}
