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

  V0: `Create a React client component named \`InteractiveDotGrid\`. Single file, TypeScript, \`'use client'\` at the top. Use only \`useEffect\`, \`useRef\`, and \`useState\` from React — no framer-motion, no other libraries. The component accepts one optional prop: \`{ showLabel = true }: { showLabel?: boolean }\`. It fills its parent via \`h-full w-full\` and supports both light and dark themes.

## The visual
A quiet, architectural field of tiny square dots laid out on a perfectly regular grid, drawn on a full-bleed canvas. At rest the dots are barely there — just enough to read as a surface texture. As the cursor moves across the field, a soft circular halo of illumination tracks underneath it: dots inside the halo brighten toward near-white, and each lit dot grows very slightly (from 1 pixel square up to about 2.2 pixels). After the cursor leaves, the halo doesn't snap off — it decays gently over roughly a second, so the grid feels like it's gradually forgetting where the pointer was. No connections between dots, no waves, no colour shifts — just a pure light-follows-cursor effect on a static grid.

Centered in the frame are two overlay labels (only shown when \`showLabel\` is true):
- A title reading exactly \`Dot Grid\` — 22px, font-weight 700, letter-spacing -0.02em.
- Below it, a hint reading exactly \`hover to illuminate\` — 11px, font-weight 600, uppercase, letter-spacing 0.12em.

Both labels sit above the canvas with \`pointer-events-none\` so they never block the hover. On dark, they use \`rgba(255,255,255,0.45)\` and \`rgba(255,255,255,0.18)\`. On light, use \`rgba(28,25,22,0.45)\` and \`rgba(28,25,22,0.22)\`.

## Theme
Detect theme by checking \`.closest('[data-card-theme]')\` on the container for a \`.dark\` class, falling back to \`document.documentElement.classList.contains('dark')\`. Track it with \`useState isDark\` (default true) plus an \`isDarkRef\` that the render loop reads on every frame. Watch for theme changes with a \`MutationObserver\` on \`documentElement\` (and the card wrapper if present) listening for class attribute changes. Mirror updates into both the state and the ref.

Background: \`#110F0C\` on dark, \`#F5F1EA\` on light — set as an inline style on the outer container. The dots themselves are drawn white (\`255,255,255\`) on dark and near-black (\`28,25,22\`) on light.

## Key constants
- \`SPACING = 20\` — pixels between dot centres
- \`RADIUS = 130\` — hover influence radius in pixels (tight and intimate — a small pool of light, not a floodlight)
- resting alpha: \`0.13\` on dark, \`0.25\` on light (the light theme's resting alpha is hardcoded, not the same \`BASE_A\` constant — it's intentionally a bit stronger because near-black on cream reads softer than white on near-black)
- peak lit alpha: \`0.92\`

## Canvas setup
Standard DPR scaffolding: read \`devicePixelRatio\`, measure the canvas with \`getBoundingClientRect\`, set \`canvas.width/height\` to the rounded scaled pixels, then \`ctx.setTransform(dpr,0,0,dpr,0,0)\`. Rebuild on resize via a \`ResizeObserver\` on \`canvas.parentElement\`.

Build a flat \`dots\` array. Use \`Math.floor(cw/SPACING)+2\` columns and rows so the grid fully covers the bleed, offset by \`(cw%SPACING)/2\` and \`(ch%SPACING)/2\` to keep it visually centred. Each dot stores \`{ x, y, b }\` where \`b\` is its 0→1 brightness.

## The frame loop
On every animation frame:

1. Clear the canvas.
2. Read the mouse position from a ref. Fall back to an off-screen coordinate like \`-99999\` when there's no hover, so the distance math naturally excludes everything without a branch.
3. For each dot, compute its squared distance to the cursor. If it's within \`RADIUS\`, its target brightness is \`Math.pow(1 - Math.sqrt(dist2)/RADIUS, 1.5)\` — a soft power-curve falloff that feels creamy at the edge rather than a hard circle cutout. Outside the radius, target is 0.
4. Ease \`b\` toward its target asymmetrically: fast attack on the way up (a factor of \`0.16\`), slower release on the way down (a factor of \`0.07\`). This gives the organic ~1 second tail after the cursor leaves. Snap \`b\` to 0 once it drops below \`0.004\` so idle dots cost nothing.
5. Size: \`sz = 1 + b * 1.2\` — resting dots are 1×1 pixel squares, fully lit dots are 2.2×2.2. This subtle size bloom, combined with the brightening, is what sells the illumination.
6. Alpha: blend the resting value toward peak by brightness. \`alpha = baseA + (0.92 - baseA) * b\`, where \`baseA\` is 0.13 on dark and 0.25 on light.
7. Draw the dot with \`fillRect(x - sz/2, y - sz/2, sz, sz)\` using \`fillStyle = \`rgba(\${dotRGB},\${alpha.toFixed(2)})\`\`. No circles, no paths — flat pixel squares are exactly right for the crisp architectural look.

## Pointer tracking — WINDOW LEVEL
This is the critical detail that makes this component different from most canvas hover effects. Do NOT attach mouse/touch handlers to the outer container div. Instead, in a dedicated effect, register passive listeners at the \`window\` and \`document\` level:

- \`window.addEventListener('mousemove', ...)\`
- \`window.addEventListener('touchmove', ...)\` — read \`e.touches[0]\`
- \`window.addEventListener('touchend', clear)\` and \`touchcancel\`
- \`document.addEventListener('mouseleave', clear)\` — fires when the cursor leaves the viewport entirely

On move, read \`canvasRef.current.getBoundingClientRect()\` and write \`{ x: clientX - rect.left, y: clientY - rect.top }\` to a mouseRef. On touchend/touchcancel/mouseleave, set the ref to null. All mouse/touch listeners should be passive. Remove every listener in the cleanup.

Why window-level: this lets the grid stay reactive even when it's rendered as a background behind other UI layers that use \`pointer-events: none\`. The grid always knows where the real cursor is, regardless of what's sitting above it.

## Structure
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
  {showLabel && (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
      <span>Dot Grid</span>
      <span>hover to illuminate</span>
    </div>
  )}
</div>
\`\`\`

Note that the outer div has NO pointer handlers — all tracking is on window/document.

## Cleanup
Use an \`alive\` flag inside the render effect and guard the frame loop with it. On unmount: set \`alive = false\`, \`cancelAnimationFrame\`, disconnect the \`ResizeObserver\`, disconnect the theme \`MutationObserver\`, and remove all five window/document event listeners. No leaks.

The finished piece should feel like staring at a sheet of graph paper where the cursor is a soft torch — quiet, precise, and just playful enough to invite a second pass.`,
}
