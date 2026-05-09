'use client'

import { useState } from 'react'
import { createClient } from '../lib/supabase/client'

// Google's brand guidelines require the multicolor "G" mark, not a recolored
// monochrome version. Inline SVG keeps the brand correct without an extra
// dependency.
function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.63z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.96 10.71c-.18-.54-.28-1.12-.28-1.71s.1-1.17.28-1.71V4.96H.96A9.001 9.001 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33z" fill="#FBBC05" />
      <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A8.997 8.997 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  )
}

export function GoogleSignInButton({ next, label = 'Continue with Google' }: { next: string; label?: string }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setSubmitting(true)
    setError(null)
    const supabase = createClient()
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/account/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (oauthError) {
      setError(oauthError.message)
      setSubmitting(false)
    }
    // On success, supabase navigates the browser to Google — no further work here.
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-sand-300 bg-sand-50 px-4 py-2.5 text-sm font-semibold text-sand-700 transition-colors hover:bg-sand-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sand-700 dark:bg-sand-950 dark:text-sand-200 dark:hover:bg-sand-800"
      >
        <GoogleGlyph />
        {submitting ? 'Redirecting…' : label}
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-700 dark:text-red-300">{error}</p>
      )}
    </div>
  )
}
