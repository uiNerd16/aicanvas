# Stack Tower

**Slug:** `stack-tower`
**design-system:** `standalone`
**Status:** built (2026-04-24)

## Description
A vertical column of 12 stacked text rows that reads as a 3D cylinder rotating around its vertical axis — built entirely from 2D transforms (translateX + skewX + scale per row). Each row's phase is offset from the one above, so the "rotation" appears to travel down the stack. Hover highlights one row in a warm orange accent without disturbing the motion rhythm.

## Text
Two alternating words: `STACK` and `TOWER` (top-of-file `WORDS` constant). Rendered on `ROW_COUNT = 12` stacked rows; row `i` renders `WORDS[i % 2]`.

## Visual
- 12 rows stacked vertically, centered inside the viewport.
- Heavy display sans (`font-family` falls back through `var(--font-sans)` → system), `fontWeight: 900`, `fontSize: clamp(1.75rem, 9vw, 4.5rem)`, `lineHeight: 0.92`, `letter-spacing: -0.03em`, `whiteSpace: nowrap`.
- Per-row transform derives from a phase MotionValue:
  - `local = phase * 2π + rowIndex * 0.35`
  - `scaleX = 0.55 + 0.45 * cos(local)` (0.10 → 1.00 → 0.10)
  - `shiftX = sin(local) * 22px`
  - `skewX = sin(local) * 6°`
- Color is a `cos`-driven mix between `dim` and `fg` — front-facing rows bright, back-facing rows dim.
- Top + bottom gradient fades (22% tall each) for the "infinite cylinder" read.

## Theme support (dualTheme)
- **Dark:** bg `#0A0A0A`, fg `#EFEEE6`, dim-face `#3A3936`.
- **Light:** bg `#EFEEE6`, fg `#0A0A0A`, dim-face `#C7C3B8`.
- **Hover accent (both themes):** `#F16D14` (warm orange).

## Behaviour
- Continuous rotation: `phase` advances linearly (all rows, same rate — hover does NOT modulate speed). `SECONDS_PER_CYCLE = 5`.
- One `useAnimationFrame` in the parent drives every row's phase and hover ease.
- **Hover / touch on a specific row:**
  - Only the exact row being hovered reacts.
  - Its color eases from the phase-driven base into the orange accent (`#F16D14`).
  - Its scale bumps by `+10%` (both X and Y, on top of the baseline scaleX).
  - Easing rate: `HOVER_EASE_RATE = 10 /s`, frame-rate-independent via `α = 1 − exp(−rate · dt)`.
- All other rows — including other instances of the same word — continue unchanged.
- Release: accent + scale bump ease back to rest.
- **Hover state lives in a ref, not state** — no React re-renders on hover change, so the rotation stays silky smooth.

## Mobile
- Row font-size: `clamp(1.75rem, 9vw, 4.5rem)` keeps text legible from 320px up.
- Row height auto-derives from font-size so total stack height stays bounded.
- Each row wraps its `<motion.div>` in an outer pointer-target `<div>` (`width: 100%`, flex-centered, `cursor: pointer`, `touchAction: none`) so the hit area stays a stable rectangle regardless of how small `scaleX` shrinks.
- Touch-start on a row = highlight. Touch-end/cancel = release.

## Tech notes
- `'use client'` + `// npm install framer-motion`.
- Default export `StackTower`.
- Root wrapper: `flex min-h-screen w-full items-center justify-center overflow-hidden`, bg inline per theme.
- MotionValues created via `useMemo(() => Array.from({length: ROW_COUNT}, () => motionValue(0)), [])` — the plain `motionValue` factory, not the hook.
- Per-row transforms via `useTransform([phase, hover], ...)` on motion values.
- Reduced-motion: freeze each row at `phase = 0.2 + rowIndex * 0.03` so the stagger is visible but nothing moves.
- Raw hex only inside the component (no sand-*/olive-* tokens).

## Acceptance checklist
- [x] Stack reads as a rotating cylinder despite being pure 2D.
- [x] Rotation travels down the stack (phase offset per row), not in lockstep.
- [x] Top + bottom fades sell the infinite-column feel.
- [x] Hover highlights one specific row in orange; scale bumps; motion rhythm untouched.
- [x] Hover tracked via ref — rotation stays smooth through hover changes.
- [x] Legible at 320px width.
- [x] Dark and light modes both feel crafted.
- [x] Default export, `min-h-screen` wrapper, install comment.
