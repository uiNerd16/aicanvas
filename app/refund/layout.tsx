import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  robots: { index: false, follow: true },
}

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return children
}
