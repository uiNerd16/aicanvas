import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': `Root element: className="relative min-h-screen w-full overflow-hidden bg-[#FAF8F5] dark:bg-[#000000]"
The component must stand on its own when copied into a fresh project. Give the root a real viewport-height minimum so its absolute canvas cannot collapse.

---

Create components-workspace/diamond-grid/index.tsx as a React client component named DiamondGrid. Use no dependencies beyond React. Write a single self-contained component with strict TypeScript and no any types. Default-export it with props { className?: string; seed?: number }, defaulting seed to 1337. Render no text, controls, captions, icons or focusable elements. The result is non-interactive and has no pointer response.

The visual is a full-bleed Canvas 2D field of faint diamonds. Build it from a square grid rotated 45 degrees around the viewport center, then let deterministic intersection ignitions send light along the four grid axes. A broad top-left to bottom-right alpha band reveals the field while the opposite corners fade away.

## Core constants and palettes

Use these values exactly:

  LOOP_MS = 64000
  EVENT_COUNT = 34
  STATIC_TIME_MS = 27000
  STAR_SIZE = 30
  TAU = Math.PI * 2
  GRID_COS = Math.SQRT1_2

  DARK = { ground: '#000000', ink: '255,255,255', line: 0.3, lineHot: 0.1, lineFar: 0.8, pulse: 0.7, comp: 'lighter' }
  LIGHT = { ground: '#FAF8F5', ink: '14,14,16', line: 0.34, lineHot: 0.12, lineFar: 0.82, pulse: 0.5, comp: 'source-over' }

Precompute 256 rgba strings for each ink, indexed by a clamped alpha rounded after multiplication by 255. Use the palette compositing mode for stars, resting geometry and live light. Dark mode therefore adds overlapping light with lighter, while light mode uses source-over.

## Seeded field and rotated geometry

Implement the exact mulberry32 seeded generator. On every sample, coerce the state to an integer, add 0x6d2b79f5, mix with Math.imul using shifts 15 and 7 and multipliers 1 | state and 61 | value, then finish with shift 14 and divide the unsigned result by 4294967296.

For each rebuild, compute:

  cell = clamp(Math.min(W, H) * 0.113, 65, 124)

The centered 45-degree grid transform is the affine matrix:

  a = GRID_COS
  b = GRID_COS
  c = -GRID_COS
  d = GRID_COS
  e = W * 0.5
  f = H * 0.5

Map grid coordinates to screen with x = a*x + c*y + e and y = b*x + d*y + f. Implement the matching inverse for this orthonormal transform: subtract e and f, then use x = a*dx + b*dy and y = c*dx + d*dy. Inverse-map all four viewport corners, find the grid-space bounds, then seed the origin as x0 = minX - cell * (1 + rnd()) and y0 = minY - cell * (1 + rnd()). Set cols = Math.ceil((maxX + cell - x0) / cell) + 1 and rows with the same expression using maxY and y0. This guarantees the rotated grid covers the canvas with seeded placement.

When drawing grid-space geometry into a DPR-scaled surface, install the transform as dpr times a, b, c and d, with translations dpr times e and f. Do not rotate individual cells or draw an unrotated square grid.

## Cached diagonal mask

Create reusable offscreen canvases for the resting layer, live layer, diagonal mask and star sprite. Size the main, resting, live and mask surfaces to Math.max(1, Math.round(cssSize * dpr)).

Build the mask in CSS-pixel coordinates. Let gx = 1 / W, gy = -1 / H, scale = 1 / (gx*gx + gy*gy), cx = W * 0.5 and cy = H * 0.5. Create a linear gradient from cx - gx*scale, cy - gy*scale to cx + gx*scale, cy + gy*scale. Use every stop exactly:

  0: rgba(255,255,255,0)
  0.1: rgba(255,255,255,0)
  0.16: rgba(255,255,255,0.12)
  0.24: rgba(255,255,255,0.55)
  0.325: rgba(255,255,255,0.92)
  0.42: rgba(255,255,255,1)
  0.58: rgba(255,255,255,1)
  0.675: rgba(255,255,255,0.92)
  0.76: rgba(255,255,255,0.55)
  0.84: rgba(255,255,255,0.12)
  0.9: rgba(255,255,255,0)
  1: rgba(255,255,255,0)

Apply this mask to a target surface by resetting its transform, setting globalAlpha to 1, switching to destination-in, drawing the mask stretched to the target's device-pixel dimensions, then restoring source-over.

## Resting layer and star sprite caches

Prerender the resting grid into its offscreen surface. Under the palette compositing mode, draw all grid columns and rows in a single path with lineCap butt, lineWidth 1 and alpha palette.line * 0.2. At every intersection, batch a compact four-point star path with axis radius 3.3 and inner radius 0.68, then fill it at alpha palette.line * 0.55. Apply the diagonal mask once after drawing. Rebuild this cached layer only when size, DPR or theme requires new caches.

Build the source sprite once per cache rebuild on a STAR_SIZE square surface. At center STAR_SIZE * 0.5, paint a radial bloom out to radius 13. Its stops are 0 at palette.pulse * 0.34, 0.32 at palette.pulse * 0.12, and 1 at alpha 0. Fill a sharp four-point star with radius 10.5 and inner radius 1.45 at palette.pulse, then add a center circle of radius 1.65 with the same fill. Use the palette compositing mode while building it, then restore source-over.

