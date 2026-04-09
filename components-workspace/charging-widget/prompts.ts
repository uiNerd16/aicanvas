import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named ChargingWidget — a circular battery-charging indicator with two animated liquid waves filling the inside and a percentage number counting from 0 to 78 on a loop. Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Constants: TARGET_PERCENT = 78, COUNT_DURATION = 4 (seconds), PAUSE_DURATION = 1.

Layout: flex h-full w-full items-center justify-center. Background theme-aware: #110F0C dark / #F5F1EA light. Theme detection via closest [data-card-theme] dark class with documentElement fallback and MutationObserver on both.

Render a single SVG with viewBox='0 0 200 200', width/height = 'min(260px, 56vw)'. Inside <defs> add a clipPath id 'cw-circle-clip' = circle(100,100,r=88); and a filter id 'cw-bolt-glow' with a feGaussianBlur stdDeviation=3 then feComposite operator 'over' over SourceGraphic.

Draw: background circle cx=100 cy=100 r=88 fill = BG_CIRCLE_COLOR (rgba(120,60,220,0.10) dark / rgba(130,60,220,0.06) light). Wave group <g clipPath='url(#cw-circle-clip)'> containing two <path> refs (wave1/wave2) — initial d = 'M 0 200 L 200 200 L 200 200 L 0 200 Z'. Stroke ring circle r=88 fill none stroke RING_COLOR (#a855f7 dark / #7c3aed light) strokeWidth 3. Lightning bolt group transform='translate(100, 52) scale(0.7)' filter='url(#cw-bolt-glow)', path d='M 8 -20 L -8 2 L 0 2 L -8 20 L 8 -2 L 0 -2 Z' fill BOLT_COLOR (#e0b0ff dark / #6d28d9 light). Percent number <text ref=displayRef> at x=100 y=118 textAnchor middle dominantBaseline middle fill TEXT_COLOR (#ffffff dark / #1C1916 light) fontSize=42 fontWeight=800 fontFamily 'Manrope, sans-serif' letterSpacing=-1. Then a '%' text x=100 y=140 fontSize=14 fontWeight=600 fill TEXT_MUTED (rgba(255,255,255,0.7) / rgba(28,25,22,0.60)).

Wave colors: WAVE1_COLOR rgba(120,60,220,0.45) dark / rgba(109,40,217,0.28) light. WAVE2_COLOR rgba(160,80,255,0.70) / rgba(124,58,237,0.52).

State: useMotionValue percent starts 0. Keep percentRef (number) in sync via percent.on('change', v => { percentRef=v; displayRef.textContent = round(v).toString() }). Unsubscribe on cleanup.

Count-up loop effect (alive flag): async while alive → percent.set(0); await animate(percent, TARGET_PERCENT, {duration: COUNT_DURATION, ease:'easeInOut'}); await sleep(PAUSE_DURATION*1000); repeat. Cleanup sets alive=false.

Wave RAF effect — no React state. offset1, offset2 = 0. buildWavePath(fillY, amp, phase): d = 'M 0 '+fillY; for x=0..200 step 2 add ' L '+x+' '+(fillY + sin((x/200)*2PI*2 + phase)*amp); close ' L 200 200 L 0 200 Z'. Tick: pct=percentRef; fillY = 200 - (pct/100)*200; amp = 14*(1-pct/100) + 4; offset1 += 0.025; offset2 -= 0.018; set wave1 d to build(fillY, amp, offset1); set wave2 d to build(fillY, amp, offset2 + PI). cancelAnimationFrame on cleanup.`,

  GPT: `Build a React client component named ChargingWidget. Single file. TypeScript strict, no \`any\`. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

Circular purple battery charging widget: two overlapping sine waves fill the interior, a centered number counts 0→78 then pauses 1s and loops. A lightning bolt sits above the number.

## Data/State
- const TARGET_PERCENT = 78, COUNT_DURATION = 4, PAUSE_DURATION = 1
- useRef containerRef, wave1Ref (SVGPathElement), wave2Ref (SVGPathElement), displayRef (SVGTextElement), percentRef (number, 0)
- useState isDark (true)
- useMotionValue percent (0)

## Theme
Closest [data-card-theme] .dark else documentElement .dark. MutationObserver on both. previewBg '#110F0C' / '#F5F1EA'. WAVE1 rgba(120,60,220,0.45) / rgba(109,40,217,0.28). WAVE2 rgba(160,80,255,0.70) / rgba(124,58,237,0.52). RING '#a855f7' / '#7c3aed'. BG_CIRCLE rgba(120,60,220,0.10) / rgba(130,60,220,0.06). TEXT '#ffffff' / '#1C1916'. TEXT_MUTED rgba(255,255,255,0.7) / rgba(28,25,22,0.60). BOLT '#e0b0ff' / '#6d28d9'.

## Animation
1. percent subscribe: percentRef = v; displayRef.textContent = Math.round(v).toString().
2. Count loop: while alive { percent.set(0); await animate(percent, TARGET_PERCENT, {duration: COUNT_DURATION, ease: 'easeInOut'}); await new Promise(r=>setTimeout(r, PAUSE_DURATION*1000)) }.
3. RAF tick: pct=percentRef; fillY = 200 - (pct/100)*200; amp = 14*(1-pct/100) + 4; offset1 += 0.025; offset2 -= 0.018; wave1.setAttribute('d', buildWavePath(fillY, amp, offset1)); wave2.setAttribute('d', buildWavePath(fillY, amp, offset2 + Math.PI)).
4. buildWavePath(fillY, amp, phase): start 'M 0 '+fillY; for x=0; x<=200; x+=2 append ' L '+x+' '+(fillY + Math.sin((x/200)*2*Math.PI*2 + phase)*amp); end ' L 200 200 L 0 200 Z'.

## Interaction
None — autonomous loop.

## JSX structure
- div containerRef, flex h-full w-full items-center justify-center, style background previewBg
  - svg viewBox='0 0 200 200' width='min(260px, 56vw)' height same, aria-label 'Charging: 78%'
    - defs: clipPath id 'cw-circle-clip' (circle 100,100,88); filter id 'cw-bolt-glow' x/y=-50% w/h=200% with feGaussianBlur stdDeviation=3 result='blur' then feComposite in='blur' in2='SourceGraphic' operator='over'
    - circle 100,100,88 fill BG_CIRCLE_COLOR
    - g clipPath='url(#cw-circle-clip)' → path ref=wave1Ref fill WAVE1_COLOR d='M 0 200 L 200 200 L 200 200 L 0 200 Z'; path ref=wave2Ref fill WAVE2_COLOR same d
    - circle 100,100,88 fill none stroke RING stroke-width 3
    - g transform='translate(100, 52) scale(0.7)' filter='url(#cw-bolt-glow)': path d='M 8 -20 L -8 2 L 0 2 L -8 20 L 8 -2 L 0 -2 Z' fill BOLT
    - text ref=displayRef x=100 y=118 textAnchor='middle' dominantBaseline='middle' fill TEXT fontSize=42 fontWeight=800 fontFamily 'Manrope, sans-serif' letterSpacing=-1 → '0'
    - text x=100 y=140 textAnchor='middle' dominantBaseline='middle' fill TEXT_MUTED fontSize=14 fontWeight=600 fontFamily 'Manrope, sans-serif' → '%'

Cleanup alive flag, RAF, and percent subscription.

Imports: useEffect, useRef, useState; useMotionValue, animate from framer-motion.`,

  Gemini: `Implement a React client component named ChargingWidget as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useEffect, useRef, useState } from 'react'
import { useMotionValue, animate } from 'framer-motion'

USE these hooks and no others. DO NOT invent hooks not shown above. Do NOT call useMotionValue() inline inside JSX. The wave animation uses requestAnimationFrame and setAttribute directly on path refs — do NOT convert it to a Framer motion animation.

## Concept
A circular charging indicator, ~260px, with two sine-wave liquid fills, a ring outline, a glowing lightning bolt, and a big center number counting 0→78 on a 4s easeInOut curve, pausing 1s, then looping.

## Constants
const TARGET_PERCENT = 78; const COUNT_DURATION = 4; const PAUSE_DURATION = 1.

## State / refs
containerRef: HTMLDivElement | null. isDark: boolean (default true). wave1Ref, wave2Ref: SVGPathElement | null. displayRef: SVGTextElement | null. percentRef: number (0). percent = useMotionValue(0).

## Theme detection
useEffect on mount: check() reads closest('[data-card-theme]') .dark class or documentElement .dark. MutationObserver on documentElement and on cardWrapper with {attributes:true, attributeFilter:['class']}. Disconnect on cleanup.

## Theme colors
previewBg '#110F0C' / '#F5F1EA'. WAVE1_COLOR 'rgba(120, 60, 220, 0.45)' / 'rgba(109, 40, 217, 0.28)'. WAVE2_COLOR 'rgba(160, 80, 255, 0.70)' / 'rgba(124, 58, 237, 0.52)'. RING_COLOR '#a855f7' / '#7c3aed'. BG_CIRCLE_COLOR 'rgba(120, 60, 220, 0.10)' / 'rgba(130, 60, 220, 0.06)'. TEXT_COLOR '#ffffff' / '#1C1916'. TEXT_MUTED 'rgba(255,255,255,0.7)' / 'rgba(28,25,22,0.60)'. BOLT_COLOR '#e0b0ff' / '#6d28d9'.

## Percent subscription
useEffect([percent]): const unsub = percent.on('change', v => { percentRef.current = v; if (displayRef.current) displayRef.current.textContent = Math.round(v).toString() }); return unsub.

## Count loop
useEffect([percent]): let alive = true; async function run() { while (alive) { percent.set(0); await animate(percent, TARGET_PERCENT, { duration: COUNT_DURATION, ease: 'easeInOut' }); if (!alive) break; await new Promise<void>(resolve => { const t = setTimeout(resolve, PAUSE_DURATION * 1000); if (!alive) { clearTimeout(t); resolve() } }); if (!alive) break } }; run(); return () => { alive = false }.

## RAF wave loop
useEffect([]): let rafId: number; let offset1 = 0; let offset2 = 0. buildWavePath(fillY, amp, phase): let d = \`M 0 \${fillY}\`; for (let x=0; x<=200; x+=2) { const y = fillY + Math.sin((x/200) * 2 * Math.PI * 2 + phase) * amp; d += \` L \${x} \${y}\` } d += ' L 200 200 L 0 200 Z'; return d. tick(): pct = percentRef.current; fillY = 200 - (pct/100)*200; amp = 14*(1-pct/100) + 4; offset1 += 0.025; offset2 -= 0.018; wave1Ref.current?.setAttribute('d', buildWavePath(fillY, amp, offset1)); wave2Ref.current?.setAttribute('d', buildWavePath(fillY, amp, offset2 + Math.PI)); rafId = requestAnimationFrame(tick). Cleanup cancelAnimationFrame(rafId).

## SVG structure
- svgSize = 'min(260px, 56vw)'
- <svg viewBox="0 0 200 200" style={{ width: svgSize, height: svgSize }} aria-label="Charging: 78%">
  - <defs>
    - <clipPath id="cw-circle-clip"><circle cx="100" cy="100" r="88" /></clipPath>
    - <filter id="cw-bolt-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" /><feComposite in="blur" in2="SourceGraphic" operator="over" /></filter>
  - <circle cx="100" cy="100" r="88" fill={BG_CIRCLE_COLOR} />
  - <g clipPath="url(#cw-circle-clip)"><path ref={wave1Ref} fill={WAVE1_COLOR} d="M 0 200 L 200 200 L 200 200 L 0 200 Z" /><path ref={wave2Ref} fill={WAVE2_COLOR} d="M 0 200 L 200 200 L 200 200 L 0 200 Z" /></g>
  - <circle cx="100" cy="100" r="88" fill="none" stroke={RING_COLOR} strokeWidth="3" />
  - <g transform="translate(100, 52) scale(0.7)" filter="url(#cw-bolt-glow)"><path d="M 8 -20 L -8 2 L 0 2 L -8 20 L 8 -2 L 0 -2 Z" fill={BOLT_COLOR} strokeLinejoin="round" /></g>
  - <text ref={displayRef} x="100" y="118" textAnchor="middle" dominantBaseline="middle" fill={TEXT_COLOR} fontSize="42" fontWeight="800" fontFamily="Manrope, sans-serif" letterSpacing="-1">0</text>
  - <text x="100" y="140" textAnchor="middle" dominantBaseline="middle" fill={TEXT_MUTED} fontSize="14" fontWeight="600" fontFamily="Manrope, sans-serif">%</text>

Root container: div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}.`,

  V0: `Create a ChargingWidget component — a round purple battery-charging indicator, about 260px across. Inside a thin circle outline, two translucent violet sine waves slosh around, rising as a big white number ticks up from 0 to 78, then pausing briefly and looping. A small glowing lightning bolt sits above the number, and a muted '%' sign sits below it.

Use Framer Motion (useMotionValue + animate for the count-up, plus a requestAnimationFrame loop that mutates SVG path 'd' attributes directly for the waves). The waves are built as sine curves across x=0..200 with amplitude 14*(1-pct/100)+4, fill level y=200-(pct/100)*200, one flowing right at +0.025 per frame, the other left at -0.018 and phase-offset by π. Use a clipPath to keep both waves inside a circle of r=88. Draw the ring in #a855f7 (dark) / #7c3aed (light), the number in Manrope 800 42px white/#1C1916, the bolt in #e0b0ff/#6d28d9 with a soft blur glow. Preview background #110F0C dark / #F5F1EA light, theme detected from the closest [data-card-theme] ancestor. Use Tailwind CSS for layout. Count 0→78 over 4s easeInOut, pause 1s, repeat forever.`,
}
