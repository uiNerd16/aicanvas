import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named FlipCalendar — a draggable flip-clock-style day calendar in rich blue gradients with parallax mouse tilt, a glowing scan line during flips, and a small hint "↑ swipe ↓" below it. Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files (you may keep one small inline Half sub-component in the same file). 'use client' at the top. No 'any' types.

Constants: FLIP_MS = 220. fmt(n) returns String(n).padStart(2,'0').

State/refs: topDisplay=1, bottomDisplay=1, flapContent=1, flapVisible=false, flapping=false. currentRef=1, rootRef, isDark=true. MotionValues: rotateX=0, scanY=18, scanYPct=useTransform(scanY, v=>v+'%'). tiltX=0, tiltY=0. aliveRef=true, timeouts array.

Layout root: div ref=rootRef, flex h-full w-full flex-col items-center justify-center gap-6, background '#110F0C' dark / '#F5F1EA' light.

Theme detection via closest [data-card-theme] .dark else documentElement .dark, MutationObserver on both.

Parallax wrapper: div style perspective '900px', onMouseMove + onMouseLeave. motion.div initial {opacity:0, y:32, scale:0.9} animate {1,0,1} transition {duration:0.65, ease:[0.22,1,0.36,1]}. drag='y' dragConstraints top:0 bottom:0 dragElastic:0.08 onDragEnd → if |offset.y|<40 and |velocity.y|<300 return; else flip(offset.y>0||velocity.y>300 ? 'next' : 'prev'). style width 'min(260px, 56vw)' aspectRatio '1 / 1' rotate '3deg' rotateX={tiltX} rotateY={tiltY}, className relative cursor-grab active:cursor-grabbing select-none.

Mouse parallax: getBoundingClientRect, cx=(clientX-left)/width-0.5, cy=(clientY-top)/height-0.5. animate(tiltX, cy*-11, {duration:0.12, ease:'linear'}); animate(tiltY, cx*11, ...). On leave spring both to 0 with {stiffness:160, damping:18}.

Page stack: three dummy sheets behind the card using [13,8,4].map((y,i)) → absolute inset-0 background '#2E2A24' dark / '#C8C2B8' light, transform translateY(y px), opacity 0.28 + i*0.2, zIndex 0, borderRadius 18, boxShadow '0 '+(y*2)+'px '+(y*4)+'px rgba(0,0,0,0.35)'.

Main card: absolute inset-0 overflow-hidden zIndex 1 borderRadius 18 boxShadow cardShadow. cardShadow dark '0 40px 100px rgba(20,55,155,0.65), 0 12px 32px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)' light '0 40px 100px rgba(40,100,220,0.32), 0 12px 32px rgba(0,0,0,0.16), 0 0 0 1px rgba(255,255,255,0.9)'.

Gradients:
topGrad dark 'linear-gradient(155deg, #3572cc 0%, #2d62bc 55%, #2455a0 100%)' light '#4e9aec / #3d88da / #3078c8'.
flapGrad dark '#2d64bc / #2556ac / #1e4894' light '#4290de / #3480cc / #2870bc'.
bottomGrad dark '#4a8edc / #5a9eec / #68aef4' light '#5aaaee / #6abaf8 / #76c4fc'.
headerGrad dark 'linear-gradient(180deg, #2a2724 0%, #1e1c19 100%)' light '#d8d4ce / #c6c2bc'.
ringGrad dark 'radial-gradient(circle at 35% 30%, #f4f0ea 0%, #c0bcb6 45%, #888480 100%)' light '#ffffff / #dedad4 / #aeaaa4'.
seam 'rgba(0,0,0,0.42)' / 'rgba(0,0,0,0.22)'. numShadow dark '0 4px 24px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)' light '0 4px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.22)'.

