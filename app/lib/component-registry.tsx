import type { ComponentType } from 'react'
import type { Tag, Platform } from '../components/ComponentCard'
import { FloatingCards } from '../../components-workspace/floating-cards'
import { TextBlurReveal } from '../../components-workspace/text-blur-reveal'
import { ParticleSphere } from '../../components-workspace/particle-sphere'
import { TextLayoutCard } from '../../components-workspace/text-layout'
import { PolaroidStack } from '../../components-workspace/polaroid-stack'
import { prompts as polaroidStackPrompts } from '../../components-workspace/polaroid-stack/prompts'
import { GlitchButton } from '../../components-workspace/glitch-button'
import { prompts as glitchButtonPrompts } from '../../components-workspace/glitch-button/prompts'
import { FlipCalendar } from '../../components-workspace/flip-calendar'
import { prompts as flipCalendarPrompts } from '../../components-workspace/flip-calendar/prompts'
import { RunwayLoader } from '../../components-workspace/runway-loader'
import { prompts as runwayLoaderPrompts } from '../../components-workspace/runway-loader/prompts'
import { ChargingWidget } from '../../components-workspace/charging-widget'
import { prompts as chargingWidgetPrompts } from '../../components-workspace/charging-widget/prompts'
import { InteractiveDotGrid } from '../../components-workspace/dot-grid'
import { prompts as dotGridPrompts } from '../../components-workspace/dot-grid/prompts'
import { RadialToolbar } from '../../components-workspace/radial-toolbar'
import { prompts as radialToolbarPrompts } from '../../components-workspace/radial-toolbar/prompts'
import { XGrid } from '../../components-workspace/x-grid'
import { prompts as xGridPrompts } from '../../components-workspace/x-grid/prompts'
import { BlindPullToggle } from '../../components-workspace/blind-pull-toggle'
import { prompts as blindPullTogglePrompts } from '../../components-workspace/blind-pull-toggle/prompts'
import { PillToggle } from '../../components-workspace/pill-toggle'
import { prompts as pillTogglePrompts } from '../../components-workspace/pill-toggle/prompts'
import { MarkToggle } from '../../components-workspace/mark-toggle'
import { prompts as markTogglePrompts } from '../../components-workspace/mark-toggle/prompts'
import { TagaToggle } from '../../components-workspace/taga-toggle'
import { prompts as tagaTogglePrompts } from '../../components-workspace/taga-toggle/prompts'
import { NoiseBg } from '../../components-workspace/noise-bg'
import { prompts as noiseBgPrompts } from '../../components-workspace/noise-bg/prompts'
import { BubbleField } from '../../components-workspace/bubble-field'
import { prompts as bubbleFieldPrompts } from '../../components-workspace/bubble-field/prompts'
import { GridLines } from '../../components-workspace/grid-lines'
import { prompts as gridLinesPrompts } from '../../components-workspace/grid-lines/prompts'
import { DistortionGrid } from '../../components-workspace/distortion-grid'
import { prompts as distortionGridPrompts } from '../../components-workspace/distortion-grid/prompts'
import { WaveLines } from '../../components-workspace/wave-lines'
import { prompts as waveLinesPrompts } from '../../components-workspace/wave-lines/prompts'
import { SphereLines } from '../../components-workspace/sphere-lines'
import { prompts as sphereLinesPrompts } from '../../components-workspace/sphere-lines/prompts'
import { MagneticDots } from '../../components-workspace/magnetic-dots'
import { prompts as magneticDotsPrompts } from '../../components-workspace/magnetic-dots/prompts'
import { ElasticString } from '../../components-workspace/elastic-string'
import { prompts as elasticStringPrompts } from '../../components-workspace/elastic-string/prompts'
import { ParticleConstellation } from '../../components-workspace/particle-constellation'
import { prompts as particleConstellationPrompts } from '../../components-workspace/particle-constellation/prompts'
import { ScrambleText } from '../../components-workspace/scramble-text'
import { prompts as scrambleTextPrompts } from '../../components-workspace/scramble-text/prompts'
import { NeonClock } from '../../components-workspace/neon-clock'
import { prompts as neonClockPrompts } from '../../components-workspace/neon-clock/prompts'
import { NoiseField } from '../../components-workspace/noise-field'
import { prompts as noiseFieldPrompts } from '../../components-workspace/noise-field/prompts'
import { EmojiBurst } from '../../components-workspace/emoji-burst'
import { prompts as emojiBurstPrompts } from '../../components-workspace/emoji-burst/prompts'
import { GlassNavbar } from '../../components-workspace/glass-navbar'
import { prompts as glassNavbarPrompts } from '../../components-workspace/glass-navbar/prompts'
import { GlassTabBar } from '../../components-workspace/glass-tab-bar'
import { prompts as glassTabBarPrompts } from '../../components-workspace/glass-tab-bar/prompts'
import { GlassTags } from '../../components-workspace/glass-tags'
import { prompts as glassTagsPrompts } from '../../components-workspace/glass-tags/prompts'
import { GlassCard } from '../../components-workspace/glass-card'
import { prompts as glassCardPrompts } from '../../components-workspace/glass-card/prompts'
import { GlassModal } from '../../components-workspace/glass-modal'
import { prompts as glassModalPrompts } from '../../components-workspace/glass-modal/prompts'
import { GlassDock } from '../../components-workspace/glass-dock'
import { prompts as glassDockPrompts } from '../../components-workspace/glass-dock/prompts'
import { GlassSlider } from '../../components-workspace/glass-slider'
import { prompts as glassSliderPrompts } from '../../components-workspace/glass-slider/prompts'
import { GlassToggle } from '../../components-workspace/glass-toggle'
import { prompts as glassTogglePrompts } from '../../components-workspace/glass-toggle/prompts'
import { GlassMusicPlayer } from '../../components-workspace/glass-music-player'
import { prompts as glassMusicPlayerPrompts } from '../../components-workspace/glass-music-player/prompts'
import { GlassNotification } from '../../components-workspace/glass-notification'
import { prompts as glassNotificationPrompts } from '../../components-workspace/glass-notification/prompts'
import { GlassSidebar } from '../../components-workspace/glass-sidebar'
import { prompts as glassSidebarPrompts } from '../../components-workspace/glass-sidebar/prompts'
import { GlassUserMenu } from '../../components-workspace/glass-user-menu'
import { prompts as glassUserMenuPrompts } from '../../components-workspace/glass-user-menu/prompts'
import { GlassToast } from '../../components-workspace/glass-toast'
import { prompts as glassToastPrompts } from '../../components-workspace/glass-toast/prompts'
import GlassSearchBar from '../../components-workspace/glass-search-bar'
import { prompts as glassSearchBarPrompts } from '../../components-workspace/glass-search-bar/prompts'
import { GlassStepper } from '../../components-workspace/glass-stepper'
import { prompts as glassStepperPrompts } from '../../components-workspace/glass-stepper/prompts'
import { GlassProgress } from '../../components-workspace/glass-progress'
import { prompts as glassProgressPrompts } from '../../components-workspace/glass-progress/prompts'
import { GlassAiCompose } from '../../components-workspace/glass-ai-compose'
import { prompts as glassAiComposePrompts } from '../../components-workspace/glass-ai-compose/prompts'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ComponentEntry {
  slug: string
  name: string
  description: string
  tags: Tag[]
  image?: string
  dualTheme?: boolean
  PreviewComponent: ComponentType
  code: string
  prompts: Partial<Record<Platform, string>>
}

// Serializable subset of ComponentEntry — pass this across the
// server/client boundary when you don't need PreviewComponent / code / prompts
// (related grid, prev/next nav, etc).
export type ComponentMeta = Pick<
  ComponentEntry,
  'slug' | 'name' | 'description' | 'tags' | 'image'
>

// ─── Code strings ─────────────────────────────────────────────────────────────

const GRID_LINES_CODE = `'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Config ───────────────────────────────────────────────────────────────────
const SPACING      = 20     // px between dot/node centres
const RADIUS_FRAC  = 0.30   // hover influence radius — fraction of max(cw, ch)
const LENS_FRAC    = 0.06   // lens push strength — fraction of R
const BASE_A       = 0.13   // resting dot opacity
const PEAK_A       = 0.95   // fully-lit opacity
const LINE_A_DARK  = 0.07   // resting line opacity (dark theme)
const LINE_A_LIGHT = 0.12   // resting line opacity (light theme)

// ─── Types ────────────────────────────────────────────────────────────────────
// b  = brightness (0..1, smoothed)
// l  = lens influence (0..1, smoothed) — bell curve over distance from cursor
// px/py = current displaced position (recomputed each frame)
type Dot     = { x: number; y: number; b: number; l: number; px: number; py: number }
type Segment = { a: Dot; b: Dot }

// ─── Component ────────────────────────────────────────────────────────────────
export function GridLines() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const mouseRef     = useRef<{ x: number; y: number } | null>(null)
  const isDarkRef    = useRef(true)
  const [isDark, setIsDark] = useState(true)

  // ── Theme detection ──────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      const dark = card
        ? card.classList.contains('dark')
        : document.documentElement.classList.contains('dark')
      setIsDark(dark)
      isDarkRef.current = dark
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) observer.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // ── Canvas render loop ───────────────────────────────────────────────────────
  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    let dots: Dot[]     = []
    let hSegs: Segment[] = []
    let vSegs: Segment[] = []
    let animId = 0
    let alive  = true
    let cw = 0, ch = 0

    function build() {
      const dpr  = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      cw = rect.width
      ch = rect.height
      if (!cw || !ch) return
      canvas.width  = Math.round(cw * dpr)
      canvas.height = Math.round(ch * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cols = Math.floor(cw / SPACING) + 2
      const rows = Math.floor(ch / SPACING) + 2
      const ox   = (cw % SPACING) / 2
      const oy   = (ch % SPACING) / 2

      // Build dot grid as 2D array for easy neighbour lookup
      const grid: Dot[][] = []
      dots = []
      for (let r = 0; r < rows; r++) {
        grid[r] = []
        for (let c = 0; c < cols; c++) {
          const x = ox + c * SPACING
          const y = oy + r * SPACING
          const d: Dot = { x, y, b: 0, l: 0, px: x, py: y }
          dots.push(d)
          grid[r][c] = d
        }
      }

      // Build segments — horizontal and vertical only
      hSegs = []
      vSegs = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (c + 1 < cols) hSegs.push({ a: grid[r][c], b: grid[r][c + 1] })
          if (r + 1 < rows) vSegs.push({ a: grid[r][c], b: grid[r + 1][c] })
        }
      }
    }

    function frame() {
      if (!alive) return
      ctx.clearRect(0, 0, cw, ch)

      const mx        = mouseRef.current?.x ?? -99999
      const my        = mouseRef.current?.y ?? -99999
      const R         = RADIUS_FRAC * Math.max(cw, ch)
      const r2        = R * R
      const lensPush  = LENS_FRAC * R
      const dotRGB    = isDarkRef.current ? '255,255,255' : '28,25,22'
      const baseA     = isDarkRef.current ? BASE_A : 0.22
      const lineRestA = isDarkRef.current ? LINE_A_DARK : LINE_A_LIGHT

      // ── 1. Per-dot update: brightness, lens influence, displaced position ──
      // Brightness uses a Gaussian halo (soft blend into the background).
      // Lens uses a sin(πt) bell curve so dots at mid-distance get the
      // strongest outward push, dots at the cursor and at the edge of R
      // stay put — the grid bulges around the cursor like a lens.
      for (const d of dots) {
        const dx    = d.x - mx
        const dy    = d.y - my
        const dist2 = dx * dx + dy * dy
        const dist  = Math.sqrt(dist2)

        // Brightness — Gaussian
        const tgtB = dist2 < r2 ? Math.exp(-dist2 / (r2 * 0.45)) : 0
        d.b += (tgtB > d.b ? 0.16 : 0.07) * (tgtB - d.b)
        if (d.b < 0.004) d.b = 0

        // Lens influence — bell curve, peaks at mid-distance
        const tgtL = dist < R ? Math.sin(Math.PI * (dist / R)) : 0
        d.l += (tgtL > d.l ? 0.18 : 0.08) * (tgtL - d.l)
        if (d.l < 0.004) d.l = 0

        // Displaced position — push outward along the cursor→dot ray
        if (dist > 0.5 && d.l > 0.004) {
          const push = lensPush * d.l
          const ux   = dx / dist
          const uy   = dy / dist
          d.px = d.x + ux * push
          d.py = d.y + uy * push
        } else {
          d.px = d.x
          d.py = d.y
        }
      }

      // ── 2. Draw lines through displaced dot positions ──────────────────────
      // Because both endpoints move, lines bend as they cross the lens area,
      // making the grid visibly warp.
      const allSegs = [...hSegs, ...vSegs]
      for (const seg of allSegs) {
        const segB  = (seg.a.b + seg.b.b) / 2
        const lineA = lineRestA + (PEAK_A - lineRestA) * segB
        ctx.strokeStyle = \`rgba(\${dotRGB},\${lineA.toFixed(3)})\`
        ctx.lineWidth   = 0.5 + segB * 0.6
        ctx.beginPath()
        ctx.moveTo(seg.a.px, seg.a.py)
        ctx.lineTo(seg.b.px, seg.b.py)
        ctx.stroke()
      }

      // ── 3. Draw dots on top, at displaced positions ────────────────────────
      for (const d of dots) {
        const alpha = baseA + (PEAK_A - baseA) * d.b
        const sz    = 1 + d.b * 2.2
        ctx.fillStyle = \`rgba(\${dotRGB},\${alpha.toFixed(2)})\`
        ctx.fillRect(d.px - sz / 2, d.py - sz / 2, sz, sz)
      }

      animId = requestAnimationFrame(frame)
    }

    build()
    frame()

    const ro = new ResizeObserver(build)
    ro.observe(canvas.parentElement!)

    return () => {
      alive = false
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  function updateMouse(clientX: number, clientY: number) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top }
  }

  const bg         = isDark ? '#110F0C' : '#F5F1EA'
  const labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(28,25,22,0.45)'
  const hintColor  = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(28,25,22,0.22)'

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: bg }}
      onMouseMove={(e) => updateMouse(e.clientX, e.clientY)}
      onMouseLeave={() => { mouseRef.current = null }}
      onTouchMove={(e) => { const t = e.touches[0]; if (t) updateMouse(t.clientX, t.clientY) }}
      onTouchEnd={() => { mouseRef.current = null }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span style={{ color: labelColor, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Grid Lines
        </span>
        <span style={{ color: hintColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          hover to illuminate
        </span>
      </div>
    </div>
  )
}`

const DOT_GRID_CODE = `'use client'

import { useEffect, useRef } from 'react'

const SPACING = 20
const RADIUS  = 130
const BASE_A  = 0.13
const PEAK_A  = 0.92

export function InteractiveDotGrid() {
  const canvasRef = useRef(null)
  const mouseRef  = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let dots = [], animId = 0, alive = true, cw = 0, ch = 0

    function build() {
      const dpr  = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      cw = rect.width; ch = rect.height
      canvas.width  = Math.round(cw * dpr)
      canvas.height = Math.round(ch * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      const cols = Math.floor(cw / SPACING) + 2
      const rows = Math.floor(ch / SPACING) + 2
      const ox = (cw % SPACING) / 2, oy = (ch % SPACING) / 2
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          dots.push({ x: ox + c * SPACING, y: oy + r * SPACING, b: 0 })
    }

    function frame() {
      if (!alive) return
      ctx.clearRect(0, 0, cw, ch)
      const mx = mouseRef.current?.x ?? -99999
      const my = mouseRef.current?.y ?? -99999
      const r2 = RADIUS * RADIUS
      for (const d of dots) {
        const dx = d.x - mx, dy = d.y - my
        const dist2 = dx * dx + dy * dy
        const tgt = dist2 < r2 ? Math.pow(1 - Math.sqrt(dist2) / RADIUS, 1.5) : 0
        d.b += (tgt > d.b ? 0.16 : 0.07) * (tgt - d.b)
        if (d.b < 0.004) d.b = 0
        const alpha = BASE_A + (PEAK_A - BASE_A) * d.b
        const sz = 1 + d.b * 1.2
        ctx.fillStyle = \`rgba(255,255,255,\${alpha.toFixed(2)})\`
        ctx.fillRect(d.x - sz / 2, d.y - sz / 2, sz, sz)
      }
      animId = requestAnimationFrame(frame)
    }

    build()
    frame()
    const ro = new ResizeObserver(build)
    ro.observe(canvas.parentElement)
    return () => { alive = false; cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  function updateMouse(clientX, clientY) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top }
  }

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#110F0C' }}
      onMouseMove={(e) => updateMouse(e.clientX, e.clientY)}
      onMouseLeave={() => { mouseRef.current = null }}
      onTouchMove={(e) => { const t = e.touches[0]; if (t) updateMouse(t.clientX, t.clientY) }}
      onTouchEnd={() => { mouseRef.current = null }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, pointerEvents: 'none' }}>
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Dot Grid</span>
        <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>hover to illuminate</span>
      </div>
    </div>
  )
}`

const FLOATING_CARDS_CODE = `'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Rocket, Brain, Sparkle } from '@phosphor-icons/react'

const CARDS = [
  { Icon: Rocket,  title: 'Ship Fast',   sub: 'Drop-in components', delay: 0    },
  { Icon: Brain,   title: 'AI Prompts',  sub: 'For 5 platforms',    delay: 0.25 },
  { Icon: Sparkle, title: 'Open Source', sub: 'MIT licensed',       delay: 0.5  },
]

type PhosphorIcon = typeof Rocket

function FloatingCard({
  Icon,
  title,
  sub,
  delay,
  isDark,
}: {
  Icon: PhosphorIcon
  title: string
  sub: string
  delay: number
  isDark: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 3.5, delay, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.06, transition: { duration: 0.2, ease: 'easeOut' } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-1 cursor-default flex-col items-center gap-2 rounded-2xl px-2 py-4 backdrop-blur-sm sm:gap-3 sm:px-4 sm:py-6"
      style={{
        background: hovered
          ? (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.96)')
          : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.65)'),
        border: \`1px solid \${hovered ? 'rgba(167,139,250,0.40)' : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.09)')}\`,
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <div
        className="flex h-8 w-8 items-center justify-center rounded-xl sm:h-10 sm:w-10"
        style={{
          background: hovered ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.15)',
          transition: 'background 0.3s',
        }}
      >
        <Icon
          weight="duotone"
          size={18}
          style={{
            color: hovered
              ? (isDark ? '#c4b5fd' : '#7c3aed')
              : (isDark ? '#a78bfa' : '#8b5cf6'),
            transition: 'color 0.3s',
          }}
        />
      </div>
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span
          className="text-xs font-semibold sm:text-sm"
          style={{ color: isDark ? '#ffffff' : '#1C1916' }}
        >
          {title}
        </span>
        <span
          className="hidden text-[11px] sm:block"
          style={{
            color: hovered
              ? (isDark ? '#a1a1aa' : '#4A453F')
              : (isDark ? '#71717a' : '#736D65'),
            transition: 'color 0.3s',
          }}
        >
          {sub}
        </span>
      </div>
    </motion.div>
  )
}

export function FloatingCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(true)

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

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: \`radial-gradient(circle, \${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'} 1px, transparent 1px)\`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Violet glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-64 w-64 rounded-full blur-3xl"
          style={{ background: isDark ? 'rgba(124,58,237,0.20)' : 'rgba(109,81,160,0.12)' }}
        />
      </div>

      {/* Floating cards */}
      <div className="relative flex w-full items-center gap-3 px-4 sm:gap-5 sm:px-8">
        {CARDS.map(({ Icon, title, sub, delay }) => (
          <FloatingCard
            key={title}
            Icon={Icon}
            title={title}
            sub={sub}
            delay={delay}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  )
}`

const TEXT_BLUR_REVEAL_CODE = `'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WORDS = ['Craft', 'interfaces', 'that', 'feel', 'like', 'magic.']
const ACCENTED = new Set([1, 5]) // "interfaces", "magic."

export function TextBlurReveal() {
  const [cycle, setCycle] = useState(0)
  const [showReplay, setShowReplay] = useState(false)

  useEffect(() => {
    setShowReplay(false)
    const t1 = setTimeout(() => setShowReplay(true), 1500)
    const t2 = setTimeout(() => setCycle((c) => c + 1), 3650)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [cycle])

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap justify-center gap-x-[0.4em] gap-y-1">
        {WORDS.map((word, i) => (
          <motion.span
            key={\`\${cycle}-\${i}\`}
            initial={{ opacity: 0, y: 22, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.65,
              delay: i * 0.1,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className={
              ACCENTED.has(i)
                ? 'bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent'
                : 'text-4xl font-bold tracking-tight text-white'
            }
          >
            {word}
          </motion.span>
        ))}
      </div>

      <AnimatePresence>
        {showReplay && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCycle((c) => c + 1)}
            className="rounded-full border border-zinc-700 bg-zinc-800/70
                       px-3.5 py-1.5 text-xs text-zinc-400
                       hover:border-zinc-500 hover:text-zinc-200"
          >
            ↺ Replay
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}`

const PARTICLE_SPHERE_CODE = `'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const N = 9000

function makeSprite(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0.00, 'rgba(255,255,255,1.00)')
  grad.addColorStop(0.20, 'rgba(255,255,255,0.80)')
  grad.addColorStop(0.55, 'rgba(255,255,255,0.25)')
  grad.addColorStop(1.00, 'rgba(255,255,255,0.00)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

function colorFromY(ny: number): [number, number, number] {
  if (ny >= 0) {
    return [1.0, 0.55 + ny * 0.37, 0.02 + ny * 0.63]
  }
  const d = -ny
  const v = 0.38 + d * 0.62
  return [v, v, v + (1 - d) * 0.07]
}

export function ParticleSphere() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const W = el.clientWidth || 500
    const H = el.clientHeight || 500

    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera(52, W / H, 0.1, 100)
    camera.position.z = 2.9

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000)
    el.appendChild(renderer.domElement)

    const positions = new Float32Array(N * 3)
    const colors    = new Float32Array(N * 3)

    for (let i = 0; i < N; i++) {
      const theta = Math.acos(2 * Math.random() - 1)
      const phi   = 2 * Math.PI * Math.random()
      const r     = 1.0 + (Math.random() - 0.5) * 0.14
      const x = r * Math.sin(theta) * Math.cos(phi)
      const y = r * Math.cos(theta)
      const z = r * Math.sin(theta) * Math.sin(phi)
      positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z
      const [cr, cg, cb] = colorFromY(Math.max(-1, Math.min(1, y / r)))
      colors[i * 3] = cr; colors[i * 3 + 1] = cg; colors[i * 3 + 2] = cb
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3))

    const sprite = makeSprite()
    const mat    = new THREE.PointsMaterial({
      size: 0.032, map: sprite, vertexColors: true,
      transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const mesh = new THREE.Points(geo, mat)
    mesh.rotation.x = 0.28
    mesh.rotation.z = 0.08
    scene.add(mesh)

    let raf: number, t = 0
    function tick() {
      raf = requestAnimationFrame(tick)
      t += 0.004
      mesh.rotation.y = t
      mesh.rotation.z = 0.08 + Math.sin(t * 0.4) * 0.04
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      geo.dispose(); mat.dispose(); sprite.dispose(); renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={ref} className="h-full w-full" />
}`

const TEXT_LAYOUT_CODE = `'use client'

import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'
import type { AnimationPlaybackControls } from 'framer-motion'

// Font must exactly match your CSS font declaration
const TEXT   = 'Pretext computes wrap and height via canvas. No DOM reflow. ~0.09ms per layout call.'
const FONT   = '14px "Courier New"'
const LINE_H = 22   // must match CSS line-height
const W_MIN  = 160
const W_MAX  = 320

export function TextLayout() {
  const motionWidth  = useMotionValue(W_MIN)
  const widthRef     = useRef<HTMLSpanElement>(null)
  const heightRef    = useRef<HTMLSpanElement>(null)
  const lineCountRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let controls: AnimationPlaybackControls | undefined
    let unsub: (() => void) | undefined

    const prepared = prepareWithSegments(TEXT, FONT)

    function flush(w: number) {
      const rw = Math.round(w)
      const { height, lineCount } = layoutWithLines(prepared, rw, LINE_H)
      if (widthRef.current)     widthRef.current.textContent     = String(rw)
      if (heightRef.current)    heightRef.current.textContent    = String(height)
      if (lineCountRef.current) lineCountRef.current.textContent = String(lineCount)
    }

    flush(W_MIN)
    unsub    = motionWidth.on('change', flush)
    controls = animate(motionWidth, [W_MIN, W_MAX, W_MIN], {
      duration: 5, ease: 'easeInOut', repeat: Infinity,
    })

    return () => { unsub?.(); controls?.stop() }
  }, [motionWidth])

  const progress = useTransform(motionWidth, [W_MIN, W_MAX], ['0%', '100%'])

  return (
    <div style={{ fontFamily: '"Courier New", monospace', fontSize: 14, lineHeight: '22px' }}>
      <motion.div style={{ width: motionWidth }} className="border rounded p-3">
        {TEXT}
      </motion.div>
      <motion.div style={{ width: progress }} className="h-1 bg-amber-400 mt-2" />
      <p>width: <span ref={widthRef} /> px</p>
      <p>height: <span ref={heightRef} /> px &nbsp; lines: <span ref={lineCountRef} /></p>
    </div>
  )
}`

const POLAROID_STACK_CODE = `'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardData {
  id: number
  label: string
  from: string
  to: string
}

interface Pos {
  x: number
  y: number
  rotate: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CARD_W = 110
const CARD_H = 140

const CARDS: CardData[] = [
  { id: 0, label: 'Sunset', from: '#FF6B6B', to: '#FF8E53' },
  { id: 1, label: 'Ocean',  from: '#14B8A6', to: '#67E8F9' },
  { id: 2, label: 'Dream',  from: '#8B5CF6', to: '#C4B5FD' },
  { id: 3, label: 'Golden', from: '#F59E0B', to: '#FDE68A' },
  { id: 4, label: 'Mist',   from: '#64748B', to: '#CBD5E1' },
]

// Slight random offsets so the stack looks natural
const STACKED: Pos[] = [
  { x: -6, y:  2, rotate: -12 },
  { x:  3, y: -4, rotate:  -5 },
  { x:  1, y:  1, rotate:   2 },
  { x: -4, y:  3, rotate:   8 },
  { x:  5, y: -2, rotate:  14 },
]

// Arc fan: x spreads ±160 px, y dips at edges to form an arc
const FANNED: Pos[] = [
  { x: -160, y: 30, rotate: -22 },
  { x:  -80, y:  8, rotate: -11 },
  { x:    0, y: -4, rotate:   0 },
  { x:   80, y:  8, rotate:  11 },
  { x:  160, y: 30, rotate:  22 },
]

// ─── PolaroidStack ─────────────────────────────────────────────────────────────

export function PolaroidStack() {
  const [fanned, setFanned] = useState(false)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const toggle = () => {
    setFanned((f) => !f)
    setHoveredId(null)
    setSelectedId(null)
  }

  return (
    <>
      {/* Load Caveat font for polaroid labels */}
      <style>{\`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap');\`}</style>

      <div
        className="relative flex h-full w-full cursor-pointer select-none items-center justify-center bg-zinc-950"
        onClick={toggle}
      >
        {/* Fixed-size stage so cards don't overflow the preview */}
        <div className="relative" style={{ width: 460, height: 220 }}>
          {CARDS.map((card, i) => {
            const pos = fanned ? FANNED[i] : STACKED[i]
            const isHovered = fanned && hoveredId === card.id && selectedId !== card.id
            const isSelected = fanned && selectedId === card.id

            return (
              // Outer layer: fan / stack position with per-card stagger
              <motion.div
                key={card.id}
                className="absolute left-1/2 top-1/2"
                animate={{
                  x: pos.x - CARD_W / 2,
                  y: pos.y - CARD_H / 2,
                  rotate: isSelected ? 0 : pos.rotate,
                }}
                style={{ zIndex: isSelected ? 30 : isHovered ? 20 : i }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 22,
                  // Fan out: left → right stagger; stack back: right → left
                  delay: fanned
                    ? i * 0.06
                    : (CARDS.length - 1 - i) * 0.05,
                }}
              >
                {/* Inner layer: hover lift + click expand — no stagger delay */}
                <motion.div
                  animate={{
                    y: isSelected ? -28 : isHovered ? -18 : 0,
                    scale: isSelected ? 1.4 : isHovered ? 1.1 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                  style={{ cursor: fanned ? 'pointer' : 'inherit' }}
                  onHoverStart={() => { if (fanned) setHoveredId(card.id) }}
                  onHoverEnd={() => setHoveredId(null)}
                  onClick={(e) => {
                    if (!fanned) return
                    e.stopPropagation()
                    setSelectedId((id) => (id === card.id ? null : card.id))
                    setHoveredId(null)
                  }}
                >
                  {/* Polaroid frame */}
                  <div
                    style={{
                      width: CARD_W,
                      height: CARD_H,
                      backgroundColor: '#ffffff',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '8px 8px 0 8px',
                      boxShadow: isSelected
                        ? '0 32px 64px rgba(0,0,0,0.7), 0 12px 24px rgba(0,0,0,0.4)'
                        : isHovered
                          ? '0 20px 40px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.3)'
                          : '0 4px 20px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.15)',
                      transition: 'box-shadow 0.25s ease',
                    }}
                  >
                    {/* Gradient "photo" */}
                    <div
                      style={{
                        flexShrink: 0,
                        height: 93,
                        background: \`linear-gradient(135deg, \${card.from}, \${card.to})\`,
                      }}
                    />

                    {/* Label — fills the remaining bottom strip */}
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Caveat', cursive",
                          fontSize: 16,
                          fontWeight: 600,
                          color: '#3f3f46',
                          margin: 0,
                          lineHeight: 1,
                        }}
                      >
                        {card.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Toggle hint */}
        <motion.p
          key={\`\${String(fanned)}-\${String(selectedId !== null)}\`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-6 text-xs text-zinc-500"
          style={{
            pointerEvents: 'none',
            fontFamily: 'var(--font-sans, sans-serif)',
            letterSpacing: '0.03em',
          }}
        >
          {!fanned
            ? 'click to fan out'
            : selectedId !== null
              ? 'click card again to deselect'
              : 'click a card · click bg to stack'}
        </motion.p>
      </div>
    </>
  )
}`

const GLITCH_BUTTON_CODE = `'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'

// ─── GlitchButton ─────────────────────────────────────────────────────────────
// Terminal-inspired button with a glitch/scramble text effect on hover.
// Characters scramble through random symbols, then resolve left-to-right.
// Supports both light and dark themes.

const LABEL = 'INITIALIZE'
const GLITCH_CHARS = '@#$%&!*^~<>?+='
const SCRAMBLE_DURATION = 700 // ms total for full resolve
const SCRAMBLE_INTERVAL = 40  // ms between character updates

const DARK = {
  text: '#00ff41',
  textDim: 'rgba(0, 255, 65, 0.6)',
  glow: 'rgba(0, 255, 65, 0.15)',
  borderDefault: '#2E2A24',
}

const LIGHT = {
  text: '#2a6b0a',
  textDim: 'rgba(42, 107, 10, 0.7)',
  glow: 'rgba(42, 107, 10, 0.12)',
  borderDefault: '#DDD8CE',
}

function getRandomChar(): string {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
}

export function GlitchButton() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(true)

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

  const colors = isDark ? DARK : LIGHT

  const [displayText, setDisplayText] = useState(LABEL)
  const [isHovered, setIsHovered] = useState(false)
  const rafRef = useRef<number>(0)
  const isHoveredRef = useRef(false)
  const startTimeRef = useRef(0)
  const lastUpdateRef = useRef(0)

  const cleanup = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
  }, [])

  useEffect(() => {
    return () => { cleanup() }
  }, [cleanup])

  const scrambleTick = useCallback((timestamp: number) => {
    if (!isHoveredRef.current) return

    const elapsed = timestamp - startTimeRef.current
    const resolvePerChar = SCRAMBLE_DURATION / LABEL.length

    if (timestamp - lastUpdateRef.current < SCRAMBLE_INTERVAL) {
      rafRef.current = requestAnimationFrame(scrambleTick)
      return
    }
    lastUpdateRef.current = timestamp

    const resolvedCount = Math.min(
      Math.floor(elapsed / resolvePerChar),
      LABEL.length
    )

    if (resolvedCount >= LABEL.length) {
      setDisplayText(LABEL)
      return
    }

    const chars: string[] = []
    for (let i = 0; i < LABEL.length; i++) {
      chars.push(i < resolvedCount ? LABEL[i] : getRandomChar())
    }
    setDisplayText(chars.join(''))

    rafRef.current = requestAnimationFrame(scrambleTick)
  }, [])

  function handleMouseEnter() {
    isHoveredRef.current = true
    setIsHovered(true)
    startTimeRef.current = performance.now()
    lastUpdateRef.current = 0
    cleanup()
    rafRef.current = requestAnimationFrame(scrambleTick)
  }

  function handleMouseLeave() {
    isHoveredRef.current = false
    setIsHovered(false)
    cleanup()
    setDisplayText(LABEL)
  }

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative cursor-pointer px-8 py-4 font-mono text-lg font-semibold tracking-widest"
          style={{
            background: isDark ? '#110F0C' : '#F5F1EA',
            color: colors.text,
            boxShadow: isHovered
              ? \`0 0 20px \${colors.glow}, inset 0 0 12px \${colors.glow}\`
              : 'none',
            transition: 'box-shadow 0.3s',
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          {/* Corner brackets */}
          {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
            <span
              key={corner}
              className="pointer-events-none absolute"
              style={{
                width: 10,
                height: 10,
                top: corner.startsWith('t') ? 0 : 'auto',
                bottom: corner.startsWith('b') ? 0 : 'auto',
                left: corner.endsWith('l') ? 0 : 'auto',
                right: corner.endsWith('r') ? 0 : 'auto',
                borderColor: isHovered ? colors.textDim : colors.borderDefault,
                borderTopWidth: corner.startsWith('t') ? 1.5 : 0,
                borderBottomWidth: corner.startsWith('b') ? 1.5 : 0,
                borderLeftWidth: corner.endsWith('l') ? 1.5 : 0,
                borderRightWidth: corner.endsWith('r') ? 1.5 : 0,
                borderStyle: 'solid',
                transition: 'border-color 0.3s',
              }}
            />
          ))}

          <span className="relative z-10">{displayText}</span>
        </motion.button>
      </motion.div>
    </div>
  )
}`

// ─── Registry ─────────────────────────────────────────────────────────────────

