---
name: signature-pad
design-system: standalone
---

# Signature Pad

An interactive widget for creating a digital signature. The user draws with mouse or touch on a canvas, can clear and start over, then save or cancel.

## Reference
Visual styling (typography, pill buttons, palette, modal radius) is borrowed from `new-project-modal` — sand-cream `#f1f1f0` light surface / `#1a1a18` ink, fully-rounded pill buttons, 28px modal radius, Manrope sans 15–18px.

## Anatomy
- Header row: "Create your digital signature" + ESC pill + circular X
- Canvas area: signing surface, mouse + touch drawing with smooth quadratic curves
- Below canvas (right): `Clear` text button (fades in once there's ink)
- Footer: `Cancel` (secondary pill) + `Save signature` (primary dark pill)

## Behavior
- Drawing: pointer events; smooth strokes via midpoint quadratic curves; line width has slight speed-based taper
- Empty state: faint baseline + watermark hint "Sign here"
- Save: only enabled when there's ink; on click, button morphs to checkmark for ~700ms (per new-project-modal CreateButton pattern)
- Cancel: clears canvas
- Clear: removes all strokes
- Mobile: full touch support, no fixed widths

## Out of scope
- Back/undo
- Contract / terms toggle
- Manage signatures
