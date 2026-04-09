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
}
