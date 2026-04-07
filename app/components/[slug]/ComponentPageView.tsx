'use client'

import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Eye,
  Code,
  Check,
  Copy,
  ArrowLeft,
  ArrowRight,
  Tag as TagIcon,
  Sun,
  Moon,
  CornersOut,
  CornersIn,
  ArrowClockwise,
  X,
} from '@phosphor-icons/react'
import type { Tag, Platform } from '../ComponentCard'
import { PLATFORMS } from '../ComponentCard'
import { HeaderSocials } from '../HeaderSocials'
import type { ComponentMeta } from '../../lib/component-registry'

// ─── ComponentPageView ────────────────────────────────────────────────────────

interface ComponentPageViewProps {
  slug: string
  name: string
  description: string
  tags: Tag[]
  code: string
  prompts: Record<Platform, string>
  dualTheme: boolean
  related: ComponentMeta[]
  children: ReactNode
}

const RELATED_PAGE_SIZE = 3

export default function ComponentPageView({
  slug,
  name,
  description,
  tags,
  code,
  prompts,
  dualTheme,
  related,
  children,
}: ComponentPageViewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [cardTheme, setCardTheme] = useState<'dark' | 'light'>('dark')
  const [codeCopied, setCodeCopied] = useState(false)
  const [promptCopied, setPromptCopied] = useState<Platform | null>(null)
  const [fullscreen, setFullscreen] = useState(false)

  // Refresh button — incrementing this key remounts the preview wrapper,
  // which restarts any animations / effects / canvas inits inside the
  // children component.
  const [previewKey, setPreviewKey] = useState(0)

  // Prompt drawer — replaces the old click-blind dropdown.
  const [promptDrawerOpen, setPromptDrawerOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] =
    useState<Platform>('Claude Code')

  // Related pagination — sliding window of RELATED_PAGE_SIZE cards advancing
  // ONE card at a time. The exiting card stays in place but drops behind the
  // others (zIndex -1) and fades out, so the next card visually slides ON TOP
  // of it as the layout animation runs. `relatedDir` tracks which arrow was
  // last pressed so the entering card slides in from the correct edge.
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

  // Escape key closes whichever overlay is open (fullscreen or drawer).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (fullscreen) setFullscreen(false)
      if (promptDrawerOpen) setPromptDrawerOpen(false)
    }
    if (fullscreen || promptDrawerOpen) {
      document.addEventListener('keydown', onKey)
    }
    return () => document.removeEventListener('keydown', onKey)
  }, [fullscreen, promptDrawerOpen])

  function refreshPreview() {
    setPreviewKey((k) => k + 1)
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    } catch {}
  }

  async function copyPrompt(platform: Platform) {
    try {
      await navigator.clipboard.writeText(prompts[platform])
      setPromptCopied(platform)
      setTimeout(() => setPromptCopied(null), 2000)
    } catch {}
  }

  return (
    <>
      {/* Top stripe — sticky */}
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-sand-300 bg-sand-200/90 px-6 backdrop-blur dark:border-sand-800 dark:bg-sand-950/90">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-sand-700 transition-colors hover:text-sand-900 dark:text-sand-400 dark:hover:text-sand-200"
        >
          <ArrowLeft weight="regular" size={15} />
          Back to components
        </Link>

        <HeaderSocials />
      </div>

      <main className="bg-sand-200 dark:bg-sand-950">
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6">

          {/* Header */}
          <div className="mb-8">
            {/* Page heading — bold (700) */}
            <h1 className="text-3xl font-bold tracking-tight text-sand-900 dark:text-sand-50 sm:text-4xl">
              {name}
            </h1>
            {/* Description — normal (400) */}
            <p className="mt-3 font-normal text-sand-600 dark:text-sand-400">{description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <TagIcon weight="regular" size={14} className="shrink-0 text-sand-400 dark:text-sand-500" />
              {tags.map((tag) =>
                tag.accent ? (
                  <span key={tag.label} className="rounded-full border border-olive-500/25 bg-olive-500/10 px-2.5 py-0.5 text-xs font-semibold text-olive-600 dark:text-olive-400">
                    {tag.label}
                  </span>
                ) : (
                  <span key={tag.label} className="rounded-full border border-sand-300 bg-sand-200 px-2.5 py-0.5 text-xs font-semibold text-sand-600 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-400">
                    {tag.label}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Main card */}
          <div className="overflow-hidden rounded-2xl border border-sand-300 bg-sand-100 shadow-sm dark:border-sand-800 dark:bg-sand-900 dark:shadow-none">

            {/* Tab bar — tabs left, card theme toggle right */}
            <div className="flex items-center justify-between border-b border-sand-300 px-5 py-4 dark:border-sand-800">

              {/* Preview / Code tabs */}
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-sand-200 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                      : 'text-sand-400 hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300'
                  }`}
                >
                  <Eye weight="regular" size={15} />
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                    activeTab === 'code'
                      ? 'bg-sand-200 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                      : 'text-sand-400 hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300'
                  }`}
                >
                  <Code weight="regular" size={15} />
                  Code
                </button>
              </div>

              {/* Right-side controls */}
              <div className="flex items-center gap-2">

                {/* Refresh icon button — only visible during preview tab */}
                {activeTab === 'preview' && (
                  <div className="group/refresh relative">
                    <button
                      onClick={refreshPreview}
                      aria-label="Restart animation"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
                    >
                      <ArrowClockwise weight="regular" size={16} />
                    </button>
                    <div className="pointer-events-none absolute top-full right-0 z-10 mt-1.5 hidden whitespace-nowrap rounded-lg border border-sand-700 bg-sand-800 px-2.5 py-1.5 text-xs text-sand-300 group-hover/refresh:block">
                      Restart animation
                    </div>
                  </div>
                )}

                {/* Fullscreen icon button */}
                <div className="group/fullscreen relative">
                  <button
                    onClick={() => setFullscreen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-300/60 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
                  >
                    <CornersOut weight="regular" size={16} />
                  </button>
                  <div className="pointer-events-none absolute top-full right-0 z-10 mt-1.5 hidden whitespace-nowrap rounded-lg border border-sand-700 bg-sand-800 px-2.5 py-1.5 text-xs text-sand-300 group-hover/fullscreen:block">
                    Full screen
                  </div>
                </div>

                {/* Theme pill — sun / moon icons, switches on click */}
                <div className="group/toggle relative" style={{ cursor: !dualTheme ? 'not-allowed' : undefined }}>
                  <button
                    onClick={() => dualTheme && setCardTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                    className={`flex items-center gap-1 rounded-full border px-3.5 py-2 transition-all duration-150 ${
                      dualTheme
                        ? cardTheme === 'dark'
                          ? 'border-sand-300 bg-sand-200 text-sand-700 hover:border-sand-400 hover:bg-sand-300 active:scale-95 active:bg-sand-400 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:bg-sand-700 dark:active:bg-sand-600'
                          : 'border-olive-500/40 bg-olive-500/10 text-olive-600 hover:bg-olive-500/20 active:scale-95 active:bg-olive-500/30 dark:border-olive-500/40 dark:text-olive-400 dark:hover:bg-olive-500/20 dark:active:bg-olive-500/30'
                        : 'pointer-events-none border-sand-300 bg-sand-200 text-sand-400 opacity-40 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-600'
                    }`}
                  >
                    <Moon weight="regular" size={15} className={cardTheme === 'light' ? 'opacity-40' : ''} />
                    <span className="h-3.5 w-px bg-current opacity-20" />
                    <Sun weight="regular" size={15} className={cardTheme === 'dark' ? 'opacity-40' : ''} />
                  </button>
                  <div className="pointer-events-none absolute top-full right-0 z-10 mt-1.5 hidden whitespace-nowrap rounded-lg border border-sand-700 bg-sand-800 px-2.5 py-1.5 text-xs text-sand-300 group-hover/toggle:block">
                    {dualTheme
                      ? cardTheme === 'dark' ? 'Switch to light' : 'Switch to dark'
                      : 'Dark mode only'}
                  </div>
                </div>

              </div>
            </div>

            {/* Content area — background controlled by cardTheme, isolated from global theme */}
            <div
              data-card-theme={cardTheme}
              className={`relative h-[480px] overflow-hidden transition-colors duration-300 ${
                cardTheme === 'dark' ? 'dark bg-sand-950' : 'bg-sand-100'
              }`}
            >
              <AnimatePresence mode="wait">
                {activeTab === 'preview' ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {/* Keyed wrapper so the refresh button can force a remount.
                        Skipped while fullscreen is open so the preview component
                        only mounts ONCE — otherwise it runs in parallel with the
                        fullscreen instance and tanks framerate (especially for
                        canvas / three.js / heavy framer-motion components). */}
                    {!fullscreen && (
                      <div key={previewKey} className="contents">
                        {children}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 overflow-auto p-5"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#4A453F transparent' }}
                  >
                    <pre className="font-mono text-[13px] leading-relaxed text-sand-400">{code}</pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action bar */}
            <div className="flex items-center justify-end gap-2 border-t border-sand-300 px-5 py-4 dark:border-sand-800">

              {/* Copy Code — semibold (600) */}
              <button
                onClick={copyCode}
                className="flex items-center gap-2 rounded-lg border border-sand-300 bg-sand-50 px-3.5 py-2 text-sm font-semibold text-sand-700 transition-all hover:border-sand-400 hover:text-sand-900 active:scale-95 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-sand-50"
              >
                {codeCopied
                  ? <Check weight="regular" size={15} />
                  : <Copy weight="regular" size={15} />}
                {codeCopied ? 'Copied!' : 'Copy Code'}
              </button>

              {/* Copy Prompt — opens prompt drawer */}
              <button
                onClick={() => setPromptDrawerOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-olive-500 px-3.5 py-2 text-sm font-semibold text-sand-950 transition-all hover:bg-olive-400 active:scale-95"
              >
                {promptCopied && <Check weight="regular" size={15} />}
                {promptCopied ? `${promptCopied} copied!` : 'Copy Prompt'}
              </button>

            </div>
          </div>

          {/* ── Related components ─────────────────────────────────────────── */}
          {related.length > 0 && (
            <section className="mt-16">
              <div className="mb-5 flex items-end justify-between gap-4">
                <h2 className="text-lg font-bold text-sand-900 dark:text-sand-50">
                  More like this
                </h2>
                {canPaginate && (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => pageRelated(-1)}
                      disabled={!canGoPrev}
                      aria-label="Previous related components"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-sand-300 bg-sand-100 text-sand-600 transition-all duration-150 hover:border-sand-400 hover:bg-sand-50 hover:text-sand-900 active:scale-95 disabled:pointer-events-none disabled:opacity-30 dark:border-sand-800 dark:bg-sand-900 dark:text-sand-400 dark:hover:border-sand-700 dark:hover:bg-sand-800 dark:hover:text-sand-100"
                    >
                      <ArrowLeft weight="regular" size={15} />
                    </button>
                    <button
                      onClick={() => pageRelated(1)}
                      disabled={!canGoNext}
                      aria-label="Next related components"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-sand-300 bg-sand-100 text-sand-600 transition-all duration-150 hover:border-sand-400 hover:bg-sand-50 hover:text-sand-900 active:scale-95 disabled:pointer-events-none disabled:opacity-30 dark:border-sand-800 dark:bg-sand-900 dark:text-sand-400 dark:hover:border-sand-700 dark:hover:bg-sand-800 dark:hover:text-sand-100"
                    >
                      <ArrowRight weight="regular" size={15} />
                    </button>
                  </div>
                )}
              </div>
              <div className="relative overflow-hidden">
                <div className="grid grid-cols-3 gap-4">
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
                          layout: {
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        }}
                        className="relative"
                      >
                        <Link
                          href={`/components/${c.slug}`}
                          className="group flex flex-col overflow-hidden rounded-xl border border-sand-300 bg-sand-100 transition-colors duration-200 hover:border-sand-400 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700"
                        >
                          <div className="relative aspect-video overflow-hidden bg-sand-950">
                            {c.image ? (
                              <img
                                src={c.image}
                                alt={c.name}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                              />
                            ) : (
                              <div
                                className="absolute inset-0"
                                style={{
                                  backgroundImage:
                                    'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
                                  backgroundSize: '18px 18px',
                                }}
                              />
                            )}
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

        </div>
      </main>

      {/* ── Fullscreen overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            key="fullscreen-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/75"
            onClick={() => setFullscreen(false)}
          >
            <motion.div
              key="fullscreen-panel"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              data-card-theme={cardTheme}
              className={`absolute inset-10 overflow-hidden rounded-2xl border shadow-2xl transition-colors duration-300 ${
                cardTheme === 'dark'
                  ? 'dark border-sand-800 bg-sand-950'
                  : 'border-sand-300 bg-sand-100'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {children}

              {/* Close button */}
              <button
                onClick={() => setFullscreen(false)}
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg border border-sand-700 bg-sand-900/95 text-sand-400 transition-all duration-150 hover:border-sand-500 hover:bg-sand-800 hover:text-sand-100 active:scale-95"
              >
                <CornersIn weight="regular" size={17} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Prompt drawer ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {promptDrawerOpen && (
          <motion.div
            key="prompt-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setPromptDrawerOpen(false)}
          >
            <motion.div
              key="prompt-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 flex h-full w-full flex-col border-l border-sand-300 bg-sand-100 shadow-2xl dark:border-sand-800 dark:bg-sand-900 sm:w-[480px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer header */}
              <div className="flex shrink-0 items-center justify-between border-b border-sand-300 px-5 py-4 dark:border-sand-800">
                <div>
                  <h2 className="text-sm font-semibold text-sand-900 dark:text-sand-50">Prompts</h2>
                  <p className="mt-0.5 text-xs text-sand-500 dark:text-sand-400">
                    Read it, then copy for the AI tool you use.
                  </p>
                </div>
                <button
                  onClick={() => setPromptDrawerOpen(false)}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sand-500 transition-colors hover:bg-sand-200 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100"
                >
                  <X weight="regular" size={16} />
                </button>
              </div>

              {/* Platform tabs */}
              <div className="flex shrink-0 flex-wrap gap-1.5 border-b border-sand-300 px-5 py-3 dark:border-sand-800">
                {PLATFORMS.map((platform) => {
                  const isActive = selectedPlatform === platform
                  return (
                    <button
                      key={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-sand-300 text-sand-900 dark:bg-sand-700 dark:text-sand-50'
                          : 'bg-transparent text-sand-500 hover:bg-sand-200 hover:text-sand-700 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-200'
                      }`}
                    >
                      {platform}
                    </button>
                  )
                })}
              </div>

              {/* Prompt body */}
              <div
                className="flex-1 overflow-auto px-5 py-4"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#4A453F transparent' }}
              >
                <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-sand-700 dark:text-sand-400">
                  {prompts[selectedPlatform]}
                </pre>
              </div>

              {/* Footer — copy CTA */}
              <div className="shrink-0 border-t border-sand-300 px-5 py-4 dark:border-sand-800">
                <button
                  onClick={() => copyPrompt(selectedPlatform)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-olive-500 px-3.5 py-2.5 text-sm font-semibold text-sand-950 transition-all hover:bg-olive-400 active:scale-95"
                >
                  {promptCopied === selectedPlatform ? (
                    <>
                      <Check weight="regular" size={16} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy weight="regular" size={16} />
                      Copy {selectedPlatform} prompt
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
