# Ripple Type

**Slug:** `ripple-type`
**design-system:** `standalone`
**Status:** approved (2026-04-27)

## Description
A single display word ("RIPPLE") rendered as SVG text with an animated turbulence + displacement-map filter, paired with a small mechanical fan icon. Click the fan to toggle the ripple on or off — the blades spin, the displacement amplitude ramps up, the noise pattern continuously morphs, and the word leans with a subtle skew. Click again and the effect decays back to a still word.

## Text
A single word, declared as a top-of-file constant: `const WORD = 'RIPPLE'`. Centered horizontally inside its own SVG box and vertically aligned with the fan icon.

## Visual
- **Layout:** the fan icon and the word sit side-by-side in a single horizontal row. They are vertically and horizontally centered as a unit inside the viewport.
- **Word:** ultra-heavy display sans (system fallback stack, weight 900), `font-size: 140`, `letter-spacing: -0.04em`. Rendered inside an SVG with `viewBox="0 0 500 180"`, `text-anchor="middle"`, `x="250"`, `y="140"`. SVG `width: min(55vw, 500px)`, `overflow: visible`.
- **Fan icon:** SVG, `viewBox="0 0 100 100"`, sized fluidly via `width/height: clamp(56px, 11vw, 112px)`. Three concentric grille circles (r=38 stroke=2 opacity 0.85; r=30 stroke=1 opacity 0.35; r=22 stroke=1 opacity 0.25). Three petal-shaped blades at 0°/120°/240° rotated as a group around `(50, 50)`. Hub disc on top. The whole icon has a subtle 3D tilt: `transform: perspective(220px) rotateY(38deg)`.
- **OFF/ON label:** below the fan, weight 700, `font-size: 11`, `letter-spacing: 0.18em`, color `#EF4444` when off / `#22C55E` when on, with a 0.4s color transition.
- **Filter chain:** `<filter>` with `<feTurbulence type="fractalNoise" baseFrequency={REST_FREQ} numOctaves={1} seed={4}>` feeding `<feDisplacementMap in="SourceGraphic" in2="noise" scale={0} xChannelSelector="R" yChannelSelector="G">`. The `baseFrequency` and `scale` are mutated via refs each animation frame.
- **Vignette:** subtle full-bleed radial gradient overlay (foreground colour at low alpha, fading to transparent), `pointerEvents: none`.

## Theme support (dualTheme)
- **Dark:** bg `#0A0A0A`, fg + fan stroke `#EFEEE6`.
- **Light:** bg `#EFEEE6`, fg + fan stroke `#0A0A0A`.
- Vignette uses the foreground colour at ~0.05 alpha in light, ~0.06 in dark, fading to the background colour.
- Theme is read from a parent element's `data-card-theme="dark|light"` (the AI Canvas component card sets this), with a fallback to `document.documentElement.classList.contains('dark')`. Updates are observed via a chain of `MutationObserver`s on every ancestor.

## Behaviour
- **Toggle on/off:** clicking the fan toggles `fanOn`. The fan element is a `role="button"` with `aria-pressed`, `tabIndex={0}`, and Space/Enter keyboard activation.
- **Intensity ramp:** an internal `levelRef` advances `+1.0/sec` while ON (capped at `LEVEL_COUNT = 1`), and decays `-2.5/sec` while OFF. Normalised `intensity = level / LEVEL_COUNT` drives the displacement amplitude, the blade spin rate, the skew angle, and the rate at which the noise phase advances.
- **Continuous breathing:** a sine wave at `OSCILLATION_HZ = 0.09` modulates the noise frequency by ±0.004, scaled by intensity, so the ripple feels alive even at steady-state ON.
- **Phase morphing:** `ripplePhaseRef` advances at `RIPPLE_PHASE_RATE = 0.9 rad/sec * intensity`. Two offset sines on X and Y noise frequency keep the pattern continuously evolving with no texture seam.
- **Displacement amplitude:** `scale = intensity * MAX_SCALE`, where `MAX_SCALE = 36` at peak. Reduced-motion clamps the peak to `14`.
- **Skew:** the text SVG receives a `skewX(intensity * 13deg)` transform that ramps in with intensity. Reduced-motion sets skew to `0deg`.
- **Blade spin:** `FAN_FULL_RATE = 2π / 0.6s` (~10.47 rad/s), gated by intensity so blades accelerate as the ripple builds. Reduced-motion uses `2π / 2.0s`.
- **Reduced-motion:** when `prefers-reduced-motion: reduce` is set, peak displacement is 14 (vs 36), skew is 0, blade spin uses the slower rate.
- **No drag, no scrub.** Click-only (and keyboard).

## Mobile
- **Single-row layout at all widths.** No column stacking. Both the fan and the text scale fluidly via `clamp()`.
- Fan size: `clamp(56px, 11vw, 112px)`. Gap between fan and text: `clamp(14px, 3vw, 32px)`. Text SVG width: `min(55vw, 500px)`.
- Tested at 320px — fits one row; SVG `overflow: visible` keeps the displaced edges from being clipped.
- Touch tap on the fan toggles the same as click; `touchAction: 'manipulation'` is set to suppress 300ms tap delay.

## Tech notes
- `'use client'` + `// npm install framer-motion react`.
- Default export `RippleType` (matches folder name in PascalCase).
- Root: `relative min-h-screen w-full overflow-hidden`, background colour set inline per theme.
- The fan and text are placed in a single `position: absolute; inset: 0` flex container with `flexDirection: row`, `alignItems: center`, `justifyContent: center`.
- Animation: a single `useAnimationFrame` from `framer-motion` mutates filter attributes via refs (`turbRef.setAttribute('baseFrequency', …)`, `dispRef.setAttribute('scale', …)`), the text SVG's transform, and the blades group's transform. No React state is updated per-frame.
- `dt` is clamped to `[0, 0.05]` so a backgrounded tab doesn't snap on resume.
- Filter ID is uniquified per instance via `useId()` with colons stripped — multiple ripple instances on a page won't collide.
- Imports: `React, { useEffect, useId, useRef, useState }` from `react`; `useAnimationFrame, useMotionValue, useSpring` from `framer-motion` (only `useAnimationFrame` is currently used; the other two are imported but unused — safe to leave).
- Raw hex colours only — no design tokens (this is a standalone, not a design-system component).

## Acceptance checklist
- [x] Word ripples and morphs continuously when ON; settles smoothly when OFF.
- [x] Click fan toggles state; OFF/ON label changes colour; blades spin proportionally to intensity.
- [x] Word leans (skew) at peak intensity; returns to 0° when ramped down.
- [x] Dark and light modes both feel crafted.
- [x] Single-row layout holds from 320px up to wide desktop.
- [x] Reduced-motion: lower peak amplitude, no skew, slower blade spin.
- [x] Default export, `min-h-screen` wrapper, install comment present.
