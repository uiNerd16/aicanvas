import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a RunwayLoader component — an animated loading progress bar styled as an airplane runway.

Visual design:
- A horizontal pill/capsule bar (56px tall, full width up to 440px)
- Dark grey track with deep inset shadow (gradient from #404040 to #252525 in dark mode)
- Crimson-red fill from left to right (gradient: #6b0000 → #be1c1c → #e03030)
- Dashed white centreline markings on the unfilled runway portion
- Heat shimmer exhaust effect behind the engines (orange radial blur, animated opacity flicker)

Airplane SVG (top-down view, pointing right, 72×46px):
- White/silver fuselage (ellipse, rx=29 ry=7) with gradient: top #ececec → white → bottom #d0d0d0
- Two swept wings (paths pointing up/down from the fuselage) with gradient white to #bababa
- Two engine pods on the wings (rotated ellipses, gradient #d0d0d0 → #808080)
- Horizontal tail stabilisers at the back (small triangular paths, #c8c8c8)
- Nose taper (white pointed path at the right end)
- Cockpit window (ellipse, #7ec8e8 with 0.9 opacity)
- Drop shadow filter: drop-shadow(0 4px 12px rgba(0,0,0,0.75)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))

Animation cycle (loops automatically):
1. Taxiing (0→100% over 5.5s, linear via requestAnimationFrame)
   - Airplane sits at the fill boundary (clamped to 91% max)
   - Engine rumble: Framer Motion x/y shake array, intensity increases from 0.4px at 0% to 5px at 100%
   - Nose-up tilt: rotates -18° over the final 22% of progress
2. Takeoff (1 second):
   - Airplane animates x:+100, y:-120, opacity:0 over 0.95s easeOut
3. Reset (0.5 second): plane hidden, progress snaps to 0, new cycle begins

Below the bar: percentage counter (28px bold tabular-nums) + status label ("Preparing for takeoff" → "Taking off!")

Support light and dark mode. Use Tailwind CSS. TypeScript throughout.`,

  Bolt: `Add a RunwayLoader component to this project.

Stack: React, TypeScript, Framer Motion, Tailwind CSS

File: components/RunwayLoader.tsx

Airplane SVG (top-down, points right, 72×46px viewBox):
  - fuselage: <ellipse cx=34 cy=23 rx=29 ry=7> with vertical linear gradient #ececec→white→#d0d0d0
  - top wing path: M30,21 L23,21 L7,1 L15,0 Z — gradient white→#bababa (top-left to bottom-right)
  - bottom wing path: M30,25 L23,25 L7,45 L15,46 Z — same gradient mirrored
  - engine pods: two rotated ellipses (cx=13 cy=8 rx=7 ry=2.8 rotate=-29) and (cy=38 rotate=29)
  - tail stabilisers: two small triangular paths at the back
  - nose: path D="M61,19.5 C66,21.5 67.5,23 67,23 C67.5,23 66,24.5 61,26.5 L58,23 Z"
  - cockpit: ellipse cx=57 cy=23 rx=4 ry=3 fill=#7ec8e8
  - drop-shadow filter on the <svg> element

Progress state: useState(0), updated via requestAnimationFrame over 5500ms
Phase state: 'taxiing' | 'takeoff' | 'resetting'
Cycle state: integer, incremented on reset to force AnimatePresence remount

Runway track (h=56, rounded-full):
  background: linear-gradient(to bottom, #404040, #252525)
  box-shadow: inset 0 4px 12px rgba(0,0,0,0.85), inset 0 -1px 3px rgba(255,255,255,0.04)

Red fill div (absolute inset-y-0 left-0 rounded-full):
  width: {progress}%
  background: linear-gradient(to right, #6b0000, #be1c1c 50%, #e03030)

Dashed centreline (absolute top-1/2 h-[2px]):
  left: calc({min(progress,94)}% + 14px), right: 18px
  backgroundImage: repeating-linear-gradient(to right, rgba(255,255,255,0.22) 0, ... 10px, transparent 10px, ... 24px)

Heat shimmer (motion.div, shown when progress>30):
  position right of plane, blur(8px) orange radial gradient
  animate={{ opacity: [0.3,0.75,0.2,0.65,0.3] }} repeat: Infinity duration: 0.2s

Airplane wrapper: absolute top-1/2 left={planePct}% transform="translateX(-50%) translateY(-50%)"
  Outer motion.div: animate={{ rotate: noseUp }} where noseUp ramps from 0 to -18° over last 22% of progress
  Inner motion.div (taxiing): animate x/y shake array, duration 0.13s repeat Infinity
  Inner motion.div (takeoff): initial={{x:0,y:0,opacity:1}} animate={{x:100,y:-120,opacity:0}} duration 0.95s easeOut

Progress readout below bar: Math.round(progress) + "%" + status label`,

  Lovable: `Build me a beautiful animated loading bar component inspired by an airplane preparing to take off on a runway. Here's exactly what I want:

The main element is a wide, pill-shaped bar — like a runway viewed from above. The left portion fills with a deep red/crimson colour as loading progresses, while the right side shows the unfilled dark grey runway with dashed white centreline markings, just like a real runway.

Sitting right at the boundary between filled and unfilled is a detailed airplane icon — a top-down overhead view of a commercial airliner, pointing to the right, white and silver with realistic gradients and a drop shadow to give it depth.

The animation has three phases:
1. The airplane slowly taxis down the runway (takes about 5 seconds to go from 0% to 100%). As it moves, the engines make the plane vibrate and shake — gently at first, then increasingly intense as it approaches takeoff speed. In the final stretch, the nose tilts upward.
2. At 100%, the plane lifts off — it animates diagonally up and to the right, fading out.
3. The whole thing resets and loops automatically.

There's also an orange heat-shimmer exhaust effect behind the engines that flickers as the plane moves.

Below the bar, show the percentage (large bold number) and a label that says "Preparing for takeoff" and changes to "Taking off!" at the end.

Support light and dark mode. Use Framer Motion for all animations, Tailwind CSS, TypeScript.`,

  'Claude Code': `Create components-workspace/runway-loader/index.tsx — an airplane runway loading bar component.

'use client'
Imports: useEffect, useRef, useState from react; motion, AnimatePresence from framer-motion; useTheme from ../../app/components/ThemeProvider

── Airplane component ──────────────────────────────────────────────────────────
Props: { isDark: boolean }
SVG 72×46 viewBox="0 0 72 46" fill="none"
filter: isDark ? drop-shadow(0 4px 12px rgba(0,0,0,0.75)) drop-shadow(0 2px 4px rgba(0,0,0,0.5)) : lighter version

SVG defs — linearGradients:
  rl-body: vertical, #ececec → #ffffff (40%) → #d0d0d0
  rl-wing-t: diagonal, #f8f8f8 → #bababa
  rl-wing-b: diagonal mirror, #f8f8f8 → #bababa
  rl-eng: vertical, #d0d0d0 → #808080

SVG shapes (all fill with gradients above):
  Top wing: path M30,21 L23,21 L7,1 L15,0 Z — url(#rl-wing-t)
  Bottom wing: path M30,25 L23,25 L7,45 L15,46 Z — url(#rl-wing-b)
  Top engine: ellipse cx=13 cy=8 rx=7 ry=2.8 transform=rotate(-29,13,8) — url(#rl-eng)
  Bot engine: ellipse cx=13 cy=38 rx=7 ry=2.8 transform=rotate(29,13,38) — url(#rl-eng)
  Tail top: path M8,21 L2,14 L6,14 L12,21 Z — #c8c8c8
  Tail bot: path M8,25 L2,32 L6,32 L12,25 Z — #c8c8c8
  Fuselage: ellipse cx=34 cy=23 rx=29 ry=7 — url(#rl-body)
  Nose: path M61,19.5 C66,21.5 67.5,23 67,23 C67.5,23 66,24.5 61,26.5 L58,23 Z — #f4f4f4
  Cockpit: ellipse cx=57 cy=23 rx=4 ry=3 fill=#7ec8e8 opacity=0.9
  Cockpit glare: ellipse cx=56 cy=22 rx=1.8 ry=1.2 fill=rgba(255,255,255,0.55)
  Top highlight: ellipse cx=38 cy=20 rx=16 ry=2 fill=rgba(255,255,255,0.42)

── RunwayLoader component ───────────────────────────────────────────────────────
State: progress(0), phase('taxiing'|'takeoff'|'resetting'), cycle(0)
Refs: rafRef<number>, startRef<number>, aliveRef(true)

useEffect cleanup:
  aliveRef.current = true; return () => { aliveRef.current = false; cancelAnimationFrame(rafRef.current) }

RAF loop (TAXI_MS=5500):
  tick(ts): startRef ??= ts; p = min((ts-startRef)/TAXI_MS * 100, 100); setProgress(p)
  if p<100: requestAnimationFrame(tick)
  else: setPhase('takeoff') → setTimeout 1000ms → setPhase('resetting') → setTimeout 500ms → reset+setCycle(c+1)+restart

Derived values:
  shakeAmt = phase==='taxiing' ? (p>70 ? (p-70)/30*5 : p>25 ? 1.2 : 0.4) : 0
  noseUp = p>78 && phase!=='resetting' ? -((min(p,100)-78)/22)*18 : 0
  planePct = min(progress, 91)

Track styles (isDark toggle):
  trackBg: dark=#404040→#252525 gradient / light=#bab7b2→#a09d98
  trackShadow: dark=inset 0 4px 12px rgba(0,0,0,0.85)... / light=inset 0 3px 8px rgba(0,0,0,0.22)...

JSX structure:
  Root: div className="flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950"
  Inner: div w-full max-w-[440px] flex-col items-center gap-6 px-6

  Track div (h=56 rounded-full relative overflow-visible) style={trackBg + trackShadow}:
    Red fill div: absolute inset-y-0 left-0 rounded-full; width={progress}%; gradient #6b0000→#be1c1c→#e03030
    Dash div: absolute top-1/2 h-[2px]; left=calc({min(p,94)}%+14px) right=18; repeating-linear-gradient dashes
    Heat shimmer motion.div: shown when taxiing && p>30; right=calc({100-planePct}%+26px); animate opacity flicker
    AnimatePresence key={"plane-"+cycle} shown when phase!=='resetting':
      Outer div: absolute top-1/2 z-20; left={planePct}%; transform=translateX(-50%) translateY(-50%)
      motion.div: animate={{ rotate: noseUp }} transition duration=0.65s easeOut
        if taxiing: motion.div animate x/y shake array duration=0.13s repeat=Infinity
        if takeoff: motion.div initial={{x:0,y:0,opacity:1}} animate={{x:100,y:-120,opacity:0}} duration=0.95s

  Progress row: span {Math.round(progress)} + span "%" + span status label`,

  Cursor: `Add a RunwayLoader component to this codebase.

File: components-workspace/runway-loader/index.tsx
Export: named function RunwayLoader (also create prompts.ts)

Stack: React, TypeScript, Framer Motion (already installed), Tailwind CSS
External imports: useTheme from ../../app/components/ThemeProvider

─── Airplane SVG (top-down view, nose pointing right, 72×46 viewBox) ───────────

  <svg width="72" height="46" viewBox="0 0 72 46" fill="none" style={{ filter: dropShadow }}>
  Defs: 4 linearGradients — rl-body (vertical fff), rl-wing-t (diag), rl-wing-b (diag), rl-eng (vertical dark)

  Elements (back to front):
  1. Top wing:    path M30,21 L23,21 L7,1 L15,0 Z            fill url(#rl-wing-t)
  2. Bottom wing: path M30,25 L23,25 L7,45 L15,46 Z          fill url(#rl-wing-b)
  3. Top engine:  ellipse cx=13 cy=8 rx=7 ry=2.8             fill url(#rl-eng) transform rotate(-29,13,8)
  4. Bot engine:  ellipse cx=13 cy=38 rx=7 ry=2.8            fill url(#rl-eng) transform rotate(29,13,38)
  5. Tail fins:   two small triangular paths #c8c8c8
  6. Fuselage:    ellipse cx=34 cy=23 rx=29 ry=7             fill url(#rl-body)
  7. Nose:        curved path at x=61–67                      fill #f4f4f4
  8. Cockpit:     ellipse cx=57 cy=23 rx=4 ry=3              fill #7ec8e8 opacity=0.9
  9. Highlights:  body top-highlight ellipse + cockpit glare

─── State & animation ───────────────────────────────────────────────────────────

  type Phase = 'taxiing' | 'takeoff' | 'resetting'
  useState: progress(0), phase('taxiing'), cycle(0)
  useRef: rafRef<number>, startRef<number>, aliveRef(true)

  RAF loop inside useEffect (cleanup: aliveRef=false + cancelAnimationFrame):
    TAXI_MS = 5500
    tick(ts): p = min((ts - startRef) / TAXI_MS * 100, 100); setProgress(p)
    at p===100: setPhase('takeoff') → after 1000ms → setPhase('resetting') → after 500ms → reset + setCycle++

  Derived:
    shakeAmt: 0.4 (p<25) → 1.2 (p 25-70) → scales to 5 (p 70-100), zero during non-taxiing
    noseUp: 0 until p=78, then ramps to -18° at p=100, held during takeoff
    planePct = min(progress, 91)

─── JSX layout ──────────────────────────────────────────────────────────────────

  Root: flex h-full w-full items-center justify-center bg-sand-100 dark:bg-sand-950
  Container: w-full max-w-[440px] flex-col items-center gap-6 px-6

  Track (h=56 rounded-full overflow-visible):
    - isDark gradient #404040→#252525 | light #bab7b2→#a09d98 (via useTheme)
    - deep inset box-shadow
    - Red fill div: width={progress}%, gradient #6b0000→#be1c1c→#e03030, glow on takeoff
    - Dash div: repeating-linear-gradient dashes, left offset from plane position, right=18px
    - Heat shimmer: motion.div opacity flicker animate, orange radial gradient blur(8px)
    - AnimatePresence: mounts/unmounts on phase!=='resetting', key={plane-{cycle}}
        Positioning wrapper: absolute top-1/2, left={planePct}%, transform translateX(-50%) translateY(-50%)
        Tilt motion.div: animate={{ rotate: noseUp }}, transition duration 0.65s easeOut
          Taxiing motion.div: shake x/y arrays, duration 0.13s, repeat Infinity
          Takeoff motion.div: initial x:0 y:0 opacity:1 → animate x:100 y:-120 opacity:0, 0.95s easeOut

  Below track: Math.round(progress) + "%" + status label (text changes on takeoff)`,
}
