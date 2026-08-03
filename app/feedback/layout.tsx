import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feedback',
  description:
    'Tell us what to fix or build next on AI Canvas. Pick a category, say one thing, leave an email only if you want a reply.',
}

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children
}
