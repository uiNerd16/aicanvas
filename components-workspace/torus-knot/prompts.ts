import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a hypnotic 3D torus knot component drawn entirely on a canvas — no Three.js, just the 2D canvas API with clever math.

The knot is a trefoil (p=2, q=3 winding parameters). It slowly rotates on its Y axis all the time. When you hover over it, the rotation smoothly speeds up (about 4–5x faster) and a subtle radial glow blooms at the center of the canvas.

The visual depth comes from varying the alpha of each line segment based on its Z position — back segments are very faint (almost invisible), front segments are bold and bright. This creates a convincing wireframe 3D look without any 3D library.

In dark mode: white lines on a near-black (#110F0C) background. In light mode: dark sand-toned lines on a warm ivory (#F5F1EA) background. The glow is a gentle blue-tinted radial gradient in dark mode, a warm amber tint in light mode.

The knot scales to fill about 80% of whatever container it's placed in — no fixed sizes. Use Next.js with Tailwind CSS. The component should support light/dark mode toggling cleanly.`,

  Bolt: `Build a React canvas component that renders an animated 3D torus knot wireframe without Three.js.

Torus knot math (trefoil, p=2 q=3):
  t goes 0 → 2π across 600 sampled points
  r = cos(3t) + 2
  x = r * cos(2t), y = r * sin(2t), z = -sin(3t)

Each frame:
1. Increment a Y-axis rotation angle by the current speed (default ~0.004 rad/frame, hover ~0.018)
2. Apply Y-rotation matrix to every point
3. Perspective-project each rotated point: sx = cx + (rx * scale) / (rz + DIST), sy = cy - (ry * scale) / (rz + DIST)
4. Draw line segments between consecutive projected points
5. Each segment's alpha = 0.10 + 0.90 * ((midZ - zMin) / zRange) — back = dim, front = bright
6. On hover: shadowBlur on bright (t > 0.6) segments + a radial gradient glow at canvas center

Speed and glow strength lerp toward their target each frame (factor 0.06 / 0.07) for smooth transitions.

Use useRef for all animation state (angle, speed, glow strength, hovered flag) — no useState for these. Theme detection via closest('[data-card-theme]') classList check + MutationObserver. Scale the knot to 80% of min(width, height). Clean up RAF + ResizeObserver on unmount. Use React + TypeScript.`,

  Lovable: `I'd love a component that feels like staring into a mathematical object from another dimension — elegant, hypnotic, and quietly mesmerising.

Imagine a wireframe knot slowly spinning in space, drawn with thin lines that fade from nearly-invisible at the back to crisp and bright at the front. The depth is an illusion created entirely by varying the opacity of each line — no 3D library, just beautiful math on a canvas.

The mood should be minimal and editorial. On a dark background, white lines glow softly against near-blackness. On a light background, the lines become warm dark sand tones against ivory — equally beautiful, just quieter.

When you hover, the knot picks up speed like a spinning top that's been flicked — faster, more alive — and a soft radial glow breathes out from the center. It settles back to its meditative pace when you move away.

The shape itself is a trefoil torus knot — mathematically perfect, endlessly looping. It should fill most of its container and look great at any size. I want it to feel like a screen-saver from an alternate universe where software was designed by mathematicians with great taste.`,

  'Claude Code': `Create \`components-workspace/torus-knot/index.tsx\`. Export a named function \`TorusKnot\`.

## Constants
\`\`\`ts
const SEGMENTS  = 600        // points sampled along the knot
const P         = 2          // trefoil winding
const Q         = 3
const DIST      = 6          // perspective depth constant
const BASE_SPEED  = 0.004    // rad/frame at rest
const HOVER_SPEED = 0.018    // rad/frame while hovered
const SPEED_LERP  = 0.06     // lerp factor for speed
const GLOW_LERP   = 0.07     // lerp factor for glow
\`\`\`

## Parametric knot geometry (precomputed once)
\`\`\`ts
for i in 0..SEGMENTS:
  t = (i / SEGMENTS) * 2π
  r = cos(Q*t) + 2
  pts[i] = [r*cos(P*t), r*sin(P*t), -sin(Q*t)]
\`\`\`

## Per-frame render algorithm
1. Lerp \`speedRef\` toward \`BASE_SPEED\` or \`HOVER_SPEED\` by \`SPEED_LERP\`
2. Lerp \`glowRef\` toward 0 or 1 by \`GLOW_LERP\`
3. Increment \`angleRef\` by \`speedRef\`
4. Derive canvas size from \`container.clientWidth/Height\`; scale = \`min(W,H)/2 * 0.80 / 3\`
5. Fill background: dark \`#110F0C\`, light \`#F5F1EA\`
6. For each point: apply Y-rotation matrix, then perspective project:
   \`sx = cx + (rx*scale) / (rz+DIST)\`, \`sy = cy - (ry*scale) / (rz+DIST)\`
7. Find \`zMin\`/\`zMax\` across all projected points
8. For each segment \`i → i+1\`:
   - \`t = (midZ - zMin) / zRange\`; \`alpha = 0.10 + 0.90*t\`
   - Dark mode: \`rgba(v,v,v,alpha)\` where \`v = round(255*(alpha+0.05))\`
   - Light mode: dark-sand rgba derived from \`base = 28 + (1-alpha)*80\`
   - If \`glow > 0.05\` and \`t > 0.6\`: set \`ctx.shadowBlur = 8*glow\`, \`ctx.shadowColor\` = blue-tinted (dark) or amber (light)
   - Draw line segment; lineWidth 1.2 for bright, 0.8 for dim
9. If \`glow > 0.05\`: draw radial gradient overlay centered on canvas for the bloom effect

## Theme detection
Use \`closest('[data-card-theme]')\` pattern with MutationObserver on both \`document.documentElement\` and the card wrapper. Store in \`isDarkRef\` for RAF access and \`isDark\` state for inline background style.

## Lifecycle
- \`useRef\` for: canvasRef, containerRef, angleRef, speedRef, glowRef, hoveredRef, isDarkRef
- ResizeObserver handles DPR-correct canvas resize
- Return cleanup: \`cancelAnimationFrame(rafId)\`, \`ro.disconnect()\`
- Root element: \`className="relative h-full w-full overflow-hidden"\` with inline \`background\` from isDark
- Canvas: \`className="absolute inset-0"\`
- \`onMouseEnter\`/\`onMouseLeave\` set \`hoveredRef.current\`
- No useState for animation values — only for \`isDark\` (boolean)`,

  Cursor: `File: \`components-workspace/torus-knot/index.tsx\`
Export: \`TorusKnot\` ('use client')

**Geometry:**
- Trefoil torus knot: p=2, q=3
- 601 points: t = (i/600)*2π; r = cos(3t)+2; x=r*cos(2t), y=r*sin(2t), z=-sin(3t)
- Precompute once as module-level constant \`KNOT_POINTS: [number,number,number][]\`

**Refs (no useState for animation):**
- canvasRef, containerRef, angleRef(0), speedRef(0.004), glowRef(0), hoveredRef(false), isDarkRef(true)
- isDark: useState(true) — only for inline background + color JSX

**RAF loop per frame:**
- Lerp speedRef → (hovered ? 0.018 : 0.004) × 0.06
- Lerp glowRef → (hovered ? 1 : 0) × 0.07
- angleRef += speedRef
- scale = min(W,H)/2 * 0.80 / 3
- Apply Y-rotation: [cos·x+sin·z, y, -sin·x+cos·z]
- Project: sx=cx+(rx*scale)/(rz+6), sy=cy-(ry*scale)/(rz+6)
- Compute zMin/zMax across all 601 projected points
- Per segment: t=(midZ-zMin)/zRange; alpha=0.10+0.90*t
- Dark: rgba(v,v,v,alpha) v=round(255*(alpha+0.05))
- Light: rgba(base,base*0.97,base*0.92,alpha) base=round(28+(1-alpha)*80)
- shadowBlur=8*glow, shadowColor blue/amber if glow>0.05 && t>0.6
- lineWidth: t>0.6 → 1.2 else 0.8
- Radial gradient bloom overlay at center when glow>0.05

**Theme detection:** \`closest('[data-card-theme]')\` classList.contains('dark'), MutationObserver on html+card wrapper, updates both isDark state + isDarkRef.current

**Canvas sizing:** ResizeObserver → canvas.width=W*dpr, canvas.height=H*dpr, ctx.scale(dpr,dpr)

**Cleanup:** cancelAnimationFrame + ResizeObserver.disconnect

**JSX:** root div relative h-full w-full overflow-hidden, inline bg (#110F0C / #F5F1EA), onMouseEnter/Leave → hoveredRef; canvas absolute inset-0`,
}
