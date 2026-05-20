# Component Spec

## Brief

**Component:** Cube Carousel
**Slug:** cube-carousel
**design-system:** standalone
**Description:** An interactive 3D photo cube with six placeholder images on its faces. Drag with your cursor to spin it freely on both axes; release and it coasts naturally to a stop. No buttons, no snap, no controls, just the cube and your hand.

## Visual

A flat 3D box floating in the center of a dark page (light page in light mode), soft vignette behind it and a blurred drop shadow beneath. Dimensions are W : H : D = 16 : 9 : 9, so the four "horizontal" faces (front, back, top, bottom) are 16:9 and the two side caps are square. Each face shows a full-bleed photograph with a subtle inset vignette darkening the rim. The rim shadow sells the corners as soft 3D lighting rather than carved cutouts.

Six Unsplash photographs ship as the demo set: blue/white 3D render (Sebastian Svenson), background pattern (Galina Nelyubova), yellow balloons (Milad Fakurian), logo (S. Baker), blue glass object (Muriel Liu), pink/grey waves (Pawel Czerwinski).

## Behaviour

- **Drag** on the cube to rotate it. Horizontal drag rotates the Y axis; vertical drag rotates the X axis. Diagonal drag combines both.
- **No snap.** When you release, the cube coasts briefly in the direction of release velocity (a soft spring projection of ~180ms of motion) and settles wherever it lands. There is no "nearest face" snap.
- **No buttons.** Drag is the only interaction.
- In-flight coast animations cancel the moment you grab the cube again, so a second drag always tracks your pointer cleanly.

## Mobile

Touch drag identical to mouse drag on both axes. The cube scales fluidly via clamp(): width clamps from 210px on narrow screens up to 420px on wide ones, height stays at 9/16 of the width.

## Tech notes

- **Framer Motion only.** `useMotionValue` for `rotateX` / `rotateY`, `motion.div` for the cube, `onPan` / `onPanStart` / `onPanEnd` for drag (NOT raw pointer events. Pan uses window-level listeners so it can't wedge on lost pointer capture).
- **Pan handlers live on a separate flat 2D shield**, not on the rotating cube. The cube has `pointerEvents: 'none'`. The shield is an `absolute inset-0 z-10` overlay that never rotates, so its hit area is a constant 2D rectangle. Without this, hit-testing on the 3D-transformed cube fails at certain edge-on angles (backface-visibility rounds the wrong way) and the cube becomes unresponsive to drag at those orientations.
- Release coast uses `animate(value, target, { type: 'spring', stiffness: 40, damping: 22, velocity })`.
- Six face divs absolutely positioned. Four wide (W × H) at front/back/top/bottom, two square (D × H, D=H) at left/right. Each face has an inset `box-shadow` vignette overlay.
- Component owns its dark background via raw hex (`bg-[#E8E8DF] dark:bg-[#1A1A19]`), no sand-*/olive-* tokens per standalone rules.
- No video, no keyboard navigation, no auto-play, no dot indicator, no chevron buttons.
- Default export, `min-h-screen` wrapper, single root element.

## Approval

- [x] Approved by user on: 2026-05-20
