import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a full-bleed canvas component called NoiseField. It shows a grid of short arrows across the entire canvas — like a wind map or fluid flow visualization. Each arrow slowly shifts direction over time, creating a hypnotic, meditative flowing field. There are no labels or text — just arrows and motion.

On hover, the flow near the cursor responds dramatically: a swirling vortex forms around the pointer, causing nearby arrows to spiral and twist. When the cursor leaves, the vortex smoothly fades out and the field returns to its gentle flowing state.

The component has two colour modes. In dark mode the background is near-black (#110F0C) and arrows are white at 35% opacity. In light mode the background is warm off-white (#F5F1EA) and arrows are dark at 30% opacity. It automatically detects the active theme and reacts to theme changes.

Use Next.js with Tailwind CSS for structure. Implement the canvas animation with requestAnimationFrame — no external animation libraries needed for the drawing loop. Make the component fill its container entirely.`,

  Bolt: `Build a React component called NoiseField using a 2D canvas and requestAnimationFrame.

Grid: place arrow origins every 24px across the canvas width and height. Each arrow is a 10px shaft (5px each side of the origin) with a small V-shaped arrowhead at the tip (two lines branching at ±30° from the tip, each 4px long).

Flow formula: for each grid point (gx, gy) at time t:
  angle = sin(gx * 0.008 + t) * PI + cos(gy * 0.008 + t * 0.7) * PI
Increment t by 0.006 per frame.

Vortex on hover: track mouse position on the canvas. Add a vortex contribution to each arrow's angle:
  falloff = exp(-distSq / (120 * 120))
  angle += hoverStrength * atan2(dy, dx) * falloff * 1.8
hoverStrength lerps toward 1 when the mouse is over the canvas, and toward 0 when it leaves (factor 0.05 per frame).

Colours: dark mode — bg #110F0C, arrows rgba(255,255,255,0.35). Light mode — bg #F5F1EA, arrows rgba(28,25,22,0.30). Detect theme from the nearest [data-card-theme] ancestor's classList or document.documentElement. Use a MutationObserver to react to theme changes.

Use a ResizeObserver to keep the canvas sized to its container. Cancel the RAF and disconnect the ResizeObserver on unmount. The component root should be className="relative h-full w-full overflow-hidden".`,

  Lovable: `I'd love a component that feels like standing over a river and watching the current move — mesmerising, peaceful, and alive. Imagine a dark canvas covered edge-to-edge with tiny arrows, each one gently tilting and shifting over time like a field of grass in the wind, or currents in an ocean. The motion is slow, hypnotic, and slightly organic — not mechanical.

When you hover over it, something magical happens: the arrows near your cursor start to swirl outward in a vortex, like disturbing the surface of still water. The further your mouse gets from an arrow, the less it's affected — the swirl is concentrated and beautiful right around the pointer. Move away, and the vortex softly dissolves.

The dark version feels like a starfield in motion — almost cosmic. The light version has a warm, paper-like quality with subtle dark strokes. It switches theme automatically.

No text, no labels — just pure visual poetry. Built with React and canvas, animating smoothly with requestAnimationFrame.`,

  'Claude Code': `Create \`components-workspace/noise-field/index.tsx\`. Export a named function \`NoiseField\`.

## Structure
- \`'use client'\` at top
- Imports: \`useEffect, useRef, useState\` from react (no Framer Motion needed — canvas loop handles animation)
- Root div: \`ref={containerRef}\` \`className="relative h-full w-full overflow-hidden"\` with inline \`style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}\`
- \`<canvas ref={canvasRef} className="absolute inset-0" />\` inside root

## Constants
\`\`\`ts
const GRID_SPACING = 24   // px between arrow origins
const ARROW_LEN    = 10   // half-length of shaft (tip is ARROW_LEN ahead of origin)
const HEAD_SIZE    = 4    // arrowhead branch length
\`\`\`

## State / refs
- \`isDark: boolean\` state, default true
- \`isDarkRef\` — mutable ref kept in sync with isDark (so RAF closure always sees latest)
- \`mouseRef\` — \`{ x: number; y: number } | null\`
- \`hoverStrRef\` — number starting at 0

## Theme detection (useEffect)
\`\`\`ts
const card = el.closest('[data-card-theme]')
const dark = card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark')
\`\`\`
MutationObserver on both documentElement and the nearest [data-card-theme] wrapper.

## Mouse tracking (useEffect on canvas)
mousemove → store canvas-relative coords in mouseRef.current
mouseleave → set mouseRef.current = null

## Draw loop (useEffect)
1. Resize canvas via ResizeObserver (account for devicePixelRatio)
2. RAF loop with counter \`t\`, incremented by 0.006 per frame
3. For each grid point (gx, gy):
   - \`angle = sin(gx * 0.008 + t) * PI + cos(gy * 0.008 + t * 0.7) * PI\`
   - Vortex: if mouse present, \`distSq = dx² + dy²\`, \`falloff = exp(-distSq / (120*120))\`, apply only if \`distSq < (120*4)² \` (widen check to 4× radius):
     \`angle += hoverStr * atan2(dy, dx) * falloff * 1.8\`
   - hoverStr lerp: \`hoverStrRef.current += (target - current) * 0.05\` each frame
4. Draw shaft: line from \`(gx - cos*ARROW_LEN, gy - sin*ARROW_LEN)\` to tip \`(gx + cos*ARROW_LEN, gy + sin*ARROW_LEN)\`
5. Draw arrowhead: two branches from tip at angles \`±(PI - PI/6)\` relative to flow direction, length HEAD_SIZE
6. Arrow color: dark \`rgba(255,255,255,0.35)\`, light \`rgba(28,25,22,0.30)\`. lineWidth 1.2, lineCap 'round'
7. Background fill each frame: dark \`#110F0C\`, light \`#F5F1EA\`

## Cleanup
cancelAnimationFrame(rafId) + ro.disconnect() on unmount. Remove mousemove/mouseleave listeners on unmount.`,

  Cursor: `File: \`components-workspace/noise-field/index.tsx\`
Export: \`NoiseField\`
Stack: React (hooks only), 2D Canvas, requestAnimationFrame — no Framer Motion, no Three.js

## Layout
- Root: \`className="relative h-full w-full overflow-hidden"\` + inline bg (dark #110F0C / light #F5F1EA)
- Canvas: \`className="absolute inset-0"\`, sized to container via ResizeObserver + devicePixelRatio

## State
- \`isDark\` (useState, default true) — updated by MutationObserver on \`[data-card-theme]\` or \`document.documentElement\`
- \`isDarkRef\` (useRef) — stays in sync, used inside RAF
- \`mouseRef: { x, y } | null\` — canvas-relative cursor position
- \`hoverStrRef: number\` — lerps 0→1 on enter, 1→0 on leave (factor 0.05/frame)

## Grid & flow
- Arrow origins: every GRID_SPACING=24px across canvas W×H
- Per origin (gx, gy) at time t:
  \`angle = sin(gx * 0.008 + t) * PI + cos(gy * 0.008 + t * 0.7) * PI\`
- t increments 0.006 per frame

## Vortex
- Per frame: hoverStr lerps toward 1 (mouse inside) or 0 (mouse outside)
- For each arrow, if mouse present and distSq < (120*2)²:
  \`falloff = exp(-distSq / (120*120))\`
  \`angle += hoverStr * atan2(dy, dx) * falloff * 1.8\`

## Drawing each arrow
- Shaft: line from (gx - cos*10, gy - sin*10) to tip (gx + cos*10, gy + sin*10)
- Arrowhead: two lines from tip, each length 4px at angle ±(PI - PI/6) from flow direction
- strokeStyle: rgba(255,255,255,0.35) dark / rgba(28,25,22,0.30) light
- lineWidth 1.2, lineCap 'round'
- Fill canvas background each frame before drawing

## Cleanup
- cancelAnimationFrame on unmount
- ResizeObserver.disconnect() on unmount
- Remove mousemove / mouseleave event listeners on unmount
- MutationObserver.disconnect() on unmount`,
}
