'use client'

import { useState, useRef, useEffect, useId } from 'react'
import { motion } from 'framer-motion'

// ─── LiquidButton ──────────────────────────────────────────────────────────────
// A CTA button with an organic liquid blob inside it, clipped to the button
// shape. At rest the blob slowly oscillates. On hover it surges and expands
// to fill most of the button. The label sits above the blob on the z-axis.
//
// Both light and dark mode are supported. The blob colour is olive-500
// (#7D8D41). Surface and border colours adapt per theme.

// ── Constants ──────────────────────────────────────────────────────────────────

const BUTTON_W  = 200   // px — logical width fed to the SVG viewBox
const BUTTON_H  = 56    // px — logical height fed to the SVG viewBox
const RX        = 14    // corner radius of the clip rect (matches border-radius)

// Blob rest geometry: a wide flat ellipse sitting in the lower half
const REST_CX = BUTTON_W / 2        // 100
const REST_CY = BUTTON_H * 0.60     // 33.6
const REST_RX = BUTTON_W * 0.42     // 84
const REST_RY = BUTTON_H * 0.28     // 15.68

// Blob hover geometry: fills most of the button
const HOVER_CX = BUTTON_W / 2       // 100
const HOVER_CY = BUTTON_H * 0.48    // 26.88
const HOVER_RX = BUTTON_W * 0.72    // 144
const HOVER_RY = BUTTON_H * 0.70    // 39.2

// Idle oscillation amounts
const D_RX  = 6   // ± horizontal radius wobble
const D_RY  = 3   // ± vertical radius wobble
const D_CY  = 3   // ± vertical centre drift
const D_CX  = 4   // ± horizontal centre drift

// Theme colour palettes
const DARK = {
  bg:         '#110F0C',
  border:     '#4A453F',
  label:      '#FAF7F2',
  labelHover: '#110F0C',
  blob:       '#7D8D41',
}

const LIGHT = {
  bg:         '#F5F1EA',
  border:     '#DDD8CE',
  label:      '#1C1916',
  labelHover: '#110F0C',
  blob:       '#7D8D41',
}

// ── Shared transition configs ──────────────────────────────────────────────────

const IDLE_TRANSITION = {
  duration:   4,
  repeat:     Infinity,
  repeatType: 'mirror' as const,
  ease:       'easeInOut' as const,
}

const HOVER_TRANSITION = {
  type:      'spring' as const,
  stiffness: 90,
  damping:   14,
}

// ── Component ──────────────────────────────────────────────────────────────────

