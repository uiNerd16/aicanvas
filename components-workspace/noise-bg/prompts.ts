import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a full-screen canvas background called NoiseBg that scatters random dots across the surface and lights them up as the user moves their mouse.

How it works:
- On mount, randomly place dots across the canvas. Use a density of 1 dot per 250 square pixels so the dot count scales naturally with the container size.
- Each dot starts with a low opacity (0.18 in dark mode, 0.28 in light mode) and a resting size of 0.5px.
- When the mouse moves within 130px of a dot, it brightens toward a peak opacity of 0.92 and grows up to 1.2px wide. Use an eased lerp: faster attack (factor 0.16) and slower release (factor 0.07) to feel organic.
- After computing dot positions, find every pair of dots within 35px of each other and cache those pairs. Every animation frame, draw a faint line between any two cached neighbours that are both lit (brightness > 0.05). Line opacity is the minimum brightness of the two dots multiplied by 0.35.
- Support dark mode (dark background #110F0C, white dots) and light mode (light background #F5F1EA, near-black dots #1C1916).
- Overlay a centred label "Noise" with a small "hover to illuminate" hint in small caps below it.
- Handle resize by regenerating dot positions and recomputing neighbour pairs.`,

  Bolt: `Build a React component called NoiseBg using an HTML canvas and requestAnimationFrame.

Constants:
- DENSITY = 1/250 (dots per px²)
- RADIUS = 130 (hover influence px)
- NEIGHBOUR_D = 35 (max pair distance px)
- BASE_A_DARK = 0.18, BASE_A_LIGHT = 0.28, PEAK_A = 0.92

On build (and resize):
1. Set canvas dimensions with devicePixelRatio scaling and ctx.setTransform(dpr,0,0,dpr,0,0).
2. Generate count = Math.round(cw * ch * DENSITY) dots at random positions, each with brightness b=0.
3. Precompute all pairs: loop i=0..n, j=i+1..n; if (dx²+dy² < NEIGHBOUR_D²) push [dots[i], dots[j]] into a pairs array.

Each animation frame:
- For each dot: compute distance² to mouse, set target brightness using Math.pow(1 - dist/RADIUS, 1.5) if within radius else 0. Lerp: b += (tgt>b ? 0.16 : 0.07) * (tgt-b). Zero out if b<0.004. Draw a square: sz = 0.5 + b*0.7, alpha = baseA + (PEAK_A-baseA)*b.
- For each pair: skip if either b < 0.05. Draw a 0.5px line with alpha = min(a.b, b.b) * 0.35.

Use a MutationObserver on [data-card-theme] and document.documentElement for theme toggling. Background: dark=#110F0C, light=#F5F1EA. Overlay a centred "Noise" label and "hover to illuminate" hint.`,

  Lovable: `Design an interactive canvas component called NoiseBg. It fills its container with randomly scattered tiny dots that light up and connect with glowing lines when the user hovers nearby.

The effect:
- Dots are placed randomly at a density of 1 per 250px² so a 480×480 preview holds around 920 dots.
- At rest the dots are very faint — barely visible at 18% opacity in dark mode, 28% in light mode.
- Hovering within 130px of a dot causes it to brighten quickly (it snaps up) and fade slowly when the cursor leaves (it drifts back down). At full brightness it reaches 92% opacity and grows from 0.5px to 1.2px.
- Two dots that are within 35px of each other form a "neighbour pair". These pairs are calculated once when the component loads. During hover, if both dots in a pair are lit, a thin connecting line appears between them — its opacity is based on how bright the dimmer of the two dots is.
- The component supports dark mode (very dark warm background, white dots/lines) and light mode (warm cream background, near-black dots/lines).
- Centre-align a label "Noise" with the hint "hover to illuminate" in small caps below it.
- Regenerate dots and pairs whenever the container is resized.`,

  'Claude Code': `Create \`components/noise-bg/index.tsx\` — a React canvas component with these exact specs:

\`\`\`ts
'use client'
// Constants
const DENSITY     = 1 / 250
const RADIUS      = 130
const NEIGHBOUR_D = 35
const BASE_A_DARK  = 0.18
const BASE_A_LIGHT = 0.28
const PEAK_A      = 0.92

type Dot  = { x: number; y: number; b: number }
type Pair = [Dot, Dot]
\`\`\`

build() — runs on mount and ResizeObserver:
- DPR-aware canvas sizing with ctx.setTransform(dpr,0,0,dpr,0,0)
- Generate Math.round(cw*ch*DENSITY) random dots (b=0)
- O(n²) neighbour pair cache: for i in dots, for j>i in dots, if dist² < NEIGHBOUR_D², push [dots[i], dots[j]]

frame() — requestAnimationFrame loop:
- Clear canvas
- Per dot: dist²→target brightness via pow(1-dist/RADIUS,1.5); lerp b with 0.16 attack/0.07 release; zero if <0.004; fillRect with sz=0.5+b*0.7, alpha=baseA+(PEAK_A-baseA)*b
- Per pair: skip if a.b<0.05 || b.b<0.05; strokeStyle alpha=min(a.b,b.b)*0.35, lineWidth=0.5

Theme detection: MutationObserver watching 'class' on both document.documentElement and the nearest [data-card-theme] ancestor. Use isDarkRef (not state) inside frame() to avoid closure staleness.

Mouse tracking: onMouseMove/onMouseLeave/onTouchMove/onTouchEnd update a mouseRef with canvas-relative coords.

Export: \`export function NoiseBg()\`
Root div: \`className="relative h-full w-full overflow-hidden"\` with inline background.
Canvas: \`className="absolute inset-0"\` with 100% width/height.
Overlay: centred "Noise" label (22px, weight 700) + "hover to illuminate" small caps hint.
Cleanup: cancelAnimationFrame + ResizeObserver.disconnect() + MutationObserver.disconnect().`,

  Cursor: `Build a TypeScript React component \`NoiseBg\` using raw canvas2D and rAF. No external animation libraries.

Architecture:
- useRef for: containerRef (div), canvasRef (canvas), mouseRef ({x,y}|null), isDarkRef (boolean)
- useState only for isDark (drives JSX background/label colors)
- Two effects: one for MutationObserver theme detection, one for the canvas loop

Canvas effect structure:
\`\`\`
let dots: Dot[] = [], pairs: Pair[] = [], animId = 0, alive = true, cw = 0, ch = 0
function build() { /* dpr setup, random dot gen, O(n²) pair cache */ }
function frame() { /* clear, dot brightness lerp + fillRect, pair lines */ }
build(); frame()
const ro = new ResizeObserver(build)
ro.observe(canvas.parentElement!)
return () => { alive=false; cancelAnimationFrame(animId); ro.disconnect() }
\`\`\`

Key maths:
- Dot count: Math.round(cw * ch / 250)
- Brightness target: dist < RADIUS ? Math.pow(1 - dist/RADIUS, 1.5) : 0
- Lerp: b += (tgt > b ? 0.16 : 0.07) * (tgt - b); if (b < 0.004) b = 0
- Dot size: sz = 0.5 + b * 0.7
- Dot alpha: BASE_A + (0.92 - BASE_A) * b  where BASE_A = isDark ? 0.18 : 0.28
- Pair line alpha: Math.min(a.b, b.b) * 0.35, lineWidth 0.5, only when both b > 0.05
- Neighbour threshold: NEIGHBOUR_D = 35px (squared comparison for performance)

Theme: dark bg=#110F0C, light bg=#F5F1EA. dotRGB='255,255,255' dark / '28,25,22' light.
Overlay: "Noise" label + "hover to illuminate" hint, both centered, pointer-events-none.
Resize: ResizeObserver on canvas.parentElement triggers build() which regenerates dots and pairs.`,
}
