# Good Vibes

**Component:** Good Vibes  
**Slug:** `good-vibes`  
**design-system:** `standalone`

## Description
Interactive typography where letters respond to cursor proximity by becoming thinner while scaling larger—inverse weight-to-size effect.

## Visual
Large text reading "GOOD VIBES" in Science Gothic. Orange/amber accent color on dark charcoal background. Default state: bold (weight 900), normal size.

## Behaviour
Cursor-proximity based animation (similar to responsive-letters):
- Each letter responds individually based on distance from cursor
- Weight animates from **900 (bold) → 100 (thin)** as cursor approaches
- Size scales up to **2x** at maximum influence
- Smooth continuous animation as cursor moves; eases back to default on cursor leave
- Influence radius: ~300px

## Mobile
Tap the text to trigger the animation once, then reset.

## Tech notes
- Science Gothic font (same as responsive-letters)
- Cursor-proximity per-letter animation using requestAnimationFrame
- Dark charcoal background with warm orange/amber text accent
- Colors from charcoal palette (dark background ~#233d4d or darker, text accent orange/amber)
