Component: Murmuration
Slug: murmuration
design-system: standalone
Description: A flock of tiny birds (boids) swarming in emergent formation — organic, breathing patterns that feel alive. Inspired by starling murmurations at dusk.

Visual:
- Dark twilight void (dark mode: deep indigo #0A0B1A; light mode: warm parchment #F5F1E8).
- ~250–350 small triangular bird silhouettes drifting in 2D space.
- Each bird rotated to face its velocity vector.
- Slight size/opacity variation for depth (2 or 3 tiers).
- Cursor emits a soft "predator" influence that the flock banks away from.
- Occasional sub-flocks split and re-merge as emergent behaviour from the rules.
- Subtle trailing alpha overlay each frame (rgba(bg, 0.1)) for a ghost-of-motion feel.

Behaviour:
- Classic boids — alignment, cohesion, separation — tuned for graceful, not jittery, swooping.
- Max speed ~2.2, max force ~0.05 (adjust for the canvas scale).
- Perception radius ~35px. Separation radius ~14px.
- Cursor repellent radius ~120px. Falloff softens near the edge.
- Boids wrap around edges (toroidal world).
- Idle animation always running — never pauses.

Mobile:
- Flock count scales down on narrow screens: ~350 on wide, ~120 on < 480px.
- Touch-drag moves the repellent point; touch-end fades it out over ~500ms.
- Canvas is DPR-aware (window.devicePixelRatio), resizes via ResizeObserver.
- No fixed pixel dimensions on the container.

Tech notes:
- Canvas 2D. RAF loop.
- Spatial hash grid (cells ~35px) for neighbor lookups to keep perf smooth at 300 boids.
- Framer Motion only for container fade-in; all boid motion is vanilla vectors.
- Colors via useTheme (light vs dark mode).
- Clean up: cancel RAF, remove listeners, disconnect ResizeObserver.
- Skip prompts.ts for this pass — build index.tsx only.
