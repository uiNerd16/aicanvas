# Peel-Corner Reveal Card

- **Slug:** peel-corner-reveal
- **design-system:** standalone

## Description
A portrait poster-card whose bottom-right corner peels back along a diagonal fold on hover/tap, revealing Wi-Fi credentials underneath.

## Visual
- Portrait card, bold poster aesthetic, sitting at a subtle tilt on a neutral stage
- Front face: large stacked display type `Free` / `Wi-Fi` centered, small uppercase `Tap In` label pinned top-left
- Bottom-right corner is already lifted at rest — a small triangular flap folded along its diagonal hypotenuse, hinting at a vibrant colored underside
  - Proposed palette: warm coral / orange-red accent against a cream / off-white card
- Underside (revealed): accent color background with two small uppercase label/value rows:
  - `Network` — `SlowBrew_4G`
  - `Password` — `n0tY0urL4pt0p`
- Subtle gradient band along the fold line to suggest paper thickness
- Soft drop shadow beneath the flap; deepens as it peels

## Behaviour
- **Rest:** card at a gentle tilt, corner pre-lifted ~15% of its travel
- **Hover (desktop) / tap (touch):** flap rotates along its diagonal hypotenuse, exposing the full triangular underside; card lifts slightly and shadow deepens
- Spring-based motion — papery, not linear
- Fully reversible
- **Touch:** tap to open, tap again (or tap outside) to close; no hover traps on mobile
- **No layout shift** — card footprint stays constant

## Mobile
- Tap-to-toggle with single-tap open and second-tap/outside-tap close
- Card scales proportionally; fold angle and text remain legible down to ~320px viewport width
- No hover-only affordances

## Tech notes
- Framer Motion springs for flap rotation and card lift
- Flap = triangle with a front face (matching card) and a back face (accent + reveal text)
  - Implement via CSS 3D transform (rotate3d along the diagonal) with `backface-visibility`, or two stacked triangles whose opacities cross-fade as the fold progresses — pick whichever reads as more paper-like
- `clip-path` triangle on the front card to hide the same corner area so the flap is the only thing visible in that region
- Self-contained: default export, `min-h-screen` wrapper centering the card, no deps beyond `framer-motion`
- Raw color values only (no `sand-*` / `olive-*` tokens — standalone rules)

## Acceptance criteria
- Peel animates smoothly on desktop hover and mobile tap
- Works on touch devices (tap to open, tap again to close)
- No layout shift; card footprint stays stable
- Text on both the front and the reveal is legible and well-contrasted
- Component is self-contained and drops in without extra setup