const RUNWAY_LOADER_CODE = `'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Airplane({ isDark }: { isDark: boolean }) {
  const bodyTop   = isDark ? '#ececec' : '#c8c8c8'
  const bodyMid   = isDark ? '#ffffff' : '#dedede'
  const bodyBot   = isDark ? '#d0d0d0' : '#b4b4b4'
  const wingLight = isDark ? '#f8f8f8' : '#d8d8d8'
  const wingDark  = isDark ? '#bababa' : '#909090'
  const tail      = isDark ? '#c8c8c8' : '#a8a8a8'
  const nose      = isDark ? '#f4f4f4' : '#d8d8d8'

  return (
    <svg className="w-[52px] sm:w-[72px] h-auto" viewBox="0 0 72 46" fill="none"
      style={{
        filter: isDark
          ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.75)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
          : 'drop-shadow(0 2px 8px rgba(0,0,0,0.35)) drop-shadow(0 1px 3px rgba(0,0,0,0.2))',
      }}>
      <defs>
        <linearGradient id="rl-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bodyTop} /><stop offset="40%" stopColor={bodyMid} /><stop offset="100%" stopColor={bodyBot} />
        </linearGradient>
        <linearGradient id="rl-wing-t" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={wingLight} /><stop offset="100%" stopColor={wingDark} />
        </linearGradient>
        <linearGradient id="rl-wing-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={wingLight} /><stop offset="100%" stopColor={wingDark} />
        </linearGradient>
      </defs>
      <path d="M44,21 L28,21 L8,2 L18,0 Z" fill="url(#rl-wing-t)" />
      <path d="M44,25 L28,25 L8,44 L18,46 Z" fill="url(#rl-wing-b)" />
      <path d="M8,21 L2,14 L6,14 L12,21 Z" fill={tail} />
      <path d="M8,25 L2,32 L6,32 L12,25 Z" fill={tail} />
      <ellipse cx="34" cy="23" rx="29" ry="7" fill="url(#rl-body)" />
      <path d="M61,19.5 C66,21.5 67.5,23 67,23 C67.5,23 66,24.5 61,26.5 L58,23 Z" fill={nose} />
      <ellipse cx="57" cy="23" rx="4" ry="3" fill="#7ec8e8" opacity="0.9" />
    </svg>
  )
}

type Phase = 'taxiing' | 'takeoff' | 'resetting'

export function RunwayLoader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(true)

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

  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<Phase>('taxiing')
  const [cycle, setCycle] = useState(0)
  const rafRef         = useRef<number>()
  const startRef       = useRef<number>()
  const aliveRef       = useRef(true)
  const disappearedRef = useRef(false)
  const WALL_PCT = 91

  useEffect(() => {
    aliveRef.current = true
    disappearedRef.current = false
    const TAXI_MS = 5500
    function tick(ts: number) {
      if (!aliveRef.current) return
      if (!startRef.current) startRef.current = ts
      const t = Math.min((ts - startRef.current) / TAXI_MS, 1)
      const eased = t <= 0.75
        ? (t / 0.75) * 82
        : 82 + (1 - Math.pow(1 - (t - 0.75) / 0.25, 2)) * 18
      const p = Math.min(eased, 100)
      setProgress(p)
      if (p >= WALL_PCT && !disappearedRef.current) {
        disappearedRef.current = true
        setPhase('takeoff')
      }
      if (p < 100) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          if (!aliveRef.current) return
          setPhase('resetting')
          setTimeout(() => {
            if (!aliveRef.current) return
            disappearedRef.current = false
            startRef.current = undefined
            setProgress(0)
            setPhase('taxiing')
            setCycle((c) => c + 1)
            rafRef.current = requestAnimationFrame(tick)
          }, 400)
        }, 600)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { aliveRef.current = false; if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  const planePct = Math.min(progress, WALL_PCT)
  const trackBg = isDark ? 'linear-gradient(to bottom,#404040,#252525)' : 'linear-gradient(to bottom,#bab7b2,#a09d98)'
  const trackShadow = isDark
    ? 'inset 0 4px 12px rgba(0,0,0,0.85),inset 0 -1px 3px rgba(255,255,255,0.04),0 2px 8px rgba(0,0,0,0.5)'
    : 'inset 0 3px 8px rgba(0,0,0,0.22),inset 0 -1px 3px rgba(255,255,255,0.28),0 2px 5px rgba(0,0,0,0.12)'
  const dashColor = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.42)'

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}>
      <div className="flex w-full max-w-[440px] flex-col items-center gap-4 px-4 sm:gap-6 sm:px-6">
        <div className="relative h-11 w-full overflow-visible rounded-full sm:h-14"
          style={{ background: trackBg, boxShadow: trackShadow }}>
          <div className="pointer-events-none absolute top-1/2 -translate-y-px"
            style={{ left: 18, right: 18, height: 2,
              backgroundImage: \`repeating-linear-gradient(to right,\${dashColor} 0,\${dashColor} 10px,transparent 10px,transparent 24px)\` }} />
          <div className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: \`\${progress}%\`, background: 'linear-gradient(to right,#6b0000,#be1c1c 50%,#e03030)',
              boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.1)' }} />
          {phase === 'taxiing' && progress > 30 && (
            <motion.div className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full"
              style={{ right: \`calc(\${100 - planePct}% + 26px)\`,
                width: Math.min(((progress - 30) / 70) * 56, 56), height: 22,
                background: 'radial-gradient(ellipse at right,rgba(255,140,20,0.3),transparent)', filter: 'blur(8px)' }}
              animate={{ opacity: [0.3, 0.75, 0.2, 0.65, 0.3] }} transition={{ duration: 0.2, repeat: Infinity }} />
          )}
          <AnimatePresence>
            {phase !== 'resetting' && (
              <div key={\`plane-\${cycle}\`} className="pointer-events-none absolute top-1/2 z-20"
                style={{ left: \`\${planePct}%\`, transform: 'translateX(-50%) translateY(-50%)' }}>
                {phase === 'taxiing' ? <Airplane isDark={isDark} /> : (
                  <motion.div initial={{ opacity: 1, x: 0, scale: 1 }} animate={{ opacity: 0, x: 120, scale: 1.8 }}
                    transition={{ duration: 0.7, ease: 'easeIn' }}>
                    <Airplane isDark={isDark} />
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tabular-nums sm:text-[28px]"
              style={{ color: isDark ? '#FAF7F2' : '#1C1916' }}>
              {Math.round(progress)}
            </span>
            <span className="text-sm font-semibold sm:text-base" style={{ color: '#9E9890' }}>%</span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest sm:text-[11px]"
            style={{ color: isDark ? '#736D65' : '#9E9890' }}>
            {phase === 'takeoff' ? 'Taking off!' : phase === 'resetting' ? '—' : 'Preparing for takeoff'}
          </span>
        </div>
      </div>
    </div>
  )
}`

const CHARGING_WIDGET_CODE = `'use client'

import { useEffect, useRef, useState } from 'react'
import { useMotionValue, animate } from 'framer-motion'

const TARGET_PERCENT = 78
const COUNT_DURATION = 4
const PAUSE_DURATION = 1

export function ChargingWidget() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(true)

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

  const WAVE1_COLOR = isDark ? 'rgba(120, 60, 220, 0.45)' : 'rgba(109, 40, 217, 0.28)'
  const WAVE2_COLOR = isDark ? 'rgba(160, 80, 255, 0.70)' : 'rgba(124, 58, 237, 0.52)'
  const RING_COLOR  = isDark ? '#a855f7' : '#7c3aed'
  const BG_CIRCLE_COLOR = isDark ? 'rgba(120, 60, 220, 0.10)' : 'rgba(130, 60, 220, 0.06)'
  const TEXT_COLOR  = isDark ? '#ffffff' : '#1C1916'
  const TEXT_MUTED  = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(28,25,22,0.60)'
  const BOLT_COLOR  = isDark ? '#e0b0ff' : '#6d28d9'

  const percent = useMotionValue(0)
  const wave1Ref   = useRef<SVGPathElement>(null)
  const wave2Ref   = useRef<SVGPathElement>(null)
  const displayRef = useRef<SVGTextElement>(null)
  const percentRef = useRef(0)

  useEffect(() => {
    const unsub = percent.on('change', (v) => {
      percentRef.current = v
      if (displayRef.current) displayRef.current.textContent = Math.round(v).toString()
    })
    return unsub
  }, [percent])

  useEffect(() => {
    let alive = true
    async function run() {
      while (alive) {
        percent.set(0)
        await animate(percent, TARGET_PERCENT, { duration: COUNT_DURATION, ease: 'easeInOut' })
        if (!alive) break
        await new Promise<void>((resolve) => {
          const timer = setTimeout(resolve, PAUSE_DURATION * 1000)
          if (!alive) { clearTimeout(timer); resolve() }
        })
        if (!alive) break
      }
    }
    run()
    return () => { alive = false }
  }, [percent])

  useEffect(() => {
    let rafId: number
    let offset1 = 0
    let offset2 = 0

    function buildWavePath(fillY: number, amp: number, phase: number): string {
      let d = \`M 0 \${fillY}\`
      for (let x = 0; x <= 200; x += 2) {
        const y = fillY + Math.sin((x / 200) * 2 * Math.PI * 2 + phase) * amp
        d += \` L \${x} \${y}\`
      }
      d += \` L 200 200 L 0 200 Z\`
      return d
    }

    function tick() {
      const pct = percentRef.current
      const fillY = 200 - (pct / 100) * 200
      const amp = 14 * (1 - pct / 100) + 4
      offset1 += 0.025
      offset2 -= 0.018
      wave1Ref.current?.setAttribute('d', buildWavePath(fillY, amp, offset1))
      wave2Ref.current?.setAttribute('d', buildWavePath(fillY, amp, offset2 + Math.PI))
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const svgSize = 'min(260px, 56vw)'

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center"
      style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}
    >
      <svg viewBox="0 0 200 200" style={{ width: svgSize, height: svgSize }}>
        <defs>
          <clipPath id="cw-circle-clip">
            <circle cx="100" cy="100" r="88" />
          </clipPath>
          <filter id="cw-bolt-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feComposite in="blur" in2="SourceGraphic" operator="over" />
          </filter>
        </defs>

        <circle cx="100" cy="100" r="88" fill={BG_CIRCLE_COLOR} />

        <g clipPath="url(#cw-circle-clip)">
          <path ref={wave1Ref} fill={WAVE1_COLOR} d="M 0 200 L 200 200 L 200 200 L 0 200 Z" />
          <path ref={wave2Ref} fill={WAVE2_COLOR} d="M 0 200 L 200 200 L 200 200 L 0 200 Z" />
        </g>

        <circle cx="100" cy="100" r="88" fill="none" stroke={RING_COLOR} strokeWidth="3" />

        <g transform="translate(100, 52) scale(0.7)" filter="url(#cw-bolt-glow)">
          <path d="M 8 -20 L -8 2 L 0 2 L -8 20 L 8 -2 L 0 -2 Z" fill={BOLT_COLOR} />
        </g>

        <text
          ref={displayRef}
          x="100" y="118"
          textAnchor="middle" dominantBaseline="middle"
          fill={TEXT_COLOR} fontSize="42" fontWeight="800"
          fontFamily="Manrope, sans-serif" letterSpacing="-1"
        >
          0
        </text>

        <text
          x="100" y="140"
          textAnchor="middle" dominantBaseline="middle"
          fill={TEXT_MUTED} fontSize="14" fontWeight="600"
          fontFamily="Manrope, sans-serif"
        >
          %
        </text>
      </svg>
    </div>
  )
}`

const FLIP_CALENDAR_CODE = `'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
const FLIP_MS = 220

function fmt(n: number) { return String(n).padStart(2, '0') }

export function FlipCalendar() {
  const [topDisplay,    setTopDisplay   ] = useState(1)
  const [bottomDisplay, setBottomDisplay] = useState(1)
  const [flapContent,   setFlapContent  ] = useState(1)
  const [flapVisible,   setFlapVisible  ] = useState(false)
  const [flapping,      setFlapping     ] = useState(false)
  const currentRef = useRef(1)
  const rootRef    = useRef<HTMLDivElement>(null)
  const [isDark,   setIsDark           ] = useState(true)

  const rotateX  = useMotionValue(0)
  const scanY    = useMotionValue(18)
  const scanYPct = useTransform(scanY, (v) => \`\${v}%\`)
  const tiltX    = useMotionValue(0)
  const tiltY    = useMotionValue(0)

  const aliveRef = useRef(true)
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    aliveRef.current = true
    return () => {
      aliveRef.current = false
      timeouts.current.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    const el = rootRef.current
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

  function sched(fn: () => void, ms: number) {
    const id = setTimeout(() => { if (aliveRef.current) fn() }, ms)
    timeouts.current.push(id)
  }

  function runFlip(target: number, durationMs: number, dir: 'next' | 'prev', onDone?: () => void) {
    const prev = currentRef.current
    currentRef.current = target
    setFlapContent(prev)
    setFlapVisible(true)

    if (dir === 'next') {
      scanY.set(18)
      animate(scanY, 104, { duration: (durationMs * 2) / 1000, ease: 'linear' })
    } else {
      scanY.set(104)
      animate(scanY, 18, { duration: (durationMs * 2) / 1000, ease: 'linear' })
    }

    rotateX.set(0)
    animate(rotateX, -90, { duration: durationMs / 1000, ease: 'easeIn' })

    sched(() => {
      setTopDisplay(target)
      setBottomDisplay(target)
      setFlapContent(target)
      rotateX.set(90)
      animate(rotateX, 0, { duration: durationMs / 1000, ease: 'easeOut' })
    }, durationMs)

    sched(() => {
      setFlapVisible(false)
      onDone?.()
    }, durationMs * 2 + 20)
  }

  function flip(dir: 'next' | 'prev') {
    if (flapping) return
    const cur = currentRef.current
    const target = dir === 'next' ? (cur === 31 ? 1 : cur + 1) : (cur === 1 ? 31 : cur - 1)
    setFlapping(true)
    runFlip(target, FLIP_MS, dir, () => setFlapping(false))
  }

  function onDragEnd(_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (Math.abs(info.offset.y) < 40 && Math.abs(info.velocity.y) < 300) return
    flip(info.offset.y > 0 || info.velocity.y > 300 ? 'next' : 'prev')
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (flapping) return
    const r = e.currentTarget.getBoundingClientRect()
    animate(tiltX, ((e.clientY - r.top) / r.height - 0.5) * -11, { duration: 0.12, ease: 'linear' })
    animate(tiltY, ((e.clientX - r.left) / r.width - 0.5) * 11, { duration: 0.12, ease: 'linear' })
  }

  function handleMouseLeave() {
    animate(tiltX, 0, { type: 'spring', stiffness: 160, damping: 18 })
    animate(tiltY, 0, { type: 'spring', stiffness: 160, damping: 18 })
  }

  const topGrad    = isDark ? 'linear-gradient(155deg, #3572cc 0%, #2d62bc 55%, #2455a0 100%)' : 'linear-gradient(155deg, #4e9aec 0%, #3d88da 55%, #3078c8 100%)'
  const flapGrad   = isDark ? 'linear-gradient(155deg, #2d64bc 0%, #2556ac 55%, #1e4894 100%)' : 'linear-gradient(155deg, #4290de 0%, #3480cc 55%, #2870bc 100%)'
  const bottomGrad = isDark ? 'linear-gradient(155deg, #4a8edc 0%, #5a9eec 55%, #68aef4 100%)' : 'linear-gradient(155deg, #5aaaee 0%, #6abaf8 55%, #76c4fc 100%)'
  const headerGrad = isDark ? 'linear-gradient(180deg, #2a2724 0%, #1e1c19 100%)' : 'linear-gradient(180deg, #d8d4ce 0%, #c6c2bc 100%)'
  const ringGrad   = isDark ? 'radial-gradient(circle at 35% 30%, #f4f0ea 0%, #c0bcb6 45%, #888480 100%)' : 'radial-gradient(circle at 35% 30%, #ffffff 0%, #dedad4 45%, #aeaaa4 100%)'
  const cardShadow = isDark ? '0 40px 100px rgba(20,55,155,0.65), 0 12px 32px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)' : '0 40px 100px rgba(40,100,220,0.32), 0 12px 32px rgba(0,0,0,0.16), 0 0 0 1px rgba(255,255,255,0.9)'
  const seam       = isDark ? 'rgba(0,0,0,0.42)' : 'rgba(0,0,0,0.22)'
  const numShadow  = isDark ? '0 4px 24px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.22)'

  return (
    <div ref={rootRef} className="flex h-full w-full flex-col items-center justify-center gap-6" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}>
      <div style={{ perspective: '900px' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.08}
          onDragEnd={onDragEnd}
          className="relative cursor-grab active:cursor-grabbing select-none"
          style={{ width: 'min(260px, 56vw)', aspectRatio: '1 / 1', rotate: '3deg', rotateX: tiltX, rotateY: tiltY }}
        >
          {[13, 8, 4].map((y, i) => (
            <div key={i} className="absolute inset-0" style={{
              background: isDark ? '#2E2A24' : '#C8C2B8',
              transform: \`translateY(\${y}px)\`,
              opacity: 0.28 + i * 0.2,
              zIndex: 0, borderRadius: 18,
              boxShadow: \`0 \${y * 2}px \${y * 4}px rgba(0,0,0,0.35)\`,
            }} />
          ))}
          <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1, boxShadow: cardShadow, borderRadius: 18 }}>
            <div className="absolute inset-x-0 top-0 flex items-end justify-center gap-8"
              style={{ height: '18%', background: headerGrad, zIndex: 12, borderRadius: '18px 18px 0 0', paddingBottom: 7 }}>
              {[0, 1].map((i) => (
                <div key={i} style={{ width: 15, height: 15, borderRadius: '50%', background: ringGrad,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.6)' }} />
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ top: '59%', background: bottomGrad }}>
              <Half n={bottomDisplay} half="bottom" numShadow={numShadow} />
            </div>
            <div className="absolute inset-x-0 overflow-hidden" style={{ top: '18%', bottom: '41%', background: topGrad, borderRadius: '12px 12px 0 0' }}>
              <Half n={topDisplay} half="top" numShadow={numShadow} />
            </div>
            {flapVisible && (
              <div className="absolute inset-x-0" style={{ top: '18%', height: '41%', zIndex: 8 }}>
                <motion.div className="absolute inset-0 overflow-hidden"
                  style={{ background: flapGrad, rotateX, perspective: 140, transformOrigin: 'center bottom',
                    willChange: 'transform', borderRadius: '12px 12px 0 0', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)' }}>
                  <Half n={flapContent} half="top" numShadow={numShadow} />
                </motion.div>
                <div className="absolute inset-x-0 bottom-0 pointer-events-none"
                  style={{ height: 3, background: 'rgba(255,255,255,0.25)', zIndex: 9, boxShadow: '0 0 8px rgba(255,255,255,0.18)' }} />
              </div>
            )}
            {flapVisible && (
              <motion.div className="absolute inset-x-0 pointer-events-none"
                style={{ top: scanYPct, height: 2, borderRadius: '9999px', background: '#ffffff', opacity: 0.3, zIndex: 20 }} />
            )}
            <div className="absolute inset-x-0 pointer-events-none" style={{ top: 'calc(59% - 3px)', height: 6, background: seam, zIndex: 10 }} />
            <div className="absolute inset-x-0 pointer-events-none" style={{ top: 'calc(18% - 1px)', height: 1, background: 'rgba(0,0,0,0.22)', zIndex: 11 }} />
            <div className="absolute inset-x-0 pointer-events-none"
              style={{ top: '18%', height: '30%', background: 'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, transparent 100%)', borderRadius: '12px 12px 0 0', zIndex: 6 }} />
          </div>
        </motion.div>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}
        className="font-mono text-xs tracking-widest" style={{ color: isDark ? '#3a3530' : '#C8C2B8' }}>
        ↑ swipe ↓
      </motion.p>
    </div>
  )
}

interface HalfProps { n: number; half: 'top' | 'bottom'; numShadow: string }

function Half({ n, half, numShadow }: HalfProps) {
  return (
    <div className="absolute inset-x-0 flex items-center justify-center"
      style={{ height: '200%', top: half === 'top' ? 0 : undefined, bottom: half === 'bottom' ? 0 : undefined }}>
      <span className="font-sans font-bold select-none tabular-nums"
        style={{ fontSize: 'clamp(3.8rem, 13vw, 6.5rem)', color: '#ffffff', lineHeight: 1, letterSpacing: '-0.03em', textShadow: numShadow }}>
        {fmt(n)}
      </span>
    </div>
  )
}`

const RADIAL_TOOLBAR_CODE = `'use client'

import { useState, useEffect, useRef } from 'react'
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
  return \`M\${x1} \${y1}L\${x2} \${y2}A\${R_OUT} \${R_OUT} 0 0 1 \${x3} \${y3}L\${x4} \${y4}A\${R_IN} \${R_IN} 0 0 0 \${x1} \${y1}Z\`
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

  const containerRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(true)

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

  const handleTool = (id: string) => setActive(p => p === id ? null : id)
  const close = () => { setOpen(false); setActive(null); setHover(null) }

  const labelTool = TOOLS.find(t => t.id === hoveredId) ?? TOOLS.find(t => t.id === activeId)

  return (
    <div ref={containerRef} className="relative flex h-full w-full items-center justify-center" style={{ background: isDark ? '#0a0a0a' : '#F5F1EA' }}>

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
                  stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.10)'}
                  strokeWidth={1}
                />

                {TOOLS.map((tool, i) => {
                  const isH = hoveredId === tool.id
                  const isA = activeId  === tool.id
                  return (
                    <path
                      key={tool.id}
                      d={wedgePath(i * 60, i * 60 + 60)}
                      style={{
                        fill: isA
                          ? (isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.16)')
                          : isH
                            ? (isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.10)')
                            : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'),
                        stroke: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)',
                        strokeWidth: 1,
                        transition: 'fill 0.18s ease',
                        cursor: 'pointer',
                      }}
                      onPointerEnter={() => setHover(tool.id)}
                      onPointerLeave={() => setHover(null)}
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
                    key={\`icon-\${tool.id}\`}
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
                      color={isA ? (isDark ? '#ffffff' : '#110F0C') : isH ? (isDark ? '#e4e4e7' : '#2E2A24') : (isDark ? '#71717a' : '#9E9890')}
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
          background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
          border: \`1px solid \${isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)'}\`,
          boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
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
                color: isDark ? '#e4e4e7' : '#2E2A24',
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
              <X size={16} weight="regular" color={isDark ? '#a1a1aa' : '#4A453F'} />
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
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              border: \`1px solid \${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.10)'}\`,
              fontFamily: 'var(--font-sans, sans-serif)',
              whiteSpace: 'nowrap',
            }}
            initial={{ opacity: 0, y: 8,  scale: 0.9  }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 4,  scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <labelTool.Icon size={11} weight="regular" color={activeId === labelTool.id ? (isDark ? '#e4e4e7' : '#2E2A24') : (isDark ? '#71717a' : '#9E9890')} />
            <span className="text-xs font-medium" style={{ color: isDark ? '#a1a1aa' : '#736D65' }}>{labelTool.label}</span>
            {activeId === labelTool.id && (
              <motion.span
                className="h-1 w-1 rounded-full"
                style={{ background: isDark ? '#ffffff' : '#1C1916' }}
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
}`

const X_GRID_CODE = `'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Config ───────────────────────────────────────────────────────────────────
const SPACING = 20     // px between × centres
const RADIUS  = 130    // px — hover influence radius
const BASE_A  = 0.13   // resting × opacity
const PEAK_A  = 0.92   // fully-lit × opacity

export function XGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const mouseRef     = useRef<{ x: number; y: number } | null>(null)
  const isDarkRef    = useRef(true)
  const [isDark, setIsDark] = useState(true)

  // ── Theme detection ────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      const dark = card
        ? card.classList.contains('dark')
        : document.documentElement.classList.contains('dark')
      setIsDark(dark)
      isDarkRef.current = dark
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) observer.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // ── Canvas render loop ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    type Mark = { x: number; y: number; b: number; col: number; row: number }
    let marks: Mark[] = []
    let grid: Mark[][] = []
    let animId = 0
    let alive  = true
    let cw = 0, ch = 0

    function build() {
      const dpr  = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      cw = rect.width
      ch = rect.height
      if (!cw || !ch) return
      canvas.width  = Math.round(cw * dpr)
      canvas.height = Math.round(ch * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      marks = []
      grid  = []
      const cols = Math.floor(cw / SPACING) + 2
      const rows = Math.floor(ch / SPACING) + 2
      const ox   = (cw % SPACING) / 2
      const oy   = (ch % SPACING) / 2
      for (let r = 0; r < rows; r++) {
        grid[r] = []
        for (let c = 0; c < cols; c++) {
          const m: Mark = { x: ox + c * SPACING, y: oy + r * SPACING, b: 0, col: c, row: r }
          marks.push(m)
          grid[r][c] = m
        }
      }
    }

    function frame() {
      if (!alive) return
      ctx.clearRect(0, 0, cw, ch)

      // Reset lineWidth before the mark loop so it doesn't bleed between frames
      ctx.lineWidth = 0.5

      const mx      = mouseRef.current?.x ?? -99999
      const my      = mouseRef.current?.y ?? -99999
      const r2      = RADIUS * RADIUS
      const dotRGB  = isDarkRef.current ? '255,255,255' : '28,25,22'

      for (const d of marks) {
        const dx    = d.x - mx
        const dy    = d.y - my
        const dist2 = dx * dx + dy * dy
        const tgt   = dist2 < r2 ? Math.pow(1 - Math.sqrt(dist2) / RADIUS, 1.5) : 0

        // Fast attack, slow release — feels organic
        d.b += (tgt > d.b ? 0.16 : 0.07) * (tgt - d.b)
        if (d.b < 0.004) d.b = 0

        const arm   = 2 + d.b * 1.0   // arm length: 2px resting → 3px lit
        const sw    = 0.5 + d.b * 0.3 // stroke width: 0.5px resting → 0.8px lit
        const baseA = isDarkRef.current ? BASE_A : 0.25
        const alpha = baseA + (PEAK_A - baseA) * d.b
        ctx.strokeStyle = \`rgba(\${dotRGB},\${alpha.toFixed(2)})\`
        ctx.lineWidth = sw
        ctx.beginPath()
        ctx.moveTo(d.x - arm, d.y - arm)
        ctx.lineTo(d.x + arm, d.y + arm)
        ctx.moveTo(d.x + arm, d.y - arm)
        ctx.lineTo(d.x - arm, d.y + arm)
        ctx.stroke()
      }

      // ── Connection lines between lit neighbours ──────────────────────────────
      ctx.lineWidth = 0.5
      for (const d of marks) {
        if (d.b < 0.05) continue
        // Check right neighbour and bottom neighbour only (avoids drawing each line twice)
        const neighbours = [
          grid[d.row]?.[d.col + 1],     // right
          grid[d.row + 1]?.[d.col],     // below
          grid[d.row + 1]?.[d.col + 1], // diagonal down-right
          grid[d.row + 1]?.[d.col - 1], // diagonal down-left
        ]
        for (const n of neighbours) {
          if (!n || n.b < 0.05) continue
          const lineAlpha = Math.min(d.b, n.b) * 0.4
          ctx.strokeStyle = \`rgba(\${dotRGB},\${lineAlpha.toFixed(2)})\`
          ctx.beginPath()
          ctx.moveTo(d.x, d.y)
          ctx.lineTo(n.x, n.y)
          ctx.stroke()
        }
      }

      animId = requestAnimationFrame(frame)
    }

    build()
    frame()

    const ro = new ResizeObserver(build)
    ro.observe(canvas.parentElement!)

    return () => {
      alive = false
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  function updateMouse(clientX: number, clientY: number) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top }
  }

  const bg         = isDark ? '#110F0C' : '#F5F1EA'
  const labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(28,25,22,0.45)'
  const hintColor  = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(28,25,22,0.22)'

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: bg }}
      onMouseMove={(e) => updateMouse(e.clientX, e.clientY)}
      onMouseLeave={() => { mouseRef.current = null }}
      onTouchMove={(e) => { const t = e.touches[0]; if (t) updateMouse(t.clientX, t.clientY) }}
      onTouchEnd={() => { mouseRef.current = null }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span style={{ color: labelColor, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
          X Grid
        </span>
        <span style={{ color: hintColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          hover to illuminate
        </span>
      </div>
    </div>
  )
}`

const BLIND_PULL_TOGGLE_CODE = `'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, useAnimate, stagger } from 'framer-motion'
import { Moon, Sun } from '@phosphor-icons/react'

const SLATS    = 6
const MAX_SIZE = 80
const MIN_SIZE = 48

export function BlindPullToggle() {
  const [toggleDark, setToggleDark] = useState(true)
  const [pageIsDark, setPageIsDark] = useState(true)
  const [animating, setAnimating]   = useState(false)
  const [size, setSize]             = useState(MAX_SIZE)
  const sizeRef                     = useRef(MAX_SIZE)
  const [scope, animate]            = useAnimate()

  useEffect(() => {
    const el = scope.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      setPageIsDark(card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark'))
    }
    check()
    const mo = new MutationObserver(check)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) mo.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])

  useEffect(() => {
    const el = scope.current
    if (!el) return
    const update = () => {
      const s = Math.max(MIN_SIZE, Math.min(MAX_SIZE, Math.round(Math.min(el.offsetWidth, el.offsetHeight) * 0.2)))
      sizeRef.current = s
      setSize(s)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const iconSize  = Math.round(size * 0.45)
  const radius    = Math.round(size * 0.275)
  const cordRestH = Math.round(size * 0.30)
  const dotSize   = Math.max(8, Math.round(size * 0.138))

  const previewBg    = pageIsDark ? '#110F0C' : '#EDEAE5'
  const buttonBg     = pageIsDark ? 'linear-gradient(145deg, #3a3530, #252019)' : 'linear-gradient(145deg, #E8E4DC, #DFDBD4)'
  const buttonBorder = pageIsDark ? '1.5px solid rgba(255,255,255,0.10)' : '1.5px solid rgba(0,0,0,0.12)'
  const buttonShadow = pageIsDark ? '0 6px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)' : '0 4px 20px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)'
  const iconColor    = pageIsDark ? 'white' : '#2E2A24'
  const cordTop      = pageIsDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.22)'
  const cordBottom   = pageIsDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'
  const dotBg        = pageIsDark ? 'rgba(255,255,255,0.62)' : 'rgba(0,0,0,0.32)'
  const dotShadow    = pageIsDark ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 6px rgba(0,0,0,0.12)'

  const handleToggle = useCallback(async () => {
    if (animating) return
    setAnimating(true)
    const pullH = Math.round(sizeRef.current * 0.65)
    const restH = Math.round(sizeRef.current * 0.30)
    await animate('.cord-line', { height: pullH }, { duration: 0.1, ease: [0.4, 0, 1, 1] })
    animate('.cord-line', { height: restH }, { type: 'spring', stiffness: 300, damping: 18 })
    await animate('.slat', { scaleY: 0 }, { delay: stagger(0.04), duration: 0.1, ease: 'easeIn' })
    setToggleDark((d) => !d)
    await animate('.slat', { scaleY: 1 }, { delay: stagger(0.04), duration: 0.13, ease: 'easeOut' })
    setAnimating(false)
  }, [animating, animate])

  return (
    <div ref={scope} className="flex h-full w-full items-center justify-center" style={{ background: previewBg }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex select-none flex-col items-center"
      >
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          style={{ width: size, height: size, borderRadius: radius, border: buttonBorder, boxShadow: buttonShadow, cursor: 'pointer', position: 'relative', background: 'transparent' }}
        >
          <div style={{ position: 'absolute', inset: 0, borderRadius: radius - 1, overflow: 'hidden' }}>
            {Array.from({ length: SLATS }).map((_, i) => {
              const topPx    = Math.round((i / SLATS) * size)
              const nextTopPx = i === SLATS - 1 ? size : Math.round(((i + 1) / SLATS) * size)
              const heightPx = nextTopPx - topPx
              return (
                <div key={i} className="slat" style={{ position: 'absolute', top: topPx, left: 0, width: '100%', height: heightPx, overflow: 'hidden', transformOrigin: '50% 50%' }}>
                  <div style={{ position: 'absolute', top: -topPx, left: 0, width: size, height: size, background: buttonBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
                    {toggleDark ? <Moon size={iconSize} weight="regular" /> : <Sun size={iconSize} weight="regular" />}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.button>
        <div className="flex cursor-pointer flex-col items-center" onClick={handleToggle}>
          <div className="cord-line" style={{ width: 2, height: cordRestH, background: \`linear-gradient(to bottom, \${cordTop}, \${cordBottom})\`, borderRadius: 1 }} />
          <div style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: dotBg, boxShadow: dotShadow }} />
        </div>
      </motion.div>
    </div>
  )
}`

const BUBBLE_FIELD_CODE = `'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Config ───────────────────────────────────────────────────────────────────
const SPACING     = 20    // px between circle centres
const RADIUS      = 200
const BASE_R      = 1.5
const BURST_R     = 16
const BASE_A_DARK  = 0.55
const BASE_A_LIGHT = 0.75

// ─── Types ────────────────────────────────────────────────────────────────────
type Bubble = { x: number; y: number; b: number; phase: number }

export function BubbleField() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const mouseRef     = useRef<{ x: number; y: number } | null>(null)
  const isDarkRef    = useRef(true)
  const [isDark, setIsDark] = useState(true)

  // ── Theme detection ────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      const dark = card
        ? card.classList.contains('dark')
        : document.documentElement.classList.contains('dark')
      setIsDark(dark)
      isDarkRef.current = dark
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) observer.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // ── Canvas render loop ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    let bubbles: Bubble[] = []
    let animId = 0
    let alive  = true
    let cw = 0, ch = 0

    function build() {
      const dpr  = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      cw = rect.width
      ch = rect.height
      if (!cw || !ch) return
      canvas.width  = Math.round(cw * dpr)
      canvas.height = Math.round(ch * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      bubbles = []
      const cols = Math.floor(cw / SPACING) + 2
      const rows = Math.floor(ch / SPACING) + 2
      const ox   = (cw % SPACING) / 2
      const oy   = (ch % SPACING) / 2
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          bubbles.push({ x: ox + c * SPACING, y: oy + r * SPACING, b: 0, phase: Math.random() })
        }
      }
    }

    function frame() {
      if (!alive) return
      ctx.clearRect(0, 0, cw, ch)

      const mx     = mouseRef.current?.x ?? -99999
      const my     = mouseRef.current?.y ?? -99999
      const r2     = RADIUS * RADIUS
      const dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'
      const baseA  = isDarkRef.current ? BASE_A_DARK : BASE_A_LIGHT

      for (const bub of bubbles) {
        const dx    = bub.x - mx
        const dy    = bub.y - my
        const dist2 = dx * dx + dy * dy
        const tgt   = dist2 < r2 ? Math.exp(-dist2 / (RADIUS * RADIUS * 0.25)) : 0

        bub.b += (tgt > bub.b ? 0.16 : 0.07) * (tgt - bub.b)
        if (bub.b < 0.004) bub.b = 0

        // Advance burst phase — faster at hover centre, slower at edges
        if (bub.b > 0.08) {
          bub.phase = (bub.phase + 0.025 * bub.b) % 1
        }

        const p = bub.phase

        if (bub.b > 0.08) {
          // ── Burst cycle ───────────────────────────────────────────────
          if (p < 0.55) {
            // Expanding + fading (burst)
            const t     = p / 0.55                          // 0 → 1
            const r     = BASE_R + t * BURST_R
            const alpha = baseA * (1 - t)
            if (alpha > 0.004) {
              ctx.strokeStyle = \`rgba(\${dotRGB},\${alpha.toFixed(3)})\`
              ctx.lineWidth   = 0.5
              ctx.beginPath()
              ctx.arc(bub.x, bub.y, r, 0, Math.PI * 2)
              ctx.stroke()
            }
          } else if (p < 0.72) {
            // Invisible — fully popped, nothing drawn
          } else {
            // Reforming — shrinks back into existence
            const t     = (p - 0.72) / 0.28               // 0 → 1
            const r     = BASE_R * t
            const alpha = baseA * t
            if (r > 0.2 && alpha > 0.004) {
              ctx.strokeStyle = \`rgba(\${dotRGB},\${alpha.toFixed(3)})\`
              ctx.lineWidth   = 0.5
              ctx.beginPath()
              ctx.arc(bub.x, bub.y, r, 0, Math.PI * 2)
              ctx.stroke()
            }
          }
        } else {
          // ── Resting state — normal circle ─────────────────────────────
          ctx.strokeStyle = \`rgba(\${dotRGB},\${baseA.toFixed(3)})\`
          ctx.lineWidth   = 0.5
          ctx.beginPath()
          ctx.arc(bub.x, bub.y, BASE_R, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      animId = requestAnimationFrame(frame)
    }

    build()
    frame()

    const ro = new ResizeObserver(build)
    ro.observe(canvas.parentElement!)

    return () => {
      alive = false
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  function updateMouse(clientX: number, clientY: number) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top }
  }

  const bg         = isDark ? '#110F0C' : '#F5F1EA'
  const labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(28,25,22,0.45)'
  const hintColor  = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(28,25,22,0.22)'

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: bg }}
      onMouseMove={(e) => updateMouse(e.clientX, e.clientY)}
      onMouseLeave={() => { mouseRef.current = null }}
      onTouchMove={(e) => { const t = e.touches[0]; if (t) updateMouse(t.clientX, t.clientY) }}
      onTouchEnd={() => { mouseRef.current = null }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span style={{ color: labelColor, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Bubble Field
        </span>
        <span style={{ color: hintColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          hover to burst
        </span>
      </div>
    </div>
  )
}`

