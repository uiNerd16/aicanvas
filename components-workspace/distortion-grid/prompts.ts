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
}
