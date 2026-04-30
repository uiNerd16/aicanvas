'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { MagnifyingGlass, Sparkle, Ghost, Question } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { ComponentCard } from './ComponentCard'
import { HeaderSocials } from './HeaderSocials'
import { INITIAL_LOAD, LOAD_MORE_SIZE } from './LoadMore'
import { LoadMore } from './LoadMore'
import type { ComponentEntry } from '../lib/component-registry'
import { LAST_DEPLOY } from '../lib/config'

const NEW_BADGE_ACTIVE = Date.now() - new Date(LAST_DEPLOY).getTime() < 96 * 60 * 60 * 1000

// ─── Fuzzy "Did you mean?" helpers ───────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  if (Math.abs(a.length - b.length) > 4) return 99
  const m = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = 0; i <= a.length; i++) m[i][0] = i
  for (let j = 0; j <= b.length; j++) m[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      m[i][j] = a[i - 1] === b[j - 1]
        ? m[i - 1][j - 1]
        : 1 + Math.min(m[i - 1][j], m[i][j - 1], m[i - 1][j - 1])
    }
  }
  return m[a.length][b.length]
}

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'your', 'you', 'are',
  'but', 'not', 'out', 'now', 'its', 'one', 'two', 'all', 'any', 'can', 'has', 'have',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s\-—,.;:/()[\]{}"'`]+/)
    .map((w) => w.replace(/[^\w]/g, ''))
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w))
}

function buildVocabulary(components: ComponentEntry[]): string[] {
  const words = new Set<string>()
  for (const c of components) {
    for (const w of tokenize(c.name)) words.add(w)
    for (const t of c.tags) for (const w of tokenize(t.label)) words.add(w)
    for (const w of tokenize(c.description)) words.add(w)
  }
  return Array.from(words)
}

function findSuggestions(query: string, vocab: string[], max = 3): string[] {
  const q = query.toLowerCase().trim()
  if (q.length < 3) return []
  const threshold = q.length <= 4 ? 1 : q.length <= 7 ? 2 : 3
  const scored: Array<{ w: string; d: number }> = []
  for (const w of vocab) {
    const d = levenshtein(q, w)
    if (d > 0 && d <= threshold) scored.push({ w, d })
  }
  scored.sort((a, b) => a.d - b.d || a.w.length - b.w.length)
  const out: string[] = []
  for (const { w } of scored) {
    if (!out.includes(w)) out.push(w)
    if (out.length >= max) break
  }
  return out
}

// ─── HomeClient ───────────────────────────────────────────────────────────────

