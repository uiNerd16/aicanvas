# Wave Grid

## Brief
Component: Wave Grid
Slug: wave-grid
Description: A canvas grid of thin lines that continuously undulate with layered sine waves. Hovering pulls the grid fabric toward the cursor, amplifying the distortion into organic warps and bulges.

## Visual (default)
- Grid of lines through displaced control points, SPACING 32px
- Layered sine waves animate slowly over time — subtle constant wiggle
- Lines: 0.5px stroke, opacity 0.18 dark / 0.28 light
- No dots — pure lines only
- Dark bg: #110F0C / Light bg: #F5F1EA — dualTheme

## Visual (hover)
- Gaussian pull toward cursor (RADIUS 180px), strength 24px at centre
- Lines converge toward cursor — fabric pinch/pull effect
- Base wiggle amplitude also increases near cursor

## Tech notes
- 2D grid of rest positions, displaced each frame from sin/cos + time
- Draw H-lines and V-lines through displaced points with ctx.lineTo
- Mouse tracked directly, decays on leave via lerped target
- ResizeObserver, DPR, zero-size guard, touch events
- isDark via [data-card-theme] pattern
- Label: "Wave Grid" + "hover to warp"
