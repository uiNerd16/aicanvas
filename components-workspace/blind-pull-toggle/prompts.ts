import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/blind-pull-toggle/index.tsx\`. Export named function \`BlindPullToggle\`. Add \`'use client'\` at top.

IMPORTS:
- \`useState, useCallback\` from react
- \`motion, useAnimate, stagger\` from framer-motion
- \`Moon, Sun\` from @phosphor-icons/react

CONSTANTS:
- SLATS = 6
- ICON_SIZE = 36

ROOT ELEMENT:
\`<div ref={scope} className="flex h-full w-full items-center justify-center bg-sand-950">\`

STATE:
- isDark: boolean = true (useState)
- animating: boolean = false (useState)
- [scope, animate] = useAnimate()

BUTTON (motion.button):
- width:80, height:80, borderRadius:22
- background: 'linear-gradient(145deg, #3a3530, #252019)'
- border: '1.5px solid rgba(255,255,255,0.10)'
- boxShadow: '0 6px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)'
- whileHover={{ scale:1.06 }}, whileTap={{ scale:0.97 }}
- transition: { type:'spring', stiffness:400, damping:28 }

VENETIAN BLIND ICON (inside button):
- Container: position:relative, width:ICON_SIZE, height:ICON_SIZE, overflow:hidden
- Map Array(SLATS) → div.slat for each i:
  - position:absolute, top:(i/SLATS*100)%, height:(100/SLATS)%, width:100%, overflow:hidden, transformOrigin:'50% 50%'
  - Inner div: position:absolute, top:-(i*ICON_SIZE/SLATS)px, width:ICON_SIZE, height:ICON_SIZE, color:white
  - Render Moon (isDark) or Sun (!isDark) at size ICON_SIZE, weight="regular"

CORD (div.cord-group):
- 2px×44px gradient line: rgba(255,255,255,0.28) → rgba(255,255,255,0.07)
- 11px circle dot: background rgba(255,255,255,0.62), boxShadow '0 2px 8px rgba(0,0,0,0.5)'
- onClick={handleToggle}, cursor:pointer

TOGGLE HANDLER (useCallback, async):
1. if (animating) return; setAnimating(true)
2. await animate('.cord-group', { y:30 }, { duration:0.08, ease:[0.4,0,1,1] })
3. animate('.cord-group', { y:0 }, { type:'spring', stiffness:260, damping:9 }) // no await
4. await animate('.slat', { scaleY:0 }, { delay:stagger(0.04), duration:0.1, ease:'easeIn' })
5. setIsDark(d => !d)
6. await animate('.slat', { scaleY:1 }, { delay:stagger(0.04), duration:0.13, ease:'easeOut' })
7. setAnimating(false)

ENTRANCE: wrap inner flex column in motion.div, initial={{ opacity:0, y:20 }}, animate={{ opacity:1, y:0 }}, transition={{ duration:0.5, ease:'easeOut' }}`,

  V0: `Create a dark/light mode toggle component that looks like a vintage window-blind pull cord. It lives on a dark background.

Visually: a chunky rounded-square button (like an iOS app icon — very round corners, about 80×80px) with a moon or sun icon centred inside. Below the button hangs a thin cord line (about 44px tall) ending in a small circle pull-dot. The whole thing is centred in the view.

When you click it, two things happen at once:
1. The cord and dot drop downward like you've tugged a real blind cord, then spring back with a satisfying elastic bounce.
2. The icon transitions through a venetian-blind effect — the icon area is sliced into 6 horizontal strips that collapse one by one from top to bottom (like blinds closing), then reopen to reveal the new icon.

The button has a subtle hover scale and a slight press-down on tap. The whole component fades in from below on first load.

Build with Next.js App Router, Tailwind CSS, and Framer Motion.`,
}
