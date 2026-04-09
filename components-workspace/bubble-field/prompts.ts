import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`BubbleField\`. Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A full-bleed HTML canvas filling its parent. A uniform grid of tiny stroked circles. On hover, circles near the cursor burst: expand and fade, briefly vanish, then reform. DPR-aware canvas, requestAnimationFrame, ResizeObserver.

Constants:
\`\`\`
SPACING = 20      // px between centres
RADIUS  = 200     // hover influence radius
BASE_R  = 1.5     // resting radius
BURST_R = 16      // extra radius during burst
BASE_A_DARK  = 0.55
BASE_A_LIGHT = 0.75
\`\`\`

Build grid once: cols = floor(cw/SPACING)+2, rows = floor(ch/SPACING)+2, ox = (cw%SPACING)/2, oy = (ch%SPACING)/2. Each bubble: \`{ x, y, b: 0, phase: Math.random() }\`.

Per-frame loop:
- dist2 = (x-mx)^2 + (y-my)^2
- tgt = dist2 < RADIUS*RADIUS ? Math.exp(-dist2 / (RADIUS*RADIUS*0.25)) : 0
- b += (tgt > b ? 0.16 : 0.07) * (tgt - b); if b < 0.004 b = 0
- if b > 0.08: phase = (phase + 0.025 * b) % 1
- With p = phase:
  - resting (b <= 0.08): stroke circle radius BASE_R at alpha baseA
  - p < 0.55: t = p/0.55; r = BASE_R + t*BURST_R; alpha = baseA*(1-t) (skip if < 0.004)
  - 0.55 <= p < 0.72: draw nothing
  - p >= 0.72: t = (p-0.72)/0.28; r = BASE_R*t; alpha = baseA*t (skip if r <= 0.2 or alpha <= 0.004)
- Every stroke: strokeStyle \`rgba(\${dotRGB},\${alpha.toFixed(3)})\`, lineWidth 0.5. dotRGB = dark ? '255,255,255' : '28,25,22'.

Standard DPR: dpr = devicePixelRatio || 1; canvas.width = round(rect.width*dpr); same for height; ctx.setTransform(dpr,0,0,dpr,0,0). ResizeObserver on canvas.parentElement re-runs build(). Mouse tracked via onMouseMove/onTouchMove on outer div, writing {x: clientX - canvasRect.left, y: clientY - canvasRect.top} to mouseRef. onMouseLeave/onTouchEnd sets mouseRef.current = null. Use sentinel -99999 when null.

Theme detection: walk \`containerRef.current.closest('[data-card-theme]')\`; if found read its \`dark\` class, otherwise read \`document.documentElement.classList.contains('dark')\`. MutationObserver on both for class changes. Mirror into isDarkRef (for the RAF loop) and isDark state (for JSX bg).

JSX: outer div relative h-full w-full overflow-hidden, inline background '#110F0C' dark / '#F5F1EA' light. Canvas absolute inset-0 width/height 100%. Centered pointer-events-none overlay with:
- "Bubble Field" — fontSize 22, fontWeight 700, letterSpacing -0.02em, color rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light
- "hover to burst" — fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em, color rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light

Cleanup: alive=false, cancelAnimationFrame, ro.disconnect, observer.disconnect.`,

  GPT: `Build a React client component named \`BubbleField\`. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Constants
\`\`\`
SPACING = 20
RADIUS  = 200
BASE_R  = 1.5
BURST_R = 16
BASE_A_DARK  = 0.55
BASE_A_LIGHT = 0.75
\`\`\`

## Refs & state
containerRef (div), canvasRef, mouseRef ({x,y}|null initially null), isDarkRef (boolean default true), isDark state (default true).

## Theme detection (effect)
Walk \`containerRef.current.closest('[data-card-theme]')\`; if present use its \`classList.contains('dark')\`, else \`document.documentElement.classList.contains('dark')\`. MutationObserver watches \`attributeFilter: ['class']\` on documentElement and on the card wrapper if present. Updates both isDarkRef and isDark state.

## Canvas setup
\`\`\`
const dpr = window.devicePixelRatio || 1
const rect = canvas.getBoundingClientRect()
cw = rect.width; ch = rect.height
if (!cw || !ch) return
canvas.width = Math.round(cw * dpr)
canvas.height = Math.round(ch * dpr)
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
\`\`\`

## Grid build
\`cols = Math.floor(cw/SPACING) + 2\`; \`rows = Math.floor(ch/SPACING) + 2\`; \`ox = (cw % SPACING) / 2\`; \`oy = (ch % SPACING) / 2\`. Each bubble: \`{ x: ox + c*SPACING, y: oy + r*SPACING, b: 0, phase: Math.random() }\`.

## Per-frame loop
\`\`\`
ctx.clearRect(0, 0, cw, ch)
const mx = mouseRef.current?.x ?? -99999
const my = mouseRef.current?.y ?? -99999
const r2 = RADIUS * RADIUS
const dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'
const baseA  = isDarkRef.current ? 0.55 : 0.75

for each bubble bub:
  dx = bub.x - mx; dy = bub.y - my
  dist2 = dx*dx + dy*dy
  tgt = dist2 < r2 ? Math.exp(-dist2 / (RADIUS*RADIUS*0.25)) : 0
  bub.b += (tgt > bub.b ? 0.16 : 0.07) * (tgt - bub.b)
  if bub.b < 0.004: bub.b = 0
  if bub.b > 0.08:
    bub.phase = (bub.phase + 0.025 * bub.b) % 1
  p = bub.phase

  if bub.b > 0.08:
    if p < 0.55:
      t = p / 0.55
      r = BASE_R + t * BURST_R
      alpha = baseA * (1 - t)
      if alpha > 0.004:
        stroke arc(bub.x, bub.y, r) at rgba(dotRGB, alpha.toFixed(3)), lineWidth 0.5
    else if p < 0.72:
      // invisible gap — draw nothing
    else:
      t = (p - 0.72) / 0.28
      r = BASE_R * t
      alpha = baseA * t
      if r > 0.2 and alpha > 0.004:
        stroke arc(bub.x, bub.y, r) at rgba(dotRGB, alpha.toFixed(3)), lineWidth 0.5
  else:
    stroke arc(bub.x, bub.y, BASE_R) at rgba(dotRGB, baseA.toFixed(3)), lineWidth 0.5

animId = requestAnimationFrame(frame)
\`\`\`

## Resize
ResizeObserver on \`canvas.parentElement\` runs build() (which re-sizes AND rebuilds bubble array).

## Pointer
onMouseMove/onTouchMove on the outer div → mouseRef.current = { x: clientX - canvasRect.left, y: clientY - canvasRect.top }. onMouseLeave/onTouchEnd → mouseRef.current = null.

## JSX structure
\`\`\`tsx
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }} onMouseMove={...} onMouseLeave={...} onTouchMove={...} onTouchEnd={...}>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span style={{ color: labelColor, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Bubble Field</span>
    <span style={{ color: hintColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>hover to burst</span>
  </div>
</div>
\`\`\`
labelColor: rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light. hintColor: rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light.

## Cleanup
\`alive = false\`; cancelAnimationFrame(animId); ro.disconnect(); observer.disconnect().`,

  Gemini: `Implement a React client component named \`BubbleField\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useEffect, useRef, useState } from 'react'
\`\`\`
No framer-motion. This is a pure canvas component.

## API guardrails
USE only: useEffect, useRef, useState, requestAnimationFrame, cancelAnimationFrame, ResizeObserver, MutationObserver, and the CanvasRenderingContext2D 2D API. DO NOT invent \`useCanvas\`, \`useAnimationFrame\`, \`useMotionValue\`, \`useSpringValue\`, or any helper not listed here.

## Concept
Full-bleed canvas with a uniform grid of tiny stroked circles. When the cursor is near a circle it "bursts": expands and fades, disappears briefly, then reforms — an organic popping effect. Supports light and dark themes.

## Constants
\`\`\`
const SPACING = 20
const RADIUS  = 200
const BASE_R  = 1.5
const BURST_R = 16
const BASE_A_DARK  = 0.55
const BASE_A_LIGHT = 0.75
\`\`\`

## Refs & state
\`\`\`
const containerRef = useRef<HTMLDivElement>(null)
const canvasRef    = useRef<HTMLCanvasElement>(null)
const mouseRef     = useRef<{ x: number; y: number } | null>(null)
const isDarkRef    = useRef(true)
const [isDark, setIsDark] = useState(true)
\`\`\`

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
Also store \`cw = rect.width\`, \`ch = rect.height\` for drawing math.

## Grid build
\`\`\`
const cols = Math.floor(cw / SPACING) + 2
const rows = Math.floor(ch / SPACING) + 2
const ox = (cw % SPACING) / 2
const oy = (ch % SPACING) / 2
bubbles = []
for (let r = 0; r < rows; r++)
  for (let c = 0; c < cols; c++)
    bubbles.push({ x: ox + c*SPACING, y: oy + r*SPACING, b: 0, phase: Math.random() })
\`\`\`

## Frame loop (verbatim math)
\`\`\`
ctx.clearRect(0, 0, cw, ch)
const mx = mouseRef.current?.x ?? -99999
const my = mouseRef.current?.y ?? -99999
const r2 = RADIUS * RADIUS
const dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'
const baseA  = isDarkRef.current ? BASE_A_DARK : BASE_A_LIGHT

for (const bub of bubbles) {
  const dx = bub.x - mx
  const dy = bub.y - my
  const dist2 = dx*dx + dy*dy
  const tgt = dist2 < r2 ? Math.exp(-dist2 / (RADIUS*RADIUS*0.25)) : 0
  bub.b += (tgt > bub.b ? 0.16 : 0.07) * (tgt - bub.b)
  if (bub.b < 0.004) bub.b = 0
  if (bub.b > 0.08) bub.phase = (bub.phase + 0.025 * bub.b) % 1
  const p = bub.phase

  if (bub.b > 0.08) {
    if (p < 0.55) {
      const t = p / 0.55
      const r = BASE_R + t * BURST_R
      const alpha = baseA * (1 - t)
      if (alpha > 0.004) strokeCircle(bub.x, bub.y, r, alpha)
    } else if (p < 0.72) {
      // invisible gap
    } else {
      const t = (p - 0.72) / 0.28
      const r = BASE_R * t
      const alpha = baseA * t
      if (r > 0.2 && alpha > 0.004) strokeCircle(bub.x, bub.y, r, alpha)
    }
  } else {
    strokeCircle(bub.x, bub.y, BASE_R, baseA)
  }
}
\`\`\`
Inline strokeCircle (do not extract): \`ctx.strokeStyle = \\\`rgba(\${dotRGB},\${alpha.toFixed(3)})\\\`; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.stroke()\`.

## Pointer + resize
onMouseMove/onTouchMove on outer div → mouseRef.current = {x: clientX - canvasRect.left, y: clientY - canvasRect.top}. onMouseLeave/onTouchEnd → mouseRef.current = null. ResizeObserver observes canvas.parentElement and calls build() which re-sizes AND rebuilds the bubble array.

## JSX
Outer div: className "relative h-full w-full overflow-hidden", style background '#110F0C' dark / '#F5F1EA' light. Canvas absolute inset-0 width/height 100%. Centered overlay (pointer-events-none, absolute inset-0, flex flex-col items-center justify-center gap-2):
- "Bubble Field" — fontSize 22, fontWeight 700, letterSpacing -0.02em, color rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light
- "hover to burst" — fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em, color rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light

## Cleanup
Use an \`alive\` flag. On unmount: alive=false, cancelAnimationFrame(animId), ro.disconnect(), observer.disconnect() (in its own effect).`,
}
