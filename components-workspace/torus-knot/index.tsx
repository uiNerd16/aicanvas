'use client'

import { useEffect, useRef, useState } from 'react'

// ─── TorusKnot ────────────────────────────────────────────────────────────────
// Pure-canvas parametric torus knot (p=2, q=3 trefoil).
// Rotates on Y axis continuously. On hover: rotation accelerates and bright
// segments emit a radial glow. Depth-sorted line segments give a convincing
// wireframe 3D look. Supports both dark and light mode.

const SEGMENTS = 600        // number of points sampled along the curve
const P = 2                 // torus knot winding parameter
const Q = 3                 // torus knot winding parameter
const KNOT_SCALE = 60       // base scale — will be further multiplied by container size
const DIST = 6              // perspective distance constant
const BASE_SPEED_Y = 0.004  // Y rotation speed at rest
const BASE_SPEED_X = 0.0018 // X rotation speed at rest (slower for nice tumble)
const HOVER_SPEED_Y = 0.018
const HOVER_SPEED_X = 0.008
const SPEED_LERP = 0.06
const GLOW_LERP = 0.07

// Precompute torus knot points (unit-ish scale — actual size set by KNOT_SCALE)
function buildKnotPoints(): [number, number, number][] {
  const pts: [number, number, number][] = []
  for (let i = 0; i <= SEGMENTS; i++) {
    const t = (i / SEGMENTS) * 2 * Math.PI
    const r = Math.cos(Q * t) + 2
    const x = r * Math.cos(P * t)
    const y = r * Math.sin(P * t)
    const z = -Math.sin(Q * t)
    pts.push([x, y, z])
  }
  return pts
}

const KNOT_POINTS = buildKnotPoints()

// Rotate a 3-vector around the X axis by angle θ
function rotX(
  x: number,
  y: number,
  z: number,
  angle: number,
): [number, number, number] {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return [x, cos * y - sin * z, sin * y + cos * z]
}

// Rotate a 3-vector around the Y axis by angle θ
function rotY(
  x: number,
  y: number,
  z: number,
  angle: number,
): [number, number, number] {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return [cos * x + sin * z, y, -sin * x + cos * z]
}

// Perspective-project a rotated point to screen coords
function project(
  rx: number,
  ry: number,
  rz: number,
  cx: number,
  cy: number,
  scale: number,
): [number, number, number] {
  const d = rz + DIST
  const sx = cx + (rx * scale) / d
  const sy = cy - (ry * scale) / d   // canvas Y is inverted
  return [sx, sy, rz]
}

