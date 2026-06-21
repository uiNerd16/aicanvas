import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verträge kündigen',
  robots: { index: false, follow: true },
}

export default function KuendigenLayout({ children }: { children: React.ReactNode }) {
  return children
}
