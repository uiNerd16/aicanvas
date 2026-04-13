'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tag, ArrowLeft, ArrowRight } from '@phosphor-icons/react'

// ─── Data ────────────────────────────────────────────────────────────────────

const CARD_W = 260
const CARD_H = 280

const TASKS = [
  {
    id: 0,
    number: '01',
    title: 'Brand Overhaul',
    category: 'Design',
    status: 'In Progress',
    due: 'Apr 18',
    description: 'Complete visual identity refresh — logo, type scale, and colour system across all brand touchpoints.',
    accent: '#8B7FCC',
    bg: '#131220',
    bgLight: '#EEEDF6',
    accentLight: '#7060B8',
  },
  {
    id: 1,
    number: '02',
    title: 'Product Launch',
    category: 'Marketing',
    status: 'In Review',
    due: 'Apr 25',
    description: 'Coordinate go-to-market strategy, press kit, social assets, and launch-day campaign timeline.',
    accent: '#C49090',
    bg: '#1C1010',
    bgLight: '#F6EEEE',
    accentLight: '#A87070',
  },
  {
    id: 2,
    number: '03',
    title: 'API Migration',
    category: 'Engineering',
    status: 'Blocked',
    due: 'Apr 30',
    description: 'Migrate three legacy endpoints to v3 schema with full backward-compatibility and rollback plan.',
    accent: '#70AAAA',
    bg: '#0C1818',
    bgLight: '#ECF4F4',
    accentLight: '#408888',
  },
  {
    id: 3,
    number: '04',
    title: 'Q2 Metrics',
    category: 'Analytics',
    status: 'Planning',
    due: 'May 5',
    description: 'Build consolidated dashboard — retention, revenue, and activation funnels with weekly drill-down.',
    accent: '#C4A060',
    bg: '#181508',
    bgLight: '#F6F1E4',
    accentLight: '#907840',
  },
]

// Slot 0 = front, slot 3 = back
const SLOTS = [
  { x: 0,  y: 0,   rotate: 0, scale: 1,    z: 4 },
  { x: 8,  y: -10, rotate: 3, scale: 0.96, z: 3 },
  { x: 16, y: -20, rotate: 6, scale: 0.92, z: 2 },
  { x: 24, y: -30, rotate: 9, scale: 0.88, z: 1 },
]

const SPRING = { type: 'spring' as const, stiffness: 280, damping: 26 }

// ─── Theme detection hook ─────────────────────────────────────────────────────

