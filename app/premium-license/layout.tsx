import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Canvas Premium License',
  robots: { index: false, follow: true },
}

export default function PremiumLicenseLayout({ children }: { children: React.ReactNode }) {
  return children
}