Layers inside card:
- Header: absolute inset-x-0 top-0 flex items-end justify-center gap-8, height 18%, background headerGrad, zIndex 12, borderRadius '18px 18px 0 0', borderLeft+borderRight '1.5px solid rgba(0,0,0,0.14)', paddingBottom 7. Two 15×15 circles with background ringGrad and boxShadow '0 2px 6px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.6)'.
- Bottom half: absolute inset-x-0 bottom-0, top '59%', background bottomGrad, overflow hidden; <Half n={bottomDisplay} half='bottom' numShadow=..../>
- Top half: absolute inset-x-0, top '18%' bottom '41%', background topGrad, borderRadius '12px 12px 0 0'; <Half n={topDisplay} half='top' .../>
- Flap (if flapVisible): absolute inset-x-0 top 18% height 41% zIndex 8. motion.div absolute inset-0 overflow hidden background flapGrad rotateX={rotateX} perspective:140 transformOrigin 'center bottom' willChange 'transform' borderRadius '12px 12px 0 0' boxShadow 'inset 0 0 0 1px rgba(255,255,255,0.2)'. Inside <Half n={flapContent} half='top' .../>. Below the flap a 3px crease div bottom 0, background 'rgba(255,255,255,0.25)', zIndex 9, boxShadow '0 0 8px rgba(255,255,255,0.18)'.
- Scan line (if flapVisible): motion.div absolute inset-x-0 top={scanYPct} height 2 borderRadius 9999 background '#ffffff' opacity 0.3 zIndex 20 pointer-events-none.
- Center seam: absolute inset-x-0 top 'calc(59% - 3px)' height 6 background seam zIndex 10.
- Header/body divider: top 'calc(18% - 1px)' height 1 background 'rgba(0,0,0,0.22)' zIndex 11.
- Surface light: top '18%' height '30%' background 'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, transparent 100%)' borderRadius '12px 12px 0 0' zIndex 6.

Half(n, half, numShadow): absolute inset-x-0 flex items-center justify-center, height 200%, top:0 if top else bottom:0. Inside span font-sans font-bold select-none tabular-nums fontSize 'clamp(3.8rem, 13vw, 6.5rem)' color '#ffffff' lineHeight 1 letterSpacing '-0.03em' textShadow numShadow → fmt(n).

Flip logic: flip(dir) computes target (wrap 1..31). runFlip(target, durationMs, dir, onDone): prev=currentRef.current, currentRef=target, setFlapContent(prev), setFlapVisible(true). If dir==='next' scanY.set(18) then animate(scanY, 104, {duration:(durationMs*2)/1000, ease:'linear'}); else 104→18. rotateX.set(0), animate(rotateX, -90, {duration: durationMs/1000, ease:'easeIn'}). sched (setTimeout, cleared in aliveRef cleanup) at durationMs: setTopDisplay(target); setBottomDisplay(target); setFlapContent(target); rotateX.set(90); animate(rotateX, 0, {duration: durationMs/1000, ease:'easeOut'}). sched at durationMs*2+20: setFlapVisible(false); onDone?.().

Hint: motion.p initial {opacity:0} animate {opacity:1} transition {delay:1.1, duration:0.8} className 'font-mono text-xs tracking-widest' color '#3a3530' dark / '#C8C2B8' light → '↑ swipe ↓'.`,

  GPT: `Build a React client component named FlipCalendar. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

A single draggable flip-clock calendar page in blue gradients. Click/drag flips to next/prev day. Mouse parallax, glowing scan line during flip.

