import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a desk calendar widget called FlipCalendar that shows dates 1 through 31. It should look like a classic tear-off desk calendar — compact, with rounded corners and a nice drop shadow.

The card face is split into two tones: a slightly darker blue on the top half (#4A90D9) and a lighter blue on the bottom half (#5BA3E8). The current date appears as a large bold white number centered across the card. Two small decorative circular binding rings sit at the top, like a real desk calendar.

When the user clicks "Next →" or "← Prev", the calendar performs a satisfying flip animation. The top half of the current date folds away (rotating down, 0 to -90 degrees, ease-in, 180ms), then the new date's bottom half swings in from behind (90 to 0 degrees, ease-out, 180ms). After 31 it loops back to 1, and before 1 it wraps to 31.

Use Next.js with Tailwind CSS and Framer Motion for all animations. Support both light and dark mode — in dark mode the blues deepen slightly to #3a78c4 (top) and #4a8fd4 (bottom). Show Prev/Next buttons below the card.`,

  Bolt: `Build a React component called FlipCalendar using Framer Motion for a 3D flip-clock animation between dates 1–31.

Component structure:
- Root div: flex h-full w-full items-center justify-center with light/dark bg
- Calendar card: ~200px wide, 3:4 aspect ratio, rounded-xl, box-shadow
- Two decorative circular rings at the top (binding dots)
- Card face split into top half (darker blue) and bottom half (lighter blue)
- Large bold number centered across both halves

State management:
- currentDate, nextDate, isFlipping, phase ('idle' | 'a' | 'b'), staticTopDate, staticBottomDate
- All flip timeouts stored in a useRef array, cleared on unmount

4-layer flip system:
1. Static top half — always visible, updates to nextDate mid-flip
2. Static bottom half — always visible, updates to nextDate mid-flip
3. Flap A (top) — currentDate top half, animates rotateX 0 → -90, 180ms ease-in
4. Flap B (bottom) — nextDate bottom half, animates rotateX 90 → 0, 180ms ease-out, starts when phase becomes 'b'

Each half uses overflow:hidden to clip the number to just that half. The number container spans 200% height anchored at the appropriate edge, so it looks like one big centered number split across both halves.

Colors: dark mode top #3a78c4 / bottom #4a8fd4, light mode top #4A90D9 / bottom #5BA3E8. Use useTheme from ThemeProvider to pick per-mode. Number text: #ffffff.

Controls: Prev and Next buttons. Disabled + opacity 0.45 while isFlipping.`,

  Lovable: `I'd love a component that feels like flipping through a physical desk calendar — the kind you'd find on a professor's desk, slightly worn but charming.

Imagine a small card sitting on a surface, casting a gentle shadow. The card face is two shades of calm blue — the top half a richer, deeper blue, the bottom half a lighter, airier blue. A big, bold white number fills the center, straddling both halves like it's embossed on the card.

Two small round rings poke out at the top, just like a real spiral-bound desk calendar.

When you click "Next" or "Prev", the card comes alive with a satisfying flip: the top half peels away like a page being turned, revealing the new date beneath. It's smooth, physical, mechanical — the kind of animation that just feels right.

In dark mode the blues become a bit moodier and deeper, like evening light falling on the calendar. In light mode they stay bright and clean.

The whole thing should feel compact and tactile — not flashy, just genuinely satisfying to click through. Built with React, Framer Motion for the 3D flip, and Tailwind CSS.`,

  'Claude Code': `Create \`components-workspace/flip-calendar/index.tsx\`. Export named function \`FlipCalendar\`.

## Constants
\`\`\`
DARK_TOP    = '#3a78c4'
DARK_BOTTOM = '#4a8fd4'
LIGHT_TOP   = '#4A90D9'
LIGHT_BOTTOM = '#5BA3E8'
FLAP_A_DURATION_MS = 180   // top flap: ease-in
FLAP_B_DURATION_MS = 180   // bottom flap: ease-out
\`\`\`

## State
- \`currentDate: number\` — settled visible date (1–31)
- \`nextDate: number\` — target date during flip
- \`isFlipping: boolean\`
- \`phase: 'idle' | 'a' | 'b'\`
- \`staticTopDate: number\` — what static top half shows (switches mid-flip)
- \`staticBottomDate: number\` — what static bottom half shows (switches mid-flip)
- \`timeoutsRef: useRef<ReturnType<typeof setTimeout>[]>\` — cleared on unmount

## flip(direction) algorithm
1. Guard: if isFlipping, return early
2. Compute target = next/prev with wrap at 1↔31
3. Set nextDate=target, staticTopDate=currentDate, staticBottomDate=currentDate
4. Set isFlipping=true, phase='a'
5. scheduleTimeout at FLAP_A_DURATION_MS:
   - setStaticTopDate(target), setStaticBottomDate(target), setPhase('b')
6. scheduleTimeout at FLAP_A_DURATION_MS + FLAP_B_DURATION_MS + 20:
   - setCurrentDate(target), setIsFlipping(false), setPhase('idle')

## 4-layer rendering (all absolutely positioned within card)
1. \`<NumberHalf>\` static top — zIndex 1, shows staticTopDate when flipping else currentDate
2. \`<NumberHalf>\` static bottom — zIndex 1, shows staticBottomDate when flipping else currentDate
3. Flap A (only when isFlipping) — zIndex 3, top 0, height 50%, perspective 600:
   - \`<motion.div>\` transformOrigin "center bottom", backfaceVisibility hidden
   - initial rotateX 0, animate rotateX -90, duration 0.18s ease-in
   - Shows currentDate top half
4. Flap B (only when isFlipping) — zIndex 2, bottom 0, height 50%, perspective 600:
   - \`<motion.div>\` transformOrigin "center top", backfaceVisibility hidden
   - initial rotateX 90, animate based on phase: 'b' → rotateX 0 (0.18s ease-out), else stays at 90
   - Shows nextDate bottom half

## Number rendering
Each half uses overflow:hidden. Inside, the number container is height:200%, anchored top (for top half) or bottom (for bottom half), centering the number across the full card height. Font: font-bold, clamp(3.5rem, 13vw, 5.5rem), color #ffffff.

## Card structure
- width min(200px, 44vw), aspectRatio 3/4, rounded-xl, box-shadow
- Two circular ring dots at top (14×14px, borderRadius 50%)
- Center seam: 2px div at top:calc(50%-1px), rgba(0,0,0,0.2)

## Root element
\`className="flex h-full w-full flex-col items-center justify-center gap-8 bg-sand-100 dark:bg-sand-950"\`

## Imports
- \`useTheme\` from \`../../app/components/ThemeProvider\`
- \`motion\` from \`framer-motion\`
- \`useState, useEffect, useRef\` from \`react\`

TypeScript strict, no any. Clean up all timeouts on unmount.`,

  Cursor: `File: \`components-workspace/flip-calendar/index.tsx\`
Export: \`FlipCalendar\`

**Colors**
- Dark mode: top \`#3a78c4\`, bottom \`#4a8fd4\`
- Light mode: top \`#4A90D9\`, bottom \`#5BA3E8\`
- Number text: \`#ffffff\`
- Import \`useTheme\` from \`../../app/components/ThemeProvider\`

**State**
- \`currentDate\` / \`nextDate\` / \`isFlipping\` / \`phase: 'idle'|'a'|'b'\`
- \`staticTopDate\` / \`staticBottomDate\` (update to target mid-flip)
- \`timeoutsRef: useRef<ReturnType<typeof setTimeout>[]>\` — clear on unmount

**flip() logic**
- Guard isFlipping
- Compute target with wrap 1↔31
- Set isFlipping=true, phase='a', nextDate=target
- setTimeout @ 180ms: update staticTop/Bottom to target, phase='b'
- setTimeout @ 380ms: currentDate=target, isFlipping=false, phase='idle'

**4-layer card**
1. Static top half — zIndex 1, overflow hidden, shows current/staticTop
2. Static bottom half — zIndex 1, overflow hidden, shows current/staticBottom
3. Flap A (isFlipping only) — zIndex 3, top 0, h 50%, perspective 600
   - motion.div: transformOrigin "center bottom", rotateX 0→-90, 180ms ease-in
4. Flap B (isFlipping only) — zIndex 2, bottom 0, h 50%, perspective 600
   - motion.div: transformOrigin "center top", rotateX 90→0 when phase='b', 180ms ease-out

**Number layout**: each half has overflow hidden; inner div is height 200%, anchored top/bottom, flex-center. Font clamp(3.5rem, 13vw, 5.5rem) bold white.

**Card**: width min(200px, 44vw), aspectRatio 3/4, rounded-xl, box-shadow. Two 14px circular ring dots at top.

**Root**: \`flex h-full w-full flex-col items-center justify-center gap-8 bg-sand-100 dark:bg-sand-950\`

**Buttons**: Prev / Next below card. Disabled + opacity 0.45 when isFlipping. spring: stiffness 400 damping 30 on whileTap.`,
}
