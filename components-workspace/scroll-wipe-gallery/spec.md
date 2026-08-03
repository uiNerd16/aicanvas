# Scroll Wipe Gallery

## Brief
Component: Scroll Wipe Gallery
Slug: scroll-wipe-gallery
Description: A full-bleed, scroll-driven photo gallery. Each photo wipes in from a different edge.

## Visual (default)
- Full-viewport section, inline height SECTION_HEIGHT (1100vh), sticky panel pinned at top
- Base photo (index 0) always visible underneath; four more photos wipe in over equal scroll segments
- Each wipe reveals from a different edge in order: down, right, up, left (cycles via HIDDEN_CLIP)
- One oversized headline per photo, stacked one word per line, white text on mixBlendMode difference
- Headline enters at 0.16em letter spacing pushed along the wipe's axis/sign, tightens to 0.02em and settles as the frame lands
- Orientation chrome (also difference blend, no scrim): series label top-left ("Selected Works" / "Concrete and Light"), frame counter top-right ("01 / 05"), scroll cue bottom-center that fades out by 3% scroll progress

## Colors
- Surface: #0A0A0A, identical in light and dark (dualTheme: false)
- Type and chrome: #FFFFFF at mixBlendMode difference

## Tech notes
- Progress is read via the wrapper's own getBoundingClientRect against the nearest real scroll container (overflowY auto/scroll + scrollHeight > clientHeight), not Framer Motion's container option
- Listeners on both the found container and window (scroll events do not bubble from an inner scroller to window), coalesced into one requestAnimationFrame
- Sticky panel height comes from the measured scroller (viewportHeight MotionValue in px), falls back to 100vh until measured so SSR and first client render agree
- clip-path uses inset() with all four percentages explicit (Framer Motion cannot interpolate a mix of unitless 0 and 0%)
- Reduced motion: wipes hard-snap at each segment's midpoint, headlines skip the slide/tracking animation, scroll cue does not bounce
- Label: "Scroll Wipe Gallery" + full-bleed photo gallery, wipes in from a different edge on scroll
