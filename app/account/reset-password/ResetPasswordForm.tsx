'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import { formatAuthError } from '../../lib/auth-errors'
import { PasswordInput } from '../PasswordInput'
import { AuthPagePopup } from '../AuthPagePopup'

// ─── ResetPasswordForm ───────────────────────────────────────────────────────
// Sets a new password on a recovery-issued session. The recovery callback
// (/account/auth/callback?code=…&type=recovery) exchanges a one-time code
// for a session whose access-token claims include `amr: [{ method: 'recovery' }]`
// — possession of that recovery email is the auth factor.
//
// SECURITY GATE: a normal signed-in session does NOT carry the `recovery`
// AMR. Without checking it, anyone with temporary access to a logged-in
// browser could navigate here and rotate the password without knowing the
// current one, locking out the real account owner. So we decode the JWT's
// claims on mount and refuse to render the form unless the recovery AMR is
// present — those users are sent to /account/forgot-password to start over
// from a fresh email link.

type Phase = 'checking' | 'ready' | 'denied'

// Lightweight JWT payload decode (no signature check — we trust Supabase
// because we just fetched the session from its client; we just need to read
// the claims our own access-token carries).
function readAmrMethods(accessToken: string | undefined): string[] {
  if (!accessToken) return []
  try {
    const [, payloadB64] = accessToken.split('.')
    if (!payloadB64) return []
    const json = JSON.parse(
      atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')),
    )
    const amr = Array.isArray(json?.amr) ? json.amr : []
    return amr.map((entry: { method?: string }) => entry?.method).filter(Boolean) as string[]
  } catch {
    return []
  }
}

export function ResetPasswordForm() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function check() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const methods = readAmrMethods(session?.access_token)
      if (cancelled) return
      // Also honor Supabase's PASSWORD_RECOVERY auth event — when the user
      // arrives via the recovery link, that event fires regardless of AMR
      // presence. The AMR check is the more authoritative signal but we
      // accept either to avoid false negatives on environments that don't
      // expose `amr` in the access token claims.
      setPhase(methods.includes('recovery') ? 'ready' : 'denied')
    }
    void check()

    // Listen for the recovery event so users who land here mid-exchange
    // (race between callback session set and this effect) still get through.
    const supabase = createClient()
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' && !cancelled) setPhase('ready')
    })
    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }
    if (password.length < 8) {
      setError('Use at least 8 characters.')
      return
    }

    setSubmitting(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSubmitting(false)
    if (updateError) {
      setError(formatAuthError(updateError))
      return
    }
    router.push('/account')
    router.refresh()
  }

  if (phase === 'checking') {
    return (
      <AuthPagePopup>
        <p className="text-sm text-sand-500 dark:text-sand-400">
          Checking your session…
        </p>
      </AuthPagePopup>
    )
  }

  if (phase === 'denied') {
    return (
      <AuthPagePopup>
        <h1 className="text-2xl font-bold text-sand-900 dark:text-sand-50">
          Use a fresh recovery link
        </h1>
        <p className="mt-2 text-sm text-sand-600 dark:text-sand-400">
          For your security, the password reset page only works right after
          you click a recovery link in your email. Request a new one to
          continue.
        </p>
        <Link
          href="/account/forgot-password"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-olive-500 px-4 py-2.5 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400"
        >
          Send me a recovery link
        </Link>
      </AuthPagePopup>
    )
  }

  return (
    <AuthPagePopup>
      <h1 className="text-2xl font-bold text-sand-900 dark:text-sand-50">
        Set a new password
      </h1>
      <p className="mt-2 text-sm text-sand-600 dark:text-sand-400">
        Choose something at least 8 characters long.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sand-500 dark:text-sand-400"
            >
              New password
            </label>
            <PasswordInput
              id="password"
              required
              autoFocus
              autoComplete="new-password"
              minLength={8}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sand-500 dark:text-sand-400"
            >
              Confirm new password
            </label>
            <PasswordInput
              id="confirm"
              required
              autoComplete="new-password"
              minLength={8}
              placeholder="Re-enter password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-olive-500 px-4 py-2.5 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </AuthPagePopup>
  )
}
