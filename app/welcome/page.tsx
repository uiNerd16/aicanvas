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
// have no session yet: the webhook provisions a passwordless account under the
// email they paid with. This page is the PRIMARY claim path — it tells them to
// sign in (self-service OTP) with that email; the emailed sign-in link is a
// secondary convenience, not a required one-click confirm (there is no token
// route). Because the claim is self-service, a lost/delayed email is never a
// lockout. Signed-in upgrades never reach here (their overlay reloads in place).

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
          Your account is ready under the email you used at checkout. Sign in with
          that email to access it, no password needed, just choose &ldquo;Email me a
          sign-in link.&rdquo; Premium is already active.
        </p>

        <Link
          href="/account/sign-in?next=/account"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-olive-500 px-6 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400"
        >
          Sign in to access Premium
        </Link>

        <div className="mt-6 flex items-center gap-2 rounded-xl border border-sand-800 bg-sand-900 px-4 py-3 text-sm text-sand-400">
          <EnvelopeSimple weight="regular" size={18} className="shrink-0 text-sand-500" />
          We also emailed you a sign-in link. No email? You can still sign in above.
        </div>
      </main>
    </div>
  )
}
