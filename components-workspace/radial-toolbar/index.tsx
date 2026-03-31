'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import {
  X,
  TextB,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  LinkSimple,
  Palette,
} from '@phosphor-icons/react'

// ─── Types & Constants ────────────────────────────────────────────────────────

interface Tool {
  id: string
  label: string
  Icon: PhosphorIcon
}

const CX = 120
const CY = 120
const R_IN  = 30   // exactly half the button diameter (60px / 2) — no gap
const R_OUT = 114
const R_ICON = 78
const GAP   = 0

const TOOLS: Tool[] = [
  { id: 'bold',    label: 'Bold',          Icon: TextB },
  { id: 'italic',  label: 'Italic',        Icon: TextItalic },
  { id: 'under',   label: 'Underline',     Icon: TextUnderline },
  { id: 'strike',  label: 'Strikethrough', Icon: TextStrikethrough },
  { id: 'link',    label: 'Link',          Icon: LinkSimple },
  { id: 'color',   label: 'Color',         Icon: Palette },
]

// ─── Geometry ─────────────────────────────────────────────────────────────────

const toRad = (d: number) => (d - 90) * (Math.PI / 180)

function wedgePath(startDeg: number, endDeg: number): string {
  const s = toRad(startDeg + GAP)
  const e = toRad(endDeg   - GAP)
  const x1 = CX + R_IN  * Math.cos(s);  const y1 = CY + R_IN  * Math.sin(s)
  const x2 = CX + R_OUT * Math.cos(s);  const y2 = CY + R_OUT * Math.sin(s)
  const x3 = CX + R_OUT * Math.cos(e);  const y3 = CY + R_OUT * Math.sin(e)
  const x4 = CX + R_IN  * Math.cos(e);  const y4 = CY + R_IN  * Math.sin(e)
  return `M${x1} ${y1}L${x2} ${y2}A${R_OUT} ${R_OUT} 0 0 1 ${x3} ${y3}L${x4} ${y4}A${R_IN} ${R_IN} 0 0 0 ${x1} ${y1}Z`
}

function iconXY(midDeg: number) {
  const r = toRad(midDeg)
  return { x: CX + R_ICON * Math.cos(r), y: CY + R_ICON * Math.sin(r) }
}

// ─── RadialToolbar ────────────────────────────────────────────────────────────

export function RadialToolbar() {
  const [open, setOpen]       = useState(false)
  const [hoveredId, setHover] = useState<string | null>(null)
  const [activeId,  setActive]= useState<string | null>(null)

  const handleTool = (id: string) => setActive(p => p === id ? null : id)
  const close = () => { setOpen(false); setActive(null); setHover(null) }

  const labelTool = TOOLS.find(t => t.id === hoveredId) ?? TOOLS.find(t => t.id === activeId)

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-zinc-950">

      {/* ── Wheel — fades in around the persistent circle ─────────────────── */}
      <AnimatePresence>
        {open && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              style={{
                width: 240,
                height: 240,
                position: 'relative',
                filter: 'drop-shadow(0 20px 48px rgba(0,0,0,0.7))',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <svg width={240} height={240} className="absolute inset-0">
                <circle
                  cx={CX} cy={CY} r={R_OUT + 1}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={1}
                />
                <defs>
                  <radialGradient id="activeGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
                  </radialGradient>
                </defs>

                {TOOLS.map((tool, i) => {
                  const isH = hoveredId === tool.id
                  const isA = activeId  === tool.id
                  return (
                    <path
                      key={tool.id}
                      d={wedgePath(i * 60, i * 60 + 60)}
                      style={{
                        fill: isA
                          ? 'url(#activeGrad)'
                          : isH
                            ? 'rgba(255,255,255,0.14)'
                            : 'rgba(255,255,255,0.07)',
                        stroke: 'rgba(255,255,255,0.04)',
                        strokeWidth: 1,
                        transition: 'fill 0.18s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={() => setHover(tool.id)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => handleTool(tool.id)}
                    />
                  )
                })}
              </svg>

              {/* Icons */}
              {TOOLS.map((tool, i) => {
                const { x, y } = iconXY(i * 60 + 30)
                const isH = hoveredId === tool.id
                const isA = activeId  === tool.id
                return (
                  <motion.div
                    key={`icon-${tool.id}`}
                    className="absolute flex items-center justify-center"
                    style={{
                      left: x - 12,
                      top:  y - 12,
                      width: 24,
                      height: 24,
                      pointerEvents: 'none',
                    }}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 320,
                      damping: 28,
                      delay: i * 0.035 + 0.05,
                    }}
                  >
                    <tool.Icon
                      size={18}
                      weight="regular"
                      color={isA ? '#ffffff' : isH ? '#e4e4e7' : '#71717a'}
                    />
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Persistent circle — always visible, only content inside animates ── */}
      <motion.button
        style={{
          position: 'relative',
          zIndex: 10,
          width: 60,
          height: 60,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={open ? close : () => setOpen(true)}
      >
        <AnimatePresence mode="wait">
          {!open ? (
            /* EDIT label */
            <motion.span
              key="edit"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{   opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#e4e4e7',
                userSelect: 'none',
              }}
            >
              EDIT
            </motion.span>
          ) : (
            /* X icon */
            <motion.span
              key="x-icon"
              initial={{ opacity: 0, rotate: -90, scale: 0.4 }}
              animate={{ opacity: 1, rotate: 0,   scale: 1   }}
              exit={{   opacity: 0, rotate: -90,  scale: 0.4 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              style={{ display: 'flex' }}
            >
              <X size={16} weight="regular" color="#a1a1aa" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Label pill ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && labelTool && (
          <motion.div
            key={labelTool.id}
            className="pointer-events-none absolute flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{
              top: 'calc(50% + 140px)',
              left: '50%',
              x: '-50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'var(--font-sans, sans-serif)',
              whiteSpace: 'nowrap',
            }}
            initial={{ opacity: 0, y: 8,  scale: 0.9  }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 4,  scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <labelTool.Icon size={11} weight="regular" color={activeId === labelTool.id ? '#e4e4e7' : '#71717a'} />
            <span className="text-xs font-medium text-zinc-400">{labelTool.label}</span>
            {activeId === labelTool.id && (
              <motion.span
                className="h-1 w-1 rounded-full bg-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 600, damping: 20 }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
