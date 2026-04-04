'use client'

import { useEffect, useRef, useState } from 'react'

// ─── ElasticString ─────────────────────────────────────────────────────────────
// A taut horizontal line that bends toward the cursor like a guitar string.
// Physics: spring-damper system on the Bezier control point Y.
// On hover  → control point is pulled toward mouseY (capped at MAX_PULL)
// On leave  → target snaps back to center, string oscillates until damped

// ── Physics constants ──────────────────────────────────────────────────────────
const TENSION  = 0.042   // spring stiffness (lower = softer feel)
const DAMPING  = 0.88    // velocity damping per frame (0=no decay, 1=instant snap)
const MAX_PULL = 0.38    // max deflection as fraction of canvas height
const LERP_K   = 0.22    // how quickly targetY follows mouseY while hovering

export function ElasticString() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(true)
  const isDarkRef = useRef(isDark)

  // ── Theme detection ──────────────────────────────────────────────────────────
  useEffect(() => {
    const el = wrapperRef.current
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
    if (cardWrapper) {
      observer.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    }

    return () => observer.disconnect()
  }, [])

  // ── Canvas physics loop ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Capture non-nullable refs for inner functions
    const c: HTMLCanvasElement = canvas
    const cx: CanvasRenderingContext2D = ctx

    let rafId: number
    let alive = true

    // Physics state
    let ctrlY   = 0   // current control-point Y (offset from center)
    let velY    = 0   // velocity of control point
    let targetY = 0   // desired control-point Y (physics target)

    // Idle breath — slow sine oscillation so the string is never a dead line
    let idleT = 0

    // Mouse state
    let mouseX     = 0
    let isHovering = false

    // ── Sizing ────────────────────────────────────────────────────────────────
    function resize() {
      const dpr = window.devicePixelRatio || 1
      c.width  = c.offsetWidth  * dpr
      c.height = c.offsetHeight * dpr
      cx.scale(dpr, dpr)
      // Reset physics on resize
      ctrlY   = 0
      velY    = 0
      targetY = 0
    }

    const ro = new ResizeObserver(resize)
    ro.observe(c)
    resize()

    // ── Draw ──────────────────────────────────────────────────────────────────
    function draw() {
      const dpr = window.devicePixelRatio || 1
      const w   = c.width  / dpr
      const h   = c.height / dpr
      const cy  = h / 2         // vertical center in CSS pixels

      // Background fill
      cx.clearRect(0, 0, w, h)
      cx.fillStyle = isDarkRef.current ? '#110F0C' : '#F5F1EA'
      cx.fillRect(0, 0, w, h)

      const cptX = mouseX || w / 2  // control-point X tracks cursor X
      const cptY = cy + ctrlY        // control-point Y = center + deflection
      const isDk = isDarkRef.current

      // ── Glow pass — thick, faint ──────────────────────────────────────────
      cx.beginPath()
      cx.moveTo(0, cy)
      cx.quadraticCurveTo(cptX, cptY, w, cy)
      cx.lineWidth   = 8
      cx.lineCap     = 'round'
      cx.strokeStyle = isDk ? 'rgba(255,255,255,0.07)' : 'rgba(28,25,22,0.07)'
      cx.stroke()

      // ── Mid glow — medium alpha ───────────────────────────────────────────
      cx.beginPath()
      cx.moveTo(0, cy)
      cx.quadraticCurveTo(cptX, cptY, w, cy)
      cx.lineWidth   = 3
      cx.strokeStyle = isDk ? 'rgba(255,255,255,0.18)' : 'rgba(28,25,22,0.18)'
      cx.stroke()

      // ── Sharp pass — thin, bright ─────────────────────────────────────────
      cx.beginPath()
      cx.moveTo(0, cy)
      cx.quadraticCurveTo(cptX, cptY, w, cy)
      cx.lineWidth   = 1.5
      cx.strokeStyle = isDk ? 'rgba(255,255,255,0.72)' : 'rgba(28,25,22,0.72)'
      cx.stroke()

      // ── Pluck highlight dot at control point ──────────────────────────────
      // Fades in as deflection grows; invisible at rest
      const deflection = Math.abs(ctrlY)
      const maxDef     = h * MAX_PULL
      const dotAlpha   = Math.min(deflection / (maxDef * 0.5), 1) * 0.55
      if (dotAlpha > 0.01) {
        cx.beginPath()
        cx.arc(cptX, cptY, 3, 0, Math.PI * 2)
        cx.fillStyle = isDk
          ? `rgba(255,255,255,${dotAlpha.toFixed(3)})`
          : `rgba(28,25,22,${dotAlpha.toFixed(3)})`
        cx.fill()
      }
    }

    // ── Physics tick ──────────────────────────────────────────────────────────
    function tick() {
      if (!alive) return
      rafId = requestAnimationFrame(tick)

      idleT += 0.012

      // When idle (not hovering and physics settled), breathe gently
      const isSettled = !isHovering && Math.abs(ctrlY) < 2 && Math.abs(velY) < 0.5
      if (isSettled) {
        const dpr = window.devicePixelRatio || 1
        const h   = c.height / dpr
        const idleAmp = h * 0.028  // ~2.8% of height
        ctrlY = Math.sin(idleT) * idleAmp * Math.sin(idleT * 0.37 + 1.1)
        velY  = 0
      } else {
        // Spring-damper update
        velY  += (targetY - ctrlY) * TENSION
        velY  *= DAMPING
        ctrlY += velY

        // Snap to exactly zero when near rest and not hovering
        if (!isHovering && Math.abs(ctrlY) < 0.05 && Math.abs(velY) < 0.05) {
          ctrlY   = 0
          velY    = 0
          targetY = 0
        }
      }

      draw()
    }

    // ── Mouse handlers ────────────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      const rect   = c.getBoundingClientRect()
      const localX = e.clientX - rect.left
      const localY = e.clientY - rect.top

      mouseX = localX

      const dpr = window.devicePixelRatio || 1
      const h   = c.height / dpr
      const cy  = h / 2

      // Proximity weight: 1 when cursor is on the line, falls off quadratically
      const distFromCenter = localY - cy
      const proximity  = 1 - Math.min(Math.abs(distFromCenter) / (h * 0.5), 1)
      const strength   = proximity * proximity
      const rawPull    = distFromCenter * strength
      const maxPull    = h * MAX_PULL

      // Lerp targetY toward clamped pull value
      targetY += (Math.max(-maxPull, Math.min(maxPull, rawPull)) - targetY) * LERP_K
    }

    function onMouseEnter(e: MouseEvent) {
      isHovering = true
      onMouseMove(e)
    }

    function onMouseLeave() {
      isHovering = false
      targetY    = 0  // snap target to center — string vibrates to rest
    }

    c.addEventListener('mousemove',  onMouseMove)
    c.addEventListener('mouseenter', onMouseEnter)
    c.addEventListener('mouseleave', onMouseLeave)

    tick()

    return () => {
      alive = false
      cancelAnimationFrame(rafId)
      ro.disconnect()
      c.removeEventListener('mousemove',  onMouseMove)
      c.removeEventListener('mouseenter', onMouseEnter)
      c.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ display: 'block' }}
      />
    </div>
  )
}