export function HomeClient({ components }: { components: ComponentEntry[] }) {
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const query         = searchParams.get('q') ?? ''
  const category      = searchParams.get('category') ?? ''

  const q = query.trim().toLowerCase()
  const filtered = q
    ? components.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.label.toLowerCase().includes(q)),
      )
    : components

  // ── Load more ──────────────────────────────────────────────────────────────
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD)
  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length
  const remaining = filtered.length - visibleCount

  // Reset visible count when search query changes
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD)
  }, [q])

  function handleLoadMore() {
    setVisibleCount((v) => Math.min(v + LOAD_MORE_SIZE, filtered.length))
  }

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    const qs = params.toString()
    router.replace(qs ? `/components?${qs}` : '/components', { scroll: false })
  }

  // ── "Did you mean?" ────────────────────────────────────────────────────────
  // Only computed when the search has zero hits. Vocabulary is memoized once
  // per components set; suggestions re-run per query. Both are cheap.
  const vocabulary = useMemo(() => buildVocabulary(components), [components])
  const suggestions = useMemo(() => {
    if (!q || filtered.length > 0) return []
    return findSuggestions(q, vocabulary, 3)
  }, [q, filtered.length, vocabulary])

  const applySuggestion = (word: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('q', word)
    router.replace(`/components?${params.toString()}`, { scroll: false })
  }

  // ── Empty-state icon + phrase cycler ───────────────────────────────────────
  // Synced: each icon has its own matching line, flipping together every 1.5s.
  // Only ticks when the empty state is actually on screen.
  const EMPTY_BEATS = [
    { Icon: MagnifyingGlass, phrase: 'hmm…' },
    { Icon: Ghost,           phrase: 'nothing here…' },
    { Icon: Question,        phrase: "where'd it go?" },
  ]
  const [emptyIdx, setEmptyIdx] = useState(0)
  useEffect(() => {
    if (filtered.length > 0) return
    const id = setInterval(() => {
      setEmptyIdx((i) => (i + 1) % EMPTY_BEATS.length)
    }, 1500)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length])
  const EmptyIcon = EMPTY_BEATS[emptyIdx].Icon
  const emptyPhrase = EMPTY_BEATS[emptyIdx].phrase

  return (
    <div className="flex min-h-full flex-col bg-sand-200 dark:bg-sand-950">

      {/* ── Top bar (desktop only — mobile uses MobileNav) ── */}
      <div className="sticky top-0 z-10 hidden h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-sand-300 bg-sand-200 px-6 dark:border-sand-800 dark:bg-sand-950 md:grid">
        <Link href="/components" className="shrink-0 text-sm font-semibold text-sand-900 transition-colors hover:text-sand-600 dark:text-sand-50 dark:hover:text-sand-400">
          Components
        </Link>

        <span className="text-sm font-semibold text-olive-500">
          {category ? `/${category}` : ''}
        </span>

        <div className="flex justify-end">
          <HeaderSocials />
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="flex flex-1 flex-col bg-sand-200 p-4 dark:bg-sand-950 md:p-6">
        {/* Mobile breadcrumb — shown above cards on small screens */}
        <p className="mb-4 text-sm font-semibold md:hidden">
          <Link href="/components" className="text-sand-900 transition-colors hover:text-sand-600 dark:text-sand-50 dark:hover:text-sand-400">Components</Link>
          {category && <span className="text-olive-500">/{category}</span>}
        </p>
        {filtered.length > 0 ? (
          <>
            <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {visible.map((entry, i) => (
                <motion.div
                  key={entry.slug}
                  initial={i >= visibleCount - LOAD_MORE_SIZE ? { opacity: 0, y: 16 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i >= visibleCount - LOAD_MORE_SIZE ? (i % LOAD_MORE_SIZE) * 0.03 : 0 }}
                >
                  <ComponentCard
                    name={entry.name}
                    description={entry.description}
                    tags={entry.tags}
                    image={entry.image}
                    badge={NEW_BADGE_ACTIVE ? entry.badge : undefined}
                    href={`/components/${entry.slug}`}
                    slug={entry.slug}
                    position={i}
                    source="index"
                  />
                </motion.div>
              ))}
            </div>
            <LoadMore
              hasMore={hasMore}
              remaining={remaining}
              onLoadMore={handleLoadMore}
            />
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 text-center"
          >
            {/* Icon — cycles through MagnifyingGlass → Ghost → Question every
                1.5s with a flip-crossfade, synced with the phrase below. */}
            <div className="mb-1 flex h-16 w-16 items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`icon-${emptyIdx}`}
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center"
                >
                  <EmptyIcon weight="thin" size={48} className="text-olive-500" />
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Cycling phrase — fixed height keeps layout below from jumping.
                Generous bottom margin creates the rest point between the
                playful intro and the informative answer below. */}
            <div className="mb-14 flex h-6 items-center justify-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={`phrase-${emptyIdx}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-sm leading-relaxed text-sand-500 dark:text-sand-400"
                >
                  {emptyPhrase}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Heading — bumped up a notch vs the default so the rhythm change
                from muted phrase → strong heading does the distinction work. */}
            <h2 className="text-2xl font-bold tracking-tight text-sand-900 dark:text-sand-50 sm:text-3xl">
              No results for &ldquo;{query}&rdquo;
            </h2>

            {/* "Did you mean?" chips */}
            {suggestions.length > 0 && (
              <div className="mt-6 w-full">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-sand-400 dark:text-sand-600">
                  Did you mean
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {suggestions.map((word) => (
                    <button
                      key={word}
                      onClick={() => applySuggestion(word)}
                      className="group flex items-center gap-1.5 rounded-full border border-olive-500/30 bg-olive-500/10 px-3.5 py-1.5 text-sm font-semibold text-olive-600 transition-all hover:border-olive-500/60 hover:bg-olive-500/20 active:scale-95 dark:text-olive-400"
                    >
                      <Sparkle weight="regular" size={13} className="opacity-60 transition-opacity group-hover:opacity-100" />
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary CTA — only when we have nothing better to offer. If
                the Did-you-mean chips are up, they ARE the escape hatch. */}
            {suggestions.length === 0 && (
              <button
                onClick={clearSearch}
                className="mt-8 rounded-lg border border-sand-300 bg-sand-100 px-4 py-2 text-sm font-semibold text-sand-700 transition-colors hover:border-sand-400 hover:text-sand-900 active:scale-95 dark:border-sand-700 dark:bg-sand-900 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-sand-100"
              >
                Browse all components
              </button>
            )}
          </motion.div>
        )}
      </div>

    </div>
  )
}
