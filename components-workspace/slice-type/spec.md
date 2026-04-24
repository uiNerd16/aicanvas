# Slice Type

**Slug:** `slice-type`
**design-system:** `standalone`
**Status:** built (2026-04-24)

## Description
A two-word lexical illusion. At rest you see the top half of `LIGHT` fused with the bottom half of `NIGHT` — the shared I/G/H/T letters align invisibly, the L and N collide at the seam into an ambiguous hybrid glyph. On hover the top word lifts up and the bottom word sinks down, both words fully revealed. The motion is the reveal; the typography is the punchline.

## Text
Two words, top-of-file constants:
- Top word: `LIGHT`
- Bottom word: `NIGHT`

They're chosen because their last four letters are identical — only the leading glyph differs — so when clipped at the midline and overlaid, the shared tail aligns perfectly and the leading glyph becomes an L/N hybrid.

## Visual
- One giant heavy display sans word, font-black (900), negative letter-spacing (~`-0.04em`), centered in the viewport.
- Two overlaid copies of the word render in the same bounding box:
  - **Top layer (LIGHT)** clipped with `clip-path: inset(0 0 50% 0)` — only the upper half of the letters is visible.
  - **Bottom layer (NIGHT)** clipped with `clip-path: inset(50% 0 0 0)` — only the lower half is visible.
- Both layers are **right-aligned** inside a container whose width equals the wider word (NIGHT), so the shared `IGHT` tail aligns exactly between top and bottom. The L/N difference reveals itself only at the left edge.

## Theme support (dualTheme)
- **Dark:** bg `#0A0A0A`, fg `#EFEEE6`.
- **Light:** bg `#EFEEE6`, fg `#0A0A0A`.
- Both words use the same fg — no color split between LIGHT/NIGHT.

## Behaviour
- **Rest:** static hybrid glyph. No continuous motion — the stillness makes the illusion read as a real word.
- **Intro teaser (on mount, once):** after a brief delay the words ease apart to ~65% open, hold for ~1.2s, then ease back closed. Teaches the interaction without words.
- **Hover / touch-hold (engage = 1):**
  - Top word's clip opens from `inset(0 0 50% 0)` → `inset(0 0 0% 0)`.
  - Top word translates up by `-65%` of its height.
  - Bottom word's clip opens from `inset(50% 0 0 0)` → `inset(0% 0 0 0)`.
  - Bottom word translates down by `+65%` of its height.
  - Result: both words are fully visible, stacked with a small gap between them.
- **Release:** words spring back to the hybrid position.
- Spring: stiffness 140, damping 18, mass 0.9 — crisp but not bouncy.

## Mobile
- Font-size: `clamp(3.5rem, 18vw, 11rem)` — scales from 320px up.
- `touchAction: 'none'` so touch gestures don't scroll the page.
- Touch-start / hold = engage. Touch-end / cancel = release.
- Both words must remain readable at 320px.

## Tech notes
- `'use client'` + `// npm install framer-motion react`.
- Default export `SliceType`.
- Root: `flex min-h-screen w-full items-center justify-center overflow-hidden`, bg inline per theme.
- Two absolutely-positioned `<motion.span>`s share a relative wrapper. The wrapper has a hidden spacer `<span>` rendering the wider word (`NIGHT`) so it's the correct width for right-alignment.
- `clipPath` animated as a `MotionValue<string>` via `useTransform` on an engagement MotionValue (0 → 1).
- `y` (translateY) animated similarly.
- Engagement is a spring-wrapped MotionValue so the transition feels organic.
- Reduced-motion: skip the intro teaser entirely; hover still works normally.
- Raw hex only.

## Acceptance checklist
- [x] At rest the hybrid glyph reads as a single ambiguous word.
- [x] On hover both words lift apart and each is fully readable.
- [x] Intro teaser plays once on mount to teach the interaction.
- [x] Shared `IGHT` letters align perfectly between the two layers.
- [x] Smooth spring transition — no snap or visual tearing at the seam.
- [x] Legible at 320px width.
- [x] Dark and light modes both feel crafted.
- [x] Default export, `min-h-screen` wrapper, install comment.
