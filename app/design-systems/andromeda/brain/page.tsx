import { JetBrains_Mono } from 'next/font/google'
import { BrainStoryV4 } from './BrainStoryV4'

// The Andromeda Brain LANDING — the public marketing story. Anyone can view it
// (it renders only the structure teaser, never brain content). The reader with
// the real rule files lives at the gated child route ./explore/page.tsx.
const jbm = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata = {
  title: 'The Andromeda Brain — Design Intelligence for AI Agents',
  description:
    'The judgment layer for Andromeda: foundations, per-component rules, and skills your AI coding agent reads to build on-brand UI. One command installs the whole brain.',
}

export default function AndromedaBrainLandingPage() {
  return (
    <div className={jbm.variable}>
      <BrainStoryV4 />
    </div>
  )
}
