# X Grid

## Brief
Component: X Grid
Slug: x-grid
Description: Canvas-based interactive × grid with a living breathing field and a large, soft cursor glow that lights marks near the pointer and fades back to default about a second after the cursor passes.

## Visual
- 20px grid spacing, 340px hover influence radius (large — ~70% of a 480px preview)
- Marks drawn axis-aligned as two crossed diagonal strokes (no rotation)
- Resting arm 2px → lit arm 3px (`arm = 2 + d.b * 1.0`)
- Resting stroke 0.5px → lit stroke 0.8px (`sw = 0.5 + d.b * 0.3`)
- Base alpha: 0.13 dark / 0.25 light; peak alpha 0.92
- Breathing wave modulates resting alpha by ±30%: `sin(col*0.3 + row*0.3 - t*0.5)`
- Connection lines between lit neighbours (right, below, down-right, down-left) at `min(d.b, n.b) * 0.4` alpha, threshold 0.05
- Centred label overlay: "X Grid" + "hover to illuminate"
- Background: #110F0C dark / #F5F1EA light

## Behaviour
- Attack lerp 0.16, release lerp 0.05 — trail fades back to default in ~1s whether cursor is inside or outside the component
- Target brightness curve: `tgt = dist² < R² ? pow(1 - dist/R, 1.5) : 0`, zero-clamp below 0.004
- DPR-aware canvas, ResizeObserver on canvas parent
- Theme detection via `[data-card-theme]` wrapper → `.dark` class, falling back to `document.documentElement`, MutationObserver on both. `isDarkRef` mirrors state for sync canvas reads.
- Mouse + touch events both supported

## Tech notes
- Pure canvas — no Framer Motion, no DOM marks
- Root element uses inline `style={{ background }}` to switch canvas background per theme (intentional deviation from `bg-sand-950` convention)
- Mark type: `{ x, y, b, col, row }`; a parallel `grid[][]` structure is built alongside the flat `marks[]` array to support the neighbour connection lookup