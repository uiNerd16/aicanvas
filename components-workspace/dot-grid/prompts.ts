import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/dot-grid/index.tsx\` — an interactive dot grid background.

\`\`\`
'use client'
// Canvas-based. No external dependencies.
// Grid: 20px spacing, 1px dots, centered.
// Background: #110F0C. Base opacity: 0.13. Peak: 0.92.
// Hover: radial influence radius 130px, falloff = (1 - dist/R)^1.5
// Bloom: dot size grows 1px → 2.2px proportional to brightness
// Lerp: 0.16 attack / 0.07 release (asymmetric for trailing glow)
// DPR: ctx.setTransform(dpr,0,0,dpr,0,0) after setting canvas size
// Resize: ResizeObserver on parentElement!, rebuilds dot array
// Touch: onTouchMove + onTouchEnd on wrapper div
// Overlay: centered "Dot Grid" h2 + "hover to illuminate" caption, pointer-events-none
// Export: export function InteractiveDotGrid()
\`\`\``,
}
