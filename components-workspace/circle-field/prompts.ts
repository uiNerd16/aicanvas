import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create components-workspace/circle-field/index.tsx — a 'use client' React component.

\`\`\`ts
const DENSITY      = 1 / 250
const MAX_DOTS     = 3000
const RADIUS       = 200
const BASE_R       = 3
const BASE_A_DARK  = 0.18
const BASE_A_LIGHT = 0.28
const PEAK_A       = 0.65

type Circle = { x: number; y: number; b: number }
\`\`\`

export function CircleField() — structure:
- containerRef: HTMLDivElement, canvasRef: HTMLCanvasElement, mouseRef: {x,y}|null, isDarkRef: boolean
- isDark state + setIsDark for background/label color switching

Theme detection useEffect:
  el.closest('[data-card-theme]') → check classList.contains('dark')
  Fallback: document.documentElement.classList.contains('dark')
  MutationObserver on both documentElement and cardWrapper (attributeFilter: ['class'])

Canvas useEffect:
  build():
    dpr = devicePixelRatio || 1
    BoundingClientRect → cw, ch
    canvas.width = round(cw*dpr), canvas.height = round(ch*dpr)
    ctx.setTransform(dpr,0,0,dpr,0,0)
    circles = count random {x,y,b:0} where count = min(round(cw*ch*DENSITY), MAX_DOTS)

  frame():
    clearRect; mx/my from mouseRef (-99999 when null)
    dotRGB = isDarkRef ? '255,255,255' : '28,25,22'
    baseA  = isDarkRef ? BASE_A_DARK  : BASE_A_LIGHT
    per circle:
      dist2 = (x-mx)²+(y-my)²
      tgt = dist2 < RADIUS² ? exp(-dist2/(RADIUS²×0.25)) : 0
      b += (tgt>b ? 0.16 : 0.07)*(tgt-b); if b<0.004 b=0
      alpha = baseA + (PEAK_A-baseA)*b
      if b>0.02: arc(x,y,1.5) stroke rgba(dotRGB, b*0.50)
      if b>0.02: arc(x,y,7)   stroke rgba(dotRGB, b*0.40)
      always:    arc(x,y,3)   stroke rgba(dotRGB, alpha)
      all lineWidth=0.5
    requestAnimationFrame(frame)

  ResizeObserver on canvas.parentElement → build()
  Cleanup: alive=false, cancelAnimationFrame, ro.disconnect()

JSX:
  root div: relative h-full w-full overflow-hidden, style background=bg
  canvas: absolute inset-0, 100% w/h
  overlay: centered "Circle Field" (22px 700) + "hover to illuminate" (11px 600 uppercase tracking-wider)
  bg = isDark ? '#110F0C' : '#F5F1EA'`,
}
