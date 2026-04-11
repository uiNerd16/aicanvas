import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`DistortionGrid\`. Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A full-bleed canvas renders a grid of horizontal and vertical lines that undulate with low-frequency sine waves. When the mouse is over the canvas, (a) amplitude grows globally via a smoothed hoverStr, and (b) a radial gaussian repulsion pushes lines away from the cursor, leaving a bulged "void" around it.

Constants:
\`\`\`
SPACING      = 32      // px between grid points at rest
BASE_AMP     = 30      // px — resting wave amplitude
WAVE_FREQ    = 0.007   // ~900px wavelength
HOVER_BOOST  = 1.5     // global amp multiplier on full hover
LOCAL_AMP    = 60      // px repulsion strength
LOCAL_RADIUS = 260     // px repulsion radius
LINE_A_DARK  = 0.55
LINE_A_LIGHT = 0.75
\`\`\`

Build: cols = floor(cw/SPACING)+2, rows = floor(ch/SPACING)+2, ox = (cw%SPACING)/2, oy = (ch%SPACING)/2. Store cols/rows/ox/oy; no per-point state.

Per-frame loop:
- t += 0.002
- hoverStr += ((mouseRef.current ? 1 : 0) - hoverStr) * (hasHover ? 0.018 : 0.010)
- amp = BASE_AMP * (1 + hoverStr * HOVER_BOOST)

displaced(c, r) → [x, y]:
\`\`\`
rx = ox + c * SPACING
ry = oy + r * SPACING
wx = amp * (sin(rx * WAVE_FREQ + t) + sin(ry * WAVE_FREQ * 0.6 + t * 1.3) * 0.55)
wy = amp * (cos(ry * WAVE_FREQ * 0.8 + t * 1.15) + cos(rx * WAVE_FREQ * 0.5 + t * 0.75) * 0.55)
dx = rx - mx; dy = ry - my; dist2 = dx*dx + dy*dy
if dist2 < (LOCAL_RADIUS*LOCAL_RADIUS)*4:
  push = LOCAL_AMP * exp(-dist2 / ((LOCAL_RADIUS*LOCAL_RADIUS) * 0.5))
  dist = sqrt(dist2) || 1
  px = (dx/dist) * push; py = (dy/dist) * push
else: px = py = 0
return [rx + wx + px, ry + wy + py]
\`\`\`

Draw horizontal lines: for each row, beginPath, moveTo displaced(0,r), lineTo displaced(c,r) for c=1..cols-1, stroke. Vertical similarly. strokeStyle = rgba(dotRGB, lineA.toFixed(3)), lineWidth 0.5. dotRGB = dark ? '255,255,255' : '28,25,22'; lineA = dark ? 0.55 : 0.75.

Standard DPR setup. ResizeObserver rebuilds. Mouse handlers on outer div update mouseRef to canvas-local coords; onMouseLeave/onTouchEnd set to null. Theme detection: walk closest('[data-card-theme]'), fallback to documentElement.dark; MutationObserver on both; mirror into isDarkRef + isDark state.

JSX: outer div relative h-full w-full overflow-hidden, bg '#110F0C' dark / '#F5F1EA' light. Canvas absolute inset-0 width/height 100%. Centered overlay:
- "Distortion Grid" — 22px 700 -0.02em, color rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light
- "hover to warp" — 11px 600 uppercase 0.12em, color rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light

Cleanup: alive=false, cancelAnimationFrame, ro.disconnect, observer.disconnect.`,

  GPT: `Build a React client component named \`DistortionGrid\`. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Constants
\`\`\`
SPACING      = 32
BASE_AMP     = 30
WAVE_FREQ    = 0.007
HOVER_BOOST  = 1.5
LOCAL_AMP    = 60
LOCAL_RADIUS = 260
LINE_A_DARK  = 0.55
LINE_A_LIGHT = 0.75
\`\`\`

## Refs & state
containerRef, canvasRef, mouseRef ({x,y}|null), isDarkRef (boolean), isDark state (default true).

## Theme detection
Walk \`closest('[data-card-theme]')\` → its .dark class; else \`documentElement.classList.contains('dark')\`. MutationObserver attributeFilter ['class'] on documentElement and card wrapper. Writes both ref and state.

## Canvas setup
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
\`\`\`
No per-point state.

## Per-frame loop
\`\`\`
t += 0.002
const hasHover = mouseRef.current !== null
hoverStr += ((hasHover ? 1 : 0) - hoverStr) * (hasHover ? 0.018 : 0.010)
ctx.clearRect(0, 0, cw, ch)

dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'
lineA  = isDarkRef.current ? 0.55 : 0.75
mx = mouseRef.current?.x ?? -99999
my = mouseRef.current?.y ?? -99999
r2 = LOCAL_RADIUS * LOCAL_RADIUS
amp = BASE_AMP * (1 + hoverStr * HOVER_BOOST)
\`\`\`

## displaced(c, r)
\`\`\`
rx = ox + c * SPACING
ry = oy + r * SPACING
wx = amp * (Math.sin(rx * WAVE_FREQ + t) + Math.sin(ry * WAVE_FREQ * 0.6 + t * 1.3) * 0.55)
wy = amp * (Math.cos(ry * WAVE_FREQ * 0.8 + t * 1.15) + Math.cos(rx * WAVE_FREQ * 0.5 + t * 0.75) * 0.55)
dx = rx - mx; dy = ry - my
dist2 = dx*dx + dy*dy
px = 0; py = 0
if (dist2 < r2 * 4) {
  push = LOCAL_AMP * Math.exp(-dist2 / (r2 * 0.5))
  dist = Math.sqrt(dist2) || 1
  px = (dx / dist) * push
  py = (dy / dist) * push
}
return [rx + wx + px, ry + wy + py]
\`\`\`

## Draw
strokeStyle = \`rgba(\${dotRGB},\${lineA.toFixed(3)})\`; lineWidth = 0.5.

Horizontal lines — one per row:
\`\`\`
for (let r = 0; r < rows; r++) {
  ctx.beginPath()
  const [x0, y0] = displaced(0, r); ctx.moveTo(x0, y0)
  for (let c = 1; c < cols; c++) {
    const [x, y] = displaced(c, r); ctx.lineTo(x, y)
  }
  ctx.stroke()
}
\`\`\`

Vertical lines — one per col:
\`\`\`
for (let c = 0; c < cols; c++) {
  ctx.beginPath()
  const [x0, y0] = displaced(c, 0); ctx.moveTo(x0, y0)
  for (let r = 1; r < rows; r++) {
    const [x, y] = displaced(c, r); ctx.lineTo(x, y)
  }
  ctx.stroke()
}
\`\`\`

## Resize
ResizeObserver on canvas.parentElement re-runs build() (re-sizes AND recomputes cols/rows/ox/oy).

## Pointer
onMouseMove/onTouchMove on outer div → mouseRef = {x: clientX - canvasRect.left, y: clientY - canvasRect.top}. onMouseLeave/onTouchEnd → mouseRef.current = null.

## JSX
\`\`\`tsx
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }} ...handlers>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span style={{ color: labelColor, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Distortion Grid</span>
    <span style={{ color: hintColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>hover to warp</span>
  </div>
</div>
\`\`\`
labelColor rgba(255,255,255,0.45) / rgba(28,25,22,0.45). hintColor rgba(255,255,255,0.18) / rgba(28,25,22,0.22).

## Cleanup
alive=false; cancelAnimationFrame; ro.disconnect(); observer.disconnect().`,

  Gemini: `Implement a React client component named \`DistortionGrid\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useEffect, useRef, useState } from 'react'
\`\`\`
No framer-motion. Pure canvas.

## API guardrails
USE only: useEffect, useRef, useState, requestAnimationFrame, cancelAnimationFrame, ResizeObserver, MutationObserver, CanvasRenderingContext2D. DO NOT invent \`useCanvas\`, \`useAnimationFrame\`, \`useMotionValue\`, helpers not listed.

## Concept
A full-bleed canvas draws a warping grid of horizontal and vertical lines. Long-wavelength sine waves make the grid gently undulate at all times. When the cursor is anywhere on the canvas, two things happen: (1) global wave amplitude grows via a smoothed hover strength; (2) a gaussian radial repulsion around the cursor pushes nearby lines outward, creating a visible bulge/void.

## Constants
\`\`\`
const SPACING      = 32
const BASE_AMP     = 30
const WAVE_FREQ    = 0.007
const HOVER_BOOST  = 1.5
const LOCAL_AMP    = 60
const LOCAL_RADIUS = 260
const LINE_A_DARK  = 0.55
const LINE_A_LIGHT = 0.75
\`\`\`

## Refs & state
containerRef (HTMLDivElement), canvasRef (HTMLCanvasElement), mouseRef ({x:number;y:number}|null), isDarkRef (boolean default true), isDark state (default true).

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
Then: cw = rect.width; ch = rect.height; cols = floor(cw/SPACING)+2; rows = floor(ch/SPACING)+2; ox = (cw%SPACING)/2; oy = (ch%SPACING)/2.

## Effect-scoped state
let t = 0; let hoverStr = 0; let animId = 0; let alive = true.

## Frame loop (verbatim)
\`\`\`
if (!alive) return
t += 0.002
const hasHover = mouseRef.current !== null
hoverStr += ((hasHover ? 1 : 0) - hoverStr) * (hasHover ? 0.018 : 0.010)

ctx.clearRect(0, 0, cw, ch)
const dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'
const lineA  = isDarkRef.current ? LINE_A_DARK : LINE_A_LIGHT
const mx = mouseRef.current?.x ?? -99999
const my = mouseRef.current?.y ?? -99999
const r2 = LOCAL_RADIUS * LOCAL_RADIUS
const amp = BASE_AMP * (1 + hoverStr * HOVER_BOOST)

function displaced(c: number, r: number): [number, number] {
  const rx = ox + c * SPACING
  const ry = oy + r * SPACING
  const wx = amp * (Math.sin(rx * WAVE_FREQ + t) + Math.sin(ry * WAVE_FREQ * 0.6 + t * 1.3) * 0.55)
  const wy = amp * (Math.cos(ry * WAVE_FREQ * 0.8 + t * 1.15) + Math.cos(rx * WAVE_FREQ * 0.5 + t * 0.75) * 0.55)
  const dx = rx - mx
  const dy = ry - my
  const dist2 = dx*dx + dy*dy
  let px = 0, py = 0
  if (dist2 < r2 * 4) {
    const push = LOCAL_AMP * Math.exp(-dist2 / (r2 * 0.5))
    const dist = Math.sqrt(dist2) || 1
    px = (dx / dist) * push
    py = (dy / dist) * push
  }
  return [rx + wx + px, ry + wy + py]
}

ctx.strokeStyle = \`rgba(\${dotRGB},\${lineA.toFixed(3)})\`
ctx.lineWidth = 0.5

for (let r = 0; r < rows; r++) {
  ctx.beginPath()
  const [x0, y0] = displaced(0, r)
  ctx.moveTo(x0, y0)
  for (let c = 1; c < cols; c++) {
    const [x, y] = displaced(c, r)
    ctx.lineTo(x, y)
  }
  ctx.stroke()
}
for (let c = 0; c < cols; c++) {
  ctx.beginPath()
  const [x0, y0] = displaced(c, 0)
  ctx.moveTo(x0, y0)
  for (let r = 1; r < rows; r++) {
    const [x, y] = displaced(c, r)
    ctx.lineTo(x, y)
  }
  ctx.stroke()
}
animId = requestAnimationFrame(frame)
\`\`\`

## Pointer + resize
onMouseMove/onTouchMove on outer div → mouseRef = {x: clientX - canvasRect.left, y: clientY - canvasRect.top}. onMouseLeave/onTouchEnd → null. ResizeObserver on canvas.parentElement re-runs build().

## JSX
Outer div: className "relative h-full w-full overflow-hidden", style background '#110F0C' dark / '#F5F1EA' light, with all four pointer handlers. Canvas absolute inset-0 width/height 100%. Centered pointer-events-none overlay (flex-col items-center justify-center gap-2):
- "Distortion Grid" — fontSize 22, fontWeight 700, letterSpacing -0.02em, color rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light
- "hover to warp" — fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em, color rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light

## Cleanup
alive=false; cancelAnimationFrame(animId); ro.disconnect(); observer.disconnect().`,

  V0: `Create a React client component named \`DistortionGrid\`. Single file, TypeScript, \`'use client'\` at the top. Use \`useEffect\`, \`useRef\`, and \`useState\` from React — no other libraries, no framer-motion. The component fills its parent (\`h-full w-full\`) and supports both light and dark themes.

## The visual
A full-bleed canvas draws a warping grid of thin horizontal and vertical lines — imagine graph paper caught in a slow ocean swell. The whole field is always undulating: long-wavelength sine waves (think one or two visible peaks across the frame, not a dense ripple) push each grid intersection off its resting position in both x and y, so the lines curve and sway instead of staying straight. The motion is quiet and continuous at rest — just enough to feel alive.

When the cursor enters the canvas, two things happen together. First, the global wave amplitude swells: what was a gentle sway grows into a dramatic warp across the entire grid, easing in over roughly half a second. Second, a gaussian "dent" appears directly under the cursor — lines within about 260px of the pointer are pushed radially outward, creating a visible bulge or void that tracks the mouse. When the cursor leaves, amplitude relaxes back down over about a second and the void fades away. No hard circle, no snap — everything is smoothly lerped.

Centered in the frame are two overlay labels:
- A title reading exactly \`Distortion Grid\` — 22px, font-weight 700, letter-spacing -0.02em.
- Below it, a hint reading exactly \`hover to warp\` — 11px, font-weight 600, uppercase, letter-spacing 0.12em.

Both sit above the canvas with \`pointer-events-none\` so they never block the hover. On dark, the labels use \`rgba(255,255,255,0.45)\` and \`rgba(255,255,255,0.18)\`. On light, use \`rgba(28,25,22,0.45)\` and \`rgba(28,25,22,0.22)\`.

## Theme
Detect theme by checking \`.closest('[data-card-theme]')\` for a \`.dark\` class, falling back to \`document.documentElement.classList.contains('dark')\`. Track it with \`useState isDark\` plus an \`isDarkRef\` for the render loop. Watch for changes with a \`MutationObserver\` on \`documentElement\` (and the card wrapper if present) listening for class attribute changes.

Background: \`#110F0C\` on dark, \`#F5F1EA\` on light — set as an inline style on the outer container. The grid lines are drawn white (\`255,255,255\`) on dark at alpha \`0.55\`, and near-black (\`28,25,22\`) on light at alpha \`0.75\` (light needs a touch more contrast to read against the warm parchment background).

## Key constants
- \`SPACING = 32\` — pixels between grid points at rest
- \`BASE_AMP = 30\` — resting wave amplitude in pixels (already dramatic — you want one or two full sine peaks visible)
- \`WAVE_FREQ = 0.007\` — roughly a 900px wavelength, deliberately long
- \`HOVER_BOOST = 1.5\` — amplitude multiplier at full hover (waves grow 2.5× from rest)
- \`LOCAL_AMP = 60\` — repulsion strength at the cursor centre
- \`LOCAL_RADIUS = 260\` — repulsion radius in pixels

## Canvas setup
Standard DPR scaffolding: read \`devicePixelRatio\`, measure the canvas with \`getBoundingClientRect\`, set \`canvas.width/height\` to the rounded scaled pixels, and \`ctx.setTransform(dpr,0,0,dpr,0,0)\`. Rebuild on resize via a \`ResizeObserver\` on \`canvas.parentElement\`.

Compute \`cols = Math.floor(cw/SPACING)+2\` and \`rows = Math.floor(ch/SPACING)+2\` so the grid overshoots the bleed and has no visible edges. Offset by \`ox = (cw%SPACING)/2\` and \`oy = (ch%SPACING)/2\` to keep it visually centred. There's no per-point state — grid positions are computed on the fly each frame from \`(col, row)\`.

## Effect-scoped animation state
Inside the effect, keep four locals: \`t = 0\` (time accumulator), \`hoverStr = 0\` (smoothed 0-to-1 hover strength), \`animId = 0\` (RAF handle), \`alive = true\` (cleanup guard).

## The frame loop
On every animation frame:

1. Bail out if \`!alive\`. Advance \`t += 0.002\` (this is the internal clock for the undulation — small and slow on purpose).
2. Check whether \`mouseRef.current\` is non-null. Lerp \`hoverStr\` toward 1 when hovered, toward 0 when not, with asymmetric rates: \`0.018\` on the way up, \`0.010\` on the way down. That gives roughly a half-second ramp in and a one-second ramp out.
3. Clear the canvas. Pick \`dotRGB = '255,255,255'\` on dark or \`'28,25,22'\` on light, and \`lineA = 0.55\` on dark or \`0.75\` on light.
4. Read the mouse from a ref, falling back to \`-99999\` for both axes when there's no hover (this pushes the repulsion term out of range naturally instead of branching around it).
5. Compute the current global amplitude: \`amp = BASE_AMP * (1 + hoverStr * HOVER_BOOST)\`. At rest that's 30px; at full hover it's 75px.
6. Define a \`displaced(col, row)\` helper that returns the final \`[x, y]\` for a given grid index. It builds the rest position \`rx = ox + col*SPACING\`, \`ry = oy + row*SPACING\`, then adds two layered sine waves for \`wx\` and two layered cosines for \`wy\` — each layer uses slightly different frequency and time coefficients so the x and y displacements drift out of sync and the motion looks organic instead of a pure checkerboard swing. The second layer of each is weighted at \`0.55\` of the first. Finally it adds a gaussian radial push: squared distance from the cursor, and if it's within \`4 * LOCAL_RADIUS²\`, add \`LOCAL_AMP * Math.exp(-dist2 / (LOCAL_RADIUS² * 0.5))\` along the unit vector pointing from cursor to grid point. Outside that threshold, no push.
7. Set \`strokeStyle\` to \`rgba(\${dotRGB},\${lineA.toFixed(3)})\` and \`lineWidth = 0.5\`.
8. Draw the horizontal lines: for each row, \`beginPath\`, \`moveTo\` the displaced \`(0, row)\`, then \`lineTo\` each displaced \`(col, row)\` for \`col = 1..cols-1\`, then \`stroke\`. Each row becomes a single smooth polyline that curves across the frame.
9. Draw the vertical lines the same way: for each col, walk down the rows with \`lineTo\` and stroke.
10. Schedule the next frame.

The layered waves are the important bit — they're what turn "a grid bouncing on a sine" into "a grid rippling like fabric." Keep the layer weights and time multipliers distinct per axis.

## Interaction
Attach \`onMouseMove\`, \`onMouseLeave\`, \`onTouchMove\`, \`onTouchEnd\` to the outer container. On move, read the canvas's \`getBoundingClientRect\` and store \`{ x: clientX - rect.left, y: clientY - rect.top }\` in \`mouseRef.current\`. On leave/end, set it to \`null\` so \`hoverStr\` starts easing back to 0. Touch follows the same pattern using \`e.touches[0]\`.

## Structure
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: ... }} ...handlers>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span>Distortion Grid</span>
    <span>hover to warp</span>
  </div>
</div>
\`\`\`

## Cleanup
Use the \`alive\` flag inside the effect and guard the frame loop with it. On unmount: set \`alive = false\`, \`cancelAnimationFrame\`, disconnect the \`ResizeObserver\`, and disconnect the theme \`MutationObserver\`. No leaks.

The finished piece should feel like a calm, slowly breathing grid at rest that comes suddenly alive under the cursor — swelling, bulging around the pointer, and settling back down when you leave.`,
}