## Data/State
- const FLIP_MS = 220; fmt(n) = String(n).padStart(2,'0')
- state: topDisplay=1, bottomDisplay=1, flapContent=1, flapVisible=false, flapping=false, isDark=true
- refs: currentRef=1, rootRef, aliveRef=true, timeouts=[]
- motion values: rotateX=0; scanY=18; scanYPct = useTransform(scanY, v => \`\${v}%\`); tiltX=0; tiltY=0

## Theme
closest [data-card-theme] .dark else documentElement .dark, MutationObserver on both.

## Animation (flip)
flip(dir): if flapping return; cur = currentRef.current; target = dir==='next' ? (cur===31?1:cur+1) : (cur===1?31:cur-1); setFlapping(true); runFlip(target, FLIP_MS, dir, () => setFlapping(false)).

runFlip(target, durationMs, dir, onDone):
- prev = currentRef.current; currentRef.current = target; setFlapContent(prev); setFlapVisible(true)
- if dir==='next': scanY.set(18); animate(scanY, 104, {duration:(durationMs*2)/1000, ease:'linear'}); else scanY.set(104); animate(scanY, 18, ...)
- rotateX.set(0); animate(rotateX, -90, {duration: durationMs/1000, ease:'easeIn'})
- sched at durationMs: setTopDisplay(target); setBottomDisplay(target); setFlapContent(target); rotateX.set(90); animate(rotateX, 0, {duration: durationMs/1000, ease:'easeOut'})
- sched at durationMs*2+20: setFlapVisible(false); onDone?.()

sched(fn, ms): id = setTimeout(() => { if (aliveRef.current) fn() }, ms); timeouts.current.push(id). Cleanup: aliveRef=false; clear all timeouts.

onDragEnd(_, info): if |info.offset.y|<40 && |info.velocity.y|<300 return; flip(info.offset.y>0||info.velocity.y>300 ? 'next' : 'prev').

Mouse parallax onMouseMove: cx=(clientX-left)/w-0.5, cy=(clientY-top)/h-0.5; animate(tiltX, cy*-11, {duration:0.12, ease:'linear'}); animate(tiltY, cx*11, same). onMouseLeave: spring both to 0 {stiffness:160, damping:18}.

## Colors
previewBg '#110F0C' / '#F5F1EA'.
topGrad dark 'linear-gradient(155deg, #3572cc 0%, #2d62bc 55%, #2455a0 100%)' light '(155deg, #4e9aec 0%, #3d88da 55%, #3078c8 100%)'.
flapGrad dark '(155deg, #2d64bc 0%, #2556ac 55%, #1e4894 100%)' light '(155deg, #4290de 0%, #3480cc 55%, #2870bc 100%)'.
bottomGrad dark '(155deg, #4a8edc 0%, #5a9eec 55%, #68aef4 100%)' light '(155deg, #5aaaee 0%, #6abaf8 55%, #76c4fc 100%)'.
headerGrad dark 'linear-gradient(180deg, #2a2724 0%, #1e1c19 100%)' light '(180deg, #d8d4ce 0%, #c6c2bc 100%)'.
ringGrad dark 'radial-gradient(circle at 35% 30%, #f4f0ea 0%, #c0bcb6 45%, #888480 100%)' light '(#ffffff / #dedad4 / #aeaaa4)'.
cardShadow dark '0 40px 100px rgba(20,55,155,0.65), 0 12px 32px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)' light '0 40px 100px rgba(40,100,220,0.32), 0 12px 32px rgba(0,0,0,0.16), 0 0 0 1px rgba(255,255,255,0.9)'.
seam 'rgba(0,0,0,0.42)' / 'rgba(0,0,0,0.22)'.
numShadow dark '0 4px 24px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)' light '0 4px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.22)'.

## JSX structure
- div ref=rootRef, flex h-full w-full flex-col items-center justify-center gap-6, bg previewBg
  - div style {perspective:'900px'}, onMouseMove, onMouseLeave
    - motion.div initial {opacity:0, y:32, scale:0.9} animate {opacity:1, y:0, scale:1} transition {duration:0.65, ease:[0.22,1,0.36,1]} drag='y' dragConstraints {top:0, bottom:0} dragElastic=0.08 onDragEnd className "relative cursor-grab active:cursor-grabbing select-none" style {width:'min(260px, 56vw)', aspectRatio:'1 / 1', rotate:'3deg', rotateX:tiltX, rotateY:tiltY}
      - 3 page shadows from [13,8,4].map((y,i)) absolute inset-0 style {background: isDark?'#2E2A24':'#C8C2B8', transform:\`translateY(\${y}px)\`, opacity: 0.28+i*0.2, zIndex:0, borderRadius:18, boxShadow:\`0 \${y*2}px \${y*4}px rgba(0,0,0,0.35)\`}
      - div absolute inset-0 overflow-hidden style {zIndex:1, boxShadow:cardShadow, borderRadius:18}
        - Header strip (inset-x-0 top-0 flex items-end justify-center gap-8) style {height:'18%', background:headerGrad, zIndex:12, borderRadius:'18px 18px 0 0', borderLeft:'1.5px solid rgba(0,0,0,0.14)', borderRight:'1.5px solid rgba(0,0,0,0.14)', paddingBottom:7}. Two rings (w/h 15, borderRadius 50%, background ringGrad, boxShadow '0 2px 6px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.6)').
        - Bottom half (inset-x-0 bottom-0 overflow-hidden) style {top:'59%', background:bottomGrad} → <Half n={bottomDisplay} half="bottom" numShadow={numShadow}/>
        - Top half (inset-x-0 overflow-hidden) style {top:'18%', bottom:'41%', background:topGrad, borderRadius:'12px 12px 0 0'} → <Half n={topDisplay} half="top" numShadow={numShadow}/>
        - Flap (flapVisible only) absolute inset-x-0 style {top:'18%', height:'41%', zIndex:8} containing motion.div absolute inset-0 overflow-hidden style {background:flapGrad, rotateX, perspective:140, transformOrigin:'center bottom', willChange:'transform', borderRadius:'12px 12px 0 0', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.2)'} with <Half n={flapContent} half="top" numShadow={numShadow}/>. Plus crease div absolute inset-x-0 bottom-0 style {height:3, background:'rgba(255,255,255,0.25)', zIndex:9, boxShadow:'0 0 8px rgba(255,255,255,0.18)'}.
        - Scan line (flapVisible only) motion.div absolute inset-x-0 style {top:scanYPct, height:2, borderRadius:'9999px', background:'#ffffff', opacity:0.3, zIndex:20}
        - Center seam absolute inset-x-0 style {top:'calc(59% - 3px)', height:6, background:seam, zIndex:10}
        - Header divider absolute inset-x-0 style {top:'calc(18% - 1px)', height:1, background:'rgba(0,0,0,0.22)', zIndex:11}
        - Surface light absolute inset-x-0 style {top:'18%', height:'30%', background:'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, transparent 100%)', borderRadius:'12px 12px 0 0', zIndex:6}
  - motion.p hint initial {opacity:0} animate {opacity:1} transition {delay:1.1, duration:0.8} className "font-mono text-xs tracking-widest" style {color: isDark?'#3a3530':'#C8C2B8'} → '↑ swipe ↓'

## Half component (inline)
function Half({n, half, numShadow}): absolute inset-x-0 flex items-center justify-center, style {height:'200%', top: half==='top'?0:undefined, bottom: half==='bottom'?0:undefined}. Inside span font-sans font-bold select-none tabular-nums style {fontSize:'clamp(3.8rem, 13vw, 6.5rem)', color:'#ffffff', lineHeight:1, letterSpacing:'-0.03em', textShadow:numShadow} rendering fmt(n).

Imports: useState, useRef, useEffect; motion, useMotionValue, useTransform, animate from framer-motion; type PanInfo.`,

  Gemini: `Implement a React client component named FlipCalendar as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import type { PanInfo } from 'framer-motion'

USE these hooks and no others. DO NOT invent hooks not shown above. Do NOT call useMotionValue() or useTransform() inline inside JSX — declare all motion values at the top of the component.

## Concept
A flip-clock-style day calendar (1..31, wrapping) as a square card with blue gradients. Click or drag vertically to flip to next/prev. On every flip a horizontal scan line sweeps across, a top flap rotates over the bottom half, and numbers update at the seam. Mouse move inside the card area applies a subtle 3D tilt.

## Constants
const FLIP_MS = 220. Helper fmt(n) = String(n).padStart(2,'0').

## State
topDisplay=1, bottomDisplay=1, flapContent=1, flapVisible=false, flapping=false, isDark=true.

## Refs
currentRef = useRef(1). rootRef: HTMLDivElement. aliveRef=true. timeouts: ReturnType<typeof setTimeout>[].

## Motion values
rotateX = useMotionValue(0). scanY = useMotionValue(18). scanYPct = useTransform(scanY, v => \`\${v}%\`). tiltX = useMotionValue(0). tiltY = useMotionValue(0).

## Effects
1) Cleanup: useEffect(() => { aliveRef.current = true; return () => { aliveRef.current = false; timeouts.current.forEach(clearTimeout) } }, []).
2) Theme detection on rootRef — closest('[data-card-theme]') .dark else documentElement .dark; MutationObserver on both {attributes:true, attributeFilter:['class']}; disconnect on cleanup.

## sched helper
function sched(fn, ms): const id = setTimeout(() => { if (aliveRef.current) fn() }, ms); timeouts.current.push(id).

## Flip core
runFlip(target:number, durationMs:number, dir:'next'|'prev', onDone?):
- prev = currentRef.current; currentRef.current = target; setFlapContent(prev); setFlapVisible(true)
- if dir==='next': scanY.set(18); animate(scanY, 104, { duration: (durationMs*2)/1000, ease: 'linear' }); else scanY.set(104); animate(scanY, 18, { duration: (durationMs*2)/1000, ease: 'linear' })
- rotateX.set(0); animate(rotateX, -90, { duration: durationMs/1000, ease: 'easeIn' })
- sched at durationMs: setTopDisplay(target); setBottomDisplay(target); setFlapContent(target); rotateX.set(90); animate(rotateX, 0, { duration: durationMs/1000, ease: 'easeOut' })
- sched at durationMs*2 + 20: setFlapVisible(false); onDone?.()

flip(dir:'next'|'prev'): if (flapping) return; cur = currentRef.current; target = dir==='next' ? (cur===31 ? 1 : cur+1) : (cur===1 ? 31 : cur-1); setFlapping(true); runFlip(target, FLIP_MS, dir, () => setFlapping(false)).

onDragEnd(_e, info: PanInfo): if Math.abs(info.offset.y) < 40 && Math.abs(info.velocity.y) < 300 return; flip(info.offset.y > 0 || info.velocity.y > 300 ? 'next' : 'prev').

handleMouseMove(e): if flapping return; r = e.currentTarget.getBoundingClientRect(); cx=(e.clientX-r.left)/r.width - 0.5; cy=(e.clientY-r.top)/r.height - 0.5; animate(tiltX, cy*-11, {duration:0.12, ease:'linear'}); animate(tiltY, cx*11, {duration:0.12, ease:'linear'}).
handleMouseLeave(): animate(tiltX, 0, {type:'spring', stiffness:160, damping:18}); same for tiltY.

## Colors
previewBg '#110F0C' / '#F5F1EA'.
topGrad dark 'linear-gradient(155deg, #3572cc 0%, #2d62bc 55%, #2455a0 100%)' / light '(155deg, #4e9aec 0%, #3d88da 55%, #3078c8 100%)'.
flapGrad dark '(155deg, #2d64bc 0%, #2556ac 55%, #1e4894 100%)' / light '(155deg, #4290de 0%, #3480cc 55%, #2870bc 100%)'.
bottomGrad dark '(155deg, #4a8edc 0%, #5a9eec 55%, #68aef4 100%)' / light '(155deg, #5aaaee 0%, #6abaf8 55%, #76c4fc 100%)'.
headerGrad dark 'linear-gradient(180deg, #2a2724 0%, #1e1c19 100%)' / light '(180deg, #d8d4ce 0%, #c6c2bc 100%)'.
ringGrad dark 'radial-gradient(circle at 35% 30%, #f4f0ea 0%, #c0bcb6 45%, #888480 100%)' / light '(circle at 35% 30%, #ffffff 0%, #dedad4 45%, #aeaaa4 100%)'.
cardShadow dark '0 40px 100px rgba(20,55,155,0.65), 0 12px 32px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)' / light '0 40px 100px rgba(40,100,220,0.32), 0 12px 32px rgba(0,0,0,0.16), 0 0 0 1px rgba(255,255,255,0.9)'.
seam 'rgba(0,0,0,0.42)' / 'rgba(0,0,0,0.22)'.
numShadow dark '0 4px 24px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)' / light '0 4px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.22)'.

## JSX
Root: div ref={rootRef} className="flex h-full w-full flex-col items-center justify-center gap-6" style={{background: isDark ? '#110F0C' : '#F5F1EA'}}.
Inner: div style={{perspective:'900px'}} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}.
motion.div initial={{opacity:0, y:32, scale:0.9}} animate={{opacity:1, y:0, scale:1}} transition={{duration:0.65, ease:[0.22,1,0.36,1]}} drag="y" dragConstraints={{top:0, bottom:0}} dragElastic={0.08} onDragEnd={onDragEnd} className="relative cursor-grab active:cursor-grabbing select-none" style={{width:'min(260px, 56vw)', aspectRatio:'1 / 1', rotate:'3deg', rotateX: tiltX, rotateY: tiltY}}.
Inside: 3 page shadows from [13,8,4].map((y,i)) absolute inset-0 style {background, transform, opacity:0.28+i*0.2, zIndex:0, borderRadius:18, boxShadow:\`0 \${y*2}px \${y*4}px rgba(0,0,0,0.35)\`}.
Main card: div absolute inset-0 overflow-hidden style {zIndex:1, boxShadow:cardShadow, borderRadius:18}.
- Header: absolute inset-x-0 top-0 flex items-end justify-center gap-8 style {height:'18%', background:headerGrad, zIndex:12, borderRadius:'18px 18px 0 0', borderLeft:'1.5px solid rgba(0,0,0,0.14)', borderRight:'1.5px solid rgba(0,0,0,0.14)', paddingBottom:7}. Two rings (15×15 rounded full) with background ringGrad and boxShadow '0 2px 6px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.6)'.
- Bottom half: absolute inset-x-0 bottom-0 overflow-hidden style {top:'59%', background:bottomGrad} → <Half n={bottomDisplay} half="bottom" numShadow={numShadow}/>.
- Top half: absolute inset-x-0 overflow-hidden style {top:'18%', bottom:'41%', background:topGrad, borderRadius:'12px 12px 0 0'} → <Half n={topDisplay} half="top" numShadow={numShadow}/>.
- Flap (flapVisible): div absolute inset-x-0 style {top:'18%', height:'41%', zIndex:8} containing motion.div absolute inset-0 overflow-hidden style {background:flapGrad, rotateX, perspective:140, transformOrigin:'center bottom', willChange:'transform', borderRadius:'12px 12px 0 0', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.2)'} rendering <Half n={flapContent} half="top" numShadow={numShadow}/>. Plus crease: absolute inset-x-0 bottom-0 pointer-events-none style {height:3, background:'rgba(255,255,255,0.25)', zIndex:9, boxShadow:'0 0 8px rgba(255,255,255,0.18)'}.
- Scan line (flapVisible): motion.div absolute inset-x-0 pointer-events-none style {top: scanYPct, height:2, borderRadius:'9999px', background:'#ffffff', opacity:0.3, zIndex:20}.
- Center seam: absolute inset-x-0 pointer-events-none style {top:'calc(59% - 3px)', height:6, background:seam, zIndex:10}.
- Header divider: absolute inset-x-0 pointer-events-none style {top:'calc(18% - 1px)', height:1, background:'rgba(0,0,0,0.22)', zIndex:11}.
- Surface light: absolute inset-x-0 pointer-events-none style {top:'18%', height:'30%', background:'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, transparent 100%)', borderRadius:'12px 12px 0 0', zIndex:6}.

Hint: motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.1, duration:0.8}} className="font-mono text-xs tracking-widest" style={{color: isDark ? '#3a3530' : '#C8C2B8'}} text '↑ swipe ↓'.

## Half inline sub-component
interface HalfProps { n: number; half: 'top'|'bottom'; numShadow: string } function Half({n, half, numShadow}) → absolute inset-x-0 flex items-center justify-center style {height:'200%', top: half==='top'?0:undefined, bottom: half==='bottom'?0:undefined}. Inside span className "font-sans font-bold select-none tabular-nums" style {fontSize:'clamp(3.8rem, 13vw, 6.5rem)', color:'#ffffff', lineHeight:1, letterSpacing:'-0.03em', textShadow: numShadow} rendering {fmt(n)}.`,

  V0: `Create a FlipCalendar component — a single flip-clock calendar card in blue gradients showing a two-digit day (01..31). Tilt slightly (3° rotation + subtle 3D parallax that follows the mouse). Drag the card up or down, or just tap, to flip to the next or previous day: the top half peels down and rotates on its bottom edge, a bright white scan line sweeps across the card while it flips, and a crease catches light along the bottom of the flap.

Use Tailwind CSS, Framer Motion, and Phosphor Icons (weight='regular'). Theme-aware — detect the closest [data-card-theme] ancestor's dark class with documentElement fallback. Preview background #110F0C dark / #F5F1EA light. The card is min(260px, 56vw) square with rounded 18px corners. Stack three ghost "pages" behind it to suggest a thick pad. The top half uses a 155deg dark-blue gradient (#3572cc→#2455a0 dark / #4e9aec→#3078c8 light), the bottom half a lighter blue (#4a8edc→#68aef4 / #5aaaee→#76c4fc), and the flap sits between them. The header strip (18% tall, warm neutral gradient) carries two small metallic ring binders. Numbers are white, 'clamp(3.8rem, 13vw, 6.5rem)', tabular-nums, with a soft drop shadow. Flip duration 220ms (easeIn out), wrap at 31→1. Add a monospace hint "↑ swipe ↓" below the card. Use drag='y' with dragElastic 0.08 and onDragEnd that flips when |offset.y|>40 or |velocity.y|>300.`,
}
