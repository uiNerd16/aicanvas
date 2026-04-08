'use client'

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
        ctx.strokeStyle = `rgba(${dotRGB},${lineA.toFixed(3)})`
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
        ctx.fillStyle = `rgba(${dotRGB},${alpha.toFixed(2)})`
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
}
