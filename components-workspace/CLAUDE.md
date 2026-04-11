# Builder Agent Rules

You build new components in isolation. Your job ends when the component works. Integration into the website is handled by a separate agent.

## Skills library — read before building

These live in the top-level `skills/` folder at the **project root** (one level up from this file):

- `../skills/component-anatomy.md` — required structure, naming conventions, what to avoid
- `../skills/animation-patterns.md` — Framer Motion patterns, spring presets, cleanup patterns
- `../skills/design-tokens.md` — colors, typography, icon rules (quick reference)
- `../skills/prompts-guide.md` — how to write the 4 platform prompts
- `../skills/tailwind-v4.md` — Tailwind v4 patterns, what is different from v3
- `../skills/typescript-patterns.md` — TypeScript patterns, event types, MotionValue types

## Extended skills (`.claude/skills/`) — read for complex visual components

- **`.claude/skills/creative-3d-components/SKILL.md`** — Read this for ANY 3D, particle, canvas, or visually complex component. Contains specific visual recipes (glass, glow, liquid, wireframe), creative direction, color palettes for dark backgrounds, mathematical patterns (noise, parametric curves, springs), and interaction patterns. This is not API docs — it's opinionated creative guidance with code.
- **`.claude/skills/design-motion-principles/SKILL.md`** — Read when tuning animation quality. Perspectives from three motion designers (Emil Kowalski, Jakub Krehel, Jhey Tompkins) with context-aware recommendations.

## Your scope
- Build inside `components-workspace/<component-name>/` only
- Create `index.tsx` (the component) and `prompts.ts` (4 platform prompts: Claude, GPT, Gemini, V0 — any subset applicable to the component)
- Do NOT touch `app/`, routing, the navbar, or any website logic

## Component requirements

### index.tsx
- `'use client'` at the top (always)
- Export a single named function that matches the folder name in PascalCase (e.g. folder `glowing-button` → `export function GlowingButton()`)
- Root element must fill its container: `className="flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950"`
- **Support both light AND dark mode** — always use `dark:` Tailwind variants so the component looks great in both themes. The preview page has a theme toggle; the user will check both modes.
- For colors set via inline styles (e.g. custom hex values), import `useTheme` from `../../app/components/ThemeProvider` and pick different values per theme.
- Design a distinct but cohesive light version — lighter surface, darker/adjusted accent colors that maintain contrast on light backgrounds.
- **Be creative** — components are visual showcases. You are NOT required to use the site's sand/olive design tokens inside component internals. Use whatever colors, gradients, and styles make the component look its best in both modes.
- Use **Framer Motion** for all animations — no CSS-only keyframes
- Use `@phosphor-icons/react` with `weight="regular"` for any icons
- No hardcoded widths/heights — components must look good in a 480×480 preview box

### prompts.ts
- Must export `prompts: Partial<Record<Platform, string>>` (import `Platform` type from `../../app/components/ComponentCard`). `Platform = 'Claude' | 'GPT' | 'Gemini' | 'V0'`. Lanes can be legitimately absent.
- Write up to 4 distinct, high-quality prompts — one per platform you're providing
- Each prompt must be self-contained: include all constants, animation specs, and implementation details so the target AI can recreate the component from scratch without seeing the code
- Tailor tone per platform:
  - **Claude** — mid-density spec, trust Claude on idiomatic React + Framer Motion, "inline everything, single file"
  - **GPT** — highest density, exact constants, easing curves, spring params, pseudo-code blocks, treat as precise executor
  - **Gemini** — defensive and explicit, exact imports, "use these hooks and no others", inline DPR/canvas scaffolding
  - **V0** — natural language, UI-framed, no math, prose descriptions with key constants as labelled numbers

## Coding standards
- TypeScript throughout — no `any`, no type assertions unless unavoidable
- Framer Motion MotionValues for animation state (avoid `useState` for animation values)
- Clean up all effects: cancel RAF, stop animations, unsubscribe from MotionValues
- Dynamic import browser-only APIs (e.g. Three.js, canvas) with `alive` guard pattern

## Before finishing a BUILD task
1. Verify `index.tsx` exports the correct named function
2. Verify there are no TypeScript errors in the files you created
3. Do NOT write `prompts.ts` during the initial build — prompts are written in a separate step AFTER the user approves the final visual
4. Do NOT register the component in the registry — that is the integrator's job

## Before finishing a PROMPTS task
When the Supervisor delegates a prompts-only task (after the user has approved the component):
1. Read the FINAL `index.tsx` carefully — the component may have changed since the spec
2. Write `prompts.ts` based on what the component ACTUALLY does, not what the spec says
3. Verify the platforms specified in the brief are filled in and each prompt is self-contained (components may legitimately omit some platforms — check the brief)

## Template
Copy from `components-workspace/_template/` to get started.
