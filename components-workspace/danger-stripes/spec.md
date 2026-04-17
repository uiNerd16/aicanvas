Component: Danger Stripes
Slug: danger-stripes
design-system: standalone
Description: A provocative warning sign that dares users to hover or click, then punishes them with a chaotic turbulence distortion effect.

Visual:
- Almost-black background (~#0a0a0a)
- Three bold yellow (#FFD600 or similar construction-yellow) stripes laid diagonally across the viewport at different rotations (e.g. -15°, 5°, 25°) — overlapping, industrial, raw
- Large, ultra-bold, all-caps white text centered: "WIP DANGER DO NOT CLICK OR HOVER"
- Text should feel like a stencil warning — heavy weight, tight tracking

Behaviour:
- Idle state: stripes and text sit still, clean and readable
- On hover: an SVG feTurbulence + feDisplacementMap filter kicks in hard — the entire composition (stripes + text) warps and distorts chaotically, as if the screen is glitching/melting
- On click: even stronger turbulence — crank the baseFrequency and scale values up, maybe animate them to pulse/throb for a moment
- Transition back to calm when the user stops hovering

Mobile:
- Touch-and-hold triggers the hover effect; tap triggers the click effect
- Stripes and text scale down but maintain readability
- Min component height: min-h-screen

Tech notes:
- SVG filter approach: inline <svg> with <filter> containing feTurbulence + feDisplacementMap, applied via CSS filter: url(#filterId) or as a wrapper
- Animate baseFrequency and scale attributes using requestAnimationFrame or Framer Motion for smooth transitions
- No external dependencies beyond Framer Motion
