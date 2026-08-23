import type { Metadata } from 'next'

const description =
  'Free forever: every free component with one-command installs and AI remix prompts. Premium adds the closed-source components, blocks, design systems and templates.'

export const metadata: Metadata = {
  title: 'Pricing',
  description,
  alternates: { canonical: '/pricing' },
  openGraph: { title: 'AI Canvas Pricing', description, url: '/pricing' },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
