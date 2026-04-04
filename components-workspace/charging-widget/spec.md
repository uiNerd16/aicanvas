# Charging Widget — Spec

**Component:** ChargingWidget
**Slug:** `charging-widget`
**Description:** A circular battery-charging indicator with animated liquid waves that rise as the percentage counts up from 0 to 100.

## Visual

- Dark circle with a bright green glowing ring border
- Lightning bolt icon centered near the top inside the circle
- Large bold percentage number centered (e.g. "18")
- Small "%" label below the number
- Two overlapping sine waves forming a liquid fill that rises from bottom to top as charging progresses
- Deep dark-green interior, rich glow on the ring

## Behaviour

- On mount, number counts up from 0 to a target percentage (default 78) over ~4 seconds with easing
- The wave fill height is driven by the same animated value — starts near bottom, rises to match the percentage
- Two waves animate in opposite phase so they cross each other continuously, giving a liquid sloshing feel
- Wave amplitude gradually decreases as the fill gets higher (more liquid = calmer surface)
- Loop: after reaching target, it resets and counts again (so it's always alive in preview)

## Tech notes

- Framer Motion `useMotionValue` + `useTransform` for the fill height
- Waves drawn via SVG `<path>` with a sine curve, animated with `requestAnimationFrame`
- Circle clipping with SVG `clipPath` to contain the wave inside the circle
- No external UI — just the widget centered on `bg-sand-950`
- Root: `flex h-full w-full items-center justify-center bg-sand-950`
