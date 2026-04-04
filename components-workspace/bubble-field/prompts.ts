import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a full-size interactive canvas background called "Bubble Field". It fills its container and renders hundreds of small outlined circles scattered randomly across the surface.

When the user hovers, circles near the cursor burst outward and fade simultaneously — they grow larger and become more transparent at the same time, creating a soap-bubble expansion effect. Moving away causes them to slowly contract back to their resting state.

Design details:
- Place circles randomly using a density of 1 per 250px² (capped at 3000 total)
- Resting state: radius 3px, opacity 0.22, stroke-only (no fill), stroke width 0.5px
- Burst state: radius grows up to 3 + 16 = 19px, opacity falls to near zero (BASE_A × (1 − b × 0.88))
- The brightness value "b" tracks how excited each bubble is (0 = resting, 1 = fully burst)
- Hover influence radius: 200px. Use a Gaussian falloff: b_target = exp(−dist² / (200² × 0.25))
- Asymmetric lerp: fast attack (factor 0.16) on approach, slow release (factor 0.07) on retreat
- Clamp b to 0 when it drops below 0.004 to avoid unnecessary redraws
- Support both dark mode (white circles on #110F0C background) and light mode (dark circles #1C1916 on #F5F1EA background)
- Use canvas 2D API, scale for devicePixelRatio, handle resize with ResizeObserver
- Show a centred label "Bubble Field" (22px, bold) with a small-caps hint "hover to burst" (11px, uppercase) beneath it`,

  Bolt: `Build a React component <BubbleField /> using the HTML Canvas 2D API. The component fills its container with randomly placed outline circles that burst open when hovered.

Constants:
  DENSITY = 1/250      // circles per px²
  MAX_DOTS = 3000
  RADIUS = 200         // hover influence radius px
  BASE_R = 3           // resting circle radius px
  BURST_R = 16         // max additional radius on burst
  BASE_A = 0.22        // resting opacity
  FADE_FACTOR = 0.88   // opacity multiplier at peak burst

Data: Array of { x, y, b } where b ∈ [0,1] is burst intensity.

Each animation frame:
1. For each bubble, compute dist² to mouse
2. target_b = dist² < RADIUS² ? exp(−dist² / (RADIUS² × 0.25)) : 0
3. b += (target_b > b ? 0.16 : 0.07) × (target_b − b)  // asymmetric lerp
4. if b < 0.004: b = 0
5. Draw: radius = BASE_R + b × BURST_R, alpha = BASE_A × (1 − b × FADE_FACTOR)
6. ctx.arc(x, y, radius, 0, 2π) — stroke only, lineWidth 0.5

Theme: dark (white strokes, #110F0C bg) / light (rgb(28,25,22) strokes, #F5F1EA bg) — detect via document.documentElement.classList or a [data-card-theme] ancestor.
DPR: canvas.width = Math.round(clientWidth × dpr), ctx.setTransform(dpr,0,0,dpr,0,0).
Resize: ResizeObserver on canvas.parentElement, rebuilds bubble array on size change.
Cleanup: cancelAnimationFrame on unmount, disconnect ResizeObserver.
Overlay: centred "Bubble Field" label (22px/700) and "HOVER TO BURST" hint (11px/600, letter-spacing 0.12em, uppercase).`,

  Lovable: `I want a canvas animation component called BubbleField. The canvas is covered in small transparent circles, and when I hover my mouse over it, the circles near my cursor pop outward like soap bubbles — they swell up and fade out at the same time. Moving my cursor away makes them slowly shrink back.

Here's how it should behave:
- Circles are randomly placed, roughly one per 250 square pixels (max 3000 on large screens)
- At rest each circle has a 3px radius and 22% opacity, drawn as just an outline (no fill)
- When my cursor is within 200px, a circle "lights up" based on Gaussian distance falloff
- A lit circle expands up to 19px radius while its opacity drops toward zero — the more it expands, the more it fades
- It responds quickly when I approach (snappy attack) and relaxes slowly when I move away (lazy release)
- Works in dark mode (white circles on very dark background #110F0C) and light mode (near-black circles on warm cream #F5F1EA)
- No fill, just the stroke outline so you can see through them as they expand
- Show the text "Bubble Field" in the center with a small "HOVER TO BURST" hint below it
- Handle window resizes and high-DPI screens correctly`,

  'Claude Code': `Create components-workspace/bubble-field/index.tsx with 'use client' at top.

Export: export function BubbleField()

Constants (module-level):
  const DENSITY = 1 / 250
  const MAX_DOTS = 3000
  const RADIUS = 200
  const BASE_R = 3
  const BURST_R = 16
  const BASE_A = 0.22
  const FADE_FACTOR = 0.88

Type: type Bubble = { x: number; y: number; b: number }

Refs: containerRef (div), canvasRef (canvas), mouseRef ({ x,y }|null), isDarkRef (boolean), plus useState isDark.

Theme detection (useEffect):
  - el.closest('[data-card-theme]') → check classList.contains('dark')
  - Fallback: document.documentElement.classList.contains('dark')
  - MutationObserver on both documentElement and the card wrapper if present

Canvas loop (useEffect, no deps):
  build():
    dpr = devicePixelRatio || 1
    canvas size = clientBoundingRect × dpr; setTransform(dpr,0,0,dpr,0,0)
    count = min(round(cw × ch × DENSITY), MAX_DOTS)
    bubbles = Array.from({length: count}, () => ({ x: random×cw, y: random×ch, b: 0 }))

  frame():
    clearRect
    mx/my from mouseRef (default -99999)
    dotRGB = isDarkRef ? '255,255,255' : '28,25,22'
    for each bub:
      dist2 = (bub.x-mx)²+(bub.y-my)²
      tgt = dist2 < RADIUS² ? exp(-dist2/(RADIUS²×0.25)) : 0
      bub.b += (tgt>bub.b ? 0.16 : 0.07)×(tgt-bub.b)
      if bub.b < 0.004: bub.b = 0
      r = BASE_R + bub.b × BURST_R
      alpha = BASE_A × (1 - bub.b × FADE_FACTOR)
      strokeStyle = rgba(dotRGB, alpha.toFixed(3))
      lineWidth = 0.5
      arc(bub.x, bub.y, r, 0, Math.PI*2); stroke()
    animId = requestAnimationFrame(frame)

  build(); frame()
  ResizeObserver on canvas.parentElement! → calls build()
  Cleanup: alive=false, cancelAnimationFrame, ro.disconnect()

Mouse handlers: updateMouse(clientX, clientY) → subtract rect.left/top → mouseRef.current
Events on root div: onMouseMove, onMouseLeave (null), onTouchMove (touches[0]), onTouchEnd (null)

JSX:
  Root div: ref=containerRef, "relative h-full w-full overflow-hidden", style background from isDark
  Canvas: ref=canvasRef, "absolute inset-0", style width/height 100%
  Overlay div: pointer-events-none, absolute inset-0, flex col center, gap-2
    span: "Bubble Field", fontSize 22, fontWeight 700, letterSpacing -0.02em
    span: "hover to burst", fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em

bg = isDark ? '#110F0C' : '#F5F1EA'
labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(28,25,22,0.45)'
hintColor  = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(28,25,22,0.22)'`,

  Cursor: `Implement a React canvas component BubbleField (components-workspace/bubble-field/index.tsx).

Architecture: identical to a noise-dot background but renders circles instead of square pixels or lines.

Rendering model:
  - Scatter N = min(floor(W×H / 250), 3000) bubbles at random (x,y) on canvas resize
  - Each bubble carries a brightness scalar b ∈ [0,1], initially 0
  - Per frame, for each bubble compute Gaussian excitation from mouse:
      tgt = (dist² < R²) ? Math.exp(-dist² / (R² × 0.25)) : 0   where R=200
  - Asymmetric lerp: b += (tgt>b ? 0.16 : 0.07) * (tgt-b); clamp to 0 when b<0.004
  - Draw as stroke arc: radius = 3 + b×16, alpha = 0.22×(1 - b×0.88)
  - strokeStyle = rgba(dotRGB, alpha), lineWidth = 0.5 — NO fill, outline only

The burst mechanic: as b increases, the circle both expands AND becomes more transparent, creating a soap-bubble pop effect. At b=1 the circle is 19px wide but nearly invisible.

Canvas setup:
  - DPR scaling: canvas pixel size = logical size × devicePixelRatio, ctx.setTransform(dpr,0,0,dpr,0,0)
  - ResizeObserver on canvas.parentElement → rebuild bubble array (positions reset)
  - RAF loop with alive guard for cleanup

Theme (dual):
  - Dark: bg '#110F0C', dotRGB '255,255,255'
  - Light: bg '#F5F1EA', dotRGB '28,25,22'
  - Detect via [data-card-theme] ancestor first, then document.documentElement class
  - isDarkRef (mutable, for RAF closure) + isDark state (for JSX re-render)
  - MutationObserver watches both documentElement and card wrapper

Touch: mirror mouse events via e.touches[0]

Overlay: centered text "Bubble Field" (22px/700) + "HOVER TO BURST" (11px/600/uppercase/ls 0.12em)
No Framer Motion needed — pure canvas RAF loop.
TypeScript: no any types, type Bubble = { x: number; y: number; b: number }`,
}
