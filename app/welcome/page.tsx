import type { Metadata } from 'next'
import Link from 'next/link'
import { EnvelopeSimple, Lightning } from '@phosphor-icons/react/dist/ssr'
import { HeaderSocials } from '../components/HeaderSocials'
import { getSessionEntitlement } from '../lib/entitlement'
import { createClient } from '../lib/supabase/server'
import { ClaimForm } from './ClaimForm'
import { PremiumQuickstart } from './PremiumQuickstart'

export const metadata: Metadata = {
  title: 'Welcome to Premium',
  // Post-checkout claim page — not a destination we want indexed.
  robots: { index: false, follow: false },
}

// ─── /welcome ─────────────────────────────────────────────────────────────────
// THE post-purchase page — every confirmed Paddle checkout lands here (signed-in
// fast-path and anonymous pending-claim alike; see app/lib/paddle/client.ts).
// State-aware, three views:
//   • no session      → the claim form: the webhook provisioned a passwordless
//     account under the checkout email; enter it, get a one-time sign-in link.
//     Deliberately NO OAuth here — a Google login under a different address
//     creates a fresh free account and shows a paying buyer the paywall.
//   • session, premium → quickstart: tokened install command, MCP token, links.
//   • session, free    → mismatch view: this account holds no Premium; claim
//     the checkout-email account instead (or see plans).
// Claiming is self-service, so a lost/delayed claim email is never a lockout.

export default async function WelcomePage() {
  // Fail SOFT to the claim view: this page must render for a buyer even when
  // the session or subscription read hiccups — the claim form works either way.
  let tier: 'anonymous' | 'free' | 'premium' = 'anonymous'
  let email: string | null = null
  let token: string | null = null
  try {
    const ent = await getSessionEntitlement()
    if (ent.userId) {
      tier = ent.tier === 'premium' ? 'premium' : 'free'
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      email = user?.email ?? null
      // Same RLS-scoped read settings uses; resilient — a missing row just
      // renders the settings pointer instead of the token.
      const { data: keyRow } = await supabase
        .from('user_api_keys')
        .select('token')
        .eq('user_id', ent.userId)
        .maybeSingle()
      token = (keyRow?.token ?? null) as string | null
    }
  } catch {
    /* anonymous view */
  }

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

        {tier === 'premium' ? (
          <>
            <h1 className="text-3xl font-extrabold tracking-tight text-sand-50 sm:text-4xl">
              You&rsquo;re Premium.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-sand-300">
              Premium is live on{' '}
              {email ? (
                <strong className="font-semibold text-sand-50">{email}</strong>
              ) : (
                <>your account</>
              )}
              .{' '}
              {token
                ? 'Your install command below is ready to use.'
                : 'Everything is unlocked.'}
            </p>
            <PremiumQuickstart token={token} />
          </>
        ) : tier === 'free' ? (
          <>
            <h1 className="text-3xl font-extrabold tracking-tight text-sand-50 sm:text-4xl">
              Almost there.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-sand-300">
              You&rsquo;re signed in{email ? (
                <> as <strong className="font-semibold text-sand-50">{email}</strong></>
              ) : null}, and this account has no Premium subscription. Paid with a
              different email at checkout? Enter that address below and we&rsquo;ll
              send a sign-in link to your Premium account.
            </p>
            <ClaimForm />
            <p className="mt-6 text-sm text-sand-500">
              No purchase yet?{' '}
              <Link href="/pricing" className="font-medium text-olive-400 transition-colors hover:text-olive-300">
                See Premium plans
              </Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold tracking-tight text-sand-50 sm:text-4xl">
              Payment received. You&rsquo;re Premium.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-sand-300">
              Your account is ready under the email you used at checkout. Enter
              that email and we&rsquo;ll send you a one-time sign-in link. No
              password needed.
            </p>
            <ClaimForm />
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-sand-800 bg-sand-900 px-4 py-3 text-sm text-sand-400">
              <EnvelopeSimple weight="regular" size={18} className="shrink-0 text-sand-500" />
              We also emailed you a link back to this page. The form above is all
              you need.
            </div>
          </>
        )}
      </main>
    </div>
  )
}
