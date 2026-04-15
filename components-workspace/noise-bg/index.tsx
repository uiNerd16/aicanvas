'use client'

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

export default function NoiseBg() {
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
        ctx.fillStyle = `rgba(${dotRGB},${alpha.toFixed(2)})`
        ctx.fillRect(d.x - sz / 2, d.y - sz / 2, sz, sz)
      }

      // Draw connection lines between lit neighbours
      for (const [a, b] of pairs) {
        if (a.b < 0.05 || b.b < 0.05) continue
        const lineAlpha = Math.min(a.b, b.b) * 0.10
        ctx.strokeStyle = `rgba(${dotRGB},${lineAlpha.toFixed(2)})`
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
}
