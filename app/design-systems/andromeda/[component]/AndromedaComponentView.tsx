'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code,
  Copy,
  CornersIn,
  CornersOut,
  Eye,
  Terminal,
} from '@phosphor-icons/react'
import { Step } from '../../../components/Step'
import { AndromedaDemo } from '../../../_lib/andromeda/andromeda-demos'
import { tokens } from '../../../../design-systems/andromeda/tokens'

type RelatedItem = { slug: string; name: string }

interface Props {
  slug: string
  name: string
  description: string
  highlightedCode: ReactNode
  rawCode: string
  related: RelatedItem[]
}

export function AndromedaComponentView({
  slug,
  name,
  description,
  highlightedCode,
  rawCode,
  related,
}: Props) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  const [codeCopied, setCodeCopied] = useState(false)
  const [cliCopied, setCliCopied] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [installTab, setInstallTab] = useState<'cli' | 'manual'>('cli')
  const [pkgManager, setPkgManager] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('npm')
  const [darkCopied, setDarkCopied] = useState(false)
  const mainCardRef = useRef<HTMLDivElement>(null)

  const RELATED_PAGE_SIZE = 3
  const [relatedStart, setRelatedStart] = useState(0)
  const [relatedDir, setRelatedDir] = useState<1 | -1>(1)
  const visibleRelated = related.slice(
    relatedStart,
    relatedStart + RELATED_PAGE_SIZE,
  )
  const canPaginate = related.length > RELATED_PAGE_SIZE
  const canGoPrev = relatedStart > 0
  const canGoNext = relatedStart < related.length - RELATED_PAGE_SIZE

  function pageRelated(dir: 1 | -1) {
    setRelatedDir(dir)
    setRelatedStart((s) =>
      dir === 1
        ? Math.min(related.length - RELATED_PAGE_SIZE, s + 1)
        : Math.max(0, s - 1),
    )
  }

  useEffect(() => {
    if (!fullscreen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setFullscreen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [fullscreen])

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
    <>
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
      <div ref={mainCardRef} className="overflow-hidden rounded-2xl border border-sand-300 bg-sand-100 dark:border-sand-800 dark:bg-sand-900">
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

          {tab === 'preview' && (
            <div className="group/fullscreen relative">
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-sand-300 bg-sand-200 text-sand-700 transition-colors hover:border-sand-400 hover:bg-sand-300 hover:text-sand-900 active:scale-95 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:bg-sand-700 dark:hover:text-sand-100"
              >
                <CornersOut weight="regular" size={16} />
              </button>
              <div className="pointer-events-none absolute right-0 top-full z-10 mt-1.5 hidden whitespace-nowrap rounded-lg border border-sand-700 bg-sand-800 px-2.5 py-1.5 text-xs text-sand-300 group-hover/fullscreen:block">
                Full screen
              </div>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="relative min-h-[420px]">
          {tab === 'preview' ? (
            <div
              className="flex min-h-[420px] items-center justify-center overflow-auto p-8 sm:p-12"
              style={{ backgroundColor: tokens.color.surface.base }}
            >
              {!fullscreen && <AndromedaDemo slug={slug} />}
            </div>
          ) : (
            <div
              className="overflow-auto p-5"
              style={{
                backgroundColor: tokens.color.surface.base,
                maxHeight: '70vh',
                scrollbarWidth: 'thin',
              }}
            >
              {highlightedCode}
            </div>
          )}
        </div>

        {/* Action bar — Andromeda system components are coherence-oriented;
            Remix with AI deliberately omitted because mutating a system
            component breaks the system contract. Users compose AT the
            system level, not per-component. */}
        <div className="flex items-center justify-end gap-2 border-t border-sand-300 px-3 py-3 dark:border-sand-800 sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={copyCli}
            className="flex items-center gap-2 rounded-lg bg-olive-500 px-3.5 py-2 text-sm font-semibold text-sand-950 transition-all hover:bg-olive-400 active:scale-95"
          >
            {cliCopied ? (
              <Check weight="regular" size={15} />
            ) : (
              <Terminal weight="regular" size={15} />
            )}
            {cliCopied ? 'Copied!' : 'Copy CLI'}
          </button>
        </div>
      </div>

      {/* ── Installation ─────────────────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-base font-bold text-sand-900 dark:text-sand-50">
          Add to your project
        </h2>
        <p className="mb-4 mt-1 text-sm text-sand-500 dark:text-sand-400">
          One command adds this component to your project.
        </p>

        {/* CLI / Manual tabs */}
        <div className="overflow-hidden rounded-xl border border-sand-300 dark:border-sand-800">
          <div className="flex border-b border-sand-300 bg-sand-100 dark:border-sand-800 dark:bg-sand-900">
            <button
              type="button"
              onClick={() => setInstallTab('cli')}
              className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${
                installTab === 'cli'
                  ? 'text-sand-900 dark:text-sand-50'
                  : 'text-sand-400 hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300'
              }`}
            >
              CLI
              {installTab === 'cli' && (
                <span className="absolute inset-x-0 -bottom-px h-px bg-sand-900 dark:bg-sand-50" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setInstallTab('manual')}
              className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${
                installTab === 'manual'
                  ? 'text-sand-900 dark:text-sand-50'
                  : 'text-sand-400 hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300'
              }`}
            >
              Manual
              {installTab === 'manual' && (
                <span className="absolute inset-x-0 -bottom-px h-px bg-sand-900 dark:bg-sand-50" />
              )}
            </button>
          </div>

          <div className="bg-sand-100 px-5 py-6 dark:bg-sand-900">
            {installTab === 'cli' ? (
              <div className="space-y-6">
                {/* Step 1 — shadcn add */}
                <Step number={1}>
                  <p className="mb-2.5 text-sm text-sand-600 dark:text-sand-400">
                    Run the following command. New project? Run{' '}
                    <code className="rounded bg-sand-200 px-1 py-0.5 font-mono text-xs text-sand-800 dark:bg-sand-800 dark:text-sand-200">
                      npx shadcn@latest init
                    </code>{' '}
                    first to set up Tailwind and path aliases.
                  </p>
                  <div className="overflow-hidden rounded-lg bg-sand-950">
                    <div className="flex items-center gap-1 border-b border-sand-800 px-4 py-2">
                      {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((pm) => (
                        <button
                          key={pm}
                          type="button"
                          onClick={() => { setPkgManager(pm); setCliCopied(false) }}
                          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                            pkgManager === pm
                              ? 'bg-sand-800 text-sand-100'
                              : 'text-sand-500 hover:text-sand-300'
                          }`}
                        >
                          {pm}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const cmd = pkgManager === 'pnpm'
                            ? `pnpm dlx shadcn@latest add @aicanvas/andromeda-${slug}`
                            : pkgManager === 'bun'
                            ? `bunx shadcn@latest add @aicanvas/andromeda-${slug}`
                            : pkgManager === 'yarn'
                            ? `yarn dlx shadcn@latest add @aicanvas/andromeda-${slug}`
                            : `npx shadcn@latest add @aicanvas/andromeda-${slug}`
                          navigator.clipboard.writeText(cmd)
                          setCliCopied(true)
                          setTimeout(() => setCliCopied(false), 2000)
                        }}
                        className="ml-auto shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
                      >
                        {cliCopied
                          ? <Check weight="regular" size={14} className="text-olive-500" />
                          : <Copy weight="regular" size={14} />}
                      </button>
                    </div>
                    <div className="px-4 py-3.5">
                      <code className="font-mono text-sm text-sand-300">
                        {pkgManager === 'pnpm'
                          ? `pnpm dlx shadcn@latest add @aicanvas/andromeda-${slug}`
                          : pkgManager === 'bun'
                          ? `bunx shadcn@latest add @aicanvas/andromeda-${slug}`
                          : pkgManager === 'yarn'
                          ? `yarn dlx shadcn@latest add @aicanvas/andromeda-${slug}`
                          : `npx shadcn@latest add @aicanvas/andromeda-${slug}`}
                      </code>
                    </div>
                  </div>
                </Step>

                {/* Step 2 — dark mode */}
                <Step number={2} isLast>
                  <div className="mb-2.5 flex items-center gap-2">
                    <p className="text-sm text-sand-600 dark:text-sand-400">
                      For dark mode, add the{' '}
                      <code className="rounded bg-sand-200 px-1 py-0.5 font-mono text-xs text-sand-800 dark:bg-sand-800 dark:text-sand-200">
                        dark
                      </code>{' '}
                      class to your{' '}
                      <code className="rounded bg-sand-200 px-1 py-0.5 font-mono text-xs text-sand-800 dark:bg-sand-800 dark:text-sand-200">
                        &lt;html&gt;
                      </code>{' '}
                      element:
                    </p>
                    <span className="ml-auto shrink-0 rounded-full bg-sand-200 px-2 py-0.5 text-xs font-medium text-sand-400 dark:bg-sand-800 dark:text-sand-500">
                      Optional
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-sand-950 px-4 py-3">
                    <code className="font-mono text-sm text-sand-300">{'<html class="dark">'}</code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('<html class="dark">')
                        setDarkCopied(true)
                        setTimeout(() => setDarkCopied(false), 2000)
                      }}
                      className="shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
                    >
                      {darkCopied
                        ? <Check weight="regular" size={14} className="text-olive-500" />
                        : <Copy weight="regular" size={14} />}
                    </button>
                  </div>
                </Step>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Manual: copy the source */}
                <Step number={1} isLast>
                  <p className="mb-2.5 text-sm text-sand-600 dark:text-sand-400">
                    Copy and paste the following code into your project:
                  </p>
                  <div className="relative rounded-lg bg-sand-950">
                    <div className="flex items-center justify-between border-b border-sand-800 px-4 py-2">
                      <span className="font-mono text-xs text-sand-500">
                        {name}.tsx
                      </span>
                      <button
                        type="button"
                        onClick={copyCode}
                        className="shrink-0 rounded-md p-1.5 text-sand-500 transition-all hover:text-sand-200 active:scale-90"
                      >
                        {codeCopied
                          ? <Check weight="regular" size={14} className="text-olive-500" />
                          : <Copy weight="regular" size={14} />}
                      </button>
                    </div>
                    <div className="max-h-96 overflow-auto p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4A453F transparent' }}>
                      {highlightedCode}
                    </div>
                  </div>
                </Step>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── More Andromeda components ──────────────────────────────────── */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-lg font-bold text-sand-900 dark:text-sand-50">
              More Andromeda components
            </h2>
            {canPaginate && (
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => pageRelated(-1)}
                  disabled={!canGoPrev}
                  aria-label="Previous components"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-sand-300 bg-sand-100 text-sand-600 transition-all duration-150 hover:border-sand-400 hover:bg-sand-50 hover:text-sand-900 active:scale-95 disabled:pointer-events-none disabled:opacity-30 dark:border-sand-800 dark:bg-sand-900 dark:text-sand-400 dark:hover:border-sand-700 dark:hover:bg-sand-800 dark:hover:text-sand-100"
                >
                  <ArrowLeft weight="regular" size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => pageRelated(1)}
                  disabled={!canGoNext}
                  aria-label="Next components"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-sand-300 bg-sand-100 text-sand-600 transition-all duration-150 hover:border-sand-400 hover:bg-sand-50 hover:text-sand-900 active:scale-95 disabled:pointer-events-none disabled:opacity-30 dark:border-sand-800 dark:bg-sand-900 dark:text-sand-400 dark:hover:border-sand-700 dark:hover:bg-sand-800 dark:hover:text-sand-100"
                >
                  <ArrowRight weight="regular" size={15} />
                </button>
              </div>
            )}
          </div>
          <div className="relative overflow-hidden">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence
                mode="popLayout"
                custom={relatedDir}
                initial={false}
              >
                {visibleRelated.map((c) => (
                  <motion.div
                    key={c.slug}
                    layout
                    custom={relatedDir}
                    variants={{
                      enter: (dir: 1 | -1) => ({
                        x: dir > 0 ? '110%' : '-110%',
                        opacity: 0,
                        zIndex: 10,
                      }),
                      center: { x: 0, opacity: 1, zIndex: 10 },
                      exit: { x: 0, opacity: 0, zIndex: -1 },
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                      layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                    }}
                    className="relative"
                  >
                    <Link
                      href={`/design-systems/andromeda/${c.slug}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-sand-300 bg-sand-100 transition-colors duration-200 hover:border-sand-400 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700"
                    >
                      <div
                        className="relative aspect-video overflow-hidden"
                        style={{ backgroundColor: tokens.color.surface.base }}
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage:
                              'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
                            backgroundSize: '18px 18px',
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            style={{
                              fontFamily: tokens.typography.fontMono,
                              fontSize: tokens.typography.size.xs,
                              color: tokens.color.text.faint,
                              textTransform: 'uppercase',
                              letterSpacing: tokens.typography.tracking.widest,
                            }}
                          >
                            /// {c.slug}
                          </span>
                        </div>
                      </div>
                      <div className="px-3 py-2.5">
                        <h3 className="truncate text-sm font-semibold text-sand-900 dark:text-sand-50">
                          {c.name}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}
    </main>

    <AnimatePresence>
      {fullscreen && (
        <motion.div
          key="andromeda-fullscreen-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/75"
          onClick={() => setFullscreen(false)}
        >
          <motion.div
            key="andromeda-fullscreen-panel"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 overflow-auto sm:inset-10 sm:rounded-2xl sm:border sm:border-sand-800 sm:shadow-2xl"
            style={{ backgroundColor: tokens.color.surface.base }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex min-h-full items-center justify-center p-8 sm:p-12">
              <AndromedaDemo slug={slug} />
            </div>

            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-sand-700 bg-sand-900/95 text-sand-400 transition-all duration-150 hover:border-sand-500 hover:bg-sand-800 hover:text-sand-100 active:scale-95"
            >
              <CornersIn weight="regular" size={17} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* ── CLI copied toast — matches the standalone component page ────────── */}
    <AnimatePresence>
      {cliCopied && (
        <motion.div
          key="cli-toast"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed bottom-16 z-50 -translate-x-1/2"
          style={{
            left: mainCardRef.current
              ? mainCardRef.current.getBoundingClientRect().left + mainCardRef.current.offsetWidth / 2
              : '50%',
          }}
        >
          <div className="flex items-center gap-3 rounded-xl border border-sand-700 bg-sand-800 px-4 py-3 shadow-lg">
            <Check weight="regular" size={16} className="shrink-0 text-olive-500" />
            <div>
              <p className="text-sm font-semibold text-sand-50">
                Install command copied
              </p>
              <p className="mt-0.5 text-xs text-sand-400">
                Paste into your terminal to add this component.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
