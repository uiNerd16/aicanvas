@AGENTS.md

# AI Canvas — Global Rules

## What this project is
AI Canvas (aicanvas.me) is an open component marketplace where every component ships with:
- Its full source code
- Expert-crafted prompts for 3 AI coding platforms: Claude Code, Lovable, V0

## How work is organized

Three tiers; every task routes to exactly one:

| Tier | Folder | Design rules | Details |
|---|---|---|---|
| Standalone components | `components-workspace/<slug>/` | Creative freedom (except container chrome) | `components-workspace/CLAUDE.md` |
| Design systems | `design-systems/<system>/` | Strict, each system's own `tokens.ts` | `design-systems/CLAUDE.md` |
| Site chrome | `app/`, `app/components/` | sand/olive/Manrope | `supervisor/skills/site-design-tokens.md` |

The component pipeline (create + modify, gates, registry rules) lives in `supervisor/CLAUDE.md`. Every built or modified component gets an independent review pass against the checklist in `reviewer/CLAUDE.md` before the user sees it. Integration steps live in `integration/CLAUDE.md`. Known recurring mistakes: `supervisor/mistakes.md`. The component inventory is `app/lib/component-registry.tsx` — the registry IS the status ledger; do not maintain a separate one.

## Secrets & credentials — this is an OPEN-SOURCE repo

This repository is public. A leaked secret is exposed the moment it is committed. Treat every key as radioactive:

- **Never commit a secret.** Real values live only in `.env.local` (already gitignored). Confirm `.env.local` and any `*service_role*` / `*secret*` files are covered by `.gitignore` before touching keys. Never paste a live key into a tracked file, a doc, a commit message, or chat output.
- **`NEXT_PUBLIC_` ships to the browser.** Only the Supabase anon/publishable key may carry that prefix. The `service_role` / `SUPABASE_SECRET_KEY` must NEVER be `NEXT_PUBLIC_` and must only be read in server code.
- **Prefer the Supabase CLI over keys on disk.** `supabase login` stores the token in the OS keychain, not the repo — nothing to accidentally commit. Use a `service_role` key in `.env.local` only as a last resort, never beyond it.
- **Supabase access is read-only by default.** Run writes/migrations only when the user explicitly asks, one at a time, showing the SQL first. It is the production project — no destructive or schema changes without sign-off.
- If a secret is ever found in tracked history, treat it as compromised: rotate it in the provider, don't just delete the line.

## Tech stack
- **Framework**: Next.js 16 App Router (`app/` directory)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 (configured via CSS `@theme inline`, no `tailwind.config.ts`)
- **Animations**: Framer Motion (required for all animated components)
- **Icons**: `@phosphor-icons/react` — always use `weight="regular"`
- **Font**: Manrope (loaded via `next/font/google`, registered as `--font-sans`)
- **3D**: Three.js (optional, only when truly needed)

## Design system (site chrome)

- **Default theme**: dark. Light/dark toggle persists to `localStorage` via `ThemeProvider`; dark mode is class-based (`.dark` on `<html>`, Tailwind v4 `@variant dark`). Aesthetic: Phosphor-inspired — warm neutral surfaces, editorial typography, olive accent.
- **Full token reference** (sand + olive scales, hex values, typography table, spacing grid): `supervisor/skills/site-design-tokens.md` — the single source of truth for site-chrome styling.

Semantic quick reference:

| Role | Light | Dark |
|---|---|---|
| Page background | `bg-sand-200` | `dark:bg-sand-950` |
| Card / surface | `bg-sand-100` | `dark:bg-sand-900` |
| Primary text | `text-sand-900` | `dark:text-sand-50` |
| Secondary text | `text-sand-600` | `dark:text-sand-400` |
| Border | `border-sand-300` | `dark:border-sand-800` |
| Accent | `text-olive-500` | `dark:text-olive-400` |

- Olive buttons use `text-sand-950`, never white (contrast). Component preview backgrounds are always `bg-sand-950` regardless of theme. Typography weights: 800 hero h1, 700 section headings, 600 UI labels/buttons, 400 body.

## Prompt file contract
Every `prompts.ts` exports a `prompts` object typed `Partial<Record<Platform, string>>`. The `Platform` union is defined in `app/components/ComponentCard.tsx` — verify against that file, not docs. Lanes can be legitimately absent; the drawer UI filters to the platforms a component provides.

```ts
import type { Platform } from '../../app/components/ComponentCard'
export const prompts: Partial<Record<Platform, string>> = { 'Claude Code': `...` }
```

## Component registry
`app/lib/component-registry.tsx` is the single source of truth. It imports `PreviewComponent: ComponentType` (not JSX elements) and the code/prompts strings for each component. Append-only: never delete or rename existing entries (slugs are a public contract — see `supervisor/CLAUDE.md`).

## Next.js conventions
- `params` in dynamic routes is `Promise<{ slug: string }>` — always `await params`
- `generateStaticParams()` required for all `[slug]` routes
- Server components pass `<PreviewComponent />` JSX as `children` to client components (never store JSX in module-level data)
- `'use client'` required on all interactive components

## Visual verification
The maintainer reviews all visual changes himself — do not run browser tooling or screenshots to self-verify UI work, and never block on a screenshot you cannot take. The one exception is the component-card screenshot pipeline (`npm run screenshot -- <slug>` via `scripts/screenshot.mjs`), which is part of publishing. A screenshot shared by the maintainer IS the bug report: diagnose and fix from it.

"Do not invoke superpowers skills automatically. Only use them when I explicitly ask."