const NOISE_BG_CODE = `'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Config ───────────────────────────────────────────────────────────────────
const DENSITY     = 1 / 120   // denser grain
const MAX_DOTS    = 3000      // performance cap for large screens
const RADIUS      = 200      // hover influence radius px
const NEIGHBOUR_D = 35       // max distance for connection lines px
const BASE_A_DARK  = 0.18
const BASE_A_LIGHT = 0.28
const PEAK_A      = 0.14

// ─── Types ────────────────────────────────────────────────────────────────────
type Dot  = { x: number; y: number; b: number }
type Pair = [Dot, Dot]

export function NoiseBg() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const mouseRef     = useRef<{ x: number; y: number } | null>(null)
  const isDarkRef    = useRef(true)
  const [isDark, setIsDark] = useState(true)

  // ── Theme detection ────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      const dark = card
        ? card.classList.contains('dark')
        : document.documentElement.classList.contains('dark')
      setIsDark(dark)
      isDarkRef.current = dark
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) observer.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // ── Canvas render loop ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    let dots: Dot[]  = []
    let pairs: Pair[] = []
    let animId = 0
    let alive  = true
    let cw = 0, ch = 0

    function build() {
      const dpr  = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      cw = rect.width
      ch = rect.height
      if (!cw || !ch) return
      canvas.width  = Math.round(cw * dpr)
      canvas.height = Math.round(ch * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Generate random dot positions
      const count = Math.min(Math.round(cw * ch * DENSITY), MAX_DOTS)
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * cw,
        y: Math.random() * ch,
        b: 0,
      }))

      // Cache neighbour pairs (computed once, reused every frame)
      const nd2 = NEIGHBOUR_D * NEIGHBOUR_D
      pairs = []
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          if (dx * dx + dy * dy < nd2) pairs.push([dots[i], dots[j]])
        }
      }
    }

    function frame() {
      if (!alive) return
      ctx.clearRect(0, 0, cw, ch)

      const mx     = mouseRef.current?.x ?? -99999
      const my     = mouseRef.current?.y ?? -99999
      const r2     = RADIUS * RADIUS
      const dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'
      const baseA  = isDarkRef.current ? BASE_A_DARK : BASE_A_LIGHT

      // Draw dots
      for (const d of dots) {
        const dx    = d.x - mx
        const dy    = d.y - my
        const dist2 = dx * dx + dy * dy
        const tgt   = dist2 < r2 ? Math.exp(-dist2 / (RADIUS * RADIUS * 0.25)) : 0

        d.b += (tgt > d.b ? 0.16 : 0.07) * (tgt - d.b)
        if (d.b < 0.004) d.b = 0

        const alpha = baseA + (PEAK_A - baseA) * d.b
        const sz    = 0.8 + d.b * 0.6   // 0.8px resting → 1.4px lit
        ctx.fillStyle = \`rgba(\${dotRGB},\${alpha.toFixed(2)})\`
        ctx.fillRect(d.x - sz / 2, d.y - sz / 2, sz, sz)
      }

      // Draw connection lines between lit neighbours
      for (const [a, b] of pairs) {
        if (a.b < 0.05 || b.b < 0.05) continue
        const lineAlpha = Math.min(a.b, b.b) * 0.10
        ctx.strokeStyle = \`rgba(\${dotRGB},\${lineAlpha.toFixed(2)})\`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      animId = requestAnimationFrame(frame)
    }

    build()
    frame()

    const ro = new ResizeObserver(build)
    ro.observe(canvas.parentElement!)

    return () => {
      alive = false
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  function updateMouse(clientX: number, clientY: number) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top }
  }

  const bg         = isDark ? '#110F0C' : '#F5F1EA'
  const labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(28,25,22,0.45)'
  const hintColor  = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(28,25,22,0.22)'

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: bg }}
      onMouseMove={(e) => updateMouse(e.clientX, e.clientY)}
      onMouseLeave={() => { mouseRef.current = null }}
      onTouchMove={(e) => { const t = e.touches[0]; if (t) updateMouse(t.clientX, t.clientY) }}
      onTouchEnd={() => { mouseRef.current = null }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span style={{ color: labelColor, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Noise
        </span>
        <span style={{ color: hintColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          hover to illuminate
        </span>
      </div>
    </div>
  )
}`

const DISTORTION_GRID_CODE = `'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Config ───────────────────────────────────────────────────────────────────
const SPACING      = 32     // px between grid points at rest
const BASE_AMP     = 30     // px — dramatic resting amplitude (1-2 waves visible)
const WAVE_FREQ    = 0.007  // low frequency → ~900px wavelength
const HOVER_BOOST  = 1.5    // amp multiplier on full hover (waves grow 2.5×)
const LOCAL_AMP    = 60     // px — push away from cursor at centre
const LOCAL_RADIUS = 260    // px — repulsion radius
const LINE_A_DARK  = 0.55
const LINE_A_LIGHT = 0.75

export function DistortionGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const mouseRef     = useRef<{ x: number; y: number } | null>(null)
  const isDarkRef    = useRef(true)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      const dark = card
        ? card.classList.contains('dark')
        : document.documentElement.classList.contains('dark')
      setIsDark(dark)
      isDarkRef.current = dark
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) observer.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    let cols = 0, rows = 0, cw = 0, ch = 0
    let ox = 0, oy = 0
    let animId  = 0
    let alive   = true
    let t       = 0
    let hoverStr = 0

    function build() {
      const dpr  = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      cw = rect.width
      ch = rect.height
      if (!cw || !ch) return
      canvas.width  = Math.round(cw * dpr)
      canvas.height = Math.round(ch * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.floor(cw / SPACING) + 2
      rows = Math.floor(ch / SPACING) + 2
      ox   = (cw % SPACING) / 2
      oy   = (ch % SPACING) / 2
    }

    function frame() {
      if (!alive) return
      t += 0.002
      const hasHover = mouseRef.current !== null
      hoverStr += ((hasHover ? 1 : 0) - hoverStr) * (hasHover ? 0.018 : 0.010)

      ctx.clearRect(0, 0, cw, ch)

      const dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'
      const lineA  = isDarkRef.current ? LINE_A_DARK : LINE_A_LIGHT
      const mx = mouseRef.current?.x ?? -99999
      const my = mouseRef.current?.y ?? -99999
      const r2 = LOCAL_RADIUS * LOCAL_RADIUS
      const amp = BASE_AMP * (1 + hoverStr * HOVER_BOOST)

      function displaced(c: number, r: number): [number, number] {
        const rx = ox + c * SPACING
        const ry = oy + r * SPACING
        const wx = amp * (Math.sin(rx * WAVE_FREQ + t) + Math.sin(ry * WAVE_FREQ * 0.6 + t * 1.3) * 0.55)
        const wy = amp * (Math.cos(ry * WAVE_FREQ * 0.8 + t * 1.15) + Math.cos(rx * WAVE_FREQ * 0.5 + t * 0.75) * 0.55)
        const dx = rx - mx
        const dy = ry - my
        const dist2 = dx * dx + dy * dy
        let px = 0, py = 0
        if (dist2 < r2 * 4) {
          const push = LOCAL_AMP * Math.exp(-dist2 / (r2 * 0.5))
          const dist = Math.sqrt(dist2) || 1
          px = (dx / dist) * push
          py = (dy / dist) * push
        }
        return [rx + wx + px, ry + wy + py]
      }

      ctx.strokeStyle = \`rgba(\${dotRGB},\${lineA.toFixed(3)})\`
      ctx.lineWidth = 0.5

      for (let r = 0; r < rows; r++) {
        ctx.beginPath()
        const [x0, y0] = displaced(0, r)
        ctx.moveTo(x0, y0)
        for (let c = 1; c < cols; c++) {
          const [x, y] = displaced(c, r)
          ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      for (let c = 0; c < cols; c++) {
        ctx.beginPath()
        const [x0, y0] = displaced(c, 0)
        ctx.moveTo(x0, y0)
        for (let r = 1; r < rows; r++) {
          const [x, y] = displaced(c, r)
          ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      animId = requestAnimationFrame(frame)
    }

    build()
    frame()

    const ro = new ResizeObserver(build)
    ro.observe(canvas.parentElement!)

    return () => {
      alive = false
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  function updateMouse(clientX: number, clientY: number) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top }
  }

  const bg         = isDark ? '#110F0C' : '#F5F1EA'
  const labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(28,25,22,0.45)'
  const hintColor  = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(28,25,22,0.22)'

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: bg }}
      onMouseMove={(e) => updateMouse(e.clientX, e.clientY)}
      onMouseLeave={() => { mouseRef.current = null }}
      onTouchMove={(e) => { const t2 = e.touches[0]; if (t2) updateMouse(t2.clientX, t2.clientY) }}
      onTouchEnd={() => { mouseRef.current = null }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span style={{ color: labelColor, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Distortion Grid
        </span>
        <span style={{ color: hintColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          hover to warp
        </span>
      </div>
    </div>
  )
}`

const WAVE_LINES_CODE = `'use client'

import { useEffect, useRef, useState } from 'react'

const SPACING      = 32
const ROW_STEP     = 4
const AMP          = 18
const FREQ_Y       = 0.015
const FREQ_X       = 0.006
const HOVER_BOOST  = 5.0
const LOCAL_AMP    = 58
const LOCAL_RADIUS = 220
const LINE_A_DARK  = 0.55
const LINE_A_LIGHT = 0.75

export function WaveLines() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const mouseRef     = useRef<{ x: number; y: number } | null>(null)
  const isDarkRef    = useRef(true)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      const dark = card
        ? card.classList.contains('dark')
        : document.documentElement.classList.contains('dark')
      setIsDark(dark)
      isDarkRef.current = dark
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) observer.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    let cols = 0, rows = 0, cw = 0, ch = 0
    let ox = 0
    let animId  = 0
    let alive   = true
    let t       = 0
    let hoverStr = 0

    function build() {
      const dpr  = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      cw = rect.width
      ch = rect.height
      if (!cw || !ch) return
      canvas.width  = Math.round(cw * dpr)
      canvas.height = Math.round(ch * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(cw / SPACING) + 2
      rows = Math.ceil(ch / ROW_STEP) + 1
      ox   = (cw % SPACING) / 2
    }

    function frame() {
      if (!alive) return
      t += 0.003
      const hasHover = mouseRef.current !== null
      hoverStr += ((hasHover ? 1 : 0) - hoverStr) * (hasHover ? 0.018 : 0.010)

      ctx.clearRect(0, 0, cw, ch)

      const dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'
      const lineA  = isDarkRef.current ? LINE_A_DARK : LINE_A_LIGHT
      const amp    = AMP * (1 + hoverStr * HOVER_BOOST)
      const mx = mouseRef.current?.x ?? -99999
      const my = mouseRef.current?.y ?? -99999
      const r2 = LOCAL_RADIUS * LOCAL_RADIUS

      ctx.strokeStyle = \`rgba(\${dotRGB},\${lineA.toFixed(3)})\`
      ctx.lineWidth = 0.8

      for (let c = 0; c < cols; c++) {
        const rx = ox + c * SPACING
        ctx.beginPath()
        let prevX = 0, prevY = 0

        for (let r = 0; r <= rows; r++) {
          const ry = r * ROW_STEP
          const wx = amp * Math.sin(ry * FREQ_Y + rx * FREQ_X + t)
                   + amp * 0.38 * Math.sin(ry * FREQ_Y * 1.6 + rx * FREQ_X * 1.4 + t * 1.5 + 1.1)
          const wy = amp * 0.12 * Math.cos(rx * FREQ_X * 0.9 + ry * FREQ_Y * 0.4 + t * 0.8)
          const dx = rx - mx
          const dy = ry - my
          const dist2 = dx * dx + dy * dy
          let px = 0, py = 0
          if (dist2 < r2 * 4) {
            const push = LOCAL_AMP * Math.exp(-dist2 / (r2 * 0.5))
            const dist = Math.sqrt(dist2) || 1
            px = (dx / dist) * push
            py = (dy / dist) * push
          }
          const x = rx + wx + px
          const y = ry + wy + py
          if (r === 0) {
            ctx.moveTo(x, y)
          } else {
            const mx2 = (prevX + x) / 2
            const my2 = (prevY + y) / 2
            ctx.quadraticCurveTo(prevX, prevY, mx2, my2)
          }
          prevX = x
          prevY = y
        }
        ctx.lineTo(prevX, prevY)
        ctx.stroke()
      }

      animId = requestAnimationFrame(frame)
    }

    build()
    frame()

    const ro = new ResizeObserver(build)
    ro.observe(canvas.parentElement!)

    return () => {
      alive = false
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  function updateMouse(clientX: number, clientY: number) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top }
  }

  const bg         = isDark ? '#110F0C' : '#F5F1EA'
  const labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(28,25,22,0.45)'
  const hintColor  = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(28,25,22,0.22)'

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: bg }}
      onMouseMove={(e) => updateMouse(e.clientX, e.clientY)}
      onMouseLeave={() => { mouseRef.current = null }}
      onTouchMove={(e) => { const t2 = e.touches[0]; if (t2) updateMouse(t2.clientX, t2.clientY) }}
      onTouchEnd={() => { mouseRef.current = null }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span style={{ color: labelColor, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Wave Lines
        </span>
        <span style={{ color: hintColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          hover to fold
        </span>
      </div>
    </div>
  )
}`


// ─── Glass Collection Code ──────────────────────────────────────────────────

const GLASSNAVBAR_CODE = "'use client'\n\nimport { useState } from 'react'\nimport { motion, AnimatePresence } from 'framer-motion'\nimport { List, X } from '@phosphor-icons/react'\n\nconst NAV_ITEMS = ['Products', 'About', 'Blog']\n\nexport function GlassNavbar() {\n  const [active, setActive]     = useState<number | null>(null)\n  const [hovered, setHovered]   = useState<number | null>(null)\n  const [menuOpen, setMenuOpen] = useState(false)\n\n  const glassStyle = {\n    background: 'rgba(255, 255, 255, 0.08)',\n    backdropFilter: 'blur(24px) saturate(1.8)',\n    WebkitBackdropFilter: 'blur(24px) saturate(1.8)',\n    border: '1px solid rgba(255, 255, 255, 0.12)',\n    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',\n  }\n\n  const ctaStyle = {\n    background: 'linear-gradient(135deg, rgba(255, 160, 50, 0.75), rgba(220, 60, 40, 0.6))',\n    border: '1px solid rgba(255, 180, 80, 0.25)',\n    boxShadow: '0 2px 16px rgba(220, 80, 30, 0.4)',\n  }\n\n  const ctaHoverStyle = {\n    background: 'linear-gradient(135deg, rgba(255, 180, 80, 0.9), rgba(235, 75, 45, 0.8))',\n    boxShadow: '0 4px 24px rgba(220, 80, 30, 0.6)',\n  }\n\n  return (\n    <div className=\"relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\">\n      {/* Background image */}\n      <img\n        src=\"https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866\"\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n\n      {/* Navbar + mobile dropdown in a column */}\n      <div className=\"relative flex w-[calc(100%-2rem)] max-w-[720px] flex-col\">\n\n        {/* ── Main navbar pill ── */}\n        <motion.nav\n          initial={{ y: -40, opacity: 0 }}\n          animate={{ y: 0, opacity: 1 }}\n          transition={{ type: 'spring', stiffness: 200, damping: 24 }}\n          className=\"flex w-full items-center gap-1 rounded-full px-2 py-2\"\n          style={glassStyle}\n        >\n          {/* Logo — clicking resets to home (no active link) */}\n          <div className=\"flex cursor-pointer items-center gap-2 px-3\" onClick={() => setActive(null)}>\n            <motion.div\n              animate={{ rotate: [0, 360] }}\n              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}\n              className=\"h-6 w-6 rounded-lg\"\n              style={{ background: 'linear-gradient(135deg, #FF6BF5, #FFBE0B)' }}\n            />\n            <span className=\"text-sm font-semibold text-white/90\">Studio</span>\n          </div>\n\n          {/* Spacer */}\n          <div className=\"flex-1\" />\n\n          {/* ── Desktop nav (sm and up) ── */}\n          <div className=\"hidden items-center gap-1 sm:flex\">\n            {NAV_ITEMS.map((item, i) => (\n              <motion.button\n                key={item}\n                onClick={() => setActive(i)}\n                onHoverStart={() => setHovered(i)}\n                onHoverEnd={() => setHovered(null)}\n                className=\"relative cursor-pointer rounded-full px-5 py-2 text-sm font-medium\"\n                style={{ color: active === i || hovered === i ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)' }}\n                whileTap={{ scale: 0.97 }}\n              >\n                {/* Active pill */}\n                {active === i && (\n                  <motion.div\n                    layoutId=\"glass-nav-active\"\n                    className=\"absolute inset-0 rounded-full\"\n                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.1)' }}\n                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}\n                  />\n                )}\n                <span className=\"relative z-10\">{item}</span>\n              </motion.button>\n            ))}\n\n            {/* Get Started */}\n            <motion.button\n              whileHover={{ scale: 1.04, ...ctaHoverStyle }}\n              whileTap={{ scale: 0.96 }}\n              className=\"ml-2 cursor-pointer rounded-full px-5 py-2 text-sm font-semibold text-white\"\n              style={ctaStyle}\n              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}\n            >\n              Get Started\n            </motion.button>\n          </div>\n\n          {/* ── Mobile hamburger (below sm) ── */}\n          <motion.button\n            className=\"mr-2 flex cursor-pointer items-center justify-center rounded-full p-2 text-white/70 sm:hidden\"\n            onClick={() => setMenuOpen(v => !v)}\n            whileTap={{ scale: 0.9 }}\n            style={{ background: 'rgba(255,255,255,0.08)' }}\n          >\n            <AnimatePresence mode=\"wait\" initial={false}>\n              {menuOpen\n                ? <motion.span key=\"x\"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={18} weight=\"bold\" /></motion.span>\n                : <motion.span key=\"menu\" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><List size={18} weight=\"bold\" /></motion.span>\n              }\n            </AnimatePresence>\n          </motion.button>\n        </motion.nav>\n\n        {/* ── Mobile dropdown ── */}\n        <AnimatePresence>\n          {menuOpen && (\n            <motion.div\n              initial={{ opacity: 0, y: -8, scale: 0.97 }}\n              animate={{ opacity: 1, y: 0,  scale: 1    }}\n              exit={{    opacity: 0, y: -8, scale: 0.97 }}\n              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}\n              className=\"mt-2 flex flex-col gap-1 rounded-2xl p-2 sm:hidden\"\n              style={glassStyle}\n            >\n              {NAV_ITEMS.map((item, i) => (\n                <button\n                  key={item}\n                  onClick={() => { setActive(i); setMenuOpen(false) }}\n                  className=\"cursor-pointer rounded-full px-5 py-2.5 text-left text-sm font-medium transition-colors\"\n                  style={{\n                    color: active === i ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',\n                    background: active === i ? 'rgba(255,255,255,0.1)' : 'transparent',\n                  }}\n                >\n                  {item}\n                </button>\n              ))}\n              <button\n                onClick={() => setMenuOpen(false)}\n                className=\"mt-1 cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold text-white\"\n                style={ctaStyle}\n              >\n                Get Started\n              </button>\n            </motion.div>\n          )}\n        </AnimatePresence>\n\n      </div>\n    </div>\n  )\n}\n"
const GLASSTABBAR_CODE = "'use client'\n\nimport { useState } from 'react'\nimport { motion } from 'framer-motion'\nimport { House, Compass, PlusCircle, ChatCircle, User } from '@phosphor-icons/react'\n\nconst TABS = [\n  { icon: House,       label: 'Home',     color: '#3A86FF' },\n  { icon: Compass,     label: 'Explore',  color: '#FF7B54' },\n  { icon: PlusCircle,  label: 'Create',   color: '#06D6A0' },\n  { icon: ChatCircle,  label: 'Messages', color: '#FF5C8A' },\n  { icon: User,        label: 'Profile',  color: '#B388FF' },\n]\n\nexport function GlassTabBar() {\n  const [active, setActive]   = useState(0)\n  const [hovered, setHovered] = useState<number | null>(null)\n\n  return (\n    <div className=\"relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\">\n      <img\n        src=\"https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866\"\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n\n      {/* Glass tab bar */}\n      <motion.div\n        initial={{ y: 20 }}\n        animate={{ y: 0 }}\n        transition={{ type: 'spring', stiffness: 200, damping: 24 }}\n        className=\"relative isolate flex w-[380px] items-center justify-around rounded-full px-5 py-2.5\"\n        style={{\n          background: 'rgba(255, 255, 255, 0.07)',\n          border: '1px solid rgba(255, 255, 255, 0.11)',\n          boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)',\n        }}\n      >\n        {/* Blur layer — non-animating, isolated from entrance spring */}\n        <div\n          className=\"pointer-events-none absolute inset-0 z-[-1] rounded-full\"\n          style={{ backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)' }}\n        />\n        {TABS.map((tab, i) => {\n          const Icon     = tab.icon\n          const isActive = active === i\n          const isHover  = hovered === i && !isActive\n\n          return (\n            <motion.button\n              key={tab.label}\n              onClick={() => setActive(i)}\n              onHoverStart={() => setHovered(i)}\n              onHoverEnd={() => setHovered(null)}\n              className=\"relative flex cursor-pointer flex-col items-center gap-[3px] px-3 py-1\"\n              whileTap={{ scale: 0.85 }}\n            >\n              {isActive && (\n                <motion.div\n                  layoutId=\"tab-glow\"\n                  className={`absolute -inset-y-1 rounded-full ${\n                    i === 0                  ? '-left-5 -right-3'  :\n                    i === TABS.length - 1   ? '-left-3 -right-5'  :\n                                              '-inset-x-3'\n                  }`}\n                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.08)' }}\n                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}\n                />\n              )}\n\n              {/* Shift content to pill center for edge tabs (pill is asymmetric by 8px → offset 4px) */}\n              <div\n                className=\"relative z-10 flex flex-col items-center gap-[3px]\"\n                style={{\n                  transform: i === 0 ? 'translateX(-4px)' : i === TABS.length - 1 ? 'translateX(4px)' : undefined,\n                }}\n              >\n                <motion.div\n                  animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -1 : 0 }}\n                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}\n                  className=\"flex items-center justify-center rounded-xl\"\n                  style={{\n                    width: 36,\n                    height: 36,\n                    background: isActive ? `${tab.color}28` : isHover ? `${tab.color}12` : 'transparent',\n                    border: isActive ? `1px solid ${tab.color}44` : isHover ? `1px solid ${tab.color}18` : '1px solid transparent',\n                    transition: 'background 0.2s, border-color 0.2s',\n                  }}\n                >\n                  <Icon\n                    size={20}\n                    weight=\"regular\"\n                    style={{\n                      color: isActive ? tab.color : isHover ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.32)',\n                      transition: 'color 0.2s ease',\n                    }}\n                  />\n                </motion.div>\n\n                <span\n                  className=\"text-[10px] font-medium\"\n                  style={{\n                    color: isActive ? tab.color : isHover ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.32)',\n                    transition: 'color 0.2s ease',\n                  }}\n                >\n                  {tab.label}\n                </span>\n              </div>\n            </motion.button>\n          )\n        })}\n      </motion.div>\n    </div>\n  )\n}\n"
const GLASSTAGS_CODE = `'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

// ─── Customise here ──────────────────────────────────────────────────────────

const BACKGROUND = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%203%20(1).png?updatedAt=1775226815629'

const TAGS = [
  { label: 'Design',       color: '#FF9A3C' },
  { label: 'Development',  color: '#FFBE0B' },
  { label: 'Motion',       color: '#FF6BF5' },
  { label: 'AI',           color: '#FF7B54' },
  { label: '3D',           color: '#DC5A28' },
  { label: 'Typography',   color: '#FFD166' },
  { label: 'Branding',     color: '#FF6680' },
  { label: 'iOS',          color: '#FF9A3C' },
  { label: 'WebGL',        color: '#FFBE0B' },
  { label: 'React',        color: '#FF7B54' },
  { label: 'Figma',        color: '#FF6BF5' },
  { label: 'Prototyping',  color: '#FFD166' },
]

// Shared glass surface parameters
const GLASS_FILTER = 'blur(24px) saturate(1.8)'

// ─────────────────────────────────────────────────────────────────────────────

function GlassTag({ label, color, index }: { label: string; color: string; index: number }) {
  const [selected, setSelected] = useState(false)
  const [hovered,  setHovered]  = useState(false)

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: index * 0.04 }}
      onClick={() => setSelected(s => !s)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      className="relative cursor-pointer rounded-full px-4 py-2 sm:px-5 sm:py-2.5"
      style={{
        backdropFilter: GLASS_FILTER,
        WebkitBackdropFilter: GLASS_FILTER,
        background: selected
          ? \`linear-gradient(135deg, \${color}33, \${color}18)\`
          : hovered ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.08)',
        border: selected
          ? \`1px solid \${color}55\`
          : hovered ? '1px solid rgba(255,255,255,0.24)' : '1px solid rgba(255,255,255,0.12)',
        boxShadow: selected
          ? \`0 4px 24px \${color}30, inset 0 1px 0 rgba(255,255,255,0.12)\`
          : hovered
            ? '0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)'
            : '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
        transition: 'background 0.2s ease, border 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Selection glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ opacity: selected ? 0.15 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: \`radial-gradient(circle at center, \${color}, transparent 70%)\` }}
      />

      <div className="relative z-10 flex items-center gap-2">
        {/* Fixed-width slot — dot fades out, checkmark fades in, no layout shift */}
        <div className="relative h-3.5 w-3.5 shrink-0">
          <motion.div
            animate={{ scale: selected ? 0 : 1, opacity: selected ? 0 : hovered ? 0.8 : 0.5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="absolute inset-0 m-auto h-2 w-2 rounded-full"
            style={{ background: color }}
          />
          {selected && (
            <motion.svg
              width="14" height="14" viewBox="0 0 14 14"
              className="absolute inset-0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <motion.path
                d="M3 7.5L5.5 10L11 4"
                fill="none" stroke={color} strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.25, delay: 0.1 }}
              />
            </motion.svg>
          )}
        </div>

        <span
          className="text-xs font-semibold sm:text-sm"
          style={{
            color: selected ? 'rgba(255,255,255,0.95)' : hovered ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.5)',
            transition: 'color 0.2s ease',
          }}
        >
          {label}
        </span>
      </div>
    </motion.button>
  )
}

export function GlassTags() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950">
      <img
        src={BACKGROUND}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex w-full max-w-sm flex-wrap justify-center gap-2 px-4 sm:max-w-md sm:gap-3 sm:px-6"
      >
        {TAGS.map((tag, i) => (
          <GlassTag key={tag.label} label={tag.label} color={tag.color} index={i} />
        ))}
      </motion.div>
    </div>
  )
}
`

const GLASSCARD_CODE = "'use client'\n\nimport { useRef } from 'react'\nimport { motion, useMotionValue, useMotionTemplate, useTransform, useSpring } from 'framer-motion'\nimport { ChartLineUp, Lightning, ShieldCheck, ArrowRight } from '@phosphor-icons/react'\nimport type { Icon } from '@phosphor-icons/react'\n\n// ─── Customise here ──────────────────────────────────────────────────────────\n\nconst BACKGROUND = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133'\n\nconst CARDS: { title: string; subtitle: string; color: string; gradient: string; cta: string; Icon: Icon }[] = [\n  { title: 'Analytics',  subtitle: 'Real-time metrics and insights for your application.',    color: '#5B8FF9', gradient: '#5B8FF9, #A78BFA', cta: 'View Dashboard',    Icon: ChartLineUp },\n  { title: 'Automation', subtitle: 'Streamline your workflows with intelligent triggers.',     color: '#FF6BF5', gradient: '#FF6BF5, #FF6680', cta: 'Create Workflow',    Icon: Lightning    },\n  { title: 'Security',   subtitle: 'Enterprise-grade protection for your data.',              color: '#FF7B54', gradient: '#FF7B54, #FFBE0B', cta: 'View Report',        Icon: ShieldCheck  },\n]\n\n// ─────────────────────────────────────────────────────────────────────────────\n\nfunction GlassCardItem({\n  title,\n  subtitle,\n  color,\n  gradient,\n  cta,\n  Icon,\n}: {\n  title: string\n  subtitle: string\n  color: string\n  gradient: string\n  cta: string\n  Icon: Icon\n}) {\n  const cardRef = useRef<HTMLDivElement>(null)\n  const mouseX = useMotionValue(0.5)\n  const mouseY = useMotionValue(0.5)\n\n  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 200, damping: 20 })\n  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 })\n  const glareX  = useTransform(mouseX, [0, 1], [0, 100])\n  const glareY  = useTransform(mouseY, [0, 1], [0, 100])\n  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4), transparent 50%)`\n\n  const handleMouse = (e: React.MouseEvent) => {\n    const el = cardRef.current\n    if (!el) return\n    const rect = el.getBoundingClientRect()\n    mouseX.set((e.clientX - rect.left) / rect.width)\n    mouseY.set((e.clientY - rect.top) / rect.height)\n  }\n\n  const handleLeave = () => {\n    mouseX.set(0.5)\n    mouseY.set(0.5)\n  }\n\n  return (\n    <motion.div\n      ref={cardRef}\n      onMouseMove={handleMouse}\n      onMouseLeave={handleLeave}\n      style={{ rotateX, rotateY, transformPerspective: 800 }}\n      className=\"relative w-64 cursor-pointer overflow-hidden rounded-3xl p-[1px]\"\n    >\n      {/* Rotating border gradient */}\n      <motion.div\n        className=\"absolute inset-0 rounded-3xl opacity-30\"\n        style={{ background: `linear-gradient(135deg, ${gradient}, transparent 60%)` }}\n        animate={{ rotate: [0, 360] }}\n        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}\n      />\n\n      {/* Card body */}\n      <div\n        className=\"relative rounded-3xl p-6\"\n        style={{\n          background: 'rgba(255, 255, 255, 0.08)',\n          backdropFilter: 'blur(24px) saturate(1.8)',\n          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',\n          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.12)',\n        }}\n      >\n        {/* Glare highlight */}\n        <motion.div\n          className=\"pointer-events-none absolute inset-0 rounded-3xl opacity-40\"\n          style={{ background: glareBackground }}\n        />\n\n        {/* Icon — notification-style tinted badge */}\n        <motion.div\n          className=\"mb-5 flex h-12 w-12 items-center justify-center rounded-xl\"\n          style={{\n            background: `${color}18`,\n            border: `1px solid ${color}22`,\n          }}\n          whileHover={{ scale: 1.1, rotate: 5 }}\n          transition={{ type: 'spring', stiffness: 400, damping: 15 }}\n        >\n          <Icon size={22} weight=\"regular\" style={{ color }} />\n        </motion.div>\n\n        <h3 className=\"mb-2 text-base font-semibold text-white/90\">{title}</h3>\n        <p className=\"mb-5 text-sm leading-relaxed text-white/40\">{subtitle}</p>\n\n        {/* CTA */}\n        <motion.button\n          whileHover={{ scale: 1.03 }}\n          whileTap={{ scale: 0.97 }}\n          className=\"flex w-full items-center justify-between rounded-2xl px-4 py-3\"\n          style={{\n            background: `linear-gradient(135deg, ${gradient.split(',')[0]}40, ${gradient.split(',')[1]?.trim() ?? gradient.split(',')[0]}28)`,\n            border: `1px solid ${gradient.split(',')[0]}55`,\n            boxShadow: `0 2px 12px ${gradient.split(',')[0]}25`,\n            transition: 'box-shadow 0.2s ease',\n          }}\n          onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 4px 20px ${gradient.split(',')[0]}45`)}\n          onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 2px 12px ${gradient.split(',')[0]}25`)}\n        >\n          <span\n            className=\"text-sm font-semibold\"\n            style={{ color: `${gradient.split(',')[0]}ee` }}\n          >\n            {cta}\n          </span>\n          <ArrowRight\n            size={16}\n            weight=\"regular\"\n            style={{ color: `${gradient.split(',')[0]}cc` }}\n          />\n        </motion.button>\n\n        {/* Top edge highlight */}\n        <div\n          className=\"absolute left-6 right-6 top-0 h-[1px]\"\n          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}\n        />\n      </div>\n    </motion.div>\n  )\n}\n\nexport function GlassCard() {\n  return (\n    <div className=\"relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\">\n      <img\n        src={BACKGROUND}\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n      <div className=\"relative flex flex-wrap items-center justify-center gap-6 px-6\">\n        {CARDS.map((card) => (\n          <GlassCardItem key={card.title} {...card} />\n        ))}\n      </div>\n    </div>\n  )\n}\n"

