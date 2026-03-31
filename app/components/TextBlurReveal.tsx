'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WORDS = ['Craft', 'interfaces', 'that', 'feel', 'like', 'magic.']
const ACCENTED = new Set([1, 5]) // "interfaces", "magic."

// Timing constants (ms)
const STAGGER = 100
const DURATION = 650
const LAST_WORD_END = (WORDS.length - 1) * STAGGER + DURATION // 1150 ms
const SHOW_BUTTON_AT = LAST_WORD_END + 350                     // 1500 ms
const AUTO_REPLAY_AT = LAST_WORD_END + 2500                    // 3650 ms

export function TextBlurReveal() {
  const [cycle, setCycle] = useState(0)
  const [showReplay, setShowReplay] = useState(false)

  useEffect(() => {
    setShowReplay(false)
    const t1 = setTimeout(() => setShowReplay(true), SHOW_BUTTON_AT)
    const t2 = setTimeout(() => setCycle((c) => c + 1), AUTO_REPLAY_AT)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [cycle])

  function replay() {
    setShowReplay(false)
    setCycle((c) => c + 1)
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden">

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Indigo glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-40 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      {/* Animated words */}
      <div className="relative flex flex-wrap justify-center gap-x-[0.4em] gap-y-1">
        {WORDS.map((word, i) => (
          <motion.span
            key={`${cycle}-${i}`}
            initial={{ opacity: 0, y: 22, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: DURATION / 1000,
              delay: (i * STAGGER) / 1000,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className={
              ACCENTED.has(i)
                ? 'bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent'
                : 'text-4xl font-bold tracking-tight text-white'
            }
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Subtext */}
      <motion.p
        key={`sub-${cycle}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.55,
          delay: ((WORDS.length - 1) * STAGGER + 200) / 1000,
          ease: 'easeOut',
        }}
        className="relative text-sm text-zinc-500"
      >
        Drop any phrase. Works with any text.
      </motion.p>

      {/* Replay button */}
      <AnimatePresence>
        {showReplay && (
          <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
            onClick={replay}
            className="relative flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/70 px-3.5 py-1.5 text-xs text-zinc-400 backdrop-blur-sm transition-colors hover:border-zinc-500 hover:text-zinc-200"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Replay
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  )
}
