import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': `Before building, verify your project has the following setup:
- React / Next.js
- TypeScript
- Tailwind CSS v4

If any are missing, set up via the shadcn CLI:
  npx shadcn@latest init

---

Create a React client component named \`ParticleConstellation\`.

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

Cleanup: alive=false; cancelAnimationFrame; ro.disconnect; mo.disconnect; remove listeners.

## Typography
- Font: project default sans-serif`,

  'Lovable': `Create a React client component named \`ParticleConstellation\`.

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

Cleanup: alive=false; cancelAnimationFrame; ro.disconnect; mo.disconnect; remove listeners.

## Typography
- Font: project default sans-serif`,

  'V0': `Create a React client component named \`ParticleConstellation\`.

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

Cleanup: alive=false; cancelAnimationFrame; ro.disconnect; mo.disconnect; remove listeners.

## Typography
- Font: project default sans-serif`,
}
