'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Config ───────────────────────────────────────────────────────────────────
const GRID_SPACING = 24    // px between arrows
const SHAFT_LEN    = 8     // half-shaft length
const HEAD_SIZE    = 4     // arrowhead branch length

// Cursor-tracking lerp — exponential decay with distance
const DECAY_DIST = 320     // px — wider influence area
const LERP_FAST  = 0.12    // lerp speed right at the cursor
const LERP_MIN   = 0.006   // minimum speed at large distance
const IDLE_LERP  = 0.010   // speed returning to noise flow when cursor is gone

// Organic wobble — each arrow has a personal noise offset so motion feels alive
const WOBBLE_AMP  = 0.18   // radians of random drift added on top of cursor angle
const WOBBLE_FREQ = 0.7    // how fast the wobble oscillates per arrow

// ─── Types ────────────────────────────────────────────────────────────────────
interface Arrow {
  gx: number
  gy: number
  angle: number   // persistent — lerped toward target each frame
  phase: number   // unique random phase for organic wobble
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Idle noise flow — arrows drift here when no cursor
function flowAngle(gx: number, gy: number, t: number): number {
  return (
    Math.sin(gx * 0.007 + t) * Math.PI +
    Math.cos(gy * 0.007 + t * 0.6) * Math.PI
  )
}

// Shortest-path angle lerp — never spins the long way around
function lerpAngle(current: number, target: number, speed: number): number {
  let diff = target - current
  while (diff >  Math.PI) diff -= Math.PI * 2
  while (diff < -Math.PI) diff += Math.PI * 2
  return current + diff * speed
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function NoiseField() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const [isDark, setIsDark] = useState(true)
  const isDarkRef   = useRef(isDark)
  const mouseRef    = useRef<{ x: number; y: number } | null>(null)
  const arrowsRef   = useRef<Arrow[]>([])

  useEffect(() => { isDarkRef.current = isDark }, [isDark])

  // ── Theme detection ───────────────────────────────────────────────────────
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
    const cw = el.closest('[data-card-theme]')
    if (cw) observer.observe(cw, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // ── Mouse tracking ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => { mouseRef.current = null }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    return () => {
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  // ── Main draw loop ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    let t = 0

    function buildGrid(W: number, H: number) {
      // Preserve existing angles when grid is rebuilt on resize
      const prev = new Map<string, Arrow>()
      for (const a of arrowsRef.current) prev.set(`${a.gx},${a.gy}`, a)
      const next: Arrow[] = []
      for (let gx = GRID_SPACING / 2; gx < W; gx += GRID_SPACING) {
        for (let gy = GRID_SPACING / 2; gy < H; gy += GRID_SPACING) {
          const existing = prev.get(`${gx},${gy}`)
          next.push({
            gx,
            gy,
            angle: existing?.angle ?? flowAngle(gx, gy, t),
            phase: existing?.phase ?? Math.random() * Math.PI * 2,
          })
        }
      }
      arrowsRef.current = next
    }

    const resize = () => {
      const w   = container.clientWidth  || 480
      const h   = container.clientHeight || 480
      const dpr = window.devicePixelRatio || 1
      canvas.width  = w * dpr
      canvas.height = h * dpr
      canvas.style.width  = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildGrid(w, h)
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(container)

    function draw() {
      const W     = container!.clientWidth  || 480
      const H     = container!.clientHeight || 480
      const dark  = isDarkRef.current
      const mouse = mouseRef.current

      // Background
      ctx!.fillStyle = dark ? '#110F0C' : '#F5F1EA'
      ctx!.fillRect(0, 0, W, H)

      ctx!.lineCap  = 'round'
      ctx!.lineJoin = 'round'

      for (const arrow of arrowsRef.current) {
        const { gx, gy } = arrow

        if (mouse) {
          // Point toward cursor — each arrow lerps at its own distance-based speed
          const dx   = mouse.x - gx
          const dy   = mouse.y - gy
          const dist = Math.sqrt(dx * dx + dy * dy)
          // Organic wobble: personal sine offset that scales down close to cursor
          const proximityFactor = Math.exp(-dist / DECAY_DIST)
          const wobble = WOBBLE_AMP * (1 - proximityFactor * 0.7) * Math.sin(t * WOBBLE_FREQ + arrow.phase)
          const targetAngle = Math.atan2(dy, dx) + wobble
          const speed = LERP_FAST * proximityFactor + LERP_MIN
          arrow.angle = lerpAngle(arrow.angle, targetAngle, speed)
        } else {
          // Slowly drift back to noise flow (wobble persists here too for life)
          const noiseAngle = flowAngle(gx, gy, t) + WOBBLE_AMP * 0.5 * Math.sin(t * WOBBLE_FREQ * 0.8 + arrow.phase)
          arrow.angle = lerpAngle(arrow.angle, noiseAngle, IDLE_LERP)
        }

        const angle = arrow.angle
        const cos   = Math.cos(angle)
        const sin   = Math.sin(angle)

        // Alpha — distance-based fade: far arrows almost invisible, close ones bright
        let alpha: number
        if (mouse) {
          const dx = mouse.x - gx, dy = mouse.y - gy
          const dist2 = dx * dx + dy * dy
          // Tight gaussian — drops off steeply beyond ~200px, near-zero by ~420px
          const proximity = Math.exp(-dist2 / (200 * 200))
          alpha = dark
            ? 0.06 + proximity * 0.84
            : 0.05 + proximity * 0.75
        } else {
          // Idle: gentle uniform low opacity — field is barely there without cursor
          alpha = dark ? 0.18 : 0.15
        }

        const color = dark
          ? `rgba(255,255,255,${alpha.toFixed(3)})`
          : `rgba(28,25,22,${alpha.toFixed(3)})`

        ctx!.strokeStyle = color
        const tipX = gx + cos * SHAFT_LEN
        const tipY = gy + sin * SHAFT_LEN
        const tailX = gx - cos * SHAFT_LEN
        const tailY = gy - sin * SHAFT_LEN

        // Shaft
        ctx!.lineWidth = 1.2
        ctx!.beginPath()
        ctx!.moveTo(tailX, tailY)
        ctx!.lineTo(tipX, tipY)
        ctx!.stroke()

        // Arrowhead — tighter V (144°)
        const headAngle = Math.PI - Math.PI / 5
        ctx!.lineWidth = 1.0
        ctx!.beginPath()
        ctx!.moveTo(tipX, tipY)
        ctx!.lineTo(
          tipX + Math.cos(angle + headAngle) * HEAD_SIZE,
          tipY + Math.sin(angle + headAngle) * HEAD_SIZE,
        )
        ctx!.stroke()
        ctx!.beginPath()
        ctx!.moveTo(tipX, tipY)
        ctx!.lineTo(
          tipX + Math.cos(angle - headAngle) * HEAD_SIZE,
          tipY + Math.sin(angle - headAngle) * HEAD_SIZE,
        )
        ctx!.stroke()
      }

      t += 0.004
      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
