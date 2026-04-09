import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`ParticleConstellation\`.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A full-bleed canvas spider web: concentric ring nodes connected by radial and ring strands. Every strand is a bowed quadratic curve that always oscillates (never a straight line). Cursor repels nearby nodes via a spring and subtly bends nearby strand control points. No overlay text.

## Constants
- N_RADIALS = 24, N_RINGS = 14
- SWAY_AMP = 3.5 px, SWAY_SPD = 0.00045 per frame
- BOW_AMP = 6 px, BOW_SPD = 0.55
- NODE_PUSH_R = 90, NODE_PUSH_STR = 3.2
- SPRING_K = 0.07, SPRING_DAMP = 0.84
- PUSH_RADIUS = 280, PUSH_MAX = 18

## Types
interface WebNode { bx:number; by:number; phase:number; sx:number; sy:number; svx:number; svy:number }
interface Strand { a:number; b:number; kind:'radial'|'ring'; ring:number; bowPhase:number; bowPerpX:number; bowPerpY:number }

## buildWeb(W, H)
cx=W/2, cy=H/2, maxR = sqrt(W²+H²)*0.56.
Node 0 = center { bx:cx, by:cy, phase:0, zeroes }.
For r=1..N_RINGS: baseR = maxR*(r/N_RINGS); for s=0..N_RADIALS-1: angle = s*(2π/N_RADIALS) - π/2; jitter = 1 + (random-0.5)*0.18; push { bx: cx+cos*baseR*jitter, by: cy+sin*baseR*jitter, phase: random*2π, zeros }.

Strands via addStrand(a,b,kind,ring): compute dx=nb.bx-na.bx, dy=nb.by-na.by, len=sqrt(dx²+dy²)||1; store bowPhase=(na.phase+nb.phase)/2, bowPerpX=-dy/len, bowPerpY=dx/len.
- Radial: for each s, addStrand(0, 1+s, 'radial', 1); then for r=1..N_RINGS-1: ai = 1+(r-1)*N_RADIALS+s; bi = 1+r*N_RADIALS+s; addStrand(ai,bi,'radial',r+1).
- Ring: for r=1..N_RINGS, for s=0..N_RADIALS-1: ai = 1+(r-1)*N_RADIALS+s; bi = 1+(r-1)*N_RADIALS+(s+1)%N_RADIALS; addStrand(ai,bi,'ring',r).

## Per frame (time += SWAY_SPD)
For each node:
- swayX = bx + sin(time*1.1 + phase)*SWAY_AMP
- swayY = by + cos(time*0.9 + phase*1.4)*SWAY_AMP
- If mouse: liveX = swayX+sx; liveY = swayY+sy; dist = sqrt(dx²+dy²). If dist<NODE_PUSH_R && dist>0.1: force = (1 - dist/NODE_PUSH_R)*NODE_PUSH_STR; svx += (dx/dist)*force; svy += (dy/dist)*force.
- svx += -sx*SPRING_K; svy += -sy*SPRING_K; svx *= SPRING_DAMP; svy *= SPRING_DAMP; sx += svx; sy += svy.

Compute positions: pos[i] = { x: bx + sin(time*1.1+phase)*SWAY_AMP + sx, y: by + cos(time*0.9+phase*1.4)*SWAY_AMP + sy }.

clearRect; fill bg dark '#110F0C' / light '#F5F1EA'. lineCap/lineJoin round.

For each strand:
- pa=pos[a], pb=pos[b]; mx=(pa.x+pb.x)/2; my=(pa.y+pb.y)/2
- bow = BOW_AMP * sin(time*BOW_SPD*60 + bowPhase); cpx = mx + bowPerpX*bow; cpy = my + bowPerpY*bow
- If mouse: cdx=mouse.x-mx; cdy=mouse.y-my; cdist2=cdx²+cdy²; cdist=sqrt; falloff = exp(-cdist2/(PUSH_RADIUS²)); bend = PUSH_MAX*falloff; if cdist>0.1: cpx -= (cdx/cdist)*bend; cpy -= (cdy/cdist)*bend.
- depthFade = 1 - (ring-1)/(N_RINGS+2); alpha = kind==='radial' ? 0.42*depthFade : 0.20*depthFade
- If mouse: proximity = exp(-(cdx²+cdy²)/(PUSH_RADIUS²*0.35)); alpha *= (1 - proximity*0.82)
- strokeStyle rgba(fg,alpha); lineWidth = radial?0.75:0.5; beginPath; moveTo(pa.x,pa.y); quadraticCurveTo(cpx,cpy,pb.x,pb.y); stroke.

For each node i: alpha = i===0 ? 0.45 : 0.16. If mouse: prox = exp(-(dx²+dy²)/(160*160)); alpha *= (1 - prox*0.82). arc radius i===0 ? 1.8 : 1.1; fill.

fg = dark ? '255,255,255' : '28,25,22'.

## Canvas DPR
dpr=devicePixelRatio||1; w=container.clientWidth; h=container.clientHeight; canvas.width=w*dpr; canvas.height=h*dpr; canvas.style.width=\`\${w}px\`; style.height=\`\${h}px\`; ctx.setTransform(dpr,0,0,dpr,0,0); rebuild web.

## Theme detection
detectDark helper inline. useState isDark + isDarkRef. Observer on documentElement + card wrapper.

## JSX
div ref containerRef relative h-full w-full overflow-hidden, bg per theme. canvas absolute inset-0 h-full w-full. Mouse listeners on container: mousemove → mouseRef {x:e.clientX-rect.left, y:e.clientY-rect.top}; mouseleave → null.

Cleanup: alive=false; cancelAnimationFrame; ro.disconnect; mo.disconnect; remove listeners.`,

  GPT: `Build a React client component named \`ParticleConstellation\`. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

Canvas spider web of concentric rings connected by radial and ring strands. Strands are quadratic curves with a persistent sine-bow (never straight). Cursor repels nodes via spring and bends strand control points nearby. No overlay text.

## Constants
N_RADIALS=24; N_RINGS=14
SWAY_AMP=3.5; SWAY_SPD=0.00045
BOW_AMP=6; BOW_SPD=0.55
NODE_PUSH_R=90; NODE_PUSH_STR=3.2
SPRING_K=0.07; SPRING_DAMP=0.84
PUSH_RADIUS=280; PUSH_MAX=18

## Types
WebNode { bx,by,phase,sx,sy,svx,svy }
Strand { a,b, kind:'radial'|'ring', ring, bowPhase, bowPerpX, bowPerpY }

## buildWeb(W,H)
cx=W/2; cy=H/2; maxR = sqrt(W²+H²) * 0.56
nodes[0] = center (phase 0, offsets 0)
for r=1..14: baseR = maxR*(r/14); for s=0..23: angle = s*(2π/24) - π/2; jitter = 1+(random-0.5)*0.18; push { bx: cx+cos(angle)*baseR*jitter, by: cy+sin(angle)*baseR*jitter, phase: random*2π, sx:0,sy:0,svx:0,svy:0 }

Strands:
radial: for s=0..23: addStrand(0, 1+s, 'radial', 1); for r=1..13: addStrand(1+(r-1)*24+s, 1+r*24+s, 'radial', r+1)
ring:   for r=1..14: for s=0..23: addStrand(1+(r-1)*24+s, 1+(r-1)*24+((s+1)%24), 'ring', r)

addStrand computes dx,dy,len, stores bowPhase=(na.phase+nb.phase)/2, bowPerpX=-dy/len, bowPerpY=dx/len.

## Canvas setup
dpr=devicePixelRatio||1; w=container.clientWidth; h=container.clientHeight; canvas.width=w*dpr; canvas.height=h*dpr; canvas.style.width=\`\${w}px\`; canvas.style.height=\`\${h}px\`; ctx.setTransform(dpr,0,0,dpr,0,0). Call buildWeb on resize.

## Per-frame loop (time += SWAY_SPD per frame)
# node spring update
for each node n:
  swayX = n.bx + sin(time*1.1 + n.phase)*3.5
  swayY = n.by + cos(time*0.9 + n.phase*1.4)*3.5
  if mouse:
    liveX = swayX + n.sx; liveY = swayY + n.sy
    dx = liveX - mouse.x; dy = liveY - mouse.y; dist = sqrt(dx²+dy²)
    if dist < 90 and dist > 0.1:
      force = (1 - dist/90) * 3.2
      n.svx += (dx/dist) * force; n.svy += (dy/dist) * force
  n.svx += -n.sx * 0.07; n.svy += -n.sy * 0.07
  n.svx *= 0.84; n.svy *= 0.84
  n.sx += n.svx; n.sy += n.svy

# positions
pos[i] = { x: n.bx + sin(time*1.1+n.phase)*3.5 + n.sx, y: n.by + cos(time*0.9+n.phase*1.4)*3.5 + n.sy }

# draw
fill bg dark '#110F0C' / light '#F5F1EA'. fg = dark ? '255,255,255' : '28,25,22'. lineCap/lineJoin round.

for each strand s:
  pa = pos[s.a]; pb = pos[s.b]
  mx = (pa.x+pb.x)/2; my = (pa.y+pb.y)/2
  bow = 6 * sin(time*0.55*60 + s.bowPhase)
  cpx = mx + s.bowPerpX*bow; cpy = my + s.bowPerpY*bow
  if mouse:
    cdx = mouse.x - mx; cdy = mouse.y - my; cdist2 = cdx²+cdy²; cdist = sqrt(cdist2)
    falloff = exp(-cdist2/(280²))
    bend = 18*falloff
    if cdist > 0.1: cpx -= (cdx/cdist)*bend; cpy -= (cdy/cdist)*bend
  depthFade = 1 - (s.ring-1)/(14+2)
  alpha = s.kind==='radial' ? 0.42*depthFade : 0.20*depthFade
  if mouse:
    proximity = exp(-(cdx²+cdy²)/(280²*0.35))
    alpha *= (1 - proximity*0.82)
  strokeStyle = \`rgba(\${fg},\${alpha.toFixed(3)})\`
  lineWidth = s.kind==='radial' ? 0.75 : 0.5
  beginPath; moveTo(pa.x,pa.y); quadraticCurveTo(cpx,cpy,pb.x,pb.y); stroke

for each i in pos:
  alpha = i===0 ? 0.45 : 0.16
  if mouse:
    dx = mouse.x - p.x; dy = mouse.y - p.y
    prox = exp(-(dx²+dy²)/(160²))
    alpha *= (1 - prox*0.82)
  arc(p.x, p.y, i===0?1.8:1.1, 0, 2π); fillStyle rgba(fg,alpha); fill

## Theme detection
detectDark helper. useState isDark + isDarkRef. Observer on documentElement + card wrapper, attributeFilter ['class'].

## JSX structure
div ref containerRef relative h-full w-full overflow-hidden, inline bg per theme. canvas ref absolute inset-0 h-full w-full. Listeners attach on container: mousemove sets mouseRef = { x: e.clientX-rect.left, y: e.clientY-rect.top }; mouseleave sets null. No overlay text.

## Cleanup
alive=false; cancelAnimationFrame(rafRef.current); ro.disconnect(); mo.disconnect(); remove mousemove/mouseleave.`,

  Gemini: `Implement a React client component named \`ParticleConstellation\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

A canvas spider-web: concentric ring nodes connected by radial and ring strands. Every strand is a bowed quadratic curve that always oscillates (never a straight line). Cursor applies a spring-repulsion on nearby nodes and bends strand control points. No overlay text.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useEffect, useRef, useState } from 'react'
\`\`\`
USE these hooks and no others. DO NOT invent useSpringValue, useAnimatedValue, or helpers not shown above. No framer-motion.

## Constants (exact)
N_RADIALS=24, N_RINGS=14
SWAY_AMP=3.5, SWAY_SPD=0.00045
BOW_AMP=6, BOW_SPD=0.55
NODE_PUSH_R=90, NODE_PUSH_STR=3.2
SPRING_K=0.07, SPRING_DAMP=0.84
PUSH_RADIUS=280, PUSH_MAX=18

## Types
\`\`\`
interface WebNode { bx:number; by:number; phase:number; sx:number; sy:number; svx:number; svy:number }
interface Strand { a:number; b:number; kind:'radial'|'ring'; ring:number; bowPhase:number; bowPerpX:number; bowPerpY:number }
\`\`\`

## buildWeb(W,H) — inline function
cx=W/2; cy=H/2; maxR = Math.sqrt(W*W+H*H)*0.56.
nodes[0] = { bx:cx, by:cy, phase:0, sx:0,sy:0,svx:0,svy:0 }.
for (r=1;r<=14;r++): baseR = maxR*(r/14); for (s=0;s<24;s++): angle = s*(2*PI/24) - PI/2; jitter = 1 + (Math.random()-0.5)*0.18; push { bx:cx+cos(angle)*baseR*jitter, by:cy+sin(angle)*baseR*jitter, phase:Math.random()*2*PI, sx:0,sy:0,svx:0,svy:0 }.
addStrand(a,b,kind,ring): dx=nb.bx-na.bx; dy=nb.by-na.by; len=sqrt(dx²+dy²)||1; push { a,b,kind,ring, bowPhase:(na.phase+nb.phase)/2, bowPerpX:-dy/len, bowPerpY:dx/len }.
Radials: for s=0..23: addStrand(0,1+s,'radial',1); for r=1..13: addStrand(1+(r-1)*24+s, 1+r*24+s,'radial',r+1).
Rings: for r=1..14: for s=0..23: addStrand(1+(r-1)*24+s, 1+(r-1)*24+((s+1)%24),'ring',r).

## Canvas DPR scaffolding (inline exactly)
\`\`\`
const dpr = window.devicePixelRatio || 1
const w = container.clientWidth
const h = container.clientHeight
canvas.width = w * dpr
canvas.height = h * dpr
canvas.style.width = \`\${w}px\`
canvas.style.height = \`\${h}px\`
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
\`\`\`
Then buildWeb(w,h). ResizeObserver(container) re-runs resize.

## Animation loop
time += 0.00045 per frame.
For each node (spring update):
- swayX = bx + Math.sin(time*1.1 + phase)*3.5
- swayY = by + Math.cos(time*0.9 + phase*1.4)*3.5
- if mouse: liveX=swayX+sx; liveY=swayY+sy; dx=liveX-mouse.x; dy=liveY-mouse.y; dist=sqrt(dx²+dy²). If dist<90 && dist>0.1: force=(1-dist/90)*3.2; svx += (dx/dist)*force; svy += (dy/dist)*force.
- svx += -sx*0.07; svy += -sy*0.07; svx *= 0.84; svy *= 0.84; sx += svx; sy += svy.

Compute pos[i] = { x: bx + sin(time*1.1+phase)*3.5 + sx, y: by + cos(time*0.9+phase*1.4)*3.5 + sy }.

ctx.clearRect(0,0,W,H). ctx.fillStyle = dark ? '#110F0C' : '#F5F1EA'; ctx.fillRect(0,0,W,H). ctx.lineCap='round'; ctx.lineJoin='round'. fg = dark ? '255,255,255' : '28,25,22'.

For each strand s:
- pa = pos[s.a]; pb = pos[s.b]; mx=(pa.x+pb.x)/2; my=(pa.y+pb.y)/2
- bow = 6*Math.sin(time*0.55*60 + s.bowPhase)
- cpx = mx + s.bowPerpX*bow; cpy = my + s.bowPerpY*bow
- if mouse: cdx=mouse.x-mx; cdy=mouse.y-my; cdist2=cdx²+cdy²; cdist=sqrt(cdist2); falloff = Math.exp(-cdist2/(280*280)); bend = 18*falloff; if cdist>0.1: cpx -= (cdx/cdist)*bend; cpy -= (cdy/cdist)*bend.
- depthFade = 1 - (s.ring-1)/(14+2)
- alpha = s.kind==='radial' ? 0.42*depthFade : 0.20*depthFade
- if mouse: proximity = Math.exp(-(cdx²+cdy²)/(280*280*0.35)); alpha *= (1 - proximity*0.82)
- strokeStyle = \`rgba(\${fg},\${alpha.toFixed(3)})\`; lineWidth = s.kind==='radial' ? 0.75 : 0.5
- beginPath; moveTo(pa.x,pa.y); quadraticCurveTo(cpx,cpy,pb.x,pb.y); stroke

For each node i: alpha = i===0 ? 0.45 : 0.16. If mouse: prox = Math.exp(-(dx²+dy²)/(160*160)); alpha *= (1 - prox*0.82). arc(p.x,p.y, i===0?1.8:1.1, 0, 2π); fillStyle rgba(fg,alpha); fill.

## Theme detection
Helper detectDark(el): const w = el.closest('[data-card-theme]'); if w return w.classList.contains('dark'); return document.documentElement.classList.contains('dark'). useState isDark + isDarkRef. MutationObserver on documentElement + card wrapper (if present), attributeFilter ['class']. Disconnect on unmount.

## JSX
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden"
     style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}>
  <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
</div>
\`\`\`
Mouse events attach on container: mousemove → mouseRef = { x: e.clientX-rect.left, y: e.clientY-rect.top }; mouseleave → null.

## Cleanup
alive=false; cancelAnimationFrame; ro.disconnect; mo.disconnect; remove listeners.`,
}
