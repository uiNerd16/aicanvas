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
} from '@phosphor-icons/react'
import type { Tag, Platform } from '../ComponentCard'
import { PLATFORMS } from '../ComponentCard'

// ─── ComponentPageView ────────────────────────────────────────────────────────

interface ComponentPageViewProps {
  name: string
  description: string
  tags: Tag[]
  code: string
  prompts: Record<Platform, string>
  children: ReactNode
}

export default function ComponentPageView({
  name,
  description,
  tags,
  code,
  prompts,
  children,
}: ComponentPageViewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [codeCopied, setCodeCopied] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [promptCopied, setPromptCopied] = useState<Platform | null>(null)
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
    <main className="bg-sand-200 dark:bg-sand-950">

      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6">

        {/* Back button — semibold (600) for UI element */}
        <Link
          href="/"
          className="mb-8 flex w-fit items-center gap-2 rounded-lg border border-sand-300 bg-sand-100 px-3.5 py-2 text-sm font-semibold text-sand-700 transition-all hover:border-sand-400 hover:bg-sand-50 dark:border-sand-800 dark:bg-sand-900 dark:text-sand-400 dark:hover:border-sand-700 dark:hover:bg-sand-800"
        >
          <ArrowLeft weight="regular" size={15} />
          Back to marketplace
        </Link>

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

          {/* Tabs — semibold (600) for UI labels */}
          <div className="flex items-center gap-0.5 border-b border-sand-300 px-5 pt-4 dark:border-sand-800">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
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
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                activeTab === 'code'
                  ? 'bg-sand-200 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                  : 'text-sand-400 hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300'
              }`}
            >
              <Code weight="regular" size={15} />
              Code
            </button>
          </div>

          {/* Content area — always dark regardless of theme */}
          <div className="relative h-[480px] overflow-hidden bg-sand-950">
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
  )
}
