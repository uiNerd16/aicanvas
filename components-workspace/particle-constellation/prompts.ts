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

  V0: `Create a React client component named \`ParticleConstellation\`. Single file, TypeScript, \`'use client'\` at the top. Use \`useEffect\`, \`useRef\`, and \`useState\` from React — no other libraries, no framer-motion. The component fills its parent (\`h-full w-full\`) and supports both light and dark themes.

## The visual
A full-bleed canvas spider web. Picture a dense mandala: one node at the dead centre, then fourteen concentric rings fanning outward, each ring carrying twenty-four nodes spaced evenly around it. The nodes are connected two ways — radial threads running from the centre outward like spokes, and ring threads running around each circle linking neighbours. The outermost ring extends past the edges of the frame so you never see a hard circular boundary; the web just bleeds off into the background.

Nothing is ever a straight line. Every single strand is a slightly bowed quadratic curve, and the bow gently oscillates on its own small sine clock — so at rest the whole web looks like it's breathing underwater, all the threads flexing in and out of curvature independently. On top of that, every node has its own slow idle sway (a few pixels of drift) driven by its own phase, so the intersections of the web shift constantly without any single dominant motion.

When the cursor enters the frame, two things happen together:
1. Nearby nodes get shoved away from the pointer with a real spring — they overshoot, wobble, and spring back. It's not a smoothed follow, it's a physical repulsion with bounce.
2. Strands near the cursor bend their control points further away from the pointer (a small additive push on top of the resting bow), and their opacity fades out inside the halo — so the web appears to "part" around the cursor, revealing the darker background underneath.

There is no overlay text. No labels, no title, no hint. The web is the whole thing.

## Theme
Detect theme by checking \`.closest('[data-card-theme]')\` for a \`.dark\` class, falling back to \`document.documentElement.classList.contains('dark')\`. Track it with \`useState isDark\` plus an \`isDarkRef\` for the render loop. Watch for theme changes with a \`MutationObserver\` on \`documentElement\` (and the card wrapper if present) listening for class attribute changes.

Background: \`#110F0C\` on dark, \`#F5F1EA\` on light — set as an inline style on the outer container and also filled on the canvas every frame. Strand and node colour: \`255,255,255\` on dark, \`28,25,22\` on light.

## Key constants
- 24 radials and 14 rings. The max radius is \`Math.sqrt(W*W + H*H) * 0.56\` so the outermost ring comfortably extends past the corners of the frame.
- Node idle sway: about 3.5 pixels of drift, driven by a slow time clock that advances at \`0.00045\` per frame.
- Strand idle bow: about 6 pixels of perpendicular bow amplitude, oscillating at a noticeably faster rate than the node sway — multiply time by roughly \`0.55 * 60\` inside the sine so the bow feels alive while the nodes drift gently.
- Cursor node-repulsion radius: 90 pixels. Push strength: 3.2. Only nodes inside this radius get an impulse added to their spring velocity.
- Spring return stiffness: 0.07. Damping (velocity retention per frame): 0.84. This combination gives a bouncy, slightly under-damped return — nodes should visibly wobble before settling.
- Strand hover push radius: 280 pixels, max bend 18 pixels. Gaussian falloff (\`exp(-dist²/radius²)\`) so it's very wide and smooth — the node springs do the heavy lifting, this is just an extra nudge to make the strands visibly follow.

## Geometry build
Build the web once per resize. Place node zero at the centre \`(W/2, H/2)\`. Then for each ring \`r\` from 1 to 14, compute \`baseR = maxR * (r / 14)\`, and for each radial slot \`s\` from 0 to 23, place a node at angle \`s * (2π/24) - π/2\` (so slot zero points straight up), radius \`baseR\` multiplied by a small random jitter in the range \`1 ± 0.09\`. Give each node a random \`phase\` in \`[0, 2π)\` and zero out its spring offsets and velocities.

Strands come in two flavours. For each radial slot, connect the centre node to the innermost ring node, then chain outward ring to ring along the same slot — that's 24 chains of 14 strands each. For the ring strands, connect each node on ring \`r\` to its right-hand neighbour on the same ring (wrapping \`(s+1) % 24\`). When you add a strand, precompute and store its bow phase (the average of the two endpoint phases) and its unit perpendicular vector — that's the strand direction rotated 90 degrees, so \`{-dy/len, dx/len}\`. You'll use this every frame to push the control point sideways by the bow amount.

## Canvas setup
Standard DPR scaffolding: read \`devicePixelRatio\`, set \`canvas.width = w*dpr\` and \`canvas.height = h*dpr\`, set the CSS size to the container's client size, then \`ctx.setTransform(dpr,0,0,dpr,0,0)\`. Rebuild the web whenever a \`ResizeObserver\` on the container fires.

## The frame loop
On every animation frame, advance \`time += 0.00045\`.

Node spring step: for each node, first compute its current sway position: \`swayX = bx + sin(time*1.1 + phase) * 3.5\` and \`swayY = by + cos(time*0.9 + phase*1.4) * 3.5\`. Note the different multipliers on the two axes and the \`phase*1.4\` on the y-axis — the asymmetry is what makes the drift feel organic rather than circular. If there's a mouse position, compute the node's live position (\`swayX + sx\`, \`swayY + sy\`), measure its distance to the cursor, and if that distance is under 90 pixels add a radial impulse \`(1 - dist/90) * 3.2\` pointing away from the cursor into the node's velocity. Then always apply the spring return (\`svx += -sx * 0.07\`, same for y), apply damping (\`svx *= 0.84\`), and integrate position (\`sx += svx\`).

Then compute every node's final draw position for this frame: \`pos[i] = { x: bx + sin(...)*3.5 + sx, y: by + cos(...)*3.5 + sy }\`. Cache it as an array; you'll read it twice.

Draw: clear the canvas, fill the background colour, set \`lineCap\` and \`lineJoin\` to \`'round'\`.

For each strand:
1. Read \`pa\` and \`pb\` from the position cache. Compute midpoint \`(mx, my)\`.
2. The resting bow: \`bow = 6 * Math.sin(time * 0.55 * 60 + bowPhase)\`. Offset the control point from the midpoint along the strand's stored perpendicular by that amount: \`cpx = mx + bowPerpX*bow\`, \`cpy = my + bowPerpY*bow\`. This alone guarantees no strand is ever a straight line.
3. If there's a mouse, compute vector from cursor to midpoint, falloff \`exp(-dist²/(280*280))\`, and subtract \`18 * falloff\` worth of that direction from the control point — pushing the curve away from the pointer.
4. Depth fade: \`depthFade = 1 - (ring - 1) / 16\` — outer rings fade slightly compared to inner ones. Base alpha is \`0.42 * depthFade\` for radials and \`0.20 * depthFade\` for rings (ring threads are quieter). If there's a mouse, multiply alpha by \`(1 - proximity * 0.82)\` where \`proximity = exp(-dist²/(280² * 0.35))\` — so strands fade out strongly inside the hover halo.
5. Line width: 0.75 for radials, 0.5 for rings. Draw with \`beginPath\`, \`moveTo(pa)\`, \`quadraticCurveTo(cpx, cpy, pb.x, pb.y)\`, \`stroke\`.

For each node: draw a tiny filled circle. The centre node (index 0) is 1.8px radius with 0.45 base alpha; every other node is 1.1px with 0.16 base alpha. Fade them out near the cursor too — proximity \`exp(-dist²/(160*160))\`, multiply alpha by \`(1 - prox*0.82)\`.

## Interaction
Attach \`mousemove\` and \`mouseleave\` listeners to the outer container. On move, read the canvas's \`getBoundingClientRect\` and store \`{ x: clientX - rect.left, y: clientY - rect.top }\` in \`mouseRef.current\`. On leave, set it to \`null\`. Don't use React state for the cursor — the 60fps loop reads it directly from the ref.

## Structure
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}>
  <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
</div>
\`\`\`

## Cleanup
Use an \`alive\` flag inside the effect and guard the frame loop with it. On unmount: set \`alive = false\`, \`cancelAnimationFrame\`, disconnect the \`ResizeObserver\`, disconnect the theme \`MutationObserver\`, and remove the mousemove/mouseleave listeners. No leaks.

The finished piece should feel like a living, breathing web of silk — always in motion even untouched, parting visibly around your cursor with a soft spring bounce, and quietly returning to its resting sway the moment you leave.`,
}
