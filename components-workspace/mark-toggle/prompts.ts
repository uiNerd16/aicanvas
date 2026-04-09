import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named MarkToggle — an iOS-style pill toggle in earth/sand tones whose white thumb carries a small icon that morphs from X (off) to Check (on) as it slides across. Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Constants: MAX_TRACK_W = 80, MIN_TRACK_W = 48. State: isOn=false, animating=false, pageIsDark=true, trackW=80. Refs: containerRef, isOnRef=false. MotionValue thumbX = useMotionValue(offX).

Layout: root div ref=containerRef, className "flex h-full w-full items-center justify-center", background #110F0C dark / #EDEAE5 light.

Theme detection: closest [data-card-theme] .dark else documentElement .dark, MutationObserver on both. ResizeObserver on root: trackW = clamp(MIN, MAX, round(min(offsetW, offsetH)*0.18)). On trackW change: thumbX.set(isOnRef.current ? onX : offX).

Derived dimensions: trackH = round(trackW*0.55); thumb = round(trackW*0.45); pad = max(3, round(trackW*0.05)); offX = pad; onX = trackW - thumb - pad; iconSize = round(thumb*0.50).

Colors: offTrack '#8C7B6B' dark / '#B09478' light. onTrack '#4A5935' / '#6B8040'. trackColor = useTransform(thumbX, [offX, onX], [offTrack, onTrack]). iconColor matches the track the thumb is currently over (isOn ? onTrack : offTrack). trackInset dark 'inset 0 1px 4px rgba(0,0,0,0.50)' light 'inset 0 1px 3px rgba(0,0,0,0.14)'. thumbShadow dark '0 3px 8px rgba(0,0,0,0.50), 0 1px 3px rgba(0,0,0,0.30)' light '0 3px 8px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.10)'.

handleToggle (useCallback, skip if animating): setAnimating(true); target = isOn ? offX : onX; isOnRef.current = !isOn; setIsOn(v=>!v); await animate(thumbX, target, {type:'spring', stiffness:500, damping:36}); setAnimating(false).

JSX: wrapper motion.div initial {opacity:0, scale:0.88} animate {opacity:1, scale:1} transition {duration:0.4, ease:[0.34,1.56,0.64,1]} className "select-none". Inside motion.button onClick={handleToggle} style {width:trackW, height:trackH, borderRadius:trackH/2, backgroundColor:trackColor, boxShadow:trackInset, position:'relative', cursor:'pointer', border:'none', outline:'none', display:'block'} whileTap {scale:0.96} transition {type:'spring', stiffness:400, damping:28}. Inside the button a motion.div thumb style {position:'absolute', top:pad, x:thumbX, width:thumb, height:thumb, borderRadius:'50%', background:'white', boxShadow:thumbShadow, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}.

Inside the thumb AnimatePresence mode="wait" initial={false}: when isOn render motion.span key="check" initial {scale:0, rotate:-45, opacity:0} animate {1,0,1} exit {scale:0, rotate:45, opacity:0} transition {duration:0.18, ease:[0.34,1.56,0.64,1]} containing <Check size={iconSize} weight="bold" color={iconColor}/>. Else motion.span key="x-icon" same animation but initial rotate 45 and exit rotate -45 containing <X size={iconSize} weight="bold" color={iconColor}/>. Icons from @phosphor-icons/react.`,

  GPT: `Build a React client component named MarkToggle. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

iOS-style pill toggle in earth/sand colors. Thumb carries an icon that morphs between X (off) and Check (on), sliding across the track.

## Data/State
- MAX_TRACK_W=80, MIN_TRACK_W=48
- isOn=false, animating=false, pageIsDark=true, trackW=80
- refs: containerRef, isOnRef=false
- thumbX = useMotionValue(offX)

## Derived
trackH = round(trackW*0.55); thumb = round(trackW*0.45); pad = max(3, round(trackW*0.05)); offX = pad; onX = trackW - thumb - pad; iconSize = round(thumb*0.50).

