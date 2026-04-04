# Circle Field

## Brief
Component: Circle Field
Slug: circle-field
Description: Randomly scattered outline circles (no fill) that illuminate on hover — each lit circle reveals a concentric inner ring and outer ring, like a target appearing in the glow.

## Visual
- Same random placement + density as Noise Background (~1 per 250px², MAX_DOTS cap at 3000)
- Each circle: radius 3px, stroke 0.5px, no fill
- Resting opacity: 0.18 dark / 0.28 light
- On hover (Gaussian glow): base circle brightens to PEAK_A 0.65, inner ring (r=1.5px, alpha=b×0.5), outer ring (r=7px, alpha=b×0.40)
- No connection lines
- Centred label: "Circle Field" + "hover to illuminate"
- Dark bg: #110F0C / Light bg: #F5F1EA — dualTheme

## Behaviour
- Fast attack (0.16 lerp), slow release (0.07 lerp)
- Gaussian falloff: exp(−dist² / R²×0.25), RADIUS = 200
- ResizeObserver, DPR, touch events, zero-size guard
- isDark detection via [data-card-theme] pattern

## Tech notes
- Draw order per circle: inner ring → outer ring → base circle
- All drawn with ctx.arc() + ctx.stroke(), no fill
- dualTheme: true in registry
