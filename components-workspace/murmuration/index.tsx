'use client'

// npm install framer-motion

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

// ─── Tuning ──────────────────────────────────────────────────────────────────
// Classic boids weights — biased toward cohesion so the flock stays as one ribbon.
const W_SEPARATION = 1.1
const W_ALIGNMENT  = 1.2
const W_COHESION   = 1.6

const PERCEPTION   = 80    // neighbour-lookup radius (px) — wide, so stragglers feel the group
const SEPARATION_R = 14    // personal space radius (px)
const CELL         = 80    // spatial-hash cell size — must be ≥ PERCEPTION

const MAX_SPEED    = 2.2
const MIN_SPEED    = 0.9   // keeps the flock gliding — never stalls
const MAX_FORCE    = 0.05

const POINTER_R    = 120   // predator influence radius
const POINTER_FORCE = 0.22 // strength at the centre of the predator
const POINTER_FADE_MS = 500 // decay time after touchend / pointer leave

const TRAIL_ALPHA_DARK  = 0.11
const TRAIL_ALPHA_LIGHT = 0.09

// Depth tiers — [size, alpha]
const TIERS: ReadonlyArray<readonly [number, number]> = [
  [3, 0.55], // distant
  [4, 0.75], // middle
  [5, 0.95], // close
]

// Flock count — scales with canvas area. 600 ceiling on wide screens, 220 on < 480px.
function flockCount(w: number, h: number): number {
  if (w < 480) return Math.max(100, Math.min(220, Math.round((w * h) / 1400)))
  const n = Math.round((w * h) / 1200)
  return Math.max(220, Math.min(600, n))
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface Boid {
  x: number
  y: number
  vx: number
  vy: number
  tier: 0 | 1 | 2
  phase: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function limit(vx: number, vy: number, max: number): [number, number] {
  const m2 = vx * vx + vy * vy
  if (m2 > max * max) {
    const m = Math.sqrt(m2)
    return [(vx / m) * max, (vy / m) * max]
  }
  return [vx, vy]
}

function clampSpeed(vx: number, vy: number): [number, number] {
  const m2 = vx * vx + vy * vy
  if (m2 > MAX_SPEED * MAX_SPEED) {
    const m = Math.sqrt(m2)
    return [(vx / m) * MAX_SPEED, (vy / m) * MAX_SPEED]
  }
  if (m2 < MIN_SPEED * MIN_SPEED && m2 > 1e-6) {
    const m = Math.sqrt(m2)
    return [(vx / m) * MIN_SPEED, (vy / m) * MIN_SPEED]
  }
  return [vx, vy]
}

// Shortest wrapped delta under toroidal world (w, h)
function wrapDelta(d: number, size: number): number {
  if (d > size * 0.5) return d - size
  if (d < -size * 0.5) return d + size
  return d
}

// Parse "#RRGGBB" into [r, g, b]. No validation — inputs are static constants.
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.startsWith('#') ? hex.slice(1) : hex
  const n = parseInt(h, 16)
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
}

// Mix two hex colors and return "r,g,b" string (ready for rgba()).
function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a)
  const [br, bg, bb] = hexToRgb(b)
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return `${r},${g},${bl}`
}

// Per-theme palette. All hex + precomputed rgb strings for cheap rgba().
interface Palette {
  bgTop: string
  bgBottom: string
  causticColor: string // "r,g,b"
  bubbleColor: string // "r,g,b"
  fishBack: string
  fishBelly: string
  sharkBack: string
  sharkBelly: string
  fogBlend: string
  eyeDark: string // "r,g,b"
  highlight: string // "r,g,b"
}

const PALETTE_DARK: Palette = {
  bgTop: '#0F3A52',
  bgBottom: '#05101E',
  causticColor: '136,212,232',
  bubbleColor: '224,240,245',
  fishBack: '#6B8FA8',
  fishBelly: '#C4D4DC',
  sharkBack: '#2A3440',
  sharkBelly: '#8090A0',
  fogBlend: '#0A2030',
  eyeDark: '10,15,20',
  highlight: '255,255,255',
}

