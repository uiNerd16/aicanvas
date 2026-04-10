'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

// ─── Constants ────────────────────────────────────────────────────────────────

const CARD_W  = 200   // width — perpendicular to spoke
const CARD_H  = 126   // height — radial direction (inner edge sits at wheel center)
const N_CARDS = 8
const CARD_RX = 10    // corner radius

// How far the center pivot sits from the top of the container (as a fraction).
// Pushing it below 50% means more card is visible above the center.
const CENTER_Y = 0.64  // 64% from top → cards fan into the upper portion

// ─── Card data ────────────────────────────────────────────────────────────────

interface CardData {
  id: number
  network: 'visa' | 'mastercard' | 'amex' | 'discover' | 'unionpay' | 'jcb' | 'maestro' | 'mir'
  type: 'DEBIT' | 'CREDIT'
  lastFour: string
  bg: string
  textColor: string
  mutedColor: string
}

const CARDS: CardData[] = [
  { id: 0, network: 'visa',       type: 'DEBIT',  lastFour: '4829', bg: '#F0EFE9', textColor: '#1a1a18', mutedColor: 'rgba(26,26,24,0.45)' },
  { id: 1, network: 'mastercard', type: 'CREDIT', lastFour: '7741', bg: '#1E40AF', textColor: '#ffffff', mutedColor: 'rgba(255,255,255,0.55)' },
  { id: 2, network: 'amex',       type: 'DEBIT',  lastFour: '3344', bg: '#93C5E8', textColor: '#0a2540', mutedColor: 'rgba(10,37,64,0.55)' },
  { id: 3, network: 'discover',   type: 'CREDIT', lastFour: '5512', bg: '#F5C100', textColor: '#1a1000', mutedColor: 'rgba(26,16,0,0.55)' },
  { id: 4, network: 'jcb',        type: 'CREDIT', lastFour: '0091', bg: '#E84826', textColor: '#ffffff', mutedColor: 'rgba(255,255,255,0.55)' },
  { id: 5, network: 'unionpay',   type: 'DEBIT',  lastFour: '6673', bg: '#14532D', textColor: '#ffffff', mutedColor: 'rgba(255,255,255,0.55)' },
  { id: 6, network: 'maestro',    type: 'DEBIT',  lastFour: '8820', bg: '#84CC16', textColor: '#1a2a00', mutedColor: 'rgba(26,42,0,0.55)' },
  { id: 7, network: 'mir',        type: 'CREDIT', lastFour: '2255', bg: '#27272A', textColor: '#ffffff', mutedColor: 'rgba(255,255,255,0.45)' },
]

// ─── Payment network icons ────────────────────────────────────────────────────

function VisaIcon() {
  return (
    <svg width="38" height="13" viewBox="0 0 38 13" fill="none">
      <text x="0" y="12" fontFamily="serif" fontStyle="italic" fontWeight="900" fontSize="14" fill="#1A1F71" letterSpacing="-0.5">VISA</text>
    </svg>
  )
}

function MastercardIcon() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20">
      <circle cx="11" cy="10" r="10" fill="#EB001B" />
      <circle cx="21" cy="10" r="10" fill="#F79E1B" />
      <path d="M16 3.8a10 10 0 0 1 0 12.4A10 10 0 0 1 16 3.8z" fill="#FF5F00" />
    </svg>
  )
}

function AmexIcon() {
  return (
    <svg width="32" height="20" viewBox="0 0 32 20">
      <rect width="32" height="20" rx="3" fill="#007BC1" />
      <text x="16" y="14" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="8" fill="white" letterSpacing="0.5">AMEX</text>
    </svg>
  )
}

function DiscoverIcon() {
  return (
    <svg width="40" height="16" viewBox="0 0 40 16">
      <text x="0" y="12" fontFamily="sans-serif" fontWeight="700" fontSize="9" fill="#231F20" letterSpacing="0.3">DISCOVER</text>
      <circle cx="35" cy="8" r="7" fill="#F76F20" />
    </svg>
  )
}

function UnionPayIcon() {
  return (
    <svg width="30" height="20" viewBox="0 0 30 20">
      <rect width="14" height="20" rx="3" fill="#E21836" />
      <rect x="16" width="14" height="20" rx="3" fill="#00447C" />
      <text x="7" y="14" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="9" fill="white">UP</text>
      <text x="23" y="14" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="9" fill="white">UP</text>
    </svg>
  )
}

function JcbIcon() {
  return (
    <svg width="24" height="20" viewBox="0 0 24 20">
      <rect x="0"  width="8" height="20" rx="3" fill="#003087" />
      <rect x="8"  width="8" height="20" rx="3" fill="#CC0000" />
      <rect x="16" width="8" height="20" rx="3" fill="#007B40" />
      <text x="4"  y="14" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="9" fill="white">J</text>
      <text x="12" y="14" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="9" fill="white">C</text>
      <text x="20" y="14" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="9" fill="white">B</text>
    </svg>
  )
}

function MaestroIcon() {
  return (
    <svg width="36" height="24" viewBox="0 0 36 24">
      <circle cx="13" cy="12" r="11" fill="#CC0000" />
      <circle cx="23" cy="12" r="11" fill="#0066B2" />
      <path d="M18 4.5a11 11 0 0 1 0 15A11 11 0 0 1 18 4.5z" fill="#7B2D8B" />
    </svg>
  )
}

function MirIcon() {
  return (
    <svg width="36" height="20" viewBox="0 0 36 20">
      <rect width="36" height="20" rx="3" fill="#4DAF4E" />
      <text x="18" y="14" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="10" fill="white" letterSpacing="1">МИР</text>
    </svg>
  )
}

