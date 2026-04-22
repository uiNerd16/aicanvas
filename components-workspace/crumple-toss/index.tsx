'use client'

// npm install framer-motion matter-js
// types: npm install -D @types/matter-js

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, animate as fmAnimate, useMotionValue } from 'framer-motion'
import type { Engine, Runner, World, Body } from 'matter-js'

// ─── Config ──────────────────────────────────────────────────────────────────
const MESSAGES: string[] = [
  'Hey\u2026 u up? Been thinking about us.',
  'We need to talk.',
  "Miss you. Don't reply.",
  'It was never nothing.',
  "Call me when you're ready.",
]

type Mode = 'idle' | 'crumpling' | 'tossing' | 'saving'

// Layout in SVG user units. The SVG viewBox scales to container width.
const SCENE_W = 420
const SCENE_H = 520

// Paper rectangle geometry (its centered within the scene).
const PAPER_W = 280
const PAPER_H = 340
const PAPER_CX = SCENE_W / 2
const PAPER_CY = 220

// Paper corners in absolute scene coordinates.
const PX0 = PAPER_CX - PAPER_W / 2
const PY0 = PAPER_CY - PAPER_H / 2
const PX1 = PAPER_CX + PAPER_W / 2
const PY1 = PAPER_CY + PAPER_H / 2

// Ball ends up near the paper center; will be overridden at launch time to
// the paper's visual center.
const BALL_RADIUS = 44

// Mesh resolution
const MESH_COLS = 10
const MESH_ROWS = 12
const MESH_VERT_COLS = MESH_COLS + 1
const MESH_VERT_ROWS = MESH_ROWS + 1
const MESH_VERT_COUNT = MESH_VERT_COLS * MESH_VERT_ROWS

// ─── Types ───────────────────────────────────────────────────────────────────
interface Vertex {
  x: number
  y: number
  z: number
  tu: number
  tv: number
}

// ─── Deterministic jitter ────────────────────────────────────────────────────
function sj(seed: number, amp: number): number {
  const s = Math.sin(seed * 12.9898) * 43758.5453
  return (s - Math.floor(s) - 0.5) * 2 * amp
}

// ─── Mesh state builders ─────────────────────────────────────────────────────
// Each builder returns a length-MESH_VERT_COUNT array of {x,y,z} in scene space.

function vertIndex(i: number, j: number): number {
  return j * MESH_VERT_COLS + i
}

function flatMesh(): { x: number; y: number; z: number }[] {
  const out: { x: number; y: number; z: number }[] = new Array(MESH_VERT_COUNT)
  for (let j = 0; j < MESH_VERT_ROWS; j++) {
    for (let i = 0; i < MESH_VERT_COLS; i++) {
      const u = i / MESH_COLS
      const v = j / MESH_ROWS
      out[vertIndex(i, j)] = {
        x: PX0 + u * PAPER_W,
        y: PY0 + v * PAPER_H,
        z: 0,
      }
    }
  }
  return out
}

// State A — corners folding. Push 4 corners inward, pull neighbors slightly.
function stateA(): { x: number; y: number; z: number }[] {
  const base = flatMesh()
  const corners: [number, number, number, number][] = [
    // [i, j, dirX, dirY] — direction toward center
    [0, 0, 1, 1],
    [MESH_COLS, 0, -1, 1],
    [0, MESH_ROWS, 1, -1],
    [MESH_COLS, MESH_ROWS, -1, -1],
  ]
  for (const [ci, cj, dx, dy] of corners) {
    const idx = vertIndex(ci, cj)
    base[idx] = {
      x: base[idx].x + dx * 40,
      y: base[idx].y + dy * 40,
      z: 15,
    }
    // Pull neighbors (along edge) slightly
    const neighbors: [number, number][] = [
      [ci + (dx > 0 ? 1 : -1), cj],
      [ci, cj + (dy > 0 ? 1 : -1)],
    ]
    for (const [ni, nj] of neighbors) {
      if (ni < 0 || ni >= MESH_VERT_COLS || nj < 0 || nj >= MESH_VERT_ROWS) continue
      const nIdx = vertIndex(ni, nj)
      base[nIdx] = {
        x: base[nIdx].x + dx * 12,
        y: base[nIdx].y + dy * 12,
        z: 6,
      }
    }
  }
  return base
}

