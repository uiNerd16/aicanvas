# Design Systems — Agent Rules

This folder contains **strict design systems**. Every component here is part of a cohesive visual language governed by a token file. These are NOT creative experiments — for those, see `components-workspace/` and its `skills/aesthetic-freedom.md`.

## Current systems

| System | Components | Aesthetic | Showcase |
|---|---|---|---|
| `andromeda/` | 19 | Sci-fi / blueprint. Transparent surfaces, 1px corner markers, JetBrains Mono only, electric-blue accent. | `/design-systems/andromeda` and `/design-systems/andromeda/showcase` |
| `meridian/` | 9 | Editorial dashboard. Intentionally smaller surface area today; will grow over time to match Andromeda's coverage. | `/design-systems/meridian` |

Both systems are governed by their own `tokens.ts` file in `design-systems/<system>/tokens.ts`.

## Token-first workflow

Before writing or modifying ANY component inside `design-systems/<system>/`:

1. **Read `design-systems/<system>/tokens.ts` first.** Tokens are the single source of truth for colors, spacing, radius, typography, and layout values. A change to tokens propagates to every component; a change to a component that bypasses tokens is technical debt.
2. **Never hardcode colors or spacing in components.** Use the `var(--andromeda-…)` / `var(--meridian-…)` CSS custom properties emitted by the system's helper (e.g. `andromedaVars()`), or reference `tokens.xxx` directly when that pattern is already established.
3. **Match existing component patterns.** If `Button.tsx` uses `cva` + `forwardRef` + `andromedaVars()`, a new `Select.tsx` should follow the same shape. Consistency inside a system is more important than micro-optimizations.
4. **One system per folder.** Do not import tokens, helpers, or components from `meridian/` into an `andromeda/` component, or vice versa.
5. **Examples are examples, not library code.** Files under `<system>/examples/` demonstrate how a system composes into a real UI (mission-control dashboard, editorial dashboard). Don't import FROM `examples/` INTO `components/` — data flows the other way.

## TypeScript status — important

Every file in this folder has a `// @ts-nocheck` header and the `design-systems/` folder is listed in `tsconfig.exclude`. **This is intentional** and here is why:

- The Andromeda and Meridian components originated as JSDoc-annotated `.jsx` files
- They were renamed to `.tsx` / `.ts` for extension consistency with the rest of the codebase
- They were NOT properly typed during the rename — that was out of scope for the restructure session
- Next.js still compiles them at runtime via SWC, so they work correctly in the browser
- A future dedicated "typing pass" session will strip `@ts-nocheck` from one component at a time as real TypeScript prop types are added

**If you are modifying a component here, do NOT remove the `@ts-nocheck` header** unless you are committing to: adding full prop interfaces, genericizing `forwardRef` signatures, typing every `...rest` spread, and resolving every latent error that the strict checker will surface for that file. Partial typing passes will break the page — all-or-nothing per file.

The showcase page at `app/design-systems/andromeda/showcase/page.tsx` also has a `@ts-nocheck` header for the same reason. It can be removed after the DS components it imports from are properly typed.

## Promotion to standalones

A DS component can be "promoted" onto the homepage standalone grid via a thin re-export wrapper in `components-workspace/<wrapper-name>/`. The wrapper owns its own `prompts.ts` and registers via the normal pipeline; the DS source stays untouched. See `components-workspace/skills/promotion-guide.md` for the pattern.

Promotion is a per-component user decision. Never promote a component speculatively.

## Brief format for DS work

Briefs for work in this folder MUST include a `design-system:` field with a valid system name:

```
Component: <name>
Slug: <kebab-case>
design-system: andromeda                  ← or meridian, etc.
Description: <one sentence>
Visual: <what it looks like>
Behaviour: <interactions, animations>
Tech notes: <any special requirements>
```

Specs for DS work should be saved at `design-systems/<system>/specs/<slug>.md` (parallel to how standalone specs live at `components-workspace/<slug>/spec.md`). The Supervisor routes briefs based on the `design-system:` field.

## Skills

- [`skills/designing-a-system.md`](skills/designing-a-system.md) — philosophy and workflow for creating or extending a DS (stub, TODO: flesh out)

## Relationship to other agents

- The **Supervisor** (`supervisor/CLAUDE.md`) delegates DS work to the Builder the same way it delegates standalone work — except the brief includes the `design-system:` field and the Builder reads THIS file instead of `components-workspace/CLAUDE.md`.
- The **Builder** has two modes: standalone mode (rules in `components-workspace/CLAUDE.md`) and DS mode (rules here). The `design-system:` field in the brief determines which mode applies.
- The **Reviewer** and **Integrator** operate identically for both modes.
