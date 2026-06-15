# Mood Tracker — spec

- **Slug:** `mood-tracker`
- **design-system:** standalone
- **Status:** visually approved 2026-06-14 (synced to shipped state)

## Description
A "How are you feeling?" mood check-in card. Drag the slider (or tap a face) through six
expressive character moods and the big face, the feeling word, and the card's colors all
shift with how you feel. Hit Save to record it. No abstract score — you express a feeling.

## The six moods (inline SVG characters, distinct shape + color + expression)
Slider/legend order: Frustrated → Surprised → Happy → Uneasy → Sad → Anxious.
1. **Frustrated** — rounded-square, red `#CB5E3E`; angry V-brows + tense mouth.
2. **Surprised** — scalloped flower/cloud, tan `#E5A85E`; wide round eyes + "o" mouth.
3. **Happy** — circle, yellow `#F2D44E`; arc smiling eyes + grin + rosy cheeks.
4. **Uneasy** — lumpy wavy blob, green `#A9C95E`; worried eyes + squiggly mouth.
5. **Sad** — dome, light blue `#8AC7D8`; downturned teary eyes + frown.
6. **Anxious** — rounded diamond, lavender `#BA8FD4`; worried slanted brows + small frown.

## Visual
- One rounded card, light + dark themed. Header: "How are you feeling?" + a "Today · N-day
  streak" subtitle, with a **Save button** top-right.
- **Focal panel**: a soft, airy liquid gradient built from light/desaturated tints of the
  CURRENT mood's color (pastel-lerped toward white in light, a soft muted tint in dark) —
  harmonious with the face but with enough contrast for it to pop. Holds the **big current-mood
  SVG** + the **feeling word** (deep mood-tinted ink, AA-legible). No number.
- **Whole card reflects the mood**: a faint same-hue tint on the card surface + a soft ambient
  glow behind the panel, all lerping smoothly as the mood changes.
- **Segmented mood slider**: a track split into the six mood colors with a draggable handle
  that snaps across the six stops.
- **Legend**: a clean centered row of the six mood faces as tappable buttons (quick-pick;
  active one highlighted). No counts.

## Behaviour
- Drag the slider / tap a face → the big SVG crossfades + springs in, the feeling word
  crossfades, and the gradient + card wash + accents lerp to the new mood color. Mesh keeps
  drifting at rest; gentle entrance on mount.
- **Save button**: idle "Save" (hover lift, pointer-only) → on click morphs to a green check +
  "Recorded" (~1.6s, scale pop) → reverts; re-clicks blocked while confirming; announced via
  aria-live.

## Mobile / a11y
- Fluid, works at 320px; slider ≥44px touch + keyboard (Arrows move moods, Home/End to ends),
  `aria-valuetext` = current feeling; legend + Save are real buttons with labels (Save flips to
  "Mood recorded"); decorative SVG parts `aria-hidden`. `clamp()` on the big face.
- `prefers-reduced-motion`: drift frozen, crossfades/pop/glow lerp instant.

## Tech notes
- Liquid gradient via layered blurred radial blobs (Framer Motion), mood-tinted with hex-lerp
  helpers. Six inline SVG characters + inline Save/check/bookmark icons — **no icon dependency**.
  `dualTheme` via the inlined **card-wrapper-aware** `useTheme` (`closest('[data-card-theme]')`
  + `<html>` fallback, observe both — mistake #009). Raw hex, no sand/olive tokens. Copy-paste
  ready: default export `MoodTracker`, `min-h-screen` root only, `items-center`,
  `// npm install framer-motion`. Type scale 10/12/14/16/20/24/28 (+ large face), 2/4px grid.

## Tags
- `Cards & Modals` (accent), `Interactive`, `Motion`
