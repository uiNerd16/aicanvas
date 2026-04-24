# Halo Type

**Slug:** `halo-type`
**design-system:** `standalone`
**Status:** awaiting-integration (approved 2026-04-24)

## Description
A ring of kinetic text rotating in 3D — readable along the top arc, rotated 180° (upside-down) along the bottom as the back face of each glyph sweeps into view. One continuous loop.

## Text
```
COPY ✦ PASTE ✦ SHIP ✦ REPEAT ✦
```
Tiled around the ring, with `✦` separators rendered at `0.65×` the letter size so the stars feel subordinate to the words.

## Visual
- A single line of the phrase wrapped around a horizontal circle tilted `24°` toward the viewer on the X axis.
- Heavy display sans (Manrope weight 800 / `font-black`) in off-white on near-black by default.
- Back-arc letters read **upside-down (rotated 180°)** in a dimmer warm-gray — NOT mirror-flipped — via a twin glyph technique: each character has two overlaid spans, one upright for the front arc and one `rotateY(180deg) rotateZ(180deg)` so its front face shows when it's on the back arc and reads as `∀` instead of reversed-A.
- Soft radial vignette behind the ring.
- Horizontal edge mask on the wrapper (`linear-gradient 0%→18%→82%→100%`) so the left/right corners fade to transparent, hiding any residual seam pixels at the ±90° transition.

## Theme support (dualTheme)
- **Dark:** bg `#0A0A0A`, front `#F5F1E8`, back-twin `#7A756C`.
- **Light:** bg `#F5F1E8`, front `#0A0A0A`, back-twin `#6A655C`.
- Theme source: inline `useTheme` hook that observes `.dark` on `<html>` and `data-card-theme` on the nearest ancestor (so the preview card's per-card toggle works).

## Behaviour
- Ring spins around its Y axis at 14s per full turn, linear easing, infinite loop.
- **Hover / touch-hold:** rotation slows to `0.3×`. Tilt stays static (rest = hover = 24°). Release returns to full speed with a gentle spring.
- Per-letter opacity fade: each glyph's front twin gets `opacity = max(0, cos(effective_angle))` and the back twin gets `max(0, -cos(effective_angle))`, updated every animation frame via refs. This replaces `backface-visibility: hidden`, which shows pixel-shred artifacts at the ±90° seam.
- **`transformOrigin: 50% 50%`** on every glyph — critical, because `0 0` makes narrow letters end up at different 3D positions than wide letters at the same ring-angle.

## Geometry & spacing
- Ring radius = `min(w, h) * 0.35` (so diameter = 70% of the smaller dimension).
- Font size = `clamp(20, radius * 0.22, 48)` for letters; stars render at `0.65×` that.
- Per-character angular spacing is **proportional to measured advance widths** (not equal-angle). Widths come from a hidden set of `inline-block` spans — one per character, same fontFamily/weight/fontSize as the live glyph — measured with `getBoundingClientRect`. A `ResizeObserver` re-measures when the fallback font is swapped out for Manrope, so advance widths settle correctly even on late font loads.

## Mobile
- Container floors at 260px wide. Touch-start = engage, touch-end/cancel = release. Unified pointer handlers (`onPointerEnter/Leave/Down/Up/Cancel`) cover mouse AND touch.
- `touch-action: none` on the wrapper so the gesture doesn't scroll the page.

## Accessibility
- `prefers-reduced-motion: reduce` freezes the rotation at a constant `rotateY(30deg)` so both arcs are still visible but nothing moves.
- `aria-label` on the ring container reflects the phrase text.
- The hidden measuring span is `aria-hidden`.

## Tech notes
- `'use client'` + `// npm install framer-motion` at the top.
- Default export `HaloType`.
- Pure CSS 3D — no Three.js.
- Framer Motion for `useAnimationFrame`, `useMotionValue`, `useSpring`, `useTransform`. Rotation and engagement run entirely on MotionValues; per-letter opacity is set imperatively via refs (NOT through React's style prop) so re-renders don't flash letters to opacity 0.
- Raw hex only inside the component — no sand-*/olive-* tokens.
- `min-h-screen` root wrapper for copy-paste readiness.

## Acceptance checklist (shipped)
- [x] Upright text on the front arc, upside-down (rotated 180°, not mirrored) text on the back arc.
- [x] Smooth continuous spin, no judder.
- [x] Hover / touch-hold slows rotation to 0.3×, release restores to 1×.
- [x] Works and stays legible at 320px width.
- [x] Both themes look crafted.
- [x] No design tokens inside the component.
- [x] Default export, `min-h-screen` wrapper, install comment.
- [x] Narrow letters (I, space) and wide letters (W, M) sit on the same ring radius.
- [x] Star separators render at 0.65× letter size.
