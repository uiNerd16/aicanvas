import type { Metadata } from 'next'
import { Manrope, Geist_Mono } from 'next/font/google'
import { GeistPixelCircle } from 'geist/font/pixel'
import { Suspense } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import { Sidebar } from './components/Sidebar'
import { MobileNav } from './components/MobileNav'
import { SessionProvider } from './components/auth/SessionProvider'
import { AuthModalProvider } from './components/auth/AuthModalProvider'
import { PaywallModalProvider } from './components/billing/PaywallModalProvider'
import { AuthModal } from './components/auth/AuthModal'
import { DevBranchBadge } from './components/DevBranchBadge'
import { DevTierSwitcher } from './components/billing/DevTierSwitcher'
// Registry-free nav counts (generated) — keeps the heavy component-registry,
// and the three.js/matter-js it references, out of the shared client bundle.
import { CATEGORY_COUNTS, TOTAL_COMPONENTS } from './lib/component-nav.generated'
import { GITHUB_URL, SITE_URL } from './lib/config'
import { createClient } from './lib/supabase/server'

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  // Weights 200/300 were declared but never used in the app — dropping them
  // removes two font files from the critical path. Used range is 400–800.
  weight: ['400', '500', '600', '700', '800'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const TOTAL = TOTAL_COMPONENTS
const GLOBAL_DESCRIPTION = `Open-core registry of ${TOTAL} animated React components, design systems, and templates. The free library is MIT. Premium unlocks design systems, templates, and new components. Built with Tailwind CSS and Motion.`

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
        url: '/AIcanvas-OG-v2.png',
        width: 1200,
        height: 630,
        alt: 'AI Canvas: native React components, design systems, and templates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Canvas — Animated React Components with AI Reproduction Prompts',
    description: GLOBAL_DESCRIPTION,
    images: ['/AIcanvas-OG-v2.png'],
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
  sameAs: [GITHUB_URL],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AI Canvas',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/components?q={search_term_string}`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'query-input': 'required name=search_term_string',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      // `dark` is in the server-rendered className so SSR HTML already
      // matches what ThemeProvider sets client-side. Without it, the inline
      // <head> script adds `dark` pre-paint, but React's hydration pass
      // reconciles the html className back to JSX → strips `dark` for one
      // frame → ThemeProvider's effect re-adds it. That round-trip is the
      // visible dark → light → dark flash on refresh.
      className={`${manrope.variable} ${geistMono.variable} ${GeistPixelCircle.variable} dark h-full antialiased`}
    >
      <head>
        {/* Defense-in-depth: extension scripts or future theme toggles might
            mutate the class before hydration. Re-asserting `dark` in the
            head script keeps the live DOM correct even if something else
            stripped it. */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('dark')` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {process.env.NODE_ENV === 'development' && <script src="/pufi.js" defer />}
        {process.env.NODE_ENV === 'development' && <script src="/koko.js" defer />}
      </head>
      <body className="flex h-full flex-col overflow-hidden bg-sand-200 dark:bg-sand-950 md:flex-row">
        <ThemeProvider>
          <SessionProvider initialUser={user}>
            <AuthModalProvider>
             <PaywallModalProvider>
              {/* Desktop sidebar — hidden on mobile */}
              <Suspense fallback={null}>
                <div className="hidden md:flex">
                  <Sidebar counts={CATEGORY_COUNTS} total={TOTAL_COMPONENTS} />
                </div>
              </Suspense>
              {/* Mobile nav — visible only below md */}
              <Suspense fallback={null}>
                <MobileNav counts={CATEGORY_COUNTS} total={TOTAL_COMPONENTS} />
              </Suspense>
              {/* Content area scrolls independently of the sidebar.
                  scrollbar-gutter:stable reserves space for the vertical
                  scrollbar regardless of whether content overflows, so the
                  visible width never shifts between auth states. */}
              <div
                className="flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-sand-200 dark:bg-sand-950"
                style={{ scrollbarGutter: 'stable' }}
              >
                {children}
              </div>
              {/* Global auth dialog — toggles between sign-in and sign-up modes */}
              <AuthModal />
             </PaywallModalProvider>
            </AuthModalProvider>
          </SessionProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <DevBranchBadge />
        <DevTierSwitcher />
      </body>
    </html>
  )
}
