'use client'

// npm install framer-motion
// font: Manrope (loaded via Google Fonts @import inside the component)

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Manrope, loaded via @import in the root <style> below so the headline renders in
// Manrope even when copy-pasted standalone; falls back to the host sans stack.
const HEADLINE_FONT = "'Manrope', var(--font-sans, sans-serif)"

const WORDS = ['Craft', 'interfaces', 'that', 'feel', 'like', 'magic.']
const ACCENTED = new Set([1, 5]) // "interfaces", "magic."

// Timing constants (ms)
const STAGGER = 100
const DURATION = 650
const LAST_WORD_END = (WORDS.length - 1) * STAGGER + DURATION // 1150 ms
const SHOW_BUTTON_AT = LAST_WORD_END + 150                     // 1300 ms

export default function TextBlurReveal() {
  const [showCTA, setShowCTA] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowCTA(true), SHOW_BUTTON_AT)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden">

      {/* Self-contained headline font — loaded inside the component so it survives copy-paste */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Dot grid — two layers toggled by theme so dots stay visible on light and dark */}
      <div
        className="pointer-events-none absolute inset-0 opacity-100 dark:opacity-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
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
            key={i}
            initial={{ opacity: 0, y: 22, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: DURATION / 1000,
              delay: (i * STAGGER) / 1000,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className={
              ACCENTED.has(i)
                ? 'bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-4xl tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400'
                : 'text-4xl tracking-tight text-zinc-900 dark:text-white'
            }
            style={{ fontFamily: HEADLINE_FONT }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Subtext */}
      <motion.p
        key="sub"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.55,
          delay: ((WORDS.length - 1) * STAGGER + 200) / 1000,
          ease: 'easeOut',
        }}
        className="relative text-base text-zinc-500 dark:text-zinc-400"
      >
        Drop any phrase. Works with any text.
      </motion.p>

      {/* Fixed-height CTA slot — prevents layout shift when button appears */}
      <div className="flex h-10 items-center justify-center">
      <AnimatePresence>
        {showCTA && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="relative rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-opacity hover:opacity-90"
          >
            Start building
          </motion.button>
        )}
      </AnimatePresence>
      </div>

    </div>
  )
}
