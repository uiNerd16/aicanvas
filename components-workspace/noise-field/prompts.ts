import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/noise-field/index.tsx\`. Export a named function \`NoiseField\`.

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
}
