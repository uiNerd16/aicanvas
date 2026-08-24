'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Copy, Eye, EyeSlash } from '@phosphor-icons/react'
import { track } from '../lib/analytics'

// ─── PremiumQuickstart ────────────────────────────────────────────────────────
// What a signed-in Premium user sees on /welcome: the two credentials that turn
// the subscription into working installs, shown at the exact moment they are
// most likely to be looked for. Buyers who never found the token installed
// nothing (verified against real accounts); this puts it one screen after
// payment instead of two clicks deep in settings. Token stays masked until
// revealed; copy always copies the real value.

const MASK = 'aic_••••••••'

export function PremiumQuickstart({ token }: { token: string | null }) {
  const [revealed, setRevealed] = useState(false)
  const [cmdCopied, setCmdCopied] = useState(false)
  const [tokenCopied, setTokenCopied] = useState(false)

  const cmd = (t: string) => `npx shadcn@latest add "https://aicanvas.me/r/andromeda-all.json?token=${t}"`

  function copyCmd() {
    if (!token) return
    navigator.clipboard.writeText(cmd(token))
    track('CLI Copy', { component: 'welcome-quickstart' })
    setCmdCopied(true)
    setTimeout(() => setCmdCopied(false), 2000)
  }

  function copyToken() {
    if (!token) return
    navigator.clipboard.writeText(`AICANVAS_TOKEN=${token}`)
    track('MCP Token Copy', {})
    setTokenCopied(true)
    setTimeout(() => setTokenCopied(false), 2000)
  }

  return (
    <div className="mt-8 w-full max-w-lg text-left">
      {token ? (
        <>
          {/* Install command — the single most valuable string we can hand over. */}
          <div className="rounded-2xl border border-sand-800 bg-sand-900 p-5">
            <h2 className="text-sm font-semibold text-sand-50">Your install command</h2>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-sand-950 px-4 py-3">
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-sand-300">
                {cmd(revealed ? token : MASK)}
              </code>
              <button
                type="button"
                onClick={copyCmd}
                aria-label="Copy install command"
                className="rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
              >
                {cmdCopied ? <Check weight="bold" size={16} className="text-olive-400" /> : <Copy weight="regular" size={16} />}
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-sand-500">
              Installs the full Andromeda design system. Swap the file name for any
              component or template; while you are signed in, every install command
              on the site already carries your token.
            </p>
          </div>

          {/* MCP token — for AI agents; same reveal/copy pattern as settings. */}
          <div className="mt-4 rounded-2xl border border-sand-800 bg-sand-900 p-5">
            <h2 className="text-sm font-semibold text-sand-50">Your MCP token</h2>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-sand-950 px-4 py-3">
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-sand-300">
                AICANVAS_TOKEN={revealed && token ? token : MASK}
              </code>
              <button
                type="button"
                onClick={() => setRevealed((v) => !v)}
                aria-label={revealed ? 'Hide token' : 'Reveal token'}
                aria-pressed={revealed}
                className="rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
              >
                {revealed ? <EyeSlash weight="regular" size={16} /> : <Eye weight="regular" size={16} />}
              </button>
              <button
                type="button"
                onClick={copyToken}
                aria-label="Copy MCP token"
                className="rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
              >
                {tokenCopied ? <Check weight="bold" size={16} className="text-olive-400" /> : <Copy weight="regular" size={16} />}
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-sand-500">
              For AI agents and the AI Canvas MCP server. Keep it private.
            </p>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-sand-800 bg-sand-900 p-5 text-sm leading-relaxed text-sand-300">
          Your install token isn&rsquo;t set up yet. Check{' '}
          <Link href="/account/settings" className="font-medium text-olive-400 transition-colors hover:text-olive-300">
            account settings
          </Link>{' '}
          in a moment, or reach out to support if it stays missing.
        </div>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {[
          { href: '/design-systems/andromeda', label: 'Andromeda system' },
          { href: '/components', label: 'All components' },
          { href: '/account/settings', label: 'Account settings' },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center justify-between rounded-lg border border-sand-800 bg-sand-900/50 px-4 py-3 text-sm font-medium text-sand-200 transition-colors hover:border-sand-700 hover:text-sand-50"
          >
            {l.label}
            <ArrowRight weight="regular" size={14} className="text-sand-500" />
          </Link>
        ))}
      </div>
    </div>
  )
}
