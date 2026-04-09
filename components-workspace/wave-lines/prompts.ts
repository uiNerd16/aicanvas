import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`WaveLines\`.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A canvas of vertical cloth-like lines that breathe with a double sine wave and fold dramatically around the cursor on hover. Centred label "Wave Lines" with hint "hover to fold".

## Constants
- SPACING = 32 (px between lines at rest)
- ROW_STEP = 4 (sample step per line)
- AMP = 18 (resting wave amplitude)
- FREQ_Y = 0.015, FREQ_X = 0.006
- HOVER_BOOST = 5.0 (amplitude multiplier on hover)
- LOCAL_AMP = 58, LOCAL_RADIUS = 220
- LINE_A_DARK = 0.55, LINE_A_LIGHT = 0.75

## Canvas setup
DPR scaffolding. Computed once per build: cols = ceil(cw/SPACING)+2; rows = ceil(ch/ROW_STEP)+1; ox = (cw%SPACING)/2.

## Per frame (t += 0.003)
- hasHover = mouseRef != null
- hoverStr += ((hasHover?1:0) - hoverStr) * (hasHover?0.018:0.010)
- clearRect
- dotRGB = dark ? '255,255,255' : '28,25,22'
- lineA  = dark ? 0.55 : 0.75
- amp    = AMP * (1 + hoverStr * HOVER_BOOST)
- mx,my = mouseRef ?? -99999; r2 = LOCAL_RADIUS²
- strokeStyle rgba(dotRGB,lineA); lineWidth 0.8

For c=0..cols-1:
  rx = ox + c*SPACING
  beginPath; prevX=0; prevY=0
  For r=0..rows:
    ry = r*ROW_STEP
    wx = amp*sin(ry*FREQ_Y + rx*FREQ_X + t) + amp*0.38*sin(ry*FREQ_Y*1.6 + rx*FREQ_X*1.4 + t*1.5 + 1.1)
    wy = amp*0.12*cos(rx*FREQ_X*0.9 + ry*FREQ_Y*0.4 + t*0.8)
    dx = rx - mx; dy = ry - my; dist2 = dx²+dy²
    px = py = 0
    if (dist2 < r2*4):
      push = LOCAL_AMP * exp(-dist2 / (r2 * 0.5))
      dist = sqrt(dist2) || 1
      px = (dx/dist)*push; py = (dy/dist)*push
    x = rx+wx+px; y = ry+wy+py
    r===0 ? moveTo(x,y) : quadraticCurveTo(prevX,prevY,(prevX+x)/2,(prevY+y)/2)
    prevX=x; prevY=y
  lineTo(prevX,prevY); stroke

## Theme
useState isDark + isDarkRef + observer (closest data-card-theme → documentElement).

## JSX
div ref containerRef relative h-full w-full overflow-hidden, bg per theme, mouse/touch handlers on div. Canvas absolute inset-0 100%/100%. Overlay pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2:
- span "Wave Lines" — color dark rgba(255,255,255,0.45) / light rgba(28,25,22,0.45), fontSize 22, fontWeight 700, letterSpacing -0.02em
- span "hover to fold" — color dark rgba(255,255,255,0.18) / light rgba(28,25,22,0.22), fontSize 11, fontWeight 600, uppercase, letterSpacing 0.12em

Cleanup: alive=false; cancelAnimationFrame; ResizeObserver on canvas.parentElement; observer.disconnect.`,

  GPT: `Build a React client component named \`WaveLines\`. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

Vertical canvas wave lines breathing via a double sine; dramatic gaussian cursor fold on hover. Overlay "Wave Lines" label + "hover to fold" hint.

## Constants
SPACING=32; ROW_STEP=4; AMP=18
FREQ_Y=0.015; FREQ_X=0.006
HOVER_BOOST=5.0; LOCAL_AMP=58; LOCAL_RADIUS=220
LINE_A_DARK=0.55; LINE_A_LIGHT=0.75

## Canvas setup
dpr=devicePixelRatio||1; rect=canvas.getBoundingClientRect(); cw=rect.width; ch=rect.height; canvas.width=round(cw*dpr); canvas.height=round(ch*dpr); ctx.setTransform(dpr,0,0,dpr,0,0).
cols=ceil(cw/32)+2; rows=ceil(ch/4)+1; ox=(cw%32)/2.

## Per-frame loop
t += 0.003
hasHover = mouseRef != null
hoverStr += ((hasHover?1:0) - hoverStr) * (hasHover?0.018:0.010)
clearRect
dotRGB = dark ? '255,255,255' : '28,25,22'
lineA  = dark ? 0.55 : 0.75
amp    = 18 * (1 + hoverStr * 5.0)
mx = mouseRef?.x ?? -99999; my = mouseRef?.y ?? -99999
r2 = 220*220
strokeStyle = \`rgba(\${dotRGB},\${lineA.toFixed(3)})\`
lineWidth = 0.8

for c=0..cols-1:
  rx = ox + c*32
  beginPath; prevX=0; prevY=0
  for r=0..rows:
    ry = r*4
    wx = amp*sin(ry*0.015 + rx*0.006 + t) + amp*0.38*sin(ry*0.015*1.6 + rx*0.006*1.4 + t*1.5 + 1.1)
    wy = amp*0.12*cos(rx*0.006*0.9 + ry*0.015*0.4 + t*0.8)
    dx = rx - mx; dy = ry - my; dist2 = dx*dx + dy*dy
    px = 0; py = 0
    if dist2 < r2*4:
      push = 58 * exp(-dist2/(r2*0.5))
      dist = sqrt(dist2) || 1
      px = (dx/dist)*push; py = (dy/dist)*push
    x = rx + wx + px
    y = ry + wy + py
    if r===0: moveTo(x,y)
    else: quadraticCurveTo(prevX,prevY,(prevX+x)/2,(prevY+y)/2)
    prevX=x; prevY=y
  lineTo(prevX,prevY); stroke

## Theme detection
useState isDark + isDarkRef. Observer on documentElement + closest('[data-card-theme]'), attributeFilter ['class'].

## JSX structure
- div ref relative h-full w-full overflow-hidden, inline bg = isDark ? '#110F0C' : '#F5F1EA'. Handlers onMouseMove/onMouseLeave/onTouchMove/onTouchEnd set mouseRef = { x: clientX-rect.left, y: clientY-rect.top } or null.
- canvas absolute inset-0 style width 100% height 100%.
- overlay pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2:
  * span "Wave Lines" — color dark rgba(255,255,255,0.45) / light rgba(28,25,22,0.45), fontSize 22, fontWeight 700, letterSpacing -0.02em.
  * span "hover to fold" — color dark rgba(255,255,255,0.18) / light rgba(28,25,22,0.22), fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em.

## Cleanup
alive=false; cancelAnimationFrame; ro.disconnect; observer.disconnect.`,

  Gemini: `Implement a React client component named \`WaveLines\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

A canvas of vertical cloth-like lines breathing via a double sine wave, with dramatic gaussian folding around the cursor on hover. Centred label "Wave Lines" + hint "hover to fold".

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useEffect, useRef, useState } from 'react'
\`\`\`
USE these hooks and no others. DO NOT invent useSpringValue, useAnimatedValue, or helpers not shown above. No framer-motion.

## Constants (exact)
SPACING=32, ROW_STEP=4, AMP=18, FREQ_Y=0.015, FREQ_X=0.006, HOVER_BOOST=5.0, LOCAL_AMP=58, LOCAL_RADIUS=220, LINE_A_DARK=0.55, LINE_A_LIGHT=0.75.

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
cols = Math.ceil(cw/32)+2; rows = Math.ceil(ch/4)+1; ox = (cw%32)/2.

## Animation loop
let t=0; let hoverStr=0.
Each frame:
- t += 0.003
- hasHover = mouseRef.current !== null
- hoverStr += ((hasHover?1:0) - hoverStr) * (hasHover ? 0.018 : 0.010)
- ctx.clearRect(0,0,cw,ch)
- dotRGB = isDark ? '255,255,255' : '28,25,22'
- lineA  = isDark ? 0.55 : 0.75
- amp    = 18 * (1 + hoverStr*5.0)
- mx = mouseRef.current?.x ?? -99999; my = mouseRef.current?.y ?? -99999; r2 = 220*220
- ctx.strokeStyle = \`rgba(\${dotRGB},\${lineA.toFixed(3)})\`; ctx.lineWidth = 0.8

For c=0..cols-1:
  rx = ox + c*32
  ctx.beginPath(); prevX=0; prevY=0
  For r=0..rows:
    ry = r*4
    wx = amp*Math.sin(ry*0.015 + rx*0.006 + t) + amp*0.38*Math.sin(ry*0.015*1.6 + rx*0.006*1.4 + t*1.5 + 1.1)
    wy = amp*0.12*Math.cos(rx*0.006*0.9 + ry*0.015*0.4 + t*0.8)
    dx = rx - mx; dy = ry - my; dist2 = dx*dx + dy*dy
    px = 0; py = 0
    if (dist2 < r2*4):
      push = 58 * Math.exp(-dist2/(r2*0.5))
      dist = Math.sqrt(dist2) || 1
      px = (dx/dist)*push; py = (dy/dist)*push
    x = rx + wx + px; y = ry + wy + py
    if r===0: ctx.moveTo(x,y)
    else: ctx.quadraticCurveTo(prevX,prevY,(prevX+x)/2,(prevY+y)/2)
    prevX = x; prevY = y
  ctx.lineTo(prevX,prevY); ctx.stroke()

## Theme detection
const check = () => { const card = el.closest('[data-card-theme]'); const dark = card?card.classList.contains('dark'):document.documentElement.classList.contains('dark'); setIsDark(dark); isDarkRef.current=dark; }
MutationObserver(check) on documentElement and card wrapper if present, attributeFilter ['class']. Disconnect on unmount.

## JSX (exact)
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden"
     style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}
     onMouseMove={e => update(e.clientX,e.clientY)}
     onMouseLeave={() => { mouseRef.current = null }}
     onTouchMove={e => { const t2 = e.touches[0]; if (t2) update(t2.clientX,t2.clientY) }}
     onTouchEnd={() => { mouseRef.current = null }}>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width:'100%', height:'100%' }} />
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span style={{ color: isDark?'rgba(255,255,255,0.45)':'rgba(28,25,22,0.45)', fontSize:22, fontWeight:700, letterSpacing:'-0.02em' }}>Wave Lines</span>
    <span style={{ color: isDark?'rgba(255,255,255,0.18)':'rgba(28,25,22,0.22)', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.12em' }}>hover to fold</span>
  </div>
</div>
\`\`\`
update(cx,cy): rect = canvas.getBoundingClientRect(); mouseRef.current = { x:cx-rect.left, y:cy-rect.top }.

## Cleanup
alive=false; cancelAnimationFrame; ResizeObserver(canvas.parentElement) → disconnect; observer.disconnect.`,
}
