import type { Metadata } from 'next'

const description =
  'Free forever: every free component with one-command installs and AI remix prompts. Premium adds the closed-source components, blocks, design systems and templates.'

export const metadata: Metadata = {
  title: 'Pricing',
  description,
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'AI Canvas Pricing',
    description,
    url: '/pricing',
    type: 'website',
    images: [
      {
        url: '/og-aug2026-aicanvas.me.png',
        width: 2400,
        height: 1260,
        alt: 'AI Canvas: AI native components, design systems, blocks, templates and skills',
      },
    ],
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
