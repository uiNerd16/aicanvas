'use client'

// npm install framer-motion

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, type PanInfo } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Slide {
  id: number
  caption: string
  image: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Atmospheric Unsplash photos paired with each wellness theme. The `?w=600&h=750`
// query string asks Unsplash to deliver a portrait crop, keeping the 4:5 aspect
// of every card crisp at the rendered size.

const SLIDES: Slide[] = [
  {
    id: 0,
    caption: 'Alley Sentinel',
    image:
      'https://images.unsplash.com/photo-1550532422-378e93ec379c?w=600&h=750&fit=crop&auto=format',
  },
  {
    id: 1,
    caption: 'Sticker Riot',
    image:
      'https://images.unsplash.com/photo-1700222720939-60f0e91d691d?w=600&h=750&fit=crop&auto=format',
  },
  {
    id: 2,
    caption: 'Quiet Vandals',
    image:
      'https://images.unsplash.com/photo-1597355797858-35ffba85673c?w=600&h=750&fit=crop&auto=format',
  },
  {
    id: 3,
    caption: 'Soft Beast',
    image:
      'https://images.unsplash.com/photo-1612486524816-d7aaa8ac7bd6?w=600&h=750&fit=crop&auto=format',
  },
  {
    id: 4,
    caption: 'City Gaze',
    image:
      'https://images.unsplash.com/photo-1644424428722-b6f950e4b22d?w=600&h=750&fit=crop&auto=format',
  },
  {
    id: 5,
    caption: 'Loud Letters',
    image:
      'https://images.unsplash.com/photo-1581010105372-caf9ed5ab50f?w=600&h=750&fit=crop&auto=format',
  },
  {
    id: 6,
    caption: 'Color Crash',
    image:
      'https://images.unsplash.com/photo-1589236095092-1f7ea6f09cdd?w=600&h=750&fit=crop&auto=format',
  },
]

// ─── Layout constants ─────────────────────────────────────────────────────────
// A flat horizontal fan with a size gradient: the focused center card is the
// largest, and every step outward shrinks the next card. Cards share a single
// base width — the visual scale comes from Framer Motion's `scale` prop, so
// the layout math operates on the same baseline for every card. Horizontal
// positions are computed by walking outward from the center and adding half
// of each neighbour's scaled width plus a constant pixel gap, so adjacent
// cards never overlap.

const TOTAL = 7
const HALF = 3                                   // |offset| range for stagger math
const ROTATION_PER_STEP = 14 // degrees per offset step
const ARC_Y = 8              // px of vertical arc per |offset| (outer cards drop)
const GAP_PX = 30            // constant visible pixel gap between adjacent cards
const SCALE_BY_OFFSET = [1.0, 0.88, 0.76, 0.64] // index = |offset|

// Runtime transitions (drag, click, key) — snappy, no bounce.
const SPRING = { type: 'spring' as const, stiffness: 240, damping: 30 }
// Mount entrance — slightly bouncier so the focus card has a satisfying settle.
const MOUNT_SPRING = { type: 'spring' as const, stiffness: 180, damping: 18 }
const STAGGER_MS = 0.09

// Wrap-around offset so the 7-card fan always shows 3 left + 1 center + 3 right.
// Without this, cards at the start of the array would drift to offsets like -4/-5
// once focus advances and fall outside the visible fan. By looping any out-of-range
// offset by +/- TOTAL, the leftmost card re-enters from the right edge (and vice
// versa) the instant focus crosses a boundary, keeping the fan perfectly balanced.
function visibleOffset(cardIndex: number, focus: number, total: number) {
  const half = Math.floor(total / 2)
  let off = cardIndex - focus
  if (off > half) off -= total
  if (off < -half) off += total
  return off
}

function buildXPositions(scales: number[], baseWidth: number, gap: number) {
  // scales: array indexed 0..3 by |offset|, scales[0] = center
  // returns: Map<offset, translateXPx>, offset in -3..3
  const positions = new Map<number, number>()
  positions.set(0, 0)
  let cursor = 0
  for (let i = 1; i <= 3; i++) {
    // distance from previous card's center to this card's center
    const step = (scales[i - 1] / 2 + scales[i] / 2) * baseWidth + gap
    cursor += step
    positions.set(i, cursor)
    positions.set(-i, -cursor)
  }
  return positions
}

// ─── TiltedCoverflow ──────────────────────────────────────────────────────────

export default function TiltedCoverflow() {
  const [focus, setFocus] = useState(3) // start with the middle slide
  const [maxSide, setMaxSide] = useState(3)
  const [cardWidth, setCardWidth] = useState(180)
  const [mounted, setMounted] = useState(false)

  const cardRef = useRef<HTMLButtonElement | null>(null)

  // Flip on after first paint so the entrance transition runs once,
  // then every subsequent state change uses the snappy runtime spring.
  useEffect(() => {
    setMounted(true)
  }, [])

  // Collapse to 1 visible side card under 640px wide.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(min-width: 640px)')
    const apply = () => setMaxSide(mq.matches ? 3 : 1)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // Measure the rendered card width so translateX scales with viewport.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const measure = () => {
      if (cardRef.current) {
        const w = cardRef.current.getBoundingClientRect().width
        if (w > 0) setCardWidth(w)
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (cardRef.current) ro.observe(cardRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const step = useCallback((dir: 1 | -1) => {
    setFocus((current) => {
      const len = SLIDES.length
      return (current + dir + len) % len
    })
  }, [])

  // Arrow keys cycle focus.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        step(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        step(-1)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [step])

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const distance = info.offset.x
      const velocity = info.velocity.x
      if (distance < -80 || velocity < -500) {
        step(1)
      } else if (distance > 80 || velocity > 500) {
        step(-1)
      }
    },
    [step],
  )

  return (
    <div className="flex min-h-screen w-full select-none items-center justify-center overflow-hidden bg-[#E8E8DF] px-4 py-12 dark:bg-[#1A1A19]">
      <div className="relative flex w-full max-w-5xl flex-col items-center gap-8">
        <motion.div
          className="relative flex w-full items-center justify-center"
          style={{ perspective: '1400px', height: 'clamp(280px, 36vw, 380px)' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
        >
          {(() => {
            const positions = buildXPositions(SCALE_BY_OFFSET, cardWidth, GAP_PX)
            return SLIDES.map((slide) => {
            const offset = visibleOffset(slide.id, focus, TOTAL)
            const absOffset = Math.abs(offset)
            const hidden = absOffset > maxSide
            const isFocus = offset === 0

            // Size gradient + spaced fan: scale comes from |offset|, rotateY
            // tilts side cards inward, translateX is precomputed so adjacent
            // cards keep a constant pixel gap, translateY adds a gentle arc.
            const scale = SCALE_BY_OFFSET[absOffset] ?? 0.6
            const rotateY = -offset * ROTATION_PER_STEP
            const translateX = positions.get(offset) ?? 0
            const translateY = absOffset * ARC_Y

            // Stagger entrance: outermost cards land first, focus card last.
            // |offset|=3 → 0s, 2 → 0.09s, 1 → 0.18s, 0 → 0.27s. After mount,
            // every transition uses the runtime spring with no delay.
            const mountDelay = (HALF - absOffset) * STAGGER_MS
            const transition = mounted
              ? SPRING
              : { ...MOUNT_SPRING, delay: mountDelay }

            // Breathing loop: each card drifts on its own period, picture-frame
            // swing (rotateZ), small amplitude so caption text stays legible.
            const breathDuration = 7 + slide.id * 0.6

            // Caption split — word-by-word entrance only for the focused card.
            // Non-focused cards render plain spans so swiping doesn't flicker.
            const words = slide.caption.split(' ')

            return (
              <motion.button
                key={slide.id}
                ref={slide.id === 0 ? cardRef : undefined}
                type="button"
                aria-label={slide.caption}
                onClick={(event) => {
                  event.preventDefault()
                  if (!hidden && !isFocus) setFocus(slide.id)
                }}
                className="absolute aspect-[4/5] w-[clamp(160px,17vw,220px)]"
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center',
                  pointerEvents: hidden ? 'none' : 'auto',
                  cursor: isFocus ? 'grab' : 'pointer',
                  zIndex: TOTAL - absOffset,
                }}
                initial={{ opacity: 0, scale: 0.45, y: 70, x: 0, rotateY: 0 }}
                animate={{
                  x: translateX,
                  y: translateY,
                  rotateY,
                  scale,
                  opacity: hidden ? 0 : 1,
                }}
                transition={transition}
                whileTap={isFocus ? { cursor: 'grabbing' } : undefined}
              >
                {/* Middle breathing layer. Owns the visual chrome (rounded
                    corners, overflow clip, ring, shadow) so the entire card
                    moves as one unit — no interior translation that could
                    expose the outer button's background. The image and caption
                    fill this layer edge-to-edge. */}
                <motion.div
                  className="relative h-full w-full overflow-hidden rounded-[20px] ring-1 ring-black/10 dark:ring-white/10"
                  style={{
                    boxShadow: isFocus
                      ? '0 30px 60px rgba(0,0,0,0.35), 0 12px 24px rgba(0,0,0,0.18)'
                      : '0 14px 30px rgba(0,0,0,0.22), 0 4px 10px rgba(0,0,0,0.12)',
                  }}
                  animate={{
                    y: [0, -12, 0, 10, 0],
                    rotate: [0, 1.5, 0, -1.5, 0],
                  }}
                  transition={{
                    duration: breathDuration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.caption}
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {/* Caption with soft gradient fade into the photo. No border,
                      no backdrop-blur, no pill — text reads like an album-art
                      title that's been laid into the image. */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end px-4 pb-3 pt-12">
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-2/3"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.18) 70%, rgba(0,0,0,0) 100%)',
                      }}
                    />
                    <span
                      className="relative text-center leading-tight text-white font-medium"
                      style={{
                        fontSize: 'clamp(0.95rem, 1.1vw, 1.25rem)',
                        textShadow: '0 1px 8px rgba(0,0,0,0.45)',
                      }}
                    >
                      {isFocus
                        ? words.map((word, i) => (
                            <motion.span
                              key={`${focus}-${i}`}
                              className="inline-block"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: i * 0.06,
                                duration: 0.42,
                                ease: [0.2, 0.65, 0.3, 1],
                              }}
                            >
                              {word}
                              {i < words.length - 1 ? ' ' : ''}
                            </motion.span>
                          ))
                        : words.map((word, i) => (
                            <span key={i} className="inline-block">
                              {word}
                              {i < words.length - 1 ? ' ' : ''}
                            </span>
                          ))}
                    </span>
                  </div>
                </motion.div>
              </motion.button>
            )
          })
          })()}
        </motion.div>

        {/* Dot indicator + hint */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5">
            {SLIDES.map((slide) => {
              const isCurrent = focus === slide.id
              return (
                <motion.button
                  key={slide.id}
                  type="button"
                  aria-label={`Focus ${slide.caption}`}
                  onClick={() => setFocus(slide.id)}
                  animate={{
                    width: isCurrent ? 22 : 6,
                    opacity: isCurrent ? 1 : 0.35,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="h-1.5 rounded-full bg-[#21211F] dark:bg-[#FAFAF0]"
                />
              )
            })}
          </div>
          <p className="text-xs tracking-wide text-[#666662] dark:text-[#9E9E98]">
            drag, click, or use the arrow keys
          </p>
        </div>
      </div>
    </div>
  )
}
