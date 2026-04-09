import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`SphereLines\`.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A canvas-rendered wireframe sphere of latitude rings. A narrow traveling wave band auto-sweeps across the globe; the cursor creates a local gaussian distortion; the whole sphere rotates. Each ring is drawn twice: dim full 360° arc on the back, bright front-hemisphere arc using sin(θ+rot) visibility. No overlay text.

## Constants
- N_LATS = 42, N_STEPS = 240
- WAVE_PHI = 0.28 (radial amplitude of the traveling band)
- WAVE_FREQ_T = 2.0, WAVE_FREQ_P = 1.8
- WAVE_SPEED_IDLE = 0.003, WAVE_SPEED_HOVER = 0.012
- ROT_SPEED_IDLE = 0.003, ROT_SPEED_HOVER = 0.012
- BACK_A = 0.05 (dim back arc alpha)
- ALPHA_MIN = 0.12, ALPHA_MAX = 0.40 (front line alpha at pole vs equator)
- LW_MIN = 0.35, LW_MAX = 0.90
- BAND_SIGMA = 0.35 (radians — gaussian width of traveling band)
- BAND_FREQ = 2.5
- HOVER_RADIUS = 90 px, HOVER_AMP = 0.45
- TWO_PI = Math.PI*2

## Canvas setup
R = min(cw,ch)*0.42; cx=cw/2; cy=ch/2. DPR scaffolding standard. Circular clip: save, arc(cx,cy,R,0,2π), clip.

## Per frame
- hasHover = mouseRef != null
- hoverStr += ((hasHover?1:0) - hoverStr) * (hasHover?0.025:0.015)
- t += WAVE_SPEED_IDLE + hoverStr*(WAVE_SPEED_HOVER - WAVE_SPEED_IDLE)
- rot += ROT_SPEED_IDLE + hoverStr*(ROT_SPEED_HOVER - ROT_SPEED_IDLE)
- bandCenter = sin(t*BAND_FREQ) * (PI*0.4)
- dotRGB = dark ? '255,255,255' : '28,25,22'

Allocate xs,ys (Float32Array N_STEPS+1) ONCE outside the loop, reuse.

For i=0..N_LATS-1:
- phi = -π/2 + (i+1)*π/(N_LATS+1)
- depth = cos(phi); lineA = ALPHA_MIN + depth*(ALPHA_MAX-ALPHA_MIN); lw = LW_MIN + depth*(LW_MAX-LW_MIN)
- dist = phi - bandCenter; autoEnv = exp(-(dist²)/(2*BAND_SIGMA²)); autoAmp = WAVE_PHI*autoEnv

For j=0..N_STEPS:
- theta = j*2π/N_STEPS; tR = theta + rot
- autoDPhi = autoAmp * (sin(tR*WAVE_FREQ_T + phi*WAVE_FREQ_P + t) + 0.45*sin(tR*WAVE_FREQ_T*1.7 + phi*WAVE_FREQ_P*1.3 + t*1.4))
- localDPhi: if mouse && hoverStr>0.01: project undisplaced point sx=cx+R*cos(phi)*cos(tR), sy=cy-R*sin(phi); dx=sx-mouse.x; dy=sy-mouse.y; localEnv = exp(-(dx²+dy²)/HOVER_RADIUS²); localDPhi = HOVER_AMP*localEnv*hoverStr*sin(tR*3 + phi*2 + t*6). Else 0.
- phiD = phi + autoDPhi + localDPhi
- xs[j] = cx + R*cos(phiD)*cos(tR); ys[j] = cy - R*sin(phiD)

Back pass (full 360°): strokeStyle rgba(dotRGB,BACK_A); lineWidth 0.4. Walk j with midpoint quadraticCurveTo smoothing starting from midpoint of (N_STEPS-1, 0). closePath; stroke.

Front pass: use Math.sin(j*TWO_PI/N_STEPS + rot) >= 0 as front test. Find first back point startJ (sin<0). strokeStyle rgba(dotRGB,lineA); lineWidth lw. Walk jj=0..N_STEPS, j = (startJ+jj)%N_STEPS. On entering front: moveTo(x,y), inFront=true. Continuing: quadraticCurveTo(prevX,prevY, (prevX+x)/2, (prevY+y)/2). On leaving: lineTo(prevX,prevY), inFront=false. Tail lineTo if still inFront. Stroke.

Restore clip. Schedule next frame.

## Theme
isDark state + isDarkRef + observer (same pattern).

## JSX
div ref containerRef relative h-full w-full overflow-hidden, bg dark '#110F0C' / light '#F5F1EA'. Mouse/touch handlers on the div. Canvas absolute inset-0 100%/100%. No overlay.

Cleanup: alive=false; cancelAnimationFrame; ResizeObserver on canvas.parentElement; observer.disconnect.`,

  GPT: `Build a React client component named \`SphereLines\`. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

Wireframe latitude sphere on canvas. Auto-traveling wave band distorts rings along phi; rotating; cursor produces local gaussian distortion; each ring drawn in two passes (dim back 360°, bright front hemisphere). No overlay text.

## Constants
N_LATS=42; N_STEPS=240
WAVE_PHI=0.28; WAVE_FREQ_T=2.0; WAVE_FREQ_P=1.8
WAVE_SPEED_IDLE=0.003; WAVE_SPEED_HOVER=0.012
ROT_SPEED_IDLE=0.003; ROT_SPEED_HOVER=0.012
BACK_A=0.05; ALPHA_MIN=0.12; ALPHA_MAX=0.40; LW_MIN=0.35; LW_MAX=0.90
BAND_SIGMA=0.35; BAND_FREQ=2.5
HOVER_RADIUS=90; HOVER_AMP=0.45
TWO_PI=Math.PI*2

## Canvas setup
dpr=devicePixelRatio||1; rect=canvas.getBoundingClientRect(); cw=rect.width; ch=rect.height; canvas.width=round(cw*dpr); canvas.height=round(ch*dpr); ctx.setTransform(dpr,0,0,dpr,0,0).
R = min(cw,ch)*0.42; cx=cw/2; cy=ch/2.
Allocate Float32Array xs,ys (size N_STEPS+1) ONCE outside the frame loop (zs optional).

## Per-frame loop
hasHover = mouseRef!=null
hoverStr += ((hasHover?1:0) - hoverStr) * (hasHover?0.025:0.015)
t   += 0.003 + hoverStr*(0.012 - 0.003)
rot += 0.003 + hoverStr*(0.012 - 0.003)
clearRect
bandCenter = sin(t*2.5) * (π*0.4)
dotRGB = dark ? '255,255,255' : '28,25,22'

ctx.save(); beginPath; arc(cx,cy,R,0,2π); ctx.clip()

for i=0..41:
  phi = -π/2 + (i+1)*π/(42+1)
  depth = cos(phi)
  lineA = 0.12 + depth*(0.40-0.12)
  lw    = 0.35 + depth*(0.90-0.35)
  dist  = phi - bandCenter
  autoEnv = exp(-(dist*dist)/(2*0.35*0.35))
  autoAmp = 0.28 * autoEnv

  for j=0..N_STEPS:
    theta = j*2π/N_STEPS; tR = theta + rot
    autoDPhi = autoAmp * (sin(tR*2.0 + phi*1.8 + t) + 0.45*sin(tR*2.0*1.7 + phi*1.8*1.3 + t*1.4))
    localDPhi = 0
    if mouse && hoverStr > 0.01:
      sx = cx + R*cos(phi)*cos(tR)
      sy = cy - R*sin(phi)
      dx = sx - mouse.x; dy = sy - mouse.y
      localEnv = exp(-(dx*dx + dy*dy)/(90*90))
      localDPhi = 0.45 * localEnv * hoverStr * sin(tR*3 + phi*2 + t*6)
    phiD = phi + autoDPhi + localDPhi
    xs[j] = cx + R*cos(phiD)*cos(tR)
    ys[j] = cy - R*sin(phiD)

  # back pass — full 360° dim arc with midpoint smoothing
  strokeStyle = \`rgba(\${dotRGB},0.05)\`; lineWidth = 0.4
  beginPath
  mx0=(xs[N_STEPS-1]+xs[0])/2; my0=(ys[N_STEPS-1]+ys[0])/2
  moveTo(mx0,my0)
  for j=0..N_STEPS-1: nx=j+1<N_STEPS?xs[j+1]:xs[0]; ny=j+1<N_STEPS?ys[j+1]:ys[0]; mx2=(xs[j]+nx)/2; my2=(ys[j]+ny)/2; quadraticCurveTo(xs[j],ys[j],mx2,my2)
  closePath; stroke

  # front pass — hemisphere only using sin(j*TWO_PI/N_STEPS + rot) >= 0
  startJ = 0
  for j=0..N_STEPS-1: if sin(j*TWO_PI/N_STEPS + rot) < 0: startJ=j; break
  strokeStyle = \`rgba(\${dotRGB},\${lineA.toFixed(3)})\`; lineWidth = lw
  beginPath
  inFront = false; prevX=0; prevY=0
  for jj=0..N_STEPS:
    j = (startJ+jj) % N_STEPS
    isFront = sin(j*TWO_PI/N_STEPS + rot) >= 0
    x = xs[j]; y = ys[j]
    if isFront:
      if !inFront: moveTo(x,y); inFront=true
      else: quadraticCurveTo(prevX,prevY,(prevX+x)/2,(prevY+y)/2)
      prevX=x; prevY=y
    else if inFront: lineTo(prevX,prevY); inFront=false
  if inFront: lineTo(prevX,prevY)
  stroke

ctx.restore()

## Theme detection
useState isDark + isDarkRef. closest('[data-card-theme]') dark class or documentElement. MutationObserver on both.

## JSX
div ref containerRef relative h-full w-full overflow-hidden, inline bg per theme, onMouseMove/onMouseLeave/onTouchMove/onTouchEnd setting mouseRef. canvas absolute inset-0 style width 100% height 100%. No overlay text.

## Cleanup
alive=false; cancelAnimationFrame; ResizeObserver.observe(canvas.parentElement) → disconnect; observer.disconnect.`,

  Gemini: `Implement a React client component named \`SphereLines\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

A canvas wireframe sphere of latitude rings. An auto-traveling sine band distorts rings along phi. Everything rotates. The cursor adds a local gaussian distortion. Each ring is drawn as a dim full 360° back arc plus a bright front-hemisphere arc (front test = sin(θ+rot)>=0). No overlay text.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useEffect, useRef, useState } from 'react'
\`\`\`
USE these hooks and no others. DO NOT invent useSpringValue, useAnimatedValue, or helpers not shown above. No framer-motion.

## Constants (exact)
N_LATS=42, N_STEPS=240
WAVE_PHI=0.28, WAVE_FREQ_T=2.0, WAVE_FREQ_P=1.8
WAVE_SPEED_IDLE=0.003, WAVE_SPEED_HOVER=0.012
ROT_SPEED_IDLE=0.003, ROT_SPEED_HOVER=0.012
BACK_A=0.05, ALPHA_MIN=0.12, ALPHA_MAX=0.40
LW_MIN=0.35, LW_MAX=0.90
BAND_SIGMA=0.35, BAND_FREQ=2.5
HOVER_RADIUS=90, HOVER_AMP=0.45
TWO_PI = Math.PI*2

## Refs / state
containerRef<HTMLDivElement>, canvasRef<HTMLCanvasElement>, mouseRef<{x,y}|null>, isDarkRef (bool,true), const [isDark,setIsDark]=useState(true).

## Canvas DPR scaffolding (inline exactly)
\`\`\`
const dpr = window.devicePixelRatio || 1
const rect = canvas.getBoundingClientRect()
const cw = rect.width, ch = rect.height
canvas.width = Math.round(cw * dpr)
canvas.height = Math.round(ch * dpr)
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
\`\`\`
Allocate \`const xs = new Float32Array(N_STEPS+1)\` and \`const ys = new Float32Array(N_STEPS+1)\` ONCE outside the frame function; reuse every frame.

## Animation loop
t=0; rot=0; hoverStr=0 at setup.
Each frame:
- hasHover = mouseRef.current !== null
- hoverStr += ((hasHover?1:0) - hoverStr) * (hasHover?0.025:0.015)
- t   += 0.003 + hoverStr*(0.012-0.003)
- rot += 0.003 + hoverStr*(0.012-0.003)
- ctx.clearRect(0,0,cw,ch)
- R = Math.min(cw,ch)*0.42; cx=cw/2; cy=ch/2
- bandCenter = Math.sin(t*2.5) * (Math.PI*0.4)
- dotRGB = isDark ? '255,255,255' : '28,25,22'
- ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,R,0,2π); ctx.clip()

For i=0..41:
- phi = -π/2 + (i+1)*π/43
- depth = Math.cos(phi); lineA = 0.12 + depth*(0.40-0.12); lw = 0.35 + depth*(0.90-0.35)
- dist = phi - bandCenter; autoEnv = Math.exp(-(dist*dist)/(2*0.35*0.35)); autoAmp = 0.28*autoEnv

For j=0..N_STEPS:
- theta = j*2π/N_STEPS; tR = theta+rot
- autoDPhi = autoAmp*(Math.sin(tR*2.0 + phi*1.8 + t) + 0.45*Math.sin(tR*2.0*1.7 + phi*1.8*1.3 + t*1.4))
- localDPhi = 0
- if mouse && hoverStr>0.01:
    sx=cx+R*Math.cos(phi)*Math.cos(tR); sy=cy-R*Math.sin(phi)
    dx=sx-mouse.x; dy=sy-mouse.y
    localEnv=Math.exp(-(dx*dx+dy*dy)/(90*90))
    localDPhi = 0.45*localEnv*hoverStr*Math.sin(tR*3 + phi*2 + t*6)
- phiD = phi + autoDPhi + localDPhi
- xs[j]=cx+R*Math.cos(phiD)*Math.cos(tR); ys[j]=cy-R*Math.sin(phiD)

Back pass: strokeStyle=\`rgba(\${dotRGB},0.05)\`; lineWidth=0.4. beginPath; moveTo((xs[N_STEPS-1]+xs[0])/2,(ys[N_STEPS-1]+ys[0])/2); for j=0..N_STEPS-1: nx=j+1<N_STEPS?xs[j+1]:xs[0]; ny=j+1<N_STEPS?ys[j+1]:ys[0]; quadraticCurveTo(xs[j],ys[j],(xs[j]+nx)/2,(ys[j]+ny)/2); closePath; stroke.

Front pass: find startJ = first j where Math.sin(j*TWO_PI/N_STEPS + rot) < 0. strokeStyle=\`rgba(\${dotRGB},\${lineA.toFixed(3)})\`; lineWidth=lw. Walk jj=0..N_STEPS, j=(startJ+jj)%N_STEPS; isFront=Math.sin(j*TWO_PI/N_STEPS+rot)>=0. On entering front moveTo(x,y); inFront=true. Continuing: quadraticCurveTo(prevX,prevY,(prevX+x)/2,(prevY+y)/2). On leaving: lineTo(prevX,prevY); inFront=false. Tail: if inFront lineTo(prevX,prevY). Stroke.

ctx.restore() after all lats.

## Theme detection
const check = () => { const card = el.closest('[data-card-theme]'); const dark = card?card.classList.contains('dark'):document.documentElement.classList.contains('dark'); setIsDark(dark); isDarkRef.current=dark; }
MutationObserver(check) on documentElement + card wrapper if present, attributeFilter ['class']. Disconnect on unmount.

## JSX
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden"
     style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}
     onMouseMove={e => update(e.clientX,e.clientY)}
     onMouseLeave={() => { mouseRef.current = null }}
     onTouchMove={e => { const t2 = e.touches[0]; if (t2) update(t2.clientX,t2.clientY) }}
     onTouchEnd={() => { mouseRef.current = null }}>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width:'100%', height:'100%' }} />
</div>
\`\`\`
update(cx,cy): rect = canvas.getBoundingClientRect(); mouseRef.current = { x:cx-rect.left, y:cy-rect.top }.

## Cleanup
alive=false; cancelAnimationFrame; ResizeObserver(canvas.parentElement) → disconnect; observer.disconnect.`,
}
