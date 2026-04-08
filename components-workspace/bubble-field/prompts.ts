import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a full-size interactive canvas background called "Bubble Field". It fills its container with a regular grid of small outlined circles spaced every 20px. When the user hovers, the circles near the cursor play a 3-stage burst animation cycle: expand outward and fade → momentarily disappear → reform from nothing back into the grid. The cycle is per-bubble and out of phase, so neighbouring bubbles are at different stages of their burst at any given moment.

Constants:
- SPACING = 20px between circle centres (grid layout, not random)
- RADIUS = 200px (cursor influence radius)
- BASE_R = 1.5px (resting circle radius)
- BURST_R = 16px (peak expansion added during burst)
- BASE_A_DARK = 0.55 (resting opacity, dark mode)
- BASE_A_LIGHT = 0.75 (resting opacity, light mode)

Each bubble carries two values: \`b\` (excitation, 0–1) and \`phase\` (cycle position, 0–1, randomised on creation).

Per frame:
1. For each bubble, compute Gaussian excitation from cursor:
     tgt = dist² < RADIUS² ? exp(-dist² / (RADIUS² × 0.25)) : 0
2. Asymmetric lerp on b: \`b += (tgt > b ? 0.16 : 0.07) × (tgt - b)\`. Clamp to 0 when b < 0.004.
3. If \`b > 0.08\`, advance the phase: \`phase = (phase + 0.025 × b) % 1\` (advances faster the more excited the bubble).
4. Draw based on b and phase:
   - Resting (b ≤ 0.08): simple stroke arc at radius BASE_R, alpha = baseA
   - Burst expanding (b > 0.08, phase < 0.55): t = phase/0.55; radius = BASE_R + t × BURST_R; alpha = baseA × (1 - t)
   - Burst popped (0.55 ≤ phase < 0.72): draw nothing — the bubble is invisible
   - Reforming (phase ≥ 0.72): t = (phase - 0.72)/0.28; radius = BASE_R × t; alpha = baseA × t
- Stroke only (no fill), lineWidth 0.5

Support both dark mode (white circles on #110F0C background) and light mode (rgb(28,25,22) circles on #F5F1EA background). Use canvas 2D API, scale for devicePixelRatio, handle resize with ResizeObserver. Show a centred label "Bubble Field" (22px, 700) with a small-caps hint "hover to burst" (11px, 600 uppercase) beneath it.`,

  Bolt: `Build a React component <BubbleField /> using the HTML Canvas 2D API. The component fills its container with a regular grid of outline circles that play a 3-stage burst cycle when hovered.

Constants:
  SPACING      = 20    // px between circle centres (grid)
  RADIUS       = 200   // hover influence radius (px)
  BASE_R       = 1.5   // resting radius
  BURST_R      = 16    // peak burst expansion
  BASE_A_DARK  = 0.55
  BASE_A_LIGHT = 0.75

Type: type Bubble = { x: number; y: number; b: number; phase: number }

Build (called on resize):
  cols = Math.floor(cw / SPACING) + 2
  rows = Math.floor(ch / SPACING) + 2
  ox   = (cw % SPACING) / 2
  oy   = (ch % SPACING) / 2
  bubbles = []
  for r in 0..rows-1, for c in 0..cols-1:
    bubbles.push({ x: ox + c*SPACING, y: oy + r*SPACING, b: 0, phase: Math.random() })

Each animation frame:
1. For each bubble, dist² to mouse
2. tgt = dist² < RADIUS² ? exp(-dist² / (RADIUS² × 0.25)) : 0
3. b += (tgt > b ? 0.16 : 0.07) × (tgt - b)        // asymmetric lerp (fast attack, slow release)
4. if b < 0.004: b = 0
5. if b > 0.08: phase = (phase + 0.025 * b) % 1     // advance only when excited
6. Draw:
   - if b > 0.08:                                    // BURST cycle
       if phase < 0.55:                                // expanding + fading
         t = phase / 0.55
         r = BASE_R + t * BURST_R
         alpha = baseA * (1 - t)
         if alpha > 0.004: stroke arc(x, y, r)
       else if phase < 0.72:                          // popped — nothing drawn
         (skip)
       else:                                           // reforming (0.72 → 1.0)
         t = (phase - 0.72) / 0.28
         r = BASE_R * t
         alpha = baseA * t
         if r > 0.2 && alpha > 0.004: stroke arc(x, y, r)
   - else:                                             // RESTING
       stroke arc(x, y, BASE_R), alpha = baseA
   ctx.lineWidth = 0.5 throughout

Theme: dark (white strokes on #110F0C bg, baseA=0.55) / light (rgb(28,25,22) strokes on #F5F1EA bg, baseA=0.75) — detect via [data-card-theme] ancestor first, then document.documentElement.classList.contains('dark'), with MutationObserver on both.
DPR: canvas.width = round(clientWidth × dpr), ctx.setTransform(dpr,0,0,dpr,0,0).
Resize: ResizeObserver on canvas.parentElement → rebuild bubble array.
Cleanup: cancelAnimationFrame on unmount, disconnect ResizeObserver.
Overlay: centred "Bubble Field" label (22px/700, letter-spacing -0.02em) and "hover to burst" hint (11px/600, letter-spacing 0.12em, uppercase).`,

  Lovable: `I want a canvas animation component called BubbleField. The canvas is covered in a regular grid of small outlined circles spaced 20 pixels apart, and when I hover my mouse over it the circles near my cursor play a soap-bubble life cycle: each one expands outward while fading, then disappears for a moment, then reforms back into the grid. Because each circle starts at a random point in its cycle, neighbouring bubbles are always at different stages — the field looks alive and irregular even though the underlying grid is uniform.

Behaviour details:
- Each circle has two states: an excitation value (0 = calm, 1 = fully aroused) and a phase that walks through its burst cycle
- At rest a circle is just a 1.5px outlined dot at 55% opacity in dark mode (75% in light mode)
- The cursor's influence reaches 200px with a Gaussian falloff
- Excitation responds quickly when I approach (snappy attack) and decays slowly when I move away (lazy release)
- Once a circle is "excited enough" (excitation > 0.08), its phase starts advancing — the more excited, the faster the cycle
- The burst cycle has three stages: roughly 55% expanding-and-fading (radius grows from 1.5 to 17.5px while opacity falls to zero), 17% completely invisible, then 28% reforming back into existence (radius and opacity both ramp up from zero)
- Stroke only — no fill — so the bubbles look hollow

Works in dark mode (white circles on very dark #110F0C background) and light mode (near-black circles on warm cream #F5F1EA). Show "Bubble Field" centred with a small uppercase "hover to burst" hint below. Handle window resizes and high-DPI screens correctly.`,

  'Claude Code': `Create components-workspace/bubble-field/index.tsx with 'use client' at top.

Export: export function BubbleField()

Constants (module-level):
  const SPACING      = 20
  const RADIUS       = 200
  const BASE_R       = 1.5
  const BURST_R      = 16
  const BASE_A_DARK  = 0.55
  const BASE_A_LIGHT = 0.75

Type: type Bubble = { x: number; y: number; b: number; phase: number }

Refs: containerRef (div), canvasRef (canvas), mouseRef ({x,y}|null), isDarkRef (boolean)
State: isDark (boolean, default true)

Theme detection (useEffect):
  - el.closest('[data-card-theme]') → check classList.contains('dark')
  - Fallback: document.documentElement.classList.contains('dark')
  - MutationObserver on both documentElement and the card wrapper if present

Canvas useEffect (no deps):
  let bubbles: Bubble[] = []
  let animId = 0, alive = true, cw = 0, ch = 0

  build():
    dpr = devicePixelRatio || 1
    canvas size = clientBoundingRect × dpr; setTransform(dpr,0,0,dpr,0,0)
    cols = Math.floor(cw / SPACING) + 2
    rows = Math.floor(ch / SPACING) + 2
    ox = (cw % SPACING) / 2
    oy = (ch % SPACING) / 2
    bubbles = []
    for r 0..rows-1, c 0..cols-1:
      bubbles.push({ x: ox + c*SPACING, y: oy + r*SPACING, b: 0, phase: Math.random() })

  frame():
    clearRect
    mx/my from mouseRef (default -99999)
    r2 = RADIUS * RADIUS
    dotRGB = isDarkRef ? '255,255,255' : '28,25,22'
    baseA  = isDarkRef ? BASE_A_DARK : BASE_A_LIGHT

    for each bub:
      dist2 = (bub.x-mx)² + (bub.y-my)²
      tgt = dist2 < r2 ? Math.exp(-dist2 / (r2 * 0.25)) : 0
      bub.b += (tgt > bub.b ? 0.16 : 0.07) * (tgt - bub.b)
      if bub.b < 0.004: bub.b = 0

      if bub.b > 0.08:
        bub.phase = (bub.phase + 0.025 * bub.b) % 1

      const p = bub.phase

      if bub.b > 0.08:
        if p < 0.55:
          t = p / 0.55
          r = BASE_R + t * BURST_R
          alpha = baseA * (1 - t)
          if alpha > 0.004:
            strokeStyle = rgba(dotRGB, alpha.toFixed(3))
            lineWidth = 0.5
            beginPath; arc(bub.x, bub.y, r, 0, 2π); stroke
        else if p < 0.72:
          // popped — draw nothing
        else:
          t = (p - 0.72) / 0.28
          r = BASE_R * t
          alpha = baseA * t
          if r > 0.2 && alpha > 0.004:
            strokeStyle = rgba(dotRGB, alpha.toFixed(3))
            lineWidth = 0.5
            beginPath; arc(bub.x, bub.y, r, 0, 2π); stroke
      else:
        strokeStyle = rgba(dotRGB, baseA.toFixed(3))
        lineWidth = 0.5
        beginPath; arc(bub.x, bub.y, BASE_R, 0, 2π); stroke

    animId = requestAnimationFrame(frame)

  build(); frame()
  ResizeObserver on canvas.parentElement! → calls build()
  Cleanup: alive=false, cancelAnimationFrame(animId), ro.disconnect()

Mouse handlers: updateMouse(clientX, clientY) → subtract rect.left/top → mouseRef.current
Events on root div: onMouseMove, onMouseLeave (null), onTouchMove (touches[0]), onTouchEnd (null)

JSX:
  Root div: ref=containerRef, "relative h-full w-full overflow-hidden", style={{ background: bg }}
  Canvas: ref=canvasRef, "absolute inset-0", style={{ width: '100%', height: '100%' }}
  Overlay div: pointer-events-none, absolute inset-0, flex col center, gap-2
    span: "Bubble Field", fontSize 22, fontWeight 700, letterSpacing -0.02em
    span: "hover to burst", fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em

bg         = isDark ? '#110F0C' : '#F5F1EA'
labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(28,25,22,0.45)'
hintColor  = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(28,25,22,0.22)'

No 'any' types.`,

  Cursor: `Implement a React canvas component BubbleField (components-workspace/bubble-field/index.tsx).

Architecture: a regular grid of outlined circles that each play an independent 3-stage burst cycle when the cursor approaches.

Rendering model:
  - Build a grid of bubbles every SPACING=20px (cols/rows = floor(dim/SPACING)+2, centred via ox/oy = (dim%SPACING)/2)
  - Each bubble: { x, y, b, phase } where b ∈ [0,1] is excitation and phase ∈ [0,1) is randomised on creation
  - Per frame, for each bubble compute Gaussian excitation from mouse:
      tgt = (dist² < R²) ? Math.exp(-dist² / (R² × 0.25)) : 0   where R=200
  - Asymmetric lerp: b += (tgt > b ? 0.16 : 0.07) * (tgt - b); clamp to 0 when b < 0.004
  - When b > 0.08, advance phase: phase = (phase + 0.025 * b) % 1 (faster the higher b is)

Drawing per bubble:
  if b > 0.08:                                       // BURST
    p = phase
    if p < 0.55:                                       // expanding + fading
      t = p / 0.55
      r = BASE_R + t * BURST_R                         // 1.5 → 17.5
      alpha = baseA * (1 - t)
      stroke arc if alpha > 0.004
    else if p < 0.72:                                  // popped — invisible
      // nothing
    else:                                              // reforming
      t = (p - 0.72) / 0.28
      r = BASE_R * t
      alpha = baseA * t
      stroke arc if r > 0.2 && alpha > 0.004
  else:                                              // RESTING
    stroke arc at BASE_R, alpha = baseA

  strokeStyle = rgba(dotRGB, alpha), lineWidth = 0.5 — NO fill, outline only

Constants:
  SPACING=20, RADIUS=200, BASE_R=1.5, BURST_R=16
  BASE_A_DARK=0.55, BASE_A_LIGHT=0.75

Canvas setup:
  - DPR scaling: canvas pixel size = logical size × devicePixelRatio, ctx.setTransform(dpr,0,0,dpr,0,0)
  - ResizeObserver on canvas.parentElement → rebuild bubble array
  - RAF loop with alive guard for cleanup

Theme (dual):
  - Dark: bg '#110F0C', dotRGB '255,255,255', baseA = 0.55
  - Light: bg '#F5F1EA', dotRGB '28,25,22', baseA = 0.75
  - Detect via [data-card-theme] ancestor first, then document.documentElement class
  - isDarkRef (mutable, for RAF closure) + isDark state (for JSX re-render)
  - MutationObserver watches both documentElement and card wrapper

Touch: mirror mouse events via e.touches[0]

Overlay: centered text "Bubble Field" (22px/700/letter-spacing -0.02em) + "hover to burst" (11px/600/uppercase/letter-spacing 0.12em)
No Framer Motion — pure canvas RAF loop.
TypeScript: no any types, type Bubble = { x: number; y: number; b: number; phase: number }`,
}
