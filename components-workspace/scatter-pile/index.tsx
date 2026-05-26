'use client'

// npm install framer-motion

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, type PanInfo } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Card {
  id: number
  orientation: 'portrait' | 'landscape'
  title?: string
  image: string
}

interface Slot {
  x: number
  y: number
  rotate: number
  scale: number
  zIndex: number
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Five curated Unsplash photos. Portrait cards carry an editorial title strip
// that sits ABOVE the image inside the polaroid frame; landscape cards are
// photo-only. Image dimensions are picked via Unsplash query params so the CDN
// delivers crops matching the rendered aspect ratio.

const CARDS: Card[] = [
  {
    id: 0,
    orientation: 'portrait',
    title: 'Quiet weekends in Hokkaido',
    image:
      'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=500&h=625&q=80',
  },
  {
    id: 1,
    orientation: 'landscape',
    image:
      'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&w=700&h=437&q=80',
  },
  {
    id: 2,
    orientation: 'portrait',
    title: 'Letters from a quiet town',
    image:
      'https://images.unsplash.com/photo-1658289929355-e87b9c4e9c47?auto=format&fit=crop&w=500&h=625&q=80',
  },
  {
    id: 3,
    orientation: 'landscape',
    image:
      'https://images.unsplash.com/photo-1704265586326-6b8d7569e62c?auto=format&fit=crop&w=700&h=437&q=80',
  },
  {
    id: 4,
    orientation: 'portrait',
    title: 'Field notes on attention',
    image:
      'https://images.unsplash.com/photo-1617910879258-2aff8026515d?auto=format&fit=crop&w=500&h=625&q=80',
  },
]

// ─── Slot tables ──────────────────────────────────────────────────────────────
// Slot 0 is the focused front card. Slots 1-4 scatter behind it. The mobile
// table tightens the spread so all 5 cards remain visible at narrow widths.

const SLOTS_DESKTOP: Slot[] = [
  { x:    0, y:   0, rotate:  1.5, scale: 1.00, zIndex: 50 },
  { x:  160, y: -30, rotate:  12,  scale: 0.90, zIndex: 40 },
  { x: -150, y: -10, rotate: -14,  scale: 0.89, zIndex: 30 },
  { x:   90, y:  70, rotate:  8,   scale: 0.86, zIndex: 20 },
  { x: -110, y:  60, rotate: -9,   scale: 0.84, zIndex: 10 },
]

const SLOTS_MOBILE: Slot[] = [
  { x:   0, y:   0, rotate:  1,   scale: 1.00, zIndex: 50 },
  { x:  90, y: -15, rotate:  6,   scale: 0.92, zIndex: 40 },
  { x: -85, y:  20, rotate: -7,   scale: 0.91, zIndex: 30 },
  { x:  55, y:  35, rotate:  4,   scale: 0.88, zIndex: 20 },
  { x: -55, y:  25, rotate: -4.5, scale: 0.87, zIndex: 10 },
]

// ─── Motion constants ─────────────────────────────────────────────────────────

const SPRING = { type: 'spring' as const, stiffness: 280, damping: 26 }
const MOUNT_SPRING = { type: 'spring' as const, stiffness: 200, damping: 22 }
const STAGGER_S = 0.08

// ─── ScatterPile ──────────────────────────────────────────────────────────────

export default function ScatterPile() {
  // order[slotIndex] = cardId. Slot 0 is the focused front.
  const [order, setOrder] = useState<number[]>([0, 1, 2, 3, 4])
  const orderRef = useRef(order)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Drag tracking — separates a tap (< 8px) from a drag.
  const dragDelta = useRef(0)

  // Keep orderRef in sync so stable callbacks see the latest order.
  useEffect(() => {
    orderRef.current = order
  }, [order])

  // Mount flag flips on after first paint; subsequent transitions use the
  // runtime spring (no entrance delay).
  useEffect(() => {
    setMounted(true)
  }, [])

  // Mobile breakpoint — flip slot table below 640px.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(min-width: 640px)')
    const apply = () => setIsMobile(!mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // Bring a card to slot 0. The rest of the order rotates so the previous
  // trailing cards keep their relative order behind it.
  const focusCard = useCallback((cardId: number) => {
    setOrder((prev) => {
      const idx = prev.indexOf(cardId)
      if (idx <= 0) return prev
      return [cardId, ...prev.slice(0, idx), ...prev.slice(idx + 1)]
    })
  }, [])

  // Cycle focus by ±1 with wrap. Direction +1 → next card (move slot 0 to
  // back), -1 → previous card (bring slot 4 to front).
  const step = useCallback((dir: 1 | -1) => {
    setOrder((prev) => {
      if (dir === 1) return [...prev.slice(1), prev[0]]
      return [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]
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
      if (distance < -80 || velocity < -400) {
        step(1)
      } else if (distance > 80 || velocity > 400) {
        step(-1)
      }
    },
    [step],
  )

  const slots = isMobile ? SLOTS_MOBILE : SLOTS_DESKTOP
  const frontCardId = order[0]

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#E8E8DF] px-4 dark:bg-[#1A1A19]">
      <div className="relative flex w-full max-w-4xl flex-col items-center gap-10 py-12">
        {/* Stage — fixed-height container so the scattered pile is centred
            vertically and the dot indicator below it stays anchored. */}
        <div
          className="relative flex w-full items-center justify-center"
          style={{ perspective: '1400px', height: 'clamp(320px, 44vw, 440px)' }}
        >
          {CARDS.map((card) => {
            const slotIndex = order.indexOf(card.id)
            const slot = slots[slotIndex]
            const isFocus = slotIndex === 0

            // Entrance stagger: outer cards land first, focus lands last.
            const mountDelay = slotIndex * STAGGER_S
            const transition = mounted
              ? SPRING
              : { ...MOUNT_SPRING, delay: mountDelay }

            // Breathing — focused doubles amplitude. Each card uses a
            // distinct duration so the pile feels alive but not synced.
            const breathDuration = 7 + card.id * 0.6
            const breathY = isFocus ? [0, -14, 0, 10, 0] : [0, -8, 0, 6, 0]
            const breathRotate = isFocus
              ? [0, 1.5, 0, -1.5, 0]
              : [0, 1, 0, -1, 0]

            // Polaroid dimensions. Width clamps shrink on mobile per spec.
            const isLandscape = card.orientation === 'landscape'
            const widthClass = isLandscape
              ? isMobile
                ? 'w-[clamp(200px,60vw,260px)]'
                : 'w-[clamp(220px,28vw,320px)]'
              : isMobile
                ? 'w-[clamp(130px,42vw,180px)]'
                : 'w-[clamp(160px,20vw,220px)]'

            // Polaroid chrome — shadow is heavier on the focused card.
            const boxShadow = isFocus
              ? '0 24px 48px rgba(0,0,0,0.28), 0 6px 14px rgba(0,0,0,0.16)'
              : '0 12px 28px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.12)'

            return (
              <motion.button
                key={card.id}
                type="button"
                aria-label={card.title ?? `Card ${card.id + 1}`}
                onPointerDown={() => {
                  dragDelta.current = 0
                }}
                onClick={(event) => {
                  event.preventDefault()
                  // Only count as a click if the pointer barely moved — keeps
                  // taps separate from drags on the focused card.
                  if (Math.abs(dragDelta.current) >= 8) return
                  if (!isFocus) focusCard(card.id)
                }}
                drag={isFocus ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDrag={(_, info) => {
                  dragDelta.current = info.offset.x
                }}
                onDragEnd={handleDragEnd}
                className={`absolute ${widthClass} bg-transparent p-0`}
                style={{
                  // Outer layer is a positioning-only frame. No background,
                  // no ring, no shadow, no padding — those all live on the
                  // middle (breathing) layer so the visible polaroid moves
                  // as one rigid unit. The outer button sizes itself to the
                  // breathing layer (height: auto), so the click target
                  // matches the polaroid footprint exactly.
                  cursor: isFocus ? 'grab' : 'pointer',
                  zIndex: slot.zIndex,
                  border: 'none',
                }}
                initial={{ opacity: 0, scale: 0.5, y: 60 }}
                animate={{
                  x: slot.x,
                  y: slot.y,
                  rotate: slot.rotate,
                  scale: slot.scale,
                  opacity: 1,
                }}
                transition={transition}
                whileTap={isFocus ? { cursor: 'grabbing' } : undefined}
              >
                {/* Middle layer — owns the breathing loop AND the polaroid
                    chrome (paper, ring, shadow, padding). Because the
                    transform is applied here, the white frame, drop
                    shadow, image, and text strip all move together as one
                    rigid unit. */}
                <motion.div
                  className="relative flex w-full flex-col rounded-[18px] ring-1 ring-black/[0.08] dark:ring-white/[0.12]"
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding:
                      card.orientation === 'portrait'
                        ? '10px 10px 14px 10px'
                        : '10px',
                    boxShadow,
                  }}
                  animate={{ y: breathY, rotate: breathRotate }}
                  transition={{
                    duration: breathDuration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {/* Dark-mode paper colour overlay. Sits behind the image
                      well and rides inside the breathing layer so it stays
                      pinned to the polaroid frame. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[18px] dark:bg-[#F5F5F0]"
                  />

                  {/* Title strip — portrait cards only. Sits ABOVE the image
                      inside the polaroid frame. Two-line clamp keeps every
                      portrait card the same height so the polaroid frames
                      stay visually consistent. */}
                  {card.orientation === 'portrait' && (
                    <div
                      className="relative"
                      style={{ padding: '14px 12px 8px 12px' }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-sans, sans-serif)',
                          fontWeight: 600,
                          fontSize: '15px',
                          lineHeight: 1.3,
                          letterSpacing: '-0.01em',
                          color: '#1a1a19',
                          margin: 0,
                          textAlign: 'left',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '2.6em',
                        }}
                      >
                        {card.title}
                      </p>
                    </div>
                  )}

                  {/* Image well — rounded, clipped, aspect-locked. */}
                  <div
                    className={`relative w-full overflow-hidden ${
                      isLandscape ? 'aspect-[16/10]' : 'aspect-[4/5]'
                    }`}
                    style={{ borderRadius: 10 }}
                  >
                    <img
                      src={card.image}
                      alt={card.title ?? ''}
                      loading="lazy"
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </motion.div>
              </motion.button>
            )
          })}
        </div>

        {/* Dot indicator + hint */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5">
            {CARDS.map((card) => {
              const isCurrent = frontCardId === card.id
              return (
                <motion.button
                  key={card.id}
                  type="button"
                  aria-label={`Focus card ${card.id + 1}`}
                  onClick={() => focusCard(card.id)}
                  animate={{
                    width: isCurrent ? 20 : 5,
                    opacity: isCurrent ? 1 : 0.3,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="rounded-full bg-[#21211F] dark:bg-[#FAFAF0]"
                  style={{
                    height: 5,
                    // Padding extends the touch target without changing the
                    // visible dot size — meets the 24px minimum tap rule.
                    padding: '10px 0',
                    backgroundClip: 'content-box',
                  }}
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