// State B — edges buckling. Edge vertices z rises, inner starts to bunch.
function stateB(): { x: number; y: number; z: number }[] {
  const out: { x: number; y: number; z: number }[] = new Array(MESH_VERT_COUNT)
  for (let j = 0; j < MESH_VERT_ROWS; j++) {
    for (let i = 0; i < MESH_VERT_COLS; i++) {
      const u = i / MESH_COLS
      const v = j / MESH_ROWS
      // distance from nearest edge in normalized [0..0.5]
      const du = Math.min(u, 1 - u)
      const dv = Math.min(v, 1 - v)
      const edgeDist = Math.min(du, dv) // 0 at edge, 0.5 at center
      // Radial pull toward center
      const baseX = PX0 + u * PAPER_W
      const baseY = PY0 + v * PAPER_H
      const dx = PAPER_CX - baseX
      const dy = PAPER_CY - baseY
      // Edges curve inward ~16px, centers pull ~8px toward center
      const inwardAmt = 0.2 * (1 - edgeDist * 2) + 0.15
      // z distortion as a sinusoidal wave of distance from edge (peaks mid paper)
      const zAmt = 25 * Math.sin(edgeDist * 2 * Math.PI)
      const jitterA = sj(i * 3.7 + j * 5.1 + 1.3, 1)
      const jitterB = sj(i * 7.1 + j * 2.9 + 4.7, 1)
      const jitterZ = sj(i * 4.2 + j * 3.3 + 8.9, 1)
      out[vertIndex(i, j)] = {
        x: baseX + dx * inwardAmt + jitterA * 6,
        y: baseY + dy * inwardAmt + jitterB * 6,
        z: zAmt + jitterZ * 10,
      }
    }
  }
  return out
}

// State C — heavy crumple, strong collapse toward center, big z variation.
function stateC(): { x: number; y: number; z: number }[] {
  const out: { x: number; y: number; z: number }[] = new Array(MESH_VERT_COUNT)
  for (let j = 0; j < MESH_VERT_ROWS; j++) {
    for (let i = 0; i < MESH_VERT_COLS; i++) {
      const u = i / MESH_COLS - 0.5
      const v = j / MESH_ROWS - 0.5
      const baseAng = Math.atan2(v, u)
      const baseR = Math.hypot(u, v) // 0..~0.7
      // Collapse: r is bounded to ~60px from center with angular jitter
      const r = baseR * 60 + sj(i * 5.3 + j * 2.1 + 3.3, 12)
      const angJit = sj(i * 2.7 + j * 4.1 + 5.5, 0.6)
      const ang = baseAng + angJit
      const zVal = 15 + sj(i * 6.1 + j * 7.3 + 1.1, 1) * 20 + Math.abs(sj(i * 1.3 + j * 8.7 + 9.9, 1)) * 25
      out[vertIndex(i, j)] = {
        x: PAPER_CX + Math.cos(ang) * r + sj(i * 9.1 + j * 3.9 + 2.2, 6),
        y: PAPER_CY + Math.sin(ang) * r + sj(i * 4.7 + j * 6.3 + 3.8, 6),
        z: zVal,
      }
    }
  }
  return out
}

