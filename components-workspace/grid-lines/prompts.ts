import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create an interactive canvas component called "Grid Lines" for Next.js using Tailwind and a raw HTML canvas (no Framer Motion — this is a canvas RAF animation).

The component fills its container with a grid of tiny square dots spaced 20px apart, connected by 0.5px horizontal and vertical lines. At rest the grid is barely visible — dots and lines hover at almost-invisible opacity. When the user hovers, two things happen at once around the cursor:

1. Brightness halo — a generous Gaussian glow lights the dots and lines near the cursor. The radius of the halo is 30% of the larger viewport dimension (so the lit area scales with the canvas), and the falloff is smooth Gaussian — no hard edge, it blends into the background.

2. Lens warp — the grid actually bends around the cursor like a magnifying lens. Each dot inside the radius gets displaced outward along the cursor→dot ray. The displacement amount follows a sin(πt) bell curve over distance — so dots right at the cursor stay put (centre of the lens), dots at the edge of the radius stay put (clean transition), and dots at MID-distance get pushed the most. Because the grid lines connect through the displaced dots, the entire grid visibly bulges around the cursor.

The two effects combine into a tactile, physical hover: the grid both lights up AND warps, like pressing on a stretched fabric of light.

Constants: SPACING=20, RADIUS_FRAC=0.30, LENS_FRAC=0.06 (push strength as fraction of R), BASE_A=0.13, PEAK_A=0.95, LINE_A_DARK=0.07, LINE_A_LIGHT=0.12.

