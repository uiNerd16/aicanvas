'use client'

// npm install framer-motion

import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { motion, useAnimation } from 'framer-motion'

function useTheme(ref: RefObject<HTMLElement | null>): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  useEffect(() => {
    if (typeof document === 'undefined') return
    const el = ref.current
    const update = () => {
      const card = el?.closest('[data-card-theme]') ?? null
      const dark = card
        ? card.classList.contains('dark')
        : document.documentElement.classList.contains('dark')
      setTheme(dark ? 'dark' : 'light')
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el?.closest('[data-card-theme]')
    if (cardWrapper) observer.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [ref])
  return theme
}

// ─── Card data ────────────────────────────────────────────────────────────────
const CARDS = [
  { front: 'Later',      back: 'Start now',      bg: '#E8445A', text: '#FFE8EC' },
  { front: 'Too busy',   back: 'Make the time',  bg: '#FF8C42', text: '#FFF3EC' },
  { front: 'Not ready',  back: 'No one ever is', bg: '#F5C842', text: '#2A2000' },
  { front: 'Too hard',   back: 'So is regret',   bg: '#3ABFBF', text: '#E8FFFF' },
  { front: 'Tomorrow',   back: 'Today counts',   bg: '#5B6FE8', text: '#EEF0FF' },
  { front: "Can't",      back: "Haven't yet",    bg: '#A855B5', text: '#F8EEFF' },
]

// Flip axis config per row (index 0,1 = row1; 2,3 = row2; 4,5 = row3)
function getFlipAxis(index: number): { rotateX?: number[]; rotateY?: number[] } {
  const row = Math.floor(index / 2)
  if (row === 0) return { rotateX: [0, 180] }       // row 1: tip forward
  if (row === 1) return { rotateY: [0, 180] }       // row 2: turn left
  return { rotateX: [0, -180] }                     // row 3: tip backward
}

// ─── Single card ─────────────────────────────────────────────────────────────
function FlipCard({
  card,
  index,
  isDark,
}: {
  card: (typeof CARDS)[number]
  index: number
  isDark: boolean
}) {
  const controls = useAnimation()
  const flippedRef = useRef(false)     // current face: false=front, true=back
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const heldRef = useRef(false)
  const [held, setHeld] = useState(false)

  // Each card has its own stagger offset so the wave reads clearly
  const FLIP_INTERVAL = 2800  // ms between flips
  const STAGGER_OFFSET = index * 320  // ms

  const axisProps = getFlipAxis(index)

  function getBackRotation() {
    if (axisProps.rotateX) return { rotateX: 180 }
    return { rotateY: 180 }
  }
  function getFrontRotation() {
    if (axisProps.rotateX) return { rotateX: 0 }
    return { rotateY: 0 }
  }
  function getBackFaceRotation(): React.CSSProperties {
    if (axisProps.rotateX) return { transform: 'rotateX(180deg)' }
    return { transform: 'rotateY(180deg)' }
  }

  function startLoop() {
    intervalRef.current = setInterval(() => {
      if (heldRef.current) return
      flippedRef.current = !flippedRef.current
      controls.start({
        ...(flippedRef.current ? getBackRotation() : getFrontRotation()),
        transition: { type: 'spring', stiffness: 60, damping: 14 },
      })
    }, FLIP_INTERVAL)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      startLoop()
    }, STAGGER_OFFSET)
    return () => {
      clearTimeout(timer)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleHoverStart() {
    heldRef.current = true
    setHeld(true)
    // Snap to back face
    controls.start({
      ...getBackRotation(),
      transition: { type: 'spring', stiffness: 120, damping: 18 },
    })
  }

  function handleHoverEnd() {
    heldRef.current = false
    setHeld(false)
    // Return to whatever face the loop is on
    controls.start({
      ...(flippedRef.current ? getBackRotation() : getFrontRotation()),
      transition: { type: 'spring', stiffness: 80, damping: 16 },
    })
  }

  // Touch: tap to hold / release
  function handleTap() {
    if (heldRef.current) {
      handleHoverEnd()
    } else {
      handleHoverStart()
    }
  }

  const shadowColor = isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.18)'

  return (
    <motion.div
      animate={controls}
      initial={axisProps.rotateX ? { rotateX: 0 } : { rotateY: 0 }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onTap={handleTap}
      style={{
        width: '100%',
        aspectRatio: '1 / 1.1',
        transformStyle: 'preserve-3d',
        cursor: 'pointer',
        position: 'relative',
        filter: `drop-shadow(0 6px 18px ${shadowColor})`,
        willChange: 'transform',
      }}
    >
      {/* Front face */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 20,
          background: card.bg,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 16px',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            color: card.text,
            fontSize: 'clamp(18px, 4.5vw, 28px)',
            fontWeight: 800,
            lineHeight: 1.1,
            textAlign: 'center',
            letterSpacing: '-0.03em',
            opacity: held ? 0.4 : 1,
            transition: 'opacity 0.2s',
            fontFamily: 'sans-serif',
          }}
        >
          {card.front}
        </span>
      </div>

      {/* Back face */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 20,
          background: card.bg,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          ...getBackFaceRotation(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 16px',
          overflow: 'hidden',
        }}
      >
        {/* Slight brightness boost on back face so the reframe pops */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            background: 'rgba(255,255,255,0.12)',
          }}
        />
        <span
          style={{
            color: card.text,
            fontSize: 'clamp(14px, 3.8vw, 22px)',
            fontWeight: 800,
            lineHeight: 1.15,
            textAlign: 'center',
            letterSpacing: '-0.03em',
            position: 'relative',
            fontFamily: 'sans-serif',
          }}
        >
          {card.back}
        </span>
      </div>
    </motion.div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function FlipGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const theme = useTheme(containerRef)
  const isDark = theme === 'dark'

  const bg = isDark ? '#111110' : '#DEDDD4'
  const labelColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)'

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen w-full items-center justify-center"
      style={{ background: bg }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
          padding: '40px 24px',
          width: '100%',
          maxWidth: 520,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              color: labelColor,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontFamily: 'sans-serif',
              marginBottom: 6,
            }}
          >
            Excuses to push
          </p>
          <h2
            style={{
              color: isDark ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.82)',
              fontSize: 'clamp(20px, 5vw, 28px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              fontFamily: 'sans-serif',
            }}
          >
            Flip Grid
          </h2>
        </div>

        {/* 3 × 2 card grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 16,
            width: '100%',
            perspective: 900,
          }}
        >
          {CARDS.map((card, i) => (
            <FlipCard key={i} card={card} index={i} isDark={isDark} />
          ))}
        </div>

        {/* Footer hint */}
        <p
          style={{
            color: labelColor,
            fontSize: 12,
            fontFamily: 'sans-serif',
            letterSpacing: '0.02em',
          }}
        >
          Hover a card to hold the reframe
        </p>
      </div>
    </div>
  )
}
