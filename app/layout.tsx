import type { Metadata } from 'next'
import { Manrope, Geist_Mono } from 'next/font/google'
import { GeistPixelCircle } from 'geist/font/pixel'
import { Suspense } from 'react'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import { Sidebar } from './components/Sidebar'
import { MobileNav } from './components/MobileNav'
import { COMPONENTS } from './lib/component-registry'
import { GITHUB_URL, SITE_URL } from './lib/config'

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const TOTAL = COMPONENTS.length
const GLOBAL_DESCRIPTION = `Free, open-source registry of ${TOTAL} animated React components built with Tailwind CSS and Framer Motion. Each ships with reproduction prompts for Claude Code, Lovable, and v0.`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AI Canvas — Animated React Components with AI Reproduction Prompts',
    template: '%s | AI Canvas',
  },
  description: GLOBAL_DESCRIPTION,
  keywords: [
    'animated react components',
    'react component library',
    'framer motion components',
    'tailwind css components',
    'shadcn registry',
    'copy paste react components',
    'UI components with AI prompts',
    'react component AI prompt',
    'V0 animated component',
    'vibe coding UI components',
    'free react UI components',
    'open source animated components',
    'animated UI kit',
  ],
  openGraph: {
    type: 'website',
    siteName: 'AI Canvas',
    title: 'AI Canvas — Animated React Components with AI Reproduction Prompts',
    description: GLOBAL_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
    images: [
      {
        url: '/AIcanvas-OG.webp',
        width: 1200,
        height: 630,
        alt: 'AI Canvas — animated React component registry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Canvas — Animated React Components with AI Reproduction Prompts',
    description: GLOBAL_DESCRIPTION,
    images: ['/AIcanvas-OG.webp'],
  },
  icons: {
    icon: '/ai-canvas-icon.svg',
    shortcut: '/ai-canvas-icon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AI Canvas',
  url: SITE_URL,
  logo: `${SITE_URL}/ai-canvas-icon.svg`,
  sameAs: [GITHUB_URL, 'https://ko-fi.com/aicanvasme'],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AI Canvas',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/components?category={search_term_string}`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${geistMono.variable} ${GeistPixelCircle.variable} h-full antialiased`}
    >
      {/* Apply saved theme before first paint to prevent flash */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('dark')` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="flex h-full flex-col overflow-hidden bg-sand-200 dark:bg-sand-950 md:flex-row">
        <ThemeProvider>
          {/* Desktop sidebar — hidden on mobile */}
          <Suspense fallback={null}>
            <div className="hidden md:flex">
              <Sidebar />
            </div>
          </Suspense>
          {/* Mobile nav — visible only below md */}
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
          {/* Content area scrolls independently of the sidebar */}
          <div className="flex flex-1 flex-col overflow-y-auto bg-sand-200 dark:bg-sand-950">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
