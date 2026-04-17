'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { ComponentCard } from './ComponentCard'
import { HeaderSocials } from './HeaderSocials'
import { INITIAL_LOAD, LOAD_MORE_SIZE } from './LoadMore'
import { LoadMore } from './LoadMore'
import type { ComponentEntry } from '../lib/component-registry'
import { LAST_DEPLOY } from '../lib/config'

const NEW_BADGE_ACTIVE = Date.now() - new Date(LAST_DEPLOY).getTime() < 96 * 60 * 60 * 1000

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
    router.replace(qs ? `/?${qs}` : '/', { scroll: false })
  }

  return (
    <div className="flex min-h-full flex-col bg-sand-200 dark:bg-sand-950">

      {/* ── Top bar (desktop only — mobile uses MobileNav) ── */}
      <div className="sticky top-0 z-10 hidden h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-sand-300 bg-sand-200/90 px-6 backdrop-blur dark:border-sand-800 dark:bg-sand-950/90 md:grid">
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
      <div className="flex-1 bg-sand-200 p-4 dark:bg-sand-950 md:p-6">
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
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <MagnifyingGlass weight="regular" size={32} className="mb-4 text-sand-400 dark:text-sand-600" />
            <p className="text-sm font-semibold text-sand-700 dark:text-sand-300">
              No components match &ldquo;{query}&rdquo;
            </p>
            <p className="mt-1 text-sm text-sand-400 dark:text-sand-600">
              Try a different keyword or clear the search.
            </p>
            <button
              onClick={clearSearch}
              className="mt-4 rounded-lg border border-sand-300 px-3.5 py-2 text-sm font-semibold text-sand-700 transition-colors hover:border-sand-400 hover:text-sand-900 dark:border-sand-700 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-sand-100"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
