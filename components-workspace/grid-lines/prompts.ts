import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GridLines\`. Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A full-bleed canvas of a dot grid connected by horizontal and vertical lines. The cursor does TWO things: (1) it brightens nearby dots and segments via a Gaussian halo, and (2) it bulges the grid outward via a lens influence that peaks at mid-distance and fades at the cursor itself and at the edge of R — the grid visibly warps like a magnifying lens as lines bend through the displaced dots.

Constants:
\`\`\`
SPACING      = 20
RADIUS_FRAC  = 0.30   // hover radius = fraction of max(cw, ch)
LENS_FRAC    = 0.06   // lens push strength = fraction of R
BASE_A       = 0.13   // resting dot opacity (dark)
PEAK_A       = 0.95
LINE_A_DARK  = 0.07   // resting line opacity dark
LINE_A_LIGHT = 0.12   // resting line opacity light
\`\`\`

Types:
\`\`\`
type Dot = { x: number; y: number; b: number; l: number; px: number; py: number }
type Segment = { a: Dot; b: Dot }
\`\`\`
\`x,y\` = rest position; \`b\` = smoothed brightness; \`l\` = smoothed lens influence; \`px,py\` = current displaced position recomputed each frame.

Build: cols = floor(cw/SPACING)+2, rows = floor(ch/SPACING)+2, ox = (cw%SPACING)/2, oy = (ch%SPACING)/2. Create a 2D grid array for neighbour lookup. Each dot starts with b=0, l=0, px=x, py=y. Build hSegs (c+1<cols) and vSegs (r+1<rows) from the grid.

Per-frame loop:
\`\`\`
R         = RADIUS_FRAC * max(cw, ch)
r2        = R * R
lensPush  = LENS_FRAC * R
dotRGB    = isDark ? '255,255,255' : '28,25,22'
baseA     = isDark ? BASE_A : 0.22
lineRestA = isDark ? LINE_A_DARK : LINE_A_LIGHT
\`\`\`

Pass 1 — per dot:
\`\`\`
dx = d.x - mx; dy = d.y - my
dist2 = dx*dx + dy*dy
dist  = Math.sqrt(dist2)

// Brightness — Gaussian halo
tgtB = dist2 < r2 ? Math.exp(-dist2 / (r2 * 0.45)) : 0
d.b += (tgtB > d.b ? 0.16 : 0.07) * (tgtB - d.b)
if d.b < 0.004: d.b = 0

// Lens — sin(πt) bell curve peaking at mid-distance
tgtL = dist < R ? Math.sin(Math.PI * (dist / R)) : 0
d.l += (tgtL > d.l ? 0.18 : 0.08) * (tgtL - d.l)
if d.l < 0.004: d.l = 0

// Displaced position — pushed outward along the cursor→dot ray
if dist > 0.5 and d.l > 0.004:
  push = lensPush * d.l
  ux = dx / dist; uy = dy / dist
  d.px = d.x + ux * push
  d.py = d.y + uy * push
else:
  d.px = d.x
  d.py = d.y
\`\`\`

Pass 2 — draw lines through displaced dot positions:
\`\`\`
for seg in [...hSegs, ...vSegs]:
  segB  = (seg.a.b + seg.b.b) / 2
  lineA = lineRestA + (PEAK_A - lineRestA) * segB
  strokeStyle = rgba(dotRGB, lineA.toFixed(3))
  lineWidth   = 0.5 + segB * 0.6
  beginPath; moveTo(seg.a.px, seg.a.py); lineTo(seg.b.px, seg.b.py); stroke
\`\`\`

Pass 3 — draw dots on top at displaced positions:
\`\`\`
for d in dots:
  alpha = baseA + (PEAK_A - baseA) * d.b
  sz    = 1 + d.b * 2.2
  fillStyle = rgba(dotRGB, alpha.toFixed(2))
  fillRect(d.px - sz/2, d.py - sz/2, sz, sz)
\`\`\`

Standard DPR canvas setup. ResizeObserver on canvas.parentElement rebuilds grid. Mouse handlers on outer div write {x: clientX - canvasRect.left, y: clientY - canvasRect.top}; onMouseLeave/onTouchEnd clears to null. Sentinel -99999.

Theme detection: walk containerRef.closest('[data-card-theme]'), fallback documentElement. MutationObserver on both. Mirror into isDarkRef + isDark state.

JSX: outer div relative h-full w-full overflow-hidden, bg '#110F0C' dark / '#F5F1EA' light. Canvas absolute inset-0 width/height 100%. Centered pointer-events-none overlay:
- "Grid Lines" — fontSize 22, fontWeight 700, letterSpacing -0.02em, color rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light
- "hover to illuminate" — fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em, color rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light

Cleanup: alive=false, cancelAnimationFrame, ro.disconnect, observer.disconnect.`,

  GPT: `Build a React client component named \`GridLines\`. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. Implement exactly what is specified — no more, no less.

## Constants
\`\`\`
SPACING      = 20
RADIUS_FRAC  = 0.30
LENS_FRAC    = 0.06
BASE_A       = 0.13
PEAK_A       = 0.95
LINE_A_DARK  = 0.07
LINE_A_LIGHT = 0.12
\`\`\`

## Types
\`\`\`
type Dot     = { x: number; y: number; b: number; l: number; px: number; py: number }
type Segment = { a: Dot; b: Dot }
\`\`\`

## Refs & state
containerRef, canvasRef, mouseRef ({x,y}|null), isDarkRef (boolean), isDark state (default true).

## Theme detection
closest('[data-card-theme]') → .dark class, else documentElement. MutationObserver attributeFilter ['class'] on both. Mirror into ref and state.

## Canvas setup + build
\`\`\`
const dpr = window.devicePixelRatio || 1
const rect = canvas.getBoundingClientRect()
cw = rect.width; ch = rect.height
canvas.width = Math.round(cw * dpr)
canvas.height = Math.round(ch * dpr)
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

cols = Math.floor(cw / SPACING) + 2
rows = Math.floor(ch / SPACING) + 2
ox = (cw % SPACING) / 2
oy = (ch % SPACING) / 2

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

hSegs = []; vSegs = []
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (c + 1 < cols) hSegs.push({ a: grid[r][c], b: grid[r][c + 1] })
    if (r + 1 < rows) vSegs.push({ a: grid[r][c], b: grid[r + 1][c] })
  }
}
\`\`\`

## Per-frame loop
\`\`\`
ctx.clearRect(0, 0, cw, ch)
mx = mouseRef.current?.x ?? -99999
my = mouseRef.current?.y ?? -99999
R         = RADIUS_FRAC * Math.max(cw, ch)
r2        = R * R
lensPush  = LENS_FRAC * R
dotRGB    = isDarkRef.current ? '255,255,255' : '28,25,22'
baseA     = isDarkRef.current ? BASE_A : 0.22
lineRestA = isDarkRef.current ? LINE_A_DARK : LINE_A_LIGHT

// Pass 1 — per dot
for (const d of dots) {
  dx = d.x - mx; dy = d.y - my
  dist2 = dx*dx + dy*dy
  dist  = Math.sqrt(dist2)

  tgtB = dist2 < r2 ? Math.exp(-dist2 / (r2 * 0.45)) : 0
  d.b += (tgtB > d.b ? 0.16 : 0.07) * (tgtB - d.b)
  if (d.b < 0.004) d.b = 0

  tgtL = dist < R ? Math.sin(Math.PI * (dist / R)) : 0
  d.l += (tgtL > d.l ? 0.18 : 0.08) * (tgtL - d.l)
  if (d.l < 0.004) d.l = 0

  if (dist > 0.5 && d.l > 0.004) {
    const push = lensPush * d.l
    const ux = dx / dist
    const uy = dy / dist
    d.px = d.x + ux * push
    d.py = d.y + uy * push
  } else {
    d.px = d.x
    d.py = d.y
  }
}

// Pass 2 — lines via displaced positions
for (const seg of [...hSegs, ...vSegs]) {
  const segB  = (seg.a.b + seg.b.b) / 2
  const lineA = lineRestA + (PEAK_A - lineRestA) * segB
  ctx.strokeStyle = \`rgba(\${dotRGB},\${lineA.toFixed(3)})\`
  ctx.lineWidth = 0.5 + segB * 0.6
  ctx.beginPath()
  ctx.moveTo(seg.a.px, seg.a.py)
  ctx.lineTo(seg.b.px, seg.b.py)
  ctx.stroke()
}

// Pass 3 — dots on top at displaced positions
for (const d of dots) {
  const alpha = baseA + (PEAK_A - baseA) * d.b
  const sz    = 1 + d.b * 2.2
  ctx.fillStyle = \`rgba(\${dotRGB},\${alpha.toFixed(2)})\`
  ctx.fillRect(d.px - sz/2, d.py - sz/2, sz, sz)
}

animId = requestAnimationFrame(frame)
\`\`\`

## Resize
ResizeObserver on canvas.parentElement runs build().

## Pointer
onMouseMove/onTouchMove on outer div → mouseRef = {x: clientX - canvasRect.left, y: clientY - canvasRect.top}. onMouseLeave/onTouchEnd → null.

## JSX
\`\`\`tsx
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }} ...handlers>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span style={{ color: labelColor, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Grid Lines</span>
    <span style={{ color: hintColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>hover to illuminate</span>
  </div>
</div>
\`\`\`
labelColor rgba(255,255,255,0.45) / rgba(28,25,22,0.45). hintColor rgba(255,255,255,0.18) / rgba(28,25,22,0.22).

## Cleanup
alive=false; cancelAnimationFrame(animId); ro.disconnect(); observer.disconnect().`,

  Gemini: `Implement a React client component named \`GridLines\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useEffect, useRef, useState } from 'react'
\`\`\`
No framer-motion. Pure canvas.

## API guardrails
USE only: useEffect, useRef, useState, requestAnimationFrame, cancelAnimationFrame, ResizeObserver, MutationObserver, CanvasRenderingContext2D. DO NOT invent \`useCanvas\`, \`useAnimationFrame\`, \`useMotionValue\`, \`useSpringValue\`, or any helper not listed.

## Concept
A dot grid connected by horizontal and vertical lines. The cursor has two effects: (1) it brightens nearby dots and lines via a Gaussian halo; (2) a "lens" influence bulges the grid outward — dots at mid-distance from the cursor get the strongest outward push (sin(πt) bell curve), while dots at the cursor itself and at the edge of the radius stay put. Lines bend as they cross the lens, making the grid visibly warp.

## Constants
\`\`\`
const SPACING      = 20
const RADIUS_FRAC  = 0.30
const LENS_FRAC    = 0.06
const BASE_A       = 0.13
const PEAK_A       = 0.95
const LINE_A_DARK  = 0.07
const LINE_A_LIGHT = 0.12
\`\`\`

## Types
\`\`\`
type Dot     = { x: number; y: number; b: number; l: number; px: number; py: number }
type Segment = { a: Dot; b: Dot }
\`\`\`

## Refs & state
containerRef (HTMLDivElement), canvasRef (HTMLCanvasElement), mouseRef ({x,y}|null), isDarkRef (boolean default true), isDark state (default true).

## Theme detection effect (verbatim)
\`\`\`
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
\`\`\`

## Canvas DPR scaffolding (inline verbatim)
\`\`\`
const dpr = window.devicePixelRatio || 1
const rect = canvas.getBoundingClientRect()
canvas.width = Math.round(rect.width * dpr)
canvas.height = Math.round(rect.height * dpr)
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
\`\`\`

## Build dots + segments
\`\`\`
const cols = Math.floor(cw / SPACING) + 2
const rows = Math.floor(ch / SPACING) + 2
const ox = (cw % SPACING) / 2
const oy = (ch % SPACING) / 2

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
hSegs = []; vSegs = []
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (c + 1 < cols) hSegs.push({ a: grid[r][c], b: grid[r][c + 1] })
    if (r + 1 < rows) vSegs.push({ a: grid[r][c], b: grid[r + 1][c] })
  }
}
\`\`\`

## Frame loop (verbatim math, three passes)
\`\`\`
ctx.clearRect(0, 0, cw, ch)
const mx = mouseRef.current?.x ?? -99999
const my = mouseRef.current?.y ?? -99999
const R         = RADIUS_FRAC * Math.max(cw, ch)
const r2        = R * R
const lensPush  = LENS_FRAC * R
const dotRGB    = isDarkRef.current ? '255,255,255' : '28,25,22'
const baseA     = isDarkRef.current ? BASE_A : 0.22
const lineRestA = isDarkRef.current ? LINE_A_DARK : LINE_A_LIGHT

// Pass 1: brightness, lens, displaced position
for (const d of dots) {
  const dx = d.x - mx
  const dy = d.y - my
  const dist2 = dx*dx + dy*dy
  const dist = Math.sqrt(dist2)

  const tgtB = dist2 < r2 ? Math.exp(-dist2 / (r2 * 0.45)) : 0
  d.b += (tgtB > d.b ? 0.16 : 0.07) * (tgtB - d.b)
  if (d.b < 0.004) d.b = 0

  const tgtL = dist < R ? Math.sin(Math.PI * (dist / R)) : 0
  d.l += (tgtL > d.l ? 0.18 : 0.08) * (tgtL - d.l)
  if (d.l < 0.004) d.l = 0

  if (dist > 0.5 && d.l > 0.004) {
    const push = lensPush * d.l
    const ux = dx / dist
    const uy = dy / dist
    d.px = d.x + ux * push
    d.py = d.y + uy * push
  } else {
    d.px = d.x
    d.py = d.y
  }
}

// Pass 2: draw lines through displaced positions
const allSegs = [...hSegs, ...vSegs]
for (const seg of allSegs) {
  const segB  = (seg.a.b + seg.b.b) / 2
  const lineA = lineRestA + (PEAK_A - lineRestA) * segB
  ctx.strokeStyle = \`rgba(\${dotRGB},\${lineA.toFixed(3)})\`
  ctx.lineWidth = 0.5 + segB * 0.6
  ctx.beginPath()
  ctx.moveTo(seg.a.px, seg.a.py)
  ctx.lineTo(seg.b.px, seg.b.py)
  ctx.stroke()
}

// Pass 3: draw dots on top
for (const d of dots) {
  const alpha = baseA + (PEAK_A - baseA) * d.b
  const sz = 1 + d.b * 2.2
  ctx.fillStyle = \`rgba(\${dotRGB},\${alpha.toFixed(2)})\`
  ctx.fillRect(d.px - sz/2, d.py - sz/2, sz, sz)
}
\`\`\`

## Pointer + resize
onMouseMove/onTouchMove on outer div → mouseRef = {x: clientX - canvasRect.left, y: clientY - canvasRect.top}. onMouseLeave/onTouchEnd → null. ResizeObserver on canvas.parentElement re-runs build().

## JSX
Outer div: className "relative h-full w-full overflow-hidden", style background '#110F0C' dark / '#F5F1EA' light, with mouse/touch handlers. Canvas absolute inset-0 width/height 100%. Centered pointer-events-none overlay (flex-col items-center justify-center gap-2):
- "Grid Lines" — fontSize 22, fontWeight 700, letterSpacing -0.02em, color rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light
- "hover to illuminate" — fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em, color rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light

## Cleanup
alive=false; cancelAnimationFrame(animId); ro.disconnect(); observer.disconnect().`,

  V0: `Create a React client component named \`GridLines\`. Single file, TypeScript, \`'use client'\` at the top. Use \`useEffect\`, \`useRef\`, and \`useState\` from React — no other libraries, no framer-motion. Pure canvas. The component fills its parent (\`h-full w-full\`) and supports both light and dark themes.

## The visual
A quiet, architectural dot-grid lattice drawn on a full-bleed canvas: small dots sit at every intersection, with thin horizontal and vertical lines running between them — like graph paper. At rest the whole thing is barely-there, just a hint of structure in the background. When you move the cursor over it, two things happen at once:

1. A soft Gaussian halo of illumination follows the pointer. Dots inside it brighten and fatten, and the connecting lines brighten with them — so hovering reveals a warm patch of graph paper inside an otherwise dim field.
2. The grid physically bulges outward around the cursor, like a magnifying lens pressed against it. Dots at mid-distance from the pointer get the strongest outward push, while dots directly under the cursor and dots at the very edge of the influence radius don't move at all — the push follows a \`sin(π·t)\` bell curve. Because both endpoints of every line are being shoved around, the lines bend as they cross the halo. The lattice visibly warps.

When the cursor leaves, everything smoothly settles back into place over about a second.

Centered in the frame are two overlay labels:
- A title reading exactly \`Grid Lines\` — 22px, font-weight 700, letter-spacing -0.02em.
- Below it, a hint reading exactly \`hover to illuminate\` — 11px, font-weight 600, uppercase, letter-spacing 0.12em.

Both labels sit above the canvas with \`pointer-events-none\` so they never block the hover. On dark, they use \`rgba(255,255,255,0.45)\` and \`rgba(255,255,255,0.18)\`. On light, \`rgba(28,25,22,0.45)\` and \`rgba(28,25,22,0.22)\`.

## Theme
Detect theme by checking \`.closest('[data-card-theme]')\` for a \`.dark\` class, falling back to \`document.documentElement.classList.contains('dark')\`. Track it with \`useState isDark\` plus an \`isDarkRef\` for the render loop. Watch for theme changes with a \`MutationObserver\` listening for class attribute changes on \`documentElement\` (and on the card wrapper if present).

Background: \`#110F0C\` on dark, \`#F5F1EA\` on light — set as an inline style on the outer container. The dots and lines themselves are drawn white (\`255,255,255\`) on dark and near-black (\`28,25,22\`) on light.

## Key constants
- \`SPACING = 20\` — pixels between dot centres
- \`RADIUS_FRAC = 0.30\` — hover influence radius as a fraction of \`max(cw, ch)\` (so on a 480px preview the halo is ~144px wide)
- \`LENS_FRAC = 0.06\` — maximum outward lens push, as a fraction of the radius (subtle warp, not a fisheye)
- resting dot alpha: \`0.13\` on dark, \`0.22\` on light
- resting line alpha: \`0.07\` on dark, \`0.12\` on light
- peak lit alpha: \`0.95\`
- mouse smoothing factor: \`0.14\` (easing the raw cursor position toward its target every frame so the warp glides rather than snaps)

## Canvas setup
Standard DPR scaffolding: read \`devicePixelRatio\`, measure the canvas with \`getBoundingClientRect\`, set \`canvas.width/height\` to the rounded scaled pixels, and \`ctx.setTransform(dpr,0,0,dpr,0,0)\`. Rebuild on resize via a \`ResizeObserver\` on \`canvas.parentElement\`.

Build a flat \`dots\` array plus a 2D \`grid[row][col]\` lookup at the same time. Use \`Math.floor(cw/SPACING)+2\` columns and rows so the grid fully overruns the bleed, offset by \`(cw%SPACING)/2\` and \`(ch%SPACING)/2\` so it sits visually centred. Each dot stores \`{ x, y, b, l, px, py }\`:
- \`x, y\` — the dot's rest position
- \`b\` — smoothed brightness (0→1)
- \`l\` — smoothed lens influence (0→1)
- \`px, py\` — current displaced position, recomputed every frame

After the dot pass, build two segment arrays: \`hSegs\` (each dot paired with its right neighbour, when one exists) and \`vSegs\` (each dot paired with the dot below). Each segment is just \`{ a: Dot, b: Dot }\` — store references, not copies, so the draw pass automatically picks up the displaced positions.

On resize, map the old dots by their rounded \`x,y\` string key so their brightness and lens values persist across the rebuild — no flicker when the preview box changes size.

## The frame loop
On every animation frame, clear the canvas, then:

1. Smooth the mouse. Keep a \`smoothMx, smoothMy\` pair in the effect closure. If there's a raw cursor position, ease the smoothed values toward it by \`0.14\` per frame. If the cursor left, reset both smoothed values to an off-screen sentinel like \`-99999\` so the distance math naturally excludes every dot.
2. Compute \`R = RADIUS_FRAC * max(cw, ch)\`, \`r2 = R*R\`, and \`lensPush = LENS_FRAC * R\`. Pick \`dotRGB\`, \`baseA\` (resting dot alpha) and \`lineRestA\` (resting line alpha) from the current theme.

### Pass 1 — update every dot
For each dot, compute \`dx = x - mx\`, \`dy = y - my\`, and both \`dist2\` and \`dist\`.

- **Brightness target** — a Gaussian halo: \`tgtB = dist2 < r2 ? Math.exp(-dist2 / (r2 * 0.45)) : 0\`. This gives a soft, creamy falloff rather than a hard circle.
- **Lens target** — a sine bell curve: \`tgtL = dist < R ? Math.sin(Math.PI * (dist / R)) : 0\`. Peaks at mid-radius, hits zero at the cursor itself and at the edge of R.

Ease both values toward their targets asymmetrically — fast on the way up, slow on the way down. Use \`0.16\` rising / \`0.07\` falling for brightness, and \`0.18\` rising / \`0.08\` falling for lens influence. Snap either one to 0 when it drops below \`0.004\` so idle dots don't keep burning cycles.

Then compute the displaced position. If \`dist > 0.5\` and \`l > 0.004\`, push the dot outward along the cursor→dot unit ray by \`lensPush * l\` pixels:
\`\`\`
push = lensPush * d.l
ux = dx / dist; uy = dy / dist
d.px = d.x + ux * push
d.py = d.y + uy * push
\`\`\`
Otherwise \`px = x\`, \`py = y\`.

### Pass 2 — draw the lines through the displaced positions
Iterate all segments (\`[...hSegs, ...vSegs]\`). For each segment, average the brightness of its two endpoints: \`segB = (a.b + b.b) / 2\`. Line alpha lerps from \`lineRestA\` toward \`0.95\` by \`segB\`. Line width grows from \`0.5\` to \`1.1\` (\`0.5 + segB * 0.6\`). Draw from \`a.px, a.py\` to \`b.px, b.py\` — because both endpoints have been displaced, the lines naturally bend as they cross the halo.

### Pass 3 — draw the dots on top at their displaced positions
For each dot: \`alpha = baseA + (0.95 - baseA) * b\`, \`sz = 1 + b * 2.2\`. Fill a small square at \`(px - sz/2, py - sz/2)\` using \`ctx.fillRect\`. Dots land on top of their own lines.

## Interaction
Attach \`onMouseMove\`, \`onMouseLeave\`, \`onTouchMove\`, \`onTouchEnd\` to the outer container. On move, read the canvas's \`getBoundingClientRect\` and store \`{ x: clientX - rect.left, y: clientY - rect.top }\` in \`mouseRef.current\`. On leave/end, set it to \`null\`. Touch follows the same pattern using \`e.touches[0]\`.

## Structure
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: ... }} ...handlers>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span>Grid Lines</span>
    <span>hover to illuminate</span>
  </div>
</div>
\`\`\`

## Cleanup
Use an \`alive\` flag inside the effect and guard the frame loop with it. On unmount: set \`alive = false\`, \`cancelAnimationFrame\`, disconnect the \`ResizeObserver\`, and disconnect the theme \`MutationObserver\`. No leaks.

The finished piece should read as a quiet piece of graph paper most of the time, and as a warm, magnified lens that gently warps the lattice whenever the cursor passes over it.`,
}
