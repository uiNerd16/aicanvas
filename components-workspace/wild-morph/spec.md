# Wild Morph

**Component:** Wild Morph
**Slug:** `wild-morph`
**design-system:** `standalone`

## Description
The word "wild" sits static on a warm off-white panel. Hovering near the text triggers an extreme corner-pin warp driven by the cursor's vertical half: upper half fans the top corners upward and outward; lower half fans the bottom corners downward and outward. Both enter and release use underdamped spring physics for a heavy-mass bounce.

## Visual
Italic Anton (synthesized oblique) in `#1a1a19` rendered as SVG text on a warm off-white panel (`#efeee6`, 92vw × 86vh) centered on a dark background (`#1a1a19`). Word is large — `clamp(64px, 12vw, 144px)`, `letterSpacing: -0.02em`. At rest, perfectly static and readable. Distortion is EXAGGERATED — corners travel ±1×W horizontally and ~1.5×H vertically.

## Behaviour
- **At rest:** Text static, no animation.
- **Hover zone:** A tight padding area (`2.5rem 3.5rem`) around the word — not the full panel.
- **Cursor in upper half of hover zone:** TOP-corner warp — TL & TR pull up + outward. BL & BR pinned. Targets: `tlX = -1.00·W`, `tlY = -1.55·H`, `trX = +1.05·W`, `trY = -1.48·H`.
- **Cursor in lower half of hover zone:** BOTTOM-corner warp — BL & BR pull down + outward. TL & TR pinned. Targets: `blX = -1.00·W`, `blY = +1.55·H`, `brX = +1.05·W`, `brY = +1.48·H`.
- **Crossing the midline mid-hover:** Current warp animates to zero, opposite warp engages. Seamless transition.
- **Cursor leaves hover zone:** All corners spring back to rest.
- **Spring physics (both enter and release):** `stiffness: 280, damping: 14 (enter) / 16 (release), mass: 1.8` — underdamped, produces 2-3 oscillations like a heavy mass settling.

## Mobile
Touch start/move drives mode from touch Y position. Touch end → rest. Word font-size clamps between 64px–144px via JS.

## Tech notes
- SVG `<text>` (not HTML span) so glyphs re-rasterize at screen resolution — stays crisp under extreme stretch.
- Anton font loaded via inline CSS `@import url(...)` for copy-paste portability.
- Warp technique: CSS `transform: matrix3d(...)` driven by a 2D quad-to-quad projective homography. Source rect `[(0,0),(w,0),(w,h),(0,h)]` mapped to target quad via 8×8 Gaussian elimination with partial pivoting. Eight Framer Motion `MotionValue`s (one X+Y per corner) drive the matrix imperatively per frame — no React re-renders.
- `transform-origin: 0 0` always. Other origins pre-shift input coords outside the homography's source domain.
- `perspective: 1400px` on the outer wrapper.
- `text` prop defaults to `'wild'`; any string works — SVG auto-sizes via `getBBox()`.
- No design tokens — raw hex values only.
