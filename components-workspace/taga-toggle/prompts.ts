import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`TagaToggle\` — a playful pill toggle with an expressive face drawn on the thumb. Off = dead face (×× eyes, flat mouth). On = happy face (squinted arc eyes, big smile).

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

## Imports
\`\`\`
'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
\`\`\`

## Constants
\`MAX_TRACK_W = 80\`, \`MIN_TRACK_W = 48\`, \`FACE_COLOR = '#4A3F35'\` (warm dark — legible on white in both themes).

## Derived dimensions (from \`trackW\` state)
\`trackH = round(trackW * 0.58)\`
\`thumb = round(trackW * 0.50)\`
\`pad = max(3, round(trackW * 0.04))\`
\`offX = pad\`, \`onX = trackW - thumb - pad\`
\`faceSize = thumb * 0.78\`

## Motion values
\`thumbX = useMotionValue(offX)\`.
\`trackColor = useTransform(thumbX, [offX, onX], [offTrack, onTrack])\` where:
- \`offTrack = pageIsDark ? '#4A4540' : '#9E9890'\`
- \`onTrack = pageIsDark ? '#D4960A' : '#F5C518'\`

## State
\`isOn\` (bool, default false), \`animating\` (bool), \`pageIsDark\` (bool, default true), \`trackW\` (number, default MAX_TRACK_W).
Keep a \`isOnRef = useRef(false)\` synchronized with \`isOn\` to read in the resize snap effect.

## Theme + resize detection (single useEffect)
Get \`containerRef.current\`. Theme: find \`closest('[data-card-theme]')\` → if found use \`.classList.contains('dark')\`, else \`document.documentElement.classList.contains('dark')\`. MutationObserver on both. Resize: \`ResizeObserver\` on the container — compute \`s = max(MIN_TRACK_W, min(MAX_TRACK_W, round(min(el.offsetWidth, el.offsetHeight) * 0.18)))\` → \`setTrackW(s)\`. Cleanup disconnects both.

## Resize snap (separate useEffect on trackW)
\`thumbX.set(isOnRef.current ? onX : offX)\` — snaps the thumb instantly when the track resizes.

## Toggle handler
\`handleToggle\` (async, guarded by \`animating\`): set animating true, compute target (\`isOn ? offX : onX\`), update \`isOnRef\`, toggle \`isOn\`, \`await animate(thumbX, target, { type:'spring', stiffness:500, damping:36 })\`, set animating false.

## Theme tokens
\`previewBg = pageIsDark ? '#110F0C' : '#EDEAE5'\`
\`trackInset = pageIsDark ? 'inset 0 1px 4px rgba(0,0,0,0.50)' : 'inset 0 1px 3px rgba(0,0,0,0.14)'\`
\`thumbShadow = pageIsDark ? '0 3px 8px rgba(0,0,0,0.50), 0 1px 3px rgba(0,0,0,0.30)' : '0 3px 8px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.10)'\`

## Face SVG paths
Mouth (IMPORTANT — both share M+Q structure for smooth Framer Motion path interpolation):
- Off (flat): \`'M -0.40,0.43 Q 0,0.43 0.40,0.43'\`
- On (smile): \`'M -0.40,0.15 Q 0,0.50 0.40,0.15'\`

Eye spring: \`{ duration: 0.16, ease: [0.34, 1.56, 0.64, 1] }\`.

Left eye happy: \`<motion.path d="M -0.50,-0.28 Q -0.32,-0.06 -0.14,-0.28" stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round" fill="none" />\`
Left eye dead: \`<motion.g>\` containing two \`<line>\` elements forming an ×:
- \`x1="-0.50" y1="-0.33" x2="-0.14" y2="-0.01"\`
- \`x1="-0.14" y1="-0.33" x2="-0.50" y2="-0.01"\`

Right eye happy: \`d="M 0.14,-0.28 Q 0.32,-0.06 0.50,-0.28"\`
Right eye dead: same × pattern at (0.14,0.50) positions:
- \`x1="0.14" y1="-0.33" x2="0.50" y2="-0.01"\`
- \`x1="0.50" y1="-0.33" x2="0.14" y2="-0.01"\`

All strokes: \`stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round"\`.

## JSX structure
Root: \`<div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{ background: previewBg }}>\`.
Entrance: \`motion.div initial { opacity:0, scale:0.88 } animate { opacity:1, scale:1 } transition { duration:0.4, ease:[0.34,1.56,0.64,1] }\` wrapping the track.

Track: \`motion.button\` with \`style={{ width:trackW, height:trackH, borderRadius:trackH/2, backgroundColor:trackColor, boxShadow:trackInset, position:'relative', cursor:'pointer', border:'none', outline:'none', display:'block' }}\`, \`whileTap {{ scale: 0.96 }}\`, \`transition {{ type: 'spring', stiffness: 400, damping: 28 }}\`, \`onClick={handleToggle}\`.

Thumb: \`motion.div\` inside the track. \`style={{ position:'absolute', top:pad, x:thumbX, width:thumb, height:thumb, borderRadius:'50%', background:'white', boxShadow:thumbShadow, display:'flex', alignItems:'center', justifyContent:'center' }}\`.

Inside thumb: \`<svg viewBox="-1 -1 2 2" width={faceSize} height={faceSize}>\`:
- Two \`AnimatePresence mode="wait"\` blocks (left eye, right eye), each choosing happy arc path or dead × group based on \`isOn\`. Enter/exit: \`initial/exit { opacity:0, scale:0.3 }\`, \`animate { opacity:1, scale:1 }\`, transition = eyeSpring.
- \`<motion.path d={mouthPath} stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round" fill="none" transition={{ duration:0.28, ease:'easeInOut' }} />\` — the path \`d\` attribute is set to either the flat or smile path. Because both share the same M+Q structure, Framer Motion interpolates between them smoothly.

Use Manrope font.`,

  GPT: `Build a React client component named \`TagaToggle\`. Single file. TypeScript strict, no \`any\`.

Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Imports
\`\`\`
'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
\`\`\`

## Constants
\`MAX_TRACK_W = 80\`, \`MIN_TRACK_W = 48\`, \`FACE_COLOR = '#4A3F35'\`.

## Derived dims (from \`trackW\` state, default MAX_TRACK_W)
\`trackH = round(trackW * 0.58)\`, \`thumb = round(trackW * 0.50)\`, \`pad = max(3, round(trackW * 0.04))\`, \`offX = pad\`, \`onX = trackW - thumb - pad\`, \`faceSize = thumb * 0.78\`.

## Motion values
\`thumbX = useMotionValue(offX)\`.
Track colors: \`offTrack = pageIsDark ? '#4A4540' : '#9E9890'\`, \`onTrack = pageIsDark ? '#D4960A' : '#F5C518'\`.
\`trackColor = useTransform(thumbX, [offX, onX], [offTrack, onTrack])\`.

## State
\`isOn\` bool false, \`animating\` bool false, \`pageIsDark\` bool true, \`trackW\` number MAX_TRACK_W, \`containerRef\` div, \`isOnRef = useRef(false)\`.

## Theme + resize (one useEffect, empty deps)
Theme: \`el.closest('[data-card-theme]')\` → classList.contains('dark'), fallback \`document.documentElement\`. MutationObserver on both. Resize: ResizeObserver on el → \`s = max(MIN_TRACK_W, min(MAX_TRACK_W, round(min(el.offsetWidth, el.offsetHeight) * 0.18)))\` → setTrackW(s). Cleanup: mo.disconnect(), ro.disconnect().

## Resize snap (useEffect on [trackW])
\`thumbX.set(isOnRef.current ? onX : offX)\` — instant reposition on resize.

## Toggle handler
async, guarded by \`animating\`. Compute target = \`isOn ? offX : onX\`. Set \`isOnRef.current = !isOn\`. Toggle \`isOn\`. \`await animate(thumbX, target, { type: 'spring', stiffness: 500, damping: 36 })\`. Clear animating.

## Theme tokens
\`previewBg\`: dark \`#110F0C\`, light \`#EDEAE5\`.
\`trackInset\`: dark \`inset 0 1px 4px rgba(0,0,0,0.50)\`, light \`inset 0 1px 3px rgba(0,0,0,0.14)\`.
\`thumbShadow\`: dark \`0 3px 8px rgba(0,0,0,0.50), 0 1px 3px rgba(0,0,0,0.30)\`, light \`0 3px 8px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.10)\`.

## Face SVG (viewBox "-1 -1 2 2")
All strokes: \`stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round"\`.
Eye spring: \`{ duration: 0.16, ease: [0.34, 1.56, 0.64, 1] }\`.

### Eyes (AnimatePresence mode="wait" per eye)
Happy left eye path: \`d="M -0.50,-0.28 Q -0.32,-0.06 -0.14,-0.28"\` (arc, fill none).
Dead left eye: motion.g with two lines — \`(-0.50,-0.33)→(-0.14,-0.01)\` and \`(-0.14,-0.33)→(-0.50,-0.01)\`.
Happy right eye path: \`d="M 0.14,-0.28 Q 0.32,-0.06 0.50,-0.28"\`.
Dead right eye: lines at (0.14,0.50) positions — \`(0.14,-0.33)→(0.50,-0.01)\` and \`(0.50,-0.33)→(0.14,-0.01)\`.
Enter/exit: \`initial/exit { opacity:0, scale:0.3 }\`, \`animate { opacity:1, scale:1 }\`, transition = eyeSpring.

### Mouth (animated d attr — M+Q interpolation)
Off: \`'M -0.40,0.43 Q 0,0.43 0.40,0.43'\` (flat).
On: \`'M -0.40,0.15 Q 0,0.50 0.40,0.15'\` (smile).
\`<motion.path d={mouthPath} transition={{ duration: 0.28, ease: 'easeInOut' }} />\` — same structure enables path d interpolation.

## JSX structure
Root \`<div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{ background: previewBg }}>\`.
Entrance \`<motion.div initial={{ opacity:0, scale:0.88 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.4, ease:[0.34,1.56,0.64,1] }} className="select-none">\`.
Track: \`<motion.button onClick={handleToggle} style={{ width:trackW, height:trackH, borderRadius:trackH/2, backgroundColor:trackColor, boxShadow:trackInset, position:'relative', cursor:'pointer', border:'none', outline:'none', display:'block' }} whileTap={{ scale:0.96 }} transition={{ type:'spring', stiffness:400, damping:28 }}>\`.
Thumb: \`<motion.div style={{ position:'absolute', top:pad, x:thumbX, width:thumb, height:thumb, borderRadius:'50%', background:'white', boxShadow:thumbShadow, display:'flex', alignItems:'center', justifyContent:'center' }}>\`.
SVG: \`<svg viewBox="-1 -1 2 2" width={faceSize} height={faceSize}>\` containing eye AnimatePresence blocks and mouth motion.path.

## Behavior
- No icons, no blush circles.
- Font \`font-sans\` (Manrope).
- Responsive via ResizeObserver. Dual theme via MutationObserver.`,

  Gemini: `Implement a React client component named \`TagaToggle\` as a single TypeScript file.

Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
\`\`\`
'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
\`\`\`

USE these hooks and no others. DO NOT invent \`useSpringValue\`, \`useAnimatedValue\`, or other helpers. DO NOT use \`useSpring\` — the thumb animates via \`animate(thumbX, target, springConfig)\`. DO NOT call \`useMotionValue()\` or \`useMotionTemplate()\` inline inside JSX.

## Phosphor icons
None — this component uses no icons. The face is drawn entirely with SVG.

## Constants
\`\`\`
const MAX_TRACK_W = 80
const MIN_TRACK_W = 48
const FACE_COLOR  = '#4A3F35'
\`\`\`

## Derived dimensions (compute in the component body from \`trackW\` state)
\`\`\`
const trackH = Math.round(trackW * 0.58)
const thumb  = Math.round(trackW * 0.50)
const pad    = Math.max(3, Math.round(trackW * 0.04))
const offX   = pad
const onX    = trackW - thumb - pad
const faceSize = thumb * 0.78
\`\`\`

## Motion values (declare at the top of the component body)
\`\`\`
const thumbX = useMotionValue(offX)
\`\`\`

Track colors (derive from theme state):
\`\`\`
const offTrack   = pageIsDark ? '#4A4540' : '#9E9890'
const onTrack    = pageIsDark ? '#D4960A' : '#F5C518'
const trackColor = useTransform(thumbX, [offX, onX], [offTrack, onTrack])
\`\`\`

## Component state
\`\`\`
const [isOn, setIsOn]             = useState(false)
const [animating, setAnimating]   = useState(false)
const [pageIsDark, setPageIsDark] = useState(true)
const [trackW, setTrackW]         = useState(MAX_TRACK_W)
const containerRef                = useRef<HTMLDivElement>(null)
const isOnRef                     = useRef(false)
\`\`\`

## Theme + resize detection (single useEffect, empty deps)
\`\`\`
useEffect(() => {
  const el = containerRef.current
  if (!el) return
  const check = () => {
    const card = el.closest('[data-card-theme]')
    setPageIsDark(
      card
        ? card.classList.contains('dark')
        : document.documentElement.classList.contains('dark'),
    )
  }
  check()
  const mo = new MutationObserver(check)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  const cardWrapper = el.closest('[data-card-theme]')
  if (cardWrapper) mo.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
  const update = () => {
    const s = Math.max(
      MIN_TRACK_W,
      Math.min(MAX_TRACK_W, Math.round(Math.min(el.offsetWidth, el.offsetHeight) * 0.18)),
    )
    setTrackW(s)
  }
  update()
  const ro = new ResizeObserver(update)
  ro.observe(el)
  return () => { mo.disconnect(); ro.disconnect() }
}, [])
\`\`\`

## Resize snap (separate useEffect with [trackW] dep)
\`\`\`
useEffect(() => {
  thumbX.set(isOnRef.current ? onX : offX)
}, [trackW])
\`\`\`

## Toggle handler
\`\`\`
const handleToggle = useCallback(async () => {
  if (animating) return
  setAnimating(true)
  const target = isOn ? offX : onX
  isOnRef.current = !isOn
  setIsOn((v) => !v)
  await animate(thumbX, target, { type: 'spring', stiffness: 500, damping: 36 })
  setAnimating(false)
}, [isOn, animating, thumbX, offX, onX])
\`\`\`

## Theme tokens
\`\`\`
const previewBg   = pageIsDark ? '#110F0C' : '#EDEAE5'
const trackInset  = pageIsDark
  ? 'inset 0 1px 4px rgba(0,0,0,0.50)'
  : 'inset 0 1px 3px rgba(0,0,0,0.14)'
const thumbShadow = pageIsDark
  ? '0 3px 8px rgba(0,0,0,0.50), 0 1px 3px rgba(0,0,0,0.30)'
  : '0 3px 8px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.10)'
\`\`\`

## Mouth paths (CRITICAL — same M+Q structure enables d-attribute interpolation)
\`\`\`
const mouthPath = isOn
  ? 'M -0.40,0.15 Q 0,0.50 0.40,0.15'   // smile
  : 'M -0.40,0.43 Q 0,0.43 0.40,0.43'   // flat
\`\`\`

## Eye animation config
\`\`\`
const eyeSpring = { duration: 0.16, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }
\`\`\`

## JSX structure
Root: \`<div ref={containerRef} className="flex h-full w-full items-center justify-center" style={{ background: previewBg }}>\`.

Entrance wrapper:
\`\`\`
<motion.div
  initial={{ opacity: 0, scale: 0.88 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
  className="select-none"
>
\`\`\`

Track:
\`\`\`
<motion.button
  onClick={handleToggle}
  style={{
    width: trackW,
    height: trackH,
    borderRadius: trackH / 2,
    backgroundColor: trackColor,
    boxShadow: trackInset,
    position: 'relative',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    display: 'block',
  }}
  whileTap={{ scale: 0.96 }}
  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
>
\`\`\`

Thumb (inside track):
\`\`\`
<motion.div
  style={{
    position: 'absolute',
    top: pad,
    x: thumbX,
    width: thumb,
    height: thumb,
    borderRadius: '50%',
    background: 'white',
    boxShadow: thumbShadow,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
\`\`\`

SVG face (inside thumb):
\`\`\`
<svg viewBox="-1 -1 2 2" width={faceSize} height={faceSize}>
\`\`\`

### Left eye (AnimatePresence mode="wait")
\`\`\`
<AnimatePresence mode="wait">
  {isOn ? (
    <motion.path
      key="le-happy"
      d="M -0.50,-0.28 Q -0.32,-0.06 -0.14,-0.28"
      stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round" fill="none"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={eyeSpring}
    />
  ) : (
    <motion.g
      key="le-dead"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={eyeSpring}
    >
      <line x1="-0.50" y1="-0.33" x2="-0.14" y2="-0.01"
        stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round" />
      <line x1="-0.14" y1="-0.33" x2="-0.50" y2="-0.01"
        stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round" />
    </motion.g>
  )}
</AnimatePresence>
\`\`\`

### Right eye (AnimatePresence mode="wait")
\`\`\`
<AnimatePresence mode="wait">
  {isOn ? (
    <motion.path
      key="re-happy"
      d="M 0.14,-0.28 Q 0.32,-0.06 0.50,-0.28"
      stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round" fill="none"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={eyeSpring}
    />
  ) : (
    <motion.g
      key="re-dead"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={eyeSpring}
    >
      <line x1="0.14" y1="-0.33" x2="0.50" y2="-0.01"
        stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round" />
      <line x1="0.50" y1="-0.33" x2="0.14" y2="-0.01"
        stroke={FACE_COLOR} strokeWidth={0.13} strokeLinecap="round" />
    </motion.g>
  )}
</AnimatePresence>
\`\`\`

### Mouth
\`\`\`
<motion.path
  d={mouthPath}
  stroke={FACE_COLOR}
  strokeWidth={0.13}
  strokeLinecap="round"
  fill="none"
  transition={{ duration: 0.28, ease: 'easeInOut' }}
/>
\`\`\`

## Behavior
- No icons, no blush circles.
- Font \`font-sans\` (Manrope).
- Responsive via ResizeObserver.
- Dual theme via MutationObserver on \`[data-card-theme]\` and \`document.documentElement\`.`,

  V0: `Create a \`TagaToggle\` component — a playful pill toggle switch where the thumb carries a tiny face that changes expression with the toggle state.

Off: the track is warm grey, the white thumb circle sits on the left, and inside it is a dead face — two × marks for eyes (crossing lines) and a flat straight mouth.

On: click the toggle and the thumb springs to the right (stiffness 500, damping 36), the track cross-fades to warm yellow (#F5C518 light / #D4960A dark), and the face comes alive — the × eyes swap to happy squinted arcs (downward curves) and the flat mouth bends into a big smile.

The face is an SVG drawn inside the thumb (viewBox "-1 -1 2 2"). All strokes use a warm brown (#4A3F35), strokeWidth 0.13, round linecaps. The dead ×× eyes use crossing \`<line>\` pairs; the happy eyes use arc \`<path>\`s with a quadratic curve. The mouth uses the same M+Q path structure in both states so Framer Motion smoothly interpolates the path d-attribute from flat to curved.

Each eye is wrapped in AnimatePresence mode="wait" for a quick cross-fade between dead and happy (scale 0.3→1, 160ms with bouncy ease). The mouth path just animates its d attribute (280ms ease-in-out).

The toggle is responsive: a ResizeObserver scales the track width between 48–80px based on container size. All dimensions (track height, thumb, padding) derive proportionally from the track width.

It adapts to light/dark via MutationObserver on \`document.documentElement\` and the closest \`[data-card-theme]\` ancestor. Background: dark #110F0C, light #EDEAE5. Track off color: dark #4A4540, light #9E9890. Track on color: dark #D4960A, light #F5C518.

Entrance animation: the whole toggle fades and scales in (0.88→1) with a bouncy ease curve. Pressing the track scales it down slightly (whileTap 0.96).

Use Tailwind CSS and Framer Motion (useMotionValue, useTransform, animate). Manrope font. No icons. No blush circles.`,
}
