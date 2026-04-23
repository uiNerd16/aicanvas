'use client'

// npm install framer-motion react next
// font: Science Gothic

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Science_Gothic } from 'next/font/google'

const scienceGothic = Science_Gothic({ subsets: ['latin'] })

// ─── LetterSpan Component ─────────────────────────────────────────────────────
// Reads CSS --italic variable and applies fontStyle dynamically
interface LetterSpanProps {
  letter: string
  textColor: string
  fontFamily: string
  forwardedRef: React.Ref<HTMLSpanElement>
}

const LetterSpanComponent = ({ letter, textColor, fontFamily, forwardedRef }: LetterSpanProps) => {
  const [fontStyle, setFontStyle] = useState<'italic' | 'normal'>('italic')
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = spanRef.current
    if (!element) return

    const updateStyle = () => {
      const italicVar = getComputedStyle(element).getPropertyValue('--italic')
      const italicValue = parseFloat(italicVar) || 1
      // When italicValue > 0.5, use italic; otherwise normal
      setFontStyle(italicValue > 0.5 ? 'italic' : 'normal')
    }

    // Check on initial render
    updateStyle()

    // Use a MutationObserver to watch for CSS variable changes
    const observer = new MutationObserver(updateStyle)
    observer.observe(element, { attributes: true, attributeFilter: ['style'] })

    // Also poll periodically in case observer misses updates
    const interval = setInterval(updateStyle, 16) // ~60fps

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  // Forward ref to parent
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
        fontSize: 'clamp(4rem, 12vw, 7rem)',
        fontWeight: 'var(--font-weight, 100)',
        fontStretch: 'var(--font-stretch, 100%)',
        fontFamily,
        fontStyle,
        lineHeight: 1,
        letterSpacing: 'var(--letter-spacing, 0.15em)',
        wordSpacing: '0.8em',
        transform: `skewY(var(--skew, 0)deg)`,
      }}
    >
      {letter}
    </span>
  )
}

const LetterSpan = motion(LetterSpanComponent)

// ─── Configuration ────────────────────────────────────────────────────────────
const TEXT = 'WHAT ?!'
const INFLUENCE_RADIUS = 300  // px — distance from cursor that affects letters
const MAX_WEIGHT = 900        // max font-weight
const MIN_WEIGHT = 100        // min font-weight (Manrope thin)
const MAX_STRETCH = 200       // max font-stretch percentage
const MIN_STRETCH = 100       // min font-stretch percentage (avoid collapse)
const MAX_LETTER_SPACING = 0.4 // expanded letter spacing at max influence
const MIN_LETTER_SPACING = 0 // default letter spacing (letters touching, no gap)
const MAX_SKEW = 18           // max skew angle (degrees) — ±18° for satisfying deformation
const MIN_SKEW = 0            // no skew when cursor is far
const EASE_DURATION = 0.3     // seconds to ease back to default