Two themes: dark (near-black background #110F0C, white dots/lines) and light (warm cream #F5F1EA, dark dots/lines). Read the theme from the nearest [data-card-theme] ancestor or fall back to the <html> class. A centered label reads "Grid Lines" with a smaller uppercase subtitle "hover to illuminate". DPR-correct, ResizeObserver-based.`,

  Bolt: `Build a React component <GridLines /> using a canvas render loop (requestAnimationFrame). No animation libraries — plain useEffect + RAF.

Refs:
- containerRef on the root div
- canvasRef on the canvas element
- mouseRef<{x,y}|null> for cursor position
- isDarkRef<boolean> updated by a MutationObserver watching the [data-card-theme] ancestor and document.documentElement for class changes
- ResizeObserver on canvas.parentElement → calls build() on resize

Constants:
  SPACING      = 20
  RADIUS_FRAC  = 0.30   // hover radius = RADIUS_FRAC * max(cw, ch)
  LENS_FRAC    = 0.06   // lens push strength = LENS_FRAC * R
  BASE_A       = 0.13
  PEAK_A       = 0.95
  LINE_A_DARK  = 0.07
  LINE_A_LIGHT = 0.12

Types:
  type Dot     = { x: number; y: number; b: number; l: number; px: number; py: number }
  type Segment = { a: Dot; b: Dot }

Each dot stores its rest position (x, y), brightness (b, smoothed), lens influence (l, smoothed), and current displaced position (px, py — recomputed each frame).

build() (called on resize):
- DPR-scaled canvas, ctx.setTransform(dpr,0,0,dpr,0,0)
- cols = floor(cw/SPACING)+2, rows = floor(ch/SPACING)+2
- ox = (cw % SPACING) / 2, oy = (ch % SPACING) / 2 — centre the grid
- Build a 2D grid[r][c] of Dot { x, y, b: 0, l: 0, px: x, py: y }. Push them all to a flat dots array.
- Build hSegs (right neighbour, c+1<cols) and vSegs (down neighbour, r+1<rows)

frame() — per-dot pass, then lines through displaced positions, then dots:
1. R = RADIUS_FRAC * max(cw, ch); r2 = R * R; lensPush = LENS_FRAC * R
2. For each dot:
     dx = d.x - mx; dy = d.y - my; dist2 = dx² + dy²; dist = sqrt(dist2)

     // Brightness — Gaussian halo
     tgtB = dist2 < r2 ? Math.exp(-dist2 / (r2 * 0.45)) : 0
     d.b += (tgtB > d.b ? 0.16 : 0.07) * (tgtB - d.b)
     if d.b < 0.004: d.b = 0

     // Lens influence — sin(πt) bell, peaks at mid-distance
     tgtL = dist < R ? Math.sin(Math.PI * dist / R) : 0
     d.l += (tgtL > d.l ? 0.18 : 0.08) * (tgtL - d.l)
     if d.l < 0.004: d.l = 0

     // Displaced position
     if dist > 0.5 and d.l > 0.004:
       push = lensPush * d.l
       ux = dx / dist, uy = dy / dist
       d.px = d.x + ux * push
       d.py = d.y + uy * push
     else:
       d.px = d.x; d.py = d.y
3. For each segment in [...hSegs, ...vSegs]:
     segB  = (a.b + b.b) / 2
     lineA = lineRestA + (PEAK_A - lineRestA) * segB
     ctx.lineWidth = 0.5 + segB * 0.6      // lit segments fatten slightly
     stroke from (a.px, a.py) to (b.px, b.py)
4. For each dot:
     alpha = baseA + (PEAK_A - baseA) * d.b
     sz    = 1 + d.b * 2.2
     fillRect(d.px - sz/2, d.py - sz/2, sz, sz)

Theme: dark dotRGB='255,255,255', baseA=BASE_A=0.13. Light dotRGB='28,25,22', baseA=0.22. Background: dark #110F0C, light #F5F1EA.
Mouse handlers: onMouseMove → mouseRef = {x - rect.left, y - rect.top}; onMouseLeave → null. Mirror with onTouchMove (touches[0]) / onTouchEnd.
Cleanup: alive=false, cancelAnimationFrame(animId), ro.disconnect().
Overlay: centered "Grid Lines" (22px/700/letter-spacing -0.02em) + "hover to illuminate" (11px/600/uppercase/letter-spacing 0.12em).`,

  Lovable: `I'd love a component that feels like the grid is a sheet of light fabric and your cursor is a glass marble pressing into it.

Picture a near-black canvas filled edge-to-edge with a tight grid of tiny square dots, each connected to its neighbours above, below, left, and right by hairline lines. At rest the grid is barely visible — dots and lines sit at almost-invisible opacity. When you move your cursor in, two things happen at once:

First, a generous halo of brightness blooms around the cursor — large, about 30% of the bigger viewport dimension, with a soft Gaussian falloff that fades smoothly into the background. Inside the halo, dots and lines glow toward peak opacity.

Second, and this is the magic part: the grid actually warps. The dots near the cursor get pushed outward, away from the cursor, like a magnifying lens bulging the grid around itself. Dots right at the cursor stay put, dots at the edge of the halo stay put, but dots at mid-distance — about halfway between centre and edge — get pushed the most. Because the lines connect through these displaced dots, the whole grid bends around the cursor, like a sheet of fabric being lifted from below. As the cursor moves, the bulge moves with it, the grid flowing back to rest behind it.

Works in dark mode (warm black #110F0C background, white-tinted dots and lines) and light mode (warm cream #F5F1EA background, near-black dots and lines). A soft centered label floats in the middle: "Grid Lines" with a whisper of "hover to illuminate" beneath. Handle high-DPI screens and resize correctly.`,

  'Claude Code': `Create components-workspace/grid-lines/index.tsx with 'use client' at the top.

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

  Cursor: `Implement a React canvas component GridLines (components-workspace/grid-lines/index.tsx).

Architecture: a regular grid of dots connected by H/V hairline segments. On hover, a Gaussian halo lights the dots near the cursor AND a magnifying-lens warp pushes those same dots outward, bending the grid around the cursor.

Constants:
  SPACING=20, RADIUS_FRAC=0.30, LENS_FRAC=0.06
  BASE_A=0.13, PEAK_A=0.95
  LINE_A_DARK=0.07, LINE_A_LIGHT=0.12

Types:
  type Dot     = { x: number; y: number; b: number; l: number; px: number; py: number }
  type Segment = { a: Dot; b: Dot }

Refs: containerRef, canvasRef, mouseRef<{x,y}|null>, isDarkRef<boolean>
State: isDark for JSX background colour

Build (called on resize):
  - DPR canvas; cols=floor(cw/SPACING)+2, rows=floor(ch/SPACING)+2
  - ox=(cw%SPACING)/2, oy=(ch%SPACING)/2 — centred grid
  - 2D grid[][] of Dot { x, y, b: 0, l: 0, px: x, py: y }, flat dots[], hSegs (right neighbour) + vSegs (down neighbour)

Frame:
  - R         = RADIUS_FRAC * max(cw, ch)        // viewport-relative radius
  - r2        = R * R
  - lensPush  = LENS_FRAC * R
  - dotRGB    = isDark ? '255,255,255' : '28,25,22'
  - baseA     = isDark ? BASE_A : 0.22
  - lineRestA = isDark ? LINE_A_DARK : LINE_A_LIGHT

  Pass 1 — per-dot update:
    dist2 = (d.x-mx)² + (d.y-my)²; dist = sqrt(dist2)

    // Brightness — Gaussian halo
    tgtB = dist2 < r2 ? Math.exp(-dist2 / (r2 * 0.45)) : 0
    d.b += (tgtB > d.b ? 0.16 : 0.07) * (tgtB - d.b)
    clamp d.b to 0 when < 0.004

    // Lens influence — sin(πt) bell, peaks at mid-R
    tgtL = dist < R ? Math.sin(Math.PI * dist / R) : 0
    d.l += (tgtL > d.l ? 0.18 : 0.08) * (tgtL - d.l)
    clamp d.l to 0 when < 0.004

    // Displaced position
    if dist > 0.5 && d.l > 0.004:
      push = lensPush * d.l
      d.px = d.x + (dx/dist) * push
      d.py = d.y + (dy/dist) * push
    else:
      d.px = d.x; d.py = d.y

  Pass 2 — lines through displaced endpoints:
    segB  = (a.b + b.b) / 2
    lineA = lineRestA + (PEAK_A - lineRestA) * segB
    lineWidth = 0.5 + segB * 0.6
    stroke (a.px, a.py) → (b.px, b.py)

  Pass 3 — dots on top:
    alpha = baseA + (PEAK_A - baseA) * d.b
    sz    = 1 + d.b * 2.2
    fillRect centred on (d.px, d.py)

Canvas setup:
  - DPR scaling: canvas.width = round(clientWidth × dpr), ctx.setTransform(dpr,0,0,dpr,0,0)
  - ResizeObserver on canvas.parentElement → rebuild
  - RAF loop with alive guard for cleanup

Theme (dual):
  - Dark: bg '#110F0C', dotRGB '255,255,255', baseA = 0.13
  - Light: bg '#F5F1EA', dotRGB '28,25,22', baseA = 0.22
  - Detect via [data-card-theme] ancestor first, then document.documentElement class
  - isDarkRef (mutable, for RAF closure) + isDark state (for JSX re-render)
  - MutationObserver watches both documentElement and the card wrapper

Touch: mirror mouse via e.touches[0]

Overlay: centred "Grid Lines" (22px/700/letter-spacing -0.02em) + "hover to illuminate" (11px/600/uppercase/letter-spacing 0.12em)
No Framer Motion — pure canvas RAF loop.
TypeScript: no any types.`,
}
