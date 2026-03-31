import type { ComponentType } from 'react'
import type { Tag, Platform } from '../components/ComponentCard'
import { AnimatedPreview } from '../components/AnimatedPreview'
import { TextBlurReveal } from '../components/TextBlurReveal'
import { ParticleSphere } from '../components/ParticleSphere'
import { TextLayoutCard } from '../components/TextLayoutCard'
import { PixelRabbit } from '../components/PixelRabbit'
import { PolaroidStack } from '../../components-workspace/polaroid-stack'
import { prompts as polaroidStackPrompts } from '../../components-workspace/polaroid-stack/prompts'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ComponentEntry {
  slug: string
  name: string
  description: string
  tags: Tag[]
  PreviewComponent: ComponentType
  code: string
  prompts: Record<Platform, string>
}

// ─── Code strings ─────────────────────────────────────────────────────────────

const PIXEL_RABBIT_CODE = `'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'

// 0=transparent  1=blue  2=yellow  3=white  4=red  5=green
const RABBIT = [
  [0,0,1,1,0,0,1,1,0,0], [0,0,1,2,0,0,1,2,0,0],
  [0,0,1,2,0,0,1,2,0,0], [0,0,1,1,0,0,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,0], [0,1,3,1,1,1,1,3,1,0],
  [0,1,1,1,4,1,1,1,1,0], [5,5,5,5,5,5,5,5,5,0],
  [1,1,1,1,1,1,1,1,1,3], [0,1,1,1,1,1,1,1,1,0],
  [0,1,1,0,0,0,0,1,1,0],
]
const EAR_ROWS = 4, PX = 7, RABBIT_W = 70, RABBIT_H = 77
const C: Record<number, string> = {
  0: 'transparent', 1: '#3b82f6', 2: '#facc15',
  3: '#f8fafc',     4: '#ef4444', 5: '#22c55e',
}

const POEM =
  'In morning light the rabbit wakes, his pink nose twitching as day breaks. ' +
  'He hops through grass on silent feet, each dewy blade a fresh-smelled treat. ' +
  'With floppy ears that catch the breeze, he nibbles clover, takes his ease. ' +
  'The golden eggs are tucked away in nests of green on Easter day.'

const FONT = '12px "Courier New"', LINE_H = 20, PAD = 14
const LEFT_X = 100, REST_Y = 60

export function PixelRabbit() {
  const x = useMotionValue(LEFT_X), y = useMotionValue(REST_Y)
  const earRot = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let alive = true
    const unsubs: Array<() => void> = []

    import('@chenglou/pretext').then(({ prepareWithSegments, layoutNextLine }) => {
      if (!alive) return
      const cw      = containerRef.current?.clientWidth ?? 480
      const RIGHT_X = cw - RABBIT_W - PAD
      const prepared = prepareWithSegments(POEM, FONT)

      function render(rx: number, ry: number) {
        if (!textRef.current || !alive) return
        const rbY = ry - PAD
        let cursor = { segmentIndex: 0, graphemeIndex: 0 }, lineY = 0
        const html: string[] = []
        while (lineY < 600) {
          const overlaps = lineY < rbY + RABBIT_H && lineY + LINE_H > rbY
          const maxW = overlaps ? Math.max(50, rx - PAD) : cw - PAD * 2
          const line = layoutNextLine(prepared, cursor, maxW)
          if (!line) break
          html.push(\`<div style="position:absolute;top:\${lineY}px;left:0;font:\${FONT};color:#71717a;white-space:nowrap">\${line.text}</div>\`)
          cursor = line.end; lineY += LINE_H
        }
        textRef.current.innerHTML = html.join('')
      }

      render(LEFT_X, REST_Y)
      unsubs.push(
        x.on('change', v => render(v, y.get())),
        y.on('change', v => render(x.get(), v)),
      )

      async function hop(n = 2) {
        for (let i = 0; i < n; i++) {
          if (!alive) return
          await animate(y, [REST_Y, REST_Y - 28, REST_Y], { duration: 0.42, ease: [0.4,0,0.2,1] })
        }
      }
      async function walk(toX: number) {
        if (!alive) return
        const yKf = [REST_Y,REST_Y-11,REST_Y,REST_Y-11,REST_Y,REST_Y-11,REST_Y,REST_Y-11,REST_Y]
        await Promise.all([
          animate(x, toX, { duration: 1.7, ease: 'linear' }),
          animate(y, yKf,  { duration: 1.7 }),
        ])
      }
      async function wiggle() {
        if (!alive) return
        await animate(earRot, [-11,11,-7,7,-3,3,0], { duration: 1.3 })
        if (alive) await new Promise<void>(r => setTimeout(r, 280))
      }
      async function loop() {
        if (!alive) return
        await hop(2);       if (!alive) return
        await walk(RIGHT_X); if (!alive) return
        await hop(1);       if (!alive) return
        await wiggle();     if (!alive) return
        await walk(LEFT_X); if (!alive) return
        await wiggle();     if (!alive) return
        await new Promise<void>(r => setTimeout(r, 200))
        if (alive) loop()
      }
      loop()
    })
    return () => { alive = false; unsubs.forEach(fn => fn()) }
  }, [])

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
      <div ref={textRef} className="pointer-events-none absolute"
           style={{ top: PAD, left: PAD, right: 0, bottom: 0 }} />
      <motion.div style={{ x, y }} className="absolute z-10">
        <motion.div style={{ rotate: earRot, transformOrigin: '50% 100%' }}>
          {RABBIT.slice(0, EAR_ROWS).map((row, ri) => (
            <div key={ri} style={{ display: 'flex' }}>
              {row.map((cell, ci) => (
                <div key={ci} style={{ width: PX, height: PX, background: C[cell] }} />
              ))}
            </div>
          ))}
        </motion.div>
        <div>
          {RABBIT.slice(EAR_ROWS).map((row, ri) => (
            <div key={ri} style={{ display: 'flex' }}>
              {row.map((cell, ci) => (
                <div key={ci} style={{ width: PX, height: PX, background: C[cell] }} />
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}`