export function LiquidButton() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark]       = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Unique clip-path ID — avoids collisions when multiple instances render
  const uid    = useId()
  const clipId = `lbclip-${uid}`

  // Detect theme from [data-card-theme] wrapper, then <html>
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function check() {
      const card = el!.closest('[data-card-theme]')
      setIsDark(
        card
          ? card.classList.contains('dark')
          : document.documentElement.classList.contains('dark')
      )
    }

    check()

    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) {
      observer.observe(cardWrapper, {
        attributes: true,
        attributeFilter: ['class'],
      })
    }
    return () => observer.disconnect()
  }, [])

  const c = isDark ? DARK : LIGHT

  // ── Blob animate objects (avoids Variants type conflict with SVG attrs) ─────

  const mainBlobAnimate = isHovered
    ? { cx: HOVER_CX, cy: HOVER_CY, rx: HOVER_RX, ry: HOVER_RY, transition: HOVER_TRANSITION }
    : {
        cx: [REST_CX, REST_CX - D_CX, REST_CX + D_CX, REST_CX],
        cy: [REST_CY, REST_CY - D_CY, REST_CY + D_CY, REST_CY],
        rx: [REST_RX, REST_RX + D_RX, REST_RX - D_RX, REST_RX],
        ry: [REST_RY, REST_RY - D_RY, REST_RY + D_RY, REST_RY],
        transition: IDLE_TRANSITION,
      }

  const glowBlobAnimate = isHovered
    ? { cx: HOVER_CX, cy: HOVER_CY, rx: HOVER_RX + 18, ry: HOVER_RY + 10, transition: HOVER_TRANSITION }
    : {
        cx: [REST_CX, REST_CX - D_CX, REST_CX + D_CX, REST_CX],
        cy: [REST_CY, REST_CY - D_CY, REST_CY + D_CY, REST_CY],
        rx: [REST_RX + 18, REST_RX + 18 + D_RX, REST_RX + 18 - D_RX, REST_RX + 18],
        ry: [REST_RY + 10, REST_RY + 10 - D_RY, REST_RY + 10 + D_RY, REST_RY + 10],
        transition: IDLE_TRANSITION,
      }

  const specularAnimate = isHovered
    ? {
        cx: HOVER_CX - 18,
        cy: HOVER_CY - 10,
        rx: 28,
        ry: 8,
        opacity: 0.35,
        transition: HOVER_TRANSITION,
      }
    : {
        cx: [REST_CX - 14, REST_CX - 18, REST_CX - 10, REST_CX - 14],
        cy: [REST_CY - 7,  REST_CY - 10, REST_CY - 5,  REST_CY - 7],
        rx: 18,
        ry: 5,
        opacity: 0.22,
        transition: IDLE_TRANSITION,
      }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950"
    >
      {/* Entrance animation */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        {/*
          The button:
          1. An SVG layer (absolute, fills button) renders the clipped blob
          2. A text label is rendered on top via z-index
        */}
        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative cursor-pointer overflow-hidden font-sans"
          style={{
            width:        BUTTON_W,
            height:       BUTTON_H,
            borderRadius: RX,
            border:       `1.5px solid ${c.border}`,
            background:   c.bg,
            boxShadow:    isHovered
              ? `0 6px 28px rgba(125,141,65,0.28), 0 1px 4px rgba(0,0,0,0.18)`
              : `0 2px 8px rgba(0,0,0,0.12)`,
            transition:   'box-shadow 0.35s ease',
          }}
        >
          {/* SVG liquid layer — absolute, behind label */}
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${BUTTON_W} ${BUTTON_H}`}
            width={BUTTON_W}
            height={BUTTON_H}
            className="absolute inset-0"
            style={{ pointerEvents: 'none' }}
          >
            <defs>
              <clipPath id={clipId}>
                <rect
                  x="0"
                  y="0"
                  width={BUTTON_W}
                  height={BUTTON_H}
                  rx={RX}
                  ry={RX}
                />
              </clipPath>
            </defs>

            <g clipPath={`url(#${clipId})`}>
              {/* 1 — Diffuse glow layer */}
              <motion.ellipse
                animate={glowBlobAnimate}
                fill={c.blob}
                fillOpacity={0.22}
                style={{ filter: 'blur(10px)' }}
                cx={REST_CX}
                cy={REST_CY}
                rx={REST_RX + 18}
                ry={REST_RY + 10}
              />

              {/* 2 — Main solid blob */}
              <motion.ellipse
                animate={mainBlobAnimate}
                fill={c.blob}
                fillOpacity={isHovered ? 0.92 : 0.78}
                style={{ transition: 'fill-opacity 0.3s ease' }}
                cx={REST_CX}
                cy={REST_CY}
                rx={REST_RX}
                ry={REST_RY}
              />

              {/* 3 — Specular highlight */}
              <motion.ellipse
                animate={specularAnimate}
                fill="#fff"
                cx={REST_CX - 14}
                cy={REST_CY - 7}
                rx={18}
                ry={5}
              />
            </g>
          </svg>

          {/* Label — above blob */}
          <motion.span
            className="relative z-10 flex h-full items-center justify-center font-sans text-sm font-semibold tracking-wider"
            animate={{ color: isHovered ? c.labelHover : c.label }}
            transition={{ duration: 0.22 }}
          >
            Get Started
          </motion.span>
        </motion.button>
      </motion.div>
    </div>
  )
}
