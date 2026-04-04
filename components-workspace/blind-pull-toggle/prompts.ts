import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a dark/light mode toggle component that looks like a vintage window-blind pull cord. It lives on a dark background.

Visually: a chunky rounded-square button (like an iOS app icon — very round corners, about 80×80px) with a moon or sun icon centred inside. Below the button hangs a thin cord line (about 44px tall) ending in a small circle pull-dot. The whole thing is centred in the view.

When you click it, two things happen at once:
1. The cord and dot drop downward like you've tugged a real blind cord, then spring back with a satisfying elastic bounce.
2. The icon transitions through a venetian-blind effect — the icon area is sliced into 6 horizontal strips that collapse one by one from top to bottom (like blinds closing), then reopen to reveal the new icon.

The button has a subtle hover scale and a slight press-down on tap. The whole component fades in from below on first load.

Build with Next.js App Router, Tailwind CSS, and Framer Motion.`,

  Bolt: `Build a React component called BlindPullToggle using Framer Motion.

Layout: dark background (bg-sand-950). A rounded-square button (80×80px, border-radius 22px) with gradient bg #3a3530→#252019, 1.5px border rgba(255,255,255,0.10), drop shadow + inner highlight. Centred Moon or Sun icon (36px, Phosphor icons, weight="regular", white). Below: a 2px×44px gradient cord line + 11px white pull-dot.

State: isDark (boolean, useState), animating (boolean, guard).

Use useAnimate from framer-motion. Assign scope ref to the root div. Target children by class:
- .cord-group — the cord wrapper div
- .slat — each of 6 icon strip divs

Toggle sequence (async):
1. await animate('.cord-group', { y: 30 }, { duration: 0.08 })
2. animate('.cord-group', { y: 0 }, { type:'spring', stiffness:260, damping:9 }) — no await
3. await animate('.slat', { scaleY:0 }, { delay: stagger(0.04), duration:0.1, ease:'easeIn' })
4. setIsDark(d => !d)
5. await animate('.slat', { scaleY:1 }, { delay: stagger(0.04), duration:0.13, ease:'easeOut' })

Slat structure (6 divs, each positioned absolutely inside a 36×36 overflow:hidden container):
- top: (i/6 * 100)%, height: (100/6)%, overflow:hidden, transformOrigin:'50% 50%'
- inner div shifted top: -(i * 36/6)px, containing the full icon

Entrance: motion.div initial={{ opacity:0, y:20 }} → animate={{ opacity:1, y:0 }}, 500ms easeOut.`,

  Lovable: `I'd love a component that feels genuinely physical — like reaching up and pulling a real window blind cord in a dark room.

Picture a smooth, heavy rounded button floating in darkness. It has weight to it, like a quality light switch — chunky corners, a soft gradient surface, the kind of thing that begs to be pressed. Below it hangs a delicate cord, barely visible against the dark, ending in a small round pull-dot.

When you click it, the cord swings down — you can almost feel the resistance — then snaps back with that elastic, satisfying bounce that only real cords have. And the icon? It doesn't just swap. It transitions like actual venetian blinds: strip by strip, top to bottom, each little slat folding away to hide the moon, then unfolding to reveal the sun. Or vice versa.

The mood is minimal and moody. Dark surfaces, white icons, quiet shadows. Nothing flashy — just that one delicious interaction that makes you want to tap it again.`,

  'Claude Code': `Create \`components-workspace/blind-pull-toggle/index.tsx\`. Export named function \`BlindPullToggle\`. Add \`'use client'\` at top.

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

  Cursor: `File: \`components-workspace/blind-pull-toggle/index.tsx\`
Export: \`BlindPullToggle\`, \`'use client'\`
Imports: motion, useAnimate, stagger (framer-motion); Moon, Sun (@phosphor-icons/react); useState, useCallback (react)

CONSTANTS: SLATS=6, ICON_SIZE=36

ROOT: \`<div ref={scope} className="flex h-full w-full items-center justify-center bg-sand-950">\`

STATE:
- isDark: boolean (useState true)
- animating: boolean (useState false)
- [scope, animate] = useAnimate()

BUTTON (motion.button, 80×80, borderRadius:22):
- bg: linear-gradient(145deg, #3a3530, #252019)
- border: 1.5px rgba(255,255,255,0.10), boxShadow inset highlight + drop
- whileHover scale:1.06, whileTap scale:0.97, spring stiffness:400 damping:28

SLATS (inside button, 36×36 overflow:hidden container):
- 6 divs with class="slat", each absolute, top:(i/6*100)%, height:(100/6)%, overflow:hidden
- transformOrigin:'50% 50%'
- inner div: top:-(i*6)px, renders Moon or Sun size:36, weight="regular", color:white

CORD (div.cord-group):
- 2px×44px gradient line + 11px white dot (0.62 opacity)
- onClick=handleToggle

ASYNC TOGGLE (guard: animating):
1. await animate('.cord-group', {y:30}, {duration:0.08})
2. animate('.cord-group', {y:0}, {type:'spring', stiffness:260, damping:9}) no-await
3. await animate('.slat', {scaleY:0}, {delay:stagger(0.04), duration:0.1, ease:'easeIn'})
4. setIsDark(d=>!d)
5. await animate('.slat', {scaleY:1}, {delay:stagger(0.04), duration:0.13, ease:'easeOut'})
6. setAnimating(false)

ENTRANCE: motion.div wrapper, opacity 0→1 y 20→0, duration:0.5`,
}
