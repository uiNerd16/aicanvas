# Grid Lines

## Brief
Component: Grid Lines
Slug: grid-lines
Description: A canvas grid of dots connected by thin horizontal and vertical lines. On hover, dots and lines illuminate — and small bright particles travel along the line paths between intersections, staggered and looping.

## Visual (default)
- 20px grid, dots at every intersection — same as Dot Grid
- Dots: 1px, BASE_A 0.13 dark / 0.25 light
- Lines: 0.5px strokes at rest opacity 0.07 dark / 0.12 light

## Visual (hover)
- Gaussian glow, RADIUS 160
- Dots brighten (PEAK_A 0.92, same lerp as Dot Grid)
- Lines brighten proportional to average brightness of their two endpoints
- Travelling particles: 1.5px dot moving along each active segment 0→100%, speed proportional to segment brightness, resets with short invisible gap, random phase offsets for stagger

## Colors
- Identical to Dot Grid: #110F0C dark / #F5F1EA light, rgba(255,255,255) dark / rgba(28,25,22) light
- dualTheme: true

## Tech notes
- Segment type: { a: Dot, b: Dot, phase: number }
- H-segments and V-segments built separately in build()
- Phase advances each frame when segment brightness > 0.06
- Particle at interpolated position, alpha = segBrightness * 0.9
- Draw order: lines → particles → dots (dots on top)
- ResizeObserver, DPR, touch, zero-size guard
- Label: "Grid Lines" + "hover to illuminate"
