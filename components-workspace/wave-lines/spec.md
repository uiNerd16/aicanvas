# Wave Lines

## Brief
Component: Wave Lines
Slug: wave-lines
Description: Dense vertical lines deformed by a slow, large-amplitude sine wave that ripples across the canvas. Hovering pushes lines outward from the cursor, deepening the wave.

## Visual (default)
- Vertical lines only — no horizontal lines, no grid
- SPACING 8px between lines, lineWidth 0.8px
- Each line is a sampled sine curve: x-displacement varies with Y position
- Formula: dx = AMP * sin(ry * FREQ_Y + rx * FREQ_X + t)
  - FREQ_Y drives the curve shape along each line (~1.5 waves top to bottom)
  - FREQ_X creates a phase offset per column — produces the rippling / bunching effect
- AMP 44px — high amplitude, dramatic curves
- Animation: t += 0.003 — very slow drift
- Opacity: 0.55 dark / 0.75 light — lines clearly visible
- Dark bg: #110F0C / Light bg: #F5F1EA — dualTheme

## Visual (hover)
- Gaussian repulsion from cursor (LOCAL_RADIUS 220px, LOCAL_AMP 58px)
- Lines part away from cursor in all directions
- Global amplitude boost on hover (HOVER_BOOST 1.3 — waves grow to ~57px)
- Smooth ease in/out: 0.018 attack / 0.010 release

## Tech notes
- Sample each line every ROW_STEP=4px vertically for smooth curves
- cols = Math.ceil(cw / SPACING) + 2, rows = Math.ceil(ch / ROW_STEP) + 1
- ox = (cw % SPACING) / 2 — centre the grid
- Draw one ctx.beginPath per column, moveTo first point, lineTo rest, stroke
- isDark via [data-card-theme] pattern
- ResizeObserver, DPR, zero-size guard, touch events
- Label: "Wave Lines" + "hover to fold"
