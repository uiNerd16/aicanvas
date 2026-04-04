import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a circular charging widget component for a Next.js app using Tailwind CSS and Framer Motion.

The widget is a dark circle with a bright, glowing green ring border. Inside the circle, two animated liquid waves rise from the bottom as a percentage number counts up from 0 to 78 over about 4 seconds with easing — then it resets and loops continuously.

Visual details:
- The circle has a very dark green interior (almost black-green)
- The ring glows bright green — use an SVG blur filter to create the glow effect
- A lightning bolt icon sits near the top center of the circle, tinted in a light mint green
- The large bold number (e.g. "18") sits in the center of the circle
- A small "%" label appears directly below the number
- Two overlapping sine waves fill from the bottom — one slightly transparent, one more opaque — giving a liquid sloshing look

Animation:
- The number counts up 0 → 78 over 4 seconds using easeInOut, then pauses 1 second and loops
- The waves continuously undulate in opposite phases (one moves right, the other moves left) for a sloshing effect
- As the fill rises, wave amplitude decreases (calmer surface when more full)
- The wave height matches the current percentage value

The widget should be centered on a very dark warm-black background. No controls — just the animated widget. It should feel like a high-quality UI element from a premium charging screen.`,

  Bolt: `Build a React component called ChargingWidget using Framer Motion and SVG.

Structure:
- Root div: flex, h-full, w-full, items-center, justify-center, bg-sand-950
- Single SVG (viewBox "0 0 200 200", width/height: min(260px, 56vw))
- All rendering happens inside the SVG

SVG layers (bottom to top):
1. Dark background circle: cx/cy 100, r 88, fill "#071407"
2. Two animated wave paths clipped to a circle clipPath (id="cw-circle-clip", r 88)
3. Glowing green ring: stroke "#00cc44", strokeWidth 3, with feGaussianBlur filter (stdDeviation 4)
4. Lightning bolt SVG path centered at ~(100, 52), tinted "#a0ffb0"
5. Large bold number text (fontSize 42, fontWeight 800, fill white)
6. "%" label text below (fontSize 14, fill rgba(255,255,255,0.7))

Wave animation via requestAnimationFrame:
- Two SVGPathElement refs (wave1Ref, wave2Ref), mutated directly — no React state
- fillY = 200 - (percent / 100) * 200
- amp = 6 * (1 - percent / 100) + 2
- Wave path: M 0 fillY, then L x (fillY + sin((x/200)*4π + offset)*amp) for x in 0..200 step 2, then L 200 200, L 0 200, Z
- offset1 increments by 0.05 per frame, offset2 decrements by 0.03 (opposite phase)
- Wave 1 fill: rgba(0, 180, 60, 0.4) — Wave 2 fill: rgba(0, 220, 80, 0.65)

Count-up animation:
- useMotionValue(0) named 'percent'
- useEffect loop: animate(percent, 78, { duration: 4, ease: 'easeInOut' }), wait 1s, repeat
- On MotionValue change: update percentRef.current and mutate the SVG text element ref directly
- Clean up RAF and animation on unmount with an 'alive' flag`,

  Lovable: `I'd love a component that feels like the charging screen on a sleek sci-fi device — something you'd see on a premium EV or a piece of high-end tech.

Picture a perfect dark circle floating in the center of the screen. It has a vivid glowing green ring around it — the kind of glow that pulses with life. Inside, two liquid waves rise slowly from the bottom, sloshing gently back and forth like real fluid, with a gorgeous translucent green color that feels alive.

At the top of the circle, a small lightning bolt icon glows softly in mint green. Below it, a large bold number counts up from 0 to 78 — slowly and confidently, easing in and out — and then resets and goes again, forever. Below the number, a subtle "%" sits in muted white.

The waves get calmer as they rise, like a glass getting full. It feels meditative and satisfying to watch. The whole thing sits against a near-black warm dark background, making the green glow pop.

