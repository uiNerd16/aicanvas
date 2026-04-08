import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create components-workspace/runway-loader/index.tsx — an airplane runway loading bar component.

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
}
