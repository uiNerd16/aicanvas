import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms',
  robots: { index: false, follow: true },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
