import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`NoiseBg\`.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A full-bleed canvas noise field: sparse random dots that subtly brighten near the cursor, with thin connecting lines drawn between lit neighbours. Centred overlay label "Noise" and small caps hint "hover to illuminate".

## Constants
- DENSITY = 1 / 120
- MAX_DOTS = 3000
- RADIUS = 200 (hover influence)
- NEIGHBOUR_D = 35 (max distance for connection line)
- BASE_A_DARK = 0.18, BASE_A_LIGHT = 0.28
- PEAK_A = 0.14

Types: Dot = { x, y, b } (b = brightness). Pair = [Dot, Dot].

## Build (on mount + ResizeObserver)
DPR canvas setup: ctx.setTransform(dpr,0,0,dpr,0,0). Generate count = min(round(cw*ch*DENSITY), MAX_DOTS) dots with random x,y, b=0. Cache neighbour pairs: nested loop i<j, if dx²+dy² < NEIGHBOUR_D², push pair.

## Per frame
clearRect. mx,my from mouseRef else -99999. r2 = RADIUS² .
dotRGB = isDark ? '255,255,255' : '28,25,22'; baseA = isDark ? 0.18 : 0.28.

For each dot:
- dist2 = (d.x-mx)² + (d.y-my)²
- tgt = dist2 < r2 ? exp(-dist2 / (RADIUS² * 0.25)) : 0
- d.b += (tgt > d.b ? 0.16 : 0.07) * (tgt - d.b); if d.b < 0.004, d.b = 0
- alpha = baseA + (PEAK_A - baseA) * d.b
- sz = 0.8 + d.b * 0.6
- fillStyle rgba(\${dotRGB},\${alpha.toFixed(2)}); fillRect(x-sz/2, y-sz/2, sz, sz)

For each pair [a,b]: if a.b<0.05 || b.b<0.05 skip. lineAlpha = min(a.b,b.b)*0.10; strokeStyle rgba; lineWidth 0.5; beginPath moveTo(a) lineTo(b) stroke.

## Theme
Detect via closest('[data-card-theme]').classList.contains('dark'), fallback documentElement. Both useState isDark (for bg/labels) and isDarkRef (for RAF closure). MutationObserver on both elements.

## JSX
Root div relative h-full w-full overflow-hidden, inline background dark '#110F0C' / light '#F5F1EA', mouse/touch handlers. Canvas absolute inset-0 100%/100%. Overlay pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 with two spans:
- "Noise" — color dark rgba(255,255,255,0.45) / light rgba(28,25,22,0.45), fontSize 22, fontWeight 700, letterSpacing -0.02em
- "hover to illuminate" — color dark rgba(255,255,255,0.18) / light rgba(28,25,22,0.22), fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em

Cleanup: alive flag, cancelAnimationFrame, ResizeObserver.disconnect, observer.disconnect.`,

  GPT: `Build a React client component named \`NoiseBg\`. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

Canvas noise field: sparse dots brightening near cursor with thin connecting lines between lit neighbours. Centred "Noise" label + "hover to illuminate" hint.

## Constants
DENSITY = 1/120; MAX_DOTS = 3000; RADIUS = 200; NEIGHBOUR_D = 35; BASE_A_DARK = 0.18; BASE_A_LIGHT = 0.28; PEAK_A = 0.14.

## Types
Dot = { x:number; y:number; b:number }; Pair = [Dot, Dot].

## Canvas setup
dpr = devicePixelRatio||1; rect = canvas.getBoundingClientRect(); cw=rect.width; ch=rect.height; canvas.width=round(cw*dpr); canvas.height=round(ch*dpr); ctx.setTransform(dpr,0,0,dpr,0,0).

## Build (mount + ResizeObserver on canvas.parentElement)
count = min(round(cw*ch*DENSITY), MAX_DOTS)
dots = count random { x:rand*cw, y:rand*ch, b:0 }
pairs = []; nd2 = 35*35
for i in 0..n-1, for j in i+1..n-1:
  if (xi-xj)² + (yi-yj)² < nd2: pairs.push([di,dj])

## Per-frame loop
clearRect(0,0,cw,ch)
mx = mouseRef.x ?? -99999; my = mouseRef.y ?? -99999
r2 = 200*200
dotRGB = isDark ? '255,255,255' : '28,25,22'
baseA = isDark ? 0.18 : 0.28

for each dot d:
  dx = d.x - mx; dy = d.y - my; dist2 = dx*dx + dy*dy
  if dist2 < r2: tgt = exp(-dist2 / (200*200*0.25)) else tgt = 0
  d.b += (tgt > d.b ? 0.16 : 0.07) * (tgt - d.b)
  if d.b < 0.004: d.b = 0
  alpha = baseA + (0.14 - baseA) * d.b
  sz = 0.8 + d.b * 0.6
  fillStyle = \`rgba(\${dotRGB},\${alpha.toFixed(2)})\`
  fillRect(d.x - sz/2, d.y - sz/2, sz, sz)

for each [a,b] in pairs:
  if a.b < 0.05 or b.b < 0.05: continue
  lineAlpha = min(a.b,b.b) * 0.10
  strokeStyle = \`rgba(\${dotRGB},\${lineAlpha.toFixed(2)})\`
  lineWidth = 0.5
  beginPath; moveTo(a.x,a.y); lineTo(b.x,b.y); stroke

## Theme detection
useState isDark (drives bg/labels) + isDarkRef (drives RAF). el.closest('[data-card-theme]').classList.contains('dark') or documentElement fallback. MutationObserver attributeFilter ['class'] on both.

## JSX structure
- div ref containerRef, relative h-full w-full overflow-hidden, inline style background = isDark ? '#110F0C' : '#F5F1EA'. Handlers: onMouseMove/onMouseLeave/onTouchMove/onTouchEnd → mouseRef = { x: clientX-rect.left, y: clientY-rect.top } or null.
- canvas absolute inset-0 style width 100% height 100%.
- overlay div pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2:
  * span "Noise" — color dark rgba(255,255,255,0.45) / light rgba(28,25,22,0.45), fontSize 22, fontWeight 700, letterSpacing -0.02em.
  * span "hover to illuminate" — color dark rgba(255,255,255,0.18) / light rgba(28,25,22,0.22), fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em.

## Cleanup
alive=false; cancelAnimationFrame; ro.disconnect; observer.disconnect.`,

  Gemini: `Implement a React client component named \`NoiseBg\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

A canvas full-bleed noise field: sparse dots brighten near the cursor, with thin lines drawn between lit neighbours. Centred "Noise" label with "hover to illuminate" hint.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useEffect, useRef, useState } from 'react'
\`\`\`
USE these hooks and no others. DO NOT invent useSpringValue, useAnimatedValue, or helpers not shown above. No framer-motion.

## Constants (exact)
DENSITY=1/120, MAX_DOTS=3000, RADIUS=200, NEIGHBOUR_D=35, BASE_A_DARK=0.18, BASE_A_LIGHT=0.28, PEAK_A=0.14.

## Types
type Dot = { x:number; y:number; b:number }
type Pair = [Dot, Dot]

## Refs / state
containerRef<HTMLDivElement>, canvasRef<HTMLCanvasElement>, mouseRef<{x:number;y:number}|null>, isDarkRef (bool, true), const [isDark,setIsDark]=useState(true).

## Canvas DPR scaffolding (inline exactly)
\`\`\`
const dpr = window.devicePixelRatio || 1
const rect = canvas.getBoundingClientRect()
const cw = rect.width, ch = rect.height
canvas.width = Math.round(cw * dpr)
canvas.height = Math.round(ch * dpr)
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
\`\`\`

## Build step
count = Math.min(Math.round(cw*ch*DENSITY), MAX_DOTS)
dots = Array.from({length:count}, () => ({ x:Math.random()*cw, y:Math.random()*ch, b:0 }))
pairs = []
for i in 0..dots.length-1:
  for j in i+1..dots.length-1:
    dx=dots[i].x-dots[j].x; dy=dots[i].y-dots[j].y
    if dx*dx+dy*dy < 35*35: pairs.push([dots[i],dots[j]])

## Animation loop
clearRect. mx = mouseRef.current?.x ?? -99999; my = mouseRef.current?.y ?? -99999.
For each dot:
- dist2 = (d.x-mx)² + (d.y-my)²
- tgt = dist2 < 200*200 ? Math.exp(-dist2/(200*200*0.25)) : 0
- d.b += (tgt > d.b ? 0.16 : 0.07) * (tgt - d.b); if d.b<0.004 d.b=0
- alpha = (isDark?0.18:0.28) + (0.14 - (isDark?0.18:0.28)) * d.b
- sz = 0.8 + d.b*0.6
- ctx.fillStyle = \`rgba(\${isDark?'255,255,255':'28,25,22'},\${alpha.toFixed(2)})\`
- ctx.fillRect(d.x-sz/2, d.y-sz/2, sz, sz)

For each pair [a,b]: if a.b<0.05||b.b<0.05 continue. lineAlpha = Math.min(a.b,b.b)*0.10. ctx.strokeStyle = rgba; ctx.lineWidth=0.5; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke().

## Theme detection
const check = () => { const card = el.closest('[data-card-theme]'); const dark = card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark'); setIsDark(dark); isDarkRef.current = dark; }
MutationObserver(check) observing documentElement attributeFilter ['class'], and card wrapper if present. Disconnect on unmount.

## JSX (exact)
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden"
     style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}
     onMouseMove={e => update(e.clientX,e.clientY)}
     onMouseLeave={() => { mouseRef.current = null }}
     onTouchMove={e => { const t = e.touches[0]; if (t) update(t.clientX,t.clientY) }}
     onTouchEnd={() => { mouseRef.current = null }}>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width:'100%', height:'100%' }} />
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span style={{ color: isDark?'rgba(255,255,255,0.45)':'rgba(28,25,22,0.45)', fontSize:22, fontWeight:700, letterSpacing:'-0.02em' }}>Noise</span>
    <span style={{ color: isDark?'rgba(255,255,255,0.18)':'rgba(28,25,22,0.22)', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.12em' }}>hover to illuminate</span>
  </div>
</div>
\`\`\`
update(): rect = canvas.getBoundingClientRect(); mouseRef.current = { x: cx-rect.left, y: cy-rect.top }.

## Cleanup
alive=false; cancelAnimationFrame; ResizeObserver.observe(canvas.parentElement) → disconnect; observer.disconnect.`,
}
