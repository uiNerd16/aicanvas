import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`XGrid\`.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A canvas grid of axis-aligned × marks. Marks have a subtle resting wave in opacity and brighten/grow around the cursor with a wide falloff. Lit neighbours (right, below, diag down-right, diag down-left) are connected by thin lines. Centred label "X Grid" with hint "hover to illuminate".

## Constants
- SPACING = 20 (px between × centres)
- RADIUS = 340 (hover influence radius)
- BASE_A = 0.13 (dark resting alpha)
- PEAK_A = 0.92 (fully-lit alpha)
Light-mode base alpha override: 0.25 (branch on isDarkRef inside frame).

## Mark
type Mark = { x: number; y: number; b: number; col: number; row: number }

## Build
DPR scaffolding. cols = floor(cw/SPACING)+2; rows = floor(ch/SPACING)+2; ox = (cw%SPACING)/2; oy = (ch%SPACING)/2. marks array + grid[r][c] map. t0 = performance.now().

## Per frame
clearRect. lineWidth = 0.5 (reset so it doesn't bleed from connection pass).
mx,my from mouseRef ?? -99999; r2 = RADIUS²; dotRGB = dark?'255,255,255':'28,25,22'; t = (performance.now()-t0)/1000.

For each mark d:
- dist2 = (d.x-mx)² + (d.y-my)²
- tgt = dist2 < r2 ? Math.pow(1 - sqrt(dist2)/RADIUS, 1.5) : 0
- d.b += (tgt > d.b ? 0.16 : 0.05) * (tgt - d.b); if d.b < 0.004 set 0
- arm = 2 + d.b * 1.0
- sw  = 0.5 + d.b * 0.3
- baseA = dark ? 0.13 : 0.25
- wave = sin(d.col*0.3 + d.row*0.3 - t*0.5)
- restingAlpha = baseA*(1 + wave*0.3)
- alpha = restingAlpha + (0.92 - restingAlpha)*d.b
- strokeStyle rgba(dotRGB,alpha); lineWidth = sw
- beginPath; moveTo(x-arm,y-arm); lineTo(x+arm,y+arm); moveTo(x+arm,y-arm); lineTo(x-arm,y+arm); stroke

Connection pass (lineWidth=0.5):
For each mark d with b>=0.05, look up 4 neighbours [row][col+1], [row+1][col], [row+1][col+1], [row+1][col-1]. For each defined neighbour n with n.b>=0.05:
- lineAlpha = min(d.b,n.b) * 0.4
- strokeStyle rgba(dotRGB,lineAlpha); beginPath; moveTo(d.x,d.y); lineTo(n.x,n.y); stroke

## Theme
useState isDark + isDarkRef + MutationObserver.

## Mouse / touch
updateMouse reads canvas.getBoundingClientRect, sets mouseRef = { x:cx-rect.left, y:cy-rect.top }. Handlers on outer div: onMouseMove/onMouseLeave/onTouchMove/onTouchEnd.

## JSX
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }} ...handlers>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width:'100%', height:'100%' }} />
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span style={{ color: isDark?'rgba(255,255,255,0.45)':'rgba(28,25,22,0.45)', fontSize:22, fontWeight:700, letterSpacing:'-0.02em' }}>X Grid</span>
    <span style={{ color: isDark?'rgba(255,255,255,0.18)':'rgba(28,25,22,0.22)', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.12em' }}>hover to illuminate</span>
  </div>
</div>
\`\`\`

Cleanup: alive=false; cancelAnimationFrame; ResizeObserver on canvas.parentElement → disconnect; observer.disconnect.`,

  GPT: `Build a React client component named \`XGrid\`. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

Canvas grid of axis-aligned × marks. Resting opacity wave, cursor-driven brighten/grow with wide falloff, thin connection lines between lit neighbours. Overlay "X Grid" + "hover to illuminate".

## Constants
SPACING=20; RADIUS=340; BASE_A=0.13 (dark); LIGHT_BASE_A=0.25; PEAK_A=0.92.

## Types
type Mark = { x:number; y:number; b:number; col:number; row:number }

## Canvas setup
dpr=devicePixelRatio||1; rect=canvas.getBoundingClientRect(); cw=rect.width; ch=rect.height; canvas.width=round(cw*dpr); canvas.height=round(ch*dpr); ctx.setTransform(dpr,0,0,dpr,0,0).
cols = floor(cw/20)+2; rows = floor(ch/20)+2; ox = (cw%20)/2; oy = (ch%20)/2.
Build marks[] + grid[r][c] = { x: ox+c*20, y: oy+r*20, b:0, col:c, row:r }.
t0 = performance.now().

## Per-frame loop
clearRect(0,0,cw,ch)
lineWidth = 0.5  // reset to prevent bleed from last frame's connection pass
mx = mouseRef?.x ?? -99999; my = mouseRef?.y ?? -99999
r2 = 340*340
dotRGB = dark ? '255,255,255' : '28,25,22'
t = (performance.now() - t0) / 1000

for each d in marks:
  dx = d.x - mx; dy = d.y - my; dist2 = dx*dx + dy*dy
  tgt = dist2 < r2 ? Math.pow(1 - sqrt(dist2)/340, 1.5) : 0
  d.b += (tgt > d.b ? 0.16 : 0.05) * (tgt - d.b)
  if d.b < 0.004: d.b = 0
  arm = 2 + d.b*1.0
  sw  = 0.5 + d.b*0.3
  baseA = dark ? 0.13 : 0.25
  wave = sin(d.col*0.3 + d.row*0.3 - t*0.5)
  restingAlpha = baseA * (1 + wave*0.3)
  alpha = restingAlpha + (0.92 - restingAlpha) * d.b
  strokeStyle = \`rgba(\${dotRGB},\${alpha.toFixed(2)})\`
  lineWidth = sw
  beginPath
  moveTo(d.x-arm, d.y-arm); lineTo(d.x+arm, d.y+arm)
  moveTo(d.x+arm, d.y-arm); lineTo(d.x-arm, d.y+arm)
  stroke

# connection pass
lineWidth = 0.5
for each d in marks:
  if d.b < 0.05: continue
  neighbours = [grid[d.row][d.col+1], grid[d.row+1]?.[d.col], grid[d.row+1]?.[d.col+1], grid[d.row+1]?.[d.col-1]]
  for each n in neighbours:
    if !n or n.b < 0.05: continue
    lineAlpha = min(d.b,n.b) * 0.4
    strokeStyle = \`rgba(\${dotRGB},\${lineAlpha.toFixed(2)})\`
    beginPath; moveTo(d.x,d.y); lineTo(n.x,n.y); stroke

## Theme detection
useState isDark + isDarkRef. closest('[data-card-theme]').classList.contains('dark') or documentElement fallback. MutationObserver attributeFilter ['class'] on both.

## JSX structure
- div ref containerRef relative h-full w-full overflow-hidden, inline bg = isDark ? '#110F0C' : '#F5F1EA'. Handlers onMouseMove/onMouseLeave/onTouchMove/onTouchEnd updating mouseRef.
- canvas absolute inset-0 style width 100% height 100%.
- overlay pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 with:
  * span "X Grid" — color dark rgba(255,255,255,0.45) / light rgba(28,25,22,0.45), fontSize 22, fontWeight 700, letterSpacing -0.02em.
  * span "hover to illuminate" — color dark rgba(255,255,255,0.18) / light rgba(28,25,22,0.22), fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em.

## Cleanup
alive=false; cancelAnimationFrame; ResizeObserver on canvas.parentElement → disconnect; observer.disconnect.`,

  Gemini: `Implement a React client component named \`XGrid\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

Canvas grid of axis-aligned × marks. Resting opacity wave, cursor-driven brighten/grow via a wide power-falloff, plus thin connection lines between lit neighbours (right/below/diag down-right/diag down-left). Centred overlay "X Grid" + "hover to illuminate".

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useEffect, useRef, useState } from 'react'
\`\`\`
USE these hooks and no others. DO NOT invent useSpringValue, useAnimatedValue, or helpers not shown above. No framer-motion.

## Constants (exact)
SPACING=20, RADIUS=340, BASE_A=0.13 (dark), LIGHT_BASE_A=0.25, PEAK_A=0.92.

## Types
type Mark = { x:number; y:number; b:number; col:number; row:number }

## Refs / state
containerRef, canvasRef, mouseRef<{x,y}|null>, isDarkRef, useState isDark.

## Canvas DPR scaffolding (inline exactly)
\`\`\`
const dpr = window.devicePixelRatio || 1
const rect = canvas.getBoundingClientRect()
const cw = rect.width, ch = rect.height
canvas.width = Math.round(cw * dpr)
canvas.height = Math.round(ch * dpr)
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
\`\`\`

## Build
cols = Math.floor(cw/20)+2; rows = Math.floor(ch/20)+2; ox = (cw%20)/2; oy = (ch%20)/2.
Create \`marks: Mark[] = []\` and \`grid: Mark[][] = []\`. For r=0..rows-1, grid[r]=[]; for c=0..cols-1: m = { x: ox+c*20, y: oy+r*20, b:0, col:c, row:r }; marks.push(m); grid[r][c] = m.
\`const t0 = performance.now()\`.

## Animation loop
ctx.clearRect(0,0,cw,ch)
ctx.lineWidth = 0.5   // reset before mark loop
mx = mouseRef.current?.x ?? -99999; my = mouseRef.current?.y ?? -99999
r2 = 340*340
dotRGB = isDark ? '255,255,255' : '28,25,22'
t = (performance.now() - t0) / 1000

For each d in marks:
- dx = d.x - mx; dy = d.y - my; dist2 = dx*dx + dy*dy
- tgt = dist2 < r2 ? Math.pow(1 - Math.sqrt(dist2)/340, 1.5) : 0
- d.b += (tgt > d.b ? 0.16 : 0.05) * (tgt - d.b); if d.b<0.004 d.b=0
- arm = 2 + d.b*1.0
- sw  = 0.5 + d.b*0.3
- baseA = isDark ? 0.13 : 0.25
- wave = Math.sin(d.col*0.3 + d.row*0.3 - t*0.5)
- restingAlpha = baseA*(1 + wave*0.3)
- alpha = restingAlpha + (0.92 - restingAlpha)*d.b
- ctx.strokeStyle = \`rgba(\${dotRGB},\${alpha.toFixed(2)})\`; ctx.lineWidth = sw
- ctx.beginPath(); ctx.moveTo(d.x-arm, d.y-arm); ctx.lineTo(d.x+arm, d.y+arm); ctx.moveTo(d.x+arm, d.y-arm); ctx.lineTo(d.x-arm, d.y+arm); ctx.stroke()

Connection pass:
ctx.lineWidth = 0.5
For each d with d.b >= 0.05:
  neighbours = [grid[d.row]?.[d.col+1], grid[d.row+1]?.[d.col], grid[d.row+1]?.[d.col+1], grid[d.row+1]?.[d.col-1]]
  For each n: if !n || n.b<0.05 continue; lineAlpha = Math.min(d.b,n.b)*0.4; ctx.strokeStyle = \`rgba(\${dotRGB},\${lineAlpha.toFixed(2)})\`; ctx.beginPath(); ctx.moveTo(d.x,d.y); ctx.lineTo(n.x,n.y); ctx.stroke().

## Theme detection
const check = () => { const card = el.closest('[data-card-theme]'); const dark = card?card.classList.contains('dark'):document.documentElement.classList.contains('dark'); setIsDark(dark); isDarkRef.current=dark; }
MutationObserver(check) on documentElement and card wrapper if present, attributeFilter ['class']. Disconnect on unmount.

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
    <span style={{ color: isDark?'rgba(255,255,255,0.45)':'rgba(28,25,22,0.45)', fontSize:22, fontWeight:700, letterSpacing:'-0.02em' }}>X Grid</span>
    <span style={{ color: isDark?'rgba(255,255,255,0.18)':'rgba(28,25,22,0.22)', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.12em' }}>hover to illuminate</span>
  </div>
</div>
\`\`\`
update(cx,cy): rect = canvas.getBoundingClientRect(); mouseRef.current = { x:cx-rect.left, y:cy-rect.top }.

## Cleanup
alive=false; cancelAnimationFrame; ResizeObserver(canvas.parentElement) → disconnect; observer.disconnect.`,

  V0: `Create a React client component named \`XGrid\`. Single file, TypeScript, \`'use client'\` at the top. Use \`useEffect\`, \`useRef\`, and \`useState\` from React — no other libraries, no framer-motion. The component fills its parent (\`h-full w-full\`) and supports both light and dark themes.

## The visual
A dense, quiet grid of small × marks drawn on a full-bleed canvas. At rest, every × breathes: a slow diagonal sine wave ripples across the whole field, very subtle — think "the grid is gently alive, not flashy." When you move the cursor over it, a soft circular halo of illumination follows the pointer: marks inside the halo brighten, grow slightly, and thicken. As neighbouring marks both light up, thin lines connect them — so hovering draws a faint, constellation-like mesh that decays back to nothing in about a second after the cursor leaves.

Centered in the frame are two overlay labels:
- A title reading exactly \`X Grid\` — 22px, font-weight 700, letter-spacing -0.02em.
- Below it, a hint reading exactly \`hover to illuminate\` — 11px, font-weight 600, uppercase, letter-spacing 0.12em.

Both labels sit above the canvas with \`pointer-events-none\` so they never block the hover. On dark, the labels use \`rgba(255,255,255,0.45)\` and \`rgba(255,255,255,0.18)\`. On light, use \`rgba(28,25,22,0.45)\` and \`rgba(28,25,22,0.22)\`.

## Theme
Detect theme by checking \`.closest('[data-card-theme]')\` for a \`.dark\` class, falling back to \`document.documentElement.classList.contains('dark')\`. Track it with \`useState isDark\` plus an \`isDarkRef\` for the render loop. Watch for theme changes with a \`MutationObserver\` on \`documentElement\` (and the card wrapper if present) listening for class attribute changes.

Background: \`#110F0C\` on dark, \`#F5F1EA\` on light — set as an inline style on the outer container. The marks themselves are drawn white (\`255,255,255\`) on dark and near-black (\`28,25,22\`) on light.

## Key constants
- \`SPACING = 20\` — pixels between × centres
- \`RADIUS = 340\` — hover influence radius in pixels (generous — roughly two-thirds of a 480px preview)
- resting alpha: \`0.13\` on dark, \`0.25\` on light
- peak lit alpha: \`0.92\`

## Canvas setup
Standard DPR scaffolding: read \`devicePixelRatio\`, measure the canvas with \`getBoundingClientRect\`, set \`canvas.width/height\` to the rounded scaled pixels, and \`ctx.setTransform(dpr,0,0,dpr,0,0)\`. Rebuild on resize via a \`ResizeObserver\` on \`canvas.parentElement\`.

Build a flat \`marks\` array and a 2D \`grid[row][col]\` lookup at the same time. Use \`Math.floor(cw/SPACING)+2\` columns and rows so the grid fully covers the bleed, offset by \`(cw%SPACING)/2\` and \`(ch%SPACING)/2\` to keep it visually centred. Each mark stores \`{ x, y, b, col, row }\` — \`b\` is its 0→1 brightness. Capture \`t0 = performance.now()\` for the wave clock.

## The frame loop
On every animation frame:

1. Clear the canvas and reset \`ctx.lineWidth = 0.5\` first thing (this matters — the connection pass at the end of the previous frame left \`lineWidth\` in a different state, and without this reset the first few marks of each frame render with the wrong stroke).
2. Read the mouse position from a ref (fall back to an off-screen coordinate like \`-99999\` when there's no hover, so the distance math naturally excludes everything).
3. Compute \`t = (performance.now() - t0) / 1000\` for the breathing wave.
4. For each mark, compute its squared distance to the cursor. If it's within \`RADIUS\`, its target brightness is \`Math.pow(1 - Math.sqrt(dist2)/RADIUS, 1.5)\` — a soft power-curve falloff that feels wide and creamy rather than a hard circle. Outside the radius, target is 0.
5. Ease \`b\` toward its target asymmetrically: fast on the way up (\`0.16\`), slow on the way down (\`0.05\`). This gives the ~1 second tail after the cursor leaves. Snap \`b\` to 0 once it drops below \`0.004\`.
6. Arm length grows from \`2\` to \`3\` pixels with brightness (\`arm = 2 + b\`). Stroke width grows from \`0.5\` to \`0.8\` (\`sw = 0.5 + b*0.3\`).
7. The resting breathing wave: \`wave = Math.sin(col*0.3 + row*0.3 - t*0.5)\`. Note the diagonal — both axes contribute with the same frequency, so the ripple travels along the grid diagonal rather than straight across. Apply it as \`restingAlpha = baseA * (1 + wave*0.3)\`.
8. Final alpha blends resting toward peak by brightness: \`alpha = restingAlpha + (0.92 - restingAlpha) * b\`.
9. Draw the × itself: \`beginPath\`, two diagonal strokes (\`moveTo/lineTo\` from each corner of the arm box to the opposite corner), \`stroke\`.

## Connection mesh
After the mark loop, do a second pass. Reset \`ctx.lineWidth = 0.5\`. For each mark with \`b >= 0.05\`, look up four neighbours via the grid: right (\`[row][col+1]\`), below (\`[row+1][col]\`), diagonal down-right (\`[row+1][col+1]\`), and diagonal down-left (\`[row+1][col-1]\`). Using only down-and-right neighbours is important — it prevents drawing every connection twice. For each neighbour that exists and also has \`b >= 0.05\`, draw a thin line between the two mark centres at \`lineAlpha = min(d.b, n.b) * 0.4\`. Same white/near-black colour as the marks. This produces the fading constellation mesh inside the hover halo.

## Interaction
Attach \`onMouseMove\`, \`onMouseLeave\`, \`onTouchMove\`, \`onTouchEnd\` to the outer container. On move, read the canvas's \`getBoundingClientRect\` and store \`{ x: clientX - rect.left, y: clientY - rect.top }\` in \`mouseRef.current\`. On leave/end, set it to \`null\`. Touch follows the same pattern using \`e.touches[0]\`.

## Structure
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: ... }} ...handlers>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span>X Grid</span>
    <span>hover to illuminate</span>
  </div>
</div>
\`\`\`

## Cleanup
Use an \`alive\` flag inside the effect and guard the frame loop with it. On unmount: set \`alive = false\`, \`cancelAnimationFrame\`, disconnect the \`ResizeObserver\`, and disconnect the theme \`MutationObserver\`. No leaks.

The finished piece should feel quiet and architectural at rest, with the cursor acting like a soft lamp that reveals a constellation inside a sea of faint marks.`,
}