// State D — ball. Distribute vertices on a sphere around paper center.
function stateD(): { x: number; y: number; z: number }[] {
  const out: { x: number; y: number; z: number }[] = new Array(MESH_VERT_COUNT)
  for (let j = 0; j < MESH_VERT_ROWS; j++) {
    for (let i = 0; i < MESH_VERT_COLS; i++) {
      // Map i,j to spherical coords with seeded jitter
      const u = i / MESH_COLS
      const v = j / MESH_ROWS
      const phi = u * Math.PI * 2 + sj(i * 1.7 + j * 2.3 + 0.5, 0.3)
      const theta = v * Math.PI + sj(i * 3.1 + j * 1.9 + 2.1, 0.25)
      const rJitter = 1 + sj(i * 5.9 + j * 4.7 + 7.3, 0.1)
      const r = BALL_RADIUS * rJitter
      out[vertIndex(i, j)] = {
        x: PAPER_CX + Math.sin(theta) * Math.cos(phi) * r,
        y: PAPER_CY + Math.sin(theta) * Math.sin(phi) * r,
        z: Math.cos(theta) * r,
      }
    }
  }
  return out
}

// Pre-compute (these are deterministic — fine as module-level constants)
const MESH_FLAT = flatMesh()
const MESH_A = stateA()
const MESH_B = stateB()
const MESH_C = stateC()
const MESH_D = stateD()

// UVs — texture coords in pixel space (0..PAPER_W, 0..PAPER_H).
function buildUVs(): { tu: number; tv: number }[] {
  const out: { tu: number; tv: number }[] = new Array(MESH_VERT_COUNT)
  for (let j = 0; j < MESH_VERT_ROWS; j++) {
    for (let i = 0; i < MESH_VERT_COLS; i++) {
      out[vertIndex(i, j)] = {
        tu: (i / MESH_COLS) * PAPER_W,
        tv: (j / MESH_ROWS) * PAPER_H,
      }
    }
  }
  return out
}
const MESH_UVS = buildUVs()

// ─── Mesh interpolation ──────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function interpolateMesh(t: number, out: Vertex[]): void {
  // t in 0..1, split across 4 phases of width 0.25
  let from: { x: number; y: number; z: number }[]
  let to: { x: number; y: number; z: number }[]
  let localT: number
  if (t <= 0.25) {
    from = MESH_FLAT
    to = MESH_A
    localT = t / 0.25
  } else if (t <= 0.5) {
    from = MESH_A
    to = MESH_B
    localT = (t - 0.25) / 0.25
  } else if (t <= 0.75) {
    from = MESH_B
    to = MESH_C
    localT = (t - 0.5) / 0.25
  } else {
    from = MESH_C
    to = MESH_D
    localT = (t - 0.75) / 0.25
  }
  for (let k = 0; k < MESH_VERT_COUNT; k++) {
    const a = from[k]
    const b = to[k]
    const uv = MESH_UVS[k]
    out[k].x = lerp(a.x, b.x, localT)
    out[k].y = lerp(a.y, b.y, localT)
    out[k].z = lerp(a.z, b.z, localT)
    out[k].tu = uv.tu
    out[k].tv = uv.tv
  }
}

