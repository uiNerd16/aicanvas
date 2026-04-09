import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassSearchBar\` — a glass-morphism search bar over a blurred floral background, with a suggestions dropdown.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Background: full-bleed \`<img>\` at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png\`, \`object-cover opacity-60\`, over \`bg-sand-950\`.

Layout: container \`w-[calc(100%-2rem)] max-w-[380px]\`, \`marginTop: -90\` to sit above center.

Search bar: 48px tall, \`borderRadius: 24\`, glass panel —
- \`background: rgba(255,255,255,0.08)\`
- \`border: 1px solid rgba(255,255,255,0.1)\`
- \`boxShadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)\`
- separate non-animating absolute blur layer: \`backdropFilter: blur(24px) saturate(1.8)\`

When active (focused), animate boxShadow to:
\`0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1.5px rgba(255,160,50,0.5), 0 0 20px rgba(255,160,50,0.12)\`
via spring \`{ stiffness: 400, damping: 30 }\`.

Left: 48x48 slot containing Phosphor \`MagnifyingGlass\` size 20 \`weight="regular"\`, \`text-white/50\`.
Input: transparent, \`text-sm font-medium text-white/90 placeholder-white/30\`, caret \`#7D8D41\`, placeholder "Search components...".
Right: when \`query.length > 0\`, show a 20x20 circular clear button (\`rgba(255,255,255,0.08)\`, border \`rgba(255,255,255,0.12)\`) with Phosphor \`X\` size 10. Enter/exit via \`AnimatePresence\` scaling from 0.5, whileHover bg \`rgba(255,255,255,0.14)\`, whileTap scale 0.88.

Dropdown: appears when active and suggestions remain. Positioned \`absolute left-0 right-0\`, \`top: 56\`, \`rounded-2xl p-2\`, same glass panel + blur layer. Top edge highlight: \`absolute left-6 right-6 top-0 h-[1px]\` with \`linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)\`. Enter spring \`{ stiffness: 350, damping: 28 }\` from \`{ opacity:0, scale:0.95, y:-8, filter:'blur(4px)' }\`.

Label: \`text-[10px] font-semibold uppercase tracking-widest text-white/25\`, text "Suggestions" (or "Results" when typing).

Suggestions array (icon, label, color):
- MusicNote, "Audio visualizers", #FF5C8A
- File, "Documentation files", #3A86FF
- Lightning, "Quick actions", #06D6A0

Each row: \`minHeight: 44\`, flex gap-3, px-3 py-2.5 rounded-xl. Icon badge 32x32 \`rounded-xl\`, bg \`\${color}18\`, border \`1px solid \${color}22\`, icon size 16 \`weight="regular"\` tinted. Label \`text-sm font-semibold\` \`rgba(255,255,255,0.75)\` → \`0.95\` on hover. Animated button group (icon + label only) springs \`x: hovered ? 3 : 0, scale: hovered ? 1.08 : 1\`, \`transformOrigin: 'left center'\`, whileTap 0.90, spring \`{ stiffness: 320, damping: 20 }\`. Trailing pill "CLEAR" \`text-[8px] uppercase tracking-wide text-white/40\` \`bg rgba(255,255,255,0.06)\` — stays still, stopPropagation, removes that row from suggestions.

Behavior: click bar to activate + focus input; click outside or Escape deactivates + clears query. Filter suggestions by query substring (case-insensitive). Use \`useReducedMotion\` to fall back to fades. Use Manrope font ('font-sans').`,

  GPT: `Build a React client component named \`GlassSearchBar\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Data
Background image: \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png\`
Suggestions: \`[{ icon: MusicNote, label: 'Audio visualizers', color: '#FF5C8A' }, { icon: File, label: 'Documentation files', color: '#3A86FF' }, { icon: Lightning, label: 'Quick actions', color: '#06D6A0' }]\`
Constants: \`BAR_HEIGHT = 48\`, \`MIN_TOUCH_TARGET = 44\`.
Placeholder: "Search components...". Caret color: \`#7D8D41\`.

## Glass surface
\`background: rgba(255,255,255,0.08)\`
\`border: 1px solid rgba(255,255,255,0.1)\`
\`boxShadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)\`
Blur layer on separate absolute div (never animates): \`backdrop-filter: blur(24px) saturate(1.8)\` and \`-webkit-backdrop-filter\`.
Active glow shadow: \`0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1.5px rgba(255,160,50,0.5), 0 0 20px rgba(255,160,50,0.12)\`.

## Framer Motion
- Bar boxShadow animates between base and active glow with spring \`{ stiffness: 400, damping: 30 }\`.
- Clear X enter/exit via \`AnimatePresence\`, \`initial/exit { opacity:0, scale:0.5 }\`, \`animate { opacity:1, scale:1 }\`, same spring. \`whileHover { backgroundColor: 'rgba(255,255,255,0.14)' }\`, \`whileTap { scale: 0.88 }\`.
- Dropdown enter: \`{ opacity:0, scale:0.95, y:-8, filter:'blur(4px)' }\` → \`{ opacity:1, scale:1, y:0, filter:'blur(0px)' }\`, spring \`{ stiffness: 350, damping: 28 }\`, \`transformOrigin: 'top center'\`.
- Each suggestion row fades in \`delay: 0.06 + index * 0.04\`.
- Suggestion animated inner button: \`animate { x: hovered ? 3 : 0, scale: hovered ? 1.08 : 1 }\`, \`whileTap { scale: 0.90 }\`, spring \`{ stiffness: 320, damping: 20 }\`, \`transformOrigin: 'left center'\`.
- Honor \`useReducedMotion\` — substitute with \`{ duration: 0.15 }\` fades.

## Hover state
Suggestion label color: \`rgba(255,255,255,0.75)\` → \`rgba(255,255,255,0.95)\` on hover. Only the icon+label move; the trailing "CLEAR" pill stays still.

## JSX structure
- Root: \`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950\` with background img (\`opacity-60\`).
- Outer container \`relative w-[calc(100%-2rem)] max-w-[380px]\`, \`style={{ marginTop: -90 }}\`, ref for outside-click.
- Bar: \`motion.div\`, \`relative isolate flex w-full cursor-text items-center rounded-3xl\`, \`style={{ height:48, borderRadius:24, ...glassPanel }}\`. Separate absolute blur layer \`z-[-1]\`.
  - 48x48 slot with Phosphor \`MagnifyingGlass\` size 20 \`weight="regular"\` \`text-white/50\`.
  - \`<input>\` transparent, \`text-sm font-medium text-white/90 placeholder-white/30\`, aria-label "Search components".
  - Clear X button: 20x20 \`rounded-full\`, \`marginRight: 14\`, bg \`rgba(255,255,255,0.08)\`, border \`rgba(255,255,255,0.12)\`, contains Phosphor \`X\` size 10 \`text-white/60\`.
- Dropdown: \`absolute left-0 right-0\`, \`top: 56\`, \`rounded-2xl p-2\`, same glass + blur layer. Top edge highlight: \`absolute left-6 right-6 top-0 h-[1px]\` with \`linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)\`. Section label \`text-[10px] font-semibold uppercase tracking-widest text-white/25\`, "Suggestions" or "Results" (if query trimmed).
- Rows: flex items-center gap-3 \`px-3 py-2.5 rounded-xl minHeight 44\`. Icon badge 32x32 \`rounded-xl\` bg \`\${color}18\` border \`\${color}22\`. Label \`text-sm font-semibold\`. Trailing "CLEAR" pill \`text-[8px] uppercase tracking-wide text-white/40 bg rgba(255,255,255,0.06) rounded-full px-1.5 py-0.5\` — stopPropagation removes that row.

## Behavior
- Click bar to activate → focus input via rAF.
- Click outside (mousedown + touchstart listeners) or Escape → deactivate + clear query + blur input.
- Filter suggestions by query substring (case-insensitive). Hide cleared rows via a \`Set\`.
- Cleanup: remove document listeners on unmount / deactivate.
- Font: \`font-sans\` (Manrope).`,

  Gemini: `Implement a React client component named \`GlassSearchBar\` as a single TypeScript file.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { MagnifyingGlass, X, MusicNote, File, Lightning } from '@phosphor-icons/react'
\`\`\`

USE these hooks and no others. DO NOT invent \`useSpringValue\`, \`useAnimatedValue\`, or helpers not shown above. Do NOT call \`useMotionValue()\` or \`useMotionTemplate()\` inline inside JSX.

## Phosphor icons
All use \`weight="regular"\`: \`MagnifyingGlass\` (size 20), \`X\` (size 10), \`MusicNote\`/\`File\`/\`Lightning\` (size 16).

## Constants
- \`BACKGROUND = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png'\`
- \`BAR_HEIGHT = 48\`
- \`MIN_TOUCH_TARGET = 44\`
- Suggestions: \`[{ icon: MusicNote, label: 'Audio visualizers', color: '#FF5C8A' }, { icon: File, label: 'Documentation files', color: '#3A86FF' }, { icon: Lightning, label: 'Quick actions', color: '#06D6A0' }]\`
- \`glassPanel\`: \`background: rgba(255,255,255,0.08)\`, \`border: 1px solid rgba(255,255,255,0.1)\`, \`boxShadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)\`
- \`glassBlur\`: \`backdropFilter: blur(24px) saturate(1.8)\` (+ Webkit)
- \`ACTIVE_GLOW = '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1.5px rgba(255,160,50,0.5), 0 0 20px rgba(255,160,50,0.12)'\`

## Layout
Root \`bg-sand-950\` full container with the background \`<img>\` (\`opacity-60\`, \`object-cover\`). Inner container ref'd \`relative w-[calc(100%-2rem)] max-w-[380px]\` with \`marginTop: -90\`.

## Bar
\`motion.div\` \`rounded-3xl\`, \`borderRadius: 24\`, \`height: BAR_HEIGHT\`, glass panel styles. Animate \`boxShadow\` to \`ACTIVE_GLOW\` when active, spring \`{ stiffness: 400, damping: 30 }\`. Inside: a 48×48 slot with \`MagnifyingGlass\` \`text-white/50\`; the \`<input>\` (placeholder "Search components..."); and the clear X button that appears via \`AnimatePresence\` when \`query.length > 0\` — 20×20, bg \`rgba(255,255,255,0.08)\`, border \`rgba(255,255,255,0.12)\`, \`marginRight: 14\`, \`whileHover { backgroundColor: 'rgba(255,255,255,0.14)' }\`, \`whileTap { scale: 0.88 }\`, enter/exit \`{ opacity:0, scale:0.5 }\` ↔ \`{ opacity:1, scale:1 }\`. Separate absolute \`z-[-1]\` blur layer inside the bar.

## Dropdown
Render when \`isActive && filteredSuggestions.length > 0\`. \`absolute left-0 right-0 top-[56px] rounded-2xl p-2\`, glass panel, \`transformOrigin: 'top center'\`. \`AnimatePresence\` with \`initial/exit { opacity:0, scale:0.95, y:-8, filter:'blur(4px)' }\` and \`animate { opacity:1, scale:1, y:0, filter:'blur(0px)' }\`, spring \`{ stiffness: 350, damping: 28 }\`. Absolute blur layer \`z-[-1]\`. Top edge highlight \`absolute left-6 right-6 top-0 h-[1px]\` \`linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)\`. Section label "Suggestions" or "Results" (when query trimmed) \`text-[10px] font-semibold uppercase tracking-widest text-white/25\`.

## Suggestion row
\`flex items-center gap-3 rounded-xl px-3 py-2.5\` \`minHeight: 44\`. Animated inner \`motion.button\` containing the 32×32 badge (\`\${color}18\` bg, \`\${color}22\` border) and label (\`text-sm font-semibold\`, color \`rgba(255,255,255,0.75)\` → \`0.95\` on hover). \`animate { x: hovered?3:0, scale: hovered?1.08:1 }\`, \`whileTap { scale: 0.90 }\`, spring \`{ stiffness: 320, damping: 20 }\`, \`transformOrigin: 'left center'\`. Fade in with \`delay: 0.06 + index * 0.04\`. Trailing CLEAR pill \`text-[8px] uppercase tracking-wide text-white/40\` bg \`rgba(255,255,255,0.06)\` — stopPropagation, removes row from a \`Set<string>\`.

## Behavior
- Click bar → \`setIsActive(true)\`, focus via rAF.
- Click outside / touchstart / Escape → deactivate, clear query, blur input. Register/cleanup listeners in \`useEffect\`.
- Filter suggestions by query.toLowerCase() substring.
- \`useReducedMotion\` fallback: \`{ duration: 0.15 }\` fades, skip scales/x.
- Theme: fixed \`bg-sand-950\` background — no theme branching.
- Use \`font-sans\` (Manrope).`,

  V0: `Create a \`GlassSearchBar\` component — a pill-shaped glass-morphism search bar floating above a dreamy pink floral background.

The 48px tall bar has a frosted translucent white surface with subtle inner highlight and a soft drop shadow. A Phosphor \`MagnifyingGlass\` icon sits on the left. The input placeholder reads "Search components...". When focused, the entire bar gains a warm orange border glow. When there is typed text, a small circular X button springs in on the right to clear it.

Below the bar, a glass dropdown fades and scales down into place when focused, showing a "SUGGESTIONS" label and rows for "Audio visualizers" (pink #FF5C8A MusicNote), "Documentation files" (blue #3A86FF File), and "Quick actions" (green #06D6A0 Lightning). Each row has a tinted icon badge and a subtle "CLEAR" pill on the right. Hovering a row nudges the icon and label right and scales them up slightly with a spring, while the CLEAR pill stays completely still. Clicking CLEAR hides that row. Typing filters results; clicking outside or pressing Escape closes the dropdown.

Use Tailwind CSS, Framer Motion, and Phosphor Icons (weight='regular'). Both the bar and dropdown share the same glass recipe: translucent white background, 24px backdrop blur with 1.8x saturation (kept on a separate non-animating layer), and a subtle inset top highlight. Use Manrope ('font-sans'). Center everything over \`bg-sand-950\` with the background image at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png\` at 60% opacity.`,
}
