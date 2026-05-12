@AGENTS.md

# AI Canvas — Global Rules

## Agent hierarchy

This project uses a structured multi-agent system. All agents inherit these global rules.

```
CLAUDE.md (root) ← you are here — global rules for everyone
└── supervisor/CLAUDE.md              ← Supervisor: the only agent you talk to directly
    │                                   routes work based on the brief's `design-system:` field
    ├── Builder — two modes:
    │   ├── components-workspace/CLAUDE.md   ← STANDALONES (creative freedom)
    │   └── design-systems/CLAUDE.md         ← DESIGN SYSTEMS (strict tokens)
    ├── reviewer/CLAUDE.md            ← Reviewer: checks quality before preview
    └── integration/CLAUDE.md         ← Integrator: wires components into the website
```

**Always start a session by loading the Supervisor.** It manages the full pipeline:
`Brief → Build → Review → Preview → Adjust → Integrate`

The Builder is a single agent with two modes. The brief's `design-system:` field decides which mode applies: `standalone` (read `components-workspace/CLAUDE.md`) or a named system like `andromeda` / `meridian` (read `design-systems/CLAUDE.md`). See `supervisor/CLAUDE.md` for the full routing table.

Component status is tracked in `supervisor/component-status.md`.
Known recurring mistakes are logged in `supervisor/mistakes.md`.

## What this project is
AI Canvas (aicanvas.me) is an open component marketplace where every component ships with:
- Its full source code
- Expert-crafted prompts for 3 AI coding platforms: Claude Code, Lovable, V0

## Tech stack
- **Framework**: Next.js 16 App Router (`app/` directory)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 (configured via CSS `@theme inline`, no `tailwind.config.ts`)
- **Animations**: Framer Motion (required for all animated components)
- **Icons**: `@phosphor-icons/react` — always use `weight="regular"`
- **Font**: Manrope (loaded via `next/font/google`, registered as `--font-sans`)
- **3D**: Three.js (optional, only when truly needed)

## Design system
- **Default theme**: dark. Light/dark toggle persists to `localStorage` via `ThemeProvider`
- **Dark mode**: class-based (`.dark` on `<html>`), Tailwind v4 `@variant dark`
- **Aesthetic**: Phosphor-inspired — warm neutral surfaces, editorial typography, olive accent

### Color system

All colors come from two custom scales defined in `globals.css` via `@theme inline`.

#### Sand scale — neutral (replaces zinc)
| Token         | Hex       | Usage                                      |
|---------------|-----------|--------------------------------------------|
| `sand-50`     | `#FAFAF0` | Elevated surfaces (dropdowns, hover fills) |
| `sand-100`    | `#E8E8DF` | Card backgrounds (light), input fills      |
| `sand-200`    | `#D4D4CC` | Page background (light)                    |
| `sand-300`    | `#BABAB4` | Borders (light), dividers                  |
| `sand-400`    | `#9E9E98` | Muted borders, placeholder icons           |
| `sand-500`    | `#7D7D78` | Muted / secondary text (light)             |
| `sand-600`    | `#666662` | Body text, descriptions (light)            |
| `sand-700`    | `#4F4F4C` | UI labels, buttons (light)                 |
| `sand-800`    | `#383836` | Card backgrounds (dark)                    |
| `sand-900`    | `#21211F` | Page background (dark)                     |
| `sand-950`    | `#1A1A19` | Deepest dark — component preview bg        |

#### Olive scale — lime-green accent
| Token         | Hex       | Usage                                   |
|---------------|-----------|-----------------------------------------|
| `olive-400`   | `#DAE4A0` | Hover accent, gradient end              |
| `olive-500`   | `#A8B94D` | Primary accent — buttons, badges, logo  |
| `olive-600`   | `#869631` | Pressed / darker accent state           |

> **Note:** olive buttons use `text-sand-950` (not white) — the olive background has insufficient contrast with white text.