const PALETTE_LIGHT: Palette = {
  bgTop: '#B8E4F0',
  bgBottom: '#3A7090',
  causticColor: '255,255,255',
  bubbleColor: '255,255,255',
  fishBack: '#2A5070',
  fishBelly: '#D8E8F0',
  sharkBack: '#1A2A3A',
  sharkBelly: '#6A7A8A',
  fogBlend: '#6FA4BC',
  eyeDark: '10,15,20',
  highlight: '255,255,255',
}

// Bubble particle.
interface Bubble {
  x: number
  y: number
  r: number
  phase: number
  vy: number
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Murmuration() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)

  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : true,
  )
  const isDarkRef = useRef<boolean>(isDark)

  // Pointer state — { x, y } in CSS pixels relative to canvas.
  // strength ∈ [0, 1] — 1 while actively tracking, decays after release.
  // prevX/prevY track the previous pointer position; heading is the facing angle in radians.
  const pointerRef = useRef<{
    x: number
    y: number
    prevX: number
    prevY: number
    heading: number
    strength: number
    active: boolean
  }>({
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    heading: 0,
    strength: 0,
    active: false,
  })

  useIsomorphicLayoutEffect(() => {
    isDarkRef.current = isDark
  }, [isDark])

  // ── Theme detection (follows project pattern: watch .dark on <html>) ───────
  useIsomorphicLayoutEffect(() => {
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

  // ── Simulation + render loop ───────────────────────────────────────────────
  useEffect(() => {
    const canvas    = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let alive = true
    let rafId = 0
    let boids: Boid[] = []
    let bubbles: Bubble[] = []
    let W = 0
    let H = 0

    // Cached background gradient — rebuilt only when W/H/theme changes.
    let bgGradient: CanvasGradient | null = null
    let lastW = -1
    let lastH = -1
    let lastDark: boolean | null = null

    // Spatial hash, keyed by "cx,cy" → array of boid indices. Rebuilt each frame.
    const grid = new Map<string, number[]>()

    function seedBubbles(count: number, width: number, height: number) {
      const next: Bubble[] = []
      for (let i = 0; i < count; i++) {
        next.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 1.5 + Math.random() * 2.5,
          phase: Math.random() * Math.PI * 2,
          vy: 0.3 + Math.random() * 0.6,
        })
      }
      bubbles = next
    }

    function seedBoids(count: number, width: number, height: number) {
      const next: Boid[] = []
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)
        const tierRoll = Math.random()
        const tier: 0 | 1 | 2 = tierRoll < 0.35 ? 0 : tierRoll < 0.75 ? 1 : 2
        next.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          tier,
          phase: Math.random() * Math.PI * 2,
        })
      }
      boids = next
    }

    function resize() {
      const w = container!.clientWidth  || 480
      const h = container!.clientHeight || 480
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas!.width  = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      canvas!.style.width  = `${w}px`
      canvas!.style.height = `${h}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const target = flockCount(w, h)
      if (boids.length === 0) {
        seedBoids(target, w, h)
      } else if (Math.abs(boids.length - target) > 20) {
        // Rescale flock if canvas changed dramatically.
        if (boids.length < target) {
          const add = target - boids.length
          for (let i = 0; i < add; i++) {
            const angle = Math.random() * Math.PI * 2
            const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)
            const tierRoll = Math.random()
            const tier: 0 | 1 | 2 = tierRoll < 0.35 ? 0 : tierRoll < 0.75 ? 1 : 2
            boids.push({
              x: Math.random() * w,
              y: Math.random() * h,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              tier,
              phase: Math.random() * Math.PI * 2,
            })
          }
        } else {
          boids.length = target
        }
      }

      // Re-wrap any boids that now sit outside the new bounds.
      for (const b of boids) {
        if (b.x < 0) b.x += w
        if (b.x >= w) b.x -= w
        if (b.y < 0) b.y += h
        if (b.y >= h) b.y -= h
      }

      // Seed bubbles once; on later resizes, just re-wrap into bounds.
      if (bubbles.length === 0) {
        seedBubbles(12, w, h)
      } else {
        for (const bu of bubbles) {
          if (bu.x < 0) bu.x = 0
          if (bu.x >= w) bu.x = w - 1
          if (bu.y < -20) bu.y = h + 10
          if (bu.y > h + 20) bu.y = Math.random() * h
        }
      }

      W = w
      H = h
    }

    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(container)

    let lastFrame = performance.now()

    function step(now: number) {
      if (!alive) return

      const dt = Math.min(48, now - lastFrame) // ms, clamped to avoid huge jumps on tab focus
      lastFrame = now

      const dark = isDarkRef.current
      const palette: Palette = dark ? PALETTE_DARK : PALETTE_LIGHT
      const trailA = dark ? TRAIL_ALPHA_DARK : TRAIL_ALPHA_LIGHT

      // Rebuild cached bg gradient only when size or theme changes.
      if (bgGradient === null || W !== lastW || H !== lastH || dark !== lastDark) {
        bgGradient = ctx!.createLinearGradient(0, 0, 0, H)
        bgGradient.addColorStop(0, palette.bgTop)
        bgGradient.addColorStop(1, palette.bgBottom)
        lastW = W
        lastH = H
        lastDark = dark
      }

      // Ghost-trail overlay using water gradient, at trail alpha.
      ctx!.globalAlpha = trailA
      ctx!.fillStyle = bgGradient
      ctx!.fillRect(0, 0, W, H)
      ctx!.globalAlpha = 1

      // Pre-compute tier-fog-blended fish colors (3 tiers × back/belly = 6 variants).
      // tier 0: 60% fog, tier 1: 25% fog, tier 2: 0% fog.
      const fishBackTiers: [string, string, string] = [
        mixHex(palette.fishBack, palette.fogBlend, 0.6),
        mixHex(palette.fishBack, palette.fogBlend, 0.25),
        mixHex(palette.fishBack, palette.fogBlend, 0),
      ]
      const fishBellyTiers: [string, string, string] = [
        mixHex(palette.fishBelly, palette.fogBlend, 0.6),
        mixHex(palette.fishBelly, palette.fogBlend, 0.25),
        mixHex(palette.fishBelly, palette.fogBlend, 0),
      ]

      // ── Decay pointer strength after release ────────────────────────────
      const p = pointerRef.current
      if (!p.active && p.strength > 0) {
        const decay = dt / POINTER_FADE_MS
        p.strength = Math.max(0, p.strength - decay)
      }

      // ── Rebuild spatial hash ─────────────────────────────────────────────
      grid.clear()
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i]
        const cx = Math.floor(b.x / CELL)
        const cy = Math.floor(b.y / CELL)
        const key = `${cx},${cy}`
        const bucket = grid.get(key)
        if (bucket) bucket.push(i)
        else grid.set(key, [i])
      }

      const perception2 = PERCEPTION * PERCEPTION
      const separation2 = SEPARATION_R * SEPARATION_R

      // ── Simulate each boid ───────────────────────────────────────────────
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i]

        let alignX = 0, alignY = 0, alignN = 0
        let cohX = 0, cohY = 0, cohN = 0
        let sepX = 0, sepY = 0, sepN = 0

        const cx = Math.floor(b.x / CELL)
        const cy = Math.floor(b.y / CELL)

        // Scan 3×3 neighbouring cells, wrapped toroidally.
        const cellsX = Math.max(1, Math.ceil(W / CELL))
        const cellsY = Math.max(1, Math.ceil(H / CELL))
        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            const nx = ((cx + ox) % cellsX + cellsX) % cellsX
            const ny = ((cy + oy) % cellsY + cellsY) % cellsY
            const bucket = grid.get(`${nx},${ny}`)
            if (!bucket) continue
            for (let k = 0; k < bucket.length; k++) {
              const j = bucket[k]
              if (j === i) continue
              const other = boids[j]
              let dx = other.x - b.x
              let dy = other.y - b.y
              // Toroidal shortest-path delta
              dx = wrapDelta(dx, W)
              dy = wrapDelta(dy, H)
              const d2 = dx * dx + dy * dy
              if (d2 > perception2 || d2 < 1e-6) continue

              alignX += other.vx
              alignY += other.vy
              alignN++

              cohX += b.x + dx // wrapped neighbour position
              cohY += b.y + dy
              cohN++

              if (d2 < separation2) {
                const d = Math.sqrt(d2)
                // Push away, weighted by 1/d — closer neighbours push harder.
                sepX -= dx / d
                sepY -= dy / d
                sepN++
              }
            }
          }
        }

        // ── Steering: each rule produces a steering vector (desired − current) ─
        let steerAx = 0, steerAy = 0
        let steerCx = 0, steerCy = 0
        let steerSx = 0, steerSy = 0

        if (alignN > 0) {
          alignX /= alignN
          alignY /= alignN
          // Normalise desired to MAX_SPEED
          const m = Math.hypot(alignX, alignY)
          if (m > 0) {
            alignX = (alignX / m) * MAX_SPEED
            alignY = (alignY / m) * MAX_SPEED
          }
          const [lx, ly] = limit(alignX - b.vx, alignY - b.vy, MAX_FORCE)
          steerAx = lx
          steerAy = ly
        }

        if (cohN > 0) {
          cohX /= cohN
          cohY /= cohN
          let dx = cohX - b.x
          let dy = cohY - b.y
          const m = Math.hypot(dx, dy)
          if (m > 0) {
            dx = (dx / m) * MAX_SPEED
            dy = (dy / m) * MAX_SPEED
          }
          const [lx, ly] = limit(dx - b.vx, dy - b.vy, MAX_FORCE)
          steerCx = lx
          steerCy = ly
        }

        if (sepN > 0) {
          sepX /= sepN
          sepY /= sepN
          const m = Math.hypot(sepX, sepY)
          if (m > 0) {
            sepX = (sepX / m) * MAX_SPEED
            sepY = (sepY / m) * MAX_SPEED
          }
          const [lx, ly] = limit(sepX - b.vx, sepY - b.vy, MAX_FORCE)
          steerSx = lx
          steerSy = ly
        }

        // ── Pointer repellent ────────────────────────────────────────────
        let repelX = 0, repelY = 0
        if (p.strength > 0) {
          let dx = b.x - p.x
          let dy = b.y - p.y
          // Toroidal shortest path to predator too — flock across wrap seams
          dx = wrapDelta(dx, W)
          dy = wrapDelta(dy, H)
          const d2 = dx * dx + dy * dy
          if (d2 < POINTER_R * POINTER_R && d2 > 1e-6) {
            const d = Math.sqrt(d2)
            // Soft falloff: 1 at centre → 0 at radius (quadratic).
            const falloff = 1 - d / POINTER_R
            const mag = POINTER_FORCE * falloff * falloff * p.strength
            repelX = (dx / d) * mag
            repelY = (dy / d) * mag
          }
        }

        // ── Accumulate acceleration ──────────────────────────────────────
        const ax =
          steerSx * W_SEPARATION +
          steerAx * W_ALIGNMENT +
          steerCx * W_COHESION +
          repelX
        const ay =
          steerSy * W_SEPARATION +
          steerAy * W_ALIGNMENT +
          steerCy * W_COHESION +
          repelY

        b.vx += ax
        b.vy += ay
        const [cvx, cvy] = clampSpeed(b.vx, b.vy)
        b.vx = cvx
        b.vy = cvy

        b.x += b.vx
        b.y += b.vy

        // Toroidal wrap
        if (b.x < 0) b.x += W
        else if (b.x >= W) b.x -= W
        if (b.y < 0) b.y += H
        else if (b.y >= H) b.y -= H
      }

      // ── Caustic light bands (6 animated horizontal gradients) ──────────
      for (let i = 0; i < 6; i++) {
        const y = ((H * (i / 5)) + Math.sin(now * 0.0003 + i * 1.7) * 40) | 0
        const bandH = 60 + Math.sin(now * 0.0005 + i * 0.9) * 20
        const top = y - bandH / 2
        const bot = y + bandH / 2
        const cg = ctx!.createLinearGradient(0, top, 0, bot)
        cg.addColorStop(0, `rgba(${palette.causticColor},0)`)
        cg.addColorStop(0.5, `rgba(${palette.causticColor},0.06)`)
        cg.addColorStop(1, `rgba(${palette.causticColor},0)`)
        ctx!.fillStyle = cg
        ctx!.fillRect(0, top, W, bandH)
      }

      // ── Bubbles: drift up with sinusoidal wobble ───────────────────────
      for (let i = 0; i < bubbles.length; i++) {
        const bu = bubbles[i]
        bu.y -= bu.vy
        bu.x += Math.sin(now * 0.002 + bu.phase) * 0.4
        if (bu.y < -10) {
          bu.y = H + 10
          bu.x = Math.random() * W
          bu.phase = Math.random() * Math.PI * 2
        }

        // Body
        ctx!.fillStyle = `rgba(${palette.bubbleColor},0.25)`
        ctx!.beginPath()
        ctx!.arc(bu.x, bu.y, bu.r, 0, Math.PI * 2)
        ctx!.fill()

        // Glassy highlight — small arc top-right.
        ctx!.fillStyle = `rgba(${palette.highlight},0.5)`
        ctx!.beginPath()
        ctx!.arc(bu.x - bu.r * 0.3, bu.y - bu.r * 0.3, bu.r * 0.4, 0, Math.PI * 2)
        ctx!.fill()
      }

      // ── Draw boids as fish with countershading + tail flick + depth fog ─
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i]
        const [size, alpha] = TIERS[b.tier]
        const speed = Math.hypot(b.vx, b.vy) || 1
        const cos = b.vx / speed
        const sin = b.vy / speed
        const rotation = Math.atan2(b.vy, b.vx)
        const speedNorm = speed / MAX_SPEED

        const rx = size * 1.4
        const ry = size * 0.55
        const alphaStr = alpha.toFixed(3)
        const fishBack = fishBackTiers[b.tier]
        const fishBelly = fishBellyTiers[b.tier]

        // Pass A — back: body ellipse
        ctx!.fillStyle = `rgba(${fishBack},${alphaStr})`
        ctx!.beginPath()
        ctx!.ellipse(b.x, b.y, rx, ry, rotation, 0, Math.PI * 2)
        ctx!.fill()

        // Tail polygon (uses fishBack) with tail flick — outer tips shift
        // perpendicular to velocity by the same signed amount.
        const tailFlick = Math.sin(now * 0.012 + b.phase) * size * 0.5 * speedNorm
        const t1lx = -size * 2.3, t1ly =  size * 0.75 + tailFlick
        const t2lx = -size * 2.3, t2ly = -size * 0.75 + tailFlick
        const t3lx = -size * 1.3, t3ly =  0
        const t1x = b.x + t1lx * cos - t1ly * sin
        const t1y = b.y + t1lx * sin + t1ly * cos
        const t2x = b.x + t2lx * cos - t2ly * sin
        const t2y = b.y + t2lx * sin + t2ly * cos
        const t3x = b.x + t3lx * cos - t3ly * sin
        const t3y = b.y + t3lx * sin + t3ly * cos
        ctx!.beginPath()
        ctx!.moveTo(t1x, t1y)
        ctx!.lineTo(t2x, t2y)
        ctx!.lineTo(t3x, t3y)
        ctx!.closePath()
        ctx!.fill()

        // Pass B — belly: lighter ellipse offset "down" in local frame.
        // Local (0, +ry*0.25) means belly sits on +y side after rotation.
        const bellyLy = ry * 0.25
        const bellyX = b.x + (0) * cos - bellyLy * sin
        const bellyY = b.y + (0) * sin + bellyLy * cos
        ctx!.fillStyle = `rgba(${fishBelly},${alphaStr})`
        ctx!.beginPath()
        ctx!.ellipse(bellyX, bellyY, rx * 0.85, ry * 0.7, rotation, 0, Math.PI * 2)
        ctx!.fill()

        // Pass C — eye: dark pupil.
        const eyeLx = size * 0.85
        const eyeLy = -size * 0.18
        const eyeX = b.x + eyeLx * cos - eyeLy * sin
        const eyeY = b.y + eyeLx * sin + eyeLy * cos
        ctx!.fillStyle = `rgba(${palette.eyeDark},${alphaStr})`
        ctx!.beginPath()
        ctx!.arc(eyeX, eyeY, size * 0.22, 0, Math.PI * 2)
        ctx!.fill()
      }

      // ── Draw shark predator at pointer ──────────────────────────────────
      // Visible only while pointer strength is meaningful; fades out with strength.
      if (p.strength > 0.01) {
        const strength = p.strength
        const cos = Math.cos(p.heading)
        const sin = Math.sin(p.heading)
        const px = p.x
        const py = p.y
        const alphaStr = (strength * 0.95).toFixed(3)

        const toWorld = (lx: number, ly: number): [number, number] => [
          px + lx * cos - ly * sin,
          py + lx * sin + ly * cos,
        ]

        const sharkBackRgb = hexToRgb(palette.sharkBack).join(',')
        const sharkBellyRgb = hexToRgb(palette.sharkBelly).join(',')

        // Body — tear-drop silhouette (sharkBack).
        ctx!.fillStyle = `rgba(${sharkBackRgb},${alphaStr})`
        {
          const [nx, ny] = toWorld(22, 0)
          const [tc1x, tc1y] = toWorld(6, -9)
          const [tj1x, tj1y] = toWorld(-14, -6)
          const [tj2x, tj2y] = toWorld(-14, 6)
          const [bc1x, bc1y] = toWorld(6, 9)
          ctx!.beginPath()
          ctx!.moveTo(nx, ny)
          ctx!.quadraticCurveTo(tc1x, tc1y, tj1x, tj1y)
          ctx!.lineTo(tj2x, tj2y)
          ctx!.quadraticCurveTo(bc1x, bc1y, nx, ny)
          ctx!.closePath()
          ctx!.fill()
        }

        // Belly — lighter ellipse on bottom half (countershading).
        // Offset local y +3, smaller ry. Use canvas ellipse with rotation = heading.
        {
          const [bx, by] = toWorld(0, 3)
          ctx!.fillStyle = `rgba(${sharkBellyRgb},${alphaStr})`
          ctx!.beginPath()
          ctx!.ellipse(bx, by, 14, 4, p.heading, 0, Math.PI * 2)
          ctx!.fill()
        }

        // Dorsal fin — triangle on top of body, slightly aft of center.
        ctx!.fillStyle = `rgba(${sharkBackRgb},${alphaStr})`
        {
          const [d1x, d1y] = toWorld(2, -6)
          const [d2x, d2y] = toWorld(-6, -15)
          const [d3x, d3y] = toWorld(-10, -6)
          ctx!.beginPath()
          ctx!.moveTo(d1x, d1y)
          ctx!.lineTo(d2x, d2y)
          ctx!.lineTo(d3x, d3y)
          ctx!.closePath()
          ctx!.fill()
        }

        // Pectoral fins — two small triangles on either side of the body.
        {
          const [l1x, l1y] = toWorld(6, 5)
          const [l2x, l2y] = toWorld(0, 14)
          const [l3x, l3y] = toWorld(-4, 5)
          ctx!.beginPath()
          ctx!.moveTo(l1x, l1y)
          ctx!.lineTo(l2x, l2y)
          ctx!.lineTo(l3x, l3y)
          ctx!.closePath()
          ctx!.fill()

          const [r1x, r1y] = toWorld(6, -5)
          const [r2x, r2y] = toWorld(0, -14)
          const [r3x, r3y] = toWorld(-4, -5)
          ctx!.beginPath()
          ctx!.moveTo(r1x, r1y)
          ctx!.lineTo(r2x, r2y)
          ctx!.lineTo(r3x, r3y)
          ctx!.closePath()
          ctx!.fill()
        }

        // Tail — asymmetric crescent, with tail sway on outer tips.
        {
          const sharkSway = Math.sin(now * 0.015) * 4
          const [s1x, s1y] = toWorld(-14, -3)
          const [s2x, s2y] = toWorld(-26, -14 + sharkSway)
          const [s3x, s3y] = toWorld(-20, 0)
          const [s4x, s4y] = toWorld(-26, 10 + sharkSway)
          const [s5x, s5y] = toWorld(-14, 3)
          ctx!.beginPath()
          ctx!.moveTo(s1x, s1y)
          ctx!.lineTo(s2x, s2y)
          ctx!.lineTo(s3x, s3y)
          ctx!.lineTo(s4x, s4y)
          ctx!.lineTo(s5x, s5y)
          ctx!.closePath()
          ctx!.fill()
        }

        // Eye — dark pupil + white highlight dot.
        {
          const [eyeX, eyeY] = toWorld(13, -2.5)
          ctx!.fillStyle = `rgba(${palette.eyeDark},${alphaStr})`
          ctx!.beginPath()
          ctx!.arc(eyeX, eyeY, 2, 0, Math.PI * 2)
          ctx!.fill()

          const [hx, hy] = toWorld(13.5, -3)
          ctx!.fillStyle = `rgba(${palette.highlight},${alphaStr})`
          ctx!.beginPath()
          ctx!.arc(hx, hy, 0.8, 0, Math.PI * 2)
          ctx!.fill()
        }
      }

      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)

    return () => {
      alive = false
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])

  // ── Pointer / touch tracking ───────────────────────────────────────────────
  function setPointerFromEvent(clientX: number, clientY: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const p = pointerRef.current
    p.prevX = p.x
    p.prevY = p.y
    p.x = clientX - rect.left
    p.y = clientY - rect.top
    const dx = p.x - p.prevX
    const dy = p.y - p.prevY
    if (dx * dx + dy * dy > 0.5) {
      p.heading = Math.atan2(dy, dx)
    }
    p.active = true
    p.strength = 1
  }

  function releasePointer() {
    // Mark inactive — loop will fade strength to 0 over POINTER_FADE_MS.
    pointerRef.current.active = false
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    setPointerFromEvent(e.clientX, e.clientY)
  }

  function onPointerLeave() {
    releasePointer()
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    setPointerFromEvent(e.clientX, e.clientY)
  }

  function onPointerUp() {
    // On touch devices, pointerup means the finger lifted — start the fade.
    if (pointerRef.current.active) releasePointer()
  }

  const bgStyle = isDark ? '#05101E' : '#3A7090'

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{ background: bgStyle }}
    >
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative h-screen w-full overflow-hidden"
        style={{ background: bgStyle, touchAction: 'none', cursor: 'none' }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ width: '100%', height: '100%' }}
        />
      </motion.div>
    </div>
  )
}
