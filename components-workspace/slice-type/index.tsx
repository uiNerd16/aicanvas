'use client'

// npm install framer-motion react

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import type { MotionValue } from 'framer-motion'

// The component is always in NIGHT mode at rest — dark bg, light text.
// On hover it inverts to LIGHT mode in sync with the word reveal.
const DARK_BG = '#0A0A0A'
const LIGHT_BG = '#EFEEE6'
const DARK_FG = '#EFEEE6'
const LIGHT_FG = '#0A0A0A'

// Measures how many pixels of "air" (side-bearing) sit between a character's
// advance-width origin and its leftmost ink pixel by rasterising to a canvas.
// Returns a positive number when the ink starts after the origin (normal LSB),
// 0 on any error. Re-runs on resize so it adapts to font-size changes.
function measureLeftInk(char: string, font: string): number {
  try {
    const W = 200, H = 200
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    if (!ctx) return 0
    ctx.font = font
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#000'
    ctx.fillText(char, 50, 150) // start drawing at x=50
    const { data } = ctx.getImageData(0, 0, W, H)
    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) {
        if (data[(y * W + x) * 4 + 3] > 32) return x - 50
      }
    }
    return 0
  } catch {
    return 0
  }
}

function mix(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ar = (pa >> 16) & 0xff; const ag = (pa >> 8) & 0xff; const ab = pa & 0xff
  const br = (pb >> 16) & 0xff; const bg = (pb >> 8) & 0xff; const bb = pb & 0xff
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, '0')}`
}

// Two words that share a trailing skeleton — when clipped at the midline
// and overlaid, the shared letters align and only the leading glyph forms
// a hybrid. Swap these to make any other pair work.
const WORD_TOP = 'LIGHT'
const WORD_BOTTOM = 'NIGHT'

// How far the two words translate apart when fully open, as a fraction of
// their own height. 0.65 gives a visible gap between them.
const OPEN_OFFSET = 0.65

// Intro teaser — plays once on mount to show users what's possible.
const INTRO_DELAY_MS = 700
const INTRO_HOLD_MS = 1100
const INTRO_PEAK = 0.7
const INTRO_DURATION_S = 0.9

export default function SliceType() {
  const rootRef = useRef<HTMLDivElement>(null)

  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Engagement: 0 = aligned hybrid (rest), 1 = words fully separated.
  const engage = useMotionValue(0)
  const engageSmooth = useSpring(engage, { stiffness: 140, damping: 18, mass: 0.9 })

  // Background and text color invert in sync with the reveal:
  // engage=0 → NIGHT (dark bg, light text), engage=1 → LIGHT (light bg, dark text).
  const bgColor = useTransform(engageSmooth, (e) => mix(DARK_BG, LIGHT_BG, e))
  const fgColor = useTransform(engageSmooth, (e) => mix(DARK_FG, LIGHT_FG, e))

  // Top word clip + vertical shift.
  const topClip = useTransform(engageSmooth, (e) =>
    `inset(0 0 ${50 * (1 - e)}% 0)`,
  )
  const topY = useTransform(engageSmooth, (e) => `${-OPEN_OFFSET * 100 * e}%`)

  // Bottom word — mirror.
  const botClip = useTransform(engageSmooth, (e) =>
    `inset(${50 * (1 - e)}% 0 0 0)`,
  )
  const botY = useTransform(engageSmooth, (e) => `${OPEN_OFFSET * 100 * e}%`)

  // L lives in its own absolutely-positioned wrapper pinned to the container's
  // LEFT edge. IGHT lives in its own wrapper pinned to the RIGHT edge. At rest,
  // the space between them is real layout space — L starts at the same x as
  // NIGHT's N, producing a single continuous vertical stroke across the seam.
  // When the hybrid opens, the L translates right to its natural position so
  // the top word reads "LIGHT" cleanly.
  const containerRef = useRef<HTMLDivElement>(null)
  const lRef = useRef<HTMLSpanElement>(null)
  const ightRef = useRef<HTMLSpanElement>(null)

  // Measured distance (px) from the container's left edge to where L sits
  // when the word is fully open (touching IGHT) and the alignment nudge that
  // corrects for the side-bearing difference between N and L.
  const naturalLeftMV: MotionValue<number> = useMotionValue(0)
  const nudgeMV: MotionValue<number> = useMotionValue(0)

  useLayoutEffect(() => {
    const container = containerRef.current
    const lEl = lRef.current
    const ightEl = ightRef.current
    if (!container || !lEl || !ightEl) return
    const measure = () => {
      const cRect = container.getBoundingClientRect()
      const lRect = lEl.getBoundingClientRect()
      const iRect = ightEl.getBoundingClientRect()

      naturalLeftMV.set(Math.max(0, iRect.left - cRect.left - lRect.width))

      // Measure the ink-level left edge for L and N at the current font so the
      // nudge is accurate on every screen size and device (desktop vs mobile
      // render at different sizes, giving different side-bearing differences).
      const computed = window.getComputedStyle(lEl)
      const font = `900 ${computed.fontSize} ${computed.fontFamily}`
      const lInk = measureLeftInk('L', font)
      const nInk = measureLeftInk('N', font)
      // Both characters start at x=0 of the container. To make L's ink land on
      // N's ink, translate L by (nInk − lInk).
      nudgeMV.set(nInk - lInk)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
  }, [naturalLeftMV, nudgeMV])

  // At rest, L sits at nudgeMV so its vertical stroke aligns with N's ink.
  // At full open, L reaches naturalLeftMV so it snaps next to IGHT.
  const lX = useTransform(
    [engageSmooth, naturalLeftMV, nudgeMV],
    ([e, natural, nudge]) => {
      const eN = e as number
      return `${(nudge as number) * (1 - eN) + (natural as number) * eN}px`
    },
  )

  // Intro teaser on first mount — self-demonstrates the interaction.
  const didIntro = useRef(false)
  useEffect(() => {
    if (didIntro.current) return
    if (reducedMotion) {
      didIntro.current = true
      return
    }
    didIntro.current = true
    let cancelled = false
    let closeTimer: ReturnType<typeof setTimeout> | null = null

    const startTimer = setTimeout(async () => {
      if (cancelled) return
      const opener = animate(engage, INTRO_PEAK, {
        duration: INTRO_DURATION_S,
        ease: [0.22, 1, 0.36, 1],
      })
      try {
        await opener
      } catch {
        /* animation cancelled */
      }
      if (cancelled) return
      closeTimer = setTimeout(() => {
        if (cancelled) return
        animate(engage, 0, {
          duration: INTRO_DURATION_S,
          ease: [0.32, 0, 0.36, 1],
        })
      }, INTRO_HOLD_MS)
    }, INTRO_DELAY_MS)

    const cancel = () => {
      cancelled = true
      clearTimeout(startTimer)
      if (closeTimer) clearTimeout(closeTimer)
    }
    cancelTeaserRef.current = cancel
    return cancel
  }, [engage, reducedMotion])

  // Touch state — tap once to open, tap again to close.
  const touchOpenRef = useRef(false)

  // Cancel the intro teaser the moment the user first interacts, so their
  // deliberate tap/hover isn't overridden by the teaser's return animation.
  const cancelTeaserRef = useRef<(() => void) | null>(null)

  const cancelTeaser = () => {
    cancelTeaserRef.current?.()
    cancelTeaserRef.current = null
  }

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    cancelTeaser()
    engage.set(1)
  }
  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    // Only close if touch hasn't toggled the component open.
    engage.set(0)
  }
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return
    // Touch / pen: tap toggles the open state.
    cancelTeaser()
    touchOpenRef.current = !touchOpenRef.current
    engage.set(touchOpenRef.current ? 1 : 0)
  }

  const sharedTextStyle: React.CSSProperties = {
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    fontWeight: 900,
    fontSize: 'clamp(3.5rem, 18vw, 11rem)',
    lineHeight: 0.92,
    letterSpacing: '-0.04em',
    color: 'inherit',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  }

  // The IGHT tail — its characters are identical between LIGHT and NIGHT so
  // they align automatically when both are right-anchored.
  const TAIL = WORD_TOP.slice(1)

  return (
    <motion.div
      ref={rootRef}
      className="flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: bgColor, color: fgColor, touchAction: 'manipulation', cursor: 'pointer' }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
    >
      <div
        ref={containerRef}
        className="relative"
        aria-label={`${WORD_TOP} / ${WORD_BOTTOM}`}
      >
        {/* Spacer — sizes the container to the wider word (NIGHT). */}
        <span aria-hidden style={{ ...sharedTextStyle, visibility: 'hidden' }}>
          {WORD_BOTTOM}
        </span>

        {/* Top word wrapper — carries the clip-path + vertical lift. */}
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: topClip,
            WebkitClipPath: topClip,
            y: topY,
            willChange: 'transform, clip-path',
          }}
        >
          {/* L — pinned left at rest, translates right on engage. */}
          <motion.span
            ref={lRef}
            style={{
              ...sharedTextStyle,
              position: 'absolute',
              top: 0,
              left: 0,
              x: lX,
              willChange: 'transform',
            }}
          >
            {WORD_TOP.charAt(0)}
          </motion.span>

          {/* IGHT — pinned right, matches NIGHT's IGHT exactly. */}
          <span
            ref={ightRef}
            style={{
              ...sharedTextStyle,
              position: 'absolute',
              top: 0,
              right: 0,
            }}
          >
            {TAIL}
          </span>
        </motion.div>

        {/* Bottom word: NIGHT, right-aligned, clipped to its lower half. */}
        <motion.span
          aria-hidden
          style={{
            ...sharedTextStyle,
            position: 'absolute',
            inset: 0,
            textAlign: 'right',
            clipPath: botClip,
            WebkitClipPath: botClip,
            y: botY,
            willChange: 'transform, clip-path',
          }}
        >
          {WORD_BOTTOM}
        </motion.span>
      </div>
    </motion.div>
  )
}
