Component: Curious AI
Slug: curious-ai
design-system: standalone
Description: A morphing 3D AI orb in Three.js with glowing magenta robot-eye pills that track your cursor and blink. Cyan + magenta rim lights, iridescent pink/cyan speckles, organic noise displacement, and an autonomous idle look-around personality.

Visual:
- Dark teal body rendered with a custom ShaderMaterial on a high-subdivision IcosahedronGeometry (detail 64 desktop, 32 below 400 px).
- Background sits at #0A0A09 in dark mode, #E8E8DF in light mode. The canvas itself is transparent so the orb breathes against the page bg with no circular clip.
- Two directional rim lights — cyan from upper-left, magenta from lower-right — combined with a fresnel falloff give the wet rim-glow read.
- Body lighting uses derivative-based surface normals (dFdx/dFdy of view-space position) + key/fill diffuse, so wrinkles cast real highlights and shadows instead of flat fresnel.
- Sparse iridescent speckles (electric pink + cyan, biased pink) are sampled in local space so they stick to the surface as it morphs. Speckle density is intentionally light; they fade out toward the silhouette so they read as material, not stickers.
- Two narrow vertical "robot eye" pills floating just in front of the orb's centre — hot pink with a three-layer magenta halo (LED-lens look). Slightly translucent (alpha 0.85) so they glow rather than read solid.

Behaviour:
- Idle (cursor off-page): an autonomous look-around script drives the orb's gaze: left → slightly right → slightly left → top → back, then loops. Each beat 2.2–2.8 s. Eyes sit at openness 0.85 (relaxed). Periodic Poisson-ish blinks every 3.8–7 s.
- Cursor in container but off the orb: eyes drift slightly toward the cursor (40% intensity), openness rises to 0.70, orb leans gently.
- Cursor on the orb: eyes track at full intensity AND shrink (openness 0.32) — the AI is squinting/focusing. Orb leans toward the cursor and a "look-bulge" displacement bias makes the face of the orb push out where you're looking.
- Eye motion out-paces the orb's lean by ~3× — eyes carry the personality, the orb is a sympathetic follower.
- All states transition via exponential smoothing in a single RAF loop reading lookCurrentRef.
- Blink on every state transition (in→out, out→in) plus the idle scheduler.

Mobile:
- Pointer events are unified (pointermove/down/up/cancel) so touch works the same as mouse. Tap = brief awake state with a 500 ms grace period after pointerup.
- IcosahedronGeometry drops to detail 32 below 400 px width to keep 60 fps.
- Eye and stage sizes are all percentage-based against a square stage that's clamped at min(42vh, 42vw).
- The orb canvas uses touch-none and select-none on the stage to prevent the browser from interpreting drags as scroll/zoom while keeping the surrounding page scrollable.

Tech notes:
- Raw Three.js (no R3F) — same pattern as `particle-sphere/`.
- Custom ShaderMaterial: two-octave simplex noise displacement, anisotropic stretch, breath, look-direction bulge in the vertex shader; derivative-normal lighting (key + fill + two rim lights + Blinn specular) plus procedural speckles in the fragment shader.
- Eyes are HTML divs over the canvas — pure Framer Motion springs and scaleY animations. Three-layer box-shadow gives the LED halo.
- Inline `useScopedTheme` hook reads `.dark` on `<html>` and any `[data-card-theme]` ancestor; MutationObserver-driven.
- `prefers-reduced-motion` freezes the noise time (uReduce=0) and disables blink scheduling; eye tracking still works.
- DPR clamped to 2; ResizeObserver keeps the renderer in sync.
- Cleanup: cancel RAF, dispose geometry/material/renderer, disconnect ResizeObserver, remove canvas.

Tags: `3D` (accent), `Three.js`, `Interactive`
