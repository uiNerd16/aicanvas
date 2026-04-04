import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a minimal iOS-style pill toggle with earth and sand tones. No labels — just the toggle.

Visually: a fully pill-shaped track (80×44px at full size) with a white circular thumb inside. Off state: warm sand/clay track (#B09478 light / #8C7B6B dark), thumb has a small bold X icon. On state: earthy moss/olive track (#6B8040 light / #4A5935 dark), thumb has a small bold ✓ icon. Both track and thumb have subtle shadows for depth.

When clicked, the thumb slides to the opposite side with a snappy spring animation. The track colour transitions smoothly as the thumb moves. The icon on the thumb morphs: the X spins/scales out while the ✓ spins/scales in (AnimatePresence mode="wait", spring ease).

Fully responsive: all dimensions scale down on smaller containers via ResizeObserver. Minimum track width 48px.

Built with Next.js App Router, Tailwind CSS, and Framer Motion. Supports both dark and light preview themes.`,

  Bolt: `Build a React component called MarkToggle using Framer Motion and @phosphor-icons/react.

Layout: pill-shaped track centred in a full container (bg #110F0C dark / #EDEAE5 light). No labels.

Responsive sizing via ResizeObserver on the container:
- trackW = clamp(48, round(containerMinDimension * 0.18), 80)
- trackH = round(trackW * 0.55)
- thumb  = round(trackW * 0.45)
- pad    = max(3, round(trackW * 0.05))
- offX = pad, onX = trackW - thumb - pad
- iconSize = round(thumb * 0.50)

Colours:
- offTrack: dark='#8C7B6B', light='#B09478'
- onTrack:  dark='#4A5935', light='#6B8040'

Motion:
- thumbX = useMotionValue(offX)
- trackColor = useTransform(thumbX, [offX, onX], [offTrack, onTrack])
- Toggle: await animate(thumbX, target, { type:'spring', stiffness:500, damping:36 })

Icon morph (AnimatePresence mode="wait"):
- Off → On: X exits (scale:0, rotate:-45) / Check enters (scale:1, rotate:0)
- On → Off: Check exits (scale:0, rotate:45) / X enters (scale:1, rotate:0)
- duration: 0.18s, ease: [0.34,1.56,0.64,1]
- Icon color = current track color (iconColor = isOn ? onTrack : offTrack)
- Icons: X and Check from @phosphor-icons/react, weight="bold"

Track: motion.button, backgroundColor=trackColor, borderRadius=trackH/2, inset shadow, whileTap scale:0.96
Thumb: motion.div inside track, top=pad, x=thumbX, white circle, drop shadow, flex center
Theme: MutationObserver on [data-card-theme] + document.documentElement`,

  Lovable: `I want a toggle that feels warm and grounded — like touching wood and stone.

Instead of the typical grey-to-green switch, this one lives in earth tones. When it's off, the pill is a warm sandy clay. When it's on, it deepens into a rich mossy earth. The white thumb carries a tiny icon: an X when off, a checkmark when on.

The magic is in the morph — when you click, the X doesn't just disappear. It spins and shrinks away while the checkmark spins and grows into place, all in the split second the thumb is sliding across. It feels alive.

Same satisfying spring snap as an iOS toggle. Scales gracefully on mobile. Works beautifully in both dark (deep charcoal background) and light (warm cream background) themes — the earth tones look rich against either.`,

  'Claude Code': `Create \`components-workspace/mark-toggle/index.tsx\`. Export named function \`MarkToggle\`. Add \`'use client'\` at top.

IMPORTS: useState, useCallback, useEffect, useRef (react); motion, AnimatePresence, useMotionValue, useTransform, animate (framer-motion); X, Check from @phosphor-icons/react

CONSTANTS: MAX_TRACK_W=80, MIN_TRACK_W=48

RESPONSIVE SIZING (derived from trackW state):
- trackH = round(trackW * 0.55)
- thumb  = round(trackW * 0.45)
- pad    = max(3, round(trackW * 0.05))
- offX = pad, onX = trackW - thumb - pad
- iconSize = round(thumb * 0.50)

MOTION: thumbX = useMotionValue(pad)
COLOURS:
- offTrack: dark='#8C7B6B', light='#B09478'
- onTrack:  dark='#4A5935', light='#6B8040'
- trackColor = useTransform(thumbX, [offX, onX], [offTrack, onTrack])
- iconColor = isOn ? onTrack : offTrack

COMBINED useEffect (theme + resize on containerRef):
- MutationObserver for [data-card-theme]/documentElement → setPageIsDark
- ResizeObserver: setTrackW(clamp(48, round(min(w,h)*0.18), 80))

RESIZE SNAP: useEffect(() => { thumbX.set(isOnRef.current ? onX : offX) }, [trackW])

TOGGLE (async, animating guard):
1. isOnRef.current = !isOn; setIsOn(v=>!v)
2. await animate(thumbX, isOn ? offX : onX, {type:'spring', stiffness:500, damping:36})

RENDER:
- motion.div entrance: scale 0.88→1, opacity 0→1, ease [0.34,1.56,0.64,1]
- motion.button track: w=trackW h=trackH borderRadius=trackH/2 backgroundColor=trackColor inset-shadow whileTap scale:0.96
- motion.div thumb: absolute top=pad x=thumbX, white circle drop-shadow, flex center overflow:hidden
- AnimatePresence mode="wait" inside thumb:
  - key="check" when isOn: initial{scale:0,rotate:-45,opacity:0} animate{scale:1,rotate:0,opacity:1} exit{scale:0,rotate:45,opacity:0}
  - key="x-icon" when !isOn: initial{scale:0,rotate:45,opacity:0} animate{scale:1,rotate:0,opacity:1} exit{scale:0,rotate:-45,opacity:0}
  - Both: duration 0.18, ease [0.34,1.56,0.64,1]
  - <Check size={iconSize} weight="bold" color={iconColor} /> and <X size={iconSize} weight="bold" color={iconColor} />`,

  Cursor: `File: \`components-workspace/mark-toggle/index.tsx\`
Export: \`MarkToggle\`, \`'use client'\`
Imports: motion, AnimatePresence, useMotionValue, useTransform, animate (framer-motion); useState, useCallback, useEffect, useRef (react); X, Check (@phosphor-icons/react)

CONSTANTS: MAX_TRACK_W=80, MIN_TRACK_W=48
STATE: isOn, animating, pageIsDark, trackW
REFS: containerRef (root div), isOnRef (stable bool for resize)

DERIVED (from trackW):
- trackH=round(trackW*0.55), thumb=round(trackW*0.45)
- pad=max(3,round(trackW*0.05)), offX=pad, onX=trackW-thumb-pad
- iconSize=round(thumb*0.50)

COLOURS:
- offTrack: dark='#8C7B6B' / light='#B09478'
- onTrack:  dark='#4A5935' / light='#6B8040'
- trackColor=useTransform(thumbX,[offX,onX],[offTrack,onTrack])
- iconColor = isOn ? onTrack : offTrack

EFFECTS:
1. Combined theme+resize on containerRef
2. Resize snap: useEffect(()=>{thumbX.set(isOnRef.current?onX:offX)},[trackW])

TOGGLE: await animate(thumbX, target, {type:'spring',stiffness:500,damping:36})

RENDER:
- motion.button track (backgroundColor=trackColor, whileTap scale:0.96)
- motion.div thumb (x=thumbX, white circle, flex center, overflow:hidden)
- AnimatePresence mode="wait":
  - isOn → key="check": X icon exits with rotate:-45/scale:0, Check enters rotate:0/scale:1
  - !isOn → key="x-icon": Check exits with rotate:45/scale:0, X enters rotate:0/scale:1
  - transition: duration:0.18, ease:[0.34,1.56,0.64,1]`,
}
