# Component Status

| Component | Stage | Notes |
|---|---|---|
| halo-type | awaiting-commit | Kinetic typography — 3D ring of text ("COPY ✦ PASTE ✦ SHIP ✦ REPEAT ✦") rotating around Y axis. Final tuning: tilt 24° rest=hover (no change on engage), 14s/turn, 0.3× slow on hover, STAR_SCALE 0.65. Pure CSS 3D + Framer Motion (`useAnimationFrame` + MotionValue, no Three.js). Back-arc reads upside-down (not mirrored) via twin glyph `rotateY(180)+rotateZ(180)`; per-letter opacity = cos(effective_angle) via refs (no backface-visibility — avoids pixel-shred at ±90° seam). `transformOrigin: 50% 50%` (critical — `0 0` displaces narrow letters). DOM-based per-character measurement via hidden inline-block spans + ResizeObserver (handles late Manrope load). Proportional angular spacing. Horizontal edge mask (18%/82% falloff) hides residual seam. dualTheme (dark #0A0A0A/#F5F1E8/#7A756C, light inverted). Reducedmotion freezes at 30°. Unified pointer handlers (mouse+touch). Integrator finalized: real prompts wired, ImageKit screenshot live at `halo-type.png`, description refined (88 chars). Install comment corrected `framer-motion react`. JSON check PASS. Local only — not committed, not pushed. |
| stack-tower | awaiting-commit | Kinetic typography — 12 stacked rows alternating "STACK"/"TOWER"; per-row transform (translateX + skewX + scale) from cos/sin(phase + rowOffset), rowOffset = i*0.35 rad so rotation travels down the stack. Final tuning: SECONDS_PER_CYCLE=5, AMPLITUDE_PX=22, all rows advance at same rate — hover does NOT modulate speed. Hover reaction: hovered row eases color toward orange accent #F16D14 and scale bumps +10%; rest unchanged. HOVER_EASE_RATE=10/s, frame-rate-independent (1-exp(-rate·dt)). Hovered index stored in ref (not state) so rotation stays smooth. One central useAnimationFrame in parent drives per-row MotionValues via `useMemo(...motionValue(0))`. Each row wrapped in pointer-target div so hover hits stay rectangular regardless of inner scaleX. Top+bottom 22% gradient fades for infinite-column feel. dualTheme (#0A0A0A/#EFEEE6 swap, dim #3A3936/#C7C3B8). font-size clamp(1.75rem,9vw,4.5rem). Reduced-motion freezes each row at phase = 0.2 + i*0.03. Integrator-done: prompts.ts written (Claude Code/Lovable/V0), spec.md synced, description refined, screenshot with orange-highlighted centre row uploaded to ImageKit (`stack-tower.png?v=1`), `// npm install framer-motion react`, JSON check PASS. Local only — awaiting user "commit" then "push". |
| wild-morph | integrated | Italic SVG word "wild" on warm off-white panel, cursor-Y selects top/bottom corner-pin warp via 2D homography solved per-frame (matrix3d), underdamped spring physics (stiffness 280, damping 14/16, mass 1.8). Anton font, hardcoded dark (dualTheme: false). Registry entry appended, `// npm install` + `// font: Anton` comments present, screenshot uploaded to ImageKit (active upper-half warp state captured), JSON check PASS, byte-for-byte parity verified via local `shadcn add` into a temp dir. Local only — not committed. |
| responsive-letters | integrated | Interactive text — cursor proximity animates weight (100→900), width (100%→200%), letter spacing (0em→0.4em), skew (±18°), italic toggle. Science Gothic font, neon cyan on dark navy (light/dark mode swapped). 300px influence radius, elastic spring animations, 5rem-9rem responsive typography. |
| murmuration | deleted | Removed by user request |
| sticker-wall | integrated | Feedback Wall — matter.js physics, 10 quote + 12 emoji seeds, pastel stickers with 32px radius, periwinkle Send key, dual-theme, title + subtitle, settled-pile screenshot. Promoted from /preview/idea-two. |
| easter-rabbit | deleted | Removed by user request |
| traveldeck | integrated | Built before agent system — slug renamed from floating-cards (folder unchanged) |
| text-blur-reveal | integrated | Built before agent system |
| particle-sphere | integrated | Built before agent system |
| polaroid-stack | integrated | Built before agent system |
| text-layout | integrated | Built before agent system |
| radial-toolbar | integrated | Radial context menu wheel, formatting tools, dualTheme, mobile-ready |
| glitch-button | integrated | Terminal-style button with hover glitch text effect |
| flip-calendar | integrated | Desk calendar 1–31, swipe-only, sand page stack, subtle scan line |
| charging-widget | integrated | Circular charging indicator, liquid waves, count-up loop — dualTheme |
| runway-loader | integrated | Airplane taxis down progress bar, takes off at 100% |
| dot-grid | integrated | Canvas dot grid, hover illuminates nearby dots — dualTheme |
| blind-pull-toggle | integrated | Window-blind pull cord toggle, venetian slat icon swap, cord spring animation — dualTheme |
| pill-toggle | integrated | iOS-style pill slider, grey→green track, spring thumb, responsive — dualTheme |
| mark-toggle | integrated | Earth/sand pill toggle, X→checkmark icon morph on thumb, spring animation — dualTheme |
| taga-toggle | integrated | Playful pill toggle, dead face (×× eyes) → happy face (arc eyes, smile), grey→yellow — dualTheme |
| x-grid | integrated | v2 live: breathing diagonal wave (±30%), RADIUS 340, ~1s trail decay, connection mesh, dualTheme, V0 prompt lane added |
| noise-bg | integrated | Random grain dots, Gaussian glow, cached neighbour connections on hover, dualTheme |
| circle-field | deleted | Removed by user request |
| bubble-field | integrated | Grid circles burst+reform on hover, cyclic phase animation, pastel blue palette, dualTheme |
| wave-lines | integrated | Vertical sine-wave lines, layered waves + Y-drift, extreme hover waves, dualTheme — renamed from silk-lines |
| distortion-grid | integrated | Slow sweeping sine waves, cursor repels grid outward, dualTheme — renamed from wave-grid, line alpha bumped to 0.55/0.75 |
| grid-lines | integrated | 20px dot grid with H/V lines, viewport-relative Gaussian halo (30% of max dim) + radial wave pulse on hover, dualTheme |
| origami-card | deleted | Removed by user request |
| kinetic-vortex | deleted | Removed by user request |
| glass-sidebar | integrated | Two-state glassmorphism sidebar, squircle icons, spring width, staggered labels, pink flower bg |
| glass-weather-widget | deleted | Removed by user request |
| glass-search-bar | integrated | Frosted glass search bar, orange active glow, suggestion dropdown with clear buttons, spring animations |
| glass-input | deleted | Removed by user request |
| glass-toast | integrated | Glass toast notifications, 4 variants, auto-dismiss progress bar, spring stacking |
| glass-stepper | integrated | Glass numeric stepper, spring number flip, notification-style tinted buttons, configurable min/max/step |
| glass-progress | integrated | Glass progress bar panel, glowing gradient fills, spring counters, staggered reveal, replay button |
| glass-ai-compose | integrated | Glass AI Chat — model switcher (Claude/ChatGPT/Perplexity/Gemini), image upload, web search toggle |
| elastic-string | deleted | Removed by user request |
| andromeda-button | integrated | First DS promotion — re-export wrapper around Andromeda design system Button, full showcase layout (Variants/Sizes/With icon/Disabled), boundary retyping pattern |
| ai-job-cards | integrated | Three swipeable card stacks (Anthropic/Perplexity/Google), brand logos, bookmark toggle, spring animations — mobile fix applied (h-full→min-h-screen, alignItems:stretch on narrow) |
| peel-corner-reveal | integrated | "Peel to Scan" — 2D SVG peel, tap-toggle with hover-peek, Wi-Fi QR reveal (qrcode.react), inverted light/dark card, pulsing Wi-Fi arcs, +31° QR rotation, inlined useTheme for copy-paste readiness. Registry + screenshot live. |
| jar-of-emotions | integrated | SVG glass jar + spring-hinged lid (Framer Motion), 6 reaction emojis (🔥👌😄😭🧑‍🍳🐐), matter.js physics floor + walls, ballistic aim to clicked button, 30-tap "Full. Please Stop." banner, dualTheme. |
| good-vibes | published | Interactive typography — cursor-proximity weight animation (100→700) + 2x scale + letter-spacing, burnt sienna on charcoal/light gray, Science Gothic, three platform prompts, ImageKit live, JSON check PASS, commit ef88c43 pushed |
| playful | published | Interactive typography STAY / WEIRD (two rows) — cursor-proximity 600px, rotation (±75°), alternating jump/drop (±100px, even up / odd down), scale (1→1.4), olive/sand-950 inverted palette, 2px sticker drop-shadow, fluid clamp(2rem, 20vw, 12rem), three platform prompts, ImageKit live, JSON check PASS |
| flip-grid | deleted | Removed by user request |
| liquid-button | deleted | Removed by user request |
| scatter-field | deleted | Removed by user request |
