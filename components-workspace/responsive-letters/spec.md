# Responsive Letters

**Component:** Responsive Letters  
**Slug:** `responsive-letters`  
**design-system:** `standalone`

## Description
Interactive text where each letter responds individually to hover proximity, animating variable font properties (weight, width) to create a "deformation under pressure" effect.

## Visual
A headline-sized text block (or customizable size). Text appears in a clean variable font. No initial animation—static and readable.

## Behaviour
On hover, the cursor's proximity to each letter individually triggers that letter to animate its font weight and width. Letters near the cursor compress/expand/bold more dramatically; letters farther away respond subtly or not at all. The effect is smooth and continuous as the cursor moves across the text. On mouse leave, letters ease back to their default state.

## Mobile
On touch, no hover effect (hover is mouse-only). Component responds to mouse/cursor interaction only. Touch handlers are present but do not trigger the deformation animation.

## Tech notes
Requires a variable font supporting at least `weight` and `width` axes. Uses Framer Motion for per-letter animation. Each letter gets its own motion value based on distance calculation from cursor.
