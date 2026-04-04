import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a full-size interactive canvas background called "CircleField". It fills its container with randomly placed outline-only circles that respond to mouse hover with a glowing Gaussian falloff effect.

How it works:
- Scatter roughly 1 circle per 250px² across the canvas (capped at 3000 circles). Each circle has an x, y position and a brightness value b that starts at 0.
- On every animation frame, calculate each circle's distance to the cursor. If it's within a 200px radius, compute a Gaussian target brightness: exp(-dist² / (200² × 0.25)). Otherwise the target is 0.
- Animate b toward its target: add 16% of the gap when brightening, 7% when dimming. Zero out b when it drops below 0.004.
- Draw three concentric strokes per circle (all using ctx.arc + ctx.stroke, no fills):
  1. Inner ring at radius 1.5px — only when b > 0.02, alpha = b × 0.50
  2. Outer ring at radius 7px — only when b > 0.02, alpha = b × 0.40
  3. Base circle at radius 3px — always drawn, alpha = baseAlpha + (0.65 − baseAlpha) × b
- All strokes use lineWidth 0.5.
- Dark mode: white strokes (255,255,255), baseAlpha 0.18, background #110F0C
- Light mode: dark strokes (28,25,22), baseAlpha 0.28, background #F5F1EA
- Detect theme via MutationObserver watching the .dark class on <html> (or a [data-card-theme] ancestor wrapper).
- Support touch events (touchmove / touchend) in addition to mouse events.
- Use ResizeObserver to rebuild the circle array when the container resizes.
- Show a centred overlay label "Circle Field" (22px, bold) with "hover to illuminate" below it in small caps (11px).`,

  Bolt: `Build a React component <CircleField /> using an HTML canvas for a particle field of outline circles with interactive Gaussian illumination.

Constants:
  DENSITY = 1/250, MAX_DOTS = 3000, RADIUS = 200
  BASE_R = 3, BASE_A_DARK = 0.18, BASE_A_LIGHT = 0.28, PEAK_A = 0.65

Data type: { x: number, y: number, b: number } — b is per-circle brightness (0–1).

Setup:
- On mount, measure canvas.getBoundingClientRect(), set canvas.width/height with devicePixelRatio, apply ctx.setTransform(dpr,0,0,dpr,0,0).
- Generate Math.min(round(cw × ch × DENSITY), MAX_DOTS) circles at random (x, y) with b = 0.

Animation loop (requestAnimationFrame):
- Per circle: dist² = (x−mx)²+(y−my)²; tgt = dist² < RADIUS² ? exp(−dist²/(RADIUS²×0.25)) : 0
- b += (tgt > b ? 0.16 : 0.07) × (tgt − b); if b < 0.004 set b = 0
- Draw (all ctx.arc + ctx.stroke, lineWidth 0.5, no fills):
    if b > 0.02 → inner ring r=1.5, alpha = b×0.50
    if b > 0.02 → outer ring r=7,   alpha = b×0.40
    always      → base circle r=3,  alpha = baseA + (0.65−baseA)×b

Theme:
- isDarkRef tracks .dark on <html> via MutationObserver; also watch [data-card-theme] ancestor.
- Dark: dotRGB='255,255,255', bg='#110F0C'; Light: dotRGB='28,25,22', bg='#F5F1EA'

Events: onMouseMove, onMouseLeave, onTouchMove, onTouchEnd → update mouseRef (coords relative to canvas).
ResizeObserver on canvas.parentElement → rebuild circles.
Cleanup: cancelAnimationFrame, ro.disconnect(), observer.disconnect().
Overlay: "Circle Field" + "hover to illuminate" centered, pointer-events-none.`,

  Lovable: `Create a beautiful interactive background component called CircleField. Imagine a dark canvas filled with hundreds of small outline circles. When you move your mouse over it, the circles near your cursor light up with a soft, glowing halo effect — like passing a torch through a field of rings.

The effect details:
- Fill the canvas with ~1 circle per 250 square pixels (max 3000 circles), placed at random positions.
- Each circle is drawn as a thin stroke (no fill), 3px radius, with 0.5px line width.
- When illuminated by the cursor (within 200px), two extra concentric rings appear around each circle: a tiny inner ring at 1.5px radius and a wider outer halo at 7px radius. These fade in and out smoothly.
- The glow follows a Gaussian bell curve — brightest directly under the cursor, fading to nothing at the 200px edge.
- Circles brighten quickly (16% per frame toward target) and dim more slowly (7% per frame).

Styling:
- Dark mode: near-black background (#110F0C), white circle strokes at low base opacity (0.18), peaking at 0.65 when fully lit.
- Light mode: warm off-white background (#F5F1EA), dark strokes at base opacity 0.28, peaking at 0.65.
- Show a subtle centered label "Circle Field" with "hover to illuminate" in small caps beneath it.
- The component should fill 100% of its container and look great in both light and dark themes.
- Detect the current theme by watching the .dark class on the <html> element (or a [data-card-theme] wrapper).`,

  'Claude Code': `Create components-workspace/circle-field/index.tsx — a 'use client' React component.

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

  Cursor: `Implement a Canvas2D interactive particle component: CircleField.

File: components-workspace/circle-field/index.tsx
Directive: 'use client'
Export: export function CircleField()

--- Constants ---
DENSITY=1/250, MAX_DOTS=3000, RADIUS=200, BASE_R=3
BASE_A_DARK=0.18, BASE_A_LIGHT=0.28, PEAK_A=0.65

--- Type ---
type Circle = { x: number; y: number; b: number }

--- Refs ---
containerRef<HTMLDivElement>, canvasRef<HTMLCanvasElement>
mouseRef<{x:number,y:number}|null> (canvas-relative coordinates)
isDarkRef<boolean>, isDark state

--- Theme useEffect ---
Watch .dark on document.documentElement and nearest [data-card-theme] ancestor via MutationObserver.
Update both isDarkRef.current and setIsDark().

--- Canvas useEffect ---
build():
  Apply DPR scaling. Compute count = min(⌊cw×ch×DENSITY⌋, MAX_DOTS).
  Reset circles array: random x∈[0,cw], y∈[0,ch], b=0.

frame() per-circle logic:
  tgt = dist² < RADIUS² ? Math.exp(-dist²/(RADIUS²×0.25)) : 0
  b += lerp factor × (tgt - b)  // 0.16 brightening, 0.07 dimming
  Clamp: if b < 0.004 → b = 0

Draw order per circle (lineWidth=0.5 throughout, ctx.arc+ctx.stroke, NO fillStyle):
  1. b>0.02 → arc r=1.5, strokeStyle rgba(dotRGB, b×0.50)
  2. b>0.02 → arc r=7,   strokeStyle rgba(dotRGB, b×0.40)
  3. always  → arc r=3,  strokeStyle rgba(dotRGB, baseA+(PEAK_A−baseA)×b)

Dark: dotRGB='255,255,255', baseA=0.18, bg='#110F0C'
Light: dotRGB='28,25,22',   baseA=0.28, bg='#F5F1EA'

ResizeObserver → rebuild; cleanup alive guard + cancelAnimationFrame + ro.disconnect()

--- JSX ---
Root: relative h-full w-full overflow-hidden, inline bg style
Canvas: absolute inset-0 100%×100%
Mouse/touch handlers → updateMouse(clientX-rect.left, clientY-rect.top); onLeave/End → null
Overlay (pointer-events-none): "Circle Field" 22px/700wt + "hover to illuminate" 11px/600wt uppercase`,
}
