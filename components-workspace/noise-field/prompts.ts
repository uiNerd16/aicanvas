import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`NoiseField\`.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A grid of tiny arrow glyphs on a canvas. Each arrow points toward the cursor (with organic wobble and distance-based lerp speed) and fades in proximity-based opacity. When the cursor leaves, arrows drift back to a noise flow. No overlay text.

## Constants
- GRID_SPACING = 24
- SHAFT_LEN = 8 (half shaft)
- HEAD_SIZE = 4 (arrowhead branch length)
- DECAY_DIST = 320 (px, proximity decay)
- LERP_FAST = 0.12, LERP_MIN = 0.006, IDLE_LERP = 0.010
- WOBBLE_AMP = 0.18 rad, WOBBLE_FREQ = 0.7

## Arrow
interface Arrow { gx: number; gy: number; angle: number; phase: number }

## Helpers (inline)
- flowAngle(gx,gy,t) = sin(gx*0.007 + t)*PI + cos(gy*0.007 + t*0.6)*PI
- lerpAngle(cur, target, speed): wrap diff to (-PI,PI], return cur + diff*speed

## Build grid (and on resize)
For gx from GRID_SPACING/2 to W step GRID_SPACING, gy from GRID_SPACING/2 to H step GRID_SPACING, push { gx, gy, angle: existing?.angle ?? flowAngle(gx,gy,t), phase: existing?.phase ?? Math.random()*2PI }. Preserve existing state via Map keyed \`gx,gy\`.

## Canvas setup
Use container.clientWidth/Height; canvas.width = w*dpr, canvas.height = h*dpr, style.width = \`\${w}px\`, style.height = \`\${h}px\`; ctx.setTransform(dpr,0,0,dpr,0,0).

## Per frame (t starts 0, t += 0.004 each frame)
Fill bg: dark '#110F0C' / light '#F5F1EA'. ctx.lineCap='round', lineJoin='round'.

For each arrow:
- If mouse present:
  - dx=mouse.x-gx, dy=mouse.y-gy, dist=sqrt(dx²+dy²)
  - proximityFactor = exp(-dist/DECAY_DIST)
  - wobble = WOBBLE_AMP * (1 - proximityFactor*0.7) * sin(t*WOBBLE_FREQ + phase)
  - targetAngle = atan2(dy,dx) + wobble
  - speed = LERP_FAST*proximityFactor + LERP_MIN
  - arrow.angle = lerpAngle(arrow.angle, targetAngle, speed)
- Else:
  - noiseAngle = flowAngle(gx,gy,t) + WOBBLE_AMP*0.5*sin(t*WOBBLE_FREQ*0.8 + phase)
  - arrow.angle = lerpAngle(arrow.angle, noiseAngle, IDLE_LERP)

- alpha: if mouse: proximity = exp(-(dx²+dy²)/(200*200)); alpha = dark ? 0.06 + proximity*0.84 : 0.05 + proximity*0.75. Else: alpha = dark ? 0.18 : 0.15.
- color = dark ? rgba(255,255,255,alpha) : rgba(28,25,22,alpha)
- tipX = gx + cos*SHAFT_LEN, tipY = gy + sin*SHAFT_LEN, tailX = gx - cos*SHAFT_LEN, tailY = gy - sin*SHAFT_LEN
- Shaft: lineWidth 1.2, moveTo tail → lineTo tip, stroke
- Arrowhead: headAngle = PI - PI/5 (144°), lineWidth 1.0, two branches from tip at angles ± headAngle length HEAD_SIZE, stroke

## Theme detection
useState isDark + isDarkRef. Check closest('[data-card-theme]') class 'dark' or documentElement fallback. MutationObserver on both.

## Mouse tracking
On canvas: mousemove → mouseRef = { x: clientX - rect.left, y: clientY - rect.top }. mouseleave → null.

## JSX
div ref containerRef relative h-full w-full overflow-hidden, inline bg per theme. Canvas absolute inset-0.

Cleanup: cancelAnimationFrame, ro.disconnect, remove listeners, observer.disconnect.`,

  GPT: `Build a React client component named \`NoiseField\`. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

Grid of tiny arrows on a canvas that point toward the cursor with organic wobble and distance-decayed opacity; drift along a noise flow when idle. No overlay text.

## Constants
GRID_SPACING=24, SHAFT_LEN=8, HEAD_SIZE=4
DECAY_DIST=320, LERP_FAST=0.12, LERP_MIN=0.006, IDLE_LERP=0.010
WOBBLE_AMP=0.18, WOBBLE_FREQ=0.7

## Types
interface Arrow { gx:number; gy:number; angle:number; phase:number }

## Helpers
flowAngle(gx,gy,t) = Math.sin(gx*0.007+t)*Math.PI + Math.cos(gy*0.007+t*0.6)*Math.PI
lerpAngle(cur,target,speed): diff = target-cur; while diff>PI diff-=2PI; while diff<-PI diff+=2PI; return cur + diff*speed

## Canvas setup
w = container.clientWidth || 480; h = container.clientHeight || 480; dpr = devicePixelRatio||1
canvas.width = w*dpr; canvas.height = h*dpr; canvas.style.width = \`\${w}px\`; canvas.style.height = \`\${h}px\`; ctx.setTransform(dpr,0,0,dpr,0,0)

## Build grid
Preserve across resize via Map<string,Arrow> keyed \`\${gx},\${gy}\`:
for gx=GRID_SPACING/2; gx<W; gx+=GRID_SPACING:
  for gy=GRID_SPACING/2; gy<H; gy+=GRID_SPACING:
    { gx, gy, angle: prev?.angle ?? flowAngle(gx,gy,t), phase: prev?.phase ?? Math.random()*2π }

## Per-frame loop (t += 0.004 per frame)
Fill bg: dark '#110F0C' / light '#F5F1EA'. ctx.lineCap='round', lineJoin='round'.
for each arrow:
  if mouse:
    dx = mouse.x - gx; dy = mouse.y - gy; dist = sqrt(dx²+dy²)
    proximityFactor = exp(-dist/320)
    wobble = 0.18 * (1 - proximityFactor*0.7) * sin(t*0.7 + phase)
    target = atan2(dy,dx) + wobble
    speed = 0.12*proximityFactor + 0.006
    arrow.angle = lerpAngle(arrow.angle, target, speed)
  else:
    noise = flowAngle(gx,gy,t) + 0.18*0.5*sin(t*0.7*0.8 + phase)
    arrow.angle = lerpAngle(arrow.angle, noise, 0.010)

  alpha:
    if mouse: proximity = exp(-(dx²+dy²)/(200*200)); alpha = dark ? 0.06 + proximity*0.84 : 0.05 + proximity*0.75
    else: alpha = dark ? 0.18 : 0.15

  color = dark ? \`rgba(255,255,255,\${alpha.toFixed(3)})\` : \`rgba(28,25,22,\${alpha.toFixed(3)})\`
  cos = Math.cos(angle); sin = Math.sin(angle)
  tipX = gx + cos*8; tipY = gy + sin*8; tailX = gx - cos*8; tailY = gy - sin*8
  strokeStyle=color
  lineWidth=1.2; beginPath; moveTo(tailX,tailY); lineTo(tipX,tipY); stroke
  headAngle = PI - PI/5
  lineWidth=1.0
  beginPath; moveTo(tipX,tipY); lineTo(tipX + cos(angle+headAngle)*4, tipY + sin(angle+headAngle)*4); stroke
  beginPath; moveTo(tipX,tipY); lineTo(tipX + cos(angle-headAngle)*4, tipY + sin(angle-headAngle)*4); stroke

## Theme detection
useState isDark + isDarkRef mirror. closest('[data-card-theme]') class 'dark' or documentElement fallback. MutationObserver on both, attributeFilter ['class'].

## JSX structure
div ref containerRef relative h-full w-full overflow-hidden, inline background = isDark ? '#110F0C' : '#F5F1EA'. canvas ref absolute inset-0 (no style needed). Mouse listeners attach on canvas (not div): mousemove → mouseRef.current = { x: e.clientX-rect.left, y: e.clientY-rect.top }; mouseleave → null.

## Cleanup
cancelAnimationFrame(rafId); ro.disconnect(); remove mousemove/mouseleave; observer.disconnect.`,

  Gemini: `Implement a React client component named \`NoiseField\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

A canvas grid of tiny arrows. Each arrow points toward the cursor with organic wobble and distance-decayed opacity. When idle, arrows drift along a noise flow. No overlay text.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useEffect, useRef, useState } from 'react'
\`\`\`
USE these hooks and no others. DO NOT invent useSpringValue, useAnimatedValue, or helpers not shown above. No framer-motion.

## Constants (exact)
GRID_SPACING=24, SHAFT_LEN=8, HEAD_SIZE=4, DECAY_DIST=320, LERP_FAST=0.12, LERP_MIN=0.006, IDLE_LERP=0.010, WOBBLE_AMP=0.18, WOBBLE_FREQ=0.7.

## Types
interface Arrow { gx:number; gy:number; angle:number; phase:number }

## Refs / state
containerRef<HTMLDivElement>, canvasRef<HTMLCanvasElement>, mouseRef<{x:number;y:number}|null>, arrowsRef<Arrow[]>, isDark state + isDarkRef.

## Helpers (inline, outside component)
\`\`\`
function flowAngle(gx:number, gy:number, t:number):number {
  return Math.sin(gx*0.007 + t)*Math.PI + Math.cos(gy*0.007 + t*0.6)*Math.PI
}
function lerpAngle(cur:number, target:number, speed:number):number {
  let diff = target - cur
  while (diff > Math.PI) diff -= Math.PI*2
  while (diff < -Math.PI) diff += Math.PI*2
  return cur + diff*speed
}
\`\`\`

## Canvas DPR scaffolding (inline exactly)
\`\`\`
const w = container.clientWidth || 480
const h = container.clientHeight || 480
const dpr = window.devicePixelRatio || 1
canvas.width = w * dpr
canvas.height = h * dpr
canvas.style.width = \`\${w}px\`
canvas.style.height = \`\${h}px\`
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
\`\`\`
Then call buildGrid(w,h). Attach ResizeObserver to container that re-runs the whole resize function.

## buildGrid
Preserve existing via Map keyed \`\${gx},\${gy}\`:
for gx = GRID_SPACING/2; gx < W; gx += GRID_SPACING:
  for gy = GRID_SPACING/2; gy < H; gy += GRID_SPACING:
    push { gx, gy, angle: existing?.angle ?? flowAngle(gx,gy,t), phase: existing?.phase ?? Math.random()*Math.PI*2 }

## Animation loop (t += 0.004 per frame)
Fill bg: dark '#110F0C' / light '#F5F1EA'. ctx.lineCap='round'; ctx.lineJoin='round'.
For each arrow:
- if mouse:
  - dx = mouse.x-gx; dy = mouse.y-gy; dist = sqrt(dx²+dy²)
  - proximityFactor = Math.exp(-dist/320)
  - wobble = 0.18*(1 - proximityFactor*0.7)*Math.sin(t*0.7 + phase)
  - targetAngle = Math.atan2(dy,dx) + wobble
  - speed = 0.12*proximityFactor + 0.006
  - arrow.angle = lerpAngle(arrow.angle, targetAngle, speed)
- else:
  - noiseAngle = flowAngle(gx,gy,t) + 0.18*0.5*Math.sin(t*0.56 + phase)
  - arrow.angle = lerpAngle(arrow.angle, noiseAngle, 0.010)

Alpha:
- if mouse: proximity = Math.exp(-(dx²+dy²)/(200*200)); alpha = dark ? 0.06 + proximity*0.84 : 0.05 + proximity*0.75
- else: alpha = dark ? 0.18 : 0.15

Draw (with angle = arrow.angle, cos/sin):
- shaft: ctx.strokeStyle = rgba; ctx.lineWidth=1.2; moveTo(gx-cos*8, gy-sin*8); lineTo(gx+cos*8, gy+sin*8); stroke
- head: headAngle = Math.PI - Math.PI/5; ctx.lineWidth=1.0; two branches from tip length 4 at angles ± headAngle

## Theme detection
const check = () => { const card = el.closest('[data-card-theme]'); const dark = card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark'); setIsDark(dark); isDarkRef.current = dark; }
MutationObserver observing documentElement + card wrapper (if present), attributeFilter ['class']. Disconnect on unmount.

## JSX
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden"
     style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}>
  <canvas ref={canvasRef} className="absolute inset-0" />
</div>
\`\`\`
Mouse listeners attach to canvas (not div) in their own useEffect; mousemove sets mouseRef = { x: e.clientX-rect.left, y: e.clientY-rect.top }; mouseleave sets null. Remove both on cleanup.

## Cleanup
cancelAnimationFrame(rafId); ro.disconnect(); observer.disconnect(); listeners removed.`,
}
