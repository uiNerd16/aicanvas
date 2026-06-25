'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CaretRight } from '@phosphor-icons/react'
import type { FaqItem } from '../faq/FaqView'

export type { FaqItem }

// Renders an answer, turning the first occurrence of link.label into a link.
// (Mirrors FaqView's AnswerText so `a` can stay plain text.)
function AnswerText({ item }: { item: FaqItem }) {
  const { a, link } = item
  if (!link || !a.includes(link.label)) return <>{a}</>
  const idx = a.indexOf(link.label)
  return (
    <>
      {a.slice(0, idx)}
      <Link
        href={link.href}
        className="font-medium text-olive-600 underline decoration-olive-500/40 underline-offset-2 transition-colors hover:text-olive-500 dark:text-olive-400 dark:hover:text-olive-300"
      >
        {link.label}
      </Link>
      {a.slice(idx + link.label.length)}
    </>
  )
}

// Reusable numbered FAQ accordion — the same card style as /faq, but theme-
// adaptive (light + dark) so it fits surfaces like /pricing. Self-contained open
// state; the first item opens by default. /faq keeps its own multi-category
// renderer in FaqView (always-dark), so that page is unaffected.
export function FaqAccordion({
  items,
  idPrefix = 'faq',
}: {
  items: FaqItem[]
  idPrefix?: string
}) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(items.length ? [0] : []))
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <div className="space-y-2.5">
      {items.map((it, i) => {
        const isOpen = open.has(i)
        return (
          <motion.div
            key={`${idPrefix}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.3 }}
            className={`rounded-xl border transition-colors ${
              isOpen
                ? 'border-sand-400 bg-sand-100 dark:border-sand-700 dark:bg-sand-900'
                : 'border-sand-300 bg-sand-100/60 hover:border-sand-400 dark:border-sand-800 dark:bg-sand-900/50 dark:hover:border-sand-700'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
            >
              <span
                className={`w-7 shrink-0 text-sm font-bold tabular-nums ${
                  isOpen ? 'text-olive-600 dark:text-olive-400' : 'text-sand-400 dark:text-sand-600'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="flex-1 text-base font-semibold text-sand-900 dark:text-sand-50">
                {it.q}
              </h3>
              <CaretRight
                weight="regular"
                size={16}
                className={`shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-90 text-olive-600 dark:text-olive-400' : 'text-sand-400 dark:text-sand-600'
                }`}
              />
            </button>
            {/* Answer stays in the DOM (SEO); grid-rows trick animates the collapse */}
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-4 pl-14 pr-8 text-base leading-relaxed text-sand-600 dark:text-sand-400">
                  <AnswerText item={it} />
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
