import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create components-workspace/bubble-field/index.tsx with 'use client' at top.

Export: export function BubbleField()

Constants (module-level):
  const SPACING      = 20
  const RADIUS       = 200
  const BASE_R       = 1.5
  const BURST_R      = 16
  const BASE_A_DARK  = 0.55
  const BASE_A_LIGHT = 0.75

Type: type Bubble = { x: number; y: number; b: number; phase: number }

Refs: containerRef (div), canvasRef (canvas), mouseRef ({x,y}|null), isDarkRef (boolean)
State: isDark (boolean, default true)

Theme detection (useEffect):
  - el.closest('[data-card-theme]') → check classList.contains('dark')
  - Fallback: document.documentElement.classList.contains('dark')
  - MutationObserver on both documentElement and the card wrapper if present

Canvas useEffect (no deps):
  let bubbles: Bubble[] = []
  let animId = 0, alive = true, cw = 0, ch = 0

  build():
    dpr = devicePixelRatio || 1
    canvas size = clientBoundingRect × dpr; setTransform(dpr,0,0,dpr,0,0)
    cols = Math.floor(cw / SPACING) + 2
    rows = Math.floor(ch / SPACING) + 2
    ox = (cw % SPACING) / 2
    oy = (ch % SPACING) / 2
    bubbles = []
    for r 0..rows-1, c 0..cols-1:
      bubbles.push({ x: ox + c*SPACING, y: oy + r*SPACING, b: 0, phase: Math.random() })

  frame():
    clearRect
    mx/my from mouseRef (default -99999)
    r2 = RADIUS * RADIUS
    dotRGB = isDarkRef ? '255,255,255' : '28,25,22'
    baseA  = isDarkRef ? BASE_A_DARK : BASE_A_LIGHT

    for each bub:
      dist2 = (bub.x-mx)² + (bub.y-my)²
      tgt = dist2 < r2 ? Math.exp(-dist2 / (r2 * 0.25)) : 0
      bub.b += (tgt > bub.b ? 0.16 : 0.07) * (tgt - bub.b)
      if bub.b < 0.004: bub.b = 0

      if bub.b > 0.08:
        bub.phase = (bub.phase + 0.025 * bub.b) % 1

      const p = bub.phase

      if bub.b > 0.08:
        if p < 0.55:
          t = p / 0.55
          r = BASE_R + t * BURST_R
          alpha = baseA * (1 - t)
          if alpha > 0.004:
            strokeStyle = rgba(dotRGB, alpha.toFixed(3))
            lineWidth = 0.5
            beginPath; arc(bub.x, bub.y, r, 0, 2π); stroke
        else if p < 0.72:
          // popped — draw nothing
        else:
          t = (p - 0.72) / 0.28
          r = BASE_R * t
          alpha = baseA * t
          if r > 0.2 && alpha > 0.004:
            strokeStyle = rgba(dotRGB, alpha.toFixed(3))
            lineWidth = 0.5
            beginPath; arc(bub.x, bub.y, r, 0, 2π); stroke
      else:
        strokeStyle = rgba(dotRGB, baseA.toFixed(3))
        lineWidth = 0.5
        beginPath; arc(bub.x, bub.y, BASE_R, 0, 2π); stroke

    animId = requestAnimationFrame(frame)

  build(); frame()
  ResizeObserver on canvas.parentElement! → calls build()
  Cleanup: alive=false, cancelAnimationFrame(animId), ro.disconnect()

Mouse handlers: updateMouse(clientX, clientY) → subtract rect.left/top → mouseRef.current
Events on root div: onMouseMove, onMouseLeave (null), onTouchMove (touches[0]), onTouchEnd (null)

JSX:
  Root div: ref=containerRef, "relative h-full w-full overflow-hidden", style={{ background: bg }}
  Canvas: ref=canvasRef, "absolute inset-0", style={{ width: '100%', height: '100%' }}
  Overlay div: pointer-events-none, absolute inset-0, flex col center, gap-2
    span: "Bubble Field", fontSize 22, fontWeight 700, letterSpacing -0.02em
    span: "hover to burst", fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em

bg         = isDark ? '#110F0C' : '#F5F1EA'
labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(28,25,22,0.45)'
hintColor  = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(28,25,22,0.22)'

No 'any' types.`,
}
