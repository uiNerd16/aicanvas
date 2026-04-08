import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create components-workspace/glass-progress/index.tsx — a glassmorphism progress bar showcase.

Export: named function GlassProgress

Constants:
- GLASS_BLUR: { backdropFilter: 'blur(24px) saturate(1.8)', WebkitBackdropFilter: 'blur(24px) saturate(1.8)' }
- GLASS_PANEL: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)' }
- BACKGROUND_IMAGE: ImageKit URL (ethereal orange flower photo)

Types:
- GlassProgressBarProps: { value: number, color: string, gradient: string, label?: string, animated?: boolean }
- BarConfig: { label: string, value: number, color: string, gradient: string, delay: number }

Bar data (BARS: BarConfig[]):
- Storage: value 72, color '#3A86FF', gradient '#3A86FF, #2962FF', delay 200
- Upload: value 45, color '#FF5C8A', gradient '#FF5C8A, #FF1744', delay 400
- Battery: value 88, color '#06D6A0', gradient '#06D6A0, #00BFA5', delay 600
- Memory: value 30, color '#FFBE0B', gradient '#FFBE0B, #FF9800', delay 800

GlassProgressBar subcomponent:
- useReducedMotion() for reduced motion check
- Animated percentage: useSpring(0, {stiffness:80, damping:20}). useEffect sets springValue to props.value. useMotionValueEvent on 'change' rounds and sets displayPercent state.
- Glow calculation: glowAlpha = Math.round(40 + value*0.4).toString(16).padStart(2,'0'), glowSize = 4 + value*0.08
- fillTransition: prefersReduced ? {duration:0.3} : {type:'spring', stiffness:200, damping:24}
- pulseAnimate: when animated && !prefersReduced → { width: \`\${value}%\`, opacity: [0.85, 1, 0.85] }. Otherwise just { width: \`\${value}%\` }
- pulseTransition: when animated && !prefersReduced → { width: fillTransition, opacity: {duration:2, repeat:Infinity, ease:'easeInOut'} }
- Layout:
  - Outer: div w-full
  - Label row: mb-2 flex justify-between px-1. Label: text-[10px] font-semibold uppercase tracking-widest text-white/40 font-sans. Percent: same text size, color \${color}88
  - Track: relative h-2 w-full overflow-hidden rounded-full, GLASS_PANEL spread. Non-animating blur layer inside (absolute inset-0, GLASS_BLUR).
  - Fill: motion.div absolute bottom-0 left-0 top-0 rounded-full. Style: background linear-gradient(90deg, \${gradient}), filter: drop-shadow(0 0 \${glowSize}px \${color}\${glowAlpha}). initial width:'0%', animate: pulseAnimate, transition: pulseTransition.

Main GlassProgress:
- State: values useState<number[]>([0,0,0,0]), resetKey useState(0)
- replay: useCallback → setValues([0,0,0,0]), setResetKey(k => k+1)
- useEffect (dep: [resetKey]): for each BAR, setTimeout at bar.delay to update values[i] to bar.value. Cleanup clears all timeouts.
- Root: div, relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950
- Background: img absolute inset-0, object-cover, opacity-60, pointer-events-none
- Wrapper: div, relative flex w-full max-w-[340px] flex-col items-center gap-4 px-4
- Glass card: motion.div, initial {scale:0.92, y:16}, animate {scale:1, y:0}, transition spring stiffness:300 damping:26. Class: relative isolate w-full overflow-hidden rounded-3xl. Style: GLASS_PANEL spread.
  - Blur layer: div absolute inset-0 z-[-1] rounded-3xl, GLASS_BLUR
  - Top highlight: div absolute left-8 right-8 top-0 h-[1px], background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)
  - Content: div flex-col gap-5 px-6 py-6. Maps BARS to GlassProgressBar with label, value from values[i], color, gradient, animated.
- Refresh button: motion.button, 40x40 rounded-full, cursor-pointer. Style: bg rgba(255,255,255,0.06), border 1px rgba(255,255,255,0.1). whileHover: {scale:1.12, background:'rgba(255,255,255,0.12)'}. whileTap: {scale:0.9, rotate:-90}. transition: spring stiffness:400 damping:20. ArrowClockwise icon size 18 weight="regular" text-white/50. aria-label="Replay animation".

Imports: useState, useEffect, useCallback from react. motion, useSpring, useMotionValueEvent, useReducedMotion from framer-motion. ArrowClockwise from @phosphor-icons/react.`,

  V0: `Create a glass progress bar showcase component on a dark background with a full-bleed background image (an ethereal orange flower photo loaded from a URL, opacity 60%, object-cover).

The component displays 4 labeled progress bars inside a frosted glass card panel (rounded-3xl corners). Each bar has a different color and fill percentage:
- Storage: 72%, blue (#3A86FF → #2962FF gradient)
- Upload: 45%, pink (#FF5C8A → #FF1744 gradient)
- Battery: 88%, green (#06D6A0 → #00BFA5 gradient)
- Memory: 30%, yellow (#FFBE0B → #FF9800 gradient)

The glass card has a frosted blur effect (24px blur, 1.8 saturation), very subtle white background (6% opacity), thin white border (10% opacity), and a deep shadow. A thin horizontal highlight line sits at the top edge of the card.

Each progress bar has:
- A label row above with the category name (uppercase, tiny, tracking-widest, white/40%) on the left and the animated percentage counter on the right in the bar's accent color
- An 8px tall glass track (same frosted glass styling as the card)
- A gradient fill bar that animates from 0% to the target value with spring physics
- A colored glow/drop-shadow on the fill that intensifies with the progress value
- A subtle pulsing opacity animation (0.85 → 1 → 0.85, looping) on the fill

The bars appear with staggered delays (200ms, 400ms, 600ms, 800ms) — each bar's fill springs in one after another.

Below the glass card, a small circular refresh button (ArrowClockwise icon from Phosphor Icons) resets all bars to 0 and replays the entire staggered animation. The button has a glass styling, rotates -90° on press, and scales up on hover.

The card enters with a spring scale+y animation (from 0.92 scale and 16px down). The whole layout is responsive — the card uses w-full max-w-[340px] with horizontal padding so it fits on mobile screens.

The percentage counters use Framer Motion's useSpring to animate from 0 to the target value smoothly. Respects prefers-reduced-motion.

Build with React, TypeScript, Tailwind CSS, Framer Motion, and Phosphor Icons.`,
}
