# Glitch Button — Spec

**Component:** GlitchButton
**Slug:** `glitch-button`
**Description:** A terminal-inspired button with a glitch text effect on hover.

## Visual

- Dark, terminal-style button on `bg-sand-950`
- Subtle border (`border-sand-800`) with terminal aesthetic
- Text in `text-olive-400` (terminal green) with `font-semibold`
- Uses `font-mono` for monospace terminal feel
- Optional blinking cursor/underscore after the label

## Behaviour

- On hover, button text rapidly scrambles through random characters (glitch effect) for ~0.6–0.8s, then resolves back to the original label
- Scramble uses monospace-style symbols (`@`, `#`, `%`, `&`, `!`, `*`, `$`, etc.)
- Characters resolve left-to-right — each position locks in sequentially
- Subtle border color shift to `border-olive-500` on hover
- Uses Framer Motion for supplemental animations (glow, border transitions)
- Text scramble runs via `useEffect` + `requestAnimationFrame` with proper cleanup

## Tech notes

- `font-mono` for terminal aesthetic (Tailwind default monospace stack)
- RAF-based scramble must cancel on mouse leave or unmount
- No external dependencies beyond Framer Motion
- Root: `flex h-full w-full items-center justify-center bg-sand-950`
