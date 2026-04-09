import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named BlindPullToggle — a dark/light mode toggle styled as a window-blind with a pull cord. Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Layout: fills parent (flex h-full w-full items-center justify-center). Background is theme-aware: #110F0C (dark) / #EDEAE5 (light).

Detect theme: closest [data-card-theme] ancestor else document.documentElement .dark class. MutationObserver on both for class changes.

Responsive sizing via ResizeObserver on root. size = clamp(48, min(w,h) * 0.2, 80). Keep a ref mirror for async handlers.

Constants: SLATS = 6. Derived: iconSize = round(size*0.45), radius = round(size*0.275), cordRestH = round(size*0.30), dotSize = max(8, round(size*0.138)).

Button: motion.button, width/height = size, borderRadius = radius, transparent background. whileHover scale 1.06, whileTap scale 0.97, spring {stiffness:400, damping:28}. Border: 1.5px solid rgba(255,255,255,0.10) dark / rgba(0,0,0,0.12) light. Shadow dark: '0 6px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)'; light: '0 4px 20px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)'.

Inside the button: absolute inset-0 container with borderRadius radius-1, overflow hidden. Render 6 slats. For slat i: topPx = round((i/6)*size), nextTop = i===5 ? size : round(((i+1)/6)*size), height = nextTop-topPx. Each slat is absolutely positioned, transformOrigin '50% 50%', contains a full-size div shifted top: -topPx showing buttonBg gradient + centered icon. Dark bg: 'linear-gradient(145deg, #3a3530, #252019)'; light: 'linear-gradient(145deg, #E8E4DC, #DFDBD4)'. Icon color: white (dark) / #2E2A24 (light). Use Phosphor Moon (toggleDark true) or Sun (toggleDark false), weight='regular', size=iconSize.

Cord below button (flex-col, centered, cursor pointer, calls same handler): a 2px-wide div .cord-line height cordRestH with linear-gradient top→bottom from cordTop to cordBottom. Dark cordTop rgba(255,255,255,0.28), cordBottom rgba(255,255,255,0.07); light 0.22 / 0.05. Below: a circular pull dot of dotSize with rgba(255,255,255,0.62)/rgba(0,0,0,0.32) bg and shadow '0 2px 8px rgba(0,0,0,0.5)' dark / '0 2px 6px rgba(0,0,0,0.12)' light.

Use useAnimate + stagger from framer-motion. handleToggle (guarded by animating flag):
1) animate('.cord-line', {height: round(size*0.65)}, {duration:0.1, ease:[0.4,0,1,1]})
2) animate('.cord-line', {height: round(size*0.30)}, {type:'spring', stiffness:300, damping:18}) — fire and forget
3) await animate('.slat', {scaleY:0}, {delay: stagger(0.04), duration:0.1, ease:'easeIn'})
4) flip toggleDark
5) await animate('.slat', {scaleY:1}, {delay: stagger(0.04), duration:0.13, ease:'easeOut'})

Wrap the whole toggle + cord in a motion.div with initial {opacity:0, y:20} → {opacity:1, y:0}, duration 0.5, ease 'easeOut'.`,

  GPT: `Build a React client component named BlindPullToggle. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

A square button that looks like a window-blind. Clicking (or tugging the cord dot below) animates a pull cord, closes the horizontal slats, swaps a Moon/Sun icon, reopens the slats.

## Data/State
- SLATS = 6, MAX_SIZE = 80, MIN_SIZE = 48
- useState: toggleDark (true), pageIsDark (true), animating (false), size (80)
- useRef: sizeRef = 80, scope from useAnimate()

## Theme + resize
Closest [data-card-theme] → .dark class, else documentElement .dark. MutationObserver on both. ResizeObserver on scope: size = clamp(MIN,MAX, round(min(offsetW,offsetH)*0.2)); mirror to sizeRef.

## Derived
iconSize=round(size*0.45), radius=round(size*0.275), cordRestH=round(size*0.30), dotSize=max(8,round(size*0.138)).

