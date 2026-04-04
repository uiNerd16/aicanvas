# Noise Background

## Brief
Component: Noise Background
Slug: noise-bg
Description: A canvas-based interactive background of randomly scattered tiny granule dots that illuminate on hover, same interaction model as X Grid.

## Visual
- Dots placed randomly (not on a grid) — like film grain or sand
- Very small: 0.5px resting, up to 1.2px when fully lit
- Density scales with container size (~1 dot per 250px²)
- Resting opacity: 0.18 dark / 0.28 light
- On hover: radial glow — 130px radius, power-curve falloff, peak opacity 0.92
- Connection lines: lit neighbours within 35px connected by faint lines (constellation effect, organic/irregular)
- Dark bg: #110F0C / Light bg: #F5F1EA — dualTheme
- Centred label: "Noise" + "hover to illuminate"

## Behaviour
- Fast attack (0.16 lerp), slow release (0.07 lerp)
- Neighbour pairs computed once in build(), reused every frame
- ResizeObserver, DPR, touch events, zero-size guard
- isDark detection via [data-card-theme] pattern

## Tech notes
- Random positions seeded fresh on every build() / resize
- Neighbour cache: array of [DotA, DotB] pairs where distance < 35px
- Connection alpha: Math.min(a.b, b.b) * 0.35
- dualTheme: true in registry
