import type { Metadata } from 'next'
import Link from 'next/link'
import { EnvelopeSimple, Lightning } from '@phosphor-icons/react/dist/ssr'
import { HeaderSocials } from '../components/HeaderSocials'

export const metadata: Metadata = {
  title: 'Welcome to Premium',
  // Post-checkout claim page — not a destination we want indexed.
  robots: { index: false, follow: false },
}

// ─── /welcome ─────────────────────────────────────────────────────────────────
// Where an ANONYMOUS buyer lands right after a successful Paddle checkout. They
// have no session yet: the webhook provisions the account from the email they
// paid with and emails a one-click magic link. This page just sets expectations
// ("check your inbox") so the success/webhook race is never user-visible.
// Signed-in upgrades never reach here (their overlay reloads in place).

export default function WelcomePage() {
  return (
    <div className="min-h-full bg-sand-950">
      <header className="sticky top-0 z-50 hidden h-14 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-sand-800 bg-sand-950 px-6 md:grid">
        <div />
        <Link href="/welcome" className="text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400">
          /Welcome
        </Link>
        <div className="flex items-center justify-end">
          <HeaderSocials />
        </div>
      </header>

      <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-olive-500/15 text-olive-400 ring-1 ring-olive-500/30">
          <Lightning weight="fill" size={26} />
        </span>

        <h1 className="text-3xl font-extrabold tracking-tight text-sand-50 sm:text-4xl">
          Payment received. You&rsquo;re Premium.
        </h1>

        <p className="mt-4 text-base leading-relaxed text-sand-300">
          Check your inbox. We just sent a one-click link to the email you used at
          checkout. Open it to access your account, your Premium is already active.
        </p>

        <div className="mt-8 flex items-center gap-2 rounded-xl border border-sand-800 bg-sand-900 px-4 py-3 text-sm text-sand-400">
          <EnvelopeSimple weight="regular" size={18} className="shrink-0 text-sand-500" />
          No email after a minute? Check spam, or contact support.
        </div>

        <Link
          href="/components"
          className="mt-8 text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400"
        >
          Browse components while you wait
        </Link>
      </main>
    </div>
  )
}