## Colors
previewBg '#110F0C' / '#EDEAE5'. offTrack '#8C7B6B' / '#B09478'. onTrack '#4A5935' / '#6B8040'. trackColor = useTransform(thumbX, [offX, onX], [offTrack, onTrack]). iconColor = isOn ? onTrack : offTrack. trackInset dark 'inset 0 1px 4px rgba(0,0,0,0.50)' light 'inset 0 1px 3px rgba(0,0,0,0.14)'. thumbShadow dark '0 3px 8px rgba(0,0,0,0.50), 0 1px 3px rgba(0,0,0,0.30)' light '0 3px 8px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.10)'.

## Theme + resize
closest [data-card-theme] .dark else documentElement .dark, MutationObserver on both. ResizeObserver on container updates trackW = clamp(MIN, MAX, round(min(offsetW, offsetH)*0.18)). Extra effect: on trackW change, thumbX.set(isOnRef.current ? onX : offX).

## Animation
handleToggle (useCallback):
1. if animating return
2. setAnimating(true)
3. target = isOn ? offX : onX
4. isOnRef.current = !isOn
5. setIsOn(v => !v)
6. await animate(thumbX, target, { type: 'spring', stiffness: 500, damping: 36 })
7. setAnimating(false)

Wrapper motion.div initial {opacity:0, scale:0.88} animate {opacity:1, scale:1} transition {duration:0.4, ease:[0.34, 1.56, 0.64, 1]}. Button whileTap {scale:0.96} transition {type:'spring', stiffness:400, damping:28}. Icon enter/exit {duration:0.18, ease:[0.34, 1.56, 0.64, 1]}: check keys initial {scale:0, rotate:-45, opacity:0} exit {scale:0, rotate:45, opacity:0}; x-icon initial {scale:0, rotate:45, opacity:0} exit {scale:0, rotate:-45, opacity:0}.

## Interaction
Single click on the track toggles state; ignore clicks while animating.

## JSX structure
- div containerRef flex h-full w-full items-center justify-center bg previewBg
  - motion.div (entrance)
    - motion.button style {width:trackW, height:trackH, borderRadius: trackH/2, backgroundColor:trackColor, boxShadow:trackInset, position:'relative', cursor:'pointer', border:'none', outline:'none', display:'block'} onClick={handleToggle} whileTap={{scale:0.96}} transition={{type:'spring', stiffness:400, damping:28}}
      - motion.div thumb style {position:'absolute', top:pad, x:thumbX, width:thumb, height:thumb, borderRadius:'50%', background:'white', boxShadow:thumbShadow, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}
        - <AnimatePresence mode="wait" initial={false}> isOn ? motion.span key="check" with Check size={iconSize} weight="bold" color={iconColor} : motion.span key="x-icon" with X size={iconSize} weight="bold" color={iconColor}. Inner style display:flex items-center justify-center.

Imports: useState, useCallback, useEffect, useRef; motion, AnimatePresence, useMotionValue, useTransform, animate; X, Check from @phosphor-icons/react.`,

  Gemini: `Implement a React client component named MarkToggle as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { X, Check } from '@phosphor-icons/react'

USE these hooks and no others. DO NOT invent hooks not shown above. Do NOT call useMotionValue() or useTransform() inline inside JSX — declare them in the component body before return.

## Concept
An iOS-style pill toggle sized responsively to its container. A white circular thumb holds a Phosphor icon that crossfades/rotates: X when off, Check when on. The track color animates between warm brown (off) and olive green (on) as the thumb slides.

## Constants
MAX_TRACK_W = 80, MIN_TRACK_W = 48.

## State
isOn=false, animating=false, pageIsDark=true, trackW=MAX_TRACK_W. Refs: containerRef (HTMLDivElement), isOnRef = useRef(false).

## Motion values
thumbX = useMotionValue(offX). trackColor = useTransform(thumbX, [offX, onX], [offTrack, onTrack]).

## Derived (compute each render from trackW)
trackH = Math.round(trackW*0.55); thumb = Math.round(trackW*0.45); pad = Math.max(3, Math.round(trackW*0.05)); offX = pad; onX = trackW - thumb - pad; iconSize = Math.round(thumb*0.50).

