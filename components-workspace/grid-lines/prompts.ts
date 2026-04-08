import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create components-workspace/grid-lines/index.tsx with 'use client' at the top.

Export: export function GridLines()

Constants (module-level):
  const SPACING      = 20
  const RADIUS_FRAC  = 0.30   // hover radius as fraction of max(cw, ch)
  const LENS_FRAC    = 0.06   // lens push strength as fraction of R
  const BASE_A       = 0.13
  const PEAK_A       = 0.95
  const LINE_A_DARK  = 0.07
  const LINE_A_LIGHT = 0.12

Types:
  type Dot     = { x: number; y: number; b: number; l: number; px: number; py: number }
  type Segment = { a: Dot; b: Dot }

Each dot stores its rest position (x, y), brightness (b, smoothed), lens influence (l, smoothed), and current displaced position (px, py — recomputed each frame).

Refs: containerRef<HTMLDivElement>, canvasRef<HTMLCanvasElement>, mouseRef<{x,y}|null>, isDarkRef<boolean> (default true).
State: isDark (boolean, default true) — used only for the JSX background colour.

Theme detection (useEffect):
  - el.closest('[data-card-theme]') → check classList.contains('dark')
  - Fallback: document.documentElement.classList.contains('dark')
  - MutationObserver on documentElement AND on the card wrapper if present (attributeFilter ['class'])

Canvas useEffect (no deps):
  let dots: Dot[] = []
  let hSegs: Segment[] = []
  let vSegs: Segment[] = []
  let animId = 0, alive = true, cw = 0, ch = 0

  build():
    dpr = devicePixelRatio || 1
    rect = canvas.getBoundingClientRect(); cw = rect.width; ch = rect.height
    canvas.width = round(cw*dpr); canvas.height = round(ch*dpr); ctx.setTransform(dpr,0,0,dpr,0,0)
    cols = floor(cw/SPACING)+2; rows = floor(ch/SPACING)+2
    ox = (cw%SPACING)/2; oy = (ch%SPACING)/2
    For each (r,c): x = ox+c*SPACING, y = oy+r*SPACING
                    Push Dot { x, y, b: 0, l: 0, px: x, py: y } to grid[r][c] and dots[]
    Build hSegs (c+1<cols) and vSegs (r+1<rows) by reading from grid[][]

  frame():
    clearRect
    mx/my from mouseRef (default -99999)
    R = RADIUS_FRAC * max(cw, ch)
    r2 = R*R
    lensPush = LENS_FRAC * R
    dotRGB = isDarkRef ? '255,255,255' : '28,25,22'
    baseA  = isDarkRef ? BASE_A : 0.22
    lineRestA = isDarkRef ? LINE_A_DARK : LINE_A_LIGHT

    // 1. Per-dot: brightness, lens influence, displaced position
    for each d in dots:
      dx = d.x - mx; dy = d.y - my; dist2 = dx*dx + dy*dy; dist = sqrt(dist2)

      // Brightness — Gaussian halo
      tgtB = dist2 < r2 ? Math.exp(-dist2 / (r2 * 0.45)) : 0
      d.b += (tgtB > d.b ? 0.16 : 0.07) * (tgtB - d.b)
      if d.b < 0.004: d.b = 0

      // Lens influence — sin(πt) bell curve, peaks at mid-distance
      tgtL = dist < R ? Math.sin(Math.PI * (dist / R)) : 0
      d.l += (tgtL > d.l ? 0.18 : 0.08) * (tgtL - d.l)
      if d.l < 0.004: d.l = 0

      // Displaced position — push outward along cursor→dot ray
      if dist > 0.5 and d.l > 0.004:
        push = lensPush * d.l
        ux = dx / dist; uy = dy / dist
        d.px = d.x + ux * push
        d.py = d.y + uy * push
      else:
        d.px = d.x
        d.py = d.y

    // 2. Draw lines through displaced positions
    for seg in [...hSegs, ...vSegs]:
      segB  = (a.b + b.b) / 2
      lineA = lineRestA + (PEAK_A - lineRestA) * segB
      strokeStyle = rgba(dotRGB, lineA)
      lineWidth   = 0.5 + segB * 0.6
      beginPath; moveTo(a.px, a.py); lineTo(b.px, b.py); stroke

    // 3. Draw dots on top at displaced positions
    for d in dots:
      alpha = baseA + (PEAK_A-baseA)*d.b
      sz = 1 + d.b * 2.2
      fillStyle = rgba(dotRGB, alpha)
      fillRect(d.px - sz/2, d.py - sz/2, sz, sz)

    animId = requestAnimationFrame(frame)

  build(); frame()
  ResizeObserver on canvas.parentElement! → calls build()
  Cleanup: alive=false, cancelAnimationFrame(animId), ro.disconnect()

Mouse handlers: updateMouse(clientX, clientY) → subtract rect.left/top → mouseRef.current
Events on root div: onMouseMove, onMouseLeave (null), onTouchMove (touches[0]), onTouchEnd (null)

JSX:
  Root div: ref=containerRef, "relative h-full w-full overflow-hidden", style={{ background: bg }}
  Canvas: ref=canvasRef, "absolute inset-0", style={{ width:'100%', height:'100%' }}
  Overlay div: pointer-events-none, absolute inset-0, flex col center, gap-2
    span: "Grid Lines", fontSize 22, fontWeight 700, letterSpacing -0.02em
    span: "hover to illuminate", fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em

bg         = isDark ? '#110F0C' : '#F5F1EA'
labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(28,25,22,0.45)'
hintColor  = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(28,25,22,0.22)'

No 'any' types.`,
}
