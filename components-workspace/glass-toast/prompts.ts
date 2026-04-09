import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassToast\` — four trigger buttons (Success / Error / Warning / Info) that spawn glass-morphism toast cards in the bottom-right with a draining progress bar.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Background: \`<img>\` at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png\`, \`object-cover opacity-60\`, over \`bg-sand-950\`.

Constants: \`TOAST_DURATION = 4000\`, \`MAX_TOASTS = 3\`.

Variants (Phosphor \`weight="regular"\`):
- success: color #06D6A0, gradient "#06D6A0, #00BFA5", icon \`CheckCircle\`, label "Success"
- error:   color #FF5C8A, gradient "#FF5C8A, #FF1744", icon \`XCircle\`,     label "Error"
- warning: color #FFBE0B, gradient "#FFBE0B, #FF9800", icon \`Warning\`,     label "Warning"
- info:    color #3A86FF, gradient "#3A86FF, #2962FF", icon \`Info\`,        label "Info"

Demo content per variant:
- success: "Changes saved" / "Your settings have been updated successfully"
- error:   "Upload failed" / "The file exceeds the maximum size limit"
- warning: "Low storage"   / "You have less than 100MB remaining"
- info:    "New update"    / "Version 2.4 is now available"

Glass panel (shared for both trigger buttons and toast cards):
- \`background: rgba(255,255,255,0.06)\`
- \`border: 1px solid rgba(255,255,255,0.1)\`
- \`boxShadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)\`
- Separate non-animating absolute blur layer: \`backdrop-filter: blur(24px) saturate(1.8)\`

Trigger buttons (one per variant): \`motion.button relative isolate flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-2xl px-3 py-2\`, \`minHeight: 44\`, same glass panel + absolute blur layer. Hover scale 1.08, tap 0.90, spring \`{ stiffness: 300, damping: 20 }\`. Contains a 32x32 \`rounded-xl\` tinted icon badge (bg \`\${color}18\`, border \`\${color}22\`), icon size 16, plus a \`text-sm font-semibold text-white/70\` label.

Toast container: \`fixed bottom-4 left-4 right-4 z-50 flex flex-col-reverse gap-3 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[380px]\`. Wrap children in \`AnimatePresence mode="popLayout" initial={false}\`.

Toast card: \`motion.div layout relative w-full overflow-hidden rounded-2xl\` + glass panel. Enter \`{ opacity:0, x:80, scale:0.95 }\` → \`{ opacity:1, x:0, scale:1 }\` → exit same as enter, spring \`{ stiffness: 300, damping: 26 }\`. Slight hover scale 1.01. Inside: a separate absolute \`z-0\` blur layer, a content row \`relative z-10 flex items-center gap-3 py-3.5 pl-4 pr-10\` with a 36x36 tinted icon tile (bg \`\${variant.color}18\`, border \`\${variant.color}22\`, icon size 18), and a text column with a \`text-sm font-semibold text-white/90\` truncated title and an optional \`text-xs text-white/50\` description.

Close button: a 44x44 touch target on the right, containing a 20x20 circular button (bg \`rgba(255,255,255,0.08)\`, border \`rgba(255,255,255,0.12)\`) with Phosphor \`X\` size 10 \`text-white/60\`; whileHover bg \`rgba(255,255,255,0.14)\`, whileTap scale 0.88.

Progress bar: \`absolute bottom-0 left-0 right-0 h-[2px]\`, inner div \`origin-left\` bg \`\${variant.color}99\`. Drive with a requestAnimationFrame loop: track \`elapsed\` across frames, computed \`fraction = max(0, 1 - elapsed / TOAST_DURATION)\`, write directly to \`style.transform = scaleX(fraction)\`. When hovered, freeze elapsed (don't advance). When fraction hits 0, dismiss. Always cancel RAF on unmount.

Enforce \`MAX_TOASTS\` by slicing oldest. Triggers call \`addToast(variant)\`.

Respect \`useReducedMotion\` — fall back to opacity fades.

Use Manrope font.`,

  GPT: `Build a React client component named \`GlassToast\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Data
Background: \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png\`
\`TOAST_DURATION = 4000\`, \`MAX_TOASTS = 3\`.
Variants:
- success #06D6A0 "#06D6A0, #00BFA5" CheckCircle "Success" — "Changes saved" / "Your settings have been updated successfully"
- error #FF5C8A "#FF5C8A, #FF1744" XCircle "Error" — "Upload failed" / "The file exceeds the maximum size limit"
- warning #FFBE0B "#FFBE0B, #FF9800" Warning "Warning" — "Low storage" / "You have less than 100MB remaining"
- info #3A86FF "#3A86FF, #2962FF" Info "Info" — "New update" / "Version 2.4 is now available"

## Glass surface
\`background: rgba(255,255,255,0.06)\`, \`border: 1px solid rgba(255,255,255,0.1)\`, \`boxShadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)\`. Separate absolute blur layer: \`backdrop-filter: blur(24px) saturate(1.8)\` (+ Webkit). Used for both trigger buttons and toast cards.

## Framer Motion
- Trigger button: \`whileHover { scale: 1.08 }\`, \`whileTap { scale: 0.90 }\`, \`{ type:'spring', stiffness: 300, damping: 20 }\`.
- Toast card: \`motion.div layout\`, enter \`{ opacity:0, x:80, scale:0.95 }\` → \`{ opacity:1, x:0, scale:1 }\`, exit \`{ opacity:0, x:80, scale:0.95 }\`, \`{ type:'spring', stiffness: 300, damping: 26 }\`. Hovered: scale 1.01 (non-reduced).
- Close button inner: \`whileHover { backgroundColor: 'rgba(255,255,255,0.14)' }\`, \`whileTap { scale: 0.88 }\`.
- Respect \`useReducedMotion\`: fallback to opacity fades.

## Hover state
- Hover on a toast pauses its progress RAF (freezes elapsed).
- Trigger button glass appearance stays the same; only scale animates.

## JSX structure
- Root: \`flex h-full w-full items-center justify-center bg-sand-950\` + background img \`opacity-60\` \`absolute inset-0\`.
- Triggers: \`relative z-10 flex flex-wrap items-center justify-center gap-3 px-4\`, one \`<TriggerButton>\` per variant. Each button \`relative isolate flex items-center gap-2.5 overflow-hidden rounded-2xl px-3 py-2 minHeight 44\` + glass panel + absolute blur layer. Inside: 32x32 tinted icon tile + \`text-sm font-semibold text-white/70\` label.
- Toast container: \`fixed bottom-4 left-4 right-4 z-50 flex flex-col-reverse gap-3 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[380px]\`, \`<AnimatePresence mode="popLayout" initial={false}>\`.
- Toast card: \`relative w-full overflow-hidden rounded-2xl\` + glass panel. Absolute blur layer \`z-0\`. Content row \`relative z-10 flex items-center gap-3 py-3.5 pl-4 pr-10\` → 36x36 tinted icon tile (size 18) + text column (title truncated + optional description).
- Close button: absolute right, \`44x44\` outer touch wrapper, inner 20x20 circle bg \`rgba(255,255,255,0.08)\` border \`rgba(255,255,255,0.12)\` with Phosphor \`X\` size 10.
- Progress bar: \`absolute bottom-0 left-0 right-0 h-[2px]\` with inner div \`h-full w-full origin-left\` bg \`\${variant.color}99\`.

## Progress RAF
Per-card custom hook \`useToastProgress(id, isPaused, onComplete)\`:
- \`elapsedRef\`, \`lastTimeRef\`, \`rafRef\`, \`progressRef\` refs.
- Each frame: if not paused, \`elapsedRef.current += now - lastTimeRef.current\`; update \`lastTimeRef\`; compute \`fraction = max(0, 1 - elapsed / TOAST_DURATION)\`; write \`progressRef.current.style.transform = \`scaleX(\${fraction})\`\`.
- When fraction ≤ 0, call \`onComplete(id)\` and stop.
- Cleanup: set \`alive=false\` and \`cancelAnimationFrame\`.

## Behavior
- \`addToast(variant)\` appends with a counter-based id; slice oldest when \`length > MAX_TOASTS\`.
- \`dismissToast(id)\` filters by id.
- Phosphor: CheckCircle, XCircle, Warning, Info, X (all \`weight="regular"\`).
- Font \`font-sans\` (Manrope). Fixed \`bg-sand-950\`.`,

  Gemini: `Implement a React client component named \`GlassToast\` as a single TypeScript file.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CheckCircle, XCircle, Warning, Info, X } from '@phosphor-icons/react'
\`\`\`

USE these hooks and no others. DO NOT invent \`useSpringValue\`, \`useAnimatedValue\`, or helpers not shown above. Do NOT call \`useMotionValue()\` or \`useMotionTemplate()\` inline inside JSX.

## Phosphor icons (weight="regular")
\`CheckCircle\`, \`XCircle\`, \`Warning\`, \`Info\` (all size 16 in triggers, size 18 in cards). \`X\` size 10 for close.

## Constants
- Background: \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png\`
- \`TOAST_DURATION = 4000\`
- \`MAX_TOASTS = 3\`
- \`GLASS_PANEL\`: bg \`rgba(255,255,255,0.06)\`, border \`1px solid rgba(255,255,255,0.1)\`, shadow \`0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)\`
- \`GLASS_BLUR\`: \`backdrop-filter: blur(24px) saturate(1.8)\` (+ Webkit)
- \`ENTER_SPRING = { type: 'spring' as const, stiffness: 300, damping: 26 }\`
- \`BUTTON_SPRING = { type: 'spring' as const, stiffness: 300, damping: 20 }\`
- \`VARIANTS\` record keyed by 'success'|'error'|'warning'|'info' (see spec below)
- \`DEMO_TOASTS\` record keyed same

## Variants
| key | color | gradient | icon | label |
|---|---|---|---|---|
| success | #06D6A0 | #06D6A0, #00BFA5 | CheckCircle | Success |
| error | #FF5C8A | #FF5C8A, #FF1744 | XCircle | Error |
| warning | #FFBE0B | #FFBE0B, #FF9800 | Warning | Warning |
| info | #3A86FF | #3A86FF, #2962FF | Info | Info |

Demo content:
- success: title "Changes saved", description "Your settings have been updated successfully"
- error: title "Upload failed", description "The file exceeds the maximum size limit"
- warning: title "Low storage", description "You have less than 100MB remaining"
- info: title "New update", description "Version 2.4 is now available"

## Layout
Root \`flex h-full w-full items-center justify-center bg-sand-950\`. Background \`<img>\` \`absolute inset-0 opacity-60 object-cover\`.

Triggers: \`relative z-10 flex flex-wrap items-center justify-center gap-3 px-4\`, one button per variant key.

## TriggerButton
\`motion.button\` \`relative isolate flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-2xl px-3 py-2\`, \`style={{ ...GLASS_PANEL, outline: 'none', minHeight: 44 }}\`. \`whileHover { scale: 1.08 }\`, \`whileTap { scale: 0.90 }\`, \`transition={BUTTON_SPRING}\`. Absolute blur layer \`z-[-1] rounded-2xl\`. Inside: 32x32 tinted icon tile (bg \`\${config.color}18\`, border \`\${config.color}22\`) with the variant icon size 16; label \`text-sm font-semibold text-white/70\`.

## Toast container
\`fixed bottom-4 left-4 right-4 z-50 flex flex-col-reverse gap-3 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[380px]\`. \`<AnimatePresence mode="popLayout" initial={false}>\` wrapping toast cards keyed by id.

## ToastCard
\`motion.div layout\`, enter \`prefersReduced ? { opacity:0 } : { opacity:0, x:80, scale:0.95 }\`, animate \`{ opacity:1, x:0, scale:1, scale: hovered && !prefersReduced ? 1.01 : 1 }\`, exit = enter, \`transition={ENTER_SPRING}\`. className \`relative w-full overflow-hidden rounded-2xl\` style \`GLASS_PANEL\`. Hover handlers toggle \`hovered\`.

Inside:
- Blur layer \`pointer-events-none absolute inset-0 z-0 rounded-2xl\` style \`GLASS_BLUR\`.
- Content row \`relative z-10 flex items-center gap-3 py-3.5 pl-4 pr-10\` containing 36x36 tinted tile (bg \`\${variant.color}18\`, border \`\${variant.color}22\`) with the variant icon size 18, plus text column with truncated title \`text-sm font-semibold text-white/90\` and optional description \`text-xs text-white/50\`.
- Close button wrapper: \`absolute right-0 top-1/2 z-20 flex -translate-y-1/2 cursor-pointer items-center justify-center\` \`{ width: 44, height: 44 }\`, onClick dismisses. Inner \`motion.div whileHover={{ backgroundColor: 'rgba(255,255,255,0.14)' }} whileTap={{ scale: 0.88 }}\` \`rounded-full\` 20x20 with bg \`rgba(255,255,255,0.08)\` border \`rgba(255,255,255,0.12)\`, containing \`<X size={10} weight="regular" className="text-white/60" />\`.
- Progress bar: \`absolute bottom-0 left-0 right-0 h-[2px]\` with inner ref'd div \`h-full w-full origin-left\` background \`\${variant.color}99\`.

## useToastProgress hook
\`function useToastProgress(id: string, isPaused: boolean, onComplete: (id: string) => void)\`:
- Refs: \`progressRef\`, \`elapsedRef\`, \`lastTimeRef\`, \`rafRef\`.
- \`useEffect\`: set \`alive = true\`, \`lastTimeRef.current = performance.now()\`. tick(now): if \`!alive\` return. If not paused, \`elapsedRef.current += now - lastTimeRef.current\`. Update \`lastTimeRef\`. \`fraction = Math.max(0, 1 - elapsedRef.current / TOAST_DURATION)\`. Write \`progressRef.current.style.transform = 'scaleX(' + fraction + ')'\`. If fraction ≤ 0, call \`onComplete(id)\` and return. Else \`rafRef.current = requestAnimationFrame(tick)\`.
- Cleanup: \`alive=false\`, \`cancelAnimationFrame(rafRef.current)\`.
- Return \`progressRef\`.

## Main component state
\`useState<Toast[]>\`, \`useReducedMotion\`, \`idCounter = useRef(0)\`. \`dismissToast\` and \`addToast\` as \`useCallback\`s. Enforce \`MAX_TOASTS\` with slice.

## Behavior
- Font \`font-sans\` (Manrope).
- Fixed dark background. No props.`,

  V0: `Create a \`GlassToast\` component — four trigger buttons (Success, Error, Warning, Info) that spawn glass-morphism toast cards in the bottom-right with draining progress bars.

Over a dreamy pink floral background, show four centered glass trigger buttons, each with a tinted icon badge and label: Success (green CheckCircle #06D6A0), Error (pink XCircle #FF5C8A), Warning (yellow Warning #FFBE0B), Info (blue Info #3A86FF). Buttons share the same translucent frosted surface with 24px backdrop blur and 1.8x saturation on a separate non-animating layer. They scale up on hover and down on tap.

Clicking a trigger adds a toast card to a bottom-right stack (bottom-4 on mobile, bottom-6 right-6 sm:w-[380px] on desktop) of at most 3 cards. Each toast is the same glass recipe with a tinted icon tile on the left, a bold title, a muted description, and a small circular close X button on the right. Demo content per variant is sensible (e.g. Success "Changes saved" / "Your settings have been updated successfully", Error "Upload failed" / "The file exceeds the maximum size limit", Warning "Low storage", Info "New update"). Toasts slide in from the right with a spring and auto-dismiss after 4 seconds; a thin colored progress bar at the bottom drains from full to empty to show time remaining. Hovering a toast pauses the progress. Clicking X dismisses immediately. Use \`AnimatePresence mode="popLayout"\` so reflow is smooth when a middle toast is removed.

Use Tailwind CSS, Framer Motion, and Phosphor Icons (weight='regular'). Manrope font. Use \`bg-sand-950\` with the background image at \`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20pink%20Flower%20%20(1).png\` at 60% opacity.`,
}