export function TorusKnot() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const [isDark, setIsDark] = useState(true)
  const isDarkRef   = useRef(true)

  // Mutable animation state — all in refs so RAF sees fresh values
  const angleYRef   = useRef(0)
  const angleXRef   = useRef(0)
  const speedYRef   = useRef(BASE_SPEED_Y)
  const speedXRef   = useRef(BASE_SPEED_X)
  const glowRef     = useRef(0)
  const hoveredRef  = useRef(false)

  // ─── Theme detection ──────────────────────────────────────────────────────
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

  // ─── Canvas render loop ───────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let alive = true

    function resize() {
      if (!canvas || !container) return
      const dpr = window.devicePixelRatio || 1
      const w = container.clientWidth
      const h = container.clientHeight
      canvas.width  = w * dpr
      canvas.height = h * dpr
      canvas.style.width  = `${w}px`
      canvas.style.height = `${h}px`
      ctx!.scale(dpr, dpr)
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(container)

    function tick() {
      if (!alive || !canvas || !container || !ctx) return

      // Smooth speed/glow transitions
      const targetSpeedY = hoveredRef.current ? HOVER_SPEED_Y : BASE_SPEED_Y
      const targetSpeedX = hoveredRef.current ? HOVER_SPEED_X : BASE_SPEED_X
      speedYRef.current += (targetSpeedY - speedYRef.current) * SPEED_LERP
      speedXRef.current += (targetSpeedX - speedXRef.current) * SPEED_LERP

      const targetGlow = hoveredRef.current ? 1 : 0
      glowRef.current += (targetGlow - glowRef.current) * GLOW_LERP

      angleYRef.current += speedYRef.current
      angleXRef.current += speedXRef.current

      const angleY = angleYRef.current
      const angleX = angleXRef.current
      const glow   = glowRef.current

      const W = container.clientWidth
      const H = container.clientHeight
      const cx = W / 2
      const cy = H / 2

      // Scale knot to ~80% of the smaller dimension
      const minDim = Math.min(W, H)
      const scale  = (minDim / 2) * 0.80 / 3   // knot radius ≈ 3 units

      // Background
      const bg = isDarkRef.current ? '#110F0C' : '#F5F1EA'
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Transform and project all points — Y then X rotation
      const projected: [number, number, number][] = KNOT_POINTS.map(([x, y, z]) => {
        const [yx, yy, yz] = rotY(x, y, z, angleY)
        const [rx, ry, rz] = rotX(yx, yy, yz, angleX)
        return project(rx, ry, rz, cx, cy, scale * KNOT_SCALE / 20)
      })

      // Find Z range for normalising depth
      let zMin = Infinity
      let zMax = -Infinity
      for (const [,, pz] of projected) {
        if (pz < zMin) zMin = pz
        if (pz > zMax) zMax = pz
      }
      const zRange = zMax - zMin || 1

      // Draw line segments back-to-front (depth sort is implicit — we paint
      // each segment and let the alpha do the depth work without a full sort)
      for (let i = 0; i < SEGMENTS; i++) {
        const [x0, y0, z0] = projected[i]!
        const [x1, y1, z1] = projected[i + 1]!

        // Midpoint Z for depth-based alpha
        const midZ = (z0 + z1) / 2
        const t = (midZ - zMin) / zRange   // 0 = back, 1 = front
        const alpha = 0.55 + 0.45 * t

        // Line color depending on theme
        let lineColor: string
        if (isDarkRef.current) {
          const v = Math.round(180 + 75 * t)
          lineColor = `rgba(${v},${v},${v},${alpha.toFixed(3)})`
        } else {
          const base = Math.round(20 + (1 - t) * 60)
          lineColor = `rgba(${base},${Math.round(base * 0.97)},${Math.round(base * 0.92)},${alpha.toFixed(3)})`
        }

        // Glow on front segments when hovered
        const isBright = t > 0.5
        if (glow > 0.05 && isBright) {
          ctx.shadowBlur  = 12 * glow * t
          ctx.shadowColor = isDarkRef.current
            ? `rgba(200,220,255,${0.7 * glow * t})`
            : `rgba(80,60,20,${0.6 * glow * t})`
        } else {
          ctx.shadowBlur = 0
        }

        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.strokeStyle = lineColor
        ctx.lineWidth   = 2 + 6 * t   // 2px back → 8px front
        ctx.stroke()
      }

      // Subtle radial glow at center on hover (dark mode only looks best)
      if (glow > 0.05) {
        const glowRadius = minDim * 0.22
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius)
        if (isDarkRef.current) {
          grad.addColorStop(0,   `rgba(160,180,255,${0.12 * glow})`)
          grad.addColorStop(0.5, `rgba(100,120,220,${0.07 * glow})`)
          grad.addColorStop(1,   'rgba(0,0,0,0)')
        } else {
          grad.addColorStop(0,   `rgba(160,140,80,${0.10 * glow})`)
          grad.addColorStop(0.5, `rgba(120,100,40,${0.05 * glow})`)
          grad.addColorStop(1,   'rgba(255,255,255,0)')
        }
        ctx.shadowBlur = 0
        ctx.fillStyle  = grad
        ctx.fillRect(0, 0, W, H)
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      alive = false
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}
      onMouseEnter={() => { hoveredRef.current = true }}
      onMouseLeave={() => { hoveredRef.current = false }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