const GLASSMODAL_CODE = "'use client'\n\nimport { motion } from 'framer-motion'\nimport { X, Check, ShieldCheck } from '@phosphor-icons/react'\n\nexport function GlassModal() {\n  return (\n    <div className=\"relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\">\n      {/* Background image */}\n      <img\n        src=\"https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866\"\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n\n      {/* Modal card */}\n      <motion.div\n        initial={{ scale: 0.9, y: 16 }}\n        animate={{ scale: 1, y: 0 }}\n        transition={{ type: 'spring', stiffness: 350, damping: 28 }}\n        className=\"relative isolate w-[340px] overflow-hidden rounded-3xl\"\n        style={{\n          background: 'rgba(255, 255, 255, 0.08)',\n          border: '1px solid rgba(255, 255, 255, 0.12)',\n          boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)',\n        }}\n      >\n        {/* Blur layer — non-animating, isolated from entrance spring */}\n        <div\n          className=\"pointer-events-none absolute inset-0 z-[-1] rounded-3xl\"\n          style={{ backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)' }}\n        />\n        {/* Top edge highlight */}\n        <div\n          className=\"absolute left-8 right-8 top-0 h-[1px]\"\n          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}\n        />\n\n        {/* Close button */}\n        <motion.button\n          whileHover={{\n            scale: 1.15,\n            rotate: 90,\n            background: 'rgba(255, 155, 50, 0.2)',\n            boxShadow: '0 0 14px rgba(255, 140, 40, 0.45)',\n            border: '1px solid rgba(255, 180, 80, 0.3)',\n          }}\n          whileTap={{ scale: 0.9 }}\n          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}\n          className=\"absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full\"\n          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}\n        >\n          <X size={14} weight=\"regular\" className=\"text-white/60\" />\n        </motion.button>\n\n        {/* Content */}\n        <div className=\"flex flex-col items-center px-8 pb-8 pt-10\">\n          {/* Icon — notification-style tinted badge */}\n          <motion.div\n            initial={{ scale: 0, rotate: -20 }}\n            animate={{ scale: 1, rotate: 0 }}\n            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}\n            className=\"mb-5 flex h-16 w-16 items-center justify-center rounded-xl\"\n            style={{\n              background: '#FFA03218',\n              border: '1px solid #FFA03222',\n            }}\n          >\n            <ShieldCheck size={28} weight=\"regular\" style={{ color: '#FFA032' }} />\n          </motion.div>\n\n          <motion.h2\n            initial={{ opacity: 0, y: 8 }}\n            animate={{ opacity: 1, y: 0 }}\n            transition={{ delay: 0.2 }}\n            className=\"mb-2 text-lg font-semibold text-white/90\"\n          >\n            Upgrade to Pro\n          </motion.h2>\n\n          <motion.p\n            initial={{ opacity: 0, y: 8 }}\n            animate={{ opacity: 1, y: 0 }}\n            transition={{ delay: 0.25 }}\n            className=\"mb-6 text-center text-sm leading-relaxed text-white/40\"\n          >\n            Unlock premium components, priority support, and early access to new features.\n          </motion.p>\n\n          {/* Features */}\n          <motion.div\n            initial={{ opacity: 0 }}\n            animate={{ opacity: 1 }}\n            transition={{ delay: 0.3 }}\n            className=\"mb-6 flex w-full flex-col gap-3\"\n          >\n            {['Unlimited components', 'Source code access', 'Priority support'].map((feature, i) => (\n              <motion.div\n                key={feature}\n                initial={{ opacity: 0, x: -12 }}\n                animate={{ opacity: 1, x: 0 }}\n                transition={{ delay: 0.35 + i * 0.08 }}\n                className=\"flex items-center gap-3\"\n              >\n                <div\n                  className=\"flex h-5 w-5 items-center justify-center rounded-full\"\n                  style={{ background: 'rgba(255, 155, 50, 0.18)' }}\n                >\n                  <Check size={10} weight=\"regular\" style={{ color: 'rgba(255, 155, 50, 1)' }} />\n                </div>\n                <span className=\"text-sm text-white/60\">{feature}</span>\n              </motion.div>\n            ))}\n          </motion.div>\n\n          {/* CTA buttons */}\n          <div className=\"flex w-full flex-col gap-2\">\n            <motion.button\n              whileHover={{\n                scale: 1.04,\n                background: 'linear-gradient(135deg, rgba(255, 180, 80, 0.9), rgba(235, 75, 45, 0.8))',\n                boxShadow: '0 4px 24px rgba(220, 80, 30, 0.6)',\n              }}\n              whileTap={{ scale: 0.96 }}\n              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}\n              className=\"w-full cursor-pointer rounded-full py-3 text-sm font-semibold text-white\"\n              style={{\n                background: 'linear-gradient(135deg, rgba(255, 160, 50, 0.75), rgba(220, 60, 40, 0.6))',\n                border: '1px solid rgba(255, 180, 80, 0.25)',\n                boxShadow: '0 2px 16px rgba(220, 80, 30, 0.4)',\n              }}\n            >\n              Upgrade Now\n            </motion.button>\n            <motion.button\n              whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.1)' }}\n              whileTap={{ scale: 0.96 }}\n              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}\n              className=\"w-full cursor-pointer rounded-full py-3 text-sm font-medium text-white/50\"\n              style={{\n                background: 'rgba(255, 255, 255, 0.06)',\n                border: '1px solid rgba(255, 255, 255, 0.1)',\n              }}\n            >\n              Maybe Later\n            </motion.button>\n          </div>\n        </div>\n      </motion.div>\n    </div>\n  )\n}\n"
const GLASSDOCK_CODE = "'use client'\n\nimport { useRef } from 'react'\nimport { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'\nimport {\n  Sun,\n  Heart,\n  MusicNote,\n  Coffee,\n  Leaf,\n  Star,\n  Moon,\n  Flame,\n  Cloud,\n} from '@phosphor-icons/react'\n\nconst DOCK_ITEMS = [\n  { icon: Sun,       color: '#FFBE0B', label: 'Energy' },\n  { icon: Heart,     color: '#FF5C8A', label: 'Love' },\n  { icon: MusicNote, color: '#FF7B54', label: 'Joy' },\n  { icon: Coffee,    color: '#C9A96E', label: 'Comfort' },\n  { icon: Leaf,      color: '#06D6A0', label: 'Nature' },\n  { icon: Star,      color: '#FFBE0B', label: 'Dreams' },\n  { icon: Moon,      color: '#B388FF', label: 'Rest' },\n  { icon: Flame,     color: '#FF5C8A', label: 'Passion' },\n  { icon: Cloud,     color: '#3A86FF', label: 'Peace' },\n]\n\nconst ICON_SIZE = 44\nconst MAG_RANGE = 120\nconst MAG_SCALE = 1.55\n\nfunction DockItem({\n  icon: Icon,\n  color,\n  label,\n  mouseX,\n  index,\n}: {\n  icon: typeof Sun\n  color: string\n  label: string\n  mouseX: ReturnType<typeof useMotionValue<number>>\n  index: number\n}) {\n  const ref = useRef<HTMLDivElement>(null)\n\n  const distance = useTransform(mouseX, (mx: number) => {\n    const el = ref.current\n    if (!el || mx < 0) return 200\n    const rect = el.getBoundingClientRect()\n    const center = rect.left + rect.width / 2\n    return Math.abs(mx - center)\n  })\n\n  const rawSize = useTransform(distance, [0, MAG_RANGE], [ICON_SIZE * MAG_SCALE, ICON_SIZE])\n  const size = useSpring(rawSize, { stiffness: 300, damping: 22, mass: 0.5 })\n  const y = useTransform(size, [ICON_SIZE, ICON_SIZE * MAG_SCALE], [0, -12])\n\n  return (\n    <motion.div\n      ref={ref}\n      className=\"group relative flex cursor-pointer flex-col items-center\"\n      initial={{ opacity: 0, y: 20 }}\n      animate={{ opacity: 1, y: 0 }}\n      transition={{ type: 'spring', stiffness: 200, damping: 18, delay: index * 0.04 }}\n    >\n      {/* Tooltip */}\n      <motion.div\n        className=\"pointer-events-none absolute -top-10 rounded-lg px-3 py-1.5 text-xs font-medium text-white/90 opacity-0 group-hover:opacity-100\"\n        style={{\n          background: 'rgba(255, 255, 255, 0.1)',\n          backdropFilter: 'blur(16px)',\n          WebkitBackdropFilter: 'blur(16px)',\n          border: '1px solid rgba(255, 255, 255, 0.1)',\n          transition: 'opacity 0.15s',\n        }}\n      >\n        {label}\n      </motion.div>\n\n      {/* Icon — notification-style tinted badge */}\n      <motion.div\n        style={{\n          width: size,\n          height: size,\n          y,\n          background: `${color}18`,\n          border: `1px solid ${color}22`,\n          borderRadius: 12,\n        }}\n        whileTap={{ scale: 0.82 }}\n        className=\"flex items-center justify-center\"\n      >\n        <Icon size={22} weight=\"regular\" style={{ color }} />\n      </motion.div>\n    </motion.div>\n  )\n}\n\nexport function GlassDock() {\n  const mouseX = useMotionValue(-200)\n\n  return (\n    <div className=\"relative flex h-full w-full items-center justify-end overflow-hidden bg-sand-950 pb-8\">\n      {/* Background image */}\n      <img\n        src=\"https://ik.imagekit.io/aitoolkit/bg%20images/glass%20background.png\"\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n\n      {/* Dock container */}\n      <motion.div\n        initial={{ y: 50 }}\n        animate={{ y: 0 }}\n        transition={{ type: 'spring', stiffness: 180, damping: 20 }}\n        onMouseMove={(e) => mouseX.set(e.clientX)}\n        onMouseLeave={() => mouseX.set(-200)}\n        className=\"relative isolate mx-auto flex items-end gap-2 rounded-3xl px-4 pb-3 pt-3\"\n        style={{\n          background: 'rgba(255, 255, 255, 0.06)',\n          border: '1px solid rgba(255, 255, 255, 0.1)',\n          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',\n        }}\n      >\n        {/* Blur layer — non-animating so it isn't recalculated on every mouse-move frame */}\n        <div\n          className=\"pointer-events-none absolute inset-0 z-[-1] rounded-3xl\"\n          style={{\n            backdropFilter: 'blur(24px) saturate(1.8)',\n            WebkitBackdropFilter: 'blur(24px) saturate(1.8)',\n          }}\n        />\n        {DOCK_ITEMS.map((item, i) => (\n          <DockItem key={item.label} {...item} mouseX={mouseX} index={i} />\n        ))}\n      </motion.div>\n    </div>\n  )\n}\n"

const GLASSSLIDER_CODE = "'use client'\n\nimport { useState, useRef } from 'react'\nimport { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'\n\nfunction Slider({\n  label,\n  defaultValue,\n  color,\n  delay,\n}: {\n  label: string\n  defaultValue: number\n  color: string\n  delay: number\n}) {\n  const [value, setValue] = useState(defaultValue)\n  const trackRef = useRef<HTMLDivElement>(null)\n  const dragging = useMotionValue(0)\n  const thumbScale = useSpring(useTransform(dragging, [0, 1], [1, 1.3]), {\n    stiffness: 400,\n    damping: 20,\n  })\n  const glowOpacity = useSpring(useTransform(dragging, [0, 1], [0, 0.6]), {\n    stiffness: 300,\n    damping: 25,\n  })\n\n  const handlePointerDown = (e: React.PointerEvent) => {\n    e.preventDefault()\n    dragging.set(1)\n\n    const track = trackRef.current\n    if (!track) return\n\n    const updateValue = (clientX: number) => {\n      const rect = track.getBoundingClientRect()\n      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))\n      setValue(Math.round(pct * 100))\n    }\n\n    updateValue(e.clientX)\n\n    const onMove = (ev: PointerEvent) => updateValue(ev.clientX)\n    const onUp = () => {\n      dragging.set(0)\n      window.removeEventListener('pointermove', onMove)\n      window.removeEventListener('pointerup', onUp)\n    }\n\n    window.addEventListener('pointermove', onMove)\n    window.addEventListener('pointerup', onUp)\n  }\n\n  return (\n    <motion.div\n      initial={{ opacity: 0, x: -20 }}\n      animate={{ opacity: 1, x: 0 }}\n      transition={{ type: 'spring', stiffness: 200, damping: 22, delay }}\n      className=\"flex w-full items-center gap-4\"\n    >\n      <span className=\"w-20 text-right text-sm font-medium text-white/50\">{label}</span>\n\n      <div\n        ref={trackRef}\n        onPointerDown={handlePointerDown}\n        className=\"relative flex h-10 flex-1 cursor-pointer items-center rounded-2xl px-1\"\n        style={{\n          background: 'rgba(255, 255, 255, 0.05)',\n          border: '1px solid rgba(255, 255, 255, 0.08)',\n        }}\n      >\n        {/* Fill */}\n        <motion.div\n          className=\"absolute left-0 top-0 h-full rounded-2xl\"\n          style={{\n            width: `${value}%`,\n            background: `linear-gradient(90deg, ${color}22, ${color}44)`,\n          }}\n          layout\n          transition={{ type: 'spring', stiffness: 400, damping: 35 }}\n        />\n\n        {/* Active glow */}\n        <motion.div\n          className=\"absolute left-0 top-0 h-full rounded-2xl\"\n          style={{\n            width: `${value}%`,\n            opacity: glowOpacity,\n            background: `linear-gradient(90deg, transparent 60%, ${color}33)`,\n            boxShadow: `0 0 20px ${color}22`,\n          }}\n        />\n\n        {/* Thumb */}\n        <motion.div\n          className=\"absolute top-1/2 flex items-center justify-center\"\n          style={{\n            left: `${value}%`,\n            x: '-50%',\n            y: '-50%',\n            scale: thumbScale,\n          }}\n        >\n          <div\n            className=\"h-6 w-6 rounded-full\"\n            style={{\n              background: `linear-gradient(135deg, ${color}, ${color}bb)`,\n              border: '2px solid rgba(255, 255, 255, 0.25)',\n              boxShadow: `0 2px 12px ${color}55, 0 0 0 4px ${color}11`,\n            }}\n          />\n        </motion.div>\n      </div>\n\n      {/* Value display */}\n      <motion.span\n        className=\"w-12 text-right font-mono text-sm font-semibold\"\n        style={{ color }}\n      >\n        {value}\n      </motion.span>\n    </motion.div>\n  )\n}\n\nexport function GlassSlider() {\n  return (\n    <div className=\"relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\">\n      {/* Background image */}\n      <img\n        src=\"https://ik.imagekit.io/aitoolkit/bg%20images/glass%20background.png\"\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n      {/* Slider panel */}\n      <motion.div\n        initial={{ opacity: 0, y: 20, scale: 0.96 }}\n        animate={{ opacity: 1, y: 0, scale: 1 }}\n        transition={{ type: 'spring', stiffness: 200, damping: 22 }}\n        className=\"relative flex w-[400px] flex-col gap-5 rounded-3xl px-8 py-8\"\n        style={{\n          background: 'rgba(255, 255, 255, 0.06)',\n          backdropFilter: 'blur(24px) saturate(1.6)',\n          WebkitBackdropFilter: 'blur(24px) saturate(1.6)',\n          border: '1px solid rgba(255, 255, 255, 0.1)',\n          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)',\n        }}\n      >\n        {/* Top highlight */}\n        <div\n          className=\"absolute left-8 right-8 top-0 h-[1px]\"\n          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}\n        />\n\n        <h3 className=\"mb-1 text-base font-semibold text-white/80\">Audio Settings</h3>\n\n        <Slider label=\"Volume\" defaultValue={72} color=\"#FF6BF5\" delay={0.1} />\n        <Slider label=\"Bass\" defaultValue={45} color=\"#FF7B54\" delay={0.15} />\n        <Slider label=\"Treble\" defaultValue={60} color=\"#06D6A0\" delay={0.2} />\n        <Slider label=\"Balance\" defaultValue={50} color=\"#FFBE0B\" delay={0.25} />\n      </motion.div>\n    </div>\n  )\n}\n"

const GLASSTOGGLE_CODE = "'use client'\n\nimport { useState, useEffect } from 'react'\nimport { motion, useSpring, useTransform } from 'framer-motion'\n\nfunction Toggle({\n  label,\n  defaultOn = false,\n  color,\n  delay,\n}: {\n  label: string\n  defaultOn?: boolean\n  color: string\n  delay: number\n}) {\n  const [on, setOn] = useState(defaultOn)\n  const progress = useSpring(defaultOn ? 1 : 0, { stiffness: 300, damping: 22 })\n\n  useEffect(() => {\n    progress.set(on ? 1 : 0)\n  }, [on, progress])\n\n  const trackBg = useTransform(\n    progress,\n    [0, 1],\n    ['rgba(255,255,255,0.08)', `${color}44`]\n  )\n  const trackBorder = useTransform(\n    progress,\n    [0, 1],\n    ['rgba(255,255,255,0.1)', `${color}55`]\n  )\n  const thumbX = useTransform(progress, [0, 1], [2, 26])\n  const thumbShadow = useTransform(\n    progress,\n    [0, 1],\n    ['0 2px 8px rgba(0,0,0,0.3)', `0 2px 16px ${color}44`]\n  )\n\n  return (\n    <motion.div\n      initial={{ opacity: 0, x: -16 }}\n      animate={{ opacity: 1, x: 0 }}\n      transition={{ type: 'spring', stiffness: 200, damping: 22, delay }}\n      className=\"flex items-center justify-between\"\n    >\n      <div className=\"flex flex-col\">\n        <span className=\"text-sm font-medium text-white/60\">{label}</span>\n        <motion.span\n          animate={{ opacity: on ? 1 : 0.5 }}\n          className=\"text-[11px]\"\n          style={{ color: on ? color : 'rgba(255,255,255,0.25)' }}\n        >\n          {on ? 'On' : 'Off'}\n        </motion.span>\n      </div>\n\n      <motion.button\n        onClick={() => setOn(!on)}\n        className=\"relative h-8 w-14 cursor-pointer rounded-full p-0\"\n        style={{\n          background: trackBg as unknown as string,\n          border: '1px solid',\n          borderColor: trackBorder as unknown as string,\n          boxShadow: on ? `0 0 20px ${color}15, inset 0 1px 2px rgba(0,0,0,0.1)` : 'inset 0 1px 2px rgba(0,0,0,0.2)',\n        }}\n        whileTap={{ scale: 0.95 }}\n      >\n        {/* Glow when on */}\n        <motion.div\n          className=\"absolute inset-0 rounded-full\"\n          animate={{ opacity: on ? 0.3 : 0 }}\n          style={{ background: `radial-gradient(circle at 75% 50%, ${color}, transparent 70%)` }}\n        />\n\n        {/* Thumb */}\n        <motion.div\n          className=\"absolute top-1/2 h-6 w-6 rounded-full\"\n          style={{\n            x: thumbX,\n            y: '-50%',\n            background: on\n              ? `linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))`\n              : 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.5))',\n            boxShadow: thumbShadow,\n          }}\n        >\n          {/* Thumb inner highlight */}\n          <div\n            className=\"absolute inset-[2px] rounded-full\"\n            style={{\n              background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 60%)',\n            }}\n          />\n        </motion.div>\n      </motion.button>\n    </motion.div>\n  )\n}\n\nexport function GlassToggle() {\n  return (\n    <div className=\"relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\">\n      {/* Background image */}\n      <img\n        src=\"https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png\"\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n      {/* Settings panel */}\n      <motion.div\n        initial={{ opacity: 0, y: 20, scale: 0.96 }}\n        animate={{ opacity: 1, y: 0, scale: 1 }}\n        transition={{ type: 'spring', stiffness: 200, damping: 22 }}\n        className=\"relative flex w-[320px] flex-col gap-5 rounded-3xl px-7 py-7\"\n        style={{\n          background: 'rgba(255, 255, 255, 0.06)',\n          backdropFilter: 'blur(24px) saturate(1.6)',\n          WebkitBackdropFilter: 'blur(24px) saturate(1.6)',\n          border: '1px solid rgba(255, 255, 255, 0.1)',\n          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)',\n        }}\n      >\n        {/* Top highlight */}\n        <div\n          className=\"absolute left-7 right-7 top-0 h-[1px]\"\n          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}\n        />\n\n        {/* Header */}\n        <h3 className=\"text-base font-semibold text-white/80\">Preferences</h3>\n\n        <Toggle label=\"Dark Mode\" defaultOn={true} color=\"#FF6BF5\" delay={0.1} />\n\n        <div className=\"h-[1px] w-full\" style={{ background: 'rgba(255,255,255,0.06)' }} />\n\n        <Toggle label=\"Notifications\" defaultOn={true} color=\"#06D6A0\" delay={0.15} />\n\n        <div className=\"h-[1px] w-full\" style={{ background: 'rgba(255,255,255,0.06)' }} />\n\n        <Toggle label=\"Auto-Update\" defaultOn={false} color=\"#FFBE0B\" delay={0.2} />\n\n        <div className=\"h-[1px] w-full\" style={{ background: 'rgba(255,255,255,0.06)' }} />\n\n        <Toggle label=\"Analytics\" defaultOn={false} color=\"#FF7B54\" delay={0.25} />\n\n        <div className=\"h-[1px] w-full\" style={{ background: 'rgba(255,255,255,0.06)' }} />\n\n        <Toggle label=\"Haptic Feedback\" defaultOn={true} color=\"#3A86FF\" delay={0.3} />\n      </motion.div>\n    </div>\n  )\n}\n"

const GLASSMUSICPLAYER_CODE = "'use client'\n\nimport { useState, useEffect, useRef } from 'react'\nimport { motion, AnimatePresence } from 'framer-motion'\nimport { Play, Pause, SkipBack, SkipForward, SpeakerHigh } from '@phosphor-icons/react'\n\nconst TRACKS = [\n  { title: 'Midnight Drive', artist: 'Neon Collective', color: '#FF6BF5', duration: 234 },\n  { title: 'Glass Horizons', artist: 'Aurora Synth', color: '#06D6A0', duration: 198 },\n  { title: 'Warm Signal', artist: 'Dusk Protocol', color: '#FF7B54', duration: 267 },\n]\n\nfunction formatTime(s: number) {\n  const m = Math.floor(s / 60)\n  const sec = Math.floor(s % 60)\n  return `${m}:${sec.toString().padStart(2, '0')}`\n}\n\nexport function GlassMusicPlayer() {\n  const [trackIdx, setTrackIdx] = useState(0)\n  const [playing, setPlaying] = useState(false)\n  const [progress, setProgress] = useState(0)\n  const rafRef = useRef<number>(0)\n  const startRef = useRef(0)\n  const progressRef = useRef(0)\n\n  const track = TRACKS[trackIdx]\n\n  useEffect(() => {\n    if (!playing) {\n      cancelAnimationFrame(rafRef.current)\n      return\n    }\n\n    startRef.current = performance.now() - progressRef.current * track.duration * 10\n    const tick = () => {\n      const elapsed = performance.now() - startRef.current\n      const pct = Math.min(elapsed / (track.duration * 10), 1)\n      progressRef.current = pct\n      setProgress(pct)\n      if (pct < 1) {\n        rafRef.current = requestAnimationFrame(tick)\n      } else {\n        setPlaying(false)\n        progressRef.current = 0\n        setProgress(0)\n      }\n    }\n    rafRef.current = requestAnimationFrame(tick)\n\n    return () => cancelAnimationFrame(rafRef.current)\n  }, [playing, track.duration])\n\n  const skipTo = (dir: -1 | 1) => {\n    setPlaying(false)\n    progressRef.current = 0\n    setProgress(0)\n    setTrackIdx((i) => (i + dir + TRACKS.length) % TRACKS.length)\n  }\n\n  return (\n    <div className=\"relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\">\n      {/* Background image */}\n      <img\n        src=\"https://ik.imagekit.io/aitoolkit/bg%20images/glass%20background.png\"\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n      {/* Player */}\n      <motion.div\n        initial={{ opacity: 0, y: 24, scale: 0.95 }}\n        animate={{ opacity: 1, y: 0, scale: 1 }}\n        transition={{ type: 'spring', stiffness: 200, damping: 22 }}\n        className=\"relative w-[340px] overflow-hidden rounded-3xl\"\n        style={{\n          background: 'rgba(255, 255, 255, 0.07)',\n          backdropFilter: 'blur(40px) saturate(1.8)',\n          WebkitBackdropFilter: 'blur(40px) saturate(1.8)',\n          border: '1px solid rgba(255, 255, 255, 0.1)',\n          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',\n        }}\n      >\n        {/* Top highlight */}\n        <div\n          className=\"absolute left-8 right-8 top-0 h-[1px]\"\n          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}\n        />\n\n        <div className=\"flex flex-col items-center px-8 pb-7 pt-8\">\n          {/* Album art placeholder */}\n          <AnimatePresence mode=\"wait\">\n            <motion.div\n              key={trackIdx}\n              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}\n              animate={{ opacity: 1, scale: 1, rotate: 0 }}\n              exit={{ opacity: 0, scale: 0.9, rotate: 5 }}\n              transition={{ type: 'spring', stiffness: 300, damping: 25 }}\n              className=\"mb-6 flex h-40 w-40 items-center justify-center rounded-2xl\"\n              style={{\n                background: `linear-gradient(135deg, ${track.color}33, ${track.color}11)`,\n                border: `1px solid ${track.color}22`,\n                boxShadow: `0 8px 32px ${track.color}22`,\n              }}\n            >\n              {/* Vinyl rings */}\n              <motion.div\n                animate={{ rotate: playing ? 360 : 0 }}\n                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}\n                className=\"relative h-24 w-24\"\n              >\n                {[0.9, 0.7, 0.5, 0.3].map((scale, i) => (\n                  <div\n                    key={i}\n                    className=\"absolute inset-0 rounded-full\"\n                    style={{\n                      transform: `scale(${scale})`,\n                      border: `1px solid ${track.color}${i === 0 ? '33' : '18'}`,\n                    }}\n                  />\n                ))}\n                <div\n                  className=\"absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full\"\n                  style={{ background: track.color, opacity: 0.6 }}\n                />\n              </motion.div>\n            </motion.div>\n          </AnimatePresence>\n\n          {/* Track info */}\n          <AnimatePresence mode=\"wait\">\n            <motion.div\n              key={trackIdx}\n              initial={{ opacity: 0, y: 8 }}\n              animate={{ opacity: 1, y: 0 }}\n              exit={{ opacity: 0, y: -8 }}\n              className=\"mb-5 flex flex-col items-center\"\n            >\n              <h3 className=\"text-base font-semibold text-white/90\">{track.title}</h3>\n              <p className=\"text-sm text-white/40\">{track.artist}</p>\n            </motion.div>\n          </AnimatePresence>\n\n          {/* Progress bar */}\n          <div className=\"mb-2 w-full\">\n            <div\n              className=\"h-1 w-full overflow-hidden rounded-full\"\n              style={{ background: 'rgba(255,255,255,0.08)' }}\n            >\n              <motion.div\n                className=\"h-full rounded-full\"\n                style={{\n                  width: `${progress * 100}%`,\n                  background: `linear-gradient(90deg, ${track.color}88, ${track.color})`,\n                  boxShadow: `0 0 8px ${track.color}44`,\n                }}\n              />\n            </div>\n            <div className=\"mt-1.5 flex justify-between\">\n              <span className=\"text-[11px] text-white/30\">\n                {formatTime(progress * track.duration)}\n              </span>\n              <span className=\"text-[11px] text-white/30\">{formatTime(track.duration)}</span>\n            </div>\n          </div>\n\n          {/* Controls */}\n          <div className=\"flex items-center gap-6\">\n            <motion.button\n              whileHover={{ scale: 1.15 }}\n              whileTap={{ scale: 0.9 }}\n              onClick={() => skipTo(-1)}\n              className=\"cursor-pointer text-white/40 transition-colors hover:text-white/70\"\n            >\n              <SkipBack size={22} weight=\"regular\" />\n            </motion.button>\n\n            <motion.button\n              whileHover={{ scale: 1.1 }}\n              whileTap={{ scale: 0.9 }}\n              onClick={() => setPlaying(!playing)}\n              className=\"flex h-12 w-12 cursor-pointer items-center justify-center rounded-full\"\n              style={{\n                background: `linear-gradient(135deg, ${track.color}55, ${track.color}33)`,\n                border: '1px solid rgba(255,255,255,0.15)',\n                boxShadow: `0 4px 16px ${track.color}33`,\n              }}\n            >\n              {playing ? (\n                <Pause size={20} weight=\"regular\" className=\"text-white\" />\n              ) : (\n                <Play size={20} weight=\"regular\" className=\"ml-0.5 text-white\" />\n              )}\n            </motion.button>\n\n            <motion.button\n              whileHover={{ scale: 1.15 }}\n              whileTap={{ scale: 0.9 }}\n              onClick={() => skipTo(1)}\n              className=\"cursor-pointer text-white/40 transition-colors hover:text-white/70\"\n            >\n              <SkipForward size={22} weight=\"regular\" />\n            </motion.button>\n          </div>\n        </div>\n      </motion.div>\n    </div>\n  )\n}\n"

const GLASSNOTIFICATION_CODE = "'use client'\n\nimport { useState } from 'react'\nimport { motion, AnimatePresence } from 'framer-motion'\nimport { Bell, ChatCircle, Heart, ShieldCheck, X, ArrowUp } from '@phosphor-icons/react'\n\ninterface Notification {\n  id: number\n  icon: typeof Bell\n  color: string\n  title: string\n  message: string\n  time: string\n}\n\nconst INITIAL_NOTIFICATIONS: Notification[] = [\n  {\n    id: 1,\n    icon: ChatCircle,\n    color: '#3A86FF',\n    title: 'New Message',\n    message: 'Alex sent you a photo',\n    time: '2m ago',\n  },\n  {\n    id: 2,\n    icon: Heart,\n    color: '#FF7B54',\n    title: 'New Like',\n    message: 'Sarah liked your post',\n    time: '5m ago',\n  },\n  {\n    id: 3,\n    icon: ShieldCheck,\n    color: '#06D6A0',\n    title: 'Security',\n    message: 'New login from MacBook Pro',\n    time: '12m ago',\n  },\n  {\n    id: 4,\n    icon: ArrowUp,\n    color: '#B388FF',\n    title: 'Update Available',\n    message: 'Version 4.2 is ready to install',\n    time: '1h ago',\n  },\n  {\n    id: 5,\n    icon: Bell,\n    color: '#FFBE0B',\n    title: 'Reminder',\n    message: 'Team standup in 15 minutes',\n    time: '1h ago',\n  },\n]\n\nfunction NotificationCard({\n  notification,\n  onDismiss,\n  index,\n}: {\n  notification: Notification\n  onDismiss: (id: number) => void\n  index: number\n}) {\n  const Icon = notification.icon\n\n  return (\n    <motion.div\n      layout\n      initial={{ opacity: 0, x: 60, scale: 0.9 }}\n      animate={{ opacity: 1, x: 0, scale: 1 }}\n      exit={{ opacity: 0, x: -60, scale: 0.9, filter: 'blur(4px)' }}\n      transition={{ type: 'spring', stiffness: 280, damping: 24, delay: index * 0.05 }}\n      drag=\"x\"\n      dragConstraints={{ left: 0, right: 0 }}\n      dragElastic={0.3}\n      onDragEnd={(_, info) => {\n        if (Math.abs(info.offset.x) > 80) {\n          onDismiss(notification.id)\n        }\n      }}\n      className=\"group relative w-full cursor-grab overflow-hidden rounded-2xl active:cursor-grabbing transition-colors duration-200\"\n      style={{\n        background: 'rgba(255, 255, 255, 0.06)',\n        backdropFilter: 'blur(20px) saturate(1.6)',\n        WebkitBackdropFilter: 'blur(20px) saturate(1.6)',\n        border: '1px solid rgba(255, 255, 255, 0.08)',\n        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.06)',\n      }}\n      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}\n    >\n      <div className=\"flex items-start gap-3.5 px-4 py-3.5 pr-12\">\n        {/* Icon */}\n        <motion.div\n          initial={{ scale: 0 }}\n          animate={{ scale: 1 }}\n          transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 + index * 0.05 }}\n          className=\"mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl\"\n          style={{\n            background: `${notification.color}18`,\n            border: `1px solid ${notification.color}22`,\n          }}\n        >\n          <Icon size={18} weight=\"regular\" style={{ color: notification.color }} />\n        </motion.div>\n\n        {/* Content */}\n        <div className=\"min-w-0 flex-1\">\n          <h4 className=\"text-sm font-semibold text-white/85\">{notification.title}</h4>\n          <p className=\"mt-0.5 text-[13px] text-white/40\">{notification.message}</p>\n        </div>\n      </div>\n\n      {/* Dismiss + time — positioned top-right */}\n      <div className=\"absolute right-3 top-3 flex flex-col items-end gap-1.5\">\n        <motion.button\n          whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.15)' }}\n          whileTap={{ scale: 0.85 }}\n          onClick={() => onDismiss(notification.id)}\n          className=\"flex h-5 w-5 cursor-pointer items-center justify-center rounded-full\"\n          style={{\n            background: 'rgba(255,255,255,0.06)',\n          }}\n        >\n          <X size={11} weight=\"regular\" className=\"text-white/30\" />\n        </motion.button>\n        <span className=\"text-[10px] text-white/25\">{notification.time}</span>\n      </div>\n\n      {/* Bottom accent line */}\n      <div\n        className=\"absolute bottom-0 left-4 right-4 h-[1px]\"\n        style={{\n          background: `linear-gradient(90deg, transparent, ${notification.color}22, transparent)`,\n        }}\n      />\n    </motion.div>\n  )\n}\n\nexport function GlassNotification() {\n  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)\n\n  const dismiss = (id: number) => {\n    setNotifications((prev) => prev.filter((n) => n.id !== id))\n  }\n\n  const reset = () => setNotifications(INITIAL_NOTIFICATIONS)\n\n  return (\n    <div className=\"relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\">\n      {/* Background image */}\n      <img\n        src=\"https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png\"\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n      {/* Notification stack */}\n      <motion.div\n        initial={{ opacity: 0 }}\n        animate={{ opacity: 1 }}\n        className=\"relative flex w-[360px] flex-col gap-2.5\"\n      >\n        {/* Header */}\n        <div className=\"mb-1 flex items-center justify-between px-1\">\n          <div className=\"flex items-center gap-2\">\n            <Bell size={20} weight=\"regular\" className=\"text-white/40\" />\n            <span className=\"text-sm font-semibold text-white/60\">\n              Notifications\n            </span>\n            {notifications.length > 0 && (\n              <motion.span\n                layout\n                className=\"flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold text-white\"\n                style={{\n                  background: 'rgba(255, 107, 245, 0.4)',\n                  border: '1px solid rgba(255, 107, 245, 0.3)',\n                }}\n              >\n                {notifications.length}\n              </motion.span>\n            )}\n          </div>\n          {notifications.length < INITIAL_NOTIFICATIONS.length && (\n            <motion.button\n              initial={{ opacity: 0, scale: 0.8 }}\n              animate={{ opacity: 1, scale: 1 }}\n              whileHover={{ scale: 1.05 }}\n              whileTap={{ scale: 0.95 }}\n              onClick={reset}\n              className=\"cursor-pointer text-xs font-medium text-white/30 transition-colors hover:text-white/50\"\n            >\n              Reset\n            </motion.button>\n          )}\n        </div>\n\n        {/* Cards */}\n        <AnimatePresence mode=\"popLayout\">\n          {notifications.map((n, i) => (\n            <NotificationCard key={n.id} notification={n} onDismiss={dismiss} index={i} />\n          ))}\n        </AnimatePresence>\n\n        {/* Empty state */}\n        <AnimatePresence>\n          {notifications.length === 0 && (\n            <motion.div\n              initial={{ opacity: 0, scale: 0.9 }}\n              animate={{ opacity: 1, scale: 1 }}\n              className=\"flex flex-col items-center gap-3 py-12\"\n            >\n              <span className=\"text-sm text-white/60\">All caught up</span>\n            </motion.div>\n          )}\n        </AnimatePresence>\n      </motion.div>\n    </div>\n  )\n}\n"

