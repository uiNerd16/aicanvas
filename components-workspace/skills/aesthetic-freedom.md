# Aesthetic Freedom — Creative Direction for Standalone Components

**Status: stub — flesh out in a dedicated session.**

This skill file is the **primary creative guide** for building standalone components inside `components-workspace/`. Unlike the main AI Canvas site (which uses the sand/olive/Manrope system, see `supervisor/skills/site-design-tokens.md`) and unlike the design systems in `design-systems/` (which are token-locked), standalones are **experiments**. They exist to showcase distinct visual ideas: a liquid button, a glass notification, a magnetic dot grid, a wave of lines. Each one should feel like its own small universe.

## Typography & spacing system (REQUIRED — applies to every standalone)

Creative freedom is about *visual identity*, not arbitrary measurements. Every standalone lays out its type and spacing on the same disciplined grid the aicanvas site uses (Tailwind's 4px base). This keeps components feeling crafted and consistent even though they use raw values instead of the sand/olive tokens.

- **Type scale — font sizes (px):** `10, 12, 14, 16, 20, 24, 28, 32` (reserve `40, 48` for deliberate hero numerals only). Even numbers on a 2px grid; prefer the 4px steps. NEVER use off-grid sizes like `13, 15, 17, 18, 22` — snap to the nearest scale value (`17 → 16`, `13 → 12 or 14`).
- **Spacing — padding / margin / gap / layout (px):** the 4px grid `4, 8, 12, 16, 20, 24, 32`, with `2, 6, 10, 14` allowed on the 2px grid. NEVER use `5, 7, 9, 11, 13, 15, 18, 22`. Tailwind spacing classes already map to this (`gap-2`=8, `p-4`=16, `px-2.5`=10, `py-1`=4).
- **Keep widgets compact.** Don't oversize. A value/number readout rarely needs more than ~28px; reserve 40–48px for deliberate hero typography only. Tighten padding so a widget reads as a widget, not a giant panel.
- **Off-grid exceptions:** touch targets stay ≥44px (accessibility), 1px hairline borders, and icon sizes follow `12/14/16/18/20`.
- Document the scale you're using in a short comment block at the top of `index.tsx` and **sweep the whole file for stray off-grid values before finishing**.

When fleshed out, this file should cover:

- **Permission-giving language.** Yes, use that gradient. Yes, break out of sand/olive. Yes, pick a color palette that has nothing to do with the site chrome. Yes, use custom typography weights, custom easing curves, custom blend modes. The goal of a standalone is to be memorable in its own right — if it could live anywhere, it probably isn't distinct enough.
- **The one non-negotiable constraint: container chrome.** Every standalone's root element must render inside a container styled `className="flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950"`. This is the only place the sand scale is required — because the component preview route uses those surfaces as a frame. Everything INSIDE that container is creative-freedom territory.
- **Dark + light support is still required.** Creative freedom doesn't mean "dark mode only." Every standalone must look great in both themes. Use `dark:` Tailwind variants or read `useTheme()` from `../../app/components/ThemeProvider` to branch.
- **Motion as identity.** A standalone's animation is often its personality. Framer Motion is required. Plan the motion concept before picking colors — easing curves and spring stiffness decide how the component "feels" more than any palette.
- **Composition principles for 480×480.** Components render in a square preview box. Design for that ratio. No fixed pixel dimensions on the root element. Internal rhythm should scale gracefully.
- **Reference the "best of" standalones.** (TODO: enumerate 5–8 exemplar standalones by slug once the docs are ready. Candidates: `glass-notification`, `particle-constellation`, `wave-lines`, `magnetic-dots`, `text-blur-reveal`.)

TODO: replace this stub with real content, including screenshots and reference constants.