const FLOATING_CARDS_CODE = `'use client'

import { motion } from 'framer-motion'

const CARDS = [
  { label: 'Components', value: '2,847', symbol: '◈', delay: 0 },
  { label: 'Downloads',  value: '94.2k', symbol: '↓', delay: 0.2 },
  { label: 'Stars',      value: '12.1k', symbol: '★', delay: 0.4 },
]

export function FloatingCards() {
  return (
    <div className="relative flex h-full w-full items-center
                    justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0
                      flex items-center justify-center">
        <div className="h-56 w-56 rounded-full bg-violet-600/25 blur-3xl" />
      </div>

      <div className="relative flex items-end gap-4">
        {CARDS.map((card) => (
          <motion.div
            key={card.label}
            animate={{ y: [0, -14, 0] }}
            transition={{
              duration: 3.5,
              delay: card.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex flex-col items-center gap-2 rounded-2xl
                       border border-white/10 bg-white/5 px-6 py-5
                       backdrop-blur-sm"
          >
            <span className="text-2xl text-violet-400">{card.symbol}</span>
            <span className="text-xl font-bold text-white">{card.value}</span>
            <span className="text-xs text-zinc-500">{card.label}</span>
          </motion.div>
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

// ─── Registry ─────────────────────────────────────────────────────────────────

export const COMPONENTS: ComponentEntry[] = [
  {
    slug: 'easter-rabbit',
    name: 'Easter Rabbit',
    description:
      'A pixel-art rabbit that hops and walks across the screen while an Easter poem reflows around it in real time using Pretext.',
    tags: [
      { label: 'Animation', accent: true },
      { label: 'Framer Motion' },
      { label: '@chenglou/pretext' },
    ],
    PreviewComponent: PixelRabbit,
    code: PIXEL_RABBIT_CODE,
    prompts: {
      V0: `Create a PixelRabbit component using React, Framer Motion, and @chenglou/pretext (npm install @chenglou/pretext).

