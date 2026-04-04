'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Config ───────────────────────────────────────────────────────────────────
const SPACING      = 20     // px between dot/node centres
const RADIUS       = 160    // px — hover influence radius
const BASE_A       = 0.13   // resting dot opacity
const PEAK_A       = 0.92   // fully-lit opacity
const LINE_A_DARK  = 0.07   // resting line opacity (dark theme)
const LINE_A_LIGHT = 0.12   // resting line opacity (light theme)

// ─── Types ────────────────────────────────────────────────────────────────────
type Dot     = { x: number; y: number; b: number }
type Segment = { a: Dot; b: Dot }

// ─── Component ────────────────────────────────────────────────────────────────
export function GridLines() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const mouseRef     = useRef<{ x: number; y: number } | null>(null)
  const waveRef      = useRef<number>(0)
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
          const d: Dot = { x: ox + c * SPACING, y: oy + r * SPACING, b: 0 }
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
      const r2        = RADIUS * RADIUS
      const dotRGB    = isDarkRef.current ? '255,255,255' : '28,25,22'
      const baseA     = isDarkRef.current ? BASE_A : 0.25
      const lineRestA = isDarkRef.current ? LINE_A_DARK : LINE_A_LIGHT

      // ── 1. Update dot brightness ────────────────────────────────────────────
      for (const d of dots) {
        const dx    = d.x - mx
        const dy    = d.y - my
        const dist2 = dx * dx + dy * dy
        const tgt   = dist2 < r2 ? Math.pow(1 - Math.sqrt(dist2) / RADIUS, 1.5) : 0
        d.b += (tgt > d.b ? 0.16 : 0.07) * (tgt - d.b)
        if (d.b < 0.004) d.b = 0
      }

      // ── 2. Advance wave + draw lines with radial overlay ──────────────
      const mouseActive = mouseRef.current !== null
      if (mouseActive) {
        waveRef.current = (waveRef.current + 1.8) % (RADIUS * 2)
      } else {
        // Decay wave back to 0 when mouse leaves
        if (waveRef.current > 0) waveRef.current = Math.max(0, waveRef.current - 4)
      }
      const waveR = waveRef.current
      const WAVE_WIDTH = 28   // px — how wide the fill front is per segment

      const allSegs = [...hSegs, ...vSegs]
      for (const seg of allSegs) {
        const segB = (seg.a.b + seg.b.b) / 2

        // Base line brightness
        const lineA = lineRestA + (PEAK_A - lineRestA) * segB
        ctx.strokeStyle = `rgba(${dotRGB},${lineA.toFixed(3)})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(seg.a.x, seg.a.y)
        ctx.lineTo(seg.b.x, seg.b.y)
        ctx.stroke()

        // Radial wave overlay — only when wave is active
        if (waveR > 0 && segB > 0.04) {
          // Midpoint distance from cursor
          const midX = (seg.a.x + seg.b.x) / 2
          const midY = (seg.a.y + seg.b.y) / 2
          const segDist = Math.sqrt((midX - mx) * (midX - mx) + (midY - my) * (midY - my))

          // How far the wave has passed over this segment
          const wavePast = waveR - segDist

          if (wavePast > 0 && wavePast < WAVE_WIDTH) {
            // t: 0 = wave just arrived, 1 = wave fully passed
            const t = wavePast / WAVE_WIDTH

            // Determine near/far endpoint relative to cursor
            const distA = Math.sqrt((seg.a.x - mx) ** 2 + (seg.a.y - my) ** 2)
            const distB = Math.sqrt((seg.b.x - mx) ** 2 + (seg.b.y - my) ** 2)
            const near  = distA <= distB ? seg.a : seg.b
            const far   = distA <= distB ? seg.b : seg.a

            // Overlay extends from near endpoint toward far endpoint as t increases
            const ex = near.x + (far.x - near.x) * t
            const ey = near.y + (far.y - near.y) * t

            const overlayA = segB * 0.85
            ctx.strokeStyle = `rgba(${dotRGB},${overlayA.toFixed(3)})`
            ctx.lineWidth = 1.2
            ctx.beginPath()
            ctx.moveTo(near.x, near.y)
            ctx.lineTo(ex, ey)
            ctx.stroke()
          }
        }
      }

      // ── 3. Draw dots on top ─────────────────────────────────────────────────
      for (const d of dots) {
        const alpha = baseA + (PEAK_A - baseA) * d.b
        const sz    = 1 + d.b * 1.2
        ctx.fillStyle = `rgba(${dotRGB},${alpha.toFixed(2)})`
        ctx.fillRect(d.x - sz / 2, d.y - sz / 2, sz, sz)
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
