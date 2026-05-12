// ─── auth-errors ──────────────────────────────────────────────────────────────
// Maps raw Supabase auth error messages to plain, user-facing text. Supabase's
// default messages are technically clear ("Invalid login credentials") but
// abrupt; this layer makes them feel like a person wrote them.
//
// Pattern: match on the Supabase message (or AuthApiError code if available)
// and return friendly text. If we don't recognise the message we surface it
// as-is so debugging in production is still possible.

import type { AuthError } from '@supabase/supabase-js'

type Anyish = AuthError | Error | { message?: string; status?: number; code?: string } | null | undefined

export function formatAuthError(err: Anyish): string {
  if (!err) return ''
  const raw = (err.message ?? '').toLowerCase()
  const code = (err as { code?: string }).code?.toLowerCase()
  const status = (err as { status?: number }).status

  // ── Sign-in / password ──────────────────────────────────────────────
  if (raw.includes('invalid login credentials') || code === 'invalid_credentials') {
    return 'That email and password don’t match an account. Try again, or reset your password.'
  }
  if (raw.includes('email not confirmed') || code === 'email_not_confirmed') {
    return 'Your email isn’t confirmed yet. Check your inbox for the confirmation link, or sign in with a magic link instead.'
  }
  if (raw.includes('user not found')) {
    return 'No account uses that email yet. Want to create one?'
  }

  // ── Sign-up ─────────────────────────────────────────────────────────
  if (raw.includes('user already registered') || code === 'user_already_exists') {
    return 'An account already uses that email. Try signing in instead.'
  }
  if (raw.includes('password should be at least') || code === 'weak_password') {
    return 'Your password is too short. Use at least 8 characters.'
  }
  if (raw.includes('unable to validate email') || raw.includes('invalid email')) {
    return 'That doesn’t look like a valid email address.'
  }
  if (raw.includes('signup disabled') || raw.includes('signups not allowed')) {
    return 'New sign-ups are temporarily disabled. Please try again later.'
  }

  // ── Reset / update password ─────────────────────────────────────────
  if (raw.includes('same password') || code === 'same_password') {
    return 'Your new password must be different from your current one.'
  }
  if (raw.includes('token has expired') || raw.includes('invalid token') || code === 'otp_expired') {
    return 'That reset link has expired. Request a new one and try again.'
  }

  // ── Rate limiting ───────────────────────────────────────────────────
  if (status === 429 || raw.includes('rate limit')) {
    return 'Too many attempts. Wait a minute and try again.'
  }

  // ── Network ─────────────────────────────────────────────────────────
  if (raw.includes('failed to fetch') || raw.includes('network')) {
    return 'Network problem. Check your connection and try again.'
  }

  // Fallback: capitalised raw message so debugging stays possible.
  const original = err.message ?? 'Something went wrong. Try again in a moment.'
  return original.charAt(0).toUpperCase() + original.slice(1)
}
