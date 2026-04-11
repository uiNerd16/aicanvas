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

  V0: `Create a React client component named \`NoiseBg\`. Single file, TypeScript, \`'use client'\` at the top. Use \`useEffect\`, \`useRef\`, and \`useState\` from React — no other libraries, no framer-motion. The component fills its parent (\`h-full w-full\`) and supports both light and dark themes.

## The visual
A full-bleed canvas dusted with tiny square pixels scattered at random — think "starfield" but quieter and more uniform, like film grain frozen in place. At rest the grain is nearly invisible: a faint static hum across the whole frame, just enough that you can tell something is there. When the cursor enters, a soft circular pool of light follows it — pixels inside the pool brighten and swell very slightly, and any two lit pixels that happen to sit close to each other get connected by a thin hair-line. The effect is a travelling constellation of tiny links that forms under the cursor and fades out in about a second after you leave.

Centered in the frame are two overlay labels:
- A title reading exactly \`Noise\` — 22px, font-weight 700, letter-spacing -0.02em.
- Below it, a hint reading exactly \`hover to illuminate\` — 11px, font-weight 600, uppercase, letter-spacing 0.12em.

Both labels sit above the canvas with \`pointer-events-none\` so they never block the hover. On dark, the labels use \`rgba(255,255,255,0.45)\` and \`rgba(255,255,255,0.18)\`. On light, use \`rgba(28,25,22,0.45)\` and \`rgba(28,25,22,0.22)\`.

## Theme
Detect theme by checking \`.closest('[data-card-theme]')\` for a \`.dark\` class, falling back to \`document.documentElement.classList.contains('dark')\`. Track it with \`useState isDark\` (drives background + label colours) plus an \`isDarkRef\` read inside the render loop (so the RAF closure stays current without re-creating the effect). Watch for theme changes with a \`MutationObserver\` on \`documentElement\` (and the card wrapper if present) listening for class attribute changes.

Background: \`#110F0C\` on dark, \`#F5F1EA\` on light — set as an inline style on the outer container. The grain itself is drawn white (\`255,255,255\`) on dark and near-black (\`28,25,22\`) on light.

## Key constants
- \`DENSITY = 1 / 120\` — roughly one dot per 120 square pixels of canvas area
- \`MAX_DOTS = 3000\` — hard cap so very large previews don't tank performance
- \`RADIUS = 200\` — hover influence radius in pixels
- \`NEIGHBOUR_D = 35\` — maximum distance between two dots that may ever share a connection line
- resting alpha: \`0.18\` on dark, \`0.28\` on light (the light theme needs a touch more weight to be visible on the cream background)
- peak alpha under the cursor: \`0.14\`

Note that peak alpha is actually *lower* than the resting alpha — this is intentional. The lit dots grow in size from 0.8px to 1.4px, so they read as brighter even at slightly lower opacity, and the reduced alpha keeps them from feeling harsh. Don't "fix" this.

## Canvas setup
Standard DPR scaffolding: read \`devicePixelRatio\`, measure the canvas with \`getBoundingClientRect\`, set \`canvas.width/height\` to the rounded scaled pixels, and \`ctx.setTransform(dpr,0,0,dpr,0,0)\`. Rebuild on resize via a \`ResizeObserver\` on \`canvas.parentElement\`.

## Building the dot field
On mount (and whenever the canvas resizes), generate a fresh random dot field:

1. Compute \`count = Math.min(Math.round(cw * ch * DENSITY), MAX_DOTS)\`.
2. Create an array of that many dots, each with a random \`x\` in \`[0, cw]\`, random \`y\` in \`[0, ch]\`, and \`b = 0\` (its 0→1 brightness).
3. Pre-compute and cache neighbour pairs *once* here, not every frame. Walk every \`(i, j)\` with \`i < j\`, compute squared distance, and if it's less than \`NEIGHBOUR_D * NEIGHBOUR_D\` (1225) push \`[dots[i], dots[j]]\` into a \`pairs\` array. This is the most important optimisation in the whole component — the inner loop is O(n²) and would be unusable every frame, but because the dots never move it only needs to run on build. Each frame then just iterates the cached pair list.

Types: \`type Dot = { x: number; y: number; b: number }\` and \`type Pair = [Dot, Dot]\`.

## The frame loop
On every animation frame:

1. Clear the canvas.
2. Read the mouse position from a ref, falling back to an off-screen coordinate like \`-99999\` when there's no hover so the distance math naturally excludes everything.
3. Pick \`dotRGB\` (\`'255,255,255'\` or \`'28,25,22'\`) and \`baseA\` (\`0.18\` or \`0.28\`) from the current dark/light ref.
4. For each dot, compute squared distance to the cursor. If it's within \`RADIUS\`, the target brightness is \`Math.exp(-dist2 / (RADIUS * RADIUS * 0.25))\` — a gaussian-style falloff that gives a soft fuzzy pool rather than a hard circle. Outside the radius, target is 0.
5. Ease \`b\` toward its target asymmetrically: fast on the way up (\`0.16\`), slower on the way down (\`0.07\`). This gives the soft ~1 second fade-out after the cursor leaves. Snap \`b\` to 0 once it drops below \`0.004\`.
6. Alpha blends resting toward peak by brightness: \`alpha = baseA + (0.14 - baseA) * b\`.
7. Size grows from \`0.8\` to \`1.4\` pixels: \`sz = 0.8 + b * 0.6\`.
8. Draw each dot as a tiny filled square, *not* a circle: \`ctx.fillRect(x - sz/2, y - sz/2, sz, sz)\`. Rectangles are dramatically cheaper than arc/fill and at sub-2px sizes they read identically. Set \`fillStyle = \`rgba(\${dotRGB},\${alpha.toFixed(2)})\`\` for each dot.

## Connection lines
After the dot loop, walk the cached \`pairs\` array. For each \`[a, b]\`:
- Skip the pair entirely if either dot's brightness is below \`0.05\` — this is what confines the mesh to the hover halo.
- Compute \`lineAlpha = Math.min(a.b, b.b) * 0.10\` — lines are much fainter than the dots themselves, and they fade in and out with the weaker of the two endpoints.
- Set \`strokeStyle\` to the same colour as the dots at that alpha, \`lineWidth = 0.5\`, and draw a single line segment from \`a\` to \`b\`.

Because the pair list was filtered by distance once at build time, you never need to re-check distances in the loop — just brightness. Only dots near each other could possibly be paired, so every surviving line is guaranteed short.

## Interaction
Attach \`onMouseMove\`, \`onMouseLeave\`, \`onTouchMove\`, \`onTouchEnd\` to the outer container. On move, read the canvas's \`getBoundingClientRect\` and store \`{ x: clientX - rect.left, y: clientY - rect.top }\` in \`mouseRef.current\`. On leave/end, set it to \`null\`. Touch follows the same pattern using \`e.touches[0]\`.

## Structure
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: ... }} ...handlers>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span>Noise</span>
    <span>hover to illuminate</span>
  </div>
</div>
\`\`\`

## Cleanup
Use an \`alive\` flag inside the effect and guard the frame loop with it. On unmount: set \`alive = false\`, \`cancelAnimationFrame\`, disconnect the \`ResizeObserver\`, and disconnect the theme \`MutationObserver\`. No leaks.

The finished piece should feel like looking at a dim field of static that wakes up only where you touch it — quiet at rest, responsive but never flashy, the connection lines appearing like a whispered web under the cursor.`,
}