## Colors
previewBg: #110F0C dark / #EDEAE5 light. buttonBg gradient dark 'linear-gradient(145deg,#3a3530,#252019)' light '(145deg,#E8E4DC,#DFDBD4)'. Border 1.5px rgba(255,255,255,0.10)/rgba(0,0,0,0.12). Shadow dark '0 6px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)' light '0 4px 20px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)'. Icon white/#2E2A24. Cord top rgba(255,255,255,0.28)/rgba(0,0,0,0.22), bottom 0.07/0.05. Dot rgba(255,255,255,0.62)/rgba(0,0,0,0.32), shadow '0 2px 8px rgba(0,0,0,0.5)' / '0 2px 6px rgba(0,0,0,0.12)'.

## Animation
handleToggle (skip if animating):
1. pullH = round(sizeRef*0.65), restH = round(sizeRef*0.30)
2. await animate('.cord-line', {height: pullH}, {duration:0.1, ease:[0.4,0,1,1]})
3. animate('.cord-line', {height: restH}, {type:'spring', stiffness:300, damping:18})
4. await animate('.slat', {scaleY:0}, {delay: stagger(0.04), duration:0.1, ease:'easeIn'})
5. setToggleDark(d=>!d)
6. await animate('.slat', {scaleY:1}, {delay: stagger(0.04), duration:0.13, ease:'easeOut'})

Button whileHover scale 1.06, whileTap 0.97, spring {stiffness:400, damping:28}. Wrapper motion.div initial {opacity:0,y:20} animate {opacity:1,y:0} transition {duration:0.5, ease:'easeOut'}.

## Interaction
Click on button or on the cord+dot element both invoke handleToggle. Ignore clicks while animating.

## JSX structure
- div ref=scope, flex h-full w-full items-center justify-center, style background=previewBg
  - motion.div column
    - motion.button width/height size, borderRadius radius, transparent bg, border, shadow
      - inner div absolute inset-0, borderRadius radius-1, overflow hidden
        - 6 slats: topPx = round((i/6)*size), nextTop = i===5?size:round(((i+1)/6)*size), height = nextTop-topPx; className "slat"; transformOrigin '50% 50%'; inner absolute div top:-topPx width/height size, buttonBg gradient, centered Moon (toggleDark) or Sun (else), size=iconSize, weight='regular', color=iconColor
    - div (cursor pointer, onClick handleToggle)
      - div className "cord-line" width 2, height cordRestH, linear-gradient top→bottom cordTop→cordBottom, borderRadius 1
      - div circular dotSize, bg dotBg, shadow dotShadow

Import: useState, useCallback, useEffect, useRef; motion, useAnimate, stagger; Moon, Sun from @phosphor-icons/react.`,

  Gemini: `Implement a React client component named BlindPullToggle as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, useAnimate, stagger } from 'framer-motion'
import { Moon, Sun } from '@phosphor-icons/react'