const GLASS_AI_COMPOSE_CODE = "'use client'\n\nimport { useState, useRef, useEffect, useCallback } from 'react'\nimport { motion, AnimatePresence, useReducedMotion } from 'framer-motion'\nimport {\n  PaperPlaneRight,\n  ImageSquare,\n  GlobeSimple,\n  X,\n} from '@phosphor-icons/react'\n\n// ─── Constants ──────────────────────────────────────────────────────────────\n\nconst BACKGROUND =\n  'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133'\n\nconst MODELS = [\n  { label: 'Claude',     color: '#FF7B54' },\n  { label: 'ChatGPT',    color: '#10A37F' },\n  { label: 'Perplexity', color: '#3A86FF' },\n  { label: 'Gemini',     color: '#FFBE0B' },\n] as const\n\ntype Model = (typeof MODELS)[number]\n\nconst MAX_TEXTAREA_HEIGHT = 160\n\n// ─── Glass family shared styles ─────────────────────────────────────────────\n\nconst glassBlur = {\n  backdropFilter: 'blur(24px) saturate(1.8)',\n  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',\n} as const\n\nconst glassPanel = {\n  background: 'rgba(255, 255, 255, 0.08)',\n  border: '1px solid rgba(255, 255, 255, 0.1)',\n  boxShadow:\n    '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',\n} as const\n\nconst ACTIVE_GLOW =\n  '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 0 1.5px rgba(255, 255, 255, 0.25), 0 0 20px rgba(255, 255, 255, 0.06)'\n\n// ─── Model Switcher ─────────────────────────────────────────────────────────\n\nfunction ModelSwitcher({\n  activeModel,\n  onSelect,\n}: {\n  activeModel: Model\n  onSelect: (model: Model) => void\n}) {\n  return (\n    <div className=\"relative flex items-center gap-0.5\">\n      {MODELS.map((model) => {\n        const isActive = model.label === activeModel.label\n        return (\n          <button\n            key={model.label}\n            onClick={() => onSelect(model)}\n            className=\"relative z-10 flex cursor-pointer flex-col items-center rounded-lg px-3 py-1.5\"\n            style={{ background: 'transparent', flex: 1 }}\n          >\n            {isActive && (\n              <motion.div\n                layoutId=\"model-pill\"\n                className=\"absolute inset-0 rounded-lg\"\n                style={{\n                  background: `${model.color}18`,\n                  border: `1px solid ${model.color}22`,\n                }}\n                transition={{ type: 'spring', stiffness: 400, damping: 28 }}\n              />\n            )}\n            <span\n              className=\"relative z-10 text-[11px] font-semibold\"\n              style={{\n                color: isActive ? model.color : 'rgba(255,255,255,0.50)',\n                transition: 'color 0.15s',\n              }}\n            >\n              {model.label}\n            </span>\n          </button>\n        )\n      })}\n    </div>\n  )\n}\n\n// ─── Image Thumbnail ────────────────────────────────────────────────────────\n\nfunction ImageThumbnail({\n  src,\n  onRemove,\n}: {\n  src: string\n  onRemove: () => void\n}) {\n  return (\n    <motion.div\n      initial={{ opacity: 0, scale: 0.8 }}\n      animate={{ opacity: 1, scale: 1 }}\n      exit={{ opacity: 0, scale: 0.8 }}\n      transition={{ type: 'spring', stiffness: 350, damping: 25 }}\n      className=\"relative h-16 w-16 shrink-0 overflow-hidden rounded-xl\"\n      style={{\n        border: '1px solid rgba(255, 255, 255, 0.12)',\n      }}\n    >\n      <img\n        src={src}\n        alt=\"Upload preview\"\n        className=\"h-full w-full object-cover\"\n      />\n      <motion.button\n        onClick={onRemove}\n        whileHover={{ scale: 1.1 }}\n        whileTap={{ scale: 0.85 }}\n        className=\"absolute right-1 top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full\"\n        style={{\n          background: 'rgba(0, 0, 0, 0.6)',\n          border: '1px solid rgba(255, 255, 255, 0.15)',\n        }}\n      >\n        <X size={10} weight=\"regular\" className=\"text-white/80\" />\n      </motion.button>\n    </motion.div>\n  )\n}\n\n// ─── Main Component ─────────────────────────────────────────────────────────\n\nexport function GlassAiCompose() {\n  const [isActive, setIsActive] = useState(false)\n  const [message, setMessage] = useState('')\n  const [activeModel, setActiveModel] = useState<Model>(MODELS[0]) // Claude default\n  const [images, setImages] = useState<string[]>([])\n  const [webSearch, setWebSearch] = useState(false)\n  const [showWebLabel, setShowWebLabel] = useState(false)\n\n  const containerRef = useRef<HTMLDivElement>(null)\n  const textareaRef = useRef<HTMLTextAreaElement>(null)\n  const fileInputRef = useRef<HTMLInputElement>(null)\n\n  const prefersReduced = useReducedMotion()\n  const reducedMotion = prefersReduced ?? false\n\n  const canSend = message.trim().length > 0 || images.length > 0\n\n  // Flash \"Web search on\" label for 2 seconds\n  useEffect(() => {\n    if (!webSearch) { setShowWebLabel(false); return }\n    setShowWebLabel(true)\n    const timer = setTimeout(() => setShowWebLabel(false), 1000)\n    return () => clearTimeout(timer)\n  }, [webSearch])\n\n  // Auto-resize textarea\n  const resizeTextarea = useCallback(() => {\n    const el = textareaRef.current\n    if (!el) return\n    el.style.height = 'auto'\n    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`\n  }, [])\n\n  // Click outside to deactivate\n  useEffect(() => {\n    if (!isActive) return\n    const handler = (e: MouseEvent | TouchEvent) => {\n      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {\n        setIsActive(false)\n      }\n    }\n    document.addEventListener('mousedown', handler)\n    document.addEventListener('touchstart', handler)\n    return () => {\n      document.removeEventListener('mousedown', handler)\n      document.removeEventListener('touchstart', handler)\n    }\n  }, [isActive])\n\n  // Handle image upload\n  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {\n    const files = e.target.files\n    if (!files) return\n    for (let i = 0; i < files.length; i++) {\n      const reader = new FileReader()\n      reader.onload = (ev) => {\n        if (ev.target?.result) {\n          setImages((prev) => [...prev, ev.target!.result as string])\n        }\n      }\n      reader.readAsDataURL(files[i])\n    }\n    // Reset input so re-uploading the same file works\n    e.target.value = ''\n  }\n\n  function handleSend() {\n    if (!canSend) return\n    setMessage('')\n    setImages([])\n    if (textareaRef.current) {\n      textareaRef.current.style.height = 'auto'\n    }\n  }\n\n  function handleKeyDown(e: React.KeyboardEvent) {\n    if (e.key === 'Enter' && !e.shiftKey) {\n      e.preventDefault()\n      handleSend()\n    }\n  }\n\n  const springOrFade = reducedMotion\n    ? { duration: 0.15 }\n    : { type: 'spring' as const, stiffness: 350, damping: 28 }\n\n  return (\n    <div className=\"relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\">\n      {/* Background image */}\n      <img\n        src={BACKGROUND}\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n\n      {/* Compose container */}\n      <div\n        ref={containerRef}\n        className=\"relative z-10 w-[calc(100%-2rem)] max-w-[420px]\"\n      >\n        <motion.div\n          animate={{\n            boxShadow: isActive ? ACTIVE_GLOW : glassPanel.boxShadow,\n          }}\n          transition={springOrFade}\n          className=\"relative isolate overflow-hidden rounded-2xl\"\n          style={{\n            background: glassPanel.background,\n            border: glassPanel.border,\n          }}\n        >\n          {/* Blur layer */}\n          <div\n            className=\"pointer-events-none absolute inset-0 z-[-1] rounded-2xl\"\n            style={glassBlur}\n          />\n\n          {/* Top edge highlight */}\n          <div\n            className=\"absolute left-6 right-6 top-0 z-10 h-[1px]\"\n            style={{\n              background:\n                'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',\n            }}\n          />\n\n          {/* Compose area */}\n          <div className=\"relative z-10 flex flex-col gap-6 p-4 pb-2\">\n            {/* Textarea */}\n            <textarea\n              ref={textareaRef}\n              value={message}\n              onChange={(e) => {\n                setMessage(e.target.value)\n                resizeTextarea()\n              }}\n              onFocus={() => setIsActive(true)}\n              onKeyDown={handleKeyDown}\n              placeholder=\"Ask anything...\"\n              rows={1}\n              className=\"w-full resize-none bg-transparent font-sans text-sm font-medium text-white/90 placeholder-white/40 outline-none\"\n              style={{\n                caretColor: activeModel.color,\n                maxHeight: MAX_TEXTAREA_HEIGHT,\n              }}\n            />\n\n            {/* Image thumbnails */}\n            <AnimatePresence>\n              {images.length > 0 && (\n                <motion.div\n                  initial={{ opacity: 0, height: 0 }}\n                  animate={{ opacity: 1, height: 'auto' }}\n                  exit={{ opacity: 0, height: 0 }}\n                  transition={springOrFade}\n                  className=\"flex gap-2 overflow-hidden\"\n                >\n                  <AnimatePresence>\n                    {images.map((src, i) => (\n                      <ImageThumbnail\n                        key={`${i}-${src.slice(-20)}`}\n                        src={src}\n                        onRemove={() =>\n                          setImages((prev) => prev.filter((_, idx) => idx !== i))\n                        }\n                      />\n                    ))}\n                  </AnimatePresence>\n                </motion.div>\n              )}\n            </AnimatePresence>\n\n            {/* Toolbar — upload + send */}\n            <div className=\"flex items-center justify-between\">\n              {/* Left — upload */}\n              <div className=\"flex items-center gap-2\">\n                <motion.button\n                  onClick={() => fileInputRef.current?.click()}\n                  whileHover={reducedMotion ? undefined : { scale: 1.08, background: 'rgba(255, 255, 255, 0.14)' }}\n                  whileTap={reducedMotion ? undefined : { scale: 0.88 }}\n                  transition={{ type: 'spring', stiffness: 320, damping: 20 }}\n                  className=\"flex cursor-pointer items-center justify-center rounded-xl\"\n                  style={{\n                    width: 32,\n                    height: 32,\n                    background: 'rgba(255, 255, 255, 0.08)',\n                    border: '1px solid rgba(255, 255, 255, 0.12)',\n                  }}\n                >\n                  <ImageSquare\n                    size={16}\n                    weight=\"regular\"\n                    style={{\n                      color: 'rgba(255, 255, 255, 0.5)',\n                      transition: 'color 0.15s',\n                    }}\n                  />\n                </motion.button>\n                <input\n                  ref={fileInputRef}\n                  type=\"file\"\n                  accept=\"image/*\"\n                  multiple\n                  onChange={handleImageUpload}\n                  className=\"hidden\"\n                />\n\n                {/* Web search toggle */}\n                <motion.button\n                  onClick={() => setWebSearch((v) => !v)}\n                  whileHover={reducedMotion ? undefined : { scale: 1.08, background: webSearch ? `${activeModel.color}28` : 'rgba(255, 255, 255, 0.14)' }}\n                  whileTap={reducedMotion ? undefined : { scale: 0.88 }}\n                  transition={{ type: 'spring', stiffness: 320, damping: 20 }}\n                  className=\"flex cursor-pointer items-center justify-center rounded-xl\"\n                  style={{\n                    width: 32,\n                    height: 32,\n                    background: webSearch ? `${activeModel.color}18` : 'rgba(255, 255, 255, 0.08)',\n                    border: webSearch ? `1px solid ${activeModel.color}22` : '1px solid rgba(255, 255, 255, 0.12)',\n                    transition: 'background 0.15s, border 0.15s',\n                  }}\n                >\n                  <GlobeSimple\n                    size={16}\n                    weight=\"regular\"\n                    style={{\n                      color: webSearch ? activeModel.color : 'rgba(255, 255, 255, 0.5)',\n                      transition: 'color 0.15s',\n                    }}\n                  />\n                </motion.button>\n\n                {/* Web search label */}\n                <AnimatePresence>\n                  {showWebLabel && (\n                    <motion.span\n                      initial={{ opacity: 0, x: -4 }}\n                      animate={{ opacity: 1, x: 0 }}\n                      exit={{ opacity: 0, x: -4 }}\n                      transition={{ duration: 0.15 }}\n                      className=\"text-[10px] font-semibold\"\n                      style={{ color: `${activeModel.color}88` }}\n                    >\n                      Web search on\n                    </motion.span>\n                  )}\n                </AnimatePresence>\n              </div>\n\n              {/* Right — send */}\n              <motion.button\n                onClick={handleSend}\n                disabled={!canSend}\n                animate={{\n                  background: canSend\n                    ? `${activeModel.color}40`\n                    : 'rgba(255, 255, 255, 0.06)',\n                  border: canSend\n                    ? `1px solid ${activeModel.color}66`\n                    : '1px solid rgba(255, 255, 255, 0.08)',\n                }}\n                whileHover={\n                  canSend && !reducedMotion ? { scale: 1.08 } : undefined\n                }\n                whileTap={\n                  canSend && !reducedMotion ? { scale: 0.88 } : undefined\n                }\n                transition={{ type: 'spring', stiffness: 320, damping: 20 }}\n                className=\"flex cursor-pointer items-center justify-center rounded-xl\"\n                style={{\n                  width: 36,\n                  height: 36,\n                  opacity: canSend ? 1 : 0.4,\n                  pointerEvents: canSend ? 'auto' : 'none',\n                }}\n              >\n                <PaperPlaneRight\n                  size={16}\n                  weight=\"regular\"\n                  style={{\n                    color: canSend\n                      ? activeModel.color\n                      : 'rgba(255, 255, 255, 0.3)',\n                    transition: 'color 0.15s',\n                  }}\n                />\n              </motion.button>\n            </div>\n          </div>\n\n          {/* Divider */}\n          <div\n            className=\"mx-4 h-[1px]\"\n            style={{ background: 'rgba(255, 255, 255, 0.07)' }}\n          />\n\n          {/* Model switcher */}\n          <div className=\"relative z-10 px-3 py-2.5\">\n            <ModelSwitcher activeModel={activeModel} onSelect={setActiveModel} />\n          </div>\n        </motion.div>\n      </div>\n    </div>\n  )\n}\n"
const GLASS_STEPPER_CODE = "'use client'\n\nimport { useState, useRef } from 'react'\nimport { motion, AnimatePresence, useReducedMotion } from 'framer-motion'\nimport { Minus, Plus } from '@phosphor-icons/react'\n\n// ─── Glass family shared styles ─────────────────────────────────────────────\n\nconst glassBlur = {\n  backdropFilter: 'blur(24px) saturate(1.8)',\n  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',\n} as const\n\nconst glassPanel = {\n  background: 'rgba(255, 255, 255, 0.08)',\n  border: '1px solid rgba(255, 255, 255, 0.1)',\n  boxShadow:\n    '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',\n} as const\n\nconst BACKGROUND_IMAGE =\n  'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133'\n\n// ─── Spring configs ──────────────────────────────────────────────────────────\n\nconst BUTTON_SPRING = { type: 'spring' as const, stiffness: 300, damping: 20 }\n\n// ─── Types ───────────────────────────────────────────────────────────────────\n\ninterface GlassStepperFieldProps {\n  min?: number\n  max?: number\n  step?: number\n  initialValue?: number\n  label?: string\n  color: string\n  gradient: string\n}\n\n// ─── GlassStepperField ──────────────────────────────────────────────────────\n\nfunction GlassStepperField({\n  min = 0,\n  max = 10,\n  step = 1,\n  initialValue,\n  label,\n  color,\n  gradient,\n}: GlassStepperFieldProps) {\n  const prefersReduced = useReducedMotion()\n  const [value, setValue] = useState(initialValue ?? min)\n  const directionRef = useRef<1 | -1>(1)\n\n  const atMin = value <= min\n  const atMax = value >= max\n\n  function increment() {\n    if (atMax) return\n    directionRef.current = 1\n    setValue((prev) => Math.min(prev + step, max))\n  }\n\n  function decrement() {\n    if (atMin) return\n    directionRef.current = -1\n    setValue((prev) => Math.max(prev - step, min))\n  }\n\n  const slideOffset = prefersReduced ? 0 : 24\n  const direction = directionRef.current\n\n  return (\n    <div className=\"flex w-[132px] flex-col\">\n      {/* Label + value readout */}\n      {label && (\n        <div className=\"mb-2 flex items-baseline justify-between px-1\">\n          <span className=\"font-sans text-[10px] font-semibold uppercase tracking-widest text-white/40\">\n            {label}\n          </span>\n          <span\n            className=\"font-sans text-[10px] font-semibold tabular-nums\"\n            style={{ color: `${color}88` }}\n          >\n            {value} / {max}\n          </span>\n        </div>\n      )}\n\n      {/* Stepper pill */}\n      <div\n        className=\"relative isolate overflow-hidden rounded-2xl\"\n        style={glassPanel}\n      >\n        {/* Blur layer — non-animating, behind content */}\n        <div\n          className=\"pointer-events-none absolute inset-0 z-[-1] rounded-2xl\"\n          style={glassBlur}\n        />\n\n        {/* Top edge highlight */}\n        <div\n          className=\"absolute left-4 right-4 top-0 z-10 h-[1px]\"\n          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }}\n        />\n\n        {/* Content row */}\n        <div className=\"relative z-10 flex items-stretch justify-between p-2\">\n          {/* Minus button — notification-style tinted */}\n          <motion.button\n            onClick={decrement}\n            whileHover={atMin || prefersReduced ? undefined : { scale: 1.08 }}\n            whileTap={atMin || prefersReduced ? undefined : { scale: 0.88 }}\n            transition={BUTTON_SPRING}\n            disabled={atMin}\n            aria-label=\"Decrease\"\n            className=\"flex cursor-pointer items-center justify-center rounded-xl\"\n            style={{\n              width: 36,\n              outline: 'none',\n              background: `${color}${atMin ? '0a' : '18'}`,\n              border: `1px solid ${color}${atMin ? '0a' : '22'}`,\n              opacity: atMin ? 0.4 : 1,\n              pointerEvents: atMin ? 'none' : 'auto',\n            }}\n          >\n            <Minus size={16} weight=\"regular\" style={{ color: atMin ? 'rgba(255,255,255,0.3)' : color }} />\n          </motion.button>\n\n          {/* Number display */}\n          <div\n            className=\"flex items-center justify-center overflow-hidden\"\n            style={{ width: 36 }}\n          >\n            <AnimatePresence mode=\"popLayout\" initial={false}>\n              <motion.span\n                key={value}\n                initial={{\n                  opacity: 0,\n                  y: direction * slideOffset,\n                  scale: 0.5,\n                }}\n                animate={{\n                  opacity: 1,\n                  y: 0,\n                  scale: 1,\n                }}\n                exit={{\n                  opacity: 0,\n                  y: direction * -slideOffset,\n                  scale: 1.4,\n                }}\n                transition={\n                  prefersReduced\n                    ? { duration: 0.15 }\n                    : { type: 'spring', stiffness: 260, damping: 18 }\n                }\n                className=\"font-sans text-base font-bold tabular-nums\"\n                style={{\n                  background: `linear-gradient(135deg, ${gradient})`,\n                  WebkitBackgroundClip: 'text',\n                  WebkitTextFillColor: 'transparent',\n                  backgroundClip: 'text',\n                }}\n              >\n                {value}\n              </motion.span>\n            </AnimatePresence>\n          </div>\n\n          {/* Plus button — notification-style tinted */}\n          <motion.button\n            onClick={increment}\n            whileHover={atMax || prefersReduced ? undefined : { scale: 1.08 }}\n            whileTap={atMax || prefersReduced ? undefined : { scale: 0.88 }}\n            transition={BUTTON_SPRING}\n            disabled={atMax}\n            aria-label=\"Increase\"\n            className=\"flex cursor-pointer items-center justify-center rounded-xl\"\n            style={{\n              width: 36,\n              outline: 'none',\n              background: `${color}${atMax ? '0a' : '18'}`,\n              border: `1px solid ${color}${atMax ? '0a' : '22'}`,\n              opacity: atMax ? 0.4 : 1,\n              pointerEvents: atMax ? 'none' : 'auto',\n            }}\n          >\n            <Plus size={16} weight=\"regular\" style={{ color: atMax ? 'rgba(255,255,255,0.3)' : color }} />\n          </motion.button>\n        </div>\n      </div>\n    </div>\n  )\n}\n\n// ─── Main export ─────────────────────────────────────────────────────────────\n\nexport function GlassStepper() {\n  return (\n    <div className=\"relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\">\n      {/* Background image */}\n      <img\n        src={BACKGROUND_IMAGE}\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n\n      {/* Steppers container */}\n      <div className=\"relative z-10 flex flex-wrap items-start justify-center gap-5 px-4\">\n        <GlassStepperField\n          label=\"Quantity\"\n          min={0}\n          max={10}\n          step={1}\n          initialValue={0}\n          color=\"#3A86FF\"\n          gradient=\"#3A86FF, #2962FF\"\n        />\n        <GlassStepperField\n          label=\"Guests\"\n          min={1}\n          max={8}\n          step={1}\n          initialValue={1}\n          color=\"#FF5C8A\"\n          gradient=\"#FF5C8A, #FF1744\"\n        />\n        <GlassStepperField\n          label=\"Volume\"\n          min={0}\n          max={100}\n          step={5}\n          initialValue={50}\n          color=\"#06D6A0\"\n          gradient=\"#06D6A0, #00BFA5\"\n        />\n      </div>\n    </div>\n  )\n}\n"
const GLASS_TOAST_CODE = "'use client'\n\nimport { useState, useRef, useEffect, useCallback } from 'react'\nimport { motion, AnimatePresence, useReducedMotion } from 'framer-motion'\nimport {\n  CheckCircle,\n  XCircle,\n  Warning,\n  Info,\n  X,\n} from '@phosphor-icons/react'\n\n// ─── Constants ────────────────────────────────────────────────────────────────\n\nconst GLASS_BLUR = {\n  backdropFilter: 'blur(24px) saturate(1.8)',\n  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',\n} as const\n\nconst GLASS_PANEL = {\n  background: 'rgba(255, 255, 255, 0.06)',\n  border: '1px solid rgba(255, 255, 255, 0.1)',\n  boxShadow:\n    '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',\n} as const\n\nconst BACKGROUND_IMAGE =\n  'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png'\n\nconst TOAST_DURATION = 4000\nconst MAX_TOASTS = 3\n\n// ─── Types ────────────────────────────────────────────────────────────────────\n\ntype ToastVariant = 'success' | 'error' | 'warning' | 'info'\n\ninterface Toast {\n  id: string\n  variant: ToastVariant\n  title: string\n  description?: string\n}\n\ninterface VariantConfig {\n  color: string\n  gradient: string\n  icon: typeof CheckCircle\n  label: string\n}\n\nconst VARIANTS: Record<ToastVariant, VariantConfig> = {\n  success: { color: '#06D6A0', gradient: '#06D6A0, #00BFA5', icon: CheckCircle, label: 'Success' },\n  error:   { color: '#FF5C8A', gradient: '#FF5C8A, #FF1744', icon: XCircle,     label: 'Error' },\n  warning: { color: '#FFBE0B', gradient: '#FFBE0B, #FF9800', icon: Warning,     label: 'Warning' },\n  info:    { color: '#3A86FF', gradient: '#3A86FF, #2962FF', icon: Info,        label: 'Info' },\n}\n\nconst DEMO_TOASTS: Record<ToastVariant, { title: string; description: string }> = {\n  success: { title: 'Changes saved', description: 'Your settings have been updated successfully' },\n  error:   { title: 'Upload failed', description: 'The file exceeds the maximum size limit' },\n  warning: { title: 'Low storage', description: 'You have less than 100MB remaining' },\n  info:    { title: 'New update', description: 'Version 2.4 is now available' },\n}\n\n// ─── Spring configs ───────────────────────────────────────────────────────────\n\nconst ENTER_SPRING = { type: 'spring' as const, stiffness: 300, damping: 26 }\nconst BUTTON_SPRING = { type: 'spring' as const, stiffness: 300, damping: 20 }\n\n// ─── Progress bar — RAF-based with pause/resume ──────────────────────────────\n\nfunction useToastProgress(\n  id: string,\n  isPaused: boolean,\n  onComplete: (id: string) => void,\n) {\n  const progressRef = useRef<HTMLDivElement>(null)\n  const elapsedRef = useRef(0)\n  const lastTimeRef = useRef(0)\n  const rafRef = useRef(0)\n\n  useEffect(() => {\n    let alive = true\n    lastTimeRef.current = performance.now()\n\n    function tick(now: number) {\n      if (!alive) return\n\n      if (!isPaused) {\n        const delta = now - lastTimeRef.current\n        elapsedRef.current += delta\n      }\n\n      lastTimeRef.current = now\n\n      const fraction = Math.max(0, 1 - elapsedRef.current / TOAST_DURATION)\n\n      if (progressRef.current) {\n        progressRef.current.style.transform = `scaleX(${fraction})`\n      }\n\n      if (fraction <= 0) {\n        onComplete(id)\n        return\n      }\n\n      rafRef.current = requestAnimationFrame(tick)\n    }\n\n    rafRef.current = requestAnimationFrame(tick)\n\n    return () => {\n      alive = false\n      cancelAnimationFrame(rafRef.current)\n    }\n  }, [id, isPaused, onComplete])\n\n  return progressRef\n}\n\n// ─── Individual toast card ───────────────────────────────────────────────────\n\nfunction ToastCard({\n  toast,\n  onDismiss,\n  prefersReduced,\n}: {\n  toast: Toast\n  onDismiss: (id: string) => void\n  prefersReduced: boolean | null\n}) {\n  const [hovered, setHovered] = useState(false)\n  const variant = VARIANTS[toast.variant]\n  const Icon = variant.icon\n\n  const handleComplete = useCallback(\n    (id: string) => onDismiss(id),\n    [onDismiss],\n  )\n\n  const progressRef = useToastProgress(toast.id, hovered, handleComplete)\n\n  const enterAnim = prefersReduced\n    ? { opacity: 0 }\n    : { opacity: 0, x: 80, scale: 0.95 }\n\n  const showAnim = prefersReduced\n    ? { opacity: 1 }\n    : { opacity: 1, x: 0, scale: 1 }\n\n  const exitAnim = prefersReduced\n    ? { opacity: 0 }\n    : { opacity: 0, x: 80, scale: 0.95 }\n\n  return (\n    <motion.div\n      layout\n      initial={enterAnim}\n      animate={{\n        ...showAnim,\n        scale: hovered && !prefersReduced ? 1.01 : 1,\n      }}\n      exit={exitAnim}\n      transition={ENTER_SPRING}\n      onMouseEnter={() => setHovered(true)}\n      onMouseLeave={() => setHovered(false)}\n      className=\"relative w-full overflow-hidden rounded-2xl\"\n      style={{ ...GLASS_PANEL }}\n    >\n      {/* Blur layer — non-animating */}\n      <div\n        className=\"pointer-events-none absolute inset-0 z-0 rounded-2xl\"\n        style={GLASS_BLUR}\n      />\n\n      {/* Content row */}\n      <div className=\"relative z-10 flex items-center gap-3 py-3.5 pl-4 pr-10\">\n        {/* Icon tile — notification-style tinted badge */}\n        <div\n          className=\"flex shrink-0 items-center justify-center rounded-xl\"\n          style={{\n            width: 36,\n            height: 36,\n            background: `${variant.color}18`,\n            border: `1px solid ${variant.color}22`,\n          }}\n        >\n          <Icon size={18} weight=\"regular\" style={{ color: variant.color }} />\n        </div>\n\n        {/* Text area */}\n        <div className=\"flex min-w-0 flex-1 flex-col\">\n          <span className=\"truncate text-sm font-semibold text-white/90 font-sans\">\n            {toast.title}\n          </span>\n          {toast.description && (\n            <span className=\"mt-0.5 truncate text-xs text-white/50 font-sans\">\n              {toast.description}\n            </span>\n          )}\n        </div>\n      </div>\n\n      {/* Close button — matches glass-search-bar X button */}\n      {/* Outer div provides 44px touch target; inner styled circle is 20×20 visual */}\n      <div\n        className=\"absolute right-0 top-1/2 z-20 flex -translate-y-1/2 cursor-pointer items-center justify-center\"\n        style={{ width: 44, height: 44 }}\n        onClick={() => onDismiss(toast.id)}\n      >\n        <motion.div\n          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.14)' }}\n          whileTap={{ scale: 0.88 }}\n          className=\"flex items-center justify-center rounded-full\"\n          style={{\n            width: 20,\n            height: 20,\n            background: 'rgba(255, 255, 255, 0.08)',\n            border: '1px solid rgba(255, 255, 255, 0.12)',\n          }}\n          role=\"button\"\n          aria-label=\"Dismiss toast\"\n        >\n          <X size={10} weight=\"regular\" className=\"text-white/60\" />\n        </motion.div>\n      </div>\n\n      {/* Progress bar */}\n      <div className=\"absolute bottom-0 left-0 right-0 h-[2px]\">\n        <div\n          ref={progressRef}\n          className=\"h-full w-full origin-left\"\n          style={{ background: `${variant.color}99` }}\n        />\n      </div>\n    </motion.div>\n  )\n}\n\n// ─── Trigger button ──────────────────────────────────────────────────────────\n\nfunction TriggerButton({\n  variant,\n  onTrigger,\n}: {\n  variant: ToastVariant\n  onTrigger: () => void\n}) {\n  const config = VARIANTS[variant]\n  const Icon = config.icon\n\n  return (\n    <motion.button\n      onClick={onTrigger}\n      whileHover={{ scale: 1.08 }}\n      whileTap={{ scale: 0.90 }}\n      transition={BUTTON_SPRING}\n      className=\"relative isolate flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-2xl px-3 py-2 font-sans\"\n      style={{\n        ...GLASS_PANEL,\n        outline: 'none',\n        minHeight: 44,\n      }}\n    >\n      {/* Blur layer — non-animating */}\n      <div\n        className=\"pointer-events-none absolute inset-0 z-[-1] rounded-2xl\"\n        style={GLASS_BLUR}\n      />\n\n      {/* Icon badge — notification-style tinted */}\n      <div\n        className=\"flex shrink-0 items-center justify-center rounded-xl\"\n        style={{\n          width: 32,\n          height: 32,\n          background: `${config.color}18`,\n          border: `1px solid ${config.color}22`,\n        }}\n      >\n        <Icon size={16} weight=\"regular\" style={{ color: config.color }} />\n      </div>\n\n      <span className=\"text-sm font-semibold text-white/70\">{config.label}</span>\n    </motion.button>\n  )\n}\n\n// ─── Main component ──────────────────────────────────────────────────────────\n\nexport function GlassToast() {\n  const [toasts, setToasts] = useState<Toast[]>([])\n  const prefersReduced = useReducedMotion()\n  const idCounter = useRef(0)\n\n  const dismissToast = useCallback((id: string) => {\n    setToasts((prev) => prev.filter((t) => t.id !== id))\n  }, [])\n\n  const addToast = useCallback((variant: ToastVariant) => {\n    const demo = DEMO_TOASTS[variant]\n    const id = `toast-${++idCounter.current}`\n    setToasts((prev) => {\n      const next = [...prev, { id, variant, ...demo }]\n      // Enforce max visible — remove oldest first\n      if (next.length > MAX_TOASTS) {\n        return next.slice(next.length - MAX_TOASTS)\n      }\n      return next\n    })\n  }, [])\n\n  return (\n    <div className=\"flex h-full w-full items-center justify-center bg-sand-950\">\n      {/* Background image */}\n      <img\n        src={BACKGROUND_IMAGE}\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n\n      {/* Trigger buttons — centered, wrap on mobile */}\n      <div className=\"relative z-10 flex flex-wrap items-center justify-center gap-3 px-4\">\n        {(Object.keys(VARIANTS) as ToastVariant[]).map((variant) => (\n          <TriggerButton\n            key={variant}\n            variant={variant}\n            onTrigger={() => addToast(variant)}\n          />\n        ))}\n      </div>\n\n      {/* Toast container — full width on mobile, 380px on desktop */}\n      <div className=\"fixed bottom-4 left-4 right-4 z-50 flex flex-col-reverse gap-3 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[380px]\">\n        <AnimatePresence mode=\"popLayout\" initial={false}>\n          {toasts.map((toast) => (\n            <ToastCard\n              key={toast.id}\n              toast={toast}\n              onDismiss={dismissToast}\n              prefersReduced={prefersReduced}\n            />\n          ))}\n        </AnimatePresence>\n      </div>\n    </div>\n  )\n}\n"
const GLASS_SEARCH_BAR_CODE = "'use client'\n\nimport { useState, useRef, useEffect, useCallback } from 'react'\nimport { motion, AnimatePresence, useReducedMotion } from 'framer-motion'\nimport {\n  MagnifyingGlass,\n  X,\n  MusicNote,\n  File,\n  Lightning,\n} from '@phosphor-icons/react'\n\n// ─── Types ───────────────────────────────────────────────────────────────────\n\ninterface Suggestion {\n  icon: typeof MusicNote\n  label: string\n  color: string\n}\n\n// ─── Constants ───────────────────────────────────────────────────────────────\n\nconst BACKGROUND =\n  'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png'\n\nconst SUGGESTIONS: Suggestion[] = [\n  { icon: MusicNote, label: 'Audio visualizers',   color: '#FF5C8A' },\n  { icon: File,      label: 'Documentation files', color: '#3A86FF' },\n  { icon: Lightning, label: 'Quick actions',       color: '#06D6A0' },\n]\n\nconst BAR_HEIGHT = 48\nconst MIN_TOUCH_TARGET = 44\n\n// ─── Glass family shared styles ─────────────────────────────────────────────\n\nconst glassBlur = {\n  backdropFilter: 'blur(24px) saturate(1.8)',\n  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',\n} as const\n\nconst glassPanel = {\n  background: 'rgba(255, 255, 255, 0.08)',\n  border: '1px solid rgba(255, 255, 255, 0.1)',\n  boxShadow:\n    '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',\n} as const\n\n// Active glow — warm orange border + ambient glow\nconst ACTIVE_GLOW =\n  '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 0 1.5px rgba(255, 160, 50, 0.5), 0 0 20px rgba(255, 160, 50, 0.12)'\n\n// ─── Suggestion Row ─────────────────���────────────────────────────────────────\n\nfunction SuggestionRow({\n  suggestion,\n  index,\n  reducedMotion,\n  onSelect,\n  onClear,\n}: {\n  suggestion: Suggestion\n  index: number\n  reducedMotion: boolean\n  onSelect: (label: string) => void\n  onClear: (label: string) => void\n}) {\n  const [hovered, setHovered] = useState(false)\n  const Icon = suggestion.icon\n\n  return (\n    <motion.div\n      initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}\n      animate={{ opacity: 1 }}\n      exit={{ opacity: 0 }}\n      transition={\n        reducedMotion\n          ? { duration: 0.15 }\n          : { duration: 0.15, delay: 0.06 + index * 0.04 }\n      }\n      onMouseEnter={() => setHovered(true)}\n      onMouseLeave={() => setHovered(false)}\n      className=\"flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-sans\"\n      style={{\n        minHeight: MIN_TOUCH_TARGET,\n        background: 'transparent',\n      }}\n    >\n      {/* Animated row: icon + label — scales and nudges right on hover */}\n      <motion.button\n        onClick={() => onSelect(suggestion.label)}\n        animate={\n          reducedMotion\n            ? {}\n            : {\n                x: hovered ? 3 : 0,\n                scale: hovered ? 1.08 : 1,\n              }\n        }\n        whileTap={{ scale: 0.90 }}\n        transition={{ type: 'spring', stiffness: 320, damping: 20 }}\n        className=\"flex min-w-0 flex-1 cursor-pointer items-center gap-3\"\n        style={{ background: 'transparent', transformOrigin: 'left center' }}\n      >\n        {/* Icon badge — notification-style tinted */}\n        <div\n          className=\"flex shrink-0 items-center justify-center rounded-xl\"\n          style={{\n            width: 32,\n            height: 32,\n            background: `${suggestion.color}18`,\n            border: `1px solid ${suggestion.color}22`,\n          }}\n        >\n          <Icon size={16} weight=\"regular\" style={{ color: suggestion.color }} />\n        </div>\n\n        <span\n          className=\"text-sm font-semibold font-sans\"\n          style={{\n            color: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.75)',\n            transition: 'color 0.15s',\n          }}\n        >\n          {suggestion.label}\n        </span>\n      </motion.button>\n\n      {/* Clear button — stays completely still */}\n      <button\n        onClick={(e) => { e.stopPropagation(); onClear(suggestion.label) }}\n        className=\"shrink-0 cursor-pointer rounded-full px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white/40 font-sans\"\n        style={{ background: 'rgba(255, 255, 255, 0.06)' }}\n        aria-label={`Clear ${suggestion.label}`}\n      >\n        Clear\n      </button>\n    </motion.div>\n  )\n}\n\n// ─── Main Component ──────────────────────────────────────────────────────────\n\nexport default function GlassSearchBar() {\n  const [isActive, setIsActive] = useState(false)\n  const [query, setQuery] = useState('')\n  const [hiddenSuggestions, setHiddenSuggestions] = useState<Set<string>>(new Set())\n\n  const containerRef = useRef<HTMLDivElement>(null)\n  const inputRef = useRef<HTMLInputElement>(null)\n\n  const prefersReduced = useReducedMotion()\n  const reducedMotion = prefersReduced ?? false\n\n  // Filtered suggestions based on query + hidden\n  const filteredSuggestions = SUGGESTIONS\n    .filter((s) => !hiddenSuggestions.has(s.label))\n    .filter((s) =>\n      query.trim() ? s.label.toLowerCase().includes(query.toLowerCase()) : true\n    )\n\n  // ─── Activate ────────────────────────────────────────────────────────\n\n  const activate = useCallback(() => {\n    setIsActive(true)\n    requestAnimationFrame(() => {\n      inputRef.current?.focus()\n    })\n  }, [])\n\n  // ─── Deactivate ──────────────────────────────────────────────────────\n\n  const deactivate = useCallback(() => {\n    setIsActive(false)\n    setQuery('')\n    inputRef.current?.blur()\n  }, [])\n\n  // ─── Click outside to deactivate ─────────────────────────────────────\n\n  useEffect(() => {\n    if (!isActive) return\n\n    function handleClickOutside(e: MouseEvent | TouchEvent) {\n      if (\n        containerRef.current &&\n        !containerRef.current.contains(e.target as Node)\n      ) {\n        deactivate()\n      }\n    }\n\n    document.addEventListener('mousedown', handleClickOutside)\n    document.addEventListener('touchstart', handleClickOutside)\n    return () => {\n      document.removeEventListener('mousedown', handleClickOutside)\n      document.removeEventListener('touchstart', handleClickOutside)\n    }\n  }, [isActive, deactivate])\n\n  // ─── Escape key to deactivate ────────────────────────────────────────\n\n  useEffect(() => {\n    if (!isActive) return\n\n    function handleKeyDown(e: KeyboardEvent) {\n      if (e.key === 'Escape') deactivate()\n    }\n\n    document.addEventListener('keydown', handleKeyDown)\n    return () => document.removeEventListener('keydown', handleKeyDown)\n  }, [isActive, deactivate])\n\n  // ─── Handlers ────────────────────────────────────────────────────────\n\n  function handleClear() {\n    setQuery('')\n    inputRef.current?.focus()\n  }\n\n  function handleSuggestionSelect(label: string) {\n    setQuery(label)\n    inputRef.current?.focus()\n  }\n\n  function handleSuggestionClear(label: string) {\n    setHiddenSuggestions((prev) => new Set(prev).add(label))\n  }\n\n  const springOrFade = reducedMotion\n    ? { duration: 0.15 }\n    : ({ type: 'spring', stiffness: 400, damping: 30 } as const)\n\n  return (\n    <div className=\"relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\">\n      {/* Background image — consistent with glass family */}\n      <img\n        src={BACKGROUND}\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n\n      {/* Outer container */}\n      <div\n        ref={containerRef}\n        className=\"relative w-[calc(100%-2rem)] max-w-[380px]\"\n        style={{ marginTop: -90 }}\n      >\n        {/* ─── Search bar ─────────────────────────────────────────── */}\n        <motion.div\n          animate={{\n            boxShadow: isActive ? ACTIVE_GLOW : glassPanel.boxShadow,\n          }}\n          transition={springOrFade}\n          onClick={!isActive ? activate : undefined}\n          className=\"relative isolate flex w-full cursor-text items-center rounded-3xl\"\n          style={{\n            height: BAR_HEIGHT,\n            ...glassPanel,\n            borderRadius: 24,\n          }}\n        >\n          {/* Blur layer */}\n          <div\n            className=\"pointer-events-none absolute inset-0 z-[-1]\"\n            style={{ ...glassBlur, borderRadius: 24 }}\n          />\n\n          {/* Search icon */}\n          <div\n            className=\"flex shrink-0 items-center justify-center\"\n            style={{\n              width: BAR_HEIGHT,\n              height: BAR_HEIGHT,\n              minWidth: MIN_TOUCH_TARGET,\n              minHeight: MIN_TOUCH_TARGET,\n            }}\n          >\n            <MagnifyingGlass\n              size={20}\n              weight=\"regular\"\n              className=\"text-white/50\"\n            />\n          </div>\n\n          {/* Input — always visible */}\n          <input\n            ref={inputRef}\n            value={query}\n            onChange={(e) => setQuery(e.target.value)}\n            onFocus={activate}\n            placeholder=\"Search components...\"\n            className=\"min-w-0 flex-1 bg-transparent font-sans text-sm font-medium text-white/90 placeholder-white/30 outline-none\"\n            style={{ caretColor: '#7D8D41' }}\n            aria-label=\"Search components\"\n          />\n\n          {/* Clear button — springs in when text is present */}\n          <AnimatePresence>\n            {query.length > 0 && (\n              <motion.button\n                key=\"clear\"\n                initial={\n                  reducedMotion\n                    ? { opacity: 0 }\n                    : { opacity: 0, scale: 0.5 }\n                }\n                animate={\n                  reducedMotion\n                    ? { opacity: 1 }\n                    : { opacity: 1, scale: 1 }\n                }\n                exit={\n                  reducedMotion\n                    ? { opacity: 0 }\n                    : { opacity: 0, scale: 0.5 }\n                }\n                transition={springOrFade}\n                onClick={handleClear}\n                className=\"flex shrink-0 cursor-pointer items-center justify-center rounded-full\"\n                style={{\n                  width: 20,\n                  height: 20,\n                  marginRight: 14,\n                  background: 'rgba(255, 255, 255, 0.08)',\n                  border: '1px solid rgba(255, 255, 255, 0.12)',\n                }}\n                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.14)' }}\n                whileTap={{ scale: 0.88 }}\n                aria-label=\"Clear search\"\n              >\n                <X size={10} weight=\"regular\" className=\"text-white/60\" />\n              </motion.button>\n            )}\n          </AnimatePresence>\n        </motion.div>\n\n        {/* ─── Dropdown ───────────────────────────────────────────── */}\n        <AnimatePresence>\n          {isActive && filteredSuggestions.length > 0 && (\n            <motion.div\n              key=\"dropdown\"\n              initial={\n                reducedMotion\n                  ? { opacity: 0 }\n                  : { opacity: 0, scale: 0.95, y: -8, filter: 'blur(4px)' }\n              }\n              animate={\n                reducedMotion\n                  ? { opacity: 1 }\n                  : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }\n              }\n              exit={\n                reducedMotion\n                  ? { opacity: 0 }\n                  : { opacity: 0, scale: 0.95, y: -8, filter: 'blur(4px)' }\n              }\n              transition={\n                reducedMotion\n                  ? { duration: 0.15 }\n                  : { type: 'spring', stiffness: 350, damping: 28 }\n              }\n              className=\"absolute left-0 right-0 isolate rounded-2xl p-2\"\n              style={{ ...glassPanel, transformOrigin: 'top center', top: BAR_HEIGHT + 8 }}\n            >\n              {/* Blur layer */}\n              <div\n                className=\"pointer-events-none absolute inset-0 z-[-1] rounded-2xl\"\n                style={glassBlur}\n              />\n\n              {/* Top edge highlight */}\n              <div\n                className=\"absolute left-6 right-6 top-0 h-[1px]\"\n                style={{\n                  background:\n                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',\n                }}\n              />\n\n              {/* Section label */}\n              <p className=\"mb-0.5 px-3 pt-1 text-[10px] font-semibold uppercase tracking-widest text-white/25 font-sans\">\n                {query.trim() ? 'Results' : 'Suggestions'}\n              </p>\n\n              {/* Suggestion rows */}\n              {filteredSuggestions.map((suggestion, i) => (\n                <SuggestionRow\n                  key={suggestion.label}\n                  suggestion={suggestion}\n                  index={i}\n                  reducedMotion={reducedMotion}\n                  onSelect={handleSuggestionSelect}\n                  onClear={handleSuggestionClear}\n                />\n              ))}\n            </motion.div>\n          )}\n        </AnimatePresence>\n      </div>\n    </div>\n  )\n}\n"
const GLASS_USER_MENU_CODE = "'use client'\n\nimport { useState, useRef, useEffect } from 'react'\nimport { motion, AnimatePresence } from 'framer-motion'\nimport {\n  User,\n  Gear,\n  SignOut,\n  Users,\n  CreditCard,\n  CaretDown,\n} from '@phosphor-icons/react'\n\n// ─── Config ───────────────────────────────────────────────────────────────────\n\nconst BACKGROUND = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133'\n\nconst USER = {\n  name: 'Jennifer Rivera',\n  email: 'jennifer@studio.io',\n  initials: 'JR',\n}\n\nconst MENU_GROUPS = [\n  {\n    label: 'Account',\n    items: [\n      { icon: User, label: 'Profile',  color: '#3A86FF' },\n      { icon: Gear, label: 'Settings', color: '#B388FF' },\n    ],\n  },\n  {\n    label: 'Workspace',\n    items: [\n      { icon: Users,      label: 'Team',    color: '#06D6A0' },\n      { icon: CreditCard, label: 'Billing', color: '#FFBE0B' },\n    ],\n  },\n]\n\n// ─── Shared glass style ───────────────────────────────────────────────────────\n\nconst glassPanel = {\n  background: 'rgba(255, 255, 255, 0.08)',\n  border: '1px solid rgba(255, 255, 255, 0.1)',\n  boxShadow: '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)',\n}\n\nconst glassPanelBlur = {\n  backdropFilter: 'blur(24px) saturate(1.8)',\n  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',\n}\n\n// Active glow — warm orange border + ambient glow (matches glass-search-bar)\nconst ACTIVE_GLOW =\n  '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1.5px rgba(255, 160, 50, 0.5), 0 0 20px rgba(255, 160, 50, 0.12)'\n\n// ─── MenuItem ─────────────────────────────────────────────────────────────────\n\nfunction MenuItem({\n  icon: Icon,\n  label,\n  color,\n  index,\n}: {\n  icon: typeof User\n  label: string\n  color: string\n  index: number\n}) {\n  const [hovered, setHovered] = useState(false)\n\n  return (\n    <motion.div\n      initial={{ opacity: 0 }}\n      animate={{ opacity: 1 }}\n      transition={{ duration: 0.15, delay: 0.06 + index * 0.04 }}\n      onMouseEnter={() => setHovered(true)}\n      onMouseLeave={() => setHovered(false)}\n      className=\"flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5\"\n      style={{ minHeight: 44, background: 'transparent' }}\n    >\n      {/* Animated group: icon badge + label — scales and nudges right on hover */}\n      <motion.button\n        onClick={() => {}}\n        animate={{\n          x: hovered ? 3 : 0,\n          scale: hovered ? 1.08 : 1,\n        }}\n        whileTap={{ scale: 0.90 }}\n        transition={{ type: 'spring', stiffness: 320, damping: 20 }}\n        className=\"flex min-w-0 flex-1 cursor-pointer items-center gap-2.5\"\n        style={{ background: 'transparent', transformOrigin: 'left center' }}\n      >\n        {/* Icon badge — notification-style tinted */}\n        <div\n          className=\"flex shrink-0 items-center justify-center rounded-xl\"\n          style={{\n            width: 32,\n            height: 32,\n            background: `${color}18`,\n            border: `1px solid ${color}22`,\n          }}\n        >\n          <Icon size={16} weight=\"regular\" style={{ color }} />\n        </div>\n        <span\n          className=\"text-sm font-medium\"\n          style={{\n            color: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.70)',\n            transition: 'color 0.15s',\n          }}\n        >\n          {label}\n        </span>\n      </motion.button>\n    </motion.div>\n  )\n}\n\n// ─── GlassUserMenu ────────────────────────────────────────────────────────────\n\nexport function GlassUserMenu() {\n  const [open, setOpen] = useState(false)\n  const ref = useRef<HTMLDivElement>(null)\n\n  // Close on outside click or touch\n  useEffect(() => {\n    if (!open) return\n    const handler = (e: MouseEvent | TouchEvent) => {\n      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)\n    }\n    document.addEventListener('mousedown', handler)\n    document.addEventListener('touchstart', handler)\n    return () => {\n      document.removeEventListener('mousedown', handler)\n      document.removeEventListener('touchstart', handler)\n    }\n  }, [open])\n\n  let itemIndex = 0\n\n  return (\n    <div className=\"relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\">\n      <img\n        src={BACKGROUND}\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n\n      <div ref={ref} className=\"relative flex flex-col items-center px-4\" style={{ marginTop: -150 }}>\n\n        {/* Trigger — orange glow when open */}\n        <motion.button\n          onClick={() => setOpen(v => !v)}\n          whileHover={{ scale: 1.02 }}\n          whileTap={{ scale: 0.97 }}\n          animate={{ boxShadow: open ? ACTIVE_GLOW : glassPanel.boxShadow }}\n          transition={{ type: 'spring', stiffness: 300, damping: 26 }}\n          className=\"relative isolate flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2.5\"\n          style={{\n            background: glassPanel.background,\n            border: glassPanel.border,\n          }}\n        >\n          <div className=\"pointer-events-none absolute inset-0 z-[-1] rounded-2xl\" style={glassPanelBlur} />\n          <div\n            className=\"flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white\"\n            style={{ background: 'linear-gradient(135deg, #FF7B54, #FF6BF5)' }}\n          >\n            {USER.initials}\n          </div>\n          <span className=\"text-sm font-semibold text-white/80\">{USER.name}</span>\n          <motion.div\n            animate={{ rotate: open ? 180 : 0 }}\n            transition={{ type: 'spring', stiffness: 400, damping: 28 }}\n          >\n            <CaretDown size={18} weight=\"regular\" className=\"text-white/40\" />\n          </motion.div>\n        </motion.button>\n\n        {/* Dropdown */}\n        <AnimatePresence>\n          {open && (\n            <motion.div\n              initial={{ opacity: 0, scale: 0.95, y: -8, filter: 'blur(4px)' }}\n              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}\n              exit={{ opacity: 0, scale: 0.95, y: -8, filter: 'blur(4px)' }}\n              transition={{ type: 'spring', stiffness: 350, damping: 28 }}\n              className=\"absolute isolate top-full mt-2 w-[min(256px,calc(100vw-32px))] rounded-2xl p-2\"\n              style={{ ...glassPanel, transformOrigin: 'top center' }}\n            >\n              <div className=\"pointer-events-none absolute inset-0 z-[-1] rounded-2xl\" style={glassPanelBlur} />\n              {/* Top edge highlight */}\n              <div\n                className=\"absolute left-6 right-6 top-0 h-[1px]\"\n                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }}\n              />\n\n              {/* Menu groups */}\n              {MENU_GROUPS.map((group) => (\n                <div key={group.label} className=\"mb-1\">\n                  <p className=\"mb-0.5 px-3 pt-1 text-[10px] font-semibold uppercase tracking-widest text-white/25\">\n                    {group.label}\n                  </p>\n                  {group.items.map((item) => (\n                    <MenuItem key={item.label} icon={item.icon} label={item.label} color={item.color} index={itemIndex++} />\n                  ))}\n                </div>\n              ))}\n\n              {/* Divider */}\n              <div className=\"mx-2 my-1.5 h-[1px]\" style={{ background: 'rgba(255,255,255,0.07)' }} />\n\n              {/* Log out — same hover pattern */}\n              <LogOutItem index={itemIndex} />\n            </motion.div>\n          )}\n        </AnimatePresence>\n      </div>\n    </div>\n  )\n}\n\n// ─── Log Out Item ─────────────────────────────────────────────────────────────\n\nfunction LogOutItem({ index }: { index: number }) {\n  const [hovered, setHovered] = useState(false)\n\n  return (\n    <motion.div\n      initial={{ opacity: 0 }}\n      animate={{ opacity: 1 }}\n      transition={{ duration: 0.15, delay: 0.06 + index * 0.04 }}\n      onMouseEnter={() => setHovered(true)}\n      onMouseLeave={() => setHovered(false)}\n      className=\"flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5\"\n      style={{ minHeight: 44, background: 'transparent' }}\n    >\n      <motion.button\n        onClick={() => {}}\n        animate={{\n          x: hovered ? 3 : 0,\n          scale: hovered ? 1.08 : 1,\n        }}\n        whileTap={{ scale: 0.90 }}\n        transition={{ type: 'spring', stiffness: 320, damping: 20 }}\n        className=\"flex min-w-0 flex-1 cursor-pointer items-center gap-2.5\"\n        style={{ background: 'transparent', transformOrigin: 'left center' }}\n      >\n        <div\n          className=\"flex shrink-0 items-center justify-center rounded-xl\"\n          style={{\n            width: 32,\n            height: 32,\n            background: '#FF5A5A18',\n            border: '1px solid #FF5A5A22',\n          }}\n        >\n          <SignOut size={16} weight=\"regular\" style={{ color: '#FF5A5A' }} />\n        </div>\n        <span\n          className=\"text-sm font-medium\"\n          style={{\n            color: hovered ? 'rgba(255,90,90,0.95)' : 'rgba(255,90,90,0.70)',\n            transition: 'color 0.15s',\n          }}\n        >\n          Log Out\n        </span>\n      </motion.button>\n    </motion.div>\n  )\n}\n"
const GLASS_SIDEBAR_CODE = "'use client'\n\nimport { useState, useEffect } from 'react'\nimport { motion, useSpring, AnimatePresence } from 'framer-motion'\nimport {\n  House,\n  MagnifyingGlass,\n  Folders,\n  Bell,\n  ChartLine,\n  Gear,\n  User,\n  ArrowRight,\n  ArrowLeft,\n} from '@phosphor-icons/react'\n\n// ─── Constants ────────────────────────────────────────────────────────────────\n\nconst COLLAPSED_WIDTH = 64\nconst EXPANDED_WIDTH = 220\n\n// Design size for icon tiles — intentionally fixed, not responsive\nconst ICON_TILE_SIZE = 44\nconst TOGGLE_BUTTON_HEIGHT = 36\n\nconst NAV_ITEMS = [\n  { icon: House,           label: 'Home',          color: '#3A86FF' },\n  { icon: MagnifyingGlass, label: 'Search',        color: '#B388FF' },\n  { icon: Folders,         label: 'Projects',      color: '#FFBE0B' },\n  { icon: Bell,            label: 'Notifications', color: '#FF5C8A' },\n  { icon: ChartLine,       label: 'Analytics',     color: '#06D6A0' },\n  { icon: Gear,            label: 'Settings',      color: '#C9A96E' },\n  { icon: User,            label: 'Profile',       color: '#FF7B54' },\n] as const\n\ntype NavItem = (typeof NAV_ITEMS)[number]\n\n// Blur is on a separate non-animating layer so it isn't recalculated every spring frame\nconst GLASS_BLUR_STYLE = {\n  backdropFilter: 'blur(24px) saturate(1.8)',\n  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',\n} as const\n\nconst GLASS_STYLE = {\n  background: 'rgba(255, 255, 255, 0.06)',\n  border: '1px solid rgba(255, 255, 255, 0.1)',\n  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',\n} as const\n\n// ─── Sub-components ───────────────────────────────────────────────────────────\n\nfunction NavItemRow({\n  item,\n  index,\n  isActive,\n  isOpen,\n  onActivate,\n}: {\n  item: NavItem\n  index: number\n  isActive: boolean\n  isOpen: boolean\n  onActivate: () => void\n}) {\n  const [hovered, setHovered] = useState(false)\n  const Icon = item.icon\n\n  // Reset stuck hover state when sidebar opens/closes — avoids tooltip lingering\n  useEffect(() => { setHovered(false) }, [isOpen])\n\n  return (\n    <div className=\"relative flex w-full items-center\">\n      {/* Tooltip — only shown in collapsed state to surface the hidden label */}\n      <AnimatePresence>\n        {!isOpen && hovered && (\n          <motion.div\n            key=\"tooltip\"\n            initial={{ opacity: 0, x: -6 }}\n            animate={{ opacity: 1, x: 0 }}\n            exit={{ opacity: 0, x: -6 }}\n            transition={{ duration: 0.15 }}\n            className=\"pointer-events-none absolute left-[calc(100%+10px)] z-50 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-white/90 font-sans\"\n            style={{ ...GLASS_STYLE, ...GLASS_BLUR_STYLE }}\n          >\n            {item.label}\n          </motion.div>\n        )}\n      </AnimatePresence>\n\n      {/* Icon tile + label row */}\n      <motion.button\n        onClick={onActivate}\n        onMouseEnter={() => setHovered(true)}\n        onMouseLeave={() => setHovered(false)}\n        animate={{\n          // Collapsed: nudge right + scale up more to signal interactivity without a label\n          scale: hovered ? (isOpen ? 1.08 : 1.15) : 1,\n          x: hovered ? (isOpen ? 0 : 3) : 0,\n        }}\n        whileTap={{ scale: 0.90 }}\n        // stiffness 320 / damping 20 — snappy enough to feel physical without overshooting\n        transition={{ type: 'spring', stiffness: 320, damping: 20 }}\n        className=\"flex w-full items-center gap-3 rounded-xl cursor-pointer justify-start\"\n        style={{ background: 'transparent', border: 'none', outline: 'none' }}\n        aria-label={item.label}\n      >\n        {/* Icon tile — notification-style tinted badge */}\n        <motion.div\n          className=\"flex shrink-0 items-center justify-center rounded-xl\"\n          style={{\n            width: ICON_TILE_SIZE,\n            height: ICON_TILE_SIZE,\n            background: isActive ? `${item.color}28` : `${item.color}18`,\n            border: `1px solid ${isActive ? `${item.color}44` : `${item.color}22`}`,\n            transition: 'background 0.2s, border-color 0.2s',\n          }}\n        >\n          <Icon size={20} weight=\"regular\" style={{ color: item.color }} />\n        </motion.div>\n\n        {/* Label — only rendered when sidebar is open */}\n        <AnimatePresence>\n          {isOpen && (\n            <motion.span\n              key=\"label\"\n              initial={{ opacity: 0, x: -8 }}\n              animate={{ opacity: 1, x: 0, transition: { duration: 0.18, ease: 'easeOut', delay: 0.18 + index * 0.03 } }}\n              exit={{ opacity: 0, x: -6, transition: { duration: 0.08, ease: 'easeIn', delay: 0 } }}\n              className=\"whitespace-nowrap text-sm font-semibold font-sans\"\n              style={{\n                color: isActive ? item.color : 'rgba(255,255,255,0.75)',\n              }}\n            >\n              {item.label}\n            </motion.span>\n          )}\n        </AnimatePresence>\n      </motion.button>\n    </div>\n  )\n}\n\n// ─── Main component ───────────────────────────────────────────────────────────\n\nexport function GlassSidebar() {\n  const [isOpen, setIsOpen] = useState(false)\n  const [activeIndex, setActiveIndex] = useState(0)\n  const [toggleHovered, setToggleHovered] = useState(false)\n\n  // Spring width gives the expand/collapse a physical, momentum-based feel\n  const widthSpring = useSpring(COLLAPSED_WIDTH, { stiffness: 280, damping: 26 })\n\n  function toggle() {\n    const next = !isOpen\n    setIsOpen(next)\n    widthSpring.set(next ? EXPANDED_WIDTH : COLLAPSED_WIDTH)\n  }\n\n  return (\n    <div className=\"relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\">\n      {/* Background image */}\n      <img\n        src=\"https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png\"\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n\n      {/* Fixed-width anchor: keeps the left edge stable so the sidebar expands rightward */}\n      <div style={{ width: EXPANDED_WIDTH }} className=\"flex items-center justify-start\">\n        {/* Sidebar panel */}\n        <motion.div\n          style={{\n            width: widthSpring,\n            ...GLASS_STYLE,\n          }}\n          initial={{ x: -20 }}\n          animate={{ x: 0 }}\n          // delay: 0.1s lets the background settle before the sidebar slides in\n          transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 }}\n          className=\"relative isolate flex h-auto flex-col items-center gap-2 overflow-visible rounded-3xl px-2.5 py-3\"\n        >\n          {/* Blur layer — absolute, never animates, so blur is not recalculated every spring frame */}\n          <div\n            className=\"pointer-events-none absolute inset-0 z-[-1] rounded-3xl\"\n            style={GLASS_BLUR_STYLE}\n          />\n\n          {/* Nav items */}\n          <div className=\"flex w-full flex-col gap-1.5\">\n            {NAV_ITEMS.map((item, i) => (\n              <NavItemRow\n                key={item.label}\n                item={item}\n                index={i}\n                isActive={activeIndex === i}\n                isOpen={isOpen}\n                onActivate={() => setActiveIndex(i)}\n              />\n            ))}\n          </div>\n\n          {/* Divider */}\n          <div\n            className=\"my-1 w-full\"\n            style={{ height: 1, background: 'rgba(255,255,255,0.1)' }}\n          />\n\n          {/* Toggle button */}\n          <div className={`flex w-full items-center ${isOpen ? 'justify-start px-1' : 'justify-center'}`}>\n            <motion.button\n              onClick={toggle}\n              onMouseEnter={() => setToggleHovered(true)}\n              onMouseLeave={() => setToggleHovered(false)}\n              animate={{ scale: toggleHovered ? 1.08 : 1 }}\n              whileTap={{ scale: 0.90 }}\n              transition={{ type: 'spring', stiffness: 300, damping: 20 }}\n              className=\"flex items-center justify-center rounded-2xl cursor-pointer\"\n              style={{\n                width: ICON_TILE_SIZE,\n                height: TOGGLE_BUTTON_HEIGHT,\n                background: 'rgba(255,255,255,0.08)',\n                border: '1px solid rgba(255,255,255,0.12)',\n                outline: 'none',\n              }}\n              aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}\n            >\n              {/* Arrow spins 90° on enter/exit — gives the swap a sense of rotation direction */}\n              <AnimatePresence mode=\"wait\" initial={false}>\n                {isOpen ? (\n                  <motion.span\n                    key=\"left\"\n                    initial={{ opacity: 0, rotate: 90 }}\n                    animate={{ opacity: 1, rotate: 0 }}\n                    exit={{ opacity: 0, rotate: -90 }}\n                    transition={{ duration: 0.18 }}\n                  >\n                    <ArrowLeft size={18} weight=\"regular\" className=\"text-white/70\" />\n                  </motion.span>\n                ) : (\n                  <motion.span\n                    key=\"right\"\n                    initial={{ opacity: 0, rotate: -90 }}\n                    animate={{ opacity: 1, rotate: 0 }}\n                    exit={{ opacity: 0, rotate: 90 }}\n                    transition={{ duration: 0.18 }}\n                  >\n                    <ArrowRight size={18} weight=\"regular\" className=\"text-white/70\" />\n                  </motion.span>\n                )}\n              </AnimatePresence>\n            </motion.button>\n          </div>\n        </motion.div>\n      </div>\n    </div>\n  )\n}\n"