## Deterministic ignition events

Generate EVENT_COUNT events from the same seeded field generator. First create timing gaps. When the event index modulo 3 is 0, use 1200 + rnd() * 1400. Otherwise use 3600 + rnd() * 3200. Sum the gaps and multiply each by LOOP_MS / gapTotal as the event-start cursor advances, so all starts form one deterministic LOOP_MS sequence.

Pick ignition nodes inside the outer grid border. Try up to 40 seeded positions and accept a screen-visible node whose diagonal strength is above 0.28. Define diagonal strength as 1 - smoothstep((Math.abs(x / W - y / H) - 0.16) / 0.64), using a clamped cubic smoothstep p*p*(3 - 2*p).

For each index whose modulo 3 is 1, try to pair it with the previous event. Move by a randomly signed offset of 2 + Math.floor(rnd() * 2), on either the same row or the same column, and clamp to the inner grid. If the paired point is offscreen or its diagonal strength is below 0.2, choose another visible node.

Assign each event these exact seeded ranges:

- duration = 25000 + rnd() * 7000, a 25000 to 32000 ms lifetime
- decayStart = 10500 + rnd() * 4500, a 10500 to 15000 ms onset
- travel = 3200 + rnd() * 900, a 3200 to 4100 ms travel value
- reach = 2.5 + rnd() * 1.25, a 2.5 to 3.75 cell reach
- phase = rnd() * TAU

Compute wrapped age as time - start, adding LOOP_MS when negative. Return no light once age reaches duration. Before then, level is smoothstep(age / 900), multiplied by a plateau that becomes 1 - smoothstep((age - decayStart) / (duration - decayStart)) after decayStart, then multiplied by 0.94 + 0.06 * Math.sin(age * 0.00055 + phase).

## Continuous travelling rays

Each live ignition sends rays left, right, up and down, clamped by its distance to the corresponding grid edge. Travel must be one continuous cubic ease-out over the whole event, not a separate smoothstep within each cell. The older per-cell easing froze the front at every crossing. This version continuously decelerates and never stalls at a cell crossing.

Use:

  span = event.travel * event.reach * 2.6
  p = Math.min(1, age / span)
  front = event.reach * (1 - Math.pow(1 - p, 3))

For every ray with distance and level above 0.002, draw from the source to the current front with lineCap butt. First draw a 3.2 wide glow at alpha palette.pulse * level * 0.13. Draw a 0.95 wide hot core over it at alpha palette.pulse * level * 0.54. Add a front circle of radius 1.1 at alpha palette.pulse * level * 0.72.

Draw the cached source sprite centered at the ignition. Its global alpha is clamp(level * (0.82 + 0.18 * smoothstep(age / 1800)), 0, 1). Restore globalAlpha to 1 afterward.

## Frame composition

Clear the reusable live surface each frame, install the rotated grid transform, set the palette compositing mode and paint all active events. Mask the finished live surface with one destination-in blit. On the visible canvas, reset state, fill the entire device-pixel canvas with palette.ground, draw the cached resting surface with source-over, then draw the live surface using the palette compositing mode. Restore source-over at the end.

Keep the loop analytic and allocation-conscious. Reuse every offscreen surface and the cached star sprite. Do not recreate gradients, alpha tables, field geometry or sprites in the animation frame.

## Lifecycle and accessibility

Cap DPR with Math.min(window.devicePixelRatio || 1, 2). On rebuild, round host width and height and keep each at least 1. Advance elapsed time by Math.min(33, last ? now - last : 16), modulo LOOP_MS.

Use a ResizeObserver on the host, debounce rebuilds by 120 ms, and skip when width, height and capped DPR are unchanged. Use an IntersectionObserver with threshold 0.01. Run RAF only while intersecting, while the document is visible, and while reduced motion is off. Stop on document.hidden and resume when visible if the other conditions allow it.

Listen to prefers-reduced-motion: reduce. When enabled, stop RAF and render a populated still at STATIC_TIME_MS. When the preference changes, stop, redraw the correct idle frame and conditionally restart.

For dark-mode detection, first read the closest ancestor with data-card-theme. Explicit light means light and explicit dark means dark. Only when that attribute gives neither, fall back to document.documentElement.classList.contains('dark'). Observe the html class with a MutationObserver. On a theme change, rebuild the mask, star sprite and resting layer, then redraw immediately when RAF is stopped.

On teardown, cancel RAF, clear the resize debounce, disconnect ResizeObserver, IntersectionObserver and MutationObserver, remove the visibility and motion listeners, set every offscreen canvas width and height to 0, and release the field reference.

The root div has role="img", aria-label="A faint diagonal diamond grid slowly illuminated by travelling light", the full-bleed classes stated at the top, and merges an optional className. Its only child is an aria-hidden canvas with className="absolute inset-0 block". Keep the component self-contained, free of non-React dependencies, free of text and controls, non-interactive, and ready to copy-paste into a fresh project.`,
}
