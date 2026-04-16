import type { Metadata } from 'next'
import { Manrope, Geist_Mono } from 'next/font/google'
import { GeistPixelCircle } from 'geist/font/pixel'
import { Suspense } from 'react'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import { Sidebar } from './components/Sidebar'
import { MobileNav } from './components/MobileNav'

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://aicanvas.me'),
  title: {
    default: 'AI Canvas — Animated React Component Library',
    template: '%s | AI Canvas',
  },
  description:
    'Free animated React components with copy-paste code and AI prompts for Claude Code, V0, and Lovable. Built for designers, developers, and everyone in between.',
  keywords: [
    'animated react components',
    'react component library',
    'framer motion components',
    'tailwind css components',
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
    title: 'AI Canvas — Animated React Component Library',
    description:
      'Free animated React components with copy-paste code and AI prompts for Claude Code, V0, and Lovable. Built for designers, developers, and everyone in between.',
    url: 'https://aicanvas.me',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Canvas — Animated React Component Library',
    description:
      'Free animated React components with copy-paste code and AI prompts for Claude, GPT, V0, and Gemini.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
