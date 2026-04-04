import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a minimal iOS-style pill toggle switch component with two states: off (grey) and on (green). No icons, no labels — just the toggle.

Visually: a fully pill-shaped track (80×44px at full size) with a white circular thumb inside. Off state: grey track, thumb on the left. On state: vivid green (#22c55e) track, thumb on the right. Both the track and thumb have subtle shadows for depth.

When clicked, the thumb slides to the opposite side with a snappy spring animation. The track colour transitions smoothly from grey to green (or back) as the thumb moves — not a snap, but a continuous gradient tied to thumb position.

The component is fully responsive: all dimensions scale down proportionally on smaller containers using a ResizeObserver. Minimum track width is 48px.

Built with Next.js App Router, Tailwind CSS, and Framer Motion. Supports both dark and light preview themes.`,

  Bolt: `Build a React component called PillToggle using Framer Motion.

Layout: pill-shaped track centred in a full container (bg #110F0C dark / #EDEAE5 light). No labels or icons.

Responsive sizing via ResizeObserver on the container:
- trackW = clamp(48, round(containerMinDimension * 0.18), 80)
- trackH = round(trackW * 0.55)
- thumb  = round(trackW * 0.45)
- pad    = max(3, round(trackW * 0.05))
- offX = pad, onX = trackW - thumb - pad

Motion:
- thumbX = useMotionValue(offX)
- trackColor = useTransform(thumbX, [offX, onX], [offTrack, '#22c55e'])
- offTrack: dark='#3D3A3A', light='#D1D1D6'

Toggle: await animate(thumbX, target, { type:'spring', stiffness:500, damping:36 })

Resize snap: useEffect(() => { thumbX.set(isOnRef.current ? onX : offX) }, [trackW])

Track: motion.button, backgroundColor=trackColor, borderRadius=trackH/2, inset shadow, whileTap scale 0.96
Thumb: motion.div inside track, top=pad, x=thumbX, white circle, drop shadow
Theme: MutationObserver on [data-card-theme] + document.documentElement.`,

  Lovable: `I'd love a toggle that feels like the cleanest, most satisfying switch you've ever tapped.

Think iOS Settings — that iconic pill toggle that slides with a snap and turns a calm grey into a bright, confident green. No text, no icons, just the shape and the colour doing all the work.

When it's off, the grey pill sits quietly. Click it, and the white thumb glides right with a satisfying spring — not too bouncy, not too stiff — while the track smoothly warms from grey to green as the thumb travels. It feels physical. It feels right.

On mobile it shrinks gracefully — same proportions, smaller size — never looking squished or out of place. The dark version has deep shadows that make the thumb look raised off the surface. The light version is crisp and clean.`,

  'Claude Code': `Create \`components-workspace/pill-toggle/index.tsx\`. Export named function \`PillToggle\`. Add \`'use client'\` at top.

IMPORTS: useState, useCallback, useEffect, useRef (react); motion, useMotionValue, useTransform, animate (framer-motion)

CONSTANTS: MAX_TRACK_W=80, MIN_TRACK_W=48

RESPONSIVE SIZING (derived from trackW state):
- trackH = round(trackW * 0.55)
- thumb  = round(trackW * 0.45)
- pad    = max(3, round(trackW * 0.05))
- offX = pad, onX = trackW - thumb - pad

MOTION: thumbX = useMotionValue(pad)
TRANSFORM: trackColor = useTransform(thumbX, [offX, onX], [offTrack, '#22c55e'])
  offTrack: pageIsDark ? '#3D3A3A' : '#D1D1D6'

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
- motion.div thumb: absolute top=pad x=thumbX w=thumb h=thumb borderRadius 50% white drop-shadow`,

  Cursor: `File: \`components-workspace/pill-toggle/index.tsx\`
Export: \`PillToggle\`, \`'use client'\`
Imports: motion, useMotionValue, useTransform, animate (framer-motion); useState, useCallback, useEffect, useRef (react)

CONSTANTS: MAX_TRACK_W=80, MIN_TRACK_W=48
STATE: isOn, animating, pageIsDark, trackW
REFS: containerRef (root div), isOnRef (stable bool for resize)

DERIVED (from trackW):
- trackH=round(trackW*0.55), thumb=round(trackW*0.45)
- pad=max(3,round(trackW*0.05)), offX=pad, onX=trackW-thumb-pad

MOTION: thumbX=useMotionValue(pad)
TRANSFORM: trackColor=useTransform(thumbX,[offX,onX],[offTrack,'#22c55e'])
  offTrack: dark='#3D3A3A' / light='#D1D1D6'

EFFECTS:
1. Combined theme+resize on containerRef
2. Resize snap: useEffect(()=>{thumbX.set(isOnRef.current?onX:offX)},[trackW])

TOGGLE: await animate(thumbX, target, {type:'spring',stiffness:500,damping:36})

RENDER: motion.button track (backgroundColor=trackColor, whileTap scale:0.96) → motion.div thumb (x=thumbX, white circle)`,
}