export default function ResponsiveLetters() {
  const [isDark, setIsDark] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const animIdRef = useRef<number>(0)
  const aliveRef = useRef(true)

  // Custom theme detection: checks parent container's data-card-theme attribute
  // (for ComponentPageView) or falls back to document.documentElement.classList
  useEffect(() => {
    function detectTheme(): boolean {
      // First, check if parent container has data-card-theme attribute
      let element: HTMLElement | null = containerRef.current
      while (element) {
        const cardTheme = element.getAttribute('data-card-theme')
        if (cardTheme) {
          return cardTheme === 'dark'
        }
        element = element.parentElement
      }

      // Fallback: check document.documentElement for dark class
      return document.documentElement.classList.contains('dark')
    }

    // Initial theme detection
    setIsDark(detectTheme())

    // Watch for changes to parent container's data-card-theme attribute
    const observer = new MutationObserver(() => {
      setIsDark(detectTheme())
    })

    // Observe the container and its ancestors for attribute changes
    let element: HTMLElement | null = containerRef.current
    while (element) {
      observer.observe(element, { attributes: true, attributeFilter: ['data-card-theme', 'class'] })
      element = element.parentElement
    }

    // Also watch the document.documentElement as fallback
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  // Track exit animation state per letter
  const exitStateRef = useRef<Array<{
    weight: number
    stretch: number
    letterSpacing: number
    skew: number
    italic: number
  }>>([])

  // Animation loop — calculate per-letter influence and update styles
  useEffect(() => {
    aliveRef.current = true
    const container = containerRef.current
    if (!container) return

    // Initialize exit state for all letters
    TEXT.split('').forEach((_, i) => {
      if (!exitStateRef.current[i]) {
        exitStateRef.current[i] = {
          weight: MIN_WEIGHT,
          stretch: MIN_STRETCH,
          letterSpacing: MIN_LETTER_SPACING,
          skew: 0,
          italic: 1,
        }
      }
    })

    // Spring constants for exit animation (slow, elastic)
    const exitSpring = { type: 'spring', damping: 6, stiffness: 35 }

    function animate() {
      if (!aliveRef.current) return

      const mx = mouseRef.current?.x ?? -99999
      const my = mouseRef.current?.y ?? -99999
      const isExiting = !mouseRef.current // cursor has left

      TEXT.split('').forEach((_, i) => {
        const letterEl = lettersRef.current[i]
        if (!letterEl) return

        const rect = letterEl.getBoundingClientRect()
        const letterCenterX = rect.left + rect.width / 2
        const letterCenterY = rect.top + rect.height / 2

        // Distance from cursor to letter center
        const dx = letterCenterX - mx
        const dy = letterCenterY - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Graduated influence curve with smooth falloff
        let influence = 0
        if (dist < INFLUENCE_RADIUS) {
          // Linear falloff from 1 to 0 across the radius
          influence = 1 - dist / INFLUENCE_RADIUS
          // Apply smoothstep for smooth gradient without hard cutoffs
          influence = influence * influence * (3 - 2 * influence)
        }

        // Calculate target values
        const targetWeight = MIN_WEIGHT + (MAX_WEIGHT - MIN_WEIGHT) * influence
        const targetStretch = MIN_STRETCH + (MAX_STRETCH - MIN_STRETCH) * influence
        const targetLetterSpacing = MIN_LETTER_SPACING + (MAX_LETTER_SPACING - MIN_LETTER_SPACING) * influence

        // Italic animation: inverse of influence
        // When influence = 0 (cursor far): italic = 1 (italic on)
        // When influence = 1 (cursor close): italic = 0 (italic off / normal)
        const italicValue = 1 - influence

        // Calculate skew angle based on cursor direction
        // Skew direction varies per letter to create varied deformation effect
        let targetSkew = 0
        if (influence > 0) {
          // Use the angle from cursor to letter to determine skew direction
          const angle = Math.atan2(dy, dx)
          // Map angle to skew: positive when above/right, negative when below/left
          const skewDirection = Math.sin(angle)
          targetSkew = (MAX_SKEW - MIN_SKEW) * influence * skewDirection
        }

        // Get current exit state
        const state = exitStateRef.current[i]

        // Apply spring physics for smooth, elastic exit animation
        // Use different spring constants based on whether cursor is active
        const spring = isExiting ? exitSpring : { type: 'spring', damping: 10, stiffness: 160 }
        const easing = isExiting ? 0.05 : 0.15 // slower easing for exit to feel stretchy

        state.weight += (targetWeight - state.weight) * easing
        state.stretch += (targetStretch - state.stretch) * easing
        state.letterSpacing += (targetLetterSpacing - state.letterSpacing) * easing
        state.skew += (targetSkew - state.skew) * easing
        state.italic += (italicValue - state.italic) * easing

        // Update CSS custom properties for font variation
        letterEl.style.setProperty('--font-weight', Math.round(state.weight).toString())
        letterEl.style.setProperty('--font-stretch', `${state.stretch.toFixed(1)}%`)
        letterEl.style.setProperty('--letter-spacing', `${state.letterSpacing.toFixed(3)}em`)
        letterEl.style.setProperty('--skew', `${state.skew.toFixed(1)}`)
        letterEl.style.setProperty('--italic', state.italic.toFixed(3))
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

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    const touch = e.touches[0]
    if (touch) mouseRef.current = { x: touch.clientX, y: touch.clientY }
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    const touch = e.touches[0]
    if (touch) mouseRef.current = { x: touch.clientX, y: touch.clientY }
  }

  function handleTouchEnd() {
    setTimeout(() => {
      mouseRef.current = null
    }, 600)
  }

  // Theme-aware colors
  const bgColor = isDark ? '#0d001a' : '#40FFA7'
  const textColor = isDark ? 'text-[#40FFA7]' : 'text-[#0d001a]'

  return (
    <div
      ref={containerRef}
      className={`flex min-h-screen w-full flex-col items-center justify-center gap-8 px-6 sm:px-10 ${scienceGothic.className}`}
      style={{ backgroundColor: bgColor }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main interactive text */}
      <div className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-1">
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
