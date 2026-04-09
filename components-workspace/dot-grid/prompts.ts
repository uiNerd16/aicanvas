import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`InteractiveDotGrid\` (accept optional \`{ showLabel = true }\` prop). Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A full-bleed canvas of tiny square dots on a uniform grid. Dots illuminate near the cursor with a power-1.5 falloff and grow slightly when lit. Cursor is tracked at the WINDOW level so the grid stays reactive even when rendered behind pointer-events:none elements.

Constants:
\`\`\`
SPACING = 20    // px between dot centres
RADIUS  = 130   // hover influence radius
BASE_A  = 0.13  // resting dot opacity (dark mode)
PEAK_A  = 0.92  // fully-lit opacity
\`\`\`

Build: cols = floor(cw/SPACING)+2, rows = floor(ch/SPACING)+2, ox = (cw%SPACING)/2, oy = (ch%SPACING)/2. Each dot: \`{ x: ox + c*SPACING, y: oy + r*SPACING, b: 0 }\`.

Per-frame loop:
- dist2 = (x-mx)^2 + (y-my)^2
- tgt = dist2 < RADIUS*RADIUS ? Math.pow(1 - Math.sqrt(dist2)/RADIUS, 1.5) : 0
- d.b += (tgt > d.b ? 0.16 : 0.07) * (tgt - d.b); if d.b < 0.004 d.b = 0
- baseA = isDark ? BASE_A : 0.25  (note: LIGHT uses 0.25, not BASE_A)
- alpha = baseA + (PEAK_A - baseA) * d.b
- sz = 1 + d.b * 1.2   // 1px → 2.2px
- fillStyle = rgba(dotRGB, alpha.toFixed(2)); fillRect(d.x - sz/2, d.y - sz/2, sz, sz)

dotRGB = dark ? '255,255,255' : '28,25,22'.

Standard DPR canvas setup. ResizeObserver on canvas.parentElement rebuilds grid.

## Pointer tracking (WINDOW-LEVEL, not on the div)
Register passive listeners on window: \`mousemove\`, \`touchmove\`, \`touchend\`, \`touchcancel\`, plus \`document.addEventListener('mouseleave', clear)\`. On move, read \`canvasRef.current.getBoundingClientRect()\` and write \`{x: clientX - rect.left, y: clientY - rect.top}\` to mouseRef. touchend/touchcancel/mouseleave set to null. This is different from other canvas components — do not attach handlers to the outer div.

Theme detection: walk containerRef.closest('[data-card-theme]'), fallback to documentElement. MutationObserver on both. Mirror into isDarkRef + isDark state.

JSX: outer div (NO pointer handlers — tracking is on window), relative h-full w-full overflow-hidden, bg '#110F0C' dark / '#F5F1EA' light. Canvas absolute inset-0 width/height 100%. If \`showLabel\` is true, render centered pointer-events-none overlay:
- "Dot Grid" — fontSize 22, fontWeight 700, letterSpacing -0.02em, color rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light
- "hover to illuminate" — fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em, color rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light

Cleanup: alive=false, cancelAnimationFrame, ro.disconnect, observer.disconnect, remove all window/document listeners.`,

  GPT: `Build a React client component named \`InteractiveDotGrid\`. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces beyond the single optional \`showLabel\`. Implement exactly what is specified — no more, no less.

Signature: \`export function InteractiveDotGrid({ showLabel = true }: { showLabel?: boolean } = {})\`.

## Constants
\`\`\`
SPACING = 20
RADIUS  = 130
BASE_A  = 0.13
PEAK_A  = 0.92
\`\`\`
Light mode uses a hardcoded resting alpha of 0.25, NOT BASE_A.

## Refs & state
containerRef, canvasRef, mouseRef ({x,y}|null), isDarkRef (boolean), isDark state (default true).

## Theme detection
\`closest('[data-card-theme]')\` → .dark class, else documentElement. MutationObserver attributeFilter ['class'] on both. Mirror into ref and state.

## Pointer tracking — WINDOW LEVEL
This is critical. Do NOT put handlers on the outer div. Instead, in a dedicated effect:
\`\`\`
const updateFromClient = (clientX, clientY) => {
  const canvas = canvasRef.current
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top }
}
window.addEventListener('mousemove', (e) => updateFromClient(e.clientX, e.clientY), { passive: true })
window.addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) updateFromClient(t.clientX, t.clientY) }, { passive: true })
window.addEventListener('touchend',    () => { mouseRef.current = null }, { passive: true })
window.addEventListener('touchcancel', () => { mouseRef.current = null }, { passive: true })
document.addEventListener('mouseleave', () => { mouseRef.current = null })
\`\`\`
Remove all five on cleanup.

## Canvas setup
\`\`\`
const dpr = window.devicePixelRatio || 1
const rect = canvas.getBoundingClientRect()
cw = rect.width; ch = rect.height
canvas.width = Math.round(cw * dpr)
canvas.height = Math.round(ch * dpr)
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
\`\`\`

## Build dots
cols = floor(cw/SPACING)+2; rows = floor(ch/SPACING)+2; ox = (cw%SPACING)/2; oy = (ch%SPACING)/2. Each dot: \`{ x: ox + c*SPACING, y: oy + r*SPACING, b: 0 }\`.

## Per-frame loop
\`\`\`
ctx.clearRect(0, 0, cw, ch)
mx = mouseRef.current?.x ?? -99999
my = mouseRef.current?.y ?? -99999
r2 = RADIUS * RADIUS
dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'

for each d:
  dx = d.x - mx; dy = d.y - my
  dist2 = dx*dx + dy*dy
  tgt = dist2 < r2 ? Math.pow(1 - Math.sqrt(dist2) / RADIUS, 1.5) : 0
  d.b += (tgt > d.b ? 0.16 : 0.07) * (tgt - d.b)
  if d.b < 0.004: d.b = 0
  baseA = isDarkRef.current ? 0.13 : 0.25
  alpha = baseA + (0.92 - baseA) * d.b
  sz = 1 + d.b * 1.2
  ctx.fillStyle = \`rgba(\${dotRGB},\${alpha.toFixed(2)})\`
  ctx.fillRect(d.x - sz/2, d.y - sz/2, sz, sz)

animId = requestAnimationFrame(frame)
\`\`\`

## Resize
ResizeObserver on canvas.parentElement runs build() (re-sizes AND rebuilds dots).

## JSX
\`\`\`tsx
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
  {showLabel && (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
      <span style={{ color: labelColor, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Dot Grid</span>
      <span style={{ color: hintColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>hover to illuminate</span>
    </div>
  )}
</div>
\`\`\`
NO pointer handlers on the outer div. labelColor rgba(255,255,255,0.45) / rgba(28,25,22,0.45); hintColor rgba(255,255,255,0.18) / rgba(28,25,22,0.22).

## Cleanup
alive=false; cancelAnimationFrame; ro.disconnect(); observer.disconnect(); remove all window/document listeners.`,

  Gemini: `Implement a React client component named \`InteractiveDotGrid\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useEffect, useRef, useState } from 'react'
\`\`\`
No framer-motion. Pure canvas.

## API guardrails
USE only: useEffect, useRef, useState, requestAnimationFrame, cancelAnimationFrame, ResizeObserver, MutationObserver, window event listeners, CanvasRenderingContext2D. DO NOT invent \`useCanvas\`, \`useAnimationFrame\`, \`useMotionValue\`, \`useSpringValue\`, or any helper not listed.

## Concept
A grid of 1px dots rendered on a full-bleed canvas. The cursor illuminates a radial halo of dots, which grow slightly when lit (up to 2.2px). Pointer tracking is attached to the WINDOW, not to the component's div, so the dots stay reactive even when rendered behind overlays.

Signature: \`export function InteractiveDotGrid({ showLabel = true }: { showLabel?: boolean } = {})\`.

## Constants
\`\`\`
const SPACING = 20
const RADIUS  = 130
const BASE_A  = 0.13
const PEAK_A  = 0.92
\`\`\`
Important: light mode uses 0.25 as its resting alpha — NOT BASE_A.

## Refs & state
containerRef (HTMLDivElement), canvasRef (HTMLCanvasElement), mouseRef ({x,y}|null default null), isDarkRef (boolean default true), isDark state (default true).

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

## Pointer tracking effect — WINDOW LEVEL (verbatim)
\`\`\`
const updateFromClient = (clientX: number, clientY: number) => {
  const canvas = canvasRef.current
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top }
}
const onMouseMove = (e: MouseEvent) => updateFromClient(e.clientX, e.clientY)
const onTouchMove = (e: TouchEvent) => {
  const t = e.touches[0]
  if (t) updateFromClient(t.clientX, t.clientY)
}
const clearPointer = () => { mouseRef.current = null }

window.addEventListener('mousemove', onMouseMove, { passive: true })
window.addEventListener('touchmove', onTouchMove, { passive: true })
window.addEventListener('touchend', clearPointer, { passive: true })
window.addEventListener('touchcancel', clearPointer, { passive: true })
document.addEventListener('mouseleave', clearPointer)
return () => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', clearPointer)
  window.removeEventListener('touchcancel', clearPointer)
  document.removeEventListener('mouseleave', clearPointer)
}
\`\`\`

## Canvas DPR scaffolding (inline verbatim)
\`\`\`
const dpr = window.devicePixelRatio || 1
const rect = canvas.getBoundingClientRect()
canvas.width = Math.round(rect.width * dpr)
canvas.height = Math.round(rect.height * dpr)
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
\`\`\`
Then cw = rect.width, ch = rect.height.

## Build dots
\`\`\`
const cols = Math.floor(cw / SPACING) + 2
const rows = Math.floor(ch / SPACING) + 2
const ox = (cw % SPACING) / 2
const oy = (ch % SPACING) / 2
dots = []
for (let r = 0; r < rows; r++)
  for (let c = 0; c < cols; c++)
    dots.push({ x: ox + c*SPACING, y: oy + r*SPACING, b: 0 })
\`\`\`

## Frame loop (verbatim math)
\`\`\`
ctx.clearRect(0, 0, cw, ch)
const mx = mouseRef.current?.x ?? -99999
const my = mouseRef.current?.y ?? -99999
const r2 = RADIUS * RADIUS
const dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'

for (const d of dots) {
  const dx = d.x - mx
  const dy = d.y - my
  const dist2 = dx*dx + dy*dy
  const tgt = dist2 < r2 ? Math.pow(1 - Math.sqrt(dist2) / RADIUS, 1.5) : 0
  d.b += (tgt > d.b ? 0.16 : 0.07) * (tgt - d.b)
  if (d.b < 0.004) d.b = 0
  const baseA = isDarkRef.current ? BASE_A : 0.25
  const alpha = baseA + (PEAK_A - baseA) * d.b
  const sz = 1 + d.b * 1.2
  ctx.fillStyle = \`rgba(\${dotRGB},\${alpha.toFixed(2)})\`
  ctx.fillRect(d.x - sz/2, d.y - sz/2, sz, sz)
}
\`\`\`

## Resize
ResizeObserver on canvas.parentElement re-runs build() (re-sizes AND rebuilds the dot array).

## JSX
Outer div with NO pointer handlers (tracking is window-level), className "relative h-full w-full overflow-hidden", style background '#110F0C' dark / '#F5F1EA' light. Canvas absolute inset-0 width/height 100%. When \`showLabel\` is true, centered overlay:
- "Dot Grid" — fontSize 22, fontWeight 700, letterSpacing -0.02em, color rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light
- "hover to illuminate" — fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em, color rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light

## Cleanup
alive=false; cancelAnimationFrame(animId); ro.disconnect(); observer.disconnect(); remove all five window/document listeners.`,
}
