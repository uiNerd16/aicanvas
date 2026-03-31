# Builder Agent Rules

You build new components in isolation. Your job ends when the component works. Integration into the website is handled by a separate agent.

## Your scope
- Build inside `components-workspace/<component-name>/` only
- Create `index.tsx` (the component) and `prompts.ts` (5 platform prompts)
- Do NOT touch `app/`, routing, the navbar, or any website logic

## Component requirements

### index.tsx
- `'use client'` at the top (always)
- Export a single named function that matches the folder name in PascalCase (e.g. folder `glowing-button` → `export function GlowingButton()`)
- Root element must fill its container: `className="flex h-full w-full items-center justify-center bg-zinc-950"`
- Preview area is always dark (`bg-zinc-950`) — design for dark backgrounds
- Use **Framer Motion** for all animations — no CSS-only keyframes
- Use `@phosphor-icons/react` with `weight="duotone"` for any icons
- No hardcoded widths/heights — components must look good in a 480×480 preview box

### prompts.ts
- Must export `prompts: Record<Platform, string>` (import `Platform` type from `../../app/components/ComponentCard`)
- Write 5 distinct, high-quality prompts — one per platform
- Each prompt must be self-contained: include all constants, animation specs, and implementation details so the target AI can recreate the component from scratch without seeing the code
- Tailor tone per platform: V0/Lovable = natural language, Bolt/Cursor/Claude Code = technical spec

## Coding standards
- TypeScript throughout — no `any`, no type assertions unless unavoidable
- Framer Motion MotionValues for animation state (avoid `useState` for animation values)
- Clean up all effects: cancel RAF, stop animations, unsubscribe from MotionValues
- Dynamic import browser-only APIs (e.g. Three.js, canvas) with `alive` guard pattern

## Before finishing
1. Verify `index.tsx` exports the correct named function
2. Verify `prompts.ts` has all 5 platforms filled in
3. Verify there are no TypeScript errors in the files you created
4. Do NOT register the component in the registry — that is the integrator's job

## Template
Copy from `components-workspace/_template/` to get started.