Pixel art: 10×11 grid at 7px/cell from colored divs. Colors — 1:blue #3b82f6, 2:yellow #facc15, 3:white #f8fafc, 4:red #ef4444, 5:green #22c55e. Ears are rows 0-3 in a separate motion.div (transformOrigin:'50% 100%') so they rotate independently.

Animation loop (pure MotionValues, no React re-renders):
1. Hop ×2: animate y keyframes [REST_Y, REST_Y-28, REST_Y], 0.42s
2. Walk right: animate x linear to RIGHT_X + y bounces 4 micro-hops, 1.7s
3. Hop ×1, then wiggle: animate earRot [-11, 11, -7, 7, -3, 3, 0]
4. Walk left back, wiggle again → loop

Text reflow: join poem into one paragraph. Call prepareWithSegments(poem, '12px "Courier New"') once on mount inside dynamic import. On every x/y change, call layoutNextLine() per line. Check overlap: lineY < (ry-PAD)+RABBIT_H && lineY+LINE_H > (ry-PAD). When overlapping, maxWidth = Math.max(50, rx-PAD) — text stops at rabbit's left edge. Lines above and below use full width. Direct innerHTML writes to a ref, no React re-renders. Dark bg-[#0a0a0a] background.`,

      Bolt: `Add a PixelRabbit component. Stack: React 19, TypeScript, Framer Motion, @chenglou/pretext.

Pixel art: 11-row × 10-col grid, PX=7, RABBIT_W=70, RABBIT_H=77.
Colors: {0:'transparent',1:'#3b82f6',2:'#facc15',3:'#f8fafc',4:'#ef4444',5:'#22c55e'}
EAR_ROWS=4 — first 4 rows in motion.div with earRot MotionValue (transformOrigin:'50% 100%')

Motion values: x=useMotionValue(100), y=useMotionValue(60), earRot=useMotionValue(0)

useEffect deps=[]:
- Dynamic import('@chenglou/pretext') with alive guard
- cw = containerRef.current.clientWidth, RIGHT_X = cw - 70 - 14
- prepared = prepareWithSegments(POEM, '12px "Courier New"')
- render(rx, ry): rbY=ry-14, loop layoutNextLine with maxW=overlaps?Math.max(50,rx-14):cw-28; write innerHTML
- x.on + y.on subscribe to render; cleanup unsubs on return
- hop(n), walk(toX), wiggle() helpers → loop: hop(2)→walk(RIGHT_X)→hop(1)→wiggle→walk(100)→wiggle→repeat`,

      Lovable: `Build a pixel art Easter rabbit that hops and walks across the screen while an Easter poem wraps around it in real time.

THE RABBIT: 11 rows × 10 columns of colored divs at 7px each — blue body, yellow ear insides, white eyes and tail, red nose, green collar. Split top 4 rows into a separate element so ears can wiggle independently.

THE ANIMATION: Loop forever with Framer Motion MotionValues — hop twice in place, walk right while y-bounces, hop and wiggle ears (rotateZ back and forth), walk left, wiggle again. All pure MotionValues, no setState.

THE TEXT REFLOW: Write an Easter poem as a single paragraph. Use @chenglou/pretext (prepareWithSegments + layoutNextLine) to reflow it around the rabbit every frame. Lines in the same vertical band as the rabbit get a shorter maxWidth — text stops at the rabbit's left edge. Lines above and below use full width. Direct innerHTML writes to a ref, no React re-renders. Dark #0a0a0a background.`,

      'Claude Code': `Create app/components/PixelRabbit.tsx. Export a PixelRabbit React client component.

Install: npm install @chenglou/pretext

Constants:
  RABBIT: 11×10 grid (see component for array)
  EAR_ROWS=4, PX=7, RABBIT_W=70, RABBIT_H=77
  C: Record<number,string> = {0:'transparent',1:'#3b82f6',2:'#facc15',3:'#f8fafc',4:'#ef4444',5:'#22c55e'}
  POEM_TEXT = single paragraph Easter poem
  FONT='12px "Courier New"', LINE_H=20, PAD=14, LEFT_X=100, REST_Y=60

Motion values: x=useMotionValue(LEFT_X), y=useMotionValue(REST_Y), earRot=useMotionValue(0)
Refs: containerRef (measure width), textRef (poem DOM writes)

useEffect deps=[]:
  1. Dynamic import('@chenglou/pretext') with alive flag
  2. RIGHT_X = containerWidth - RABBIT_W - PAD
  3. prepared = prepareWithSegments(POEM_TEXT, FONT)
  4. render(rx, ry):
       rbTextY = ry - PAD
       loop layoutNextLine(prepared, cursor, maxW):
         overlaps = lineY < rbTextY+RABBIT_H && lineY+LINE_H > rbTextY
         maxW = overlaps ? Math.max(50, rx-PAD) : containerWidth-PAD*2
       textRef.current.innerHTML = html lines
  5. x.on('change') + y.on('change') → render
  6. hop(n), walk(toX), wiggle(), loop() animation sequence
  Cleanup: alive=false + unsubs.forEach(fn=>fn())

JSX: relative container → absolute text div (top/left=PAD) → absolute motion.div(x,y) → ears motion.div(rotate=earRot) + body div`,

      Cursor: `Add a PixelRabbit component to this codebase.

File: app/components/PixelRabbit.tsx
Install: npm install @chenglou/pretext
Stack: React 19, TypeScript, Framer Motion, @chenglou/pretext

Pixel art grid (11×10, PX=7px):
  0=transparent, 1=#3b82f6(blue), 2=#facc15(yellow), 3=#f8fafc(white), 4=#ef4444(red), 5=#22c55e(green)
  EAR_ROWS=4 → wrapped in motion.div for rotate animation (transformOrigin: '50% 100%')

Pretext text reflow (core pattern):
  POEM = single paragraph string (no newlines)
  prepared = prepareWithSegments(POEM, '12px "Courier New"') — once in useEffect
  Per frame: layoutNextLine(prepared, cursor, maxW) until null
    rbTextY = rabbitY - PAD
    overlaps = lineY < rbTextY+77 && lineY+20 > rbTextY
    maxW = overlaps ? Math.max(50, rabbitX-14) : containerWidth-28
  Write all lines to textRef.current.innerHTML — no setState

Animation (loop, all MotionValues):
  x=useMotionValue(100), y=useMotionValue(60), earRot=useMotionValue(0)
  hop(n): animate y [60,32,60] × n, 0.42s ease spring
  walk(toX): Promise.all x linear + y bounce [60,49,60,49,60,...], 1.7s
  wiggle(): animate earRot [-11,11,-7,7,-3,3,0], 1.3s
  loop: hop(2)→walk(RIGHT_X)→hop(1)→wiggle→walk(100)→wiggle→repeat`,
    },
  },
  {
    slug: 'floating-cards',
    name: 'Floating Cards',
    description:
      'Three stat cards gently floating up and down with staggered animations and a violet ambient glow.',
    tags: [
      { label: 'Animation', accent: true },
      { label: 'Framer Motion' },
    ],
    PreviewComponent: AnimatedPreview,
    code: FLOATING_CARDS_CODE,
    prompts: {
      V0: `Create a FloatingCards component using React, Framer Motion, and Tailwind CSS. Display 3 stat cards (Components: 2,847 | Downloads: 94.2k | Stars: 12.1k) that continuously float up and down with staggered delays using animate={{ y: [0, -14, 0] }} and repeat: Infinity. Use a dark zinc-950 background, glass morphism cards (bg-white/5, border border-white/10, backdrop-blur-sm, rounded-2xl), and a violet radial glow (bg-violet-600/25 blur-3xl) centered behind the cards. TypeScript only.`,
      Bolt: `Add a FloatingCards component to this project. Stack: React 19, TypeScript, Framer Motion, Tailwind CSS. Each of the 3 cards uses motion.div with animate={{ y: [0, -14, 0] }}, transition duration 3.5s, staggered delays (0, 0.2, 0.4), ease: easeInOut, repeat: Infinity. Cards show: ◈ Components 2,847 | ↓ Downloads 94.2k | ★ Stars 12.1k. Styling: dark bg-zinc-950 background, glass cards (bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl), centered violet glow (bg-violet-600/25 blur-3xl). No extra dependencies beyond framer-motion.`,
      Lovable: `Build me a beautiful floating stats cards component for a dark-themed component marketplace. I want 3 elegant glass cards that gently float up and down using Framer Motion — each showing a different stat: total components (2,847), total downloads (94.2k), and GitHub stars (12.1k). The background should have a dreamy violet glow centered behind the cards. Cards should have a glass morphism look — slightly transparent with a subtle white border. Think Aceternity UI: premium, minimal, and visually stunning. Use Tailwind CSS and TypeScript.`,
      'Claude Code': `Create a new file called FloatingCards.tsx. It should export a React client component named FloatingCards that renders 3 stat cards with continuous floating animations using Framer Motion. Requirements:
- Mark the file with 'use client' at the top
- Import motion from 'framer-motion'
- Define a CARDS array: { label: 'Components', value: '2,847', symbol: '◈', delay: 0 }, { label: 'Downloads', value: '94.2k', symbol: '↓', delay: 0.2 }, { label: 'Stars', value: '12.1k', symbol: '★', delay: 0.4 }
- Each card is a motion.div with animate={{ y: [0, -14, 0] }}, transition { duration: 3.5, delay: card.delay, repeat: Infinity, ease: 'easeInOut' }
- Wrapper: relative flex h-full w-full items-center justify-center overflow-hidden
- Glow: pointer-events-none absolute inset-0 flex items-center justify-center > div h-56 w-56 rounded-full bg-violet-600/25 blur-3xl
- Card className: flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-sm
- Symbol: text-2xl text-violet-400 | Value: text-xl font-bold text-white | Label: text-xs text-zinc-500
TypeScript throughout. No extra dependencies.`,
      Cursor: `Add a FloatingCards component to this codebase.

File: components/FloatingCards.tsx
Stack: React 19, TypeScript, Tailwind CSS, Framer Motion (already installed)

Spec:
- 'use client' at top (Next.js App Router)
- CARDS array: { label, value, symbol: string, delay: number }
  · Components · 2,847 · ◈ · 0
  · Downloads  · 94.2k · ↓ · 0.2
  · Stars       · 12.1k · ★ · 0.4
- motion.div per card: animate={{ y: [0,-14,0] }}, duration 3.5s, easeInOut, repeat Infinity
- Layout: flex row, items-end, gap-4, centered in full-height container
- Background: bg-zinc-950, centered violet blur h-56 w-56 bg-violet-600/25 blur-3xl
- Cards: bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl px-6 py-5
- Colors: symbol text-violet-400, value text-white font-bold, label text-zinc-500

Import and render <FloatingCards /> in the relevant page.`,
    },
  },
  {
    slug: 'text-blur-reveal',
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
      V0: `Create a TextBlurReveal component using React, Framer Motion, and Tailwind CSS. It animates an array of words into view one by one, each with a blur-to-sharp + slide-up entrance effect. Use initial={{ opacity: 0, y: 22, filter: 'blur(14px)' }} → animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}, stagger delay of 0.1s per word, duration 0.65s, ease [0.21, 0.47, 0.32, 0.98]. Highlight accent words with a from-violet-400 to-indigo-400 gradient. Add a cycle state with useEffect to auto-replay every ~3.7s. Include an animated ↺ Replay button that appears after the animation finishes. TypeScript only.`,
      Bolt: `Add a TextBlurReveal component. Stack: React 19, TypeScript, Framer Motion, Tailwind CSS. Words array: ['Craft','interfaces','that','feel','like','magic.']. Accented word indices: 1, 5. Each word is a motion.span with initial={{ opacity:0, y:22, filter:'blur(14px)' }} animate={{ opacity:1, y:0, filter:'blur(0px)' }} transition={{ duration:0.65, delay: i*0.1, ease:[0.21,0.47,0.32,0.98] }}. Key each span with \`\${cycle}-\${i}\` so it re-animates on replay. Use a cycle state + useEffect pair: t1=setTimeout(showReplayButton,1500), t2=setTimeout(incrementCycle,3650). Gradient accent: from-violet-400 to-indigo-400 bg-clip-text text-transparent. Button uses AnimatePresence for fade.`,
      Lovable: `Build a stunning text reveal animation for a dark-themed UI. The words 'Craft interfaces that feel like magic.' should animate in one by one — each word blurring from fuzzy to sharp while gently sliding up, staggered 0.1s apart. The words 'interfaces' and 'magic.' should glow with a violet-to-indigo gradient. After the full phrase appears, pause for a moment, then auto-replay. Show a small ↺ Replay button after the animation completes so users can trigger it manually. Think Vercel or Linear homepage energy — clean, fast, and premium. Framer Motion + Tailwind CSS + TypeScript.`,
      'Claude Code': `Create a new file called TextBlurReveal.tsx that exports a React client component. It should animate an array of words into view with a blur + slide-up effect, staggered per word.

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
      Cursor: `Add a TextBlurReveal component to this codebase.

File: components/TextBlurReveal.tsx
Stack: React 19, TypeScript, Tailwind CSS, Framer Motion (already installed)

Spec:
- 'use client' directive (Next.js App Router)
- WORDS: ['Craft', 'interfaces', 'that', 'feel', 'like', 'magic.']
- Accented indices: 1 ('interfaces'), 5 ('magic.') → violet-to-indigo gradient
- State: cycle: number (replay counter), showReplay: boolean
- useEffect([cycle]):
    clearTimeout on unmount
    t1 = 1500ms → setShowReplay(true)
    t2 = 3650ms → setCycle(c + 1)
- Per-word: motion.span, key=\`\${cycle}-\${i}\`, stagger delay i*0.1s
    initial: opacity 0, y 22, filter blur(14px)
    animate: opacity 1, y 0, filter blur(0px)
    ease: [0.21, 0.47, 0.32, 0.98], duration 0.65s
- Replay button wrapped in AnimatePresence, fades in at showReplay=true
- Layout: flex-col items-center gap-5

After creating the file, render <TextBlurReveal /> in the appropriate page.`,
    },
  },
  {
    slug: 'particle-sphere',
    name: 'Particle Sphere',
    description:
      '9,000 particles arranged on a sphere with warm gold and cool silver tones, slowly spinning in Three.js.',
    tags: [
      { label: '3D / WebGL', accent: true },
      { label: 'Three.js' },
    ],
    PreviewComponent: ParticleSphere,
    code: PARTICLE_SPHERE_CODE,
    prompts: {
      V0: `Create a ParticleSphere component using React and Three.js. Render 9,000 particles distributed uniformly across a sphere surface using spherical coordinates (theta = acos(2*rand-1), phi = 2π*rand). Add slight radial jitter (r = 1 ± 0.07) for volumetric depth. Color each particle by its normalised Y position: upper hemisphere → warm gold-to-orange (rgb 1.0, 0.55+t*0.37, t*0.63), lower hemisphere → cool white-to-silver (v = 0.38+t*0.62). Use THREE.PointsMaterial with AdditiveBlending, a soft radial glow sprite as the map, and depthWrite: false. Tilt the mesh (rotation.x=0.28, rotation.z=0.08) and animate rotation.y continuously. Black background. TypeScript + 'use client'.`,
      Bolt: `Add a ParticleSphere React component. Stack: React 19, TypeScript, Three.js (install it). Requirements:
- 'use client' directive, useEffect for Three.js init
- Scene: PerspectiveCamera fov 52, position.z 2.9, black background
- 9000 particles on sphere surface: theta = acos(2*rand-1), phi = 2π*rand, r = 1 ± 0.07
- Colors by normalised y: y≥0 → [1.0, 0.55+ny*0.37, ny*0.63] (gold/orange); y<0 → v=0.38+(-ny)*0.62, [v,v,v+(1+ny)*0.07] (white/silver)
- Glow sprite: 64×64 canvas radial gradient white→transparent
- PointsMaterial: size 0.032, vertexColors, transparent, depthWrite false, AdditiveBlending
- Tilt: mesh.rotation.x=0.28, rotation.z=0.08
- Animate: rotation.y += 0.004/frame, gentle z wobble via sin
- Proper cleanup: cancelAnimationFrame + dispose all Three.js objects`,
      Lovable: `Build a stunning 3D rotating particle sphere for a dark-themed component showcase. I want ~9,000 tiny glowing particles arranged on a sphere that slowly rotates. The top hemisphere should glow in warm gold and amber tones, and the bottom should be cool white and silver — creating a beautiful dual-tone glowing orb. Use Three.js with additive blending so overlapping particles create a natural glow effect at the poles. Add a slight tilt so the two glowing poles are offset from vertical, like the reference image. The rotation should feel smooth and mesmerising. React + TypeScript + Three.js.`,
      'Claude Code': `Create a new file called ParticleSphere.tsx. It should export a React client component that renders an animated 3D particle sphere using Three.js.

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
      Cursor: `Add a ParticleSphere component to this codebase.

File: components/ParticleSphere.tsx
Dependencies: three (npm install three @types/three)
Stack: React 19, TypeScript, Three.js

Spec:
- 'use client' (Next.js App Router)
- containerRef = useRef<HTMLDivElement>(null)
- useEffect: all Three.js code inside (avoids SSR issues)

Three.js setup:
  scene, PerspectiveCamera(52, W/H, 0.1, 100), camera.z=2.9
  WebGLRenderer antialias:true, setClearColor(0x000000), pixelRatio min(dpr,2)
  append renderer.domElement to container div

Particle geometry (N=9000):
  theta = acos(2*rand-1), phi = 2π*rand, r = 1 ± 0.07 jitter
  position: spherical → cartesian
  color by normalised y (y/r):
    ≥0: [1.0,  0.55+ny*0.37,  ny*0.63]          // gold→white
    <0: v=0.38+(-ny)*0.62, [v, v, v+(1+ny)*0.07] // silver→white

Glow sprite: 64px canvas radialGradient white(1)→white(0.8)→white(0.25)→transparent

PointsMaterial: size 0.032, vertexColors, transparent, depthWrite false,
                blending THREE.AdditiveBlending, map=sprite

Mesh tilt: rotation.x=0.28, rotation.z=0.08
RAF loop: t+=0.004/frame, rotation.y=t, rotation.z=0.08+sin(t*0.4)*0.04

Cleanup: cancelAnimationFrame + dispose all Three.js objects + removeChild`,
    },
  },
  {
    slug: 'polaroid-stack',
    name: 'Polaroid Stack',
    description:
      'Five polaroid photo cards stacked in a casual pile — click to fan them out in a spring-animated arc, hover to lift, click a card to spotlight it.',
    tags: [
      { label: 'Interactive', accent: true },
      { label: 'Framer Motion' },
    ],
    PreviewComponent: PolaroidStack,
    code: POLAROID_STACK_CODE,
    prompts: polaroidStackPrompts,
  },
  {
    slug: 'text-layout',
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
      Bolt: `Add a TextLayout component that showcases @chenglou/pretext for zero-reflow text measurement.

npm install @chenglou/pretext

Stack: React 19, TypeScript, Framer Motion, Tailwind CSS, @chenglou/pretext

Implementation:
- 'use client' directive (Next.js App Router)
- Dynamic import inside useEffect to keep prepare() browser-only
- const FONT = '14px "Courier New"' (must match CSS exactly)
- const LINE_H = 22 (must match CSS line-height exactly)
- useMotionValue(160) for animated width
- animate(motionWidth, [160, 320, 160], { duration: 5, ease: 'easeInOut', repeat: Infinity })
- prepareWithSegments(TEXT, FONT) — one-time call, returns PreparedTextWithSegments
- layoutWithLines(prepared, Math.round(w), LINE_H) — called every frame via motionWidth.on('change', ...)
- Returns { height, lineCount, lines: LayoutLine[] } — each line has .text and .width
- Update DOM refs directly (no setState) to avoid React re-renders at 60fps
- useTransform(motionWidth, [160, 320], ['0%', '100%']) for progress bar
- AnimationPlaybackControls type from framer-motion for controls.stop()
- Cleanup: unsub() + controls.stop() in useEffect return`,
      Lovable: `Build an animated text layout demo that showcases the @chenglou/pretext library. Here's what it should look like and do:

Install: npm install @chenglou/pretext

Left side: A text box (monospace font, dark background) whose width smoothly animates back and forth between narrow and wide using Framer Motion. The text naturally reflows as the width changes — just like CSS does.

Right side: A live panel labelled "pretext output" that shows, in real time:
- Each measured line of text as a horizontal amber bar, with its fill proportion = line width / container width
- The actual line text below each bar (e.g. "Pretext computes wrap")
- A stats row at the bottom: height in px and line count

The magic: Pretext calculates all this via canvas (prepareWithSegments + layoutWithLines) without ever touching the DOM or triggering layout reflow. The layout call takes ~0.09ms, fast enough to run every animation frame.

Use amber color (#fbbf24) for the Pretext output values to visually distinguish measured data from rendered text. Dark theme throughout (zinc-950 bg).`,
      'Claude Code': `Create app/components/TextLayout.tsx demonstrating @chenglou/pretext for zero-reflow text measurement.

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
      Cursor: `Add a TextLayout component to this project.

File: app/components/TextLayout.tsx
Install: npm install @chenglou/pretext
Stack: React 19, TypeScript, Framer Motion, @chenglou/pretext

Core concept: prepareWithSegments() does one expensive canvas measurement pass.
layoutWithLines() is the ~0.09ms hot path — called every animation frame.
Both must use matching font/lineHeight with the CSS rendering.

Spec:

Constants:
  TEXT    = any paragraph string
  FONT    = '14px "Courier New"'  ← must match CSS font shorthand
  LINE_H  = 22                    ← must match CSS line-height
  W_MIN   = 160, W_MAX = 320

State / refs:
  motionWidth = useMotionValue(W_MIN)
  widthRef, heightRef, lineCountRef, linesListRef = useRef<HTMLSpanElement/HTMLDivElement>

useEffect([motionWidth]):
  Import '@chenglou/pretext' dynamically (SSR guard)
  prepared = prepareWithSegments(TEXT, FONT)
  flush(w: number):
    { height, lineCount, lines } = layoutWithLines(prepared, round(w), LINE_H)
    Write height/lineCount to DOM refs directly
    Write linesListRef.innerHTML = lines.map(l => bar + text html).join('')
  flush(W_MIN) → initial render
  unsub = motionWidth.on('change', flush)
  controls = animate(motionWidth, [W_MIN,W_MAX,W_MIN], { duration:5, repeat:Infinity, ease:'easeInOut' })
  cleanup: unsub() + controls.stop()

JSX:
  Left col: motion.div style={{ width:motionWidth, fontFamily:'"Courier New",monospace',
            fontSize:'14px', lineHeight:'22px' }} containing TEXT
  Progress: motion.div style={{ width: useTransform(motionWidth,[W_MIN,W_MAX],['0%','100%']) }}
  Right col: div ref={linesListRef} + stats footer

After creating, import <TextLayout /> and add to the cards array in page.tsx.`,
    },
  },
]

// ─── Helper ───────────────────────────────────────────────────────────────────

export function getComponent(slug: string): ComponentEntry | undefined {
  return COMPONENTS.find((c) => c.slug === slug)
}
