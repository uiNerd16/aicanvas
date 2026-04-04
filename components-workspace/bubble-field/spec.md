# Bubble Field

## Brief
Component: Bubble Field
Slug: bubble-field
Description: Randomly scattered outline circles that burst on hover — expanding outward and fading to near-transparent, like soap bubbles popping under the cursor.

## Visual
- Same random placement + density as Noise Background (~1 per 250px², MAX_DOTS cap 3000)
- Each circle rests at radius 3px, stroke 0.5px, opacity ~0.22
- On hover (Gaussian glow, RADIUS 200): circles EXPAND and FADE simultaneously:
  - Radius: r = 3 + b × 16 (3px → 19px at peak)
  - Opacity: alpha = 0.22 × (1 − b × 0.88) (~0.22 → ~0.026)
- Near cursor: large and ghostly (burst). Further: mid-size, semi-transparent. Edge: small, opaque.
- Slow release (0.07 lerp) shrinks and restores — bubbles "reform"
- No connection lines, no rings
- Centred label: "Bubble Field" + "hover to burst"
- Dark bg: #110F0C / Light bg: #F5F1EA — dualTheme

## Tech notes
- All ctx.arc() + ctx.stroke(), no fill
- Radius and alpha both derived from c.b each frame
- dualTheme: true
