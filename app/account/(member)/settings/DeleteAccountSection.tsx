'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Warning } from '@phosphor-icons/react'
import { createClient } from '../../../lib/supabase/client'

// ─── DeleteAccountSection ─────────────────────────────────────────────────────
// GDPR Art. 17 right-to-erasure surface inside /account/settings.
//
// Two-step confirmation: first click reveals an inline "Are you sure?" prompt
// with explicit "Delete forever" + "Cancel" buttons. The actual delete calls
// the public.delete_my_account() Postgres function (security definer) which
// removes the auth.users row; ON DELETE CASCADE drops saved_components,
// install_history, and user_preferences automatically.
//
// We do not need the Supabase service-role key on the client thanks to the
// SQL function — the regular publishable key + an authenticated session are
// enough for the user to call rpc('delete_my_account').

export function DeleteAccountSection() {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setDeleting(true)
    setError(null)
    const supabase = createClient()

    const { error: rpcError } = await supabase.rpc('delete_my_account')
    if (rpcError) {
      setError(rpcError.message)
      setDeleting(false)
      return
    }

    // Best-effort sign-out to clear the local session cookie. The server-side
    // session is already invalid because auth.users no longer holds the row,
    // so failure here is harmless — we just want to clear cookies.
    try {
      await supabase.auth.signOut()
    } catch {
      // ignore
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 dark:border-red-500/20">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 text-red-700 dark:text-red-400">
          <Warning weight="regular" size={20} />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-sand-900 dark:text-sand-50">Danger zone</h2>
          <p className="mt-1 text-sm leading-relaxed text-sand-600 dark:text-sand-400">
            Permanently delete your AI Canvas account, your saved components,
            install history, and preferences. This cannot be undone.
          </p>

          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="mt-5 rounded-lg border border-red-500/40 bg-transparent px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-500/10 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/15"
            >
              Delete my account
            </button>
          ) : (
            <div className="mt-5 space-y-3">
              <p className="text-sm font-semibold text-sand-900 dark:text-sand-50">
                Are you sure? This cannot be undone.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? 'Deleting…' : 'Delete forever'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirming(false)
                    setError(null)
                  }}
                  disabled={deleting}
                  className="rounded-lg border border-sand-300 bg-sand-50 px-4 py-2 text-sm font-semibold text-sand-700 transition-colors hover:bg-sand-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sand-700 dark:bg-sand-950 dark:text-sand-300 dark:hover:bg-sand-800"
                >
                  Cancel
                </button>
              </div>
              {error && (
                <p className="text-sm text-red-700 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
