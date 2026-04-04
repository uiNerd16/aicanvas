## Component: Oven Knob (Toggle Switch)

**Slug:** `oven-knob`
**Description:** A clean iOS-style slider toggle — thumb slides left (off/grey) to right (on/green) with a snappy spring.

---

### Visual

- Preview background: dual theme (dark `#110F0C` / light `#EDEAE5`)
- A pill-shaped track (80×44px, fully rounded)
- A white circular thumb (36px) that sits inside the track with padding
- **Off**: track grey (`#3D3A3A` dark / `#D1D1D6` light), thumb on the left
- **On**: track green (`#22c55e`), thumb on the right
- Track has a subtle inset shadow for depth; thumb has a drop shadow
- No labels, no icons

---

### Behaviour

1. Click track to toggle
2. Thumb slides left ↔ right with a snappy spring (`stiffness: 500, damping: 36`)
3. Track colour **transitions continuously** as the thumb moves via `useTransform`
4. `whileTap: scale 0.96` on the track
5. Guard with `animating` flag

---

### Tech notes

- `useMotionValue(OFF_X)` for thumb position (OFF_X=4, ON_X=36)
- `useTransform(thumbX, [OFF_X, ON_X], [offTrack, '#22c55e'])` for track colour
- `animate(thumbX, target, { type:'spring', stiffness:500, damping:36 })`
- Theme via `MutationObserver` on `[data-card-theme]`
- TRACK_W=80, TRACK_H=44, THUMB=36, PAD=4
