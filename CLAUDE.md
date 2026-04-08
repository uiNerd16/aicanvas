@AGENTS.md

# AI Canvas — Global Rules

## Agent hierarchy

This project uses a structured multi-agent system. All agents inherit these global rules.

```
CLAUDE.md (root) ← you are here — global rules for everyone
└── supervisor/CLAUDE.md     ← Supervisor: the only agent you talk to directly
    ├── components-workspace/CLAUDE.md   ← Builder: builds components in isolation
    ├── reviewer/CLAUDE.md               ← Reviewer: checks quality before preview
    └── integration/CLAUDE.md            ← Integrator: wires components into the website
```

**Always start a session by loading the Supervisor.** It manages the full pipeline:
`Brief → Build → Review → Preview → Adjust → Integrate`

Component status is tracked in `supervisor/component-status.md`.
Known recurring mistakes are logged in `supervisor/mistakes.md`.

## What this project is
AI Canvas (aicanvas.me) is an open component marketplace where every component ships with:
- Its full source code
- Expert-crafted prompts for 5 AI coding tools: V0, Bolt, Lovable, Claude Code, Cursor

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

#### Sand scale — warm neutral (replaces zinc)
| Token         | Hex       | Usage                                      |
|---------------|-----------|--------------------------------------------|
| `sand-50`     | `#FAF7F2` | Elevated surfaces (dropdowns, hover fills) |
| `sand-100`    | `#F5F1EA` | Card backgrounds (light), input fills      |
| `sand-200`    | `#EDEAE5` | Page background (light)                    |
| `sand-300`    | `#DDD8CE` | Borders (light), dividers                  |
| `sand-400`    | `#C8C2B8` | Muted borders, placeholder icons           |
| `sand-500`    | `#9E9890` | Muted / secondary text (light)             |
| `sand-600`    | `#736D65` | Body text, descriptions (light)            |
| `sand-700`    | `#4A453F` | UI labels, buttons (light)                 |
| `sand-800`    | `#2E2A24` | Card backgrounds (dark)                    |
| `sand-900`    | `#1C1916` | Page background (dark)                     |
| `sand-950`    | `#110F0C` | Deepest dark — component preview bg        |

#### Olive scale — muted green accent (replaces violet)
| Token         | Hex       | Usage                                   |
|---------------|-----------|-----------------------------------------|
| `olive-400`   | `#96A452` | Hover accent, gradient end              |
| `olive-500`   | `#7D8D41` | Primary accent — buttons, badges, logo  |
| `olive-600`   | `#697535` | Pressed / darker accent state           |

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

## Component structure
Every component lives in its own folder under `components-workspace/`:
```
components-workspace/
  my-component/
    index.tsx    ← the React component (export named function)
    prompts.ts   ← prompts for all 5 platforms
    spec.md      ← brief approved by user before building
```

Existing components (built before this structure) live in `app/components/` and are already registered in `app/lib/component-registry.tsx`.

## Prompt file contract
Every `prompts.ts` must export a `prompts` object typed as `Record<Platform, string>` where `Platform = 'V0' | 'Bolt' | 'Lovable' | 'Claude Code' | 'Cursor'`.

```ts
import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `...`,
  Bolt: `...`,
  Lovable: `...`,
  'Claude Code': `...`,
  Cursor: `...`,
}
```

## Component registry
`app/lib/component-registry.tsx` is the single source of truth. It imports `PreviewComponent: ComponentType` (not JSX elements) and the code/prompts strings for each component.

## Next.js conventions
- `params` in dynamic routes is `Promise<{ slug: string }>` — always `await params`
- `generateStaticParams()` required for all `[slug]` routes
- Server components pass `<PreviewComponent />` JSX as `children` to client components (never store JSX in module-level data)
- `'use client'` required on all interactive components
"Do not invoke superpowers skills automatically. Only use them when I explicitly ask."
