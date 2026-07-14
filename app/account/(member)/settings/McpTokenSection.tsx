'use client'

import { useState } from 'react'
import { Copy, Check, Eye, EyeSlash } from '@phosphor-icons/react'

// ─── McpTokenSection ──────────────────────────────────────────────────────────
// Shows the signed-in user's AI Canvas API token on /account/settings so they
// can reveal + copy it into their MCP server config. Masked by default (it's a
// live secret that acts like a password); the eye reveals it. The token is read
// server-side in page.tsx and passed in, so there's no loading flash.

type Props = { token: string | null }

const MASKED = 'aic_••••••••'

export function McpTokenSection({ token }: Props) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  function copy() {
    if (!token) return
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="rounded-2xl border border-sand-300 bg-sand-100 p-5 dark:border-sand-800 dark:bg-sand-900">
      <h2 className="text-base font-bold text-sand-900 dark:text-sand-50">MCP access token</h2>
      <p className="mt-1 text-sm text-sand-500 dark:text-sand-400">
        Add this token to your MCP server config so AI Canvas installs authenticate
        as your account.
      </p>

      {token ? (
        <div className="mt-4 flex items-center justify-between gap-2 rounded-lg bg-sand-950 px-4 py-3">
          <code className="min-w-0 flex-1 truncate font-mono text-sm text-sand-300">
            {revealed ? token : MASKED}
          </code>
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              className="rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
              aria-label={revealed ? 'Hide token' : 'Reveal token'}
              aria-pressed={revealed}
            >
              {revealed
                ? <EyeSlash weight="regular" size={16} />
                : <Eye weight="regular" size={16} />}
            </button>
            <button
              type="button"
              onClick={copy}
              className="rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
              aria-label="Copy token"
            >
              {copied
                ? <Check weight="regular" size={16} className="text-olive-500" />
                : <Copy weight="regular" size={16} />}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-sand-300 bg-sand-50 px-4 py-3 text-sm text-sand-600 dark:border-sand-800 dark:bg-sand-950 dark:text-sand-400">
          Your token isn&rsquo;t set up yet. Install the AI Canvas MCP once, or
          reach out to support if this persists.
        </div>
      )}
    </section>
  )
}
