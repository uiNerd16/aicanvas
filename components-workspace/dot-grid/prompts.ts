import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a full-size interactive dot grid background component in React.

Requirements:
- Canvas-based rendering (not DOM elements) for performance
- A uniform grid of 1px white dots spaced 20px apart, filling the entire container
- Dots rest at low opacity (~0.13) against a near-black background (#110F0C)
- On hover, dots within a 130px radius light up with a radial falloff (power curve), reaching up to 0.92 opacity at the cursor centre
- Lit dots grow slightly (1px → ~2px) to create a subtle bloom effect
- Fast attack (~0.16 lerp), slow release (~0.07 lerp) so the glow lingers organically after the cursor moves away
- Handle devicePixelRatio for crisp rendering on retina displays
- ResizeObserver to rebuild the grid when the container changes size
- Touch support (onTouchMove / onTouchEnd)
- A centred, non-interactive label overlay: "Dot Grid" + "hover to illuminate" in subdued white`,

  Bolt: `Build an interactive dot grid background component using React and an HTML Canvas.

Spec:
- Fill the container with a grid of 1×1px white dots, 20px apart, centered
- Background: #110F0C. Resting dot opacity: 0.13
- Mouse hover lights up dots within 130px radius using a power-curve falloff (1 − dist/R)^1.5
- Peak opacity: 0.92. Lit dots scale to ~2.2px for a bloom effect
- Lerp speeds: 0.16 toward brighter, 0.07 toward darker — creates a trailing glow
- devicePixelRatio scaling so dots are crisp on retina
- ResizeObserver to handle layout changes; cleanup on unmount
- Touch events for mobile
- Centred text overlay: large "Dot Grid" label + small "hover to illuminate" caption, both pointer-events-none`,

  Lovable: `Design and build an interactive dot grid React component for a dark UI.

Visual:
- Near-black canvas background (#110F0C) covered in a 20px grid of tiny 1px dots
- Dots are subtle white (opacity ~0.13) at rest — barely visible
- Hovering illuminates a soft circular halo: dots within 130px glow up to 0.92 opacity with a smooth radial falloff
- Lit dots expand slightly (1px → up to 2.2px) for a natural bloom
- The glow follows the cursor with a snappy attack but lingers on release (asymmetric lerp: 0.16 in, 0.07 out)

Technical:
- Single <canvas> element, scaled for devicePixelRatio
- requestAnimationFrame render loop, cleanup on unmount
- ResizeObserver rebuilds grid on resize
- Touch support
- Centered overlay text ("Dot Grid" / "hover to illuminate") is pointer-events-none`,

  'Claude Code': `Create \`components-workspace/dot-grid/index.tsx\` — an interactive dot grid background.

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

  Cursor: `Write an interactive dot grid background component — \`components-workspace/dot-grid/index.tsx\`.

Implementation notes:
- Pure canvas, no SVG, no DOM dots — use requestAnimationFrame
- Grid built in a \`build()\` function called by ResizeObserver; dots are \`{x, y, b}\` objects (b = brightness 0–1)
- Each frame: compute target brightness from distance to mouse (0 outside 130px radius, power curve inside); lerp b toward target with 0.16 if rising, 0.07 if falling
- Draw: fillRect at (x−sz/2, y−sz/2, sz, sz) where sz = 1 + b * 1.2; color rgba(255,255,255,alpha)
- DevicePixelRatio: scale canvas.width/height by dpr, then ctx.setTransform(dpr,0,0,dpr,0,0)
- Clean up animId + ResizeObserver in useEffect return
- Export name: \`InteractiveDotGrid\``,
}