const GLASS_PROGRESS_CODE = "'use client'\n\nimport { useState, useEffect, useCallback } from 'react'\nimport { motion, useSpring, useMotionValueEvent, useReducedMotion } from 'framer-motion'\nimport { ArrowClockwise } from '@phosphor-icons/react'\n\n// ─── Constants ────────────────────────────────────────────────────────────────\n\nconst GLASS_BLUR = {\n  backdropFilter: 'blur(24px) saturate(1.8)',\n  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',\n} as const\n\nconst GLASS_PANEL = {\n  background: 'rgba(255, 255, 255, 0.06)',\n  border: '1px solid rgba(255, 255, 255, 0.1)',\n  boxShadow:\n    '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',\n} as const\n\nconst BACKGROUND_IMAGE =\n  'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133'\n\n// ─── Types ────────────────────────────────────────────────────────────────────\n\ninterface GlassProgressBarProps {\n  value: number\n  color: string\n  gradient: string\n  label?: string\n  animated?: boolean\n}\n\ninterface BarConfig {\n  label: string\n  value: number\n  color: string\n  gradient: string\n  delay: number\n}\n\n// ─── Bar data ─────────────────────────────────────────────────────────────────\n\nconst BARS: BarConfig[] = [\n  { label: 'Storage', value: 72, color: '#3A86FF', gradient: '#3A86FF, #2962FF', delay: 200 },\n  { label: 'Upload',  value: 45, color: '#FF5C8A', gradient: '#FF5C8A, #FF1744', delay: 400 },\n  { label: 'Battery', value: 88, color: '#06D6A0', gradient: '#06D6A0, #00BFA5', delay: 600 },\n  { label: 'Memory',  value: 30, color: '#FFBE0B', gradient: '#FFBE0B, #FF9800', delay: 800 },\n]\n\n// ─── Internal progress bar ──────────────────────────────────────────────────\n\nfunction GlassProgressBar({\n  value,\n  color,\n  gradient,\n  label,\n  animated = false,\n}: GlassProgressBarProps) {\n  const prefersReduced = useReducedMotion()\n\n  // Animated percentage counter via useSpring\n  const springValue = useSpring(0, { stiffness: 80, damping: 20 })\n  const [displayPercent, setDisplayPercent] = useState(0)\n\n  useEffect(() => {\n    springValue.set(value)\n  }, [value, springValue])\n\n  useMotionValueEvent(springValue, 'change', (latest) => {\n    setDisplayPercent(Math.round(latest))\n  })\n\n  // Glow intensity scales with progress\n  const glowAlpha = Math.round(40 + value * 0.4)\n    .toString(16)\n    .padStart(2, '0')\n  const glowSize = 4 + value * 0.08\n\n  // Transitions\n  const fillTransition = prefersReduced\n    ? { duration: 0.3 }\n    : { type: 'spring' as const, stiffness: 200, damping: 24 }\n\n  // Pulse animation for the fill (only when animated + no reduced motion)\n  const pulseAnimate =\n    animated && !prefersReduced\n      ? {\n          width: `${value}%`,\n          opacity: [0.85, 1, 0.85],\n        }\n      : { width: `${value}%` }\n\n  const pulseTransition =\n    animated && !prefersReduced\n      ? {\n          width: fillTransition,\n          opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },\n        }\n      : fillTransition\n\n  return (\n    <div className=\"w-full\">\n      {/* Label row */}\n      <div className=\"mb-2 flex items-center justify-between px-1\">\n        {label && (\n          <span className=\"text-[10px] font-semibold uppercase tracking-widest text-white/40 font-sans\">\n            {label}\n          </span>\n        )}\n        <span\n          className=\"text-[10px] font-semibold tabular-nums font-sans\"\n          style={{ color: `${color}88` }}\n        >\n          {displayPercent}%\n        </span>\n      </div>\n\n      {/* Track */}\n      <div\n        className=\"relative h-2 w-full overflow-hidden rounded-full\"\n        style={{ ...GLASS_PANEL }}\n      >\n        {/* Blur layer — non-animating */}\n        <div\n          className=\"pointer-events-none absolute inset-0 rounded-full\"\n          style={GLASS_BLUR}\n        />\n\n        {/* Fill bar */}\n        <motion.div\n          className=\"absolute bottom-0 left-0 top-0 rounded-full\"\n          style={{\n            background: `linear-gradient(90deg, ${gradient})`,\n            filter: `drop-shadow(0 0 ${glowSize}px ${color}${glowAlpha})`,\n          }}\n          initial={{ width: '0%' }}\n          animate={pulseAnimate}\n          transition={pulseTransition}\n        />\n      </div>\n    </div>\n  )\n}\n\n// ─── Exported showcase ──────────────────────────────────────────────────────\n\nexport function GlassProgress() {\n  const [values, setValues] = useState<number[]>([0, 0, 0, 0])\n  const [resetKey, setResetKey] = useState(0)\n\n  const replay = useCallback(() => {\n    setValues([0, 0, 0, 0])\n    setResetKey((k) => k + 1)\n  }, [])\n\n  useEffect(() => {\n    const timeouts: ReturnType<typeof setTimeout>[] = []\n\n    BARS.forEach((bar, i) => {\n      const id = setTimeout(() => {\n        setValues((prev) => {\n          const next = [...prev]\n          next[i] = bar.value\n          return next\n        })\n      }, bar.delay)\n      timeouts.push(id)\n    })\n\n    return () => {\n      timeouts.forEach(clearTimeout)\n    }\n  }, [resetKey])\n\n  return (\n    <div className=\"relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\">\n      {/* Background image */}\n      <img\n        src={BACKGROUND_IMAGE}\n        alt=\"\"\n        className=\"pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60\"\n      />\n\n      <div className=\"relative flex w-full max-w-[340px] flex-col items-center gap-4 px-4\">\n        {/* Glass panel */}\n        <motion.div\n          initial={{ scale: 0.92, y: 16 }}\n          animate={{ scale: 1, y: 0 }}\n          transition={{ type: 'spring', stiffness: 300, damping: 26 }}\n          className=\"relative isolate w-full overflow-hidden rounded-3xl\"\n          style={{ ...GLASS_PANEL }}\n        >\n          {/* Blur layer — non-animating */}\n          <div\n            className=\"pointer-events-none absolute inset-0 z-[-1] rounded-3xl\"\n            style={GLASS_BLUR}\n          />\n\n          {/* Top edge highlight */}\n          <div\n            className=\"absolute left-8 right-8 top-0 h-[1px]\"\n            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}\n          />\n\n          {/* Progress bars stack */}\n          <div className=\"flex flex-col gap-5 px-6 py-6\">\n            {BARS.map((bar, i) => (\n              <GlassProgressBar\n                key={bar.label}\n                label={bar.label}\n                value={values[i]}\n                color={bar.color}\n                gradient={bar.gradient}\n                animated\n              />\n            ))}\n          </div>\n        </motion.div>\n\n        {/* Refresh button */}\n        <motion.button\n          onClick={replay}\n          whileHover={{ scale: 1.12, background: 'rgba(255,255,255,0.12)' }}\n          whileTap={{ scale: 0.9, rotate: -90 }}\n          transition={{ type: 'spring', stiffness: 400, damping: 20 }}\n          className=\"flex h-10 w-10 cursor-pointer items-center justify-center rounded-full\"\n          style={{\n            background: 'rgba(255, 255, 255, 0.06)',\n            border: '1px solid rgba(255, 255, 255, 0.1)',\n          }}\n          aria-label=\"Replay animation\"\n        >\n          <ArrowClockwise size={18} weight=\"regular\" className=\"text-white/50\" />\n        </motion.button>\n      </div>\n    </div>\n  )\n}\n"

