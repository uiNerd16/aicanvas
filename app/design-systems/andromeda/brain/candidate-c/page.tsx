import { preload } from 'react-dom'
import { JetBrains_Mono } from 'next/font/google'
import { BrainStoryV4 } from './BrainStoryV4'

// CANDIDATE C: the production brain landing, copied verbatim as the baseline to
// modify. Its BrainStoryV4.tsx is a byte copy of the live one, so a diff against
// ../BrainStoryV4.tsx shows exactly what this candidate changes and nothing else.
const jbm = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata = {
  title: 'The Andromeda Brain: Design Rules for On-Brand UI',
  description:
    'Tokens and components are the pieces. The brain is the judgment that assembles them: every rule, foundation, and skill your AI agent reads, so what it builds already matches the system instead of a guess.',
  // Dev-only review route, same as the other candidates: never let a duplicate
  // of the real landing page compete with it in search.
  robots: { index: false, follow: false },
}

export default function AndromedaBrainCandidateCPage() {
  // Kick off the GLB byte-fetch at HTML-parse time, before client JS hydrates
  // or Three.js even loads — see BrainStoryV4 for the loader that consumes it.
  preload('/models/brain.glb', { as: 'fetch', crossOrigin: 'anonymous' })

  return (
    <div className={jbm.variable}>
      <BrainStoryV4 />
    </div>
  )
}
