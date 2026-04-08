import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create components-workspace/sphere-lines/index.tsx — 'use client' React component, spinning 3D globe with organic wave-distorted latitude lines on <canvas>.

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
}
