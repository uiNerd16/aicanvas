import type { Metadata } from 'next'
import { Manrope, Geist_Mono } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import { Sidebar } from './components/Sidebar'

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
  title: 'AI Toolkit — Component Marketplace',
  description:
    'Beautiful animated components with AI prompts for V0, Bolt, Lovable, Claude Code, and Cursor.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Apply saved theme before first paint to prevent flash */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('dark')` }} />
      </head>
      <body className="flex h-full overflow-hidden bg-sand-200 dark:bg-sand-950">
        <ThemeProvider>
          <Suspense fallback={null}>
            <Sidebar />
          </Suspense>
          {/* Content area scrolls independently of the sidebar */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
