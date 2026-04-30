'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { GithubLogo, XLogo } from '@phosphor-icons/react'
import { GITHUB_URL, X_URL } from '../lib/config'

// ─── Hey translations ──────────────────────────────────────────────────────────

const HEYS = ['Hey,', 'Hola,', 'やあ,', 'Bonjour,', 'Hallo,', 'Ciao,', '嘿,']

function AnimatedHey() {
  const [displayText, setDisplayText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [erasing, setErasing] = useState(false)

  useEffect(() => {
    const word = HEYS[wordIndex]

    if (!erasing) {
      if (displayText.length < word.length) {
        const id = setTimeout(
          () => setDisplayText(word.slice(0, displayText.length + 1)),
          160,
        )
        return () => clearTimeout(id)
      } else {
        const id = setTimeout(() => setErasing(true), 3000)
        return () => clearTimeout(id)
      }
    } else {
      if (displayText.length > 0) {
        const id = setTimeout(
          () => setDisplayText(displayText.slice(0, -1)),
          100,
        )
        return () => clearTimeout(id)
      } else {
        const id = setTimeout(() => {
          setWordIndex((i) => (i + 1) % HEYS.length)
          setErasing(false)
        }, 400)
        return () => clearTimeout(id)
      }
    }
  }, [displayText, erasing, wordIndex])

  return (
    <span className="inline-flex items-baseline">
      <span className="text-olive-400">{displayText}</span>
      <motion.span
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear', times: [0, 0.45, 0.55, 1] }}
        className="ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[1px] rounded-full bg-olive-400"
      />
    </span>
  )
}

// ─── Platform logos ────────────────────────────────────────────────────────────

function KofiLogo({ className }: { className?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 8h14l-1.6 9.2a1 1 0 0 1-.99.8H7.59a1 1 0 0 1-.99-.8L5 8z"
        fill="currentColor"
      />
      <path
        d="M19 10.5h1.2a1.8 1.8 0 0 1 0 3.6H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M9.5 5.5C9.5 4.5 10.5 4 10.5 3M13.5 5.5C13.5 4.5 14.5 4 14.5 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PayPalLogo({ className }: { className?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        d="M9.5 3h4.3c1.7 0 3 .5 3.7 1.4.7.9.9 2.1.6 3.6-.5 2.6-2.2 4-5 4H11l-.8 4.5H7.8L9.5 3z"
      />
      <path
        d="M6.5 8h4.3c1.7 0 3 .5 3.7 1.4.7.9.9 2.1.6 3.6-.5 2.6-2.2 4-5 4H8.1L7 21H4.5L6.5 8z"
        opacity="0.45"
      />
    </svg>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SupportPage() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollParent = ref.current?.parentElement
    if (scrollParent) {
      scrollParent.style.backgroundColor = 'var(--color-sand-950)'
      return () => {
        scrollParent.style.backgroundColor = ''
      }
    }
  }, [])

  return (
    <div ref={ref} className="min-h-full bg-sand-950">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 hidden h-14 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-sand-800 bg-sand-950/90 px-6 backdrop-blur md:grid">
        <div />
        <Link
          href="/support"
          className="text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400"
        >
          /Support
        </Link>
        <div className="flex items-center justify-end gap-1">
          <Link
            href="/mcp"
            className="mr-1 inline-flex items-center gap-1.5 rounded-lg bg-olive-500 px-3 py-2 text-xs font-semibold text-sand-950 transition-all hover:bg-olive-400 active:scale-[0.97]"
          >
            <img src="/ai-canvas-icon-mono.svg" alt="" width={16} height={14} className="shrink-0" />
            Get MCP
          </Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-400 transition-colors hover:bg-sand-800 hover:text-sand-100">
            <GithubLogo weight="regular" size={20} />
          </a>
          <div className="mx-1 h-4 w-px bg-sand-700" />
          <a href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="X" className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-400 transition-colors hover:bg-sand-800 hover:text-sand-100">
            <XLogo weight="regular" size={20} />
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[480px] px-6 py-16 sm:px-8 sm:py-28">
        {/* Mobile breadcrumb */}
        <p className="mb-6 text-sm font-semibold md:hidden">
          <span className="text-olive-500">/Support</span>
        </p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h1 className="text-2xl font-extrabold tracking-tight text-sand-50 sm:text-3xl">
            <AnimatedHey />
          </h1>
          <p className="mt-6 text-base leading-relaxed text-sand-400">
            Thanks for stopping by. AI Canvas is free, forever. If it has saved
            you time or sparked something useful, a small tip means a lot to me
            and keeps the project growing.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {/* Ko-fi — primary (PayPal hidden until URL is ready) */}
            <a
              href="https://ko-fi.com/aicanvasme"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-olive-500 px-5 py-2.5 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400"
            >
              <KofiLogo className="shrink-0" />
              Ko-fi
            </a>
          </div>

          <p className="mt-6 text-center text-xs text-sand-600">
            Every tip goes directly to the creator.
          </p>
        </motion.div>
      </main>
    </div>
  )
}