// ─── Textured triangle rasterization helper ──────────────────────────────────
function drawTexturedTriangle(
  ctx: CanvasRenderingContext2D,
  tex: HTMLCanvasElement,
  sx: number[],
  sy: number[],
  tx: number[],
  ty: number[],
): void {
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(sx[0], sy[0])
  ctx.lineTo(sx[1], sy[1])
  ctx.lineTo(sx[2], sy[2])
  ctx.closePath()
  ctx.clip()

  const d = (tx[1] - tx[0]) * (ty[2] - ty[0]) - (tx[2] - tx[0]) * (ty[1] - ty[0])
  if (Math.abs(d) < 0.001) {
    ctx.restore()
    return
  }
  const a = ((sx[1] - sx[0]) * (ty[2] - ty[0]) - (sx[2] - sx[0]) * (ty[1] - ty[0])) / d
  const b = ((sx[2] - sx[0]) * (tx[1] - tx[0]) - (sx[1] - sx[0]) * (tx[2] - tx[0])) / d
  const c = sx[0] - a * tx[0] - b * ty[0]
  const e = ((sy[1] - sy[0]) * (ty[2] - ty[0]) - (sy[2] - sy[0]) * (ty[1] - ty[0])) / d
  const f = ((sy[2] - sy[0]) * (tx[1] - tx[0]) - (sy[1] - sy[0]) * (tx[2] - tx[0])) / d
  const g = sy[0] - e * tx[0] - f * ty[0]

  ctx.transform(a, e, b, f, c, g)
  ctx.drawImage(tex, 0, 0)
  ctx.restore()
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CrumpleToss() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const paperCanvasRef = useRef<HTMLCanvasElement>(null)
  const texCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const [mode, setMode] = useState<Mode>('idle')
  const [msgIndex, setMsgIndex] = useState<number>(0)
  const [showCanvas, setShowCanvas] = useState<boolean>(false)

  // Motion values drive the paper wrapper — imperative, no key/initial tricks needed.
  const paperOpacity = useMotionValue(1)
  const paperY = useMotionValue(0)
  const paperScaleY = useMotionValue(1)

  // Refs for physics lifecycle and frame loop; cleaned up on unmount.
  const engineRef = useRef<Engine | null>(null)
  const runnerRef = useRef<Runner | null>(null)
  const worldRef = useRef<World | null>(null)
  const ballRef = useRef<Body | null>(null)
  const rafRef = useRef<number>(0)
  const tossActiveRef = useRef<boolean>(false)

  // Paper mesh refs — persist across renders
  const paperRafRef = useRef<number>(0)
  const crumpleTRef = useRef<number>(0)
  const meshRef = useRef<Vertex[]>(
    MESH_FLAT.map((p, k) => ({
      x: p.x,
      y: p.y,
      z: p.z,
      tu: MESH_UVS[k].tu,
      tv: MESH_UVS[k].tv,
    })),
  )
  // Idle breathing offset
  const idleTimeRef = useRef<number>(0)
  // Track current mode inside the RAF without re-subscribing.
  const modeRef = useRef<Mode>('idle')
  const msgIndexRef = useRef<number>(0)

  const message = MESSAGES[msgIndex % MESSAGES.length]

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    msgIndexRef.current = msgIndex
  }, [msgIndex])

  // ── Build the offscreen paper texture ───────────────────────────────────
  const buildTexture = useCallback((msg: string) => {
    const tex = texCanvasRef.current ?? document.createElement('canvas')
    tex.width = PAPER_W
    tex.height = PAPER_H
    const ctx = tex.getContext('2d')
    if (!ctx) return tex
    ctx.clearRect(0, 0, PAPER_W, PAPER_H)

    // Background gradient (paper cream)
    const grd = ctx.createLinearGradient(0, 0, PAPER_W, PAPER_H)
    grd.addColorStop(0, '#FAF6EB')
    grd.addColorStop(0.55, '#F3ECD9')
    grd.addColorStop(1, '#E8DFC6')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, PAPER_W, PAPER_H)

    // Faint ruled lines for paper feel
    ctx.strokeStyle = 'rgba(201, 189, 158, 0.45)'
    ctx.lineWidth = 0.6
    const ruleYs = [0.22, 0.34, 0.46, 0.58, 0.7, 0.82]
    for (const t of ruleYs) {
      ctx.beginPath()
      ctx.moveTo(28, PAPER_H * t)
      ctx.lineTo(PAPER_W - 28, PAPER_H * t)
      ctx.stroke()
    }

    // Message text — drawn into upper ~60%. Manual word wrap.
    ctx.fillStyle = '#3A342B'
    ctx.font = "italic 500 22px 'Georgia', 'Palatino', serif"
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    const maxWidth = PAPER_W - 48
    const words = msg.split(' ')
    const lines: string[] = []
    let cur = ''
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w
      if (ctx.measureText(test).width > maxWidth && cur) {
        lines.push(cur)
        cur = w
      } else {
        cur = test
      }
    }
    if (cur) lines.push(cur)
    const lineHeight = 22 * 1.45
    let y = 60
    for (const ln of lines) {
      ctx.fillText(ln, 24, y)
      y += lineHeight
    }

    texCanvasRef.current = tex
    return tex
  }, [])

  // Rebuild texture when msg changes
  useEffect(() => {
    buildTexture(message)
  }, [message, buildTexture])

  // ── Kick off a fresh "reset" after a flow completes ──────────────────────
  const resetPaper = useCallback(() => {
    setMsgIndex((i) => (i + 1) % MESSAGES.length)
    crumpleTRef.current = 0
    // Snap paper to initial (below, invisible) instantly.
    paperOpacity.set(0)
    paperY.set(16)
    paperScaleY.set(1)
    // Brief pause lets React commit new msgIndex + rebuild texture, then slide in.
    window.setTimeout(() => {
      setMode('idle')
      void fmAnimate(paperOpacity, 1, { duration: 0.45, ease: 'easeOut' })
      void fmAnimate(paperY, 0, { duration: 0.45, ease: 'easeOut' })
    }, 80)
  }, [paperOpacity, paperY, paperScaleY])

  // ── DELETE: crumple then toss ────────────────────────────────────────────
  const handleDelete = useCallback(() => {
    if (mode !== 'idle') return
    setMode('crumpling')

    const ctl = fmAnimate(0, 1, {
      duration: 1.4,
      ease: [0.2, 0, 0.5, 1],
      onUpdate: (v: number) => {
        crumpleTRef.current = v
      },
      onComplete: () => {
        crumpleTRef.current = 1
        void fmAnimate(paperOpacity, 0, { duration: 0.2 })
        setShowCanvas(true)
        setMode('tossing')
        launchBall()
      },
    })
    void ctl
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, paperOpacity])

  // ── SAVE: fold and slide away ───────────────────────────────────────────
  const handleSave = useCallback(() => {
    if (mode !== 'idle') return
    setMode('saving')
    void fmAnimate(paperOpacity, [1, 1, 0], { duration: 0.85, times: [0, 0.5, 1], ease: 'easeInOut' })
    void fmAnimate(paperY, [0, -20, -80], { duration: 0.85, times: [0, 0.5, 1], ease: 'easeInOut' })
    void fmAnimate(paperScaleY, [1, 0.5, 0.2], { duration: 0.85, times: [0, 0.5, 1], ease: 'easeInOut' })
    window.setTimeout(() => {
      resetPaper()
    }, 900)
  }, [mode, resetPaper, paperOpacity, paperY, paperScaleY])

  // ── Matter.js lifecycle ─────────────────────────────────────────────────
  useEffect(() => {
    let alive = true

    import('matter-js').then((Matter) => {
      if (!alive) return

      const engine = Matter.Engine.create({ gravity: { x: 0, y: 1, scale: 0.0018 } })
      const runner = Matter.Runner.create()
      Matter.Runner.run(runner, engine)

engineRef.current = engine
      runnerRef.current = runner
      worldRef.current = engine.world
    })

    return () => {
      alive = false
      cancelAnimationFrame(rafRef.current)
      cancelAnimationFrame(paperRafRef.current)
      const runner = runnerRef.current
      const engine = engineRef.current
      const world = worldRef.current
      if (runner) {
        import('matter-js').then((Matter) => {
          Matter.Runner.stop(runner)
          if (world) Matter.Composite.clear(world, false, true)
          if (engine) Matter.Engine.clear(engine)
        })
      }
      engineRef.current = null
      runnerRef.current = null
      worldRef.current = null
      ballRef.current = null
    }
  }, [])

  // ── Launch ball + start draw loop ────────────────────────────────────────
  const launchBall = useCallback(async () => {
    const world = worldRef.current
    const container = containerRef.current
    if (!world || !container) return

    // Await import first so React has time to commit setShowCanvas(true) and
    // mount the ball canvas before we read canvasRef.current.
    const Matter = await import('matter-js')

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = container.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const renderedScaleX = rect.width / SCENE_W
    const renderedScaleY = rect.height / SCENE_H
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr * renderedScaleX, 0, 0, dpr * renderedScaleY, 0, 0)

    const ball = Matter.Bodies.circle(PAPER_CX, PAPER_CY, BALL_RADIUS * 0.55, {
      restitution: 0.35,
      friction: 0.6,
      frictionAir: 0.015,
      density: 0.002,
      angularVelocity: 0.12,
    })
    ballRef.current = ball
    Matter.Composite.add(world, ball)

    const vx = (sj(Date.now() * 0.001, 1) > 0 ? 1 : -1) * 2.5
    const vy = -14
    Matter.Body.setVelocity(ball, { x: vx, y: vy })

    tossActiveRef.current = true

    // Fade out the ball canvas after 700ms, then reset
    window.setTimeout(() => {
      const canvasEl = canvasRef.current
      if (canvasEl) {
        canvasEl.style.transition = 'opacity 400ms ease-out'
        canvasEl.style.opacity = '0'
      }
      window.setTimeout(() => {
        tossActiveRef.current = false
        setShowCanvas(false)
        if (canvasEl) {
          canvasEl.style.opacity = '1'
          canvasEl.style.transition = ''
        }
        resetPaper()
      }, 420)
    }, 700)

    const draw = () => {
      if (!tossActiveRef.current) return
      ctx.clearRect(0, 0, SCENE_W, SCENE_H)

      const px = ball.position.x
      const py = ball.position.y
      const ang = ball.angle
      const r = BALL_RADIUS * 0.55

      ctx.save()
      ctx.translate(px, py)
      ctx.rotate(ang)

      ctx.save()
      ctx.translate(2, 4)
      ctx.globalAlpha = 0.25
      ctx.fillStyle = '#000000'
      ctx.beginPath()
      ctx.arc(0, 0, r * 0.95, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      const grd = ctx.createRadialGradient(-r * 0.25, -r * 0.3, r * 0.1, 0, 0, r)
      grd.addColorStop(0, '#FFFFFF')
      grd.addColorStop(0.6, '#F0EDE6')
      grd.addColorStop(1, '#D9D4C5')
      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = 'rgba(80, 70, 55, 0.45)'
      ctx.lineWidth = 1.1
      ctx.lineCap = 'round'
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2
        const sxC = Math.cos(a) * r * 0.15
        const syC = Math.sin(a) * r * 0.15
        const exC = Math.cos(a + 0.6) * r * 0.75
        const eyC = Math.sin(a + 0.6) * r * 0.75
        const cxC = Math.cos(a + 0.3) * r * 0.55 + sj(i * 2.3, 2)
        const cyC = Math.sin(a + 0.3) * r * 0.55 + sj(i * 3.7, 2)
        ctx.beginPath()
        ctx.moveTo(sxC, syC)
        ctx.quadraticCurveTo(cxC, cyC, exC, eyC)
        ctx.stroke()
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(-r * 0.3, -r * 0.35, r * 0.3, Math.PI * 0.2, Math.PI * 0.7)
      ctx.stroke()

      ctx.restore()

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
  }, [resetPaper])

  // ── Paper canvas sizing (DPR-aware, ResizeObserver) ──────────────────────
  useEffect(() => {
    const container = containerRef.current
    const canvas = paperCanvasRef.current
    if (!container || !canvas) return

    const resize = () => {
      const rect = container.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const renderedScaleX = rect.width / SCENE_W
      const renderedScaleY = rect.height / SCENE_H
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr * renderedScaleX, 0, 0, dpr * renderedScaleY, 0, 0)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  // ── Paper canvas RAF loop — reads paperCanvasRef dynamically each frame so
  // it keeps working after the canvas remounts on message change.
  useEffect(() => {
    let alive = true
    const startTs = performance.now()
    // Track which canvas element we last sized, to re-size on remount.
    let sizedCanvas: HTMLCanvasElement | null = null

    const ensureSized = (canvas: HTMLCanvasElement) => {
      if (canvas === sizedCanvas) return
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.setTransform(dpr * (rect.width / SCENE_W), 0, 0, dpr * (rect.height / SCENE_H), 0, 0)
      sizedCanvas = canvas
    }

    // Light direction (normalized)
    const lvx = 0.3
    const lvy = -0.5
    const lvz = 1.0
    const lMag = Math.hypot(lvx, lvy, lvz)
    const lnx = lvx / lMag
    const lny = lvy / lMag
    const lnz = lvz / lMag

    const render = () => {
      if (!alive) return
      const curMode = modeRef.current

      // Skip rendering when physics canvas is active
      if (curMode === 'tossing') {
        paperRafRef.current = requestAnimationFrame(render)
        return
      }

      const canvas = paperCanvasRef.current
      if (!canvas) {
        paperRafRef.current = requestAnimationFrame(render)
        return
      }
      ensureSized(canvas)
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        paperRafRef.current = requestAnimationFrame(render)
        return
      }

      // Clear
      ctx.clearRect(0, 0, SCENE_W, SCENE_H)

      // Idle breathing offset (only during idle)
      const now = performance.now()
      if (curMode === 'idle') {
        idleTimeRef.current = (now - startTs) / 1000
      }
      const breatheY = curMode === 'idle' ? Math.sin(idleTimeRef.current * (Math.PI * 2) / 3) * 4 : 0

      // Draw paper shadow
      const crumpleT = crumpleTRef.current
      const shadowOpacity = 0.35 * (1 - crumpleT * 0.6)
      const shadowRX = lerp(PAPER_W * 0.42, BALL_RADIUS, Math.min(1, crumpleT * 1.1))
      ctx.save()
      ctx.globalAlpha = shadowOpacity
      ctx.fillStyle = '#000000'
      ctx.filter = 'blur(10px)'
      ctx.beginPath()
      ctx.ellipse(PAPER_CX, PAPER_CY + PAPER_H / 2 + 14 + breatheY, shadowRX, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.filter = 'none'
      ctx.restore()

      const tex = texCanvasRef.current
      if (!tex) {
        paperRafRef.current = requestAnimationFrame(render)
        return
      }

      // Interpolate mesh
      interpolateMesh(crumpleT, meshRef.current)

      const mesh = meshRef.current

      // Fast path — flat state with no breathing translation. Single drawImage.
      if (crumpleT === 0 && breatheY === 0) {
        ctx.drawImage(tex, PX0, PY0)
        paperRafRef.current = requestAnimationFrame(render)
        return
      }

      // If flat (crumpleT === 0) but breathing, just translate and draw
      if (crumpleT === 0) {
        ctx.save()
        ctx.translate(0, breatheY)
        ctx.drawImage(tex, PX0, PY0)
        ctx.restore()
        paperRafRef.current = requestAnimationFrame(render)
        return
      }

      // Per-triangle render
      ctx.save()
      ctx.translate(0, breatheY)

      const sx = [0, 0, 0]
      const sy = [0, 0, 0]
      const tx = [0, 0, 0]
      const ty = [0, 0, 0]

      for (let j = 0; j < MESH_ROWS; j++) {
        for (let i = 0; i < MESH_COLS; i++) {
          // Two triangles per quad
          const v00 = mesh[vertIndex(i, j)]
          const v10 = mesh[vertIndex(i + 1, j)]
          const v01 = mesh[vertIndex(i, j + 1)]
          const v11 = mesh[vertIndex(i + 1, j + 1)]

          // Triangle 1: v00, v10, v01
          const t1: Vertex[] = [v00, v10, v01]
          // Triangle 2: v10, v11, v01
          const t2: Vertex[] = [v10, v11, v01]

          for (const tri of [t1, t2]) {
            const a = tri[0]
            const b = tri[1]
            const c = tri[2]

            // Surface normal via cross product
            const ex1 = b.x - a.x
            const ey1 = b.y - a.y
            const ez1 = b.z - a.z
            const ex2 = c.x - a.x
            const ey2 = c.y - a.y
            const ez2 = c.z - a.z
            let nx = ey1 * ez2 - ez1 * ey2
            let ny = ez1 * ex2 - ex1 * ez2
            let nz = ex1 * ey2 - ey1 * ex2
            const nMag = Math.hypot(nx, ny, nz) || 1
            nx /= nMag
            ny /= nMag
            nz /= nMag

            const dot = Math.max(0, Math.min(1, Math.abs(nx * lnx + ny * lny + nz * lnz)))
            const brightness = 0.55 + 0.45 * dot

            sx[0] = a.x
            sy[0] = a.y
            sx[1] = b.x
            sy[1] = b.y
            sx[2] = c.x
            sy[2] = c.y
            tx[0] = a.tu
            ty[0] = a.tv
            tx[1] = b.tu
            ty[1] = b.tv
            tx[2] = c.tu
            ty[2] = c.tv

            drawTexturedTriangle(ctx, tex, sx, sy, tx, ty)

            // Shading overlay
            const shadeA = Math.max(0, 1 - brightness) * 0.7
            if (shadeA > 0.01) {
              ctx.save()
              ctx.beginPath()
              ctx.moveTo(sx[0], sy[0])
              ctx.lineTo(sx[1], sy[1])
              ctx.lineTo(sx[2], sy[2])
              ctx.closePath()
              ctx.fillStyle = `rgba(0,0,0,${shadeA.toFixed(3)})`
              ctx.fill()
              ctx.restore()
            }
          }
        }
      }

      ctx.restore()

      paperRafRef.current = requestAnimationFrame(render)
    }

    paperRafRef.current = requestAnimationFrame(render)
    return () => {
      alive = false
      cancelAnimationFrame(paperRafRef.current)
    }
  }, [])

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0F0F12] dark:bg-[#0F0F12]">
      <div
        ref={containerRef}
        className="relative"
        style={{
          width: '100%',
          maxWidth: 440,
          aspectRatio: `${SCENE_W} / ${SCENE_H}`,
          padding: '0 16px',
        }}
      >
        <div className="relative h-full w-full">
          {/* Paper mesh canvas — always mounted so the RAF loop ref stays valid.
              A motion.div wrapper handles entrance / save-fold / toss-hide visuals. */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ zIndex: 2, transformOrigin: '50% 62%', opacity: paperOpacity, y: paperY, scaleY: paperScaleY }}
          >
            <canvas ref={paperCanvasRef} className="absolute inset-0 h-full w-full" />
          </motion.div>

          {/* Physics ball canvas — visible during tossing */}
          {showCanvas && (
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0"
              style={{ zIndex: 3 }}
            />
          )}

          {/* SVG overlay — only contains buttons (and invisible text slot
              during idle; text is actually rendered into the texture canvas
              so it can distort with the mesh). Buttons stay crisp HTML. */}
          <AnimatePresence>
            {mode === 'idle' && (
              <motion.div
                key="buttons-wrap"
                className="absolute inset-0"
                style={{ zIndex: 4 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
                  className="absolute inset-0 h-full w-full"
                  style={{ overflow: 'visible' }}
                >
                  <foreignObject
                    x={PX0 + 24}
                    y={PY0 + PAPER_H - 120}
                    width={PAPER_W - 48}
                    height={112}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <button
                        type="button"
                        onClick={handleSave}
                        style={{
                          width: '100%',
                          height: 44,
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: 14,
                          background: 'transparent',
                          border: '1.5px solid rgba(0,0,0,0.25)',
                          color: 'rgba(0,0,0,0.65)',
                          cursor: 'pointer',
                          pointerEvents: 'auto',
                        }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        style={{
                          width: '100%',
                          height: 44,
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: 14,
                          background: '#E05A2B',
                          border: 'none',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          pointerEvents: 'auto',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </foreignObject>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expose message to accessibility tree (text is rendered into the
              canvas texture so it distorts with the mesh). */}
          <span className="sr-only">{message}</span>
        </div>
      </div>
    </div>
  )
}
