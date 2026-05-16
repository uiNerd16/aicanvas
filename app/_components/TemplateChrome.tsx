'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, Copy, SignIn, Terminal } from '@phosphor-icons/react'
import { useSession } from '../components/auth/SessionProvider'
import { useAuthModal } from '../components/auth/AuthModalProvider'
import { Button } from '../components/Button'

interface TemplateChromeProps {
  templateSlug: string              // registry slug, e.g. 'andromeda-mission-control' or 'andromeda-all'
  templateName: string              // e.g. 'Mission Control' or 'Full system'
  systemName: string                // e.g. 'Andromeda'
  fallbackHref: string              // where to send users if window.close fails
  hideBack?: boolean                // showcase bundle pill omits Back; templates keep it
  description?: string[]            // overrides the popover bullet copy
}

// Floating widget shared by design-system template pages and the showcase
// "install full system" pill. Three slots — Back (optional), name + system,
// Install. Install is gated: signed-in users see the CLI popover; signed-out
// users see a "Sign in to install" pill that routes to /account/sign-in.

export function TemplateChrome({
  templateSlug,
  templateName,
  systemName,
  fallbackHref,
  hideBack = false,
  description,
}: TemplateChromeProps) {
  const { user } = useSession()
  const { open: openAuthModal } = useAuthModal()
  const pathname = usePathname() ?? '/'
  const [installOpen, setInstallOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const cliCommand = `npx shadcn@latest add @aicanvas/${templateSlug}`

  const bullets = description ?? [
    `Installs this template plus the full ${systemName} system.`,
    `Subsequent templates reuse what's already there.`,
  ]

  function handleBack() {
    window.close()
    setTimeout(() => { if (!window.closed) window.location.href = fallbackHref }, 50)
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(cliCommand)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  // Click outside closes the install popover.
  useEffect(() => {
    if (!installOpen) return
    function onClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setInstallOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [installOpen])

  // Esc closes the install popover.
  useEffect(() => {
    if (!installOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setInstallOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [installOpen])

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
      role="toolbar"
      aria-label={`${templateName} actions`}
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-sand-800 bg-sand-900 px-1.5 py-1.5 shadow-2xl">
        {/* Back */}
        {!hideBack && (
          <>
            <button
              type="button"
              onClick={handleBack}
              aria-label="Close"
              className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-sand-400 transition-colors hover:bg-sand-800/60 hover:text-sand-100"
            >
              <ArrowLeft weight="regular" size={15} />
              Back
            </button>
            <span className="h-5 w-px bg-sand-700" aria-hidden />
          </>
        )}

        {/* Title */}
        <div className="flex items-baseline gap-2 px-3">
          <span className="text-sm font-semibold text-sand-100">
            {templateName}
          </span>
          <span className="text-xs font-medium text-sand-500">
            {systemName}
          </span>
        </div>

        {/* Install — gated. SignedIn opens the CLI popover; SignedOut routes
            to sign-in with `next=` set to the current path. */}
        {user ? (
          <div className="relative" ref={popoverRef}>
            <Button variant="primary" size="md" onClick={() => setInstallOpen((o) => !o)}>
              <Terminal weight="regular" size={15} />
              Install
            </Button>

            {installOpen && (
              <div className="fixed bottom-[88px] left-1/2 z-50 w-[min(480px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-xl border border-sand-800 bg-sand-900 shadow-2xl">
                <div className="space-y-3 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {copied ? (
                        <span className="text-xs font-semibold uppercase tracking-wider text-olive-400">
                          Install command copied
                        </span>
                      ) : (
                        <>
                          <span className="text-xs font-semibold uppercase tracking-wider text-sand-400">
                            CLI install
                          </span>
                          <span className="rounded-md border border-olive-500/30 bg-olive-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-olive-400">
                            One command
                          </span>
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      aria-label="Copy CLI command"
                      className="rounded-md p-1.5 text-sand-400 transition-colors hover:bg-sand-800/60 hover:text-sand-100"
                    >
                      {copied
                        ? <Check weight="regular" size={14} className="text-olive-400" />
                        : <Copy weight="regular" size={14} />}
                    </button>
                  </div>
                  <div className="rounded-lg bg-sand-950 px-4 py-3">
                    <code className="block break-all font-mono text-xs text-sand-300">
                      {cliCommand}
                    </code>
                  </div>
                  <div className="space-y-1.5">
                    {bullets.map((line, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check weight="bold" size={12} className="shrink-0 text-olive-400" />
                        <p className="text-xs leading-relaxed text-sand-400">{line}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button variant="primary" size="md" onClick={() => openAuthModal({ next: pathname })}>
            <SignIn weight="regular" size={15} />
            Sign in to install
          </Button>
        )}
      </div>
    </div>
  )
}