## Effects
1) Theme + resize in a single useEffect on mount:
- const el = containerRef.current; if (!el) return
- check = () => { card = el.closest('[data-card-theme]'); setPageIsDark(card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark')) }; check()
- const mo = new MutationObserver(check); mo.observe(documentElement, {attributes:true, attributeFilter:['class']}); if (cardWrapper = el.closest('[data-card-theme]')) mo.observe(cardWrapper, same)
- update = () => { s = Math.max(MIN_TRACK_W, Math.min(MAX_TRACK_W, Math.round(Math.min(el.offsetWidth, el.offsetHeight) * 0.18))); setTrackW(s) }; update()
- const ro = new ResizeObserver(update); ro.observe(el)
- return () => { mo.disconnect(); ro.disconnect() }
2) useEffect([trackW]): thumbX.set(isOnRef.current ? onX : offX)

## Colors
previewBg '#110F0C' / '#EDEAE5'. offTrack '#8C7B6B' / '#B09478'. onTrack '#4A5935' / '#6B8040'. iconColor = isOn ? onTrack : offTrack. trackInset dark 'inset 0 1px 4px rgba(0,0,0,0.50)' light 'inset 0 1px 3px rgba(0,0,0,0.14)'. thumbShadow dark '0 3px 8px rgba(0,0,0,0.50), 0 1px 3px rgba(0,0,0,0.30)' light '0 3px 8px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.10)'.

## handleToggle
const handleToggle = useCallback(async () => { if (animating) return; setAnimating(true); const target = isOn ? offX : onX; isOnRef.current = !isOn; setIsOn(v => !v); await animate(thumbX, target, { type: 'spring', stiffness: 500, damping: 36 }); setAnimating(false) }, [isOn, animating, thumbX, offX, onX]).

## JSX
Root: div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{ background: previewBg }}.
motion.div initial={{opacity:0, scale:0.88}} animate={{opacity:1, scale:1}} transition={{duration:0.4, ease:[0.34, 1.56, 0.64, 1]}} className="select-none".
motion.button onClick={handleToggle} style={{width:trackW, height:trackH, borderRadius:trackH/2, backgroundColor:trackColor, boxShadow:trackInset, position:'relative', cursor:'pointer', border:'none', outline:'none', display:'block'}} whileTap={{scale:0.96}} transition={{type:'spring', stiffness:400, damping:28}}.
Inside: motion.div style={{position:'absolute', top:pad, x:thumbX, width:thumb, height:thumb, borderRadius:'50%', background:'white', boxShadow:thumbShadow, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}.
Inside thumb: <AnimatePresence mode="wait" initial={false}>. If isOn: motion.span key="check" initial={{scale:0, rotate:-45, opacity:0}} animate={{scale:1, rotate:0, opacity:1}} exit={{scale:0, rotate:45, opacity:0}} transition={{duration:0.18, ease:[0.34, 1.56, 0.64, 1]}} style={{display:'flex', alignItems:'center', justifyContent:'center'}}><Check size={iconSize} weight="bold" color={iconColor}/></motion.span>. Else motion.span key="x-icon" initial={{scale:0, rotate:45, opacity:0}} animate={{scale:1, rotate:0, opacity:1}} exit={{scale:0, rotate:-45, opacity:0}} same transition/style containing <X size={iconSize} weight="bold" color={iconColor}/>.

Note: Check and X use weight="bold" (not "regular") — matches the stronger strokes expected at small sizes.`,

  V0: `Create a MarkToggle component — an iOS-style pill toggle in warm earth tones with a small icon inside the white circular thumb. When off, the thumb sits on the left over a warm brown track and carries an X mark. When on, the thumb slides to the right with a soft spring, the track color shifts to a mossy olive green, and the X morphs into a Check mark with a pop-and-rotate transition.

Use Tailwind CSS, Framer Motion, and Phosphor Icons (X and Check, weight='bold'). The track sizes responsively to the container (clamp 48–80px wide, height 55% of width, thumb 45%, padding 5% min 3), with every dimension recomputed on resize. Dark colors: track off #8C7B6B, on #4A5935. Light: off #B09478, on #6B8040. Preview background #110F0C dark / #EDEAE5 light, theme detected from the closest [data-card-theme] ancestor. Use useMotionValue + useTransform to drive both the thumb x and the track backgroundColor off a single value. Toggle animation: spring stiffness 500 damping 36. Button whileTap scale 0.96. Icon swap: AnimatePresence mode wait, 180ms ease [0.34, 1.56, 0.64, 1], X rotates out one way, Check rotates in the other.`,
}
