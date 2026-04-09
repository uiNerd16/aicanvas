import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named PillToggle — a classic iOS-style pill switch with a plain white circular thumb and a track that transitions from gray to green as the thumb slides. Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Constants: MAX_TRACK_W = 80, MIN_TRACK_W = 48.

State: isOn=false, animating=false, pageIsDark=true, trackW=80. Refs: containerRef, isOnRef=false. MotionValue thumbX = useMotionValue(offX).

Root: div ref=containerRef, className "flex h-full w-full items-center justify-center", style background '#110F0C' dark / '#EDEAE5' light.

Theme + resize (single useEffect): closest [data-card-theme] .dark else documentElement .dark. MutationObserver on both. ResizeObserver sets trackW = clamp(MIN, MAX, round(min(offsetW, offsetH)*0.18)). Separate useEffect on trackW: thumbX.set(isOnRef.current ? onX : offX).

Derived dimensions (computed each render): trackH = round(trackW*0.55); thumb = round(trackW*0.45); pad = max(3, round(trackW*0.05)); offX = pad; onX = trackW - thumb - pad.

Colors: offTrack '#3D3A3A' dark / '#D1D1D6' light. trackColor = useTransform(thumbX, [offX, onX], [offTrack, '#22c55e']). trackInset dark 'inset 0 1px 4px rgba(0,0,0,0.50)' light 'inset 0 1px 3px rgba(0,0,0,0.14)'. thumbShadow dark '0 3px 8px rgba(0,0,0,0.50), 0 1px 3px rgba(0,0,0,0.30)' light '0 3px 8px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.10)'.

handleToggle (useCallback, guards on animating): setAnimating(true); target = isOn ? offX : onX; isOnRef.current = !isOn; setIsOn(v=>!v); await animate(thumbX, target, {type:'spring', stiffness:500, damping:36}); setAnimating(false).

JSX: wrapper motion.div initial {opacity:0, scale:0.88} animate {opacity:1, scale:1} transition {duration:0.4, ease:[0.34, 1.56, 0.64, 1]} className "select-none". Inside motion.button onClick={handleToggle} style {width:trackW, height:trackH, borderRadius:trackH/2, backgroundColor:trackColor, boxShadow:trackInset, position:'relative', cursor:'pointer', border:'none', outline:'none', display:'block'} whileTap {scale:0.96} transition {type:'spring', stiffness:400, damping:28}. Inside the button: motion.div thumb style {position:'absolute', top:pad, x:thumbX, width:thumb, height:thumb, borderRadius:'50%', background:'white', boxShadow:thumbShadow}. No icons, no children inside the thumb — minimal and clean.`,

  GPT: `Build a React client component named PillToggle. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

iOS-style on/off switch: gray track + white thumb goes green when on. No icon, no label.

## Data/State
- MAX_TRACK_W = 80, MIN_TRACK_W = 48
- isOn=false, animating=false, pageIsDark=true, trackW=80
- refs: containerRef (HTMLDivElement), isOnRef=false
- thumbX = useMotionValue(offX)

## Derived (per render)
trackH = round(trackW*0.55) — 44 at 80
thumb  = round(trackW*0.45) — 36 at 80
pad    = max(3, round(trackW*0.05)) — 4 at 80
offX = pad
onX  = trackW - thumb - pad

## Colors
previewBg '#110F0C' / '#EDEAE5'. offTrack '#3D3A3A' / '#D1D1D6'. On color '#22c55e'. trackColor = useTransform(thumbX, [offX, onX], [offTrack, '#22c55e']). trackInset dark 'inset 0 1px 4px rgba(0,0,0,0.50)' light 'inset 0 1px 3px rgba(0,0,0,0.14)'. thumbShadow dark '0 3px 8px rgba(0,0,0,0.50), 0 1px 3px rgba(0,0,0,0.30)' light '0 3px 8px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.10)'.

## Theme + resize
closest [data-card-theme] .dark else documentElement .dark, MutationObserver on both. ResizeObserver on container updates trackW = max(MIN, min(MAX, round(min(offsetW, offsetH)*0.18))). Effect on trackW change: thumbX.set(isOnRef.current ? onX : offX).

## Animation
handleToggle (useCallback):
1. if animating return
2. setAnimating(true)
3. target = isOn ? offX : onX
4. isOnRef.current = !isOn
5. setIsOn(v => !v)
6. await animate(thumbX, target, { type: 'spring', stiffness: 500, damping: 36 })
7. setAnimating(false)

Wrapper motion.div initial {opacity:0, scale:0.88} animate {opacity:1, scale:1} transition {duration:0.4, ease:[0.34, 1.56, 0.64, 1]}. Button whileTap {scale:0.96} transition {type:'spring', stiffness:400, damping:28}.

## Interaction
Click anywhere on the pill to toggle. No drag. Ignore clicks while animating.

