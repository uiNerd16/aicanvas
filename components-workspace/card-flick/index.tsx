'use client'

// npm install framer-motion

import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  usePresence,
  useMotionValue,
  useTransform,
  type PanInfo,
} from 'framer-motion'

// ─── Data ───────────────────────────────────────────────────────────────────
// Swap these for any images — the deck loops endlessly through them.

interface CardData {
  eyebrow: string
  title: string
  image: string
}

const CARDS: CardData[] = [
  {
    eyebrow: 'Birds',
    title: 'Sun conure at dusk',
    image:
      'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=600&h=800&q=80',
  },
  {
    eyebrow: 'Big cats',
    title: 'White tiger in the ferns',
    image:
      'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&w=600&h=800&q=80',
  },
  {
    eyebrow: 'Birds',
    title: 'Toco toucan in the canopy',
    image:
      'https://images.unsplash.com/photo-1658289929355-e87b9c4e9c47?auto=format&fit=crop&w=600&h=800&q=80',
  },
  {
    eyebrow: 'Reptiles',
    title: 'Veiled chameleon',
    image:
      'https://images.unsplash.com/photo-1704265586326-6b8d7569e62c?auto=format&fit=crop&w=600&h=800&q=80',
  },
  {
    eyebrow: 'Bears',
    title: 'Giant panda in the bamboo',
    image:
      'https://images.unsplash.com/photo-1617910879258-2aff8026515d?auto=format&fit=crop&w=600&h=800&q=80',
  },
]

// ─── Stack geometry ─────────────────────────────────────────────────────────
// Slot 0 is the active (draggable) card; slots 1-3 peek behind it as a straight
// stack — the only rotation is the live drag-tilt below.

const VISIBLE = 4
const SLOT_Y = [0, 12, 24, 36]
const SLOT_SCALE = [1, 0.95, 0.9, 0.86]
const SLOT_OPACITY = [1, 1, 0.92, 0.82]

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 }

// ─── Card face ───────────────────────────────────────────────────────────────

function CardFace({ card, isTop }: { card: CardData; isTop: boolean }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        borderRadius: 22,
        backgroundColor: '#111111',
        boxShadow: isTop
          ? '0 30px 60px rgba(0,0,0,0.30), 0 10px 20px rgba(0,0,0,0.20)'
          : '0 14px 30px rgba(0,0,0,0.18)',
      }}
    >
      <img
        src={card.image}
        alt={card.title}
        draggable={false}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5"
        style={{
          padding: '48px 20px 20px',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 100%)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans, sans-serif)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          {card.eyebrow}
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-sans, sans-serif)',
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            color: '#FFFFFF',
            margin: 0,
          }}
        >
          {card.title}
        </h3>
      </div>
    </div>
  )
}

// ─── One card in the deck ─────────────────────────────────────────────────────
// Owns its OWN motion values, so the top card can be dragged + tilted while the
// rest sit in their slots. When the deck advances, the card behind becomes the
// same element at slot 0 (no hand-off). When flicked it animates itself off via
// usePresence before unmounting.

function FlickCard({
  card,
  slot,
  isTop,
  onFlick,
}: {
  card: CardData
  slot: number
  isTop: boolean
  onFlick: () => void
}) {
  const [isPresent, safeToRemove] = usePresence()
  const x = useMotionValue(0)
  const y = useMotionValue(SLOT_Y[slot])
  const scale = useMotionValue(SLOT_SCALE[slot])
  const opacity = useMotionValue(0)
  // Drag-tilt: lean toward the horizontal drag, clamped to a gentle ±18°.
  const rotate = useTransform(x, [-200, 200], [-18, 18], { clamp: true })
  const flickVel = useRef({ x: 0, y: 0 })

  // Settle into the current slot whenever it changes (the deck advancing). The
  // background cards re-center horizontally; the top card leaves x to the drag.
  useEffect(() => {
    if (!isPresent) return
    const controls = [
      animate(y, SLOT_Y[slot], SPRING),
      animate(scale, SLOT_SCALE[slot], SPRING),
      animate(opacity, SLOT_OPACITY[slot], { duration: 0.3, ease: 'easeOut' }),
    ]
    if (!isTop) controls.push(animate(x, 0, SPRING))
    return () => controls.forEach((c) => c.stop())
  }, [slot, isTop, isPresent, x, y, scale, opacity])

  // Removed from the deck -> sail off in the flick direction, then unmount.
  useEffect(() => {
    if (isPresent) return
    const v = flickVel.current
    const mag = Math.hypot(v.x, v.y) || 1
    animate(x, (v.x / mag) * 1500, { duration: 0.5, ease: 'easeOut' })
    animate(y, (v.y / mag) * 1500, { duration: 0.5, ease: 'easeOut' })
    animate(opacity, 0, { duration: 0.45, ease: 'easeOut' })
    const last = animate(scale, 0.85, {
      duration: 0.5,
      ease: 'easeOut',
      onComplete: () => safeToRemove?.(),
    })
    return () => last.stop()
  }, [isPresent, safeToRemove, x, y, scale, opacity])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const speed = Math.hypot(info.velocity.x, info.velocity.y)
    const dist = Math.hypot(info.offset.x, info.offset.y)
    if (speed > 500 || dist > 130) {
      // On a far-but-slow drag the velocity is tiny — fall back to the drag
      // direction so the card still flies the way it was pushed.
      flickVel.current =
        speed > 220
          ? { x: info.velocity.x, y: info.velocity.y }
          : { x: info.offset.x * 9, y: info.offset.y * 9 }
      onFlick()
    } else {
      // Weak release: spring back to the top slot.
      animate(x, 0, SPRING)
      animate(y, SLOT_Y[0], SPRING)
    }
  }

  return (
    <motion.div
      style={{
        x,
        y,
        scale,
        opacity,
        rotate,
        position: 'absolute',
        inset: 0,
        zIndex: 100 - slot,
        cursor: isTop ? 'grab' : 'auto',
        touchAction: 'none',
      }}
      drag={isTop}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileTap={isTop ? { cursor: 'grabbing' } : undefined}
    >
      <CardFace card={card} isTop={isTop} />
    </motion.div>
  )
}

// ─── CardFlick ──────────────────────────────────────────────────────────────

interface DeckCard {
  key: number
  content: number
}

export default function CardFlick() {
  const [deck, setDeck] = useState<DeckCard[]>(() =>
    Array.from({ length: VISIBLE }, (_, i) => ({ key: i, content: i })),
  )
  const nextKey = useRef(VISIBLE)

  // Drop the top card and append a fresh one at the back so the deck never ends.
  const handleFlick = () => {
    setDeck((prev) => {
      const rest = prev.slice(1)
      const lastContent = prev[prev.length - 1].content
      const newCard = {
        key: nextKey.current++,
        content: (lastContent + 1) % CARDS.length,
      }
      return [...rest, newCard]
    })
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#E8E8DF] px-4 dark:bg-[#1A1A19]">
      <div className="flex flex-col items-center gap-10">
        <div
          className="relative"
          style={{
            width: 'clamp(220px, 72vw, 300px)',
            height: 'clamp(293px, 96vw, 400px)',
          }}
        >
          <AnimatePresence>
            {deck.map((item, i) => (
              <FlickCard
                key={item.key}
                card={CARDS[item.content % CARDS.length]}
                slot={i}
                isTop={i === 0}
                onFlick={handleFlick}
              />
            ))}
          </AnimatePresence>
        </div>

        <p className="text-xs tracking-wide text-[#666662] dark:text-[#9E9E98]">
          grab the top card and flick it away
        </p>
      </div>
    </div>
  )
}