function NetworkIcon({ network }: { network: CardData['network'] }) {
  switch (network) {
    case 'visa':       return <VisaIcon />
    case 'mastercard': return <MastercardIcon />
    case 'amex':       return <AmexIcon />
    case 'discover':   return <DiscoverIcon />
    case 'unionpay':   return <UnionPayIcon />
    case 'jcb':        return <JcbIcon />
    case 'maestro':    return <MaestroIcon />
    case 'mir':        return <MirIcon />
  }
}

// ─── CardSpoke ────────────────────────────────────────────────────────────────
//
// Geometry:
//   • A zero-size pivot div sits at the wheel center (left:50%, top:50%).
//   • Rotating the pivot rotates around the wheel center — NOT around the card center.
//   • The card is positioned inside the pivot with `top: -CARD_H` so its
//     inner (bottom) edge is exactly at the pivot = wheel center.
//   • y: animate in the card's local (rotated) coordinate space → radially outward lift. ✓

function CardSpoke({
  card,
  index,
  wheelRotation,
  isSelected,
  isHovered,
  onHover,
  onSelect,
}: {
  card: CardData
  index: number
  wheelRotation: MotionValue<number>
  isSelected: boolean
  isHovered: boolean
  onHover: (id: number | null) => void
  onSelect: (id: number) => void
}) {
  const orbitalAngle = useTransform(wheelRotation, (r) => r + index * (360 / N_CARDS))

  // z-ordering: cards in the "back" of the fan (pointing down, indices 3-5 for
  // a fan spread from ~-157.5° to +157.5°) get lower z. Cards pointing upward
  // get higher z so they appear in front. isHovered/isSelected always on top.
  const baseZ = (() => {
    // Map index to angle in 0-360 range
    const angle = (index * (360 / N_CARDS)) % 360
    // Cards pointing upward (around 270°/top) → high z. Downward → low z.
    const dist = Math.abs(((angle - 270) + 540) % 360 - 180) // 0 = pointing up, 180 = pointing down
    return Math.round(dist / 20) + 1  // 1–10
  })()

  return (
    // Zero-size pivot — rotates around the wheel center
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        top: `${CENTER_Y * 100}%`,
        rotate: orbitalAngle,
        zIndex: isHovered || isSelected ? 20 : baseZ,
      }}
    >
      {/* Card — inner edge at pivot, extends outward (up) */}
      <motion.div
        animate={{ y: isSelected ? -18 : 0, scale: isSelected ? 1.08 : 1 }}
        whileHover={{ y: -12, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 360, damping: 22 }}
        style={{
          position: 'absolute',
          left: -CARD_W / 2,
          top: -CARD_H,
          width: CARD_W,
          height: CARD_H,
          cursor: 'pointer',
        }}
        onHoverStart={() => onHover(card.id)}
        onHoverEnd={() => onHover(null)}
        onClick={() => onSelect(card.id)}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: CARD_RX,
            background: card.bg,
            boxShadow: '0 20px 56px rgba(0,0,0,0.36), 0 6px 16px rgba(0,0,0,0.20)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Top-edge specular highlight */}
          <div
            style={{
              position: 'absolute',
              top: 0, left: '10%', right: '10%',
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)',
            }}
          />

          {/* Card content */}
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>

            {/* Chip + network icon */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                width: 30, height: 22, borderRadius: 5,
                background: 'linear-gradient(135deg, #e8d48b 0%, #c9a84c 40%, #f2e09a 60%, #b8942e 100%)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)',
              }} />
              <div style={{ transform: 'scale(0.82)', transformOrigin: 'top right' }}>
                <NetworkIcon network={card.network} />
              </div>
            </div>

            <div style={{ flex: 1 }} />

            {/* Masked number + type */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{
                fontFamily: 'monospace', fontSize: 13, fontWeight: 600, letterSpacing: 1,
                color: card.textColor,
              }}>
                •••• {card.lastFour}
              </span>
              <span style={{
                fontSize: 8, fontWeight: 700, letterSpacing: 1.2,
                textTransform: 'uppercase',
                color: card.mutedColor,
              }}>
                {card.type}
              </span>
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── CardWheel ────────────────────────────────────────────────────────────────

export function CardWheel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(true)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const wheelRotation = useMotionValue(0)

  // ─── isDark detection ──────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      setIsDark(card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark'))
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) observer.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // ─── Settle to default fan position on mount ──────────────────────────
  // Starting angle: rotate the wheel so card 0 (white/gray) is at ~10 o'clock,
  // giving the fan a natural spread across the top half of the circle.
  useEffect(() => {
    animate(wheelRotation, -22.5, { duration: 1.1, ease: [0.22, 1, 0.36, 1] })
  }, [wheelRotation])

  // ─── Drag-to-spin ──────────────────────────────────────────────────────
  const lastDragX = useRef(0)
  const isDragging = useRef(false)

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    lastDragX.current = e.clientX
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastDragX.current
    lastDragX.current = e.clientX
    wheelRotation.set(wheelRotation.get() + dx * 0.45)
  }

  const handlePointerUp = () => {
    isDragging.current = false
  }

  const handleSelect = (id: number) => setSelectedId((prev) => (prev === id ? null : id))

  const bg = isDark ? '#1A1A18' : '#E4E4E0'
  const hintColor = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.28)'

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: bg, cursor: isDragging.current ? 'grabbing' : 'grab' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {CARDS.map((card, i) => (
        <CardSpoke
          key={card.id}
          card={card}
          index={i}
          wheelRotation={wheelRotation}
          isSelected={selectedId === card.id}
          isHovered={hoveredId === card.id}
          onHover={setHoveredId}
          onSelect={handleSelect}
        />
      ))}

      <p
        className="pointer-events-none absolute bottom-5 left-0 right-0 text-center text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: hintColor }}
      >
        drag to spin · click to pop
      </p>
    </div>
  )
}
