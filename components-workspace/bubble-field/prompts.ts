import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`BubbleField\`. Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

A full-bleed HTML canvas filling its parent. A uniform grid of tiny stroked circles. On hover, circles near the cursor burst: expand and fade, briefly vanish, then reform. DPR-aware canvas, requestAnimationFrame, ResizeObserver.

Constants:
\`\`\`
SPACING = 20      // px between centres
RADIUS  = 200     // hover influence radius
BASE_R  = 1.5     // resting radius
BURST_R = 16      // extra radius during burst
BASE_A_DARK  = 0.55
BASE_A_LIGHT = 0.75
\`\`\`

Build grid once: cols = floor(cw/SPACING)+2, rows = floor(ch/SPACING)+2, ox = (cw%SPACING)/2, oy = (ch%SPACING)/2. Each bubble: \`{ x, y, b: 0, phase: Math.random() }\`.

Per-frame loop:
- dist2 = (x-mx)^2 + (y-my)^2
- tgt = dist2 < RADIUS*RADIUS ? Math.exp(-dist2 / (RADIUS*RADIUS*0.25)) : 0
- b += (tgt > b ? 0.16 : 0.07) * (tgt - b); if b < 0.004 b = 0
- if b > 0.08: phase = (phase + 0.025 * b) % 1
- With p = phase:
  - resting (b <= 0.08): stroke circle radius BASE_R at alpha baseA
  - p < 0.55: t = p/0.55; r = BASE_R + t*BURST_R; alpha = baseA*(1-t) (skip if < 0.004)
  - 0.55 <= p < 0.72: draw nothing
  - p >= 0.72: t = (p-0.72)/0.28; r = BASE_R*t; alpha = baseA*t (skip if r <= 0.2 or alpha <= 0.004)
- Every stroke: strokeStyle \`rgba(\${dotRGB},\${alpha.toFixed(3)})\`, lineWidth 0.5. dotRGB = dark ? '255,255,255' : '28,25,22'.

Standard DPR: dpr = devicePixelRatio || 1; canvas.width = round(rect.width*dpr); same for height; ctx.setTransform(dpr,0,0,dpr,0,0). ResizeObserver on canvas.parentElement re-runs build(). Mouse tracked via onMouseMove/onTouchMove on outer div, writing {x: clientX - canvasRect.left, y: clientY - canvasRect.top} to mouseRef. onMouseLeave/onTouchEnd sets mouseRef.current = null. Use sentinel -99999 when null.

Theme detection: walk \`containerRef.current.closest('[data-card-theme]')\`; if found read its \`dark\` class, otherwise read \`document.documentElement.classList.contains('dark')\`. MutationObserver on both for class changes. Mirror into isDarkRef (for the RAF loop) and isDark state (for JSX bg).

JSX: outer div relative h-full w-full overflow-hidden, inline background '#110F0C' dark / '#F5F1EA' light. Canvas absolute inset-0 width/height 100%. Centered pointer-events-none overlay with:
- "Bubble Field" — fontSize 22, fontWeight 700, letterSpacing -0.02em, color rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light
- "hover to burst" — fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em, color rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light

Cleanup: alive=false, cancelAnimationFrame, ro.disconnect, observer.disconnect.`,

  GPT: `Build a React client component named \`BubbleField\`. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Constants
\`\`\`
SPACING = 20
RADIUS  = 200
BASE_R  = 1.5
BURST_R = 16
BASE_A_DARK  = 0.55
BASE_A_LIGHT = 0.75
\`\`\`

## Refs & state
containerRef (div), canvasRef, mouseRef ({x,y}|null initially null), isDarkRef (boolean default true), isDark state (default true).

## Theme detection (effect)
Walk \`containerRef.current.closest('[data-card-theme]')\`; if present use its \`classList.contains('dark')\`, else \`document.documentElement.classList.contains('dark')\`. MutationObserver watches \`attributeFilter: ['class']\` on documentElement and on the card wrapper if present. Updates both isDarkRef and isDark state.

## Canvas setup
\`\`\`
const dpr = window.devicePixelRatio || 1
const rect = canvas.getBoundingClientRect()
cw = rect.width; ch = rect.height
if (!cw || !ch) return
canvas.width = Math.round(cw * dpr)
canvas.height = Math.round(ch * dpr)
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
\`\`\`

## Grid build
\`cols = Math.floor(cw/SPACING) + 2\`; \`rows = Math.floor(ch/SPACING) + 2\`; \`ox = (cw % SPACING) / 2\`; \`oy = (ch % SPACING) / 2\`. Each bubble: \`{ x: ox + c*SPACING, y: oy + r*SPACING, b: 0, phase: Math.random() }\`.

## Per-frame loop
\`\`\`
ctx.clearRect(0, 0, cw, ch)
const mx = mouseRef.current?.x ?? -99999
const my = mouseRef.current?.y ?? -99999
const r2 = RADIUS * RADIUS
const dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'
const baseA  = isDarkRef.current ? 0.55 : 0.75

for each bubble bub:
  dx = bub.x - mx; dy = bub.y - my
  dist2 = dx*dx + dy*dy
  tgt = dist2 < r2 ? Math.exp(-dist2 / (RADIUS*RADIUS*0.25)) : 0
  bub.b += (tgt > bub.b ? 0.16 : 0.07) * (tgt - bub.b)
  if bub.b < 0.004: bub.b = 0
  if bub.b > 0.08:
    bub.phase = (bub.phase + 0.025 * bub.b) % 1
  p = bub.phase

  if bub.b > 0.08:
    if p < 0.55:
      t = p / 0.55
      r = BASE_R + t * BURST_R
      alpha = baseA * (1 - t)
      if alpha > 0.004:
        stroke arc(bub.x, bub.y, r) at rgba(dotRGB, alpha.toFixed(3)), lineWidth 0.5
    else if p < 0.72:
      // invisible gap — draw nothing
    else:
      t = (p - 0.72) / 0.28
      r = BASE_R * t
      alpha = baseA * t
      if r > 0.2 and alpha > 0.004:
        stroke arc(bub.x, bub.y, r) at rgba(dotRGB, alpha.toFixed(3)), lineWidth 0.5
  else:
    stroke arc(bub.x, bub.y, BASE_R) at rgba(dotRGB, baseA.toFixed(3)), lineWidth 0.5

animId = requestAnimationFrame(frame)
\`\`\`

## Resize
ResizeObserver on \`canvas.parentElement\` runs build() (which re-sizes AND rebuilds bubble array).

## Pointer
onMouseMove/onTouchMove on the outer div → mouseRef.current = { x: clientX - canvasRect.left, y: clientY - canvasRect.top }. onMouseLeave/onTouchEnd → mouseRef.current = null.

## JSX structure
\`\`\`tsx
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }} onMouseMove={...} onMouseLeave={...} onTouchMove={...} onTouchEnd={...}>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span style={{ color: labelColor, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Bubble Field</span>
    <span style={{ color: hintColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' }}>hover to burst</span>
  </div>
</div>
\`\`\`
labelColor: rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light. hintColor: rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light.

## Cleanup
\`alive = false\`; cancelAnimationFrame(animId); ro.disconnect(); observer.disconnect().`,

  Gemini: `Implement a React client component named \`BubbleField\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useEffect, useRef, useState } from 'react'
\`\`\`
No framer-motion. This is a pure canvas component.

## API guardrails
USE only: useEffect, useRef, useState, requestAnimationFrame, cancelAnimationFrame, ResizeObserver, MutationObserver, and the CanvasRenderingContext2D 2D API. DO NOT invent \`useCanvas\`, \`useAnimationFrame\`, \`useMotionValue\`, \`useSpringValue\`, or any helper not listed here.

## Concept
Full-bleed canvas with a uniform grid of tiny stroked circles. When the cursor is near a circle it "bursts": expands and fades, disappears briefly, then reforms — an organic popping effect. Supports light and dark themes.

## Constants
\`\`\`
const SPACING = 20
const RADIUS  = 200
const BASE_R  = 1.5
const BURST_R = 16
const BASE_A_DARK  = 0.55
const BASE_A_LIGHT = 0.75
\`\`\`

## Refs & state
\`\`\`
const containerRef = useRef<HTMLDivElement>(null)
const canvasRef    = useRef<HTMLCanvasElement>(null)
const mouseRef     = useRef<{ x: number; y: number } | null>(null)
const isDarkRef    = useRef(true)
const [isDark, setIsDark] = useState(true)
\`\`\`

## Theme detection effect (verbatim)
\`\`\`
const el = containerRef.current
if (!el) return
const check = () => {
  const card = el.closest('[data-card-theme]')
  const dark = card
    ? card.classList.contains('dark')
    : document.documentElement.classList.contains('dark')
  setIsDark(dark)
  isDarkRef.current = dark
}
check()
const observer = new MutationObserver(check)
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
const cardWrapper = el.closest('[data-card-theme]')
if (cardWrapper) observer.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
return () => observer.disconnect()
\`\`\`

## Canvas DPR scaffolding (inline verbatim)
\`\`\`
const dpr = window.devicePixelRatio || 1
const rect = canvas.getBoundingClientRect()
canvas.width = Math.round(rect.width * dpr)
canvas.height = Math.round(rect.height * dpr)
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
\`\`\`
Also store \`cw = rect.width\`, \`ch = rect.height\` for drawing math.

## Grid build
\`\`\`
const cols = Math.floor(cw / SPACING) + 2
const rows = Math.floor(ch / SPACING) + 2
const ox = (cw % SPACING) / 2
const oy = (ch % SPACING) / 2
bubbles = []
for (let r = 0; r < rows; r++)
  for (let c = 0; c < cols; c++)
    bubbles.push({ x: ox + c*SPACING, y: oy + r*SPACING, b: 0, phase: Math.random() })
\`\`\`

## Frame loop (verbatim math)
\`\`\`
ctx.clearRect(0, 0, cw, ch)
const mx = mouseRef.current?.x ?? -99999
const my = mouseRef.current?.y ?? -99999
const r2 = RADIUS * RADIUS
const dotRGB = isDarkRef.current ? '255,255,255' : '28,25,22'
const baseA  = isDarkRef.current ? BASE_A_DARK : BASE_A_LIGHT

for (const bub of bubbles) {
  const dx = bub.x - mx
  const dy = bub.y - my
  const dist2 = dx*dx + dy*dy
  const tgt = dist2 < r2 ? Math.exp(-dist2 / (RADIUS*RADIUS*0.25)) : 0
  bub.b += (tgt > bub.b ? 0.16 : 0.07) * (tgt - bub.b)
  if (bub.b < 0.004) bub.b = 0
  if (bub.b > 0.08) bub.phase = (bub.phase + 0.025 * bub.b) % 1
  const p = bub.phase

  if (bub.b > 0.08) {
    if (p < 0.55) {
      const t = p / 0.55
      const r = BASE_R + t * BURST_R
      const alpha = baseA * (1 - t)
      if (alpha > 0.004) strokeCircle(bub.x, bub.y, r, alpha)
    } else if (p < 0.72) {
      // invisible gap
    } else {
      const t = (p - 0.72) / 0.28
      const r = BASE_R * t
      const alpha = baseA * t
      if (r > 0.2 && alpha > 0.004) strokeCircle(bub.x, bub.y, r, alpha)
    }
  } else {
    strokeCircle(bub.x, bub.y, BASE_R, baseA)
  }
}
\`\`\`
Inline strokeCircle (do not extract): \`ctx.strokeStyle = \\\`rgba(\${dotRGB},\${alpha.toFixed(3)})\\\`; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.stroke()\`.

## Pointer + resize
onMouseMove/onTouchMove on outer div → mouseRef.current = {x: clientX - canvasRect.left, y: clientY - canvasRect.top}. onMouseLeave/onTouchEnd → mouseRef.current = null. ResizeObserver observes canvas.parentElement and calls build() which re-sizes AND rebuilds the bubble array.

## JSX
Outer div: className "relative h-full w-full overflow-hidden", style background '#110F0C' dark / '#F5F1EA' light. Canvas absolute inset-0 width/height 100%. Centered overlay (pointer-events-none, absolute inset-0, flex flex-col items-center justify-center gap-2):
- "Bubble Field" — fontSize 22, fontWeight 700, letterSpacing -0.02em, color rgba(255,255,255,0.45) dark / rgba(28,25,22,0.45) light
- "hover to burst" — fontSize 11, fontWeight 600, textTransform uppercase, letterSpacing 0.12em, color rgba(255,255,255,0.18) dark / rgba(28,25,22,0.22) light

## Cleanup
Use an \`alive\` flag. On unmount: alive=false, cancelAnimationFrame(animId), ro.disconnect(), observer.disconnect() (in its own effect).`,

  V0: `Create a React client component named \`BubbleField\`. Single file, TypeScript, \`'use client'\` at the top. Use \`useEffect\`, \`useRef\`, and \`useState\` from React — no other libraries, no framer-motion. The component fills its parent (\`h-full w-full\`) and supports both light and dark themes.

## The visual
A full-bleed canvas covered by a dense uniform grid of tiny stroked circles — like graph paper made of rings. At rest, every ring just sits there at a small fixed radius and a calm opacity. Nothing breathes, nothing drifts. The stillness is the point.

When the cursor enters, the nearest rings "burst": each one smoothly expands outward from its resting size, fading as it grows, until it pops out of existence entirely. There's a brief dark beat where that cell holds nothing at all, and then the ring quietly reforms — shrinks back into its original small circle, alpha climbing from zero. The bursts don't all fire in sync: each ring has its own phase offset, so the hover halo looks like a soft bubbling boil of popping and re-emerging circles. Circles furthest from the cursor pop slowly; ones right under the pointer pop fastest. When you move the cursor away, the whole area relaxes back to its quiet grid within roughly a second.

Centered in the frame are two overlay labels:
- A title reading exactly \`Bubble Field\` — 22px, font-weight 700, letter-spacing -0.02em.
- Below it, a hint reading exactly \`hover to burst\` — 11px, font-weight 600, uppercase, letter-spacing 0.12em.

Both labels sit above the canvas with \`pointer-events-none\` so they never block the hover. On dark, the labels use \`rgba(255,255,255,0.45)\` and \`rgba(255,255,255,0.18)\`. On light, use \`rgba(28,25,22,0.45)\` and \`rgba(28,25,22,0.22)\`.

## Theme
Detect theme by checking \`.closest('[data-card-theme]')\` for a \`.dark\` class, falling back to \`document.documentElement.classList.contains('dark')\`. Track it with \`useState isDark\` plus an \`isDarkRef\` for the render loop. Watch for theme changes with a \`MutationObserver\` on \`documentElement\` (and the card wrapper if present) listening for class attribute changes.

Background: \`#110F0C\` on dark, \`#F5F1EA\` on light — set as an inline style on the outer container. The rings themselves are drawn white (\`255,255,255\`) on dark and near-black (\`28,25,22\`) on light. Resting alpha is slightly stronger on light than on dark (\`0.75\` vs \`0.55\`) so the grid reads clearly against the cream background.

## Key constants
- \`SPACING = 20\` — pixels between ring centres
- \`RADIUS = 200\` — hover influence radius in pixels
- \`BASE_R = 1.5\` — resting ring radius
- \`BURST_R = 16\` — how much the ring grows during its burst expansion
- resting alpha: \`0.55\` on dark, \`0.75\` on light
- stroke width: always \`0.5\`

## Canvas setup
Standard DPR scaffolding: read \`devicePixelRatio\`, measure the canvas with \`getBoundingClientRect\`, set \`canvas.width/height\` to the rounded scaled pixels, and \`ctx.setTransform(dpr,0,0,dpr,0,0)\`. Rebuild on resize via a \`ResizeObserver\` on \`canvas.parentElement\`.

Build a flat \`bubbles\` array. Use \`Math.floor(cw/SPACING)+2\` columns and rows so the grid fully covers the bleed, offset by \`(cw%SPACING)/2\` and \`(ch%SPACING)/2\` to keep it centred. Each bubble stores \`{ x, y, b, phase }\` where \`b\` is its 0→1 hover brightness and \`phase\` is a 0→1 cycle pointer seeded with \`Math.random()\` — critical, the random seed is what makes the bursts desynchronised and organic instead of a synchronised sheet.

## The frame loop
On every animation frame:

1. Clear the canvas.
2. Read the mouse position from a ref (fall back to an off-screen coordinate like \`-99999\` when there's no hover, so nothing bursts when the cursor isn't there).
3. For each bubble, compute its squared distance to the cursor. If it's within \`RADIUS\`, its target brightness is \`Math.exp(-dist2 / (RADIUS*RADIUS*0.25))\` — a gaussian falloff that feels creamy and soft, not a hard disc. Outside the radius, target is 0.
4. Ease \`b\` toward its target asymmetrically: fast on the way up (\`0.16\`), slow on the way down (\`0.07\`). This gives the gentle ~1s tail after the cursor leaves. Snap \`b\` to 0 once it drops below \`0.004\`.
5. Advance the burst phase only when the bubble is meaningfully lit (\`b > 0.08\`): \`phase = (phase + 0.025 * b) % 1\`. Multiplying by \`b\` means bubbles right at the cursor cycle faster and bubbles at the edge of the halo cycle slower — so the boil visibly slows down toward the rim of the hover radius.
6. Interpret \`phase\` as a three-part cycle and draw the bubble accordingly.

## The burst cycle
With \`p = bubble.phase\` and \`baseA\` = the theme's resting alpha:

- If \`b <= 0.08\` (resting): draw a simple circle at radius \`BASE_R\` with alpha \`baseA\`. This is the quiet default state and applies to almost every bubble almost all the time.
- If \`b > 0.08\` and \`p < 0.55\` — the **expand + fade** phase. Compute \`t = p / 0.55\` (a local 0→1), radius \`r = BASE_R + t * BURST_R\` (grows from 1.5 to 17.5), alpha \`baseA * (1 - t)\` (fades to zero). Skip the draw entirely if alpha drops below \`0.004\`.
- If \`b > 0.08\` and \`0.55 <= p < 0.72\` — the **gap**. Draw absolutely nothing. The bubble has popped. This tiny void is what sells the burst as a real "pop" rather than a crossfade.
- If \`b > 0.08\` and \`p >= 0.72\` — the **reform** phase. Compute \`t = (p - 0.72) / 0.28\` (local 0→1), radius \`r = BASE_R * t\` (grows from 0 to 1.5), alpha \`baseA * t\` (grows from 0 to baseA). Skip if \`r <= 0.2\` or alpha below \`0.004\`. The bubble shrinks back into existence at its original size, then resumes its cycle.

Every stroked circle: \`ctx.strokeStyle = \\\`rgba(\${dotRGB},\${alpha.toFixed(3)})\\\`\`, \`ctx.lineWidth = 0.5\`, \`beginPath\`, \`arc(x, y, r, 0, Math.PI*2)\`, \`stroke\`. \`dotRGB\` is \`'255,255,255'\` on dark, \`'28,25,22'\` on light.

## Interaction
Attach \`onMouseMove\`, \`onMouseLeave\`, \`onTouchMove\`, \`onTouchEnd\` to the outer container. On move, read the canvas's \`getBoundingClientRect\` and store \`{ x: clientX - rect.left, y: clientY - rect.top }\` in \`mouseRef.current\`. On leave/end, set it to \`null\`. Touch follows the same pattern using \`e.touches[0]\`.

## Structure
\`\`\`
<div ref={containerRef} className="relative h-full w-full overflow-hidden" style={{ background: ... }} ...handlers>
  <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span>Bubble Field</span>
    <span>hover to burst</span>
  </div>
</div>
\`\`\`

## Cleanup
Use an \`alive\` flag inside the effect and guard the frame loop with it. On unmount: set \`alive = false\`, \`cancelAnimationFrame\`, disconnect the \`ResizeObserver\`, and disconnect the theme \`MutationObserver\`. No leaks.

The finished piece should feel like a quiet lattice of ink rings at rest, and like a pot of gently boiling bubbles wherever the cursor touches — soft, organic, never frantic.`,
}
