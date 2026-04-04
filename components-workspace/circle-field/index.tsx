'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Config ───────────────────────────────────────────────────────────────────
const DENSITY      = 1 / 250
const MAX_DOTS     = 3000
const RADIUS       = 200
const BASE_R       = 3
const BASE_A_DARK  = 0.18
const BASE_A_LIGHT = 0.28
const PEAK_A       = 0.65

// ─── Types ────────────────────────────────────────────────────────────────────
type Circle = { x: number; y: number; b: number }

export function CircleField() {
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

    let circles: Circle[] = []
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

      const count = Math.min(Math.round(cw * ch * DENSITY), MAX_DOTS)
      circles = Array.from({ length: count }, () => ({
        x: Math.random() * cw,
        y: Math.random() * ch,
        b: 0,
      }))
    }

    function frame() {
      if (!alive) return
      ctx.clearRect(0, 0, cw, ch)

      const mx     = mouseRef.current?.x ?? -99999
      const my     = mouseRef.current?.y ?? -99999
      const r2     = RADIUS * RADIUS
      const dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'
      const baseA  = isDarkRef.current ? BASE_A_DARK : BASE_A_LIGHT

      for (const c of circles) {
        const dx    = c.x - mx
        const dy    = c.y - my
        const dist2 = dx * dx + dy * dy
        const tgt   = dist2 < r2 ? Math.exp(-dist2 / (RADIUS * RADIUS * 0.25)) : 0

        c.b += (tgt > c.b ? 0.16 : 0.07) * (tgt - c.b)
        if (c.b < 0.004) c.b = 0

        const alpha = baseA + (PEAK_A - baseA) * c.b

        // Draw inner ring
        if (c.b > 0.02) {
          ctx.strokeStyle = `rgba(${dotRGB},${(c.b * 0.50).toFixed(2)})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.arc(c.x, c.y, 1.5, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Draw outer ring
        if (c.b > 0.02) {
          ctx.strokeStyle = `rgba(${dotRGB},${(c.b * 0.40).toFixed(2)})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.arc(c.x, c.y, 7, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Draw base circle (on top)
        ctx.strokeStyle = `rgba(${dotRGB},${alpha.toFixed(2)})`
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.arc(c.x, c.y, BASE_R, 0, Math.PI * 2)
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
          Circle Field
        </span>
        <span style={{ color: hintColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          hover to illuminate
        </span>
      </div>
    </div>
  )
}
