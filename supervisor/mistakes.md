# Known Mistakes & Recurring Issues

The Reviewer checks this list on every review. The Supervisor logs here after every failed review or user correction.

---

## #001 — Wrong preview background color
- **Issue**: Used `bg-zinc-950` instead of `bg-sand-950` for the component root element
- **Rule**: Always use `bg-sand-950` for component preview backgrounds (never zinc)
- **Affected files**: `components-workspace/_template/index.tsx` (fixed at setup)
- **Detected**: Initial system setup

## #002 — Wrong icon weight
- **Issue**: Used `weight="duotone"` on Phosphor icons instead of `weight="regular"`
- **Rule**: Always use `weight="regular"` for all `@phosphor-icons/react` icons
- **Affected files**: `components-workspace/CLAUDE.md` (fixed at setup)
- **Detected**: Initial system setup

## #003 — Used `text-white` instead of design system tokens
- **Issue**: Template used `text-white` for text on dark backgrounds
- **Rule**: Always use `text-sand-50` for primary text in dark context, not `text-white`
- **Affected files**: `components-workspace/_template/index.tsx` (fixed at review)
- **Detected**: Session review

## #004 — Documentation hex mismatch with CSS source of truth
- **Issue**: `sand-200` was documented as `#EDE8DF` but actual `globals.css` has `#EDEAE5`
- **Rule**: Always verify token values against `app/globals.css` — it is the single source of truth for all colors
- **Affected files**: Root `CLAUDE.md`, `skills/design-tokens.md` (both fixed at review)
- **Detected**: Session review

## #005 — Component integrated without screenshot (missing `image` field)
- **Issue**: `silk-lines` was added to the registry without an `image` field, so its card on the homepage showed the old placeholder (dot grid + icon) instead of the screenshot + fade gradient
- **Rule**: Integration is NOT complete until the `image` field in the registry entry contains a real ImageKit URL. The Integrator must run `npm run screenshot -- <slug>`, add the URL to the registry, and only then report back to the Supervisor. The Supervisor must verify the `image` field exists before marking status as `integrated`.
- **For active-state components**: The screenshot must capture the component in its active/hover state. Add the slug to `scripts/screenshot.mjs` `INTERACTIONS` map before running the script.
- **Affected files**: `integration/CLAUDE.md`, `supervisor/CLAUDE.md` (both updated with hard gates)
- **Detected**: 2026-04-02

## #006 — Prompts file out of sync with actual component
- **Issue**: `silk-lines/prompts.ts` (now `wave-lines/prompts.ts`) described constants and behaviour that no longer matched `index.tsx`. The prompts said `SPACING=8, AMP=44, HOVER_BOOST=1.3` and a single sine wave; the real component had `SPACING=32, AMP=18, HOVER_BOOST=5.0`, a layered secondary wave, a Y-drift breath, and quadratic-curve smoothing through midpoints. An AI given those prompts would have produced a meaningfully different component than what's deployed.
- **Rule**: Whenever a component is adjusted after `prompts.ts` is written, the prompts MUST be regenerated against the FINAL `index.tsx`. The Builder rule already says "Read the FINAL `index.tsx` carefully — the component may have changed since the spec" — but this needs to be enforced for *adjustments*, not just initial builds. Reviewer should diff the prompts against the component on every review and fail if constants or core behaviour drift.
- **Detection rule**: If a Reviewer or Supervisor sees the user request a visual change (e.g. "make the lines waver more"), they must remember that the next prompt-write step needs to capture that change. Don't trust an old `prompts.ts` to still be accurate.
- **Affected files**: `components-workspace/wave-lines/prompts.ts` (rewritten), `app/lib/component-registry.tsx` (already inlines the real source code, so it stayed accurate)
- **Detected**: 2026-04-08