USE these hooks and no others. DO NOT invent hooks not shown above. useAnimate returns [scope, animate]. Use \`scope\` as a ref on the root div. Use stagger(0.04) as the value of the \`delay\` option in animate calls on '.slat'.

## Concept
A square button themed as a window-blind. Click triggers: cord stretches → springs back; slats close (staggered scaleY:0); icon swap Moon↔Sun; slats reopen (staggered scaleY:1).

## Constants
SLATS=6, MAX_SIZE=80, MIN_SIZE=48.

## State
toggleDark=true, pageIsDark=true, animating=false, size=80. Refs: sizeRef=80 (kept in sync with size for async handlers), scope from useAnimate.

## Theme detection
useEffect on mount: const el = scope.current; const check = () => { const card = el.closest('[data-card-theme]'); setPageIsDark(card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark')) }; check(); MutationObserver on documentElement {attributes:true, attributeFilter:['class']} and on cardWrapper if present. Disconnect on cleanup.

## Resize
useEffect: ResizeObserver on scope.current. On change: s = max(MIN_SIZE, min(MAX_SIZE, round(min(offsetWidth, offsetHeight)*0.2))); sizeRef.current=s; setSize(s).

## Derived
iconSize=round(size*0.45), radius=round(size*0.275), cordRestH=round(size*0.30), dotSize=max(8, round(size*0.138)).

## Theme colors
previewBg: '#110F0C' dark / '#EDEAE5' light.
buttonBg dark 'linear-gradient(145deg, #3a3530, #252019)' light 'linear-gradient(145deg, #E8E4DC, #DFDBD4)'.
buttonBorder dark '1.5px solid rgba(255,255,255,0.10)' light '1.5px solid rgba(0,0,0,0.12)'.
buttonShadow dark '0 6px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)' light '0 4px 20px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)'.
iconColor 'white' / '#2E2A24'.
cordTop 'rgba(255,255,255,0.28)' / 'rgba(0,0,0,0.22)'. cordBottom 'rgba(255,255,255,0.07)' / 'rgba(0,0,0,0.05)'.
dotBg 'rgba(255,255,255,0.62)' / 'rgba(0,0,0,0.32)'.
dotShadow '0 2px 8px rgba(0,0,0,0.5)' / '0 2px 6px rgba(0,0,0,0.12)'.

## handleToggle (useCallback, guards on animating)
1. setAnimating(true)
2. pullH = round(sizeRef.current*0.65); restH = round(sizeRef.current*0.30)
3. await animate('.cord-line', { height: pullH }, { duration: 0.1, ease: [0.4,0,1,1] })
4. animate('.cord-line', { height: restH }, { type: 'spring', stiffness: 300, damping: 18 })
5. await animate('.slat', { scaleY: 0 }, { delay: stagger(0.04), duration: 0.1, ease: 'easeIn' })
6. setToggleDark(d=>!d)
7. await animate('.slat', { scaleY: 1 }, { delay: stagger(0.04), duration: 0.13, ease: 'easeOut' })
8. setAnimating(false)

## JSX
Root: div ref={scope} className="flex h-full w-full items-center justify-center" style={{background: previewBg}}.
motion.div initial {opacity:0,y:20} animate {opacity:1,y:0} transition {duration:0.5, ease:'easeOut'} className="flex select-none flex-col items-center".
motion.button onClick={handleToggle} whileHover={{scale:1.06}} whileTap={{scale:0.97}} transition={{type:'spring',stiffness:400,damping:28}} with inline style {width:size, height:size, borderRadius:radius, border:buttonBorder, boxShadow:buttonShadow, background:'transparent', cursor:'pointer', position:'relative'}.
Inside: div {position:'absolute', inset:0, borderRadius:radius-1, overflow:'hidden'} containing 6 slats generated from Array.from({length:6}). For slat i compute topPx=round((i/SLATS)*size), nextTop = i===SLATS-1 ? size : round(((i+1)/SLATS)*size), heightPx=nextTop-topPx. Each slat: className "slat", absolute top:topPx left:0 width:'100%' height:heightPx overflow:hidden transformOrigin:'50% 50%'. Inside the slat put a div absolute top:-topPx width:size height:size with background:buttonBg, flex centered, color:iconColor, rendering <Moon size={iconSize} weight="regular"/> when toggleDark else <Sun size={iconSize} weight="regular"/>.
Below button: div (flex-col items-center cursor pointer, onClick={handleToggle}). Inside: a div className "cord-line" style {width:2, height:cordRestH, background:\`linear-gradient(to bottom, \${cordTop}, \${cordBottom})\`, borderRadius:1} then circular dot {width:dotSize, height:dotSize, borderRadius:'50%', background:dotBg, boxShadow:dotShadow}.

Cleanup MutationObserver and ResizeObserver on unmount.`,

  V0: `Create a BlindPullToggle component — a square button that looks like a set of mini window-blinds, with a thin pull cord and small round pull dot hanging from its bottom edge. Clicking the button or tugging the cord plays a sequence: the cord stretches down, springs back, then the six horizontal slats snap closed (top→bottom stagger), a Moon icon swaps to a Sun (or vice versa), and the slats roll back open. It is a dark/light mode toggle.

Use Tailwind CSS, Framer Motion, and Phosphor Icons (weight='regular'). Detect theme via closest [data-card-theme] element's dark class, falling back to document.documentElement. Dark preview background #110F0C, light #EDEAE5. The button fills ~20% of the min container dimension, clamped 48–80px, and every internal size (icon, radius, cord length, dot) scales with it. Button face uses a warm metallic gradient ('145deg, #3a3530, #252019' dark / '#E8E4DC, #DFDBD4' light) with a subtle inset highlight and soft drop shadow. The cord is a 2px vertical line fading from ~28% to ~7% opacity (white on dark, black on light) ending in a small circle. Use motion's useAnimate + stagger to orchestrate the pull (100ms easeIn), spring rebound (stiffness 300 damping 18), slat close (stagger 40ms, 100ms easeIn), icon swap, slat open (stagger 40ms, 130ms easeOut). Hover scales button 1.06, tap 0.97.`,
}
