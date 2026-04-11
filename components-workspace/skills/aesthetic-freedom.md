# Aesthetic Freedom — Creative Direction for Standalone Components

**Status: stub — flesh out in a dedicated session.**

This skill file is the **primary creative guide** for building standalone components inside `components-workspace/`. Unlike the main AI Canvas site (which uses the sand/olive/Manrope system, see `supervisor/skills/site-design-tokens.md`) and unlike the design systems in `design-systems/` (which are token-locked), standalones are **experiments**. They exist to showcase distinct visual ideas: a liquid button, a glass notification, a magnetic dot grid, a wave of lines. Each one should feel like its own small universe.

When fleshed out, this file should cover:

- **Permission-giving language.** Yes, use that gradient. Yes, break out of sand/olive. Yes, pick a color palette that has nothing to do with the site chrome. Yes, use custom typography weights, custom easing curves, custom blend modes. The goal of a standalone is to be memorable in its own right — if it could live anywhere, it probably isn't distinct enough.
- **The one non-negotiable constraint: container chrome.** Every standalone's root element must render inside a container styled `className="flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950"`. This is the only place the sand scale is required — because the component preview route uses those surfaces as a frame. Everything INSIDE that container is creative-freedom territory.
- **Dark + light support is still required.** Creative freedom doesn't mean "dark mode only." Every standalone must look great in both themes. Use `dark:` Tailwind variants or read `useTheme()` from `../../app/components/ThemeProvider` to branch.
- **Motion as identity.** A standalone's animation is often its personality. Framer Motion is required. Plan the motion concept before picking colors — easing curves and spring stiffness decide how the component "feels" more than any palette.
- **Composition principles for 480×480.** Components render in a square preview box. Design for that ratio. No fixed pixel dimensions on the root element. Internal rhythm should scale gracefully.
- **Reference the "best of" standalones.** (TODO: enumerate 5–8 exemplar standalones by slug once the docs are ready. Candidates: `liquid-button`, `glass-notification`, `particle-constellation`, `wave-lines`, `magnetic-dots`, `text-blur-reveal`.)

TODO: replace this stub with real content, including screenshots and reference constants.
