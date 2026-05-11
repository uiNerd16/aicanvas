'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../lib/supabase/client'
import { formatAuthError } from '../../lib/auth-errors'
import { GoogleSignInButton } from '../../account/GoogleSignInButton'
import { PasswordInput } from '../../account/PasswordInput'
import { NerdToHero } from './NerdToHero'

// ─── SignUpFormFields ─────────────────────────────────────────────────────────
// Sign-up form body, mirroring SignInFormFields. Shared between the standalone
// /account/sign-up page and the global Auth modal in "sign-up" mode.
//
// onSwitchToSignIn: when provided (modal context), the "Already have one? Sign
// in" link becomes a button that flips modal mode in place. When omitted (page
// context), it remains a Link that navigates to /account/sign-in.

type Props = {
  next: string
  onSwitchToSignIn?: () => void
}

export function SignUpFormFields({ next, onSwitchToSignIn }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    setSubmitting(false)
    if (signUpError) {
      setError(formatAuthError(signUpError))
      return
    }
    setSent(true)
  }

  return (
    <>
      <NerdToHero />

      {sent ? (
        <div className="mt-6 rounded-lg border border-olive-500/30 bg-olive-500/10 p-4 text-sm text-sand-900 dark:text-sand-100">
          Confirmation email sent to <strong>{email}</strong>. Click the link
          inside to finish creating your account.
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-3">
            <GoogleSignInButton next={next} label="Sign up with Google" />
            <div className="flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-sand-300 dark:bg-sand-800" />
              <span className="text-xs uppercase tracking-wider text-sand-500 dark:text-sand-500">
                or
              </span>
              <span className="h-px flex-1 bg-sand-300 dark:bg-sand-800" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sand-500 dark:text-sand-400"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-sand-300 bg-sand-50 px-3 py-2 text-sm text-sand-900 outline-none transition-colors placeholder:text-sand-400 focus:border-olive-500 focus:ring-2 focus:ring-olive-500/20 dark:border-sand-800 dark:bg-sand-950 dark:text-sand-50 dark:placeholder:text-sand-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sand-500 dark:text-sand-400"
                >
                  Password
                </label>
                <PasswordInput
                  id="password"
                  required
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-lg bg-olive-500 px-4 py-2.5 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Creating…' : 'Create account'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-sand-600 dark:text-sand-400">
            Already have one?{' '}
            {onSwitchToSignIn ? (
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="font-semibold text-olive-500 hover:underline dark:text-olive-400"
              >
                Sign in
              </button>
            ) : (
              <Link
                href={`/account/sign-in?next=${encodeURIComponent(next)}`}
                className="font-semibold text-olive-500 hover:underline dark:text-olive-400"
              >
                Sign in
              </Link>
            )}
          </p>

          {/* Art. 13 GDPR notice — Terms + Privacy links cover the pre-
              contract informational duties. No marketing-email opt-in is
              shown here because the column defaults to FALSE in migration
              0004 — users must explicitly subscribe from /account/settings
              before any marketing mail is sent. AI Canvas currently only
              sends transactional mail (sign-up confirm, password reset,
              account changes), legal basis Art. 6 (1)(b) GDPR. The Art. 8
              age-16 confirmation was dropped — developer-tool audience
              with negligible under-16 risk. */}
          <p className="mt-6 text-xs leading-relaxed text-sand-500 dark:text-sand-500">
            By creating an account you agree to our{' '}
            <Link
              href="/terms"
              className="underline hover:text-sand-700 dark:hover:text-sand-100"
            >
              Terms &amp; Conditions
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline hover:text-sand-700 dark:hover:text-sand-100"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </>
      )}
    </>
  )
}
