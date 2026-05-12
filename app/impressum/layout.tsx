import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum',
  robots: { index: false, follow: true },
}

export default function ImpressumLayout({ children }: { children: React.ReactNode }) {
  return children
}
