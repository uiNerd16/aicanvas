import type { Metadata } from 'next'
import { BrainEssay } from './BrainEssay'

// CANDIDATE B: design exploration for the public Andromeda Brain page.
// Editorial narrative treatment. Dev-only route: noindex until a candidate wins.
export const metadata: Metadata = {
  title: 'The Andromeda Brain: the rulebook your agent reads',
  description:
    'An essay on the judgment layer of the Andromeda design system: the files an AI agent reads before it builds, and why the first draft comes back on-brand.',
  robots: { index: false, follow: false },
}

export default function CandidateBPage() {
  return <BrainEssay />
}