function useIsDark(ref: React.RefObject<HTMLElement | null>) {
  const [isDark, setIsDark] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      setIsDark(card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark'))
    }
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) obs.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [ref])
  return isDark
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TaskCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDark = useIsDark(containerRef)

  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [warpSeed, setWarpSeed]   = useState(0)
  const warpInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const startWarp = useCallback((id: number) => {
    setHoveredId(id)
    warpInterval.current = setInterval(() => {
      setWarpSeed(Math.floor(Math.random() * 999))
    }, 40)
  }, [])

  const stopWarp = useCallback(() => {
    setHoveredId(null)
    if (warpInterval.current) { clearInterval(warpInterval.current); warpInterval.current = null }
  }, [])

  useEffect(() => () => { if (warpInterval.current) clearInterval(warpInterval.current) }, [])

  const [order, setOrder] = useState([0, 1, 2, 3])
  const orderRef = useRef(order)
  useEffect(() => { orderRef.current = order }, [order])

  const dismissing = useRef(false)
  const dragDelta = useRef(0)
  const [exiting, setExiting] = useState<{ id: number; dir: 'left' | 'right' } | null>(null)
  const [returning, setReturning] = useState<Set<number>>(new Set())

  const dismiss = useCallback((dir: 'left' | 'right') => {
    if (dismissing.current) return
    dismissing.current = true
    const frontId = orderRef.current[0]
    setExiting({ id: frontId, dir })
    setTimeout(() => {
      setReturning(prev => new Set([...prev, frontId]))
      setOrder(prev => [...prev.slice(1), prev[0]])
      setExiting(null)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setReturning(prev => { const s = new Set(prev); s.delete(frontId); return s })
        dismissing.current = false
      }))
    }, 420)
  }, [])

  const frontTask = TASKS[order[0]]

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full flex-col items-center justify-center bg-sand-100 dark:bg-sand-950"
    >
      {/* SVG paper-warp filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="paper-warp" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.028 0.018"
              numOctaves="2"
              seed={warpSeed}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="28"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Deck + side buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* Left arrow */}
        <button
          onClick={() => dismiss('left')}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label="Previous card"
        >
          <ArrowLeft weight="regular" size={14} style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }} />
        </button>

        <div style={{ position: 'relative', width: CARD_W, height: CARD_H }}>
        {TASKS.map(task => {
          const slotIndex = order.indexOf(task.id)
          const slot = SLOTS[slotIndex]
          const isFront = slotIndex === 0
          const isExiting = exiting?.id === task.id
          const isReturning = returning.has(task.id)
          const cardBg = isDark ? task.bg : task.bgLight
          const cardAccent = isDark ? task.accent : task.accentLight
          const textPrimary = isDark ? '#FFFFFF' : '#111111'
          const textMuted = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)'

          return (
            <motion.div
              key={task.id}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: CARD_W,
                height: CARD_H,
                marginLeft: -CARD_W / 2,
                marginTop: -CARD_H / 2,
                zIndex: isExiting ? 10 : slot.z,
                borderRadius: 20,
                overflow: 'hidden',
                cursor: isFront ? 'grab' : 'default',
                background: cardBg,
                boxShadow: isDark
                  ? '0 4px 20px rgba(0,0,0,0.25)'
                  : '0 4px 16px rgba(0,0,0,0.07)',
                filter: hoveredId === task.id ? 'url(#paper-warp)' : 'none',
              }}
              animate={
                isExiting
                  ? {
                      x: exiting!.dir === 'left' ? -480 : 480,
                      y: 100,
                      rotate: exiting!.dir === 'left' ? -22 : 22,
                      scale: 0.85,
                      opacity: 0,
                    }
                  : {
                      x: slot.x,
                      y: slot.y,
                      rotate: slot.rotate,
                      scale: slot.scale,
                      opacity: 1,
                    }
              }
              transition={
                isExiting
                  ? { duration: 0.42, ease: [0.4, 0, 0.2, 1] }
                  : isReturning
                  ? { duration: 0 }
                  : SPRING
              }
              onHoverStart={() => startWarp(task.id)}
              onHoverEnd={stopWarp}
              drag={isFront && !dismissing.current ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragStart={() => { dragDelta.current = 0 }}
              onDrag={(_, info) => { dragDelta.current = info.offset.x }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 400) {
                  dismiss(info.offset.x < 0 ? 'left' : 'right')
                }
              }}
            >
              {/* Top accent bar */}
              <div style={{ height: 4, background: cardAccent }} />

              {/* Card content */}
              <div
                style={{
                  padding: '18px 20px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'calc(100% - 4px)',
                  boxSizing: 'border-box',
                }}
              >
                {/* Category + number row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <Tag weight="regular" size={11} style={{ color: cardAccent }} />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: cardAccent,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {task.category}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: textMuted,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {task.due}
                  </span>
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: textPrimary,
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    margin: 0,
                    marginBottom: 14,
                  }}
                >
                  {task.title}
                </h2>

                {/* Description */}
                <p
                  style={{
                    fontSize: 13,
                    color: textMuted,
                    lineHeight: 1.6,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {task.description}
                </p>

                {/* Bottom row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                >
                  {/* Status badge */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '5px 11px',
                      borderRadius: 30,
                      background: isDark ? `${cardAccent}18` : `${cardAccent}20`,
                      border: `1.5px solid ${isDark ? `${cardAccent}40` : `${cardAccent}60`}`,
                    }}
                  >
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: cardAccent,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: cardAccent,
                      }}
                    >
                      {task.status}
                    </span>
                  </div>

                </div>
              </div>
            </motion.div>
          )
        })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => dismiss('right')}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label="Next card"
        >
          <ArrowRight weight="regular" size={14} style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }} />
        </button>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', gap: 5, marginTop: 24 }}>
        {TASKS.map(task => (
          <motion.div
            key={task.id}
            style={{
              height: 5,
              borderRadius: 3,
              background: isDark ? frontTask.accent : frontTask.accentLight,
            }}
            animate={{
              width: order[0] === task.id ? 20 : 5,
              opacity: order[0] === task.id ? 1 : 0.2,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        ))}
      </div>
    </div>
  )
}
