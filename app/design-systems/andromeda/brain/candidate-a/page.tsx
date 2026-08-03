import type { Metadata } from 'next'
import { BrainRun } from './BrainRun'

// DEV CANDIDATE A of the Andromeda Brain landing redesign. Not the live page
// (that is ../page.tsx) — noindex so it can never compete for the real route
// in search while it is being reviewed.
export const metadata: Metadata = {
  title: 'Andromeda Brain: candidate A',
  description: 'Design exploration: the Andromeda Brain explained by showing one prompt become a finished screen.',
  robots: { index: false, follow: false },
}

export default function AndromedaBrainCandidateAPage() {
  return <BrainRun />
}
