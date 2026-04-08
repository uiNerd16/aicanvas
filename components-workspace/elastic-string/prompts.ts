import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/elastic-string/index.tsx\`. Export a named function \`ElasticString\`.

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
}