#### Semantic mappings
| Role                       | Light                  | Dark                    |
|----------------------------|------------------------|-------------------------|
| Page background            | `bg-sand-200`          | `dark:bg-sand-950`      |
| Card / surface             | `bg-sand-100`          | `dark:bg-sand-900`      |
| Elevated (navbar, modal)   | `bg-sand-200/90`       | `dark:bg-sand-950/90`   |
| Input fill                 | `bg-sand-100`          | `dark:bg-sand-900`      |
| Primary text               | `text-sand-900`        | `dark:text-sand-50`     |
| Secondary / muted text     | `text-sand-600`        | `dark:text-sand-400`    |
| Placeholder / icon         | `text-sand-400`        | `dark:text-sand-500`    |
| Border default             | `border-sand-300`      | `dark:border-sand-800`  |
| Border hover               | `border-sand-400`      | `dark:border-sand-700`  |
| Accent                     | `text-olive-500`       | `dark:text-olive-400`   |
| Accent background          | `bg-olive-500`         | —                       |
| Component preview bg       | `bg-sand-950` (always) | —                       |

- **Typography weights**: 800 hero h1, 700 section headings, 600 UI labels/buttons, 400 body/description
- **Component preview backgrounds**: always `bg-sand-950` regardless of theme

## Component structure — three tiers

AI Canvas has three tiers of component work. Every brief is routed to exactly one.

### 1. Standalone components — `components-workspace/`

Experimental, creatively-free components that appear on the homepage grid. Each lives in its own folder:
```
components-workspace/
  my-component/
    index.tsx    ← the React component (export default function)
    prompts.ts   ← prompts for the 3 platforms (any subset allowed)
    spec.md      ← brief approved by user before building
```

### 2. Design systems — `design-systems/`

Strict, token-driven visual languages. Each system has its own folder:
```
design-systems/
  andromeda/          ← sci-fi / blueprint, 19 components, /design-systems/andromeda
    tokens.ts         ← source of truth for every color, spacing, radius
    components/       ← 20 .tsx files + lib/utils.ts
    examples/         ← mission-control dashboard showing the system composed
  meridian/           ← editorial dashboard, 9 components, /design-systems/meridian
    tokens.ts
    components/
    examples/
```

Files in `design-systems/` currently carry a `// @ts-nocheck` header (the folder is rename-only — proper typing is a future pass). See `design-systems/CLAUDE.md` for details.

### 3. Site chrome — `app/`, `app/components/`

The AI Canvas website itself — navbar, homepage, component grid, component preview pages. Governed by the sand/olive/Manrope system documented in this file and in `supervisor/skills/site-design-tokens.md`. Existing components built before the new structure live in `app/components/` and are registered in `app/lib/component-registry.tsx`.

## Prompt file contract
Every `prompts.ts` must export a `prompts` object typed as `Partial<Record<Platform, string>>` where `Platform = 'Claude Code' | 'Lovable' | 'V0'`. Lanes can be legitimately absent — the drawer UI filters to only the platforms a component actually provides.

```ts
import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': `...`,
  Lovable: `...`,
  V0: `...`,
}
```

## Component registry
`app/lib/component-registry.tsx` is the single source of truth. It imports `PreviewComponent: ComponentType` (not JSX elements) and the code/prompts strings for each component.

## Next.js conventions
- `params` in dynamic routes is `Promise<{ slug: string }>` — always `await params`
- `generateStaticParams()` required for all `[slug]` routes
- Server components pass `<PreviewComponent />` JSX as `children` to client components (never store JSX in module-level data)
- `'use client'` required on all interactive components

## Browser verification
After any visible UI change, screenshot the affected page on the running dev server before reporting the work complete. Use the Claude in Chrome browser tools — don't claim "looks good" from the diff alone.

- **Applies to**: changes to `app/`, `components-workspace/`, `design-systems/`, or any rendered output.
- **Skip when**: only changing types, tests, comments, prompts, or other non-rendered code.
- **Dev server**: try `localhost:3000` first; if it 404s or refuses, try `:3001`. If neither responds, start one with `npm run dev` in the background — no need to ask.
- **If the screenshot reveals a problem**: fix it before reporting; don't ship a "done" claim that the screenshot contradicts.
- **What to check in the screenshot**: layout matches intent, no console errors triggered by the change, theme tokens (sand/olive in site chrome; system tokens in `design-systems/`) resolved correctly.

"Do not invoke superpowers skills automatically. Only use them when I explicitly ask."