export const COMPONENTS: ComponentEntry[] = [
  {
    slug: 'wave-lines',
    image: 'https://ik.imagekit.io/aitoolkit/wave-lines.png',
    name: 'Wave Lines',
    description: 'Dense vertical lines that ripple across the canvas — two layered sine waves create organic bunching and breathing. Hover to send the lines into extreme waves across the whole canvas.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: WaveLines,
    code: WAVE_LINES_CODE,
    prompts: waveLinesPrompts,
  },
  {
    slug: 'distortion-grid',
    image: 'https://ik.imagekit.io/aitoolkit/distortion-grid.png',
    name: 'Distortion Grid',
    description: 'A canvas grid of thin lines that slowly undulate with large sweeping waves. Hovering repels the grid fabric outward from the cursor, amplifying the distortion across the entire canvas.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: DistortionGrid,
    code: DISTORTION_GRID_CODE,
    prompts: distortionGridPrompts,
  },
  {
    slug: 'grid-lines',
    image: 'https://ik.imagekit.io/aitoolkit/grid-lines.png?v=3',
    name: 'Grid Lines',
    description: 'A dot grid connected by thin lines. On hover, a radial wave pulses outward from the cursor, illuminating lines and dots as it spreads.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: GridLines,
    code: GRID_LINES_CODE,
    prompts: gridLinesPrompts,
  },
  {
    slug: 'bubble-field',
    image: 'https://ik.imagekit.io/aitoolkit/bubble-field.png?v=2',
    name: 'Bubble Field',
    description: 'A grid of outline circles that burst on hover — each expanding and fading like a soap bubble popping, then reforming, with a soft pastel blue palette.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: BubbleField,
    code: BUBBLE_FIELD_CODE,
    prompts: bubbleFieldPrompts,
  },
  {
    slug: 'noise-bg',
    image: 'https://ik.imagekit.io/aitoolkit/noise-bg.png',
    name: 'Noise Background',
    description: 'A canvas-based grain background of randomly scattered dots that illuminate with a soft Gaussian glow and organic connection lines on hover.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: NoiseBg,
    code: NOISE_BG_CODE,
    prompts: noiseBgPrompts,
  },
  {
    slug: 'pill-toggle',
    image: 'https://ik.imagekit.io/aitoolkit/pill-toggle.png',
    name: 'Pill Toggle',
    description: 'A minimal iOS-style slider toggle — thumb glides between off (grey) and on (green) with a snappy spring. Fully responsive.',
    tags: [
      { label: 'Buttons & Toggles', accent: true },
      { label: 'Framer Motion' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: PillToggle,
    code: `'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

const MAX_TRACK_W = 80
const MIN_TRACK_W = 48

export function PillToggle() {
  const [isOn, setIsOn]             = useState(false)
  const [animating, setAnimating]   = useState(false)
  const [pageIsDark, setPageIsDark] = useState(true)
  const [trackW, setTrackW]         = useState(MAX_TRACK_W)
  const containerRef                = useRef(null)
  const isOnRef                     = useRef(false)

  const trackH = Math.round(trackW * 0.55)
  const thumb  = Math.round(trackW * 0.45)
  const pad    = Math.max(3, Math.round(trackW * 0.05))
  const offX   = pad
  const onX    = trackW - thumb - pad
  const thumbX = useMotionValue(offX)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      setPageIsDark(card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark'))
    }
    check()
    const mo = new MutationObserver(check)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) mo.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    const update = () => {
      const s = Math.max(MIN_TRACK_W, Math.min(MAX_TRACK_W, Math.round(Math.min(el.offsetWidth, el.offsetHeight) * 0.18)))
      setTrackW(s)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => { mo.disconnect(); ro.disconnect() }
  }, [])

  useEffect(() => { thumbX.set(isOnRef.current ? onX : offX) }, [trackW])

  const offTrack   = pageIsDark ? '#3D3A3A' : '#D1D1D6'
  const trackColor = useTransform(thumbX, [offX, onX], [offTrack, '#22c55e'])

  const handleToggle = useCallback(async () => {
    if (animating) return
    setAnimating(true)
    const target = isOn ? offX : onX
    isOnRef.current = !isOn
    setIsOn((v) => !v)
    await animate(thumbX, target, { type: 'spring', stiffness: 500, damping: 36 })
    setAnimating(false)
  }, [isOn, animating, thumbX, offX, onX])

  const previewBg   = pageIsDark ? '#110F0C' : '#EDEAE5'
  const trackInset  = pageIsDark ? 'inset 0 1px 4px rgba(0,0,0,0.50)' : 'inset 0 1px 3px rgba(0,0,0,0.14)'
  const thumbShadow = pageIsDark ? '0 3px 8px rgba(0,0,0,0.50), 0 1px 3px rgba(0,0,0,0.30)' : '0 3px 8px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.10)'

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{ background: previewBg }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className="select-none"
      >
        <motion.button
          onClick={handleToggle}
          style={{ width: trackW, height: trackH, borderRadius: trackH / 2, backgroundColor: trackColor, boxShadow: trackInset, position: 'relative', cursor: 'pointer', border: 'none', outline: 'none', display: 'block' }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        >
          <motion.div style={{ position: 'absolute', top: pad, x: thumbX, width: thumb, height: thumb, borderRadius: '50%', background: 'white', boxShadow: thumbShadow }} />
        </motion.button>
      </motion.div>
    </div>
  )
}`,
    prompts: pillTogglePrompts,
  },
  {
    slug: 'mark-toggle',
    image: 'https://ik.imagekit.io/aitoolkit/mark-toggle.png',
    name: 'Mark Toggle',
    description: 'An iOS-style pill toggle in warm earth and sand tones — the thumb carries a small icon that morphs from X to checkmark as it slides across.',
    tags: [
      { label: 'Buttons & Toggles', accent: true },
      { label: 'Framer Motion' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: MarkToggle,
    code: `'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { X, Check } from '@phosphor-icons/react'

const MAX_TRACK_W = 80
const MIN_TRACK_W = 48

export function MarkToggle() {
  const [isOn, setIsOn]             = useState(false)
  const [animating, setAnimating]   = useState(false)
  const [pageIsDark, setPageIsDark] = useState(true)
  const [trackW, setTrackW]         = useState(MAX_TRACK_W)
  const containerRef                = useRef(null)
  const isOnRef                     = useRef(false)

  const trackH   = Math.round(trackW * 0.55)
  const thumb    = Math.round(trackW * 0.45)
  const pad      = Math.max(3, Math.round(trackW * 0.05))
  const offX     = pad
  const onX      = trackW - thumb - pad
  const iconSize = Math.round(thumb * 0.50)
  const thumbX   = useMotionValue(offX)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      setPageIsDark(card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark'))
    }
    check()
    const mo = new MutationObserver(check)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) mo.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    const update = () => {
      const s = Math.max(MIN_TRACK_W, Math.min(MAX_TRACK_W, Math.round(Math.min(el.offsetWidth, el.offsetHeight) * 0.18)))
      setTrackW(s)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => { mo.disconnect(); ro.disconnect() }
  }, [])

  useEffect(() => { thumbX.set(isOnRef.current ? onX : offX) }, [trackW])

  const offTrack   = pageIsDark ? '#8C7B6B' : '#B09478'
  const onTrack    = pageIsDark ? '#4A5935' : '#6B8040'
  const trackColor = useTransform(thumbX, [offX, onX], [offTrack, onTrack])
  const iconColor  = isOn ? onTrack : offTrack

  const handleToggle = useCallback(async () => {
    if (animating) return
    setAnimating(true)
    const target = isOn ? offX : onX
    isOnRef.current = !isOn
    setIsOn((v) => !v)
    await animate(thumbX, target, { type: 'spring', stiffness: 500, damping: 36 })
    setAnimating(false)
  }, [isOn, animating, thumbX, offX, onX])

  const previewBg   = pageIsDark ? '#110F0C' : '#EDEAE5'
  const trackInset  = pageIsDark ? 'inset 0 1px 4px rgba(0,0,0,0.50)' : 'inset 0 1px 3px rgba(0,0,0,0.14)'
  const thumbShadow = pageIsDark ? '0 3px 8px rgba(0,0,0,0.50), 0 1px 3px rgba(0,0,0,0.30)' : '0 3px 8px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.10)'

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{ background: previewBg }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className="select-none"
      >
        <motion.button
          onClick={handleToggle}
          style={{ width: trackW, height: trackH, borderRadius: trackH / 2, backgroundColor: trackColor, boxShadow: trackInset, position: 'relative', cursor: 'pointer', border: 'none', outline: 'none', display: 'block' }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        >
          <motion.div
            style={{ position: 'absolute', top: pad, x: thumbX, width: thumb, height: thumb, borderRadius: '50%', background: 'white', boxShadow: thumbShadow, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOn ? (
                <motion.span key="check" initial={{ scale: 0, rotate: -45, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0, rotate: 45, opacity: 0 }} transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={iconSize} weight="bold" color={iconColor} />
                </motion.span>
              ) : (
                <motion.span key="x-icon" initial={{ scale: 0, rotate: 45, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0, rotate: -45, opacity: 0 }} transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={iconSize} weight="bold" color={iconColor} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  )
}`,
    prompts: markTogglePrompts,
  },
  {
    slug: 'taga-toggle',
    image: 'https://ik.imagekit.io/aitoolkit/taga-toggle.png',
    name: 'Taga Toggle',
    description: 'A playful pill toggle with an expressive face on the thumb — dead (×× eyes, flat mouth) when off, happy (arc eyes, big smile) when on. Track warms from grey to yellow.',
    tags: [
      { label: 'Buttons & Toggles', accent: true },
      { label: 'Framer Motion' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: TagaToggle,
    code: `'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'

const MAX_TRACK_W = 80
const MIN_TRACK_W = 48
const FACE_COLOR  = '#4A3F35'

export function TagaToggle() {
  const [isOn, setIsOn]             = useState(false)
  const [animating, setAnimating]   = useState(false)
  const [pageIsDark, setPageIsDark] = useState(true)
  const [trackW, setTrackW]         = useState(MAX_TRACK_W)
  const containerRef                = useRef(null)
  const isOnRef                     = useRef(false)

  const trackH = Math.round(trackW * 0.58)
  const thumb  = Math.round(trackW * 0.50)
  const pad    = Math.max(3, Math.round(trackW * 0.04))
  const offX   = pad
  const onX    = trackW - thumb - pad
  const thumbX = useMotionValue(offX)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      setPageIsDark(card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark'))
    }
    check()
    const mo = new MutationObserver(check)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) mo.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    const update = () => {
      const s = Math.max(MIN_TRACK_W, Math.min(MAX_TRACK_W, Math.round(Math.min(el.offsetWidth, el.offsetHeight) * 0.18)))
      setTrackW(s)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => { mo.disconnect(); ro.disconnect() }
  }, [])

  useEffect(() => { thumbX.set(isOnRef.current ? onX : offX) }, [trackW])

  const offTrack   = pageIsDark ? '#4A4540' : '#9E9890'
  const onTrack    = pageIsDark ? '#D4960A' : '#F5C518'
  const trackColor = useTransform(thumbX, [offX, onX], [offTrack, onTrack])

  const handleToggle = useCallback(async () => {
    if (animating) return
    setAnimating(true)
    const target = isOn ? offX : onX
    isOnRef.current = !isOn
    setIsOn((v) => !v)
    await animate(thumbX, target, { type: 'spring', stiffness: 500, damping: 36 })
    setAnimating(false)
  }, [isOn, animating, thumbX, offX, onX])

  const previewBg   = pageIsDark ? '#110F0C' : '#EDEAE5'
  const trackInset  = pageIsDark ? 'inset 0 1px 4px rgba(0,0,0,0.50)' : 'inset 0 1px 3px rgba(0,0,0,0.14)'
  const thumbShadow = pageIsDark ? '0 3px 8px rgba(0,0,0,0.50), 0 1px 3px rgba(0,0,0,0.30)' : '0 3px 8px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.10)'

  const mouthPath = isOn ? 'M -0.40,0.15 Q 0,0.50 0.40,0.15' : 'M -0.40,0.43 Q 0,0.43 0.40,0.43'
  const faceSize  = thumb * 0.78
  const eyeSpring = { duration: 0.16, ease: [0.34, 1.56, 0.64, 1] }

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{ background: previewBg }}>
      <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }} className="select-none">
        <motion.button onClick={handleToggle} style={{ width: trackW, height: trackH, borderRadius: trackH / 2, backgroundColor: trackColor, boxShadow: trackInset, position: 'relative', cursor: 'pointer', border: 'none', outline: 'none', display: 'block' }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}>
          <motion.div style={{ position: 'absolute', top: pad, x: thumbX, width: thumb, height: thumb, borderRadius: '50%', background: 'white', boxShadow: thumbShadow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="-1 -1 2 2" width={faceSize} height={faceSize}>
              <AnimatePresence mode="wait">
                {isOn ? (
                  <motion.path key="le-happy" d="M -0.50,-0.28 Q -0.32,-0.06 -0.14,-0.28" stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round" fill="none" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.3 }} transition={eyeSpring} />
                ) : (
                  <motion.g key="le-dead" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.3 }} transition={eyeSpring}>
                    <line x1="-0.50" y1="-0.33" x2="-0.14" y2="-0.01" stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round" />
                    <line x1="-0.14" y1="-0.33" x2="-0.50" y2="-0.01" stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round" />
                  </motion.g>
                )}
              </AnimatePresence>
              <AnimatePresence mode="wait">
                {isOn ? (
                  <motion.path key="re-happy" d="M 0.14,-0.28 Q 0.32,-0.06 0.50,-0.28" stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round" fill="none" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.3 }} transition={eyeSpring} />
                ) : (
                  <motion.g key="re-dead" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.3 }} transition={eyeSpring}>
                    <line x1="0.14" y1="-0.33" x2="0.50" y2="-0.01" stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round" />
                    <line x1="0.50" y1="-0.33" x2="0.14" y2="-0.01" stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round" />
                  </motion.g>
                )}
              </AnimatePresence>
              <motion.path d={mouthPath} stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round" fill="none" transition={{ duration: 0.28, ease: 'easeInOut' }} />
            </svg>
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  )
}`,
    prompts: tagaTogglePrompts,
  },
  {
    slug: 'blind-pull-toggle',
    image: 'https://ik.imagekit.io/aitoolkit/blind-pull-toggle.png',
    name: 'Blind Pull Toggle',
    description: 'A dark/light mode toggle styled as a window-blind pull cord — click to yank the cord and watch the icon swap through a venetian-blind slat animation.',
    tags: [
      { label: 'Buttons & Toggles', accent: true },
      { label: 'Framer Motion' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: BlindPullToggle,
    code: BLIND_PULL_TOGGLE_CODE,
    prompts: blindPullTogglePrompts,
  },
  {
    slug: 'x-grid',
    image: 'https://ik.imagekit.io/aitoolkit/x-grid.png',
    name: 'X Grid',
    description: 'A canvas-based interactive background of × marks that illuminate and connect to neighbours with constellation lines on hover.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: XGrid,
    code: X_GRID_CODE,
    prompts: xGridPrompts,
  },
  {
    slug: 'radial-toolbar',
    image: 'https://ik.imagekit.io/aitoolkit/radial-toolbar.png',
    name: 'Radial Toolbar',
    description: 'A radial context menu that fans out formatting tools around a centre button, with active toggle states and an animated label pill.',
    tags: [
      { label: 'Inputs & Controls', accent: true },
      { label: 'Framer Motion' },
      { label: 'SVG' },
    ],
    dualTheme: true,
    PreviewComponent: RadialToolbar,
    code: RADIAL_TOOLBAR_CODE,
    prompts: radialToolbarPrompts,
  },
  {
    slug: 'dot-grid',
    image: 'https://ik.imagekit.io/aitoolkit/dot-grid.png',
    name: 'Dot Grid',
    description:
      'A canvas-based dot grid background where hovering illuminates nearby dots with a smooth radial glow and organic fade.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: InteractiveDotGrid,
    code: DOT_GRID_CODE,
    prompts: dotGridPrompts,
  },
  {
    slug: 'charging-widget',
    image: 'https://ik.imagekit.io/aitoolkit/charging-widget.png',
    name: 'Charging Widget',
    description:
      'Circular battery indicator with animated liquid waves that rise as the percentage counts up, looping continuously.',
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Framer Motion' },
      { label: 'SVG' },
    ],
    dualTheme: true,
    PreviewComponent: ChargingWidget,
    code: CHARGING_WIDGET_CODE,
    prompts: chargingWidgetPrompts,
  },
  {
    slug: 'runway-loader',
    image: 'https://ik.imagekit.io/aitoolkit/runway-loader.png',
    name: 'Runway Loader',
    description: 'An airplane taxis down a runway progress bar, nose tilting up and taking off at 100%.',
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Framer Motion' },
      { label: 'Animation' },
    ],
    dualTheme: true,
    PreviewComponent: RunwayLoader,
    code: RUNWAY_LOADER_CODE,
    prompts: runwayLoaderPrompts,
  },
  {
    slug: 'flip-calendar',
    image: 'https://ik.imagekit.io/aitoolkit/flip-calendar.png',
    name: 'Flip Calendar',
    description: 'A desk-calendar widget showing dates 1–31 with a satisfying flip-clock page-turn animation.',
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Framer Motion' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: FlipCalendar,
    code: FLIP_CALENDAR_CODE,
    prompts: flipCalendarPrompts,
  },
  {
    slug: 'glitch-button',
    image: 'https://ik.imagekit.io/aitoolkit/glitch-button.png',
    name: 'Glitch Button',
    description: 'A terminal-inspired button with a text scramble glitch effect on hover.',
    tags: [
      { label: 'Buttons & Toggles', accent: true },
      { label: 'Framer Motion' },
      { label: 'Terminal' },
    ],
    dualTheme: true,
    PreviewComponent: GlitchButton,
    code: GLITCH_BUTTON_CODE,
    prompts: glitchButtonPrompts,
  },
  {
    slug: 'floating-cards',
    image: 'https://ik.imagekit.io/aitoolkit/floating-cards.png',
    name: 'Floating Cards',
    description:
      'Three equal-width feature cards floating with staggered animations, Phosphor icons, and a violet ambient glow.',
    tags: [
      { label: 'Cards & Modals', accent: true },
      { label: 'Framer Motion' },
    ],
    dualTheme: true,
    PreviewComponent: FloatingCards,
    code: FLOATING_CARDS_CODE,
    prompts: {
      Claude: `Create a new file called FloatingCards.tsx. It should export a React client component named FloatingCards that renders 3 stat cards with continuous floating animations using Framer Motion. Requirements:
- Mark the file with 'use client' at the top
- Import motion from 'framer-motion'
- Define a CARDS array: { label: 'Components', value: '2,847', symbol: '◈', delay: 0 }, { label: 'Downloads', value: '94.2k', symbol: '↓', delay: 0.2 }, { label: 'Stars', value: '12.1k', symbol: '★', delay: 0.4 }
- Each card is a motion.div with animate={{ y: [0, -14, 0] }}, transition { duration: 3.5, delay: card.delay, repeat: Infinity, ease: 'easeInOut' }
- Wrapper: relative flex h-full w-full items-center justify-center overflow-hidden
- Glow: pointer-events-none absolute inset-0 flex items-center justify-center > div h-56 w-56 rounded-full bg-violet-600/25 blur-3xl
- Card className: flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-sm
- Symbol: text-2xl text-violet-400 | Value: text-xl font-bold text-white | Label: text-xs text-zinc-500
TypeScript throughout. No extra dependencies.`,
      V0: `Create a FloatingCards component using React, Framer Motion, and Tailwind CSS. Display 3 stat cards (Components: 2,847 | Downloads: 94.2k | Stars: 12.1k) that continuously float up and down with staggered delays using animate={{ y: [0, -14, 0] }} and repeat: Infinity. Use a dark zinc-950 background, glass morphism cards (bg-white/5, border border-white/10, backdrop-blur-sm, rounded-2xl), and a violet radial glow (bg-violet-600/25 blur-3xl) centered behind the cards. TypeScript only.`,
    },
  },
  {
    slug: 'text-blur-reveal',
    image: 'https://ik.imagekit.io/aitoolkit/text-blur-reveal.png',
    name: 'Text Blur Reveal',
    description:
      'Words animate into view one by one with a satisfying blur-to-sharp entrance, auto-replaying in a loop.',
    tags: [
      { label: 'Typography', accent: true },
      { label: 'Framer Motion' },
    ],
    PreviewComponent: TextBlurReveal,
    code: TEXT_BLUR_REVEAL_CODE,
    prompts: {
      Claude: `Create a new file called TextBlurReveal.tsx that exports a React client component. It should animate an array of words into view with a blur + slide-up effect, staggered per word.

Requirements:
- 'use client' at the top
- WORDS = ['Craft', 'interfaces', 'that', 'feel', 'like', 'magic.']
- ACCENTED = new Set([1, 5]) for gradient words
- State: cycle (number), showReplay (boolean)
- useEffect on [cycle]: set showReplay false, setTimeout showReplay=true at 1500ms, setTimeout cycle++ at 3650ms, clear both on cleanup
- Each word: motion.span key={\`\${cycle}-\${i}\`}, initial={{ opacity:0, y:22, filter:'blur(14px)' }}, animate={{ opacity:1, y:0, filter:'blur(0px)' }}, transition { duration:0.65, delay:i*0.1, ease:[0.21,0.47,0.32,0.98] }
- Accent className: bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent
- Normal className: text-4xl font-bold tracking-tight text-white
- Replay button: AnimatePresence wrapping a motion.button, only renders when showReplay is true, clicking sets showReplay false and increments cycle
No extra dependencies.`,
      V0: `Create a TextBlurReveal component using React, Framer Motion, and Tailwind CSS. It animates an array of words into view one by one, each with a blur-to-sharp + slide-up entrance effect. Use initial={{ opacity: 0, y: 22, filter: 'blur(14px)' }} → animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}, stagger delay of 0.1s per word, duration 0.65s, ease [0.21, 0.47, 0.32, 0.98]. Highlight accent words with a from-violet-400 to-indigo-400 gradient. Add a cycle state with useEffect to auto-replay every ~3.7s. Include an animated ↺ Replay button that appears after the animation finishes. TypeScript only.`,
    },
  },
  {
    slug: 'particle-sphere',
    image: 'https://ik.imagekit.io/aitoolkit/particle-sphere.png',
    name: 'Particle Sphere',
    description:
      '9,000 particles arranged on a sphere with warm gold and cool silver tones, slowly spinning in Three.js.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Three.js' },
    ],
    PreviewComponent: ParticleSphere,
    code: PARTICLE_SPHERE_CODE,
    prompts: {
      Claude: `Create a new file called ParticleSphere.tsx. It should export a React client component that renders an animated 3D particle sphere using Three.js.

Requirements:
- 'use client' at the top
- Import useEffect, useRef from react; import * as THREE from 'three'
- PARTICLE_COUNT = 9000
- makeSprite(): creates a 64×64 canvas with radial white→transparent gradient, returns THREE.CanvasTexture
- colorFromY(ny): returns [r,g,b] — ny≥0: warm gold [1, 0.55+ny*0.37, ny*0.63]; ny<0: silver [v,v,v+...] where v=0.38+(-ny)*0.62
- useEffect: create scene, PerspectiveCamera(52, W/H, 0.1, 100), camera.position.z=2.9
- WebGLRenderer, setClearColor(0x000000), appendChild to container div
- Fill positions/colors Float32Arrays using spherical coords (acos(2*rand-1), 2π*rand) with r±0.07 jitter
- BufferGeometry with position + color attributes
- PointsMaterial: size 0.032, map=sprite, vertexColors, transparent, depthWrite false, blending THREE.AdditiveBlending
- mesh.rotation.x=0.28, mesh.rotation.z=0.08 (tilt)
- RAF loop: t+=0.004/frame, mesh.rotation.y=t, z wobble via sin
- Cleanup: cancelAnimationFrame, dispose geo/mat/sprite/renderer, removeChild
- Return: <div ref={containerRef} className="h-full w-full" />`,
      V0: `Create a ParticleSphere component using React and Three.js. Render 9,000 particles distributed uniformly across a sphere surface using spherical coordinates (theta = acos(2*rand-1), phi = 2π*rand). Add slight radial jitter (r = 1 ± 0.07) for volumetric depth. Color each particle by its normalised Y position: upper hemisphere → warm gold-to-orange (rgb 1.0, 0.55+t*0.37, t*0.63), lower hemisphere → cool white-to-silver (v = 0.38+t*0.62). Use THREE.PointsMaterial with AdditiveBlending, a soft radial glow sprite as the map, and depthWrite: false. Tilt the mesh (rotation.x=0.28, rotation.z=0.08) and animate rotation.y continuously. Black background. TypeScript + 'use client'.`,
    },
  },
  {
    slug: 'polaroid-stack',
    image: 'https://ik.imagekit.io/aitoolkit/polaroid-stack.png',
    name: 'Polaroid Stack',
    description:
      'Five polaroid photo cards stacked in a casual pile — click to fan them out in a spring-animated arc, hover to lift, click a card to spotlight it.',
    tags: [
      { label: 'Cards & Modals', accent: true },
      { label: 'Framer Motion' },
    ],
    PreviewComponent: PolaroidStack,
    code: POLAROID_STACK_CODE,
    prompts: polaroidStackPrompts,
  },
  {
    slug: 'text-layout',
    image: 'https://ik.imagekit.io/aitoolkit/text-layout.png',
    name: 'Text Layout',
    description:
      'Live demo of zero-reflow text measurement — container width animates while Pretext recomputes layout at 60fps.',
    tags: [
      { label: 'Typography', accent: true },
      { label: '@chenglou/pretext' },
    ],
    PreviewComponent: TextLayoutCard,
    code: TEXT_LAYOUT_CODE,
    prompts: {
      Claude: `Create app/components/TextLayout.tsx demonstrating @chenglou/pretext for zero-reflow text measurement.

Install first: npm install @chenglou/pretext

File requirements:
- 'use client' at top
- Dynamic import of '@chenglou/pretext' inside useEffect (prepare() uses browser canvas, can't run server-side)
- Import animate, motion, useMotionValue, useTransform from 'framer-motion'
- Import AnimationPlaybackControls type from 'framer-motion'

Constants (MUST be kept in sync with CSS):
  FONT    = '14px "Courier New"'  // must match CSS font shorthand exactly
  LINE_H  = 22                    // must match CSS line-height exactly
  W_MIN   = 160
  W_MAX   = 320

useEffect logic:
  1. let alive=true, controls: AnimationPlaybackControls | undefined, unsub: (() => void) | undefined
  2. import('@chenglou/pretext').then(({ prepareWithSegments, layoutWithLines }) => {
       if (!alive) return
       const prepared = prepareWithSegments(TEXT, FONT)  // one-time ~19ms step
       function flush(w: number) {
         const { height, lineCount, lines } = layoutWithLines(prepared, Math.round(w), LINE_H)
         // update DOM refs directly — no setState, no re-renders
         heightRef.current!.textContent  = String(height)
         linesRef.current!.textContent   = String(lineCount)
         // update linesListRef.current.innerHTML with bar + text per line
       }
       flush(W_MIN)
       unsub    = motionWidth.on('change', flush)
       controls = animate(motionWidth, [W_MIN, W_MAX, W_MIN], { duration: 5, ease: 'easeInOut', repeat: Infinity })
     })
  3. return () => { alive=false; unsub?.(); controls?.stop() }

JSX structure:
- Left: motion.div with style={{ width: motionWidth, fontFamily:'"Courier New",monospace', fontSize:'14px', lineHeight:'22px' }}
- Progress bar: motion.div style={{ width: useTransform(motionWidth,[W_MIN,W_MAX],['0%','100%']) }}
- Right: div with ref={linesListRef} + stats row with ref={heightRef} and ref={linesRef}`,
      V0: `Create a React component that demonstrates the @chenglou/pretext library for measuring text layout without DOM reflow.

Install: npm install @chenglou/pretext framer-motion

The component should:
1. Call prepareWithSegments(text, '14px "Courier New"') once on mount inside useEffect — this is the expensive one-time step that measures glyph widths via canvas (~19ms)
2. Call layoutWithLines(prepared, width, 22) on every animation frame — this is the fast hot path (~0.09ms, pure arithmetic, no DOM)
3. Animate the container width between 160px and 320px using Framer Motion's animate() utility driving a useMotionValue
4. Display the live-updating height (px) and lineCount returned by layoutWithLines
5. Show each measured line as a horizontal bar proportional to its width vs container width

Key constraint: the font passed to prepareWithSegments must exactly match the CSS font declaration (family + size) and lineHeight must match CSS line-height. Use "Courier New" at 14px and 22px line height.

Style: dark theme, zinc-950 background, amber accents for Pretext output values, monospace font throughout.`,
    },
  },
  {
    slug: 'sphere-lines',
    image: 'https://ik.imagekit.io/aitoolkit/sphere-lines.png',
    name: 'Living Sphere',
    description: 'A wire-frame globe that breathes on its own — a narrow wave band drifts quietly across the surface. Hover to ripple the lines right where your cursor lands.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: SphereLines,
    code: `'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Config ───────────────────────────────────────────────────────────────────
const N_LATS      = 42
const N_STEPS     = 240
const WAVE_PHI    = 0.10
const WAVE_FREQ_T = 2.0
const WAVE_FREQ_P = 1.8
const WAVE_SPEED  = 0.005
const HOVER_BOOST = 1.5
const ROT_SPEED   = 0.006
const BACK_A      = 0.10
const ALPHA_MIN   = 0.28
const ALPHA_MAX   = 0.85
const LW_MIN      = 0.35
const LW_MAX      = 0.90
const TWO_PI      = Math.PI * 2

export function SphereLines() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const mouseRef     = useRef<{ x: number; y: number } | null>(null)
  const isDarkRef    = useRef(true)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      const dark = card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark')
      setIsDark(dark)
      isDarkRef.current = dark
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) observer.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    let cw = 0, ch = 0, animId = 0, alive = true, t = 0, rot = 0, hoverStr = 0

    function build() {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      cw = rect.width; ch = rect.height
      if (!cw || !ch) return
      canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const xs = new Float32Array(N_STEPS + 1)
    const ys = new Float32Array(N_STEPS + 1)

    function frame() {
      if (!alive) return
      t += WAVE_SPEED; rot += ROT_SPEED
      const hasHover = mouseRef.current !== null
      hoverStr += ((hasHover ? 1 : 0) - hoverStr) * (hasHover ? 0.025 : 0.015)
      ctx.clearRect(0, 0, cw, ch)
      const R = Math.min(cw, ch) * 0.42
      const cx = cw / 2, cy = ch / 2
      const wavePhi = WAVE_PHI * (1 + hoverStr * HOVER_BOOST)
      const dotRGB  = isDarkRef.current ? '255,255,255' : '28,25,22'
      ctx.save()
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip()
      for (let i = 0; i < N_LATS; i++) {
        const phi   = -Math.PI / 2 + (i + 1) * Math.PI / (N_LATS + 1)
        const depth = Math.cos(phi)
        const lineA = ALPHA_MIN + depth * (ALPHA_MAX - ALPHA_MIN)
        const lw    = LW_MIN + depth * (LW_MAX - LW_MIN)
        for (let j = 0; j <= N_STEPS; j++) {
          const theta = j * 2 * Math.PI / N_STEPS
          const tR    = theta + rot
          const dPhi  = wavePhi * (Math.sin(tR * WAVE_FREQ_T + phi * WAVE_FREQ_P + t) + 0.45 * Math.sin(tR * WAVE_FREQ_T * 1.7 + phi * WAVE_FREQ_P * 1.3 + t * 1.4))
          const phiD  = phi + dPhi
          xs[j] = cx + R * Math.cos(phiD) * Math.cos(tR)
          ys[j] = cy - R * Math.sin(phiD)
        }
        ctx.strokeStyle = \`rgba(\${dotRGB},\${BACK_A})\`; ctx.lineWidth = 0.4; ctx.beginPath()
        const mx0 = (xs[N_STEPS - 1] + xs[0]) / 2, my0 = (ys[N_STEPS - 1] + ys[0]) / 2
        ctx.moveTo(mx0, my0)
        for (let j = 0; j < N_STEPS; j++) {
          const nx = j + 1 < N_STEPS ? xs[j + 1] : xs[0], ny = j + 1 < N_STEPS ? ys[j + 1] : ys[0]
          ctx.quadraticCurveTo(xs[j], ys[j], (xs[j] + nx) / 2, (ys[j] + ny) / 2)
        }
        ctx.closePath(); ctx.stroke()
        let startJ = 0
        for (let j = 0; j < N_STEPS; j++) { if (Math.sin(j * TWO_PI / N_STEPS + rot) < 0) { startJ = j; break } }
        ctx.strokeStyle = \`rgba(\${dotRGB},\${lineA.toFixed(3)})\`; ctx.lineWidth = lw; ctx.beginPath()
        let inFront = false, prevX = 0, prevY = 0
        for (let jj = 0; jj <= N_STEPS; jj++) {
          const j = (startJ + jj) % N_STEPS
          const isFront = Math.sin(j * TWO_PI / N_STEPS + rot) >= 0
          const x = xs[j], y = ys[j]
          if (isFront) {
            if (!inFront) { ctx.moveTo(x, y); inFront = true }
            else { ctx.quadraticCurveTo(prevX, prevY, (prevX + x) / 2, (prevY + y) / 2) }
            prevX = x; prevY = y
          } else if (inFront) { ctx.lineTo(prevX, prevY); inFront = false }
        }
        if (inFront) ctx.lineTo(prevX, prevY)
        ctx.stroke()
      }
      ctx.restore()
      animId = requestAnimationFrame(frame)
    }

    build(); frame()
    const ro = new ResizeObserver(build)
    ro.observe(canvas.parentElement!)
    return () => { alive = false; cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  function updateMouse(clientX: number, clientY: number) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top }
  }

  const bg         = isDark ? '#110F0C' : '#F5F1EA'
  const labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(28,25,22,0.45)'
  const hintColor  = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(28,25,22,0.22)'

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: bg }}
      onMouseMove={(e) => updateMouse(e.clientX, e.clientY)}
      onMouseLeave={() => { mouseRef.current = null }}
      onTouchMove={(e) => { const t2 = e.touches[0]; if (t2) updateMouse(t2.clientX, t2.clientY) }}
      onTouchEnd={() => { mouseRef.current = null }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span style={{ color: labelColor, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Sphere Lines</span>
        <span style={{ color: hintColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>hover to warp</span>
      </div>
    </div>
  )
}`,
    prompts: sphereLinesPrompts,
  },
  {
    slug: 'magnetic-dots',
    image: 'https://ik.imagekit.io/aitoolkit/magnetic-dots.png',
    name: 'Magnetic Dots',
    description: 'A dense grid of dots that get magnetically pulled toward the cursor, snapping back with a satisfying elastic bounce when you leave.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: MagneticDots,
    code: `'use client'

import { useEffect, useRef } from 'react'

const SPACING      = 22
const DOT_RADIUS   = 1.5
const INFLUENCE_R  = 160
const SPRING_K     = 0.12
const DAMPING      = 0.75
const MAG_STRENGTH = 28
const LERP_FACTOR  = 0.06

type Dot = { restX: number; restY: number; x: number; y: number; vx: number; vy: number }

export function MagneticDots() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const mouseRef     = useRef<{ x: number; y: number } | null>(null)
  const hoverStrRef  = useRef(0)
  const isDarkRef    = useRef(true)
  const bgRef        = useRef('#110F0C')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const apply = (dark: boolean) => {
      isDarkRef.current = dark
      bgRef.current = dark ? '#110F0C' : '#F5F1EA'
      if (containerRef.current) containerRef.current.style.background = bgRef.current
    }
    const check = () => {
      const card = el.closest('[data-card-theme]')
      apply(card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark'))
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) observer.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let dots: Dot[] = [], animId = 0, alive = true, cw = 0, ch = 0
    function build() {
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      cw = rect.width; ch = rect.height
      if (!cw || !ch) return
      canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = Math.ceil(cw / SPACING) + 1, rows = Math.ceil(ch / SPACING) + 1
      const ox = (cw % SPACING) / 2, oy = (ch % SPACING) / 2
      const prev = new Map<string, Dot>()
      for (const d of dots) prev.set(\`\${d.restX},\${d.restY}\`, d)
      dots = []
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const rx = ox + c * SPACING, ry = oy + r * SPACING, key = \`\${rx},\${ry}\`
        dots.push(prev.get(key) ?? { restX: rx, restY: ry, x: rx, y: ry, vx: 0, vy: 0 })
      }
    }
    function frame() {
      if (!alive || !ctx) return
      const hasPointer = mouseRef.current !== null
      hoverStrRef.current += ((hasPointer ? 1 : 0) - hoverStrRef.current) * LERP_FACTOR
      const hStr = hoverStrRef.current, mx = mouseRef.current?.x ?? -99999, my = mouseRef.current?.y ?? -99999, r2 = INFLUENCE_R * INFLUENCE_R
      ctx.clearRect(0, 0, cw, ch)
      ctx.fillStyle = isDarkRef.current ? 'rgba(255,255,255,0.5)' : 'rgba(28,25,22,0.4)'
      for (const d of dots) {
        if (hStr > 0.001) {
          const dx = d.x - mx, dy = d.y - my, dist2 = dx * dx + dy * dy
          if (dist2 < r2 && dist2 > 0.01) {
            const dist = Math.sqrt(dist2), t = 1 - dist / INFLUENCE_R, force = t * t * MAG_STRENGTH * hStr
            d.vx += (-dx / dist) * force; d.vy += (-dy / dist) * force
          }
        }
        d.vx += (d.restX - d.x) * SPRING_K; d.vy += (d.restY - d.y) * SPRING_K
        d.vx *= (1 - DAMPING); d.vy *= (1 - DAMPING)
        d.x += d.vx; d.y += d.vy
        ctx.beginPath(); ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2); ctx.fill()
      }
      animId = requestAnimationFrame(frame)
    }
    build(); frame()
    const ro = new ResizeObserver(build)
    if (canvas.parentElement) ro.observe(canvas.parentElement)
    return () => { alive = false; cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  function updateMouse(clientX: number, clientY: number) {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top }
  }

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: '#110F0C' }}
      onMouseMove={(e) => updateMouse(e.clientX, e.clientY)} onMouseLeave={() => { mouseRef.current = null }}
      onTouchMove={(e) => { const t = e.touches[0]; if (t) updateMouse(t.clientX, t.clientY) }} onTouchEnd={() => { mouseRef.current = null }}>
      <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
    </div>
  )
}`,
    prompts: magneticDotsPrompts,
  },
  {
    slug: 'elastic-string',
    image: 'https://ik.imagekit.io/aitoolkit/elastic-string.png',
    name: 'Elastic String',
    description: 'A single taut line that bends toward the cursor like a guitar string being plucked, then snaps back with a satisfying elastic oscillation.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: ElasticString,
    code: `'use client'

import { useEffect, useRef, useState } from 'react'

const TENSION  = 0.042
const DAMPING  = 0.88
const MAX_PULL = 0.38
const LERP_K   = 0.22

export function ElasticString() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(true)
  const isDarkRef = useRef(isDark)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      const dark = card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark')
      setIsDark(dark); isDarkRef.current = dark
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) observer.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const c = canvas, cx = ctx
    let rafId: number, alive = true, ctrlY = 0, velY = 0, targetY = 0, mouseX = 0, isHovering = false
    function resize() {
      const dpr = window.devicePixelRatio || 1
      c.width = c.offsetWidth * dpr; c.height = c.offsetHeight * dpr; cx.scale(dpr, dpr)
      ctrlY = 0; velY = 0; targetY = 0
    }
    const ro = new ResizeObserver(resize)
    ro.observe(c); resize()
    function draw() {
      const dpr = window.devicePixelRatio || 1, w = c.width / dpr, h = c.height / dpr, cy2 = h / 2
      cx.clearRect(0, 0, w, h); cx.fillStyle = isDarkRef.current ? '#110F0C' : '#F5F1EA'; cx.fillRect(0, 0, w, h)
      const cptX = mouseX || w / 2, cptY = cy2 + ctrlY, isDk = isDarkRef.current
      for (const [lw, alpha] of [[8, 0.07], [3, 0.18], [1.5, 0.72]] as [number, number][]) {
        cx.beginPath(); cx.moveTo(0, cy2); cx.quadraticCurveTo(cptX, cptY, w, cy2)
        cx.lineWidth = lw; cx.lineCap = 'round'
        cx.strokeStyle = isDk ? \`rgba(255,255,255,\${alpha})\` : \`rgba(28,25,22,\${alpha})\`; cx.stroke()
      }
      const deflection = Math.abs(ctrlY), maxDef = h * MAX_PULL, dotAlpha = Math.min(deflection / (maxDef * 0.5), 1) * 0.55
      if (dotAlpha > 0.01) {
        cx.beginPath(); cx.arc(cptX, cptY, 3, 0, Math.PI * 2)
        cx.fillStyle = isDk ? \`rgba(255,255,255,\${dotAlpha.toFixed(3)})\` : \`rgba(28,25,22,\${dotAlpha.toFixed(3)})\`; cx.fill()
      }
    }
    function tick() {
      if (!alive) return; rafId = requestAnimationFrame(tick)
      velY += (targetY - ctrlY) * TENSION; velY *= DAMPING; ctrlY += velY
      if (!isHovering && Math.abs(ctrlY) < 0.05 && Math.abs(velY) < 0.05) { ctrlY = 0; velY = 0; targetY = 0 }
      draw()
    }
    function onMouseMove(e: MouseEvent) {
      const rect = c.getBoundingClientRect(), localX = e.clientX - rect.left, localY = e.clientY - rect.top
      mouseX = localX
      const dpr = window.devicePixelRatio || 1, h = c.height / dpr, cy2 = h / 2
      const distFromCenter = localY - cy2, proximity = 1 - Math.min(Math.abs(distFromCenter) / (h * 0.5), 1)
      const strength = proximity * proximity, rawPull = distFromCenter * strength, maxPull = h * MAX_PULL
      targetY += (Math.max(-maxPull, Math.min(maxPull, rawPull)) - targetY) * LERP_K
    }
    function onMouseEnter(e: MouseEvent) { isHovering = true; onMouseMove(e) }
    function onMouseLeave() { isHovering = false; targetY = 0 }
    c.addEventListener('mousemove', onMouseMove); c.addEventListener('mouseenter', onMouseEnter); c.addEventListener('mouseleave', onMouseLeave)
    tick()
    return () => { alive = false; cancelAnimationFrame(rafId); ro.disconnect(); c.removeEventListener('mousemove', onMouseMove); c.removeEventListener('mouseenter', onMouseEnter); c.removeEventListener('mouseleave', onMouseLeave) }
  }, [])

  return (
    <div ref={wrapperRef} className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ display: 'block' }} />
    </div>
  )
}`,
    prompts: elasticStringPrompts,
  },

  {
    slug: 'particle-constellation',
    image: 'https://ik.imagekit.io/aitoolkit/particle-constellation.png?v=2',
    name: 'Spider Web',
    description: 'An organic silk web that breathes with a slow idle bow. Hover to physically push the nodes — each intersection bounces back with tension, fading the strings near your cursor.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: ParticleConstellation,
    code: `'use client'

import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 80, MAX_SPEED = 0.4, PARTICLE_RADIUS = 2, MAX_DIST = 120, REPEL_RADIUS = 150, REPEL_STRENGTH = 0.06

interface Particle { x: number; y: number; vx: number; vy: number }
interface Theme { bg: string; particleColor: string; lineColorBase: string }

const DARK_THEME: Theme = { bg: '#110F0C', particleColor: 'rgba(255,255,255,0.8)', lineColorBase: '255,255,255' }
const LIGHT_THEME: Theme = { bg: '#F5F1EA', particleColor: 'rgba(28,25,22,0.7)', lineColorBase: '28,25,22' }

function detectTheme(el: HTMLElement): Theme {
  const wrapper = el.closest('[data-card-theme]')
  if (wrapper instanceof HTMLElement) return wrapper.dataset.cardTheme === 'light' ? LIGHT_THEME : DARK_THEME
  return document.documentElement.classList.contains('dark') ? DARK_THEME : LIGHT_THEME
}

function makeParticles(w: number, h: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()*2-1)*MAX_SPEED, vy: (Math.random()*2-1)*MAX_SPEED }))
}

export function ParticleConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current, container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let alive = true, theme = detectTheme(container)
    function resize() {
      if (!canvas || !container) return
      canvas.width = container.clientWidth; canvas.height = container.clientHeight
      particlesRef.current = makeParticles(canvas.width, canvas.height); theme = detectTheme(container)
    }
    resize()
    const ro = new ResizeObserver(() => { if (alive) resize() }); ro.observe(container)
    const mo = new MutationObserver(() => { if (alive && container) theme = detectTheme(container) })
    const wrapper = container.closest('[data-card-theme]')
    if (wrapper) mo.observe(wrapper, { attributes: true, attributeFilter: ['data-card-theme','class'] })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    function tick() {
      if (!alive || !canvas || !ctx) return; rafRef.current = requestAnimationFrame(tick)
      const W = canvas.width, H = canvas.height, particles = particlesRef.current, mouse = mouseRef.current
      ctx.fillStyle = theme.bg; ctx.fillRect(0, 0, W, H)
      for (const p of particles) {
        if (mouse) {
          const dx = p.x-mouse.x, dy = p.y-mouse.y, dist = Math.sqrt(dx*dx+dy*dy)
          if (dist < REPEL_RADIUS && dist > 0) { const force = (REPEL_RADIUS-dist)/REPEL_RADIUS*REPEL_STRENGTH; p.vx += (dx/dist)*force; p.vy += (dy/dist)*force }
        }
        const speed = Math.sqrt(p.vx*p.vx+p.vy*p.vy)
        if (speed > MAX_SPEED) { p.vx = p.vx/speed*MAX_SPEED; p.vy = p.vy/speed*MAX_SPEED }
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x += W; if (p.x > W) p.x -= W; if (p.y < 0) p.y += H; if (p.y > H) p.y -= H
      }
      for (let i = 0; i < particles.length; i++) for (let j = i+1; j < particles.length; j++) {
        const a = particles[i], b = particles[j], dx = a.x-b.x, dy = a.y-b.y, dist = Math.sqrt(dx*dx+dy*dy)
        if (dist < MAX_DIST) {
          ctx.beginPath(); ctx.strokeStyle = \`rgba(\${theme.lineColorBase},\${((1-dist/MAX_DIST)*0.4).toFixed(3)})\`
          ctx.lineWidth = 0.8; ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke()
        }
      }
      ctx.fillStyle = theme.particleColor
      for (const p of particles) { ctx.beginPath(); ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI*2); ctx.fill() }
    }
    rafRef.current = requestAnimationFrame(tick)
    function handleMouseMove(e: MouseEvent) { if (!canvas) return; const r = canvas.getBoundingClientRect(); mouseRef.current = { x: e.clientX-r.left, y: e.clientY-r.top } }
    function handleMouseLeave() { mouseRef.current = null }
    container.addEventListener('mousemove', handleMouseMove); container.addEventListener('mouseleave', handleMouseLeave)
    return () => { alive = false; cancelAnimationFrame(rafRef.current); ro.disconnect(); mo.disconnect(); container.removeEventListener('mousemove', handleMouseMove); container.removeEventListener('mouseleave', handleMouseLeave) }
  }, [])

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: '#110F0C' }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}`,
    prompts: particleConstellationPrompts,
  },
  {
    slug: 'scramble-text',
    image: 'https://ik.imagekit.io/aitoolkit/scramble-text.png?v=2',
    name: 'Encrypted Text',
    description: 'Characters scramble continuously in an encrypted loop. Hover to decrypt them one by one — mouse out and they go back to cipher.',
    tags: [
      { label: 'Typography', accent: true },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: ScrambleText,
    code: `'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Geist_Mono } from 'next/font/google'
const geistMono = Geist_Mono({ subsets: ['latin'], weight: ['500'] })

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!'
const TARGET_TEXT = 'ENCRYPTED'

function randomChar(): string {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)] ?? 'X'
}

interface CharState { display: string; resolved: boolean }

const SCRAMBLED = (): CharState[] =>
  TARGET_TEXT.split('').map(() => ({ display: randomChar(), resolved: false }))

export function ScrambleText() {
  const [chars, setChars] = useState<CharState[]>(SCRAMBLED)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let cancelled = false
    const timeouts: ReturnType<typeof setTimeout>[] = []
    let scrambleInterval: ReturnType<typeof setInterval> | null = null

    function startScrambleInterval(resolvedSet: Set<number>) {
      if (scrambleInterval) clearInterval(scrambleInterval)
      scrambleInterval = setInterval(() => {
        if (cancelled) return
        setChars((prev) =>
          prev.map((ch, i) =>
            resolvedSet.has(i) ? ch : { display: randomChar(), resolved: false }
          )
        )
      }, 60)
    }

    if (isHovered) {
      const resolvedSet = new Set<number>()
      startScrambleInterval(resolvedSet)
      TARGET_TEXT.split('').forEach((letter, i) => {
        const t = setTimeout(() => {
          if (cancelled) return
          resolvedSet.add(i)
          setChars((prev) =>
            prev.map((ch, idx) => (idx === i ? { display: letter, resolved: true } : ch))
          )
          if (resolvedSet.size === TARGET_TEXT.length && scrambleInterval) {
            clearInterval(scrambleInterval)
            scrambleInterval = null
          }
        }, 80 + i * 100)
        timeouts.push(t)
      })
    } else {
      setChars(SCRAMBLED())
      startScrambleInterval(new Set<number>())
    }

    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
      if (scrambleInterval) clearInterval(scrambleInterval)
    }
  }, [isHovered])

  return (
    <div
      className="flex h-full w-full cursor-default items-center justify-center bg-sand-100 dark:bg-sand-950"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex select-none flex-col items-center gap-6">
        <div className={\`flex items-center gap-1 \${geistMono.className}\`}>
          {chars.map((ch, i) => (
            <span
              key={i}
              className={[
                'text-5xl font-medium leading-none tracking-widest transition-colors duration-100',
                ch.resolved
                  ? 'text-sand-900 dark:text-sand-50'
                  : 'text-olive-500 dark:text-olive-400',
              ].join(' ')}
            >
              {ch.display}
            </span>
          ))}
        </div>
        <motion.p
          className={\`text-xs font-medium uppercase tracking-[0.2em] text-sand-400 dark:text-sand-600 \${geistMono.className}\`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.8 }}
        >
          hover to decrypt
        </motion.p>
      </div>
    </div>
  )
}`,
    prompts: scrambleTextPrompts,
  },
  {
    slug: 'neon-clock',
    image: 'https://ik.imagekit.io/aitoolkit/neon-clock.png?v=9',
    name: 'LCD Clock',
    description: 'A retro 7-segment LCD clock with pixel-grid overlay. Shows live HH:MM:SS with blinking colon, AM/PM indicator, day of week row, and full date.',
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Clock' },
      { label: 'Interactive' },
    ],
    PreviewComponent: NeonClock,
    code: `'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GLOW_NORMAL = '0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0ff, 0 0 82px #0ff, 0 0 92px #0ff, 0 0 102px #0ff'
const GLOW_HOVER  = '0 0 7px #fff, 0 0 14px #fff, 0 0 28px #fff, 0 0 56px #0ff, 0 0 100px #0ff, 0 0 130px #0ff, 0 0 160px #0ff, 0 0 200px #0ff'
const COLON_GLOW  = '0 0 5px #fff, 0 0 8px #fff, 0 0 16px #0ff, 0 0 32px #0ff, 0 0 60px #0ff'

function pad(n: number) { return n.toString().padStart(2, '0') }
function getTimeParts() { const now = new Date(); return { hh: pad(now.getHours()), mm: pad(now.getMinutes()), ss: pad(now.getSeconds()) } }

function DigitGroup({ value, glow }: { value: string; glow: string }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span key={value} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} exit={{ opacity: 0.4 }} transition={{ duration: 0.15, ease: 'easeOut' }} style={{ textShadow: glow, display: 'inline-block', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </motion.span>
    </AnimatePresence>
  )
}

function ColonSep({ glow, blink }: { glow: string; blink: boolean }) {
  return <motion.span animate={{ opacity: blink ? 0.4 : 1 }} transition={{ duration: 0.06, ease: 'linear' }} style={{ textShadow: glow, display: 'inline-block', marginInline: '0.06em', color: '#b0ffff' }}>:</motion.span>
}

export function NeonClock() {
  const [time, setTime] = useState(getTimeParts)
  const [hovered, setHovered] = useState(false)
  const [flickering, setFlickering] = useState(false)
  const prevSsRef = useRef(time.ss)

  useEffect(() => {
    let flickerTimer: ReturnType<typeof setTimeout> | null = null
    const id = setInterval(() => {
      const next = getTimeParts(); setTime(next)
      if (next.ss !== prevSsRef.current) {
        prevSsRef.current = next.ss
        if (flickerTimer !== null) clearTimeout(flickerTimer)
        setFlickering(true); flickerTimer = setTimeout(() => setFlickering(false), 80)
      }
    }, 1000)
    return () => { clearInterval(id); if (flickerTimer !== null) clearTimeout(flickerTimer) }
  }, [])

  const glow = hovered ? GLOW_HOVER : GLOW_NORMAL
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-sand-950" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <motion.div animate={{ opacity: flickering ? 0.55 : 1 }} transition={{ duration: 0.06, ease: 'linear' }} className="flex items-center select-none" style={{ fontFamily: "'Courier New', 'Lucida Console', monospace", fontSize: 'clamp(2.5rem, 10vw, 5rem)', fontWeight: 700, letterSpacing: '0.08em', color: '#e0ffff', lineHeight: 1 }}>
        <DigitGroup value={time.hh} glow={glow} />
        <ColonSep glow={COLON_GLOW} blink={flickering} />
        <DigitGroup value={time.mm} glow={glow} />
        <ColonSep glow={COLON_GLOW} blink={flickering} />
        <DigitGroup value={time.ss} glow={glow} />
      </motion.div>
      <motion.div animate={{ opacity: hovered ? 0.35 : 0.18, scaleX: hovered ? 1.2 : 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} style={{ position: 'absolute', bottom: '18%', width: '55%', height: 40, borderRadius: '50%', background: 'radial-gradient(ellipse at center, #0ff 0%, transparent 70%)', filter: 'blur(18px)', pointerEvents: 'none' }} />
    </div>
  )
}`,
    prompts: neonClockPrompts,
  },
  {
    slug: 'noise-field',
    image: 'https://ik.imagekit.io/aitoolkit/noise-field.png',
    name: 'Noise Field',
    description: 'A grid of flowing arrows driven by layered sine-wave noise — like wind mapped on a weather chart. Hover to create a swirling vortex at the cursor.',
    tags: [
      { label: 'Backgrounds', accent: true },
      { label: 'Canvas' },
      { label: 'Interactive' },
    ],
    dualTheme: true,
    PreviewComponent: NoiseField,
    code: `'use client'

import { useEffect, useRef, useState } from 'react'

const GRID_SPACING = 24, ARROW_LEN = 10, HEAD_SIZE = 4

function flowAngle(gx: number, gy: number, t: number): number {
  return Math.sin(gx*0.008+t)*Math.PI + Math.cos(gy*0.008+t*0.7)*Math.PI
}

export function NoiseField() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const [isDark, setIsDark] = useState(true)
  const isDarkRef   = useRef(isDark)
  const mouseRef    = useRef<{ x:number; y:number }|null>(null)
  const hoverStrRef = useRef(0)
  useEffect(() => { isDarkRef.current = isDark }, [isDark])

  useEffect(() => {
    const el = containerRef.current; if (!el) return
    const check = () => { const card = el.closest('[data-card-theme]'); const dark = card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark'); setIsDark(dark); isDarkRef.current = dark }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes:true, attributeFilter:['class'] })
    const cw = el.closest('[data-card-theme]'); if (cw) observer.observe(cw, { attributes:true, attributeFilter:['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const onMove = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouseRef.current = { x:e.clientX-r.left, y:e.clientY-r.top } }
    const onLeave = () => { mouseRef.current = null }
    canvas.addEventListener('mousemove', onMove); canvas.addEventListener('mouseleave', onLeave)
    return () => { canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('mouseleave', onLeave) }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current, container = containerRef.current; if (!canvas||!container) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    let rafId: number, t = 0
    const resize = () => { const w=container.clientWidth||480, h=container.clientHeight||480, dpr=window.devicePixelRatio||1; canvas.width=w*dpr; canvas.height=h*dpr; canvas.style.width=\`\${w}px\`; canvas.style.height=\`\${h}px\`; ctx.scale(dpr,dpr) }
    resize(); const ro = new ResizeObserver(resize); ro.observe(container)
    function draw() {
      const W=container!.clientWidth||480, H=container!.clientHeight||480
      const dark=isDarkRef.current, arrowColor=dark?'rgba(255,255,255,0.35)':'rgba(28,25,22,0.30)', bgColor=dark?'#110F0C':'#F5F1EA'
      ctx!.fillStyle=bgColor; ctx!.fillRect(0,0,W,H)
      hoverStrRef.current += ((mouseRef.current!==null?1:0)-hoverStrRef.current)*0.05
      const mouse=mouseRef.current, hoverStr=hoverStrRef.current, VR2=120*120
      ctx!.strokeStyle=arrowColor; ctx!.fillStyle=arrowColor; ctx!.lineWidth=1.2; ctx!.lineCap='round'
      for (let gx=GRID_SPACING/2; gx<W; gx+=GRID_SPACING) for (let gy=GRID_SPACING/2; gy<H; gy+=GRID_SPACING) {
        let angle=flowAngle(gx,gy,t)
        if (mouse&&hoverStr>0.001) { const dx=gx-mouse.x, dy=gy-mouse.y, d2=dx*dx+dy*dy; if(d2<VR2*4){const f=Math.exp(-d2/VR2); angle+=hoverStr*Math.atan2(dy,dx)*f*1.8} }
        const cos=Math.cos(angle), sin=Math.sin(angle), x0=gx-cos*ARROW_LEN, y0=gy-sin*ARROW_LEN, x1=gx+cos*ARROW_LEN, y1=gy+sin*ARROW_LEN
        ctx!.beginPath(); ctx!.moveTo(x0,y0); ctx!.lineTo(x1,y1); ctx!.stroke()
        const ha=Math.PI-Math.PI/6
        ctx!.beginPath(); ctx!.moveTo(x1,y1); ctx!.lineTo(x1+Math.cos(angle+ha)*HEAD_SIZE, y1+Math.sin(angle+ha)*HEAD_SIZE); ctx!.stroke()
        ctx!.beginPath(); ctx!.moveTo(x1,y1); ctx!.lineTo(x1+Math.cos(angle-ha)*HEAD_SIZE, y1+Math.sin(angle-ha)*HEAD_SIZE); ctx!.stroke()
      }
      t+=0.006; rafId=requestAnimationFrame(draw)
    }
    rafId=requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(rafId); ro.disconnect() }
  }, [])

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background:isDark?'#110F0C':'#F5F1EA' }}>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}`,
    prompts: noiseFieldPrompts,
  },
  {
    slug: 'emoji-burst',
    image: 'https://ik.imagekit.io/aitoolkit/emoji-burst.png',
    name: 'Emoji Burst',
    description: 'A button that explodes emojis outward in all directions. Five emoji sets cycle on each click.',
    tags: [{ label: 'Buttons & Toggles', accent: true }, { label: 'Interactive' }, { label: 'Animation' }],
    dualTheme: true,
    PreviewComponent: EmojiBurst,
    code: `'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SETS = [
  { label: 'Party!', emojis: ['🎉','🎊','🥳','🎈','🎁','✨','🌟','🪅'], bg: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', shadow: 'rgba(139,92,246,0.5)' },
  { label: 'Boom!',  emojis: ['🔥','💥','⚡','🌪️','💫','⭐','🌈','☄️'], bg: 'linear-gradient(135deg,#F97316,#DC2626)', shadow: 'rgba(249,115,22,0.5)'  },
  { label: 'Yum!',  emojis: ['🍕','🍔','🌮','🍣','🍩','🧁','🍦','🍇'], bg: 'linear-gradient(135deg,#22C55E,#16A34A)', shadow: 'rgba(34,197,94,0.5)'   },
  { label: 'Cute!', emojis: ['🐱','🐶','🐼','🦊','🦄','🐸','🐧','🐨'], bg: 'linear-gradient(135deg,#06B6D4,#0284C7)', shadow: 'rgba(6,182,212,0.5)'   },
  { label: 'Love!', emojis: ['❤️','💜','💙','💚','💛','🧡','💖','💝'], bg: 'linear-gradient(135deg,#EC4899,#BE185D)', shadow: 'rgba(236,72,153,0.5)'  },
] as const

const PARTICLE_COUNT = 18

interface Particle {
  id: number; emoji: string; angle: number; distance: number
  rotation: number; size: number; duration: number
}

let uid = 0

function EmojiParticle({ p }: { p: Particle }) {
  const tx   = Math.cos(p.angle) * p.distance
  const ty   = Math.sin(p.angle) * p.distance
  const lift = 18 + Math.abs(Math.cos(p.angle)) * 22
  return (
    <motion.span
      className="pointer-events-none absolute select-none"
      style={{ left:'50%', top:'50%', fontSize:\`\${p.size}rem\`, lineHeight:1, translateX:'-50%', translateY:'-50%' }}
      initial={{ x:0, y:0, scale:0, opacity:1, rotate:0 }}
      animate={{
        x:[0,tx*0.5,tx], y:[0,ty*0.5-lift,ty],
        scale:[0,1.25,0.55], opacity:[1,1,0], rotate:[0,p.rotation*0.5,p.rotation],
      }}
      transition={{ duration:p.duration, ease:[[0.08,0.82,0.17,1],'linear'] as never, times:[0,0.2,1] }}
    >{p.emoji}</motion.span>
  )
}

export function EmojiBurst() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [setIdx, setSetIdx]       = useState(0)
  const [isPopping, setIsPopping] = useState(false)
  const currentSet = SETS[setIdx % SETS.length]

  const explode = useCallback(() => {
    if (isPopping) return
    setIsPopping(true)
    const { emojis } = SETS[setIdx % SETS.length]
    const burst: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const baseAngle = (i / PARTICLE_COUNT) * Math.PI * 2
      const jitter    = (Math.random() - 0.5) * ((Math.PI * 2) / PARTICLE_COUNT) * 0.8
      return {
        id: uid++, emoji: emojis[Math.floor(Math.random() * emojis.length)],
        angle: baseAngle + jitter, distance: 85 + Math.random() * 95,
        rotation: (Math.random() - 0.5) * 640, size: 1.4 + Math.random() * 0.9,
        duration: 0.55 + Math.random() * 0.25,
      }
    })
    setParticles(burst)
    setSetIdx(prev => prev + 1)
    setTimeout(() => { setParticles([]); setIsPopping(false) }, 850)
  }, [setIdx, isPopping])

  return (
    <div className="flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950">
      <div className="relative flex items-center justify-center">
        <AnimatePresence>
          {particles.map(p => <EmojiParticle key={p.id} p={p} />)}
        </AnimatePresence>
        <motion.button
          onClick={explode}
          whileHover={{ scale:1.06 }} whileTap={{ scale:0.88 }}
          transition={{ type:'spring', stiffness:420, damping:18 }}
          className="relative z-10 cursor-pointer rounded-full px-14 py-4 text-xl font-bold text-white select-none"
          style={{ background:currentSet.bg, boxShadow:\`0 8px 32px \${currentSet.shadow},0 2px 8px rgba(0,0,0,0.3)\`, letterSpacing:'-0.01em' }}
        >
          <AnimatePresence mode="wait">
            <motion.span key={setIdx} className="block"
              initial={{ opacity:0, y:-8, filter:'blur(4px)' }}
              animate={{ opacity:1, y:0,  filter:'blur(0px)' }}
              exit={{    opacity:0, y:8,   filter:'blur(4px)' }}
              transition={{ type:'spring', duration:0.35, bounce:0 }}
            >{currentSet.label}</motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  )
}`,
    prompts: emojiBurstPrompts,
  },
  {
    slug: 'glass-navbar',
    image: 'https://ik.imagekit.io/aitoolkit/glass-navbar.png',
    name: 'Glass Navbar',
    description: "Frosted glass navigation bar with animated active tab indicator, ambient color blobs, and spring-physics entrance.",
    tags: [
      { label: 'Navigation', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassNavbar,
    code: GLASSNAVBAR_CODE,
    prompts: glassNavbarPrompts,
  },
  {
    slug: 'glass-tab-bar',
    image: 'https://ik.imagekit.io/aitoolkit/glass-tab-bar.png',
    name: 'Glass Tab Bar',
    description: "Frosted glass pill tab bar with a sliding active indicator. Edge tabs snap flush to the container wall.",
    tags: [
      { label: 'Navigation', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Mobile' },
    ],
    PreviewComponent: GlassTabBar,
    code: GLASSTABBAR_CODE,
    prompts: glassTabBarPrompts,
  },
  {
    slug: 'glass-tags',
    image: 'https://ik.imagekit.io/aitoolkit/glass-tags.png',
    name: 'Glass Tags',
    description: "Selectable pill-shaped tags with glass surfaces, unique color accents, and spring-animated check marks.",
    tags: [
      { label: 'Notifications', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassTags,
    code: GLASSTAGS_CODE,
    prompts: glassTagsPrompts,
  },
  {
    slug: 'glass-card',
    image: 'https://ik.imagekit.io/aitoolkit/glass-card.png?updatedAt=1775460137',
    name: 'Glass Card',
    description: "Content cards with 3D tilt-on-hover powered by spring physics and cursor-following glare highlight.",
    tags: [
      { label: 'Cards & Modals', accent: true },
      { label: 'Glass', accent: true },
      { label: '3D' },
    ],
    PreviewComponent: GlassCard,
    code: GLASSCARD_CODE,
    prompts: glassCardPrompts,
  },
  {
    slug: 'glass-modal',
    image: 'https://ik.imagekit.io/aitoolkit/glass-modal.png',
    name: 'Glass Modal',
    description: "Centered dialog with deep glass blur, scale-spring entrance, and staggered content reveal.",
    tags: [
      { label: 'Cards & Modals', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassModal,
    code: GLASSMODAL_CODE,
    prompts: glassModalPrompts,
  },
  {
    slug: 'glass-dock',
    name: 'Glass Dock',
    description: "macOS-style dock with cursor-proximity magnification. Icons scale with spring physics as the mouse approaches.",
    image: 'https://ik.imagekit.io/aitoolkit/glass-dock.png?updatedAt=1775599200',
    tags: [
      { label: 'Navigation', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassDock,
    code: GLASSDOCK_CODE,
    prompts: glassDockPrompts,
  },
  {
    slug: 'glass-slider',
    name: 'Glass Slider',
    description: "Range sliders with glass tracks, glowing colored fills, and spring-animated thumbs that scale on drag.",
    image: 'https://ik.imagekit.io/aitoolkit/glass-slider.png',
    tags: [
      { label: 'Inputs & Controls', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassSlider,
    code: GLASSSLIDER_CODE,
    prompts: glassSliderPrompts,
  },
  {
    slug: 'glass-toggle',
    name: 'Glass Toggle',
    description: "On/off toggles with glass housing and liquid-feel spring animation. Track color transitions smoothly.",
    tags: [
      { label: 'Buttons & Toggles', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    image: 'https://ik.imagekit.io/aitoolkit/glass-toggle.png',
    PreviewComponent: GlassToggle,
    code: GLASSTOGGLE_CODE,
    prompts: glassTogglePrompts,
  },
  {
    slug: 'glass-music-player',
    image: 'https://ik.imagekit.io/aitoolkit/glass-music-player.png',
    name: 'Glass Music Player',
    description: "Mini music player with glass surface, spinning vinyl art, animated progress bar, and ambient glow.",
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassMusicPlayer,
    code: GLASSMUSICPLAYER_CODE,
    prompts: glassMusicPlayerPrompts,
  },
  {
    slug: 'glass-notification',
    image: 'https://ik.imagekit.io/aitoolkit/glass-notification.png',
    name: 'Glass Notifications',
    description: "Swipe-to-dismiss notification stack with glass cards and spring-animated layout transitions.",
    tags: [
      { label: 'Notifications', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassNotification,
    code: GLASSNOTIFICATION_CODE,
    prompts: glassNotificationPrompts,
  },
  {
    slug: 'glass-sidebar',
    image: 'https://ik.imagekit.io/aitoolkit/glass-sidebar.png?updatedAt=1775460137',
    name: 'Glass Sidebar',
    description: 'A collapsible glassmorphism sidebar with icon-only and expanded label states.',
    tags: [
      { label: 'Navigation', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Framer Motion' },
    ],
    PreviewComponent: GlassSidebar,
    code: GLASS_SIDEBAR_CODE,
    prompts: glassSidebarPrompts,
  },
  {
    slug: 'glass-user-menu',
    name: 'Glass User Menu',
    description: 'Frosted glass user avatar trigger with animated dropdown, grouped menu items, and Log Out.',
    image: 'https://ik.imagekit.io/aitoolkit/glass-user-menu.png',
    tags: [
      { label: 'Navigation', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassUserMenu,
    code: GLASS_USER_MENU_CODE,
    prompts: glassUserMenuPrompts,
  },
  {
    slug: 'glass-toast',
    name: 'Glass Toast',
    description: 'Frosted glassmorphism toast notification stack with 4 variants, auto-dismiss progress bar, and spring-animated stacking.',
    image: 'https://ik.imagekit.io/aitoolkit/glass-toast.png?updatedAt=1775460137',
    tags: [
      { label: 'Notifications', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassToast,
    code: GLASS_TOAST_CODE,
    prompts: glassToastPrompts,
  },
  {
    slug: 'glass-search-bar',
    name: 'Glass Search Bar',
    description: 'Glassmorphism search bar with animated suggestion dropdown, active state glow, and reduced-motion support.',
    image: 'https://ik.imagekit.io/aitoolkit/glass-search-bar.png?updatedAt=1775460137',
    tags: [
      { label: 'Inputs & Controls', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassSearchBar,
    code: GLASS_SEARCH_BAR_CODE,
    prompts: glassSearchBarPrompts,
  },
  {
    slug: 'glass-stepper',
    name: 'Glass Stepper',
    description: 'Glassmorphism numeric stepper with spring number flip, notification-style tinted buttons, and configurable min/max/step.',
    image: 'https://ik.imagekit.io/aitoolkit/glass-stepper.png',
    tags: [
      { label: 'Inputs & Controls', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassStepper,
    code: GLASS_STEPPER_CODE,
    prompts: glassStepperPrompts,
  },
  {
    slug: 'glass-progress',
    name: 'Glass Progress',
    description: 'Glassmorphism progress bar panel with glowing gradient fills, spring-animated counters, staggered reveal, and replay button.',
    image: 'https://ik.imagekit.io/aitoolkit/glass-progress.png',
    tags: [
      { label: 'Widgets', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassProgress,
    code: GLASS_PROGRESS_CODE,
    prompts: glassProgressPrompts,
  },
  {
    slug: 'glass-ai-compose',
    name: 'Glass AI Chat',
    description: 'Glassmorphism AI chat input with image upload, web search toggle, and model switcher.',
    image: 'https://ik.imagekit.io/aitoolkit/glass-ai-compose.png',
    tags: [
      { label: 'AI', accent: true },
      { label: 'Glass', accent: true },
      { label: 'Interactive' },
    ],
    PreviewComponent: GlassAiCompose,
    code: GLASS_AI_COMPOSE_CODE,
    prompts: glassAiComposePrompts,
  },
]

// ─── Helper ───────────────────────────────────────────────────────────────────

export function getComponent(slug: string): ComponentEntry | undefined {
  return COMPONENTS.find((c) => c.slug === slug)
}
