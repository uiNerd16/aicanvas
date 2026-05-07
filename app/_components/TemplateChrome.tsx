'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, Copy, Terminal } from '@phosphor-icons/react'

interface TemplateChromeProps {
  templateSlug: string              // e.g. 'andromeda-mission-control'
  templateName: string              // e.g. 'Mission Control'
  systemName: string                // e.g. 'Andromeda'
  fallbackHref: string              // where to send users if window.close fails
}

// Floating widget for design-system template pages. Three slots — Back,
// template name + system, Install. Install opens a small popover with the
// CLI command and a copy button. The widget sits above the template
// content; the underlying composition stays interactive everywhere else.

export function TemplateChrome({ templateSlug, templateName, systemName, fallbackHref }: TemplateChromeProps) {
  const [installOpen, setInstallOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const cliCommand = `npx shadcn@latest add @aicanvas/${templateSlug}`

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
      aria-label={`${templateName} template actions`}
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-sand-800 bg-sand-900 px-1.5 py-1.5 shadow-2xl">
        {/* Back */}
        <button
          type="button"
          onClick={handleBack}
          aria-label="Close template"
          className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-sand-400 transition-colors hover:bg-sand-800/60 hover:text-sand-100"
        >
          <ArrowLeft weight="regular" size={15} />
          Back
        </button>

        {/* Divider */}
        <span className="h-5 w-px bg-sand-700" aria-hidden />

        {/* Title */}
        <div className="flex items-baseline gap-2 px-3">
          <span className="text-sm font-semibold text-sand-100">
            {templateName}
          </span>
          <span className="text-xs font-medium text-sand-500">
            {systemName}
          </span>
        </div>

        {/* Install — olive primary CTA */}
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setInstallOpen((o) => !o)}
            className="flex h-9 items-center gap-2 rounded-lg bg-olive-500 px-3.5 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400 active:scale-95"
          >
            <Terminal weight="regular" size={15} />
            Install
          </button>

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
                  <div className="flex items-center gap-2">
                    <Check weight="bold" size={12} className="shrink-0 text-olive-400" />
                    <p className="text-xs leading-relaxed text-sand-400">
                      Installs this template plus the full {systemName} system.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check weight="bold" size={12} className="shrink-0 text-olive-400" />
                    <p className="text-xs leading-relaxed text-sand-400">
                      Subsequent templates reuse what's already there.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
