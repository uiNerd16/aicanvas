# Sphere Lines

## Brief
Component: Sphere Lines
Slug: sphere-lines
Description: The Wave Lines component wrapped around a spinning 3D globe — latitude lines deformed by layered sine waves, continuously rotating, with hover amplifying the surface distortion.

## Visual (default)
- 38 latitude lines drawn as sampled curves on a sphere of radius 42% of min(cw, ch)
- Each latitude traces a full 360° circle; wave displacement applied in Y:
  wave = AMP * sin(θ_rot * WAVE_FREQ_T + φ * WAVE_FREQ_P + t) + secondary wave
  WAVE_FREQ_T=1.5, WAVE_FREQ_P=2.2, WAVE_AMP=0.20 × R
- Sphere spins continuously: rot += 0.005 rad/frame
- Wave evolves slowly: t += 0.004
- Two rendering passes per line:
  - Back hemisphere: dim alpha (0.07), 0.5px
  - Front hemisphere: bright alpha (0.72), 0.8px — gives X-ray globe look
- Front pass uses quadratic midpoint curves for smooth lines
- Circular clip path at radius R
- Dark bg: #110F0C / Light bg: #F5F1EA — dualTheme

## Visual (hover)
- Global wave amplitude boost: HOVER_BOOST=2.8 (waves become nearly 3× deeper)
- Gaussian repulsion from cursor (LOCAL_AMP=45px, LOCAL_RADIUS=150px) applied in 2D projected space
- Ease in/out: 0.018 attack / 0.010 release

## Tech notes
- No stored lat/lon arrays — recomputed each frame
- Points precomputed into Float32Arrays (xs, ys, zs) per latitude for two-pass drawing
- Front pass: draw segments where z3 >= 0, moveTo on re-entry after back portion
- ResizeObserver, DPR, zero-size guard, touch events
- isDark via [data-card-theme] pattern
- Label: "Sphere Lines" + "hover to warp"
