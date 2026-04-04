'use client'

import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Eye,
  Code,
  Check,
  Copy,
  CaretDown,
  ArrowLeft,
  Tag as TagIcon,
  Sun,
  Moon,
  CornersOut,
  CornersIn,
} from '@phosphor-icons/react'
import type { Tag, Platform } from '../ComponentCard'
import { PLATFORMS } from '../ComponentCard'

// ─── ComponentPageView ────────────────────────────────────────────────────────

interface ComponentPageViewProps {
  slug: string
  name: string
  description: string
  tags: Tag[]
  code: string
  prompts: Record<Platform, string>
  dualTheme: boolean
  children: ReactNode
}

export default function ComponentPageView({
  slug,
  name,
  description,
  tags,
  code,
  prompts,
  dualTheme,
  children,
}: ComponentPageViewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [cardTheme, setCardTheme] = useState<'dark' | 'light'>('dark')
  const [codeCopied, setCodeCopied] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [promptCopied, setPromptCopied] = useState<Platform | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setFullscreen(false)
    }
    if (fullscreen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [fullscreen])

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
      setDropdownOpen(false)
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
          Back to marketplace
        </Link>

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
            <div className="flex items-end justify-between border-b border-sand-300 px-5 pt-3 dark:border-sand-800">

              {/* Preview / Code tabs */}
              <div className="flex items-end gap-0.5">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 rounded-t-md px-3 pb-2 pt-1.5 text-sm font-semibold transition-colors ${
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
                  className={`flex items-center gap-1.5 rounded-t-md px-3 pb-2 pt-1.5 text-sm font-semibold transition-colors ${
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
              <div className="mb-2 flex items-center gap-2">

                {/* Theme pill — sun / moon icons, switches on click */}
                <div className="group/toggle relative" style={{ cursor: !dualTheme ? 'not-allowed' : undefined }}>
                  <button
                    onClick={() => dualTheme && setCardTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                    className={`flex items-center gap-1 rounded-full border px-3 py-1.5 transition-all duration-150 ${
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

                {/* Fullscreen icon button */}
                <div className="group/fullscreen relative">
                  <button
                    onClick={() => setFullscreen(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-sand-300 bg-sand-200 text-sand-600 transition-all duration-150 hover:border-sand-400 hover:bg-sand-300 hover:text-sand-900 active:scale-95 active:bg-sand-400 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-400 dark:hover:border-sand-600 dark:hover:bg-sand-700 dark:hover:text-sand-100 dark:active:bg-sand-600"
                  >
                    <CornersOut weight="regular" size={16} />
                  </button>
                  <div className="pointer-events-none absolute top-full right-0 z-10 mt-1.5 hidden whitespace-nowrap rounded-lg border border-sand-700 bg-sand-800 px-2.5 py-1.5 text-xs text-sand-300 group-hover/fullscreen:block">
                    Full screen
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
                    {children}
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

              {/* Copy Prompt dropdown — semibold (600) */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-lg bg-olive-500 px-3.5 py-2 text-sm font-semibold text-sand-950 transition-all hover:bg-olive-400 active:scale-95"
                >
                  {promptCopied && <Check weight="regular" size={15} />}
                  {promptCopied ? `${promptCopied} copied!` : 'Copy Prompt'}
                  {!promptCopied && (
                    <CaretDown
                      weight="regular"
                      size={13}
                      style={{
                        transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute bottom-full right-0 mb-2 w-44 overflow-hidden rounded-xl border border-sand-300 bg-sand-50 shadow-xl shadow-sand-300/60 dark:border-sand-700 dark:bg-sand-900 dark:shadow-black/50"
                    >
                      {/* Dropdown label — semibold (600) */}
                      <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-sand-500">
                        Copy prompt for…
                      </div>
                      {PLATFORMS.map((platform) => (
                        <button
                          key={platform}
                          onClick={() => copyPrompt(platform)}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-sand-700 transition-colors hover:bg-sand-100 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800 dark:hover:text-sand-50"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-md border border-sand-300 bg-sand-200 text-[10px] font-bold text-sand-600 dark:border-sand-700 dark:bg-sand-800 dark:text-sand-400">
                            {platform[0]}
                          </span>
                          {platform}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
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
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-sand-700 bg-sand-900/80 text-sand-400 backdrop-blur-sm transition-all duration-150 hover:border-sand-500 hover:bg-sand-800 hover:text-sand-100 active:scale-95"
              >
                <CornersIn weight="regular" size={17} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
