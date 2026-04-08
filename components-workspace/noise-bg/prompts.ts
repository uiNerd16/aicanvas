import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components/noise-bg/index.tsx\` — a React canvas component with these exact specs:

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
}