Use Framer Motion for the count-up animation and SVG paths animated with requestAnimationFrame for the liquid waves. The waves should always be in motion — constantly sloshing in opposite directions so they cross each other in a hypnotic pattern.`,

  'Claude Code': `Create \`components-workspace/charging-widget/index.tsx\`. Export named function \`ChargingWidget\`. \`'use client'\` at top.

## Constants
\`\`\`
TARGET_PERCENT = 78
COUNT_DURATION = 4      // seconds
PAUSE_DURATION = 1      // seconds
WAVE1_COLOR = 'rgba(0, 180, 60, 0.4)'
WAVE2_COLOR = 'rgba(0, 220, 80, 0.65)'
RING_COLOR = '#00cc44'
BG_CIRCLE_COLOR = '#071407'
TEXT_COLOR = '#ffffff'
TEXT_MUTED = 'rgba(255,255,255,0.7)'
BOLT_COLOR = '#a0ffb0'
\`\`\`

## Root element
\`<div className="flex h-full w-full items-center justify-center bg-sand-950">\`

## SVG structure
Single SVG, viewBox "0 0 200 200", style width/height: "min(260px, 56vw)".

### Defs
- clipPath id="cw-circle-clip": \`<circle cx="100" cy="100" r="88" />\`
- filter id="cw-glow": feGaussianBlur stdDeviation="4" + feComposite operator="over"
- filter id="cw-outer-glow": feGaussianBlur stdDeviation="6" + feComposite
- filter id="cw-bolt-glow": feGaussianBlur stdDeviation="3" + feComposite

### Layers (bottom to top)
1. Background circle: cx/cy=100, r=88, fill=BG_CIRCLE_COLOR
2. Wave group with clipPath="url(#cw-circle-clip)":
   - \`<path ref={wave1Ref} fill={WAVE1_COLOR} />\`
   - \`<path ref={wave2Ref} fill={WAVE2_COLOR} />\`
3. Blurred ring: r=88, stroke=RING_COLOR, strokeWidth=5, opacity=0.5, filter="url(#cw-outer-glow)"
4. Sharp ring: r=88, stroke=RING_COLOR, strokeWidth=3, filter="url(#cw-glow)"
5. Lightning bolt SVG path at transform="translate(100, 52) scale(0.7)", fill=BOLT_COLOR, filter="url(#cw-bolt-glow)"
6. Number text: ref={displayRef}, x=100, y=118, fontSize=42, fontWeight=800, fill=TEXT_COLOR, textAnchor="middle"
7. "%" text: x=100, y=140, fontSize=14, fontWeight=600, fill=TEXT_MUTED, textAnchor="middle"

## Animation 1: Count-up loop (Framer Motion)
\`\`\`ts
const percent = useMotionValue(0)
const percentRef = useRef(0)

// Sync MotionValue → ref + DOM text mutation
useEffect(() => {
  return percent.on('change', (v) => {
    percentRef.current = v
    if (displayRef.current) displayRef.current.textContent = Math.round(v).toString()
  })
}, [percent])

// Loop: 0→78 over 4s easeInOut, pause 1s, repeat
useEffect(() => {
  let alive = true
  async function run() {
    while (alive) {
      percent.set(0)
      await animate(percent, 78, { duration: 4, ease: 'easeInOut' })
      if (!alive) break
      await new Promise<void>(r => setTimeout(r, 1000))
      if (!alive) break
    }
  }
  run()
  return () => { alive = false }
}, [percent])
\`\`\`

## Animation 2: Wave RAF loop
\`\`\`ts
useEffect(() => {
  let rafId: number
  let offset1 = 0, offset2 = 0

  function buildWavePath(fillY: number, amp: number, phase: number): string {
    let d = \`M 0 \${fillY}\`
    for (let x = 0; x <= 200; x += 2) {
      d += \` L \${x} \${fillY + Math.sin((x / 200) * 4 * Math.PI + phase) * amp}\`
    }
    return d + \` L 200 200 L 0 200 Z\`
  }

  function tick() {
    const pct = percentRef.current
    const fillY = 200 - (pct / 100) * 200
    const amp = 6 * (1 - pct / 100) + 2
    offset1 += 0.05; offset2 -= 0.03
    wave1Ref.current?.setAttribute('d', buildWavePath(fillY, amp, offset1))
    wave2Ref.current?.setAttribute('d', buildWavePath(fillY, amp, offset2 + Math.PI))
    rafId = requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(rafId)
}, [])
\`\`\`

## TypeScript
- No \`any\`. Refs: \`useRef<SVGPathElement>(null)\`, \`useRef<SVGTextElement>(null)\`, \`useRef<number>(0)\`
- Imports: \`useEffect, useRef\` from 'react'; \`useMotionValue, animate\` from 'framer-motion'; \`Lightning\` from '@phosphor-icons/react' (optional — or draw bolt as inline SVG path)`,

  Cursor: `File: \`components-workspace/charging-widget/index.tsx\`
Export: \`ChargingWidget\` (named, 'use client')

## Layout
- Root: \`flex h-full w-full items-center justify-center bg-sand-950\`
- Single SVG: viewBox="0 0 200 200", width/height style="min(260px, 56vw)"

## SVG structure
- defs: clipPath id="cw-circle-clip" (circle r=88), glow filter (feGaussianBlur stdDeviation=4), outer-glow filter (stdDeviation=6), bolt-glow filter (stdDeviation=3)
- bg circle: cx/cy=100 r=88 fill="#071407"
- wave group: clipPath="url(#cw-circle-clip)", two \`<path>\` refs (wave1Ref, wave2Ref)
- blurred ring: stroke="#00cc44" strokeWidth=5 opacity=0.5 filter="url(#cw-outer-glow)"
- sharp ring: stroke="#00cc44" strokeWidth=3 filter="url(#cw-glow)"
- lightning bolt: inline SVG path at translate(100,52) scale(0.7), fill="#a0ffb0", filter="url(#cw-bolt-glow)"
- number: SVGTextElement ref, x=100 y=118 fontSize=42 fontWeight=800 fill="#ffffff"
- "%": x=100 y=140 fontSize=14 fontWeight=600 fill="rgba(255,255,255,0.7)"

## Count-up animation
- \`percent = useMotionValue(0)\`, \`percentRef = useRef<number>(0)\`
- Sync: \`percent.on('change', v => { percentRef.current = v; textRef.current!.textContent = Math.round(v).toString() })\`
- Loop (alive guard): \`percent.set(0)\` → \`await animate(percent, 78, { duration: 4, ease: 'easeInOut' })\` → \`setTimeout 1000ms\` → repeat

## Wave RAF loop
- buildWavePath(fillY, amp, phase): M 0 fillY + L x y for x 0..200 step 2 where y = fillY + sin((x/200)*4π+phase)*amp + L 200 200 L 0 200 Z
- fillY = 200 - (pct/100)*200, amp = 6*(1-pct/100)+2
- offset1 += 0.05 per frame, offset2 -= 0.03 per frame
- wave2 phase = offset2 + π (opposite sloshing direction)
- Colors: wave1=rgba(0,180,60,0.4), wave2=rgba(0,220,80,0.65)
- Cleanup: cancelAnimationFrame on unmount

## Types
- wave1Ref, wave2Ref: \`useRef<SVGPathElement>(null)\`
- displayRef: \`useRef<SVGTextElement>(null)\`
- No any, no type assertions`,
}
