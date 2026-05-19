# Component Spec

## Brief

**Component:** Pivot Cube
**Slug:** pivot-cube
**design-system:** standalone
**Description:** A 3D image cube that rotates on both X and Y axes via drag, snapping to whichever of its six faces lands nearest the front.

## Visual

A cube floating in the center of a dark page, soft vignette behind it, drop shadow beneath. Each of the 6 faces shows a full-bleed placeholder image with a small caption tag in the corner ("01 / 06", "02 / 06", through "06 / 06"). At rest the cube is tilted ~8 degrees on X and Y so three faces are visible at once, conveying depth.

The container background is its own dark surface (raw color, not a token), with a subtle radial vignette behind the cube so it feels lit.

## Behaviour

- **Drag horizontally** rotates the Y axis. **Drag vertically** rotates the X axis. Diagonal drag combines both.
- **Release** triggers spring physics that snap to the nearest 90 degree face on each axis independently. The face whose normal points most directly at the camera becomes the new "front."
- **Four directional chevrons** around the cube (up, down, left, right) rotate it one face in that direction with the same spring animation.
- During rotation, multiple faces are visible at an angle, true 3D perspective.
- **Hover** state: cube lifts ~4px, shadow deepens.
- Rotation wraps infinitely in any direction.

## Mobile

Touch drag works identically on both axes. Chevron buttons grow to 44x44px touch targets and reposition closer to the cube on narrow screens. Cube width scales to ~70vw under 600px wide so it fits comfortably.

## Tech notes

- **Framer Motion** only. Two MotionValues (`rotateX`, `rotateY`) driven by drag deltas via `useMotionValue` + `useTransform`.
- Snap on release using `animate()` to the nearest multiple of 90 degrees per axis.
- **6 placeholder images** via `picsum.photos` with deterministic seeds (e.g. `https://picsum.photos/seed/pivot-1/600/600`) so the component is copy-paste ready with no external asset folder.
- Component owns its dark background. No theme adaptation.
- No video, no keyboard navigation, no auto-play, no dot indicator.
- Default export, `min-h-screen` wrapper, raw color values (no sand-*/olive-* tokens per standalone rules).

## Approval

- [x] Approved by user on: 2026-05-19
