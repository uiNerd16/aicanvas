# X Grid

## Brief
Component: X Grid
Slug: x-grid
Description: A canvas-based interactive background identical to Dot Grid, but each grid point is drawn as a small × mark instead of a dot.

## Visual
- Same 20px grid, same dark/light dual theme
- Each mark is a small × drawn with two 3px-arm diagonal lines (6px total span)
- Resting opacity: 0.13 dark / 0.25 light
- On hover: radial glow identical to Dot Grid — 130px radius, power-curve falloff, marks brighten up to 0.92 opacity
- Lit marks grow slightly (stroke width thickens from 1px → ~1.8px at peak)
- Centred label overlay: "X Grid" + "hover to illuminate"

## Behaviour
- Fast attack (0.16 lerp), slow release (0.07 lerp)
- ResizeObserver, DPR support, touch events
- isDark detection via [data-card-theme] pattern

## Tech notes
- Canvas only — no SVG, no DOM elements for the marks
- Draw each × with two ctx.beginPath() lines using ctx.strokeStyle + ctx.stroke()
- strokeWidth lerps with brightness: 1 + b * 0.8
- dualTheme: true in the registry
