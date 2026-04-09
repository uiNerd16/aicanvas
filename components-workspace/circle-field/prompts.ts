import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`CircleField\`. Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A full-bleed HTML canvas of randomly-scattered tiny stroked circles. On hover, circles near the cursor brighten and grow a double-ring halo (inner + outer ring). DPR-aware canvas, requestAnimationFrame, ResizeObserver.

Constants:
\`\`\`
DENSITY      = 1 / 250   // circles per pixel²
MAX_DOTS     = 3000
RADIUS       = 200       // hover influence radius
BASE_R       = 3
BASE_A_DARK  = 0.18
BASE_A_LIGHT = 0.28
PEAK_A       = 0.65
\`\`\`

Build once: count = min(round(cw*ch*DENSITY), MAX_DOTS). Each circle is \`{ x: random*cw, y: random*ch, b: 0 }\`.

Per-frame loop:
- dist2 = (x-mx)^2 + (y-my)^2
- tgt = dist2 < RADIUS*RADIUS ? Math.exp(-dist2 / (RADIUS*RADIUS*0.25)) : 0
- b += (tgt > b ? 0.16 : 0.07) * (tgt - b); if b < 0.004 b = 0
- alpha = baseA + (PEAK_A - baseA) * b
- If b > 0.02: stroke inner ring arc(x,y,1.5) at rgba(dotRGB, (b*0.50).toFixed(2))
- If b > 0.02: stroke outer ring arc(x,y,7) at rgba(dotRGB, (b*0.40).toFixed(2))
- Always: stroke base arc(x,y,BASE_R) at rgba(dotRGB, alpha.toFixed(2))
- All strokes lineWidth 0.5.

dotRGB = dark ? '255,255,255' : '28,25,22'. baseA = dark ? BASE_A_DARK : BASE_A_LIGHT.

Standard DPR setup. ResizeObserver on canvas.parentElement rebuilds. Mouse on outer div onMouseMove/onTouchMove writes {x: clientX - canvasRect.left, y: clientY - canvasRect.top} to mouseRef. Leave/touchend → null. Sentinel -99999.

Theme detection: walk containerRef.current.closest('[data-card-theme]'); if found use its .dark class, else document.documentElement.classList.contains('dark'). MutationObserver on both. Mirror into isDarkRef and isDark state.

JSX: outer div relative h-full w-full overflow-hidden, bg '#110F0C' dark / '#F5F1EA' light. Canvas absolute inset-0 width/height 100%. Centered pointer-events-none overlay:
- "Circle Field" — fontSize 22, fontWeight 700, letterSpacing -0.02em, color rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light
- "hover to illuminate" — fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em, color rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light

Cleanup: alive=false, cancelAnimationFrame, ro.disconnect, observer.disconnect.`,

  GPT: `Build a React client component named \`CircleField\`. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Constants
\`\`\`
DENSITY      = 1 / 250
MAX_DOTS     = 3000
RADIUS       = 200
BASE_R       = 3
BASE_A_DARK  = 0.18
BASE_A_LIGHT = 0.28
PEAK_A       = 0.65
\`\`\`

## Refs & state
containerRef, canvasRef, mouseRef ({x,y}|null), isDarkRef (boolean default true), isDark state (default true).

## Theme detection
Walk \`containerRef.current.closest('[data-card-theme]')\` first → its \`.dark\` class; else \`document.documentElement.classList.contains('dark')\`. MutationObserver \`attributeFilter: ['class']\` on documentElement and card wrapper. Sets both ref and state.

## Canvas setup
\`\`\`
const dpr = window.devicePixelRatio || 1
const rect = canvas.getBoundingClientRect()
cw = rect.width; ch = rect.height
canvas.width = Math.round(cw * dpr)
canvas.height = Math.round(ch * dpr)
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
\`\`\`

## Build circles
\`\`\`
const count = Math.min(Math.round(cw * ch * DENSITY), MAX_DOTS)
circles = Array.from({ length: count }, () => ({
  x: Math.random() * cw,
  y: Math.random() * ch,
  b: 0,
}))
\`\`\`

## Per-frame loop
\`\`\`
ctx.clearRect(0, 0, cw, ch)
mx = mouseRef.current?.x ?? -99999
my = mouseRef.current?.y ?? -99999
r2 = RADIUS * RADIUS
dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'
baseA  = isDarkRef.current ? 0.18 : 0.28
// PEAK_A = 0.65 always

for each c:
  dx = c.x - mx; dy = c.y - my
  dist2 = dx*dx + dy*dy
  tgt = dist2 < r2 ? Math.exp(-dist2 / (RADIUS*RADIUS*0.25)) : 0
  c.b += (tgt > c.b ? 0.16 : 0.07) * (tgt - c.b)
  if c.b < 0.004: c.b = 0
  alpha = baseA + (0.65 - baseA) * c.b

  if c.b > 0.02:
    strokeStyle rgba(dotRGB, (c.b * 0.50).toFixed(2)); lineWidth 0.5
    arc(c.x, c.y, 1.5, 0, 2π); stroke
  if c.b > 0.02:
    strokeStyle rgba(dotRGB, (c.b * 0.40).toFixed(2)); lineWidth 0.5
    arc(c.x, c.y, 7, 0, 2π); stroke
  // Always draw base on top
  strokeStyle rgba(dotRGB, alpha.toFixed(2)); lineWidth 0.5
  arc(c.x, c.y, BASE_R, 0, 2π); stroke

animId = requestAnimationFrame(frame)
\`\`\`

## Resize
ResizeObserver on canvas.parentElement runs build() (re-sizes AND rebuilds random circles). That means positions reshuffle on resize — intentional.

## Pointer
onMouseMove/onTouchMove on outer div → mouseRef = {x: clientX - canvasRect.left, y: clientY - canvasRect.top}. onMouseLeave/onTouchEnd → null.

## JSX
\`\`\`tsx
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }} onMouseMove={...} onMouseLeave={...} onTouchMove={...} onTouchEnd={...}>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span style={{ color: labelColor, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Circle Field</span>
    <span style={{ color: hintColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>hover to illuminate</span>
  </div>
</div>
\`\`\`
labelColor: rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light. hintColor: rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light.

## Cleanup
alive=false; cancelAnimationFrame(animId); ro.disconnect(); observer.disconnect().`,

  Gemini: `Implement a React client component named \`CircleField\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useEffect, useRef, useState } from 'react'
\`\`\`
No framer-motion. This is a pure canvas component.

## API guardrails
USE only: useEffect, useRef, useState, requestAnimationFrame, cancelAnimationFrame, ResizeObserver, MutationObserver, CanvasRenderingContext2D. DO NOT invent \`useCanvas\`, \`useAnimationFrame\`, \`useMotionValue\`, \`useSpringValue\`, or helpers not listed.

## Concept
Full-bleed canvas covered in randomly scattered tiny stroked circles. When the cursor gets near, circles brighten and grow a faint double-ring halo (radius 1.5 inside, radius 7 outside) around the base 3px circle. Supports light and dark themes.

## Constants
\`\`\`
const DENSITY      = 1 / 250
const MAX_DOTS     = 3000
const RADIUS       = 200
const BASE_R       = 3
const BASE_A_DARK  = 0.18
const BASE_A_LIGHT = 0.28
const PEAK_A       = 0.65
\`\`\`

## Refs & state
containerRef (HTMLDivElement), canvasRef (HTMLCanvasElement), mouseRef ({x,y}|null, null initially), isDarkRef (boolean default true), isDark state (default true).

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
Store cw = rect.width and ch = rect.height.

## Build circles
\`\`\`
const count = Math.min(Math.round(cw * ch * DENSITY), MAX_DOTS)
circles = Array.from({ length: count }, () => ({
  x: Math.random() * cw,
  y: Math.random() * ch,
  b: 0,
}))
\`\`\`

## Frame loop (verbatim math)
\`\`\`
ctx.clearRect(0, 0, cw, ch)
const mx = mouseRef.current?.x ?? -99999
const my = mouseRef.current?.y ?? -99999
const r2 = RADIUS * RADIUS
const dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'
const baseA  = isDarkRef.current ? BASE_A_DARK : BASE_A_LIGHT

for (const c of circles) {
  const dx = c.x - mx
  const dy = c.y - my
  const dist2 = dx*dx + dy*dy
  const tgt = dist2 < r2 ? Math.exp(-dist2 / (RADIUS*RADIUS*0.25)) : 0
  c.b += (tgt > c.b ? 0.16 : 0.07) * (tgt - c.b)
  if (c.b < 0.004) c.b = 0
  const alpha = baseA + (PEAK_A - baseA) * c.b

  if (c.b > 0.02) {
    ctx.strokeStyle = \`rgba(\${dotRGB},\${(c.b * 0.50).toFixed(2)})\`
    ctx.lineWidth = 0.5
    ctx.beginPath(); ctx.arc(c.x, c.y, 1.5, 0, Math.PI*2); ctx.stroke()
  }
  if (c.b > 0.02) {
    ctx.strokeStyle = \`rgba(\${dotRGB},\${(c.b * 0.40).toFixed(2)})\`
    ctx.lineWidth = 0.5
    ctx.beginPath(); ctx.arc(c.x, c.y, 7, 0, Math.PI*2); ctx.stroke()
  }
  ctx.strokeStyle = \`rgba(\${dotRGB},\${alpha.toFixed(2)})\`
  ctx.lineWidth = 0.5
  ctx.beginPath(); ctx.arc(c.x, c.y, BASE_R, 0, Math.PI*2); ctx.stroke()
}
\`\`\`

## Pointer + resize
onMouseMove/onTouchMove on outer div → mouseRef.current = {x: clientX - canvasRect.left, y: clientY - canvasRect.top}. onMouseLeave/onTouchEnd → mouseRef.current = null. ResizeObserver on canvas.parentElement re-runs build() (re-sizes AND reshuffles the circle array — this is intentional).

## JSX
Outer div: className "relative h-full w-full overflow-hidden", style background '#110F0C' dark / '#F5F1EA' light. Canvas absolute inset-0 width/height 100%. Centered pointer-events-none overlay (flex-col items-center justify-center gap-2):
- "Circle Field" — fontSize 22, fontWeight 700, letterSpacing -0.02em, color rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light
- "hover to illuminate" — fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em, color rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light

## Cleanup
let alive = true; on unmount alive=false, cancelAnimationFrame(animId), ro.disconnect(), observer.disconnect().`,
}
