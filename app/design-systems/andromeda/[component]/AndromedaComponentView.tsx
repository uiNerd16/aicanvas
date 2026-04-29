'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code,
  Copy,
  Eye,
  Sparkle,
  Terminal,
} from '@phosphor-icons/react'
import { AndromedaDemo } from '../../../_lib/andromeda/andromeda-demos'

type RelatedItem = { slug: string; name: string }

interface Props {
  slug: string
  name: string
  description: string
  highlightedCode: ReactNode
  rawCode: string
  related: RelatedItem[]
  prevComponent?: RelatedItem
  nextComponent?: RelatedItem
}

export function AndromedaComponentView({
  slug,
  name,
  description,
  highlightedCode,
  rawCode,
  related,
  prevComponent,
  nextComponent,
}: Props) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  const [codeCopied, setCodeCopied] = useState(false)
  const [cliCopied, setCliCopied] = useState(false)

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(rawCode)
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    } catch {}
  }

  // Andromeda doesn't have a published shadcn registry yet — this command
  // mirrors the standalone pattern so the layout reads correctly. Wire to
  // a real registry once the system gets one.
  const cliCommand = `npx shadcn@latest add @aicanvas/andromeda-${slug}`

  async function copyCli() {
    try {
      await navigator.clipboard.writeText(cliCommand)
      setCliCopied(true)
      setTimeout(() => setCliCopied(false), 2000)
    } catch {}
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-sand-900 dark:text-sand-50 sm:text-4xl">
          {name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-sand-600 dark:text-sand-400">
          {description}
        </p>
      </div>

      {/* ── Main card (Preview / Code) ──────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-sand-300 bg-sand-100 dark:border-sand-800 dark:bg-sand-900">
        {/* Tab bar */}
        <div className="flex items-center justify-between border-b border-sand-300 px-3 py-3 dark:border-sand-800 sm:px-5 sm:py-4">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setTab('preview')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                tab === 'preview'
                  ? 'bg-sand-200 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                  : 'text-sand-400 hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300'
              }`}
            >
              <Eye weight="regular" size={15} />
              Preview
            </button>
            <button
              type="button"
              onClick={() => setTab('code')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                tab === 'code'
                  ? 'bg-sand-200 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                  : 'text-sand-400 hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300'
              }`}
            >
              <Code weight="regular" size={15} />
              Code
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="relative min-h-[420px]">
          {tab === 'preview' ? (
            <div
              className="flex min-h-[420px] items-center justify-center overflow-auto p-8 sm:p-12"
              style={{ backgroundColor: '#0E0E0F' }}
            >
              <AndromedaDemo slug={slug} />
            </div>
          ) : (
            <div
              className="overflow-auto p-5"
              style={{
                backgroundColor: '#0E0E0F',
                maxHeight: '70vh',
                scrollbarWidth: 'thin',
              }}
            >
              {highlightedCode}
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-end gap-2 border-t border-sand-300 px-3 py-3 dark:border-sand-800 sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={copyCli}
            className="flex items-center gap-2 rounded-lg border border-sand-300 bg-sand-50 px-3.5 py-2 text-sm font-semibold text-sand-700 transition-all hover:border-sand-400 hover:text-sand-900 active:scale-95 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-sand-50"
          >
            {cliCopied ? (
              <Check weight="regular" size={15} />
            ) : (
              <Terminal weight="regular" size={15} />
            )}
            {cliCopied ? 'Copied!' : 'Copy CLI'}
          </button>
          <button
            type="button"
            disabled
            title="Per-component prompts coming soon for Andromeda"
            className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-olive-500/60 px-3.5 py-2 text-sm font-semibold text-sand-950 opacity-70"
          >
            <Sparkle weight="regular" size={15} />
            Remix with AI
          </button>
        </div>
      </div>

      {/* ── Code copy panel ─────────────────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-base font-bold text-sand-900 dark:text-sand-50">
          Add to your project
        </h2>
        <p className="mb-4 mt-1 text-sm text-sand-500 dark:text-sand-400">
          Copy the source and drop it into your project.
        </p>
        <div className="overflow-hidden rounded-xl border border-sand-300 bg-sand-100 dark:border-sand-800 dark:bg-sand-900">
          <div className="flex items-center justify-between border-b border-sand-300 px-4 py-2 dark:border-sand-800">
            <span className="font-mono text-xs text-sand-500 dark:text-sand-400">
              {name}.tsx
            </span>
            <button
              type="button"
              onClick={copyCode}
              className="flex items-center gap-1.5 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-900 active:scale-90 dark:text-sand-400 dark:hover:text-sand-100"
            >
              {codeCopied ? (
                <Check weight="regular" size={14} className="text-olive-500" />
              ) : (
                <Copy weight="regular" size={14} />
              )}
            </button>
          </div>
          <div
            className="max-h-96 overflow-auto p-4"
            style={{ backgroundColor: '#0E0E0F', scrollbarWidth: 'thin' }}
          >
            {highlightedCode}
          </div>
        </div>
      </section>

      {/* ── Prev / Next ─────────────────────────────────────────────────── */}
      {(prevComponent || nextComponent) && (
        <nav className="mt-12 flex items-stretch justify-between gap-3 border-t border-sand-300 pt-6 dark:border-sand-800">
          {prevComponent ? (
            <Link
              href={`/design-systems/andromeda/${prevComponent.slug}`}
              className="group flex flex-1 items-center gap-3 rounded-xl border border-sand-300 bg-sand-100 px-4 py-3 transition-colors hover:border-sand-400 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700"
            >
              <ArrowLeft
                weight="regular"
                size={16}
                className="shrink-0 text-sand-400 dark:text-sand-500"
              />
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-wider text-sand-500 dark:text-sand-400">
                  Previous
                </div>
                <div className="truncate text-sm font-semibold text-sand-900 dark:text-sand-50">
                  {prevComponent.name}
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {nextComponent ? (
            <Link
              href={`/design-systems/andromeda/${nextComponent.slug}`}
              className="group flex flex-1 items-center justify-end gap-3 rounded-xl border border-sand-300 bg-sand-100 px-4 py-3 text-right transition-colors hover:border-sand-400 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700"
            >
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-wider text-sand-500 dark:text-sand-400">
                  Next
                </div>
                <div className="truncate text-sm font-semibold text-sand-900 dark:text-sand-50">
                  {nextComponent.name}
                </div>
              </div>
              <ArrowRight
                weight="regular"
                size={16}
                className="shrink-0 text-sand-400 dark:text-sand-500"
              />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      )}

      {/* ── Related ─────────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-base font-bold text-sand-900 dark:text-sand-50">
            More Andromeda components
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {related.slice(0, 8).map((c) => (
              <Link
                key={c.slug}
                href={`/design-systems/andromeda/${c.slug}`}
                className="overflow-hidden rounded-lg border border-sand-300 bg-sand-100 px-3 py-2.5 text-sm font-semibold text-sand-700 transition-colors hover:border-sand-400 hover:text-sand-900 dark:border-sand-800 dark:bg-sand-900 dark:text-sand-300 dark:hover:border-sand-700 dark:hover:text-sand-100"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
