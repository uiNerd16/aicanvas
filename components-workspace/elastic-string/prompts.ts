import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a mesmerising interactive canvas component called ElasticString. It's beautifully minimal: a single taut horizontal line spans the full width of the canvas, perfectly centered vertically. When the cursor moves over the component, the line bends toward the cursor — curving like a guitar string being plucked. The closer the cursor is to the line, the stronger the pull. Moving the cursor away makes the string spring back with a satisfying oscillating vibration that gradually settles to rest.

The line is drawn with a glow effect — three passes on the canvas: a thick, very faint halo for depth; a medium semi-transparent stroke; and a sharp bright 1.5px line on top. There's also a small dot that appears at the bend point while the string is deflected. In dark mode the line is near-white; in light mode it's near-black. The background matches the project's dark/light theme (dark: #110F0C, light: #F5F1EA).

Build it with Next.js and TypeScript using a raw HTML canvas element inside a React component. Use requestAnimationFrame for the physics loop. The physics model is a spring-damper: each frame, velocity is nudged toward (targetY − currentY) × tension, then multiplied by a damping factor (~0.88). The cursor's influence on the target position is weighted by proximity to the line (strongest when the cursor is directly on the line, weakening with vertical distance). Support both light and dark themes.`,

  Bolt: `Build a React component using a raw HTML canvas element and requestAnimationFrame (no external animation libraries needed). The component is called ElasticString and renders a physics-driven horizontal string that reacts to mouse movement.

Canvas rendering:
- Fill background each frame: dark mode #110F0C, light mode #F5F1EA
- Draw a quadratic Bezier: start (0, h/2), control (mouseX, h/2 + ctrlY), end (w, h/2)
- Three draw passes per frame: thick (8px, 7% alpha) glow → medium (3px, 18% alpha) → sharp (1.5px, 72% alpha)
- Draw a small dot at the control point, opacity proportional to deflection magnitude

Physics state (updated per frame):
- ctrlY: current Y offset of the control point from center
- velY: velocity of ctrlY
- targetY: the spring's rest target (0 at rest, follows cursor on hover)
- velY += (targetY - ctrlY) * 0.042
- velY *= 0.88
- ctrlY += velY

Mouse interaction:
- On mousemove: compute distFromCenter = localY - h/2; proximity = (1 - |distFromCenter| / (h/2))^2; targetY lerps toward distFromCenter * proximity (clamped to ±38% of height)
- On mouseleave: targetY = 0, string oscillates to rest

Use ResizeObserver for responsive sizing with devicePixelRatio support. Detect theme via el.closest('[data-card-theme]') classList, falling back to document.documentElement. Clean up RAF and event listeners on unmount.`,

  Lovable: `I'd love a component that feels like touching a real guitar string — that satisfying physical sensation when you pluck something taut and it vibrates back. Picture a single clean horizontal line, perfectly centered on a dark canvas, completely still until you get close.

As your cursor drifts near the line, it bends toward you — gently at first, then more eagerly the closer you get. The string follows the natural curve of a Bezier arc, not a rigid deflection. When you move away, it doesn't just snap back — it overshoots, swings the other way, and gradually settles into stillness like a real string losing energy to air resistance.

The aesthetic is ultra-minimal. No UI chrome, no labels, just the line. It glows slightly — drawn with a soft wide halo beneath and a sharp bright stroke on top, giving it a luminous quality. A tiny dot pulses at the bend point while it's deflected.

Dark mode: near-white line on deep near-black (#110F0C). Light mode: near-black line on warm off-white (#F5F1EA). The experience is meditative and tactile — the kind of thing you just keep nudging because it feels so good to play with.`,

  'Claude Code': `Create \`components-workspace/elastic-string/index.tsx\`. Export a named function \`ElasticString\`.

## Structure
- \`'use client'\` at top
- No Framer Motion — use raw canvas + requestAnimationFrame
- Imports: \`useEffect\`, \`useRef\`, \`useState\` from React

## Root element
\`\`\`tsx
<div ref={wrapperRef} className="relative h-full w-full overflow-hidden" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}>
  <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ display: 'block' }} />
</div>
\`\`\`

## Physics constants
\`\`\`ts
const TENSION  = 0.042  // spring stiffness
const DAMPING  = 0.88   // velocity multiplier per frame
const MAX_PULL = 0.38   // max deflection as fraction of canvas height
const LERP_K   = 0.22   // targetY tracking speed
\`\`\`

## Physics state (inside useEffect, not React state)
- \`ctrlY\`: current control-point Y offset from canvas center
- \`velY\`: velocity of ctrlY
- \`targetY\`: spring target (0 at rest)
- \`mouseX\`: last known cursor X position
- \`isHovering\`: boolean

## Per-frame physics update
\`\`\`ts
velY   += (targetY - ctrlY) * TENSION
velY   *= DAMPING
ctrlY  += velY
// Snap to rest when near-zero and not hovering:
if (!isHovering && Math.abs(ctrlY) < 0.05 && Math.abs(velY) < 0.05) {
  ctrlY = 0; velY = 0; targetY = 0
}
\`\`\`

## Mouse interaction
On \`mousemove\`:
\`\`\`ts
const distFromCenter = localY - (h / 2)
const proximity = 1 - Math.min(Math.abs(distFromCenter) / (h * 0.5), 1)
const strength  = proximity * proximity
const rawPull   = distFromCenter * strength
const maxPull   = h * MAX_PULL
targetY += (Math.max(-maxPull, Math.min(maxPull, rawPull)) - targetY) * LERP_K
mouseX = localX
\`\`\`
On \`mouseleave\`: set \`isHovering = false\`, \`targetY = 0\`

## Canvas draw (per frame, CSS-pixel coordinates)
1. Fill background: dark \`#110F0C\` / light \`#F5F1EA\`
2. \`ctx.moveTo(0, cy)\`, \`ctx.quadraticCurveTo(mouseX || w/2, cy + ctrlY, w, cy)\`
3. Three stroke passes:
   - Glow: \`lineWidth 8\`, alpha 0.07
   - Mid: \`lineWidth 3\`, alpha 0.18
   - Sharp: \`lineWidth 1.5\`, alpha 0.72
4. Colors: dark \`rgba(255,255,255,α)\` / light \`rgba(28,25,22,α)\`
5. Dot at \`(mouseX, cy + ctrlY)\`, radius 3, alpha proportional to \`|ctrlY| / (h * MAX_PULL * 0.5)\`, clamped to 0.55 max

## Sizing
Use \`ResizeObserver\` on the canvas element. On resize: set \`canvas.width = offsetWidth * dpr\`, \`canvas.height = offsetHeight * dpr\`, call \`ctx.scale(dpr, dpr)\`, reset physics to 0.

## Theme detection
\`\`\`ts
const card = el.closest('[data-card-theme]')
const dark = card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark')
\`\`\`
Use \`MutationObserver\` watching \`class\` attribute on both \`document.documentElement\` and the card wrapper. Store dark state in a ref (\`isDarkRef\`) for use inside the RAF loop without stale closure issues.

## Cleanup
\`cancelAnimationFrame(rafId)\`, \`ro.disconnect()\`, remove all 3 canvas event listeners, \`observer.disconnect()\`.`,

  Cursor: `File: \`components-workspace/elastic-string/index.tsx\`
Export: \`ElasticString\`
Stack: React + TypeScript, raw Canvas2D API, requestAnimationFrame (no Framer Motion)

## Canvas setup
- \`<canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />\`
- ResizeObserver: \`canvas.width = offsetWidth * dpr\`, \`canvas.height = offsetHeight * dpr\`, \`ctx.scale(dpr, dpr)\`
- Root div: \`relative h-full w-full overflow-hidden\`, inline bg from isDark ref

## Physics (plain JS vars in useEffect closure)
- State: \`ctrlY = 0\`, \`velY = 0\`, \`targetY = 0\`, \`mouseX = 0\`, \`isHovering = false\`
- Constants: \`TENSION = 0.042\`, \`DAMPING = 0.88\`, \`MAX_PULL = 0.38\`, \`LERP_K = 0.22\`
- Per frame: \`velY += (targetY - ctrlY) * TENSION; velY *= DAMPING; ctrlY += velY\`
- Snap: if \`!isHovering && |ctrlY| < 0.05 && |velY| < 0.05\` → zero all three

## Mouse events (on canvas element)
- \`mousemove\`: localX/Y from \`getBoundingClientRect\`; proximity = \`(1 - |localY - h/2| / (h/2))²\`; \`targetY += (clamp(distFromCenter * proximity, ±h*MAX_PULL) - targetY) * LERP_K\`; \`mouseX = localX\`
- \`mouseenter\`: set \`isHovering = true\`, call mousemove handler
- \`mouseleave\`: \`isHovering = false; targetY = 0\`

## Draw (each RAF tick, CSS-px space)
- Clear + fill bg: dark \`#110F0C\` / light \`#F5F1EA\`
- Bezier: \`moveTo(0, cy)\` → \`quadraticCurveTo(mouseX||w/2, cy+ctrlY, w, cy)\`
- Pass 1 — glow: \`lineWidth 8\`, \`rgba(255,255,255,0.07)\` / \`rgba(28,25,22,0.07)\`
- Pass 2 — mid: \`lineWidth 3\`, alpha 0.18
- Pass 3 — sharp: \`lineWidth 1.5\`, alpha 0.72
- Dot at control point: radius 3, alpha = \`min(|ctrlY| / (h*MAX_PULL*0.5), 1) * 0.55\`

## Theme detection
- \`useState(true)\` for isDark + \`useRef\` mirror for RAF closure
- \`el.closest('[data-card-theme]')\` → check \`.dark\` class; fallback: \`document.documentElement\`
- MutationObserver on both targets, \`attributeFilter: ['class']\`

## Cleanup
- \`cancelAnimationFrame(rafId)\`
- \`ro.disconnect()\` (ResizeObserver)
- \`observer.disconnect()\` (MutationObserver)
- Remove canvas \`mousemove\`, \`mouseenter\`, \`mouseleave\` listeners`,
}
