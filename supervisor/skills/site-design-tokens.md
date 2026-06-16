# Site Design Tokens — Main AI Canvas Website

This file covers the **main AI Canvas website** only — navbar, homepage, component grid, and site chrome. Design systems (`design-systems/andromeda/`, `design-systems/meridian/`) have their OWN token files and do NOT use these values. Standalone components inside `components-workspace/` have creative freedom and do NOT need to match these tokens, except for the container-chrome exception noted below.

Full design system is in the root `CLAUDE.md`. This file is a fast reference for site-chrome work.

## Component preview background

Always `bg-sand-950` — never zinc, never black, never transparent.

## Sand scale

| Token | Hex | Use in components |
|---|---|---|
| `sand-50` | `#FAFAF4` | Elevated surfaces, hover fills |
| `sand-100` | `#E8E8E3` | Light card surfaces |
| `sand-200` | `#D4D4D0` | Light page background |
| `sand-300` | `#BABAB7` | Borders (light) |
| `sand-400` | `#9E9E9B` | Muted icons, placeholders |
| `sand-500` | `#7D7D7B` | Secondary text |
| `sand-600` | `#666665` | Body text |
| `sand-700` | `#4F4F4F` | Labels, buttons (light) |
| `sand-800` | `#383839` | Dark card surfaces |
| `sand-900` | `#212122` | Dark card / panel surfaces |
| `sand-950` | `#0E0E0F` | **Dark page + component preview bg** |

## Olive scale (accent)

| Token | Hex | Use |
|---|---|---|
| `olive-400` | `#DAE4A0` | Hover state, gradient end |
| `olive-500` | `#A8B94D` | **Primary accent** — buttons, badges, highlights |
| `olive-600` | `#869631` | Pressed / active state |

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
