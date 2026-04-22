'use client'

// npm install framer-motion

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Science_Gothic } from 'next/font/google'
import { useTheme } from '../../app/components/ThemeProvider'

const scienceGothic = Science_Gothic({ subsets: ['latin'] })

interface LetterSpanProps {
  letter: string
  textColor: string
  fontFamily: string
  forwardedRef: React.Ref<HTMLSpanElement>
}

const LetterSpanComponent = ({ letter, textColor, fontFamily, forwardedRef }: LetterSpanProps) => {
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (forwardedRef) {
      if (typeof forwardedRef === 'function') {
        forwardedRef(spanRef.current)
      } else {
        forwardedRef.current = spanRef.current
      }
    }
  }, [forwardedRef])

  return (
    <span
      ref={spanRef}
      className={`inline-block select-none ${textColor}`}
      style={{
        fontSize: 'clamp(3rem, 10vw, 8rem)',
        fontWeight: 'var(--font-weight, 900)',
        fontFamily,
        lineHeight: 1,
        transform: 'scale(var(--scale, 1))',
        transformOrigin: 'center',
      }}
    >
      {letter}
    </span>
  )
}

const LetterSpan = motion(LetterSpanComponent)

// Configuration
const TEXT = 'GOOD VIBES'
const INFLUENCE_RADIUS = 300
const MAX_WEIGHT = 900
const MIN_WEIGHT = 100
const MAX_SCALE = 2
const MIN_SCALE = 1
const EASE_DURATION = 0.15

export default function GoodVibes() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const containerRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const animIdRef = useRef<number>(0)
  const aliveRef = useRef(true)

  const stateRef = useRef<
    Array<{
      weight: number
      scale: number
    }>
  >([])

  useEffect(() => {
    aliveRef.current = true
    const container = containerRef.current
    if (!container) return

    TEXT.split('').forEach((_, i) => {
      if (!stateRef.current[i]) {
        stateRef.current[i] = {
          weight: MAX_WEIGHT,
          scale: MIN_SCALE,
        }
      }
    })

    function animate() {
      if (!aliveRef.current) return

      const mx = mouseRef.current?.x ?? -99999
      const my = mouseRef.current?.y ?? -99999
      const isExiting = !mouseRef.current

      TEXT.split('').forEach((_, i) => {
        const letterEl = lettersRef.current[i]
        if (!letterEl) return

        const rect = letterEl.getBoundingClientRect()
        const letterCenterX = rect.left + rect.width / 2
        const letterCenterY = rect.top + rect.height / 2

        const dx = letterCenterX - mx
        const dy = letterCenterY - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        let influence = 0
        if (dist < INFLUENCE_RADIUS) {
          influence = 1 - dist / INFLUENCE_RADIUS
          influence = influence * influence * (3 - 2 * influence)
        }

        // Inverse: as influence increases, weight DECREASES (900 → 100)
        const targetWeight = MAX_WEIGHT - (MAX_WEIGHT - MIN_WEIGHT) * influence
        const targetScale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * influence

        const state = stateRef.current[i]
        const easing = isExiting ? 0.05 : EASE_DURATION

        state.weight += (targetWeight - state.weight) * easing
        state.scale += (targetScale - state.scale) * easing

        letterEl.style.setProperty('--font-weight', Math.round(state.weight).toString())
        letterEl.style.setProperty('--scale', state.scale.toFixed(3))
      })

      animIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      aliveRef.current = false
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current)
    }
  }, [])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    mouseRef.current = { x: e.clientX, y: e.clientY }
  }

  function handleMouseLeave() {
    mouseRef.current = null
  }

  const bgColor = isDark ? '#1a2332' : '#f0f0f0'
  const textColor = isDark ? 'text-[#ff9b4d]' : 'text-[#2c3e50]'

  return (
    <div
      ref={containerRef}
      className={`flex min-h-screen w-full flex-col items-center justify-center gap-8 px-6 sm:px-10 ${scienceGothic.className}`}
      style={{ backgroundColor: bgColor }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {TEXT.split('').map((letter, i) => (
          <LetterSpan
            key={i}
            letter={letter}
            forwardedRef={(el) => {
              if (el) lettersRef.current[i] = el
            }}
            textColor={textColor}
            fontFamily={scienceGothic.style.fontFamily}
          />
        ))}
      </div>
    </div>
  )
}
