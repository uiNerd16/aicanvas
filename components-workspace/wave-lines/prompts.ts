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

  V0: `Create a React client component named \`WaveLines\`. Single file, TypeScript, \`'use client'\` at the top. Use \`useEffect\`, \`useRef\`, and \`useState\` from React — no other libraries, no framer-motion. The component fills its parent (\`h-full w-full\`) and supports both light and dark themes.

## The visual
Imagine a loose cloth of vertical lines hanging down the frame, evenly spaced about 32 pixels apart. At rest they aren't straight — each line gently curves left and right in a slow, organic way, like a wind-stirred curtain. The curvature runs down the length of each line (so it's a wave in the y-axis), and neighbouring lines are slightly phase-offset from each other so the whole field reads as a soft vertical cloth with diagonal folds travelling across it. Two sine waves are layered at different frequencies and speeds to keep the motion from ever feeling mechanical — think "slightly off-rhythm breathing" rather than a clean ripple.

When the cursor enters the canvas, two things happen at once. First, globally, the entire field's amplitude ramps up dramatically — about 6x its resting value — so the cloth goes from a calm sway to a theatrical billowing. Second, locally, a gaussian repulsion field pushes every sample point away from the cursor, so the lines fold and bow outward around the pointer as if repelled by an invisible palm. When the cursor leaves, both effects ease back down — the global amplitude decays a little more slowly than it ramped up, so there's a short tail of "still billowing" after you exit.

Centered in the frame, above the canvas, sit two overlay labels:
- Title reading exactly \`Wave Lines\` — 22px, font-weight 700, letter-spacing -0.02em.
- Hint below it reading exactly \`hover to fold\` — 11px, font-weight 600, uppercase, letter-spacing 0.12em.

Both labels are \`pointer-events-none\` so they never block the hover. On dark, the labels use \`rgba(255,255,255,0.45)\` and \`rgba(255,255,255,0.18)\`. On light, use \`rgba(28,25,22,0.45)\` and \`rgba(28,25,22,0.22)\`.

## Theme
Detect theme by checking \`.closest('[data-card-theme]')\` for a \`.dark\` class, falling back to \`document.documentElement.classList.contains('dark')\`. Track it with \`useState isDark\` plus an \`isDarkRef\` so the render loop reads the live value without re-subscribing. A \`MutationObserver\` on \`documentElement\` (and the card wrapper if present) watches for class changes.

Background: \`#110F0C\` on dark, \`#F5F1EA\` on light — set as an inline style on the outer container. The lines themselves stroke in white (\`255,255,255\`) on dark and near-black (\`28,25,22\`) on light. Line alpha is \`0.55\` on dark and a slightly stronger \`0.75\` on light (dark surfaces can afford more transparency; light ones need the extra contrast).

## Key constants
- \`SPACING = 32\` — pixels between vertical lines at rest
- \`ROW_STEP = 4\` — pixels between sample points down each line (small enough that the curve stays silky smooth)
- \`AMP = 18\` — resting wave amplitude in pixels
- \`FREQ_Y = 0.015\` — wave frequency along the vertical axis (how many curves fit down a line)
- \`FREQ_X = 0.006\` — per-column phase offset (how much neighbouring lines are staggered — this is what creates the diagonal fold read)
- \`HOVER_BOOST = 5.0\` — global amplitude multiplier on full hover (so on-hover amp = 18 * (1 + 5) = 108 px at peak)
- \`LOCAL_AMP = 58\` — peak pixel displacement of the cursor repulsion
- \`LOCAL_RADIUS = 220\` — gaussian repulsion radius in pixels
- Line width: \`0.8\`

## Canvas setup
Standard DPR scaffolding — read \`devicePixelRatio\`, measure the canvas with \`getBoundingClientRect\`, set \`canvas.width/height\` to the rounded scaled pixels, then \`ctx.setTransform(dpr,0,0,dpr,0,0)\`. Rebuild on resize via a \`ResizeObserver\` on \`canvas.parentElement\`.

Compute \`cols = Math.ceil(cw / SPACING) + 2\` (the +2 bleeds one extra line off each edge so nothing pops in during resize) and \`rows = Math.ceil(ch / ROW_STEP) + 1\`. Centre the grid horizontally with \`ox = (cw % SPACING) / 2\`.

## The frame loop
Keep a clock \`t\` that advances by \`0.003\` each frame — very slow; the motion should feel patient. Also keep an eased \`hoverStr\` value that lerps from 0 toward 1 when the cursor is present and back toward 0 when it's not. Use \`0.018\` as the approach rate and \`0.010\` as the retreat rate — hover should snap in a little faster than it decays out.

Each frame:
1. Clear the canvas.
2. Compute the current amplitude: \`amp = AMP * (1 + hoverStr * HOVER_BOOST)\`. At rest it's 18; at full hover it's 108.
3. Read the mouse position from a ref, falling back to a far-off coordinate like \`-99999\` when there's no hover so the distance math naturally excludes everything.
4. Set \`ctx.strokeStyle\` to the current rgba with the theme-appropriate alpha, and \`ctx.lineWidth = 0.8\`.
5. For each column \`c\` from 0 to \`cols-1\`, compute the base x position \`rx = ox + c * SPACING\`, begin a new path, and walk down the line from \`r = 0\` to \`r = rows\`.

For each sample point along a line at \`ry = r * ROW_STEP\`:
- Compute the horizontal wave offset \`wx\` as the sum of two sines at different frequencies — the primary term \`amp * sin(ry*FREQ_Y + rx*FREQ_X + t)\` gives the main curtain curve, and a secondary term \`amp * 0.38 * sin(ry*FREQ_Y*1.6 + rx*FREQ_X*1.4 + t*1.5 + 1.1)\` layers a smaller, faster, phase-shifted wave on top. The mismatch between the two is what makes the motion read organic.
- Compute a tiny vertical drift \`wy = amp * 0.12 * cos(rx*FREQ_X*0.9 + ry*FREQ_Y*0.4 + t*0.8)\` — roughly 12% of current amp, slower clock. This makes the lines "breathe" vertically a hair, so they don't just slide side-to-side.
- Gaussian cursor repulsion: compute \`dx = rx - mx\`, \`dy = ry - my\`, \`dist2 = dx*dx + dy*dy\`. If \`dist2 < (LOCAL_RADIUS*LOCAL_RADIUS * 4)\` (a generous early-out), compute \`push = LOCAL_AMP * Math.exp(-dist2 / (LOCAL_RADIUS*LOCAL_RADIUS * 0.5))\` and shove the point along the unit vector away from the cursor: \`px = (dx/dist)*push\`, \`py = (dy/dist)*push\`. Guard \`dist = Math.sqrt(dist2) || 1\` so you never divide by zero.
- Final point is \`x = rx + wx + px\`, \`y = ry + wy + py\`.

For the path itself, use a midpoint-quadratic trick to keep the curve silky: on the first sample, \`moveTo(x, y)\`. On every subsequent sample, \`quadraticCurveTo(prevX, prevY, (prevX + x)/2, (prevY + y)/2)\` — the previous point is the control, the midpoint between previous and current is the anchor. This yields a continuously smooth spline without extra math. After the loop, \`lineTo(prevX, prevY)\` to terminate, then \`stroke\`. Keep \`prevX\`/\`prevY\` tracked across iterations.

## Interaction
Attach \`onMouseMove\`, \`onMouseLeave\`, \`onTouchMove\`, \`onTouchEnd\` to the outer container. On move, read the canvas's \`getBoundingClientRect\` and store \`{ x: clientX - rect.left, y: clientY - rect.top }\` in \`mouseRef.current\`. On leave/end, set it to \`null\`. Touch follows the same pattern using \`e.touches[0]\`.

## Structure
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: ... }} ...handlers>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span>Wave Lines</span>
    <span>hover to fold</span>
  </div>
</div>
\`\`\`

## Cleanup
Use an \`alive\` flag inside the effect and guard the frame loop with it. On unmount: set \`alive = false\`, \`cancelAnimationFrame\`, disconnect the \`ResizeObserver\`, and disconnect the theme \`MutationObserver\`. No leaks.

At rest the piece should feel like a quiet curtain in a still room — barely moving, just alive. On hover it should erupt into a dramatic, fluid fold around the cursor, then settle back with a soft tail when you leave.`,
}
