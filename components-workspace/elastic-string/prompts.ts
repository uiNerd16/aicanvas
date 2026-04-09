import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`ElasticString\`. Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A taut horizontal line across a canvas that bends toward the cursor like a guitar string. Physics: spring-damper on the Bezier control point Y. On hover the control point is pulled toward the cursor (capped); on leave the target snaps back to 0 and the string oscillates to rest. When fully idle, a slow sine "breath" keeps the line subtly alive.

Use raw canvas + requestAnimationFrame. No Framer Motion.

## Physics constants
\`\`\`
TENSION  = 0.042   // spring stiffness
DAMPING  = 0.88    // velocity multiplier per frame
MAX_PULL = 0.38    // max deflection as fraction of canvas height
LERP_K   = 0.22    // how fast targetY follows raw pull
\`\`\`

## Effect-scoped state (not React state)
\`ctrlY = 0\` (current control-point Y offset from center), \`velY = 0\`, \`targetY = 0\`, \`idleT = 0\`, \`mouseX = 0\`, \`isHovering = false\`.

## Sizing
Use ResizeObserver on the canvas. On resize:
\`\`\`
const dpr = window.devicePixelRatio || 1
canvas.width  = canvas.offsetWidth  * dpr
canvas.height = canvas.offsetHeight * dpr
ctx.scale(dpr, dpr)
// reset physics
ctrlY = 0; velY = 0; targetY = 0
\`\`\`

## Physics tick
\`\`\`
idleT += 0.012
isSettled = !isHovering && Math.abs(ctrlY) < 2 && Math.abs(velY) < 0.5
if (isSettled) {
  const h = canvas.height / dpr
  const idleAmp = h * 0.028
  ctrlY = Math.sin(idleT) * idleAmp * Math.sin(idleT * 0.37 + 1.1)
  velY  = 0
} else {
  velY  += (targetY - ctrlY) * TENSION
  velY  *= DAMPING
  ctrlY += velY
  if (!isHovering && Math.abs(ctrlY) < 0.05 && Math.abs(velY) < 0.05) {
    ctrlY = 0; velY = 0; targetY = 0
  }
}
\`\`\`

## Draw (per frame, CSS-pixel coordinates)
\`w = canvas.width/dpr\`, \`h = canvas.height/dpr\`, \`cy = h/2\`.
1. clearRect then fillRect with '#110F0C' dark / '#F5F1EA' light.
2. Three quadraticCurveTo passes from (0, cy) → (w, cy), control point (cptX = mouseX || w/2, cptY = cy + ctrlY):
   - Glow: lineWidth 8, lineCap round, stroke rgba(255,255,255,0.07) dark / rgba(28,25,22,0.07) light
   - Mid:  lineWidth 3, stroke rgba(.,.,.,0.18)
   - Sharp: lineWidth 1.5, stroke rgba(.,.,.,0.72)
3. Pluck highlight dot at (cptX, cptY), radius 3:
   \`\`\`
   deflection = Math.abs(ctrlY)
   maxDef     = h * MAX_PULL
   dotAlpha   = Math.min(deflection / (maxDef * 0.5), 1) * 0.55
   \`\`\`
   Skip if dotAlpha <= 0.01. Fill rgba(255,255,255,dotAlpha) dark / rgba(28,25,22,dotAlpha) light.

## Mouse handlers (attached directly to the canvas element)
onMouseMove:
\`\`\`
const rect = canvas.getBoundingClientRect()
const localX = e.clientX - rect.left
const localY = e.clientY - rect.top
mouseX = localX
const h = canvas.height / dpr
const cy = h / 2
const distFromCenter = localY - cy
const proximity = 1 - Math.min(Math.abs(distFromCenter) / (h * 0.5), 1)
const strength  = proximity * proximity
const rawPull   = distFromCenter * strength
const maxPull   = h * MAX_PULL
targetY += (Math.max(-maxPull, Math.min(maxPull, rawPull)) - targetY) * LERP_K
\`\`\`
onMouseEnter: \`isHovering = true\`, then call onMouseMove.
onMouseLeave: \`isHovering = false\`, \`targetY = 0\`.

## Theme detection
Walk \`wrapperRef.current.closest('[data-card-theme]')\` → its .dark class; else documentElement. MutationObserver on both. Mirror into \`isDarkRef\` (used inside the RAF loop) AND isDark state (used for the outer div background).

## JSX
\`\`\`tsx
<div ref={wrapperRef} className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}>
  <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ display: 'block' }} />
</div>
\`\`\`
No label overlay.

## Cleanup
\`alive = false\`; cancelAnimationFrame(rafId); ro.disconnect(); remove mousemove/mouseenter/mouseleave from the canvas element; observer.disconnect() (its own effect).`,

  GPT: `Build a React client component named \`ElasticString\`. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

No Framer Motion. Raw canvas + requestAnimationFrame only.

## Constants
\`\`\`
TENSION  = 0.042
DAMPING  = 0.88
MAX_PULL = 0.38
LERP_K   = 0.22
\`\`\`

## Refs & state
canvasRef, wrapperRef (HTMLDivElement), isDark state (default true), isDarkRef (boolean, mirrors isDark for the RAF loop).

## Theme detection
\`wrapperRef.current.closest('[data-card-theme]')\` → its .dark class; else \`document.documentElement.classList.contains('dark')\`. MutationObserver attributeFilter ['class'] on documentElement and card wrapper. Mirror into ref and state.

## Effect-scoped variables (NOT React state)
\`\`\`
let rafId: number
let alive = true
let ctrlY = 0
let velY  = 0
let targetY = 0
let idleT = 0
let mouseX = 0
let isHovering = false
\`\`\`

## Resize
ResizeObserver on the canvas element.
\`\`\`
function resize() {
  const dpr = window.devicePixelRatio || 1
  canvas.width  = canvas.offsetWidth  * dpr
  canvas.height = canvas.offsetHeight * dpr
  ctx.scale(dpr, dpr)
  ctrlY = 0; velY = 0; targetY = 0
}
\`\`\`
Call once immediately and on every observed resize.

## Physics tick
\`\`\`
rafId = requestAnimationFrame(tick)
idleT += 0.012
const isSettled = !isHovering && Math.abs(ctrlY) < 2 && Math.abs(velY) < 0.5
if (isSettled) {
  const dpr = window.devicePixelRatio || 1
  const h = canvas.height / dpr
  const idleAmp = h * 0.028  // 2.8% of height
  ctrlY = Math.sin(idleT) * idleAmp * Math.sin(idleT * 0.37 + 1.1)
  velY  = 0
} else {
  velY  += (targetY - ctrlY) * TENSION
  velY  *= DAMPING
  ctrlY += velY
  if (!isHovering && Math.abs(ctrlY) < 0.05 && Math.abs(velY) < 0.05) {
    ctrlY = 0; velY = 0; targetY = 0
  }
}
draw()
\`\`\`

## Draw
\`\`\`
const dpr = window.devicePixelRatio || 1
const w = canvas.width / dpr
const h = canvas.height / dpr
const cy = h / 2
ctx.clearRect(0, 0, w, h)
ctx.fillStyle = isDarkRef.current ? '#110F0C' : '#F5F1EA'
ctx.fillRect(0, 0, w, h)

const cptX = mouseX || w / 2
const cptY = cy + ctrlY
const isDk = isDarkRef.current

// Glow pass
ctx.beginPath()
ctx.moveTo(0, cy)
ctx.quadraticCurveTo(cptX, cptY, w, cy)
ctx.lineWidth = 8
ctx.lineCap = 'round'
ctx.strokeStyle = isDk ? 'rgba(255,255,255,0.07)' : 'rgba(28,25,22,0.07)'
ctx.stroke()

// Mid glow
ctx.beginPath()
ctx.moveTo(0, cy)
ctx.quadraticCurveTo(cptX, cptY, w, cy)
ctx.lineWidth = 3
ctx.strokeStyle = isDk ? 'rgba(255,255,255,0.18)' : 'rgba(28,25,22,0.18)'
ctx.stroke()

// Sharp pass
ctx.beginPath()
ctx.moveTo(0, cy)
ctx.quadraticCurveTo(cptX, cptY, w, cy)
ctx.lineWidth = 1.5
ctx.strokeStyle = isDk ? 'rgba(255,255,255,0.72)' : 'rgba(28,25,22,0.72)'
ctx.stroke()

// Pluck highlight dot
const deflection = Math.abs(ctrlY)
const maxDef = h * MAX_PULL
const dotAlpha = Math.min(deflection / (maxDef * 0.5), 1) * 0.55
if (dotAlpha > 0.01) {
  ctx.beginPath()
  ctx.arc(cptX, cptY, 3, 0, Math.PI * 2)
  ctx.fillStyle = isDk
    ? \`rgba(255,255,255,\${dotAlpha.toFixed(3)})\`
    : \`rgba(28,25,22,\${dotAlpha.toFixed(3)})\`
  ctx.fill()
}
\`\`\`

## Mouse handlers (attach to canvas element directly)
\`\`\`
function onMouseMove(e: MouseEvent) {
  const rect = canvas.getBoundingClientRect()
  const localX = e.clientX - rect.left
  const localY = e.clientY - rect.top
  mouseX = localX
  const dpr = window.devicePixelRatio || 1
  const h = canvas.height / dpr
  const cy = h / 2
  const distFromCenter = localY - cy
  const proximity = 1 - Math.min(Math.abs(distFromCenter) / (h * 0.5), 1)
  const strength = proximity * proximity
  const rawPull  = distFromCenter * strength
  const maxPull  = h * MAX_PULL
  targetY += (Math.max(-maxPull, Math.min(maxPull, rawPull)) - targetY) * LERP_K
}
function onMouseEnter(e: MouseEvent) { isHovering = true; onMouseMove(e) }
function onMouseLeave() { isHovering = false; targetY = 0 }
canvas.addEventListener('mousemove', onMouseMove)
canvas.addEventListener('mouseenter', onMouseEnter)
canvas.addEventListener('mouseleave', onMouseLeave)
\`\`\`

## JSX
\`\`\`tsx
<div ref={wrapperRef} className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}>
  <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ display: 'block' }} />
</div>
\`\`\`
No label overlay.

## Cleanup
alive=false; cancelAnimationFrame(rafId); ro.disconnect(); remove all three canvas listeners; observer.disconnect().`,

  Gemini: `Implement a React client component named \`ElasticString\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useEffect, useRef, useState } from 'react'
\`\`\`
No framer-motion. Pure canvas + requestAnimationFrame.

## API guardrails
USE only: useEffect, useRef, useState, requestAnimationFrame, cancelAnimationFrame, ResizeObserver, MutationObserver, CanvasRenderingContext2D. DO NOT invent \`useCanvas\`, \`useAnimationFrame\`, \`useMotionValue\`, \`useSpringValue\`, or any helper not listed.

## Concept
A taut horizontal string across a canvas that bends toward the cursor like a plucked guitar string. Physics: a spring-damper system on the Y offset of a quadratic Bezier control point. On hover → the control point is pulled toward the cursor (capped by MAX_PULL * height). On leave → the target snaps back to zero and the string oscillates to rest. When fully idle → slow sine "breath" keeps the string subtly alive. Three stroke passes (glow, mid, sharp) plus a fading pluck dot at the control point.

## Constants
\`\`\`
const TENSION  = 0.042
const DAMPING  = 0.88
const MAX_PULL = 0.38
const LERP_K   = 0.22
\`\`\`

## Refs & state
canvasRef (HTMLCanvasElement), wrapperRef (HTMLDivElement), \`[isDark, setIsDark] = useState(true)\`, isDarkRef (mirrors isDark for the RAF loop).

## Theme detection effect (verbatim)
\`\`\`
const el = wrapperRef.current
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

## Physics effect-scoped state (NOT React state)
\`\`\`
let rafId: number
let alive = true
let ctrlY = 0
let velY  = 0
let targetY = 0
let idleT  = 0
let mouseX = 0
let isHovering = false
\`\`\`

## Canvas DPR scaffolding (Elastic String variant, inline verbatim)
\`\`\`
function resize() {
  const dpr = window.devicePixelRatio || 1
  canvas.width  = canvas.offsetWidth  * dpr
  canvas.height = canvas.offsetHeight * dpr
  ctx.scale(dpr, dpr)
  ctrlY = 0; velY = 0; targetY = 0
}
const ro = new ResizeObserver(resize)
ro.observe(canvas)
resize()
\`\`\`

## Physics tick
\`\`\`
function tick() {
  if (!alive) return
  rafId = requestAnimationFrame(tick)
  idleT += 0.012
  const isSettled = !isHovering && Math.abs(ctrlY) < 2 && Math.abs(velY) < 0.5
  if (isSettled) {
    const dpr = window.devicePixelRatio || 1
    const h = canvas.height / dpr
    const idleAmp = h * 0.028
    ctrlY = Math.sin(idleT) * idleAmp * Math.sin(idleT * 0.37 + 1.1)
    velY  = 0
  } else {
    velY  += (targetY - ctrlY) * TENSION
    velY  *= DAMPING
    ctrlY += velY
    if (!isHovering && Math.abs(ctrlY) < 0.05 && Math.abs(velY) < 0.05) {
      ctrlY = 0; velY = 0; targetY = 0
    }
  }
  draw()
}
\`\`\`

## Draw
\`\`\`
function draw() {
  const dpr = window.devicePixelRatio || 1
  const w = canvas.width / dpr
  const h = canvas.height / dpr
  const cy = h / 2

  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = isDarkRef.current ? '#110F0C' : '#F5F1EA'
  ctx.fillRect(0, 0, w, h)

  const cptX = mouseX || w / 2
  const cptY = cy + ctrlY
  const isDk = isDarkRef.current

  // Glow pass
  ctx.beginPath(); ctx.moveTo(0, cy)
  ctx.quadraticCurveTo(cptX, cptY, w, cy)
  ctx.lineWidth = 8
  ctx.lineCap = 'round'
  ctx.strokeStyle = isDk ? 'rgba(255,255,255,0.07)' : 'rgba(28,25,22,0.07)'
  ctx.stroke()

  // Mid glow
  ctx.beginPath(); ctx.moveTo(0, cy)
  ctx.quadraticCurveTo(cptX, cptY, w, cy)
  ctx.lineWidth = 3
  ctx.strokeStyle = isDk ? 'rgba(255,255,255,0.18)' : 'rgba(28,25,22,0.18)'
  ctx.stroke()

  // Sharp pass
  ctx.beginPath(); ctx.moveTo(0, cy)
  ctx.quadraticCurveTo(cptX, cptY, w, cy)
  ctx.lineWidth = 1.5
  ctx.strokeStyle = isDk ? 'rgba(255,255,255,0.72)' : 'rgba(28,25,22,0.72)'
  ctx.stroke()

  // Pluck highlight dot
  const deflection = Math.abs(ctrlY)
  const maxDef = h * MAX_PULL
  const dotAlpha = Math.min(deflection / (maxDef * 0.5), 1) * 0.55
  if (dotAlpha > 0.01) {
    ctx.beginPath()
    ctx.arc(cptX, cptY, 3, 0, Math.PI * 2)
    ctx.fillStyle = isDk
      ? \`rgba(255,255,255,\${dotAlpha.toFixed(3)})\`
      : \`rgba(28,25,22,\${dotAlpha.toFixed(3)})\`
    ctx.fill()
  }
}
\`\`\`

## Mouse handlers (attach directly to the canvas element, NOT the wrapper)
\`\`\`
function onMouseMove(e: MouseEvent) {
  const rect = canvas.getBoundingClientRect()
  const localX = e.clientX - rect.left
  const localY = e.clientY - rect.top
  mouseX = localX
  const dpr = window.devicePixelRatio || 1
  const h = canvas.height / dpr
  const cy = h / 2
  const distFromCenter = localY - cy
  const proximity = 1 - Math.min(Math.abs(distFromCenter) / (h * 0.5), 1)
  const strength = proximity * proximity
  const rawPull  = distFromCenter * strength
  const maxPull  = h * MAX_PULL
  targetY += (Math.max(-maxPull, Math.min(maxPull, rawPull)) - targetY) * LERP_K
}
function onMouseEnter(e: MouseEvent) { isHovering = true; onMouseMove(e) }
function onMouseLeave() { isHovering = false; targetY = 0 }
canvas.addEventListener('mousemove', onMouseMove)
canvas.addEventListener('mouseenter', onMouseEnter)
canvas.addEventListener('mouseleave', onMouseLeave)
\`\`\`

## JSX
\`\`\`
<div ref={wrapperRef} className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}>
  <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ display: 'block' }} />
</div>
\`\`\`
No label overlay.

## Cleanup
alive=false; cancelAnimationFrame(rafId); ro.disconnect(); remove all three canvas listeners (mousemove, mouseenter, mouseleave); observer.disconnect().`,
}
