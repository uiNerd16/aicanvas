import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/flip-calendar/index.tsx\`. Export named function \`FlipCalendar\`.

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

  V0: `Create a desk calendar widget called FlipCalendar that shows dates 1 through 31. It should look like a classic tear-off desk calendar — compact, with rounded corners and a nice drop shadow.

The card face is split into two tones: a slightly darker blue on the top half (#4A90D9) and a lighter blue on the bottom half (#5BA3E8). The current date appears as a large bold white number centered across the card. Two small decorative circular binding rings sit at the top, like a real desk calendar.

When the user clicks "Next →" or "← Prev", the calendar performs a satisfying flip animation. The top half of the current date folds away (rotating down, 0 to -90 degrees, ease-in, 180ms), then the new date's bottom half swings in from behind (90 to 0 degrees, ease-out, 180ms). After 31 it loops back to 1, and before 1 it wraps to 31.

Use Next.js with Tailwind CSS and Framer Motion for all animations. Support both light and dark mode — in dark mode the blues deepen slightly to #3a78c4 (top) and #4a8fd4 (bottom). Show Prev/Next buttons below the card.`,
}
