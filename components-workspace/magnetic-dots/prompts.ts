import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`MagneticDots\`.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A full-bleed canvas dot grid where dots are magnetically pulled toward the cursor and spring back when it leaves. No overlay text.

Constants (exact):
- SPACING = 22 (px between dot centres)
- DOT_RADIUS = 1.5
- INFLUENCE_R = 180
- SPRING_K = 0.055
- DAMPING = 0.11 (velocity *= 1 - DAMPING)
- MAG_STRENGTH = 16
- LERP_FACTOR = 0.06 (hoverStr ease)
- MOUSE_LERP = 0.14 (smoothed mouse)

Dot: { restX, restY, x, y, vx, vy }. Build grid: cols = ceil(w/SPACING)+1, rows = ceil(h/SPACING)+1, ox = (w%SPACING)/2, oy = (h%SPACING)/2. Preserve existing dots across resizes via a Map keyed on \`restX,restY\`.

Canvas DPR: rect = getBoundingClientRect; canvas.width = round(rect.width*dpr); canvas.height = round(rect.height*dpr); ctx.setTransform(dpr,0,0,dpr,0,0).

Per frame:
- hoverStr += (target - hoverStr) * LERP_FACTOR, target = 1 if pointer else 0
- If pointer: smoothMx += (rawX - smoothMx) * MOUSE_LERP (snap on first contact via a -99999 sentinel). Else reset sentinel.
- clearRect. fillStyle = dark ? 'rgba(255,255,255,0.5)' : 'rgba(28,25,22,0.4)'.
- For each dot:
  - If hoverStr > 0.001 and dist2 < INFLUENCE_R^2 and dist2 > 0.01: t = 1 - dist/INFLUENCE_R; force = t*t*MAG_STRENGTH*hoverStr; vx += (-dx/dist)*force; vy += (-dy/dist)*force (pulls toward cursor).
  - Spring: vx += (restX - x)*SPRING_K; vy += (restY - y)*SPRING_K.
  - vx *= 1 - DAMPING; vy *= 1 - DAMPING. Integrate. Draw arc radius DOT_RADIUS.

Theme: detect via closest('[data-card-theme]').classList.contains('dark'), fallback documentElement. MutationObserver on both. Background: dark '#110F0C', light '#F5F1EA' — set via container inline style.

Root: div ref relative h-full w-full overflow-hidden with mouse/touch handlers updating mouseRef to { x: clientX-rect.left, y: clientY-rect.top }; leave/end sets null. Canvas absolute inset-0 100%/100%.

Cleanup: alive flag, cancelAnimationFrame, ResizeObserver on parentElement, observer.disconnect.`,

  GPT: `Build a React client component named \`MagneticDots\`. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

Full-bleed canvas dot grid. Dots are magnetically pulled toward the cursor via spring physics and glide back when it leaves. No overlay text.

## Constants
- SPACING = 22, DOT_RADIUS = 1.5
- INFLUENCE_R = 180
- SPRING_K = 0.055, DAMPING = 0.11
- MAG_STRENGTH = 16
- LERP_FACTOR = 0.06 (hoverStr), MOUSE_LERP = 0.14

## Types
Dot = { restX, restY, x, y, vx, vy } — all numbers.

## Canvas setup
dpr = devicePixelRatio || 1; rect = canvas.getBoundingClientRect(); cw = rect.width; ch = rect.height; canvas.width = round(cw*dpr); canvas.height = round(ch*dpr); ctx.setTransform(dpr,0,0,dpr,0,0).

## Grid build
cols = ceil(cw/SPACING)+1; rows = ceil(ch/SPACING)+1; ox = (cw%SPACING)/2; oy = (ch%SPACING)/2. For each (r,c): rx = ox+c*SPACING, ry = oy+r*SPACING. On rebuild (resize), keep old dot state via Map keyed \`rx,ry\`.

## Per-frame loop
hasPointer = mouseRef != null
targetStr = hasPointer ? 1 : 0
hoverStr += (targetStr - hoverStr) * 0.06
if hasPointer:
  if smoothMx == -99999: smoothMx = raw.x; smoothMy = raw.y
  smoothMx += (raw.x - smoothMx) * 0.14
  smoothMy += (raw.y - smoothMy) * 0.14
else: smoothMx = smoothMy = -99999
mx = smoothMx; my = smoothMy; r2 = 180*180
clearRect. fillStyle = dark ? 'rgba(255,255,255,0.5)' : 'rgba(28,25,22,0.4)'
for each dot d:
  if hoverStr > 0.001:
    dx = d.x - mx; dy = d.y - my; dist2 = dx*dx + dy*dy
    if dist2 < r2 and dist2 > 0.01:
      dist = sqrt(dist2); t = 1 - dist/180; force = t*t*16*hoverStr
      d.vx += (-dx/dist)*force; d.vy += (-dy/dist)*force
  d.vx += (d.restX - d.x)*0.055
  d.vy += (d.restY - d.y)*0.055
  d.vx *= 0.89; d.vy *= 0.89
  d.x += d.vx; d.y += d.vy
  arc(d.x,d.y,1.5,0,2π); fill()

## Theme detection
isDarkRef + bgRef. Check closest('[data-card-theme]') class 'dark', fallback documentElement. MutationObserver on both (attributeFilter ['class']). Apply: isDarkRef.current + container.style.background = dark ? '#110F0C' : '#F5F1EA'.

## JSX structure
div ref relative h-full w-full overflow-hidden, inline background '#110F0C' initial. Handlers onMouseMove/onMouseLeave/onTouchMove/onTouchEnd setting mouseRef = { x: clientX-rect.left, y: clientY-rect.top } or null. Canvas absolute inset-0, style width 100% height 100%.

## Cleanup
alive=false; cancelAnimationFrame; ResizeObserver.observe(canvas.parentElement) → disconnect.`,

  Gemini: `Implement a React client component named \`MagneticDots\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

A canvas full-bleed grid of dots that are pulled toward the cursor like magnets and spring-glide back to rest when the cursor leaves. No overlay text.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useEffect, useRef } from 'react'
\`\`\`
USE these hooks and no others. DO NOT invent useSpringValue, useAnimatedValue, or helpers not shown above. No framer-motion.

## Constants (exact)
SPACING=22, DOT_RADIUS=1.5, INFLUENCE_R=180, SPRING_K=0.055, DAMPING=0.11, MAG_STRENGTH=16, LERP_FACTOR=0.06, MOUSE_LERP=0.14.

## Refs
containerRef<HTMLDivElement>, canvasRef<HTMLCanvasElement>, mouseRef<{x,y}|null>, hoverStrRef (number, 0), isDarkRef (bool, true).

## Canvas DPR scaffolding (inline exactly)
\`\`\`
const dpr = window.devicePixelRatio || 1
const rect = canvas.getBoundingClientRect()
const cw = rect.width, ch = rect.height
canvas.width = Math.round(cw * dpr)
canvas.height = Math.round(ch * dpr)
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
\`\`\`

## Grid build
cols = ceil(cw/22)+1; rows = ceil(ch/22)+1; ox = (cw%22)/2; oy = (ch%22)/2. Each dot: { restX, restY, x, y, vx, vy }. On rebuild preserve prior dots via Map keyed \`\${rx},\${ry}\`.

## Animation loop
target = mouseRef.current ? 1 : 0; hoverStr += (target - hoverStr) * 0.06.
Smoothed mouse: sentinel smoothMx = smoothMy = -99999; on first contact snap to raw, then lerp by 0.14; on leave reset sentinel.
clearRect. fillStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(28,25,22,0.4)'.
For each dot:
- if hoverStr > 0.001: dx=d.x-mx, dy=d.y-my, dist2=dx²+dy². If dist2 < 180² and > 0.01: dist=sqrt(dist2); t = 1 - dist/180; force = t*t*16*hoverStr; d.vx += (-dx/dist)*force; d.vy += (-dy/dist)*force.
- d.vx += (restX-x)*0.055; d.vy += (restY-y)*0.055
- d.vx *= 0.89; d.vy *= 0.89
- d.x += d.vx; d.y += d.vy
- ctx.beginPath(); ctx.arc(d.x,d.y,1.5,0,Math.PI*2); ctx.fill()

## Theme detection
Check el.closest('[data-card-theme]'); if present use its class 'dark', else documentElement.classList.contains('dark'). Apply → isDarkRef.current; set containerRef.current.style.background = dark ? '#110F0C' : '#F5F1EA'. MutationObserver(attributeFilter ['class']) on documentElement and on the card wrapper if present. Disconnect on unmount.

## JSX
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden"
     style={{ background: '#110F0C' }}
     onMouseMove={e => update(e.clientX,e.clientY)}
     onMouseLeave={() => { mouseRef.current = null }}
     onTouchMove={e => { const t = e.touches[0]; if (t) update(t.clientX,t.clientY) }}
     onTouchEnd={() => { mouseRef.current = null }}>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width:'100%', height:'100%' }} />
</div>
\`\`\`
update sets mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top }.

## Cleanup
let alive=true; cancelAnimationFrame(animId); ResizeObserver.observe(canvas.parentElement) calling build on change — disconnect on unmount.`,
}
