# Site Design Tokens — Main AI Canvas Website

This file covers the **main AI Canvas website** only — navbar, homepage, component grid, and site chrome. Design systems (`design-systems/andromeda/`, `design-systems/meridian/`) have their OWN token files and do NOT use these values. Standalone components inside `components-workspace/` have creative freedom and do NOT need to match these tokens, except for the container-chrome exception noted below.

Full design system is in the root `CLAUDE.md`. This file is a fast reference for site-chrome work.

## Component preview background

Always `bg-sand-950` — never zinc, never black, never transparent.

## Sand scale

| Token | Hex | Use in components |
|---|---|---|
| `sand-50` | `#FAF7F2` | Rarely needed in dark previews |
| `sand-100` | `#F5F1EA` | Light card surfaces |
| `sand-200` | `#EDEAE5` | Light backgrounds |
| `sand-300` | `#DDD8CE` | Borders (light) |
| `sand-400` | `#C8C2B8` | Muted icons, placeholders |
| `sand-500` | `#9E9890` | Secondary text |
| `sand-600` | `#736D65` | Body text |
| `sand-700` | `#4A453F` | Labels, buttons (light) |
| `sand-800` | `#2E2A24` | Dark card surfaces |
| `sand-900` | `#1C1916` | Dark backgrounds |
| `sand-950` | `#110F0C` | **Component preview bg** |

## Olive scale (accent)

| Token | Hex | Use |
|---|---|---|
| `olive-400` | `#96A452` | Hover state, gradient end |
| `olive-500` | `#7D8D41` | **Primary accent** — buttons, badges, highlights |
| `olive-600` | `#697535` | Pressed / active state |

> Olive buttons must use `text-sand-950` — NOT white. Olive has insufficient contrast with white.

## Text colors in dark preview context

| Role | Class |
|---|---|
| Primary text | `text-sand-50` |
| Secondary / muted | `text-sand-400` |
| Placeholder / icon | `text-sand-500` |
| Accent | `text-olive-400` |

## Borders in dark preview context

| Role | Class |
|---|---|
| Default border | `border-sand-800` |
| Hover border | `border-sand-700` |

## Typography weights

| Role | Weight |
|---|---|
| Hero heading | `font-extrabold` (800) |
| Section heading | `font-bold` (700) |
| UI labels, buttons | `font-semibold` (600) |
| Body, description | `font-normal` (400) |

Font: Manrope via `--font-sans`. Use `font-sans` class.

## Icons

- Library: `@phosphor-icons/react`
- Weight: always `weight="regular"` — never duotone, never fill, never bold
- Size: use Tailwind sizing (`className="size-5"`) not the `size` prop