## JSX structure
- div containerRef flex h-full w-full items-center justify-center bg previewBg
  - motion.div (entrance)
    - motion.button style {width:trackW, height:trackH, borderRadius: trackH/2, backgroundColor: trackColor, boxShadow: trackInset, position:'relative', cursor:'pointer', border:'none', outline:'none', display:'block'}
      - motion.div style {position:'absolute', top:pad, x:thumbX, width:thumb, height:thumb, borderRadius:'50%', background:'white', boxShadow:thumbShadow}

Imports: useState, useCallback, useEffect, useRef; motion, useMotionValue, useTransform, animate from framer-motion.`,

  Gemini: `Implement a React client component named PillToggle as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

USE these hooks and no others. DO NOT invent hooks not shown above. Do NOT call useMotionValue() or useTransform() inline inside JSX — declare them in the component body before return.

## Concept
A classic iOS on/off pill switch. Gray → green track color and a clean white circular thumb that slides from left to right with a crisp spring. No icons, no labels.

## Constants
MAX_TRACK_W = 80. MIN_TRACK_W = 48.

## State
isOn=false, animating=false, pageIsDark=true, trackW=MAX_TRACK_W. Refs: containerRef (HTMLDivElement), isOnRef = useRef(false).

## Motion values
thumbX = useMotionValue(offX). trackColor = useTransform(thumbX, [offX, onX], [offTrack, '#22c55e']).

## Derived (compute each render)
trackH = Math.round(trackW*0.55); thumb = Math.round(trackW*0.45); pad = Math.max(3, Math.round(trackW*0.05)); offX = pad; onX = trackW - thumb - pad.

## Effects
1) Theme + resize in one useEffect on mount:
- el = containerRef.current; if (!el) return
- check() reads closest('[data-card-theme]') .dark class with documentElement fallback
- mo = new MutationObserver(check); mo.observe(documentElement, {attributes:true, attributeFilter:['class']}); cardWrapper = el.closest('[data-card-theme]'); if (cardWrapper) mo.observe(cardWrapper, same)
- update() = s = Math.max(MIN_TRACK_W, Math.min(MAX_TRACK_W, Math.round(Math.min(el.offsetWidth, el.offsetHeight) * 0.18))); setTrackW(s)
- ro = new ResizeObserver(update); ro.observe(el)
- cleanup: mo.disconnect(); ro.disconnect()
2) useEffect([trackW]): thumbX.set(isOnRef.current ? onX : offX)

## Colors
previewBg '#110F0C' / '#EDEAE5'. offTrack '#3D3A3A' / '#D1D1D6'. On color '#22c55e'. trackInset dark 'inset 0 1px 4px rgba(0,0,0,0.50)' light 'inset 0 1px 3px rgba(0,0,0,0.14)'. thumbShadow dark '0 3px 8px rgba(0,0,0,0.50), 0 1px 3px rgba(0,0,0,0.30)' light '0 3px 8px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.10)'.

## handleToggle
const handleToggle = useCallback(async () => { if (animating) return; setAnimating(true); const target = isOn ? offX : onX; isOnRef.current = !isOn; setIsOn(v => !v); await animate(thumbX, target, { type: 'spring', stiffness: 500, damping: 36 }); setAnimating(false) }, [isOn, animating, thumbX, offX, onX]).

## JSX
- div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{ background: previewBg }}
- motion.div initial={{opacity:0, scale:0.88}} animate={{opacity:1, scale:1}} transition={{duration:0.4, ease:[0.34, 1.56, 0.64, 1]}} className="select-none"
- motion.button onClick={handleToggle} style={{width:trackW, height:trackH, borderRadius:trackH/2, backgroundColor:trackColor, boxShadow:trackInset, position:'relative', cursor:'pointer', border:'none', outline:'none', display:'block'}} whileTap={{scale:0.96}} transition={{type:'spring', stiffness:400, damping:28}}
- motion.div style={{position:'absolute', top:pad, x:thumbX, width:thumb, height:thumb, borderRadius:'50%', background:'white', boxShadow:thumbShadow}} (no children)

No Phosphor icons are used in this component.`,

  V0: `Create a PillToggle component — a clean iOS-style on/off switch. A horizontal pill-shaped track with a plain white circular thumb that slides from left to right when clicked. When off, the track is a muted gray; when on, it turns iOS-green (#22c55e). No icon, no label — just the pill and the thumb.

Use Tailwind CSS and Framer Motion. The track scales responsively with its container: track width = clamp(48, min(container w, h) * 0.18, 80), height = 55% of width, thumb = 45%, padding = max(3, 5% of width). Dark: off-track #3D3A3A. Light: off-track #D1D1D6. Preview background #110F0C dark / #EDEAE5 light, theme detected from the closest [data-card-theme] ancestor with documentElement fallback. Drive both the thumb x and the track backgroundColor off a single useMotionValue via useTransform. Spring on toggle: stiffness 500, damping 36. Button whileTap scale 0.96. Entrance animation: fade + scale 0.88→1, 400ms with ease [0.34, 1.56, 0.64, 1]. Guard against double-clicks while animating. The thumb has a soft drop shadow but no icon inside.`,
}
