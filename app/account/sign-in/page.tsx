'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/account'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }
    router.push(next)
    router.refresh()
  }

  async function handleMagicLink() {
    if (!email) {
      setError('Enter your email first')
      return
    }
    setSubmitting(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/account/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    setMagicSent(true)
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-xl border border-sand-300 bg-sand-100 p-8 dark:border-sand-800 dark:bg-sand-900">
        <h1 className="text-2xl font-bold text-sand-900 dark:text-sand-50">Sign in</h1>
        <p className="mt-2 text-sm text-sand-600 dark:text-sand-400">
          New here?{' '}
          <Link href={`/account/sign-up?next=${encodeURIComponent(next)}`} className="font-semibold text-olive-500 hover:underline dark:text-olive-400">
            Create an account
          </Link>
        </p>

        {magicSent ? (
          <div className="mt-6 rounded-lg border border-olive-500/30 bg-olive-500/10 p-4 text-sm text-sand-900 dark:text-sand-100">
            Check your inbox at <strong>{email}</strong> — we sent you a sign-in link.
          </div>
        ) : (
          <form onSubmit={handlePasswordSignIn} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sand-500 dark:text-sand-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-sand-300 bg-sand-50 px-3 py-2 text-sm text-sand-900 outline-none transition-colors focus:border-olive-500 focus:ring-2 focus:ring-olive-500/20 dark:border-sand-700 dark:bg-sand-950 dark:text-sand-50"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-sand-500 dark:text-sand-400">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-sand-300 bg-sand-50 px-3 py-2 text-sm text-sand-900 outline-none transition-colors focus:border-olive-500 focus:ring-2 focus:ring-olive-500/20 dark:border-sand-700 dark:bg-sand-950 dark:text-sand-50"
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
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>

            <button
              type="button"
              onClick={handleMagicLink}
              disabled={submitting}
              className="w-full rounded-lg border border-sand-300 bg-sand-50 px-4 py-2.5 text-sm font-semibold text-sand-700 transition-colors hover:bg-sand-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sand-700 dark:bg-sand-950 dark:text-sand-300 dark:hover:bg-sand-800"
            >
              Email me a magic link instead
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
