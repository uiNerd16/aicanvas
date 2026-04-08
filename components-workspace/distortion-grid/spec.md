# Distortion Grid

## Brief
Component: Distortion Grid
Slug: distortion-grid
Description: A canvas grid of thin lines that slowly undulate with large sweeping waves. Hovering pushes the grid outward from the cursor and amplifies the waves across the entire canvas, distorting the whole field.

## Visual (default)
- Grid of horizontal + vertical lines through displaced control points, SPACING 32px
- Layered low-frequency sine waves animate slowly over time — 1–2 visible undulations across the canvas
- Lines: 0.5px stroke, opacity 0.55 dark / 0.75 light
- No dots — pure lines only
- Dark bg: #110F0C / Light bg: #F5F1EA — dualTheme

## Visual (hover)
- Gaussian repulsion away from cursor (LOCAL_RADIUS 260px, LOCAL_AMP 60px)
- Lines push outward from the cursor leaving a void in the middle
- Global amplitude boost on hover (HOVER_BOOST 1.5 → waves grow ~2.5×)
- Smooth ease in/out: 0.018 attack / 0.010 release

## Tech notes
- 2D grid of rest positions, displaced each frame from layered sin/cos + time
- BASE_AMP=30, WAVE_FREQ=0.007 (low frequency, ~900px wavelength)
- t += 0.002 per frame — very slow drift
- Draw H-lines and V-lines through displaced points with ctx.lineTo
- Mouse tracked directly via ref, no React state in the loop
- ResizeObserver, DPR, zero-size guard, touch events
- isDark via [data-card-theme] pattern
- Label: "Distortion Grid" + "hover to warp"
