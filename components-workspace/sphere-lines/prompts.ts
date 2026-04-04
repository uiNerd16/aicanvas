import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a canvas component called SphereLines. It renders a 3D globe made of latitude lines deformed by organic sine waves — like the Wave Lines cloth effect wrapped around a spinning sphere.

How it works:
- Draw 38 latitude lines on a sphere of radius 42% of min(canvas width, height)
- The sphere rotates continuously: rot += 0.005 rad/frame
- Each latitude at angle φ traces a full 360° circle. For each sample point at angle θ:
    tR = θ + rot (rotated angle)
    wave = WAVE_AMP * (sin(tR×1.5 + φ×2.2 + t) + 0.4×sin(tR×2.7 + φ×2.86 + t×1.5))
    x3 = R×cos(φ)×cos(tR), y3 = R×sin(φ) + wave, z3 = R×cos(φ)×sin(tR)
    project: x2=cx+x3, y2=cy-y3
  WAVE_AMP = R×0.20 at rest, wave time advances by 0.004/frame
- Draw each line in two passes: back hemisphere (full 360°, dim alpha 0.07, 0.5px) then front hemisphere only (z≥0, bright alpha 0.72, 0.8px). Use quadratic midpoint curves for smooth front lines.
- Apply circular clip at radius R so lines stay inside the globe boundary.
- On hover: boost wave amplitude by 2.8× (waves become wild and dramatic). Also apply Gaussian cursor repulsion (45px strength, 150px radius) in 2D projected space.
- Ease hover in/out smoothly. Support dark (#110F0C) and light (#F5F1EA) themes.
- Show centred "Sphere Lines" label and "hover to warp" hint.`,

  Bolt: `Build a React canvas component (SphereLines) — a spinning 3D globe made of organic wave-distorted latitude lines.

Technical spec:
- Canvas fills 100% of parent, use devicePixelRatio for crisp output
- Sphere radius R = Math.min(cw,ch) * 0.42, centered at (cw/2, ch/2)
- Rotation: rot += ROT_SPEED=0.005 per RAF frame
- Wave time: t += WAVE_SPEED=0.004 per frame

Per latitude line i (0..N_LATS-1, N_LATS=38):
  phi = -π/2 + (i+1)*π/(N_LATS+1)
  cosP=cos(phi), sinP=sin(phi)

Per sample j (0..N_STEPS=180):
  theta = j*2π/N_STEPS; tR = theta + rot
  wave = waveAmp*(sin(tR*1.5+phi*2.2+t) + 0.4*sin(tR*2.7+phi*2.86+t*1.5))
  x3=R*cosP*cos(tR), y3=R*sinP+wave, z3=R*cosP*sin(tR)
  x2=cx+x3, y2=cy-y3
  Gaussian repulsion: push=LOCAL_AMP*exp(-dd²/(LOCAL_RADIUS²*0.5)), LOCAL_AMP=45, LOCAL_RADIUS=150
  x2+=(ddx/dd)*push, y2+=(ddy/dd)*push (guard dd²<LOCAL_RADIUS²*4)

Precompute into Float32Arrays xs,ys,zs per latitude.

Back pass: strokeStyle rgba(rgb,0.07), lineWidth=0.5, full 360° lineTo loop, stroke()
Front pass: strokeStyle rgba(rgb,0.72), lineWidth=0.8
  Loop: if(z≥0) moveTo on re-entry then quadraticCurveTo via midpoints; else skip

Global wave amplitude: waveAmp = R*0.20*(1+hoverStr*2.8)
hoverStr lerps 0→1 on hover (×0.018), 1→0 on leave (×0.010)

Circular clip: ctx.save → ctx.arc(cx,cy,R,0,2π) → ctx.clip before drawing all lines
Theme: isDarkRef + MutationObserver on [data-card-theme] + document.documentElement
Cleanup: cancelAnimationFrame + ResizeObserver.disconnect`,

  Lovable: `I want a mesmerising animated canvas component called SphereLines. Imagine the Wave Lines silk-cloth effect — organic, flowing vertical lines — but wrapped around a 3D globe that spins continuously.

The globe is made of 38 latitude lines. Each line curves and wobbles as it wraps around the sphere, like the surface of the globe is made of flowing silk. The lines all slowly drift and evolve, creating an ever-changing organic pattern.

The visual has a beautiful depth effect: lines on the back of the globe are barely visible (dim, ghostly), while lines on the front are bright and clear. This makes the globe feel transparent and ethereal.

Wave parameters: each latitude line is displaced vertically by two overlapping sine waves:
- Primary: amplitude 20% of sphere radius, 1.5 waves per circle
- Secondary: amplitude 8% of sphere radius, 2.7 waves per circle at 1.5× speed
This layering creates natural, unpredictable-looking motion.

On hover: the whole surface goes wild — waves grow to nearly 3× their normal depth, making the globe surface look like turbulent water or a stormy sphere. There's also a Gaussian repulsion from the cursor position that pushes lines apart locally.

Dark (#110F0C) and light (#F5F1EA) themes both look beautiful. Show a "Sphere Lines" label and "hover to warp" hint.`,

  'Claude Code': `Create components-workspace/sphere-lines/index.tsx — 'use client' React component, spinning 3D globe with organic wave-distorted latitude lines on <canvas>.

Constants:
  N_LATS=38, N_STEPS=180
  WAVE_AMP=0.20, WAVE_FREQ_T=1.5, WAVE_FREQ_P=2.2, WAVE_SPEED=0.004
  HOVER_BOOST=2.8, LOCAL_AMP=45, LOCAL_RADIUS=150
  ROT_SPEED=0.005, BACK_A=0.07, FRONT_A=0.72

Refs: containerRef<HTMLDivElement>, canvasRef<HTMLCanvasElement>, mouseRef<{x,y}|null>, isDarkRef<boolean>
State: isDark (default true)

Theme detection: same [data-card-theme] / document.documentElement MutationObserver pattern.

Canvas useEffect (once):
  let cw,ch, t=0, rot=0, hoverStr=0, animId, alive=true

  build(): getBoundingClientRect, set canvas dims with dpr, ctx.setTransform(dpr,...)

  frame():
    t+=0.004; rot+=0.005
    hoverStr lerp: ×0.018 attack, ×0.010 release
    R=Math.min(cw,ch)*0.42; cx=cw/2; cy=ch/2
    waveAmp = R*WAVE_AMP*(1+hoverStr*HOVER_BOOST)

    ctx.save() → ctx.arc(cx,cy,R,0,2π) → ctx.clip()

    Reuse Float32Arrays xs,ys,zs[N_STEPS+1] (allocate once outside loop or per frame)

    For i=0..N_LATS-1:
      phi=-π/2+(i+1)*π/(N_LATS+1); cosP=cos(phi); sinP=sin(phi)
      For j=0..N_STEPS:
        tR=j*2π/N_STEPS+rot
        wave=waveAmp*(sin(tR*1.5+phi*2.2+t)+0.4*sin(tR*2.7+phi*2.86+t*1.5))
        x3=R*cosP*cos(tR), y3=R*sinP+wave, z3=R*cosP*sin(tR)
        x2=cx+x3, y2=cy-y3
        Gaussian push: LOCAL_AMP*exp(-dd²/(LOCAL_RADIUS²×0.5)), guard dd²<LOCAL_RADIUS²×4
        xs[j]=x2+push_x, ys[j]=y2+push_y, zs[j]=z3

      Back pass: rgba(dotRGB,0.07), lw=0.5, full lineTo loop, stroke
      Front pass: rgba(dotRGB,0.72), lw=0.8
        Loop j: z≥0 → moveTo on entry, quadraticCurveTo via midpoints; z<0 → reset inFront
        ctx.lineTo(prevX,prevY) at end if still inFront; stroke

    ctx.restore()
    requestAnimationFrame(frame)

  ResizeObserver on canvas.parentElement; cleanup RAF+RO.

JSX: div containerRef, bg=#110F0C/#F5F1EA, mouse/touch handlers.
  canvas absolute inset-0 100%×100%.
  Centred: "Sphere Lines" (22px 700) + "hover to warp" (11px 600 uppercase).
  Export: export function SphereLines(). No 'any'.`,

  Cursor: `// components-workspace/sphere-lines/index.tsx
// 3D spinning globe — latitude lines with organic wave distortion

'use client'

/**
 * CONSTANTS
 * N_LATS=38, N_STEPS=180
 * WAVE_AMP=0.20 (fraction of R), WAVE_FREQ_T=1.5, WAVE_FREQ_P=2.2, WAVE_SPEED=0.004
 * HOVER_BOOST=2.8, LOCAL_AMP=45px, LOCAL_RADIUS=150px
 * ROT_SPEED=0.005 rad/frame, BACK_A=0.07, FRONT_A=0.72
 *
 * ARCHITECTURE
 * - Refs: containerRef, canvasRef, mouseRef ({x,y}|null), isDarkRef
 * - State: isDark
 * - Theme: MutationObserver on [data-card-theme] + <html class="dark">
 * - Canvas useEffect (once):
 *     Vars: cw,ch, t=0, rot=0, hoverStr=0, animId, alive=true
 *     build(): resize canvas with dpr
 *     frame():
 *       t+=0.004; rot+=0.005
 *       hoverStr lerp (0.018 / 0.010)
 *       R=min(cw,ch)*0.42; cx=cw/2; cy=ch/2
 *       waveAmp=R*WAVE_AMP*(1+hoverStr*HOVER_BOOST)
 *       ctx.save → arc clip at R
 *       For each latitude i:
 *         phi=-π/2+(i+1)*π/(N_LATS+1)
 *         For each j: tR=j*2π/N_STEPS+rot
 *           wave=waveAmp*(sin(tR*1.5+phi*2.2+t)+0.4*sin(tR*2.7+phi*2.86+t*1.5))
 *           x3=R*cosP*cos(tR), y3=R*sinP+wave, z3=R*cosP*sin(tR)
 *           project x2=cx+x3, y2=cy-y3, apply Gaussian cursor repulsion
 *           store in xs,ys,zs Float32Arrays
 *         Back: full lineTo loop at dim alpha
 *         Front: quadratic midpoint curves where zs[j]>=0, bright alpha
 *       ctx.restore()
 *       RAF → frame
 *     ResizeObserver → build; cleanup: cancelRAF + RO.disconnect
 *
 * JSX: div bg, canvas, centred label "Sphere Lines" + "hover to warp"
 * Export: export function SphereLines(). No 'any'.
 */
`,
}
