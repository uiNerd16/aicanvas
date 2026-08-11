import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': `# Diamonds
Build a self-contained React Canvas 2D background where a near-invisible square diamonds wakes in scattered patches as light moves outward from seeded intersection ignitions. Use no dependencies beyond React, render no text or controls, and keep the canvas non-interactive.

## Component contract
Create components-workspace-premium/diamonds/index.tsx with 'use client' on line 1. Default-export Diamonds with props { className?: string; seed?: number }, defaulting seed to 1337. The root is a role="img" div with relative min-h-screen, full width, overflow hidden, #FAF8F5 in light mode and #000000 in dark mode. Its only child is an aria-hidden canvas whose className is exactly "absolute inset-0 block".

## Geometry and resting cache
Set the grid cell to clamp(0.16 * min(W,H), 92, 176), and derive its sub-cell x and y offset from seeded mulberry32. Cover the viewport with 0.6px vertical and horizontal strokes. At every crossing, draw a compact four-point star with 3.3px axis spikes and a 0.68px inner radius. Keep the resting strokes barely visible at palette line * 0.18 and the marks slightly brighter at palette line * 0.36.

Prerender the resting lines and marks once into a transparent offscreen canvas. Build a second cached mask whose alpha is full in a broad top-left to bottom-right diagonal band, then falls through several soft gradient stops to zero at the top-right and bottom-left corners. Apply it to the resting cache once with destination-in. Rebuild these caches only on resize or theme change.

## Seeded loop and travelling light
Use a seamless 64000ms analytic loop with 14 deterministic ignitions. Create irregular seeded time gaps, with occasional paired sources two or three cells apart on the same row or column so opposing fronts meet without becoming a sweep. Give each ignition a 25000 to 32000ms lifetime, a 10500 to 15000ms decay start, a 3200 to 4100ms cell travel time and a reach of 2.5 to 3.75 cells. Wrap event age around the loop so the first frame is already populated.

Each active ignition sends four rays along the grid axes. Advance the ray one cell at a time with smoothstep interpolation inside each cell. Draw a 3.2px low-alpha glow and a 0.95px hot core, plus a tiny point at each travelling front. Overlapping opposing rays accumulate under the palette compositing mode so their shared segment reads fully joined. Draw each source from a cached 30px sprite containing a soft bloom, a sharp 10.5px four-point star and a 1.65px hot core. Let source brightness and rays decay slowly with a restrained sinusoidal breath.

## Palette and compositing
Preserve these palettes exactly:

  DARK  = { ground:'#000000', ink:'255,255,255', line:0.30, lineHot:0.10, lineFar:0.80, pulse:0.95, comp:'lighter' }
  LIGHT = { ground:'#FAF8F5', ink:'14,14,16', line:0.34, lineHot:0.12, lineFar:0.82, pulse:0.88, comp:'source-over' }

Precompute 256 alpha style strings per theme. Draw the live overlay into its own reusable offscreen surface, apply the same cached diagonal mask with one destination-in blit, then composite the cached resting layer and live layer over a palette ground fill. Create no arrays, gradients, style strings or geometry objects in the frame loop. Per frame, evaluate at most 14 events and draw at most 56 two-pass rays plus cached star sprites.

## Lifecycle
Cap DPR at 2. Accumulate time with min(33, frame delta), modulo the loop duration. Debounce ResizeObserver rebuilds by 120ms and skip unchanged width, height and DPR. Pause RAF with IntersectionObserver threshold 0.01 and visibilitychange. Read the nearest data-card-theme before the document .dark class and observe theme class mutations. Respect prefers-reduced-motion by drawing a populated still at 27000ms with no RAF. Clean up RAF, timeout, all observers, all listeners and offscreen surfaces on unmount.

Add no colour, pointer response, text, icon, card, caption, control or focusable element. Use strict TypeScript with no any and no em-dash characters.`,
}
