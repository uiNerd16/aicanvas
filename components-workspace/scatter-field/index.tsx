'use client'

// npm install framer-motion

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// ─── Constants ───────────────────────────────────────────────────────────────

const CARD_W = 300
const CARD_H = 169 // 16:9

// ─── Card data ───────────────────────────────────────────────────────────────

const CARDS = [
  {
    id: 0,
    title: 'Mobile Apps',
    sub1: 'Native iOS & Android',
    sub2: 'Interaction Design',
    since: '2023',
    bg: '#5CAD60',
    fg: '#162217',
    idle: { x: -82, y: -70, rotate: -11 },
  },
  {
    id: 1,
    title: 'Web Design',
    sub1: 'React & Next.js',
    sub2: 'Frontend Systems',
    since: '2021',
    bg: '#EDD540',
    fg: '#241F05',
    idle: { x: -48, y: 66, rotate: 9 },
  },
  {
    id: 2,
    title: 'Branding',
    sub1: 'Visual Identity',
    sub2: 'Brand Strategy',
    since: '2020',
    bg: '#1C2E8A',
    fg: '#E8EDF8',
    idle: { x: 12, y: -14, rotate: -4 },
  },
  {
    id: 3,
    title: 'Editorial',
    sub1: 'Magazine & Print',
    sub2: 'Typography Systems',
    since: '2022',
    bg: '#D43C3C',
    fg: '#FAE8E8',
    idle: { x: 68, y: 62, rotate: 14 },
  },
  {
    id: 4,
    title: 'Motion',
    sub1: 'Animation & Micro-UX',
    sub2: 'Interaction Patterns',
    since: '2023',
    bg: '#E08030',
    fg: '#2A1A06',
    idle: { x: 84, y: -86, rotate: 18 },
  },
]

const SPRING_SCATTER = { type: 'spring' as const, stiffness: 240, damping: 24 }
const SPRING_FOCUS   = { type: 'spring' as const, stiffness: 340, damping: 28 }

// ─── Barcode ─────────────────────────────────────────────────────────────────

// Deterministic pattern — varying bar widths give a realistic barcode look
const BAR_PATTERN = [1,2,1,1,3,1,2,1,1,3,1,1,2,1,2,1,3,1,1,2,1,3,1,2,1,1,2,1]

function Barcode({ color }: { color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', height: 28, gap: 1.2 }}>
      {BAR_PATTERN.map((w, i) => (
        <div
          key={i}
          style={{
            width: w * 1.5,
            background: color,
            opacity: 0.8,
            borderRadius: 0.5,
          }}
        />
      ))}
    </div>
  )
}

// ─── Logo mark ───────────────────────────────────────────────────────────────

function LogoMark({ color }: { color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: `1.5px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.85,
        }}
      >
        <span
          style={{
            fontSize: 7.5,
            fontWeight: 800,
            color,
            letterSpacing: '0.02em',
            lineHeight: 1,
          }}
        >
          AI
        </span>
      </div>
      <span
        style={{
          fontSize: 6.5,
          fontWeight: 700,
          color,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          opacity: 0.7,
        }}
      >
        CANVAS
      </span>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScatterField() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(true)
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      setIsDark(
        card
          ? card.classList.contains('dark')
          : document.documentElement.classList.contains('dark'),
      )
    }
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) obs.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#E8E8DF] dark:bg-[#1A1A19]"
    >
      {/* Subtle dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${
            isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'
          } 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {CARDS.map(card => {
        const isSelected = selected === card.id
        const isFaded   = selected !== null && !isSelected

        return (
          <motion.div
            key={card.id}
            style={{
              position: 'absolute',
              width: CARD_W,
              height: CARD_H,
              borderRadius: 10,
              overflow: 'hidden',
              cursor: 'pointer',
              background: card.bg,
              boxShadow: '0 10px 36px rgba(0,0,0,0.32)',
              userSelect: 'none',
            }}
            animate={
              isSelected
                ? { x: 0, y: 0, rotate: 0, scale: 1.05, zIndex: 10, opacity: 1 }
                : isFaded
                ? {
                    x: card.idle.x,
                    y: card.idle.y,
                    rotate: card.idle.rotate,
                    scale: 1,
                    zIndex: 1,
                    opacity: 1,
                  }
                : {
                    x: card.idle.x,
                    y: card.idle.y,
                    rotate: card.idle.rotate,
                    scale: 1,
                    zIndex: 2,
                    opacity: 1,
                  }
            }
            transition={isSelected ? SPRING_FOCUS : SPRING_SCATTER}
            onClick={() => setSelected(prev => (prev === card.id ? null : card.id))}
            whileHover={
              !isSelected && !isFaded
                ? { scale: 1.03, y: card.idle.y - 5 }
                : undefined
            }
          >
            {/* Inner layout */}
            <div
              style={{
                height: '100%',
                padding: '12px 14px 11px',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
              }}
            >
              {/* ── Title row ───────────────────────────────────── */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 9,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {/* Asterisk glyph */}
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: card.fg,
                      lineHeight: 1,
                      opacity: 0.9,
                    }}
                  >
                    ✳
                  </span>
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: card.fg,
                      letterSpacing: '-0.025em',
                      lineHeight: 1,
                    }}
                  >
                    {card.title}
                  </span>
                </div>

                {/* Since + year */}
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    color: card.fg,
                    opacity: 0.5,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Since {card.since}
                </span>
              </div>

              {/* ── Divider ─────────────────────────────────────── */}
              <div
                style={{
                  height: 1,
                  background: card.fg,
                  opacity: 0.22,
                  marginBottom: 9,
                  flexShrink: 0,
                }}
              />

              {/* ── Body ────────────────────────────────────────── */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Subtitle lines */}
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: card.fg,
                      lineHeight: 1.35,
                    }}
                  >
                    {card.sub1}
                  </p>
                  <p
                    style={{
                      margin: '3px 0 0',
                      fontSize: 11,
                      fontWeight: 400,
                      color: card.fg,
                      opacity: 0.6,
                      lineHeight: 1.35,
                    }}
                  >
                    {card.sub2}
                  </p>
                </div>

                {/* ── Bottom bar: barcode | logo ───────────────── */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}
                >
                  {/* Barcode only */}
                  <Barcode color={card.fg} />

                  <LogoMark color={card.fg} />
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* Hint */}
      <motion.p
        style={{
          position: 'absolute',
          bottom: 20,
          fontSize: 11,
          letterSpacing: '0.05em',
          color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          pointerEvents: 'none',
        }}
        animate={{ opacity: selected !== null ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        tap a card to focus
      </motion.p>
    </div>
  )
}
