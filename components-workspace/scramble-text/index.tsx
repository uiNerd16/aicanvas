'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Geist_Mono } from 'next/font/google'
const geistMono = Geist_Mono({ subsets: ['latin'], weight: ['500'] })

// ─── ScrambleText ──────────────────────────────────────────────────────────────
// Idle: all characters continuously scramble (olive random chars) in a loop.
// Hover: characters decrypt one by one, left to right, revealing the real word.
// Mouse leave: immediately back to scrambled loop.

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!'
const TARGET_TEXT = 'ENCRYPTED'

function randomChar(): string {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)] ?? 'X'
}

interface CharState {
  display: string
  resolved: boolean
}

const SCRAMBLED = (): CharState[] =>
  TARGET_TEXT.split('').map(() => ({ display: randomChar(), resolved: false }))


export function ScrambleText() {
  const [chars, setChars] = useState<CharState[]>(SCRAMBLED)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let cancelled = false
    const timeouts: ReturnType<typeof setTimeout>[] = []
    let scrambleInterval: ReturnType<typeof setInterval> | null = null

    function startScrambleInterval(resolvedSet: Set<number>) {
      if (scrambleInterval) clearInterval(scrambleInterval)
      scrambleInterval = setInterval(() => {
        if (cancelled) return
        setChars((prev) =>
          prev.map((ch, i) =>
            resolvedSet.has(i) ? ch : { display: randomChar(), resolved: false }
          )
        )
      }, 60)
    }

    if (isHovered) {
      const resolvedSet = new Set<number>()
      startScrambleInterval(resolvedSet)

      TARGET_TEXT.split('').forEach((letter, i) => {
        const t = setTimeout(() => {
          if (cancelled) return
          resolvedSet.add(i)
          setChars((prev) =>
            prev.map((ch, idx) => (idx === i ? { display: letter, resolved: true } : ch))
          )
          if (resolvedSet.size === TARGET_TEXT.length && scrambleInterval) {
            clearInterval(scrambleInterval)
            scrambleInterval = null
          }
        }, 80 + i * 100)
        timeouts.push(t)
      })
    } else {
      setChars(SCRAMBLED())
      startScrambleInterval(new Set<number>())
    }

    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
      if (scrambleInterval) clearInterval(scrambleInterval)
    }
  }, [isHovered])

  return (
    <div
      className="flex h-full w-full cursor-default items-center justify-center bg-sand-100 dark:bg-sand-950"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex select-none flex-col items-center gap-6">
        {/* Character row */}
        <div className={`flex items-center gap-1 ${geistMono.className}`}>
          {chars.map((ch, i) => (
            <span
              key={i}
              className={[
                'text-5xl font-medium leading-none tracking-widest transition-colors duration-100',
                ch.resolved
                  ? 'text-sand-900 dark:text-sand-50'
                  : 'text-olive-500 dark:text-olive-400',
              ].join(' ')}
            >
              {ch.display}
            </span>
          ))}
        </div>

        {/* Hint — always visible */}
        <motion.p
          className={`text-xs font-medium uppercase tracking-[0.2em] text-sand-400 dark:text-sand-600 ${geistMono.className}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.8 }}
        >
          hover to decrypt
        </motion.p>
      </div>
    </div>
  )
}