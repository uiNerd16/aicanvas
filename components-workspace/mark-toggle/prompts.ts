import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/mark-toggle/index.tsx\`. Export named function \`MarkToggle\`. Add \`'use client'\` at top.

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

  V0: `Create a minimal iOS-style pill toggle with earth and sand tones. No labels — just the toggle.

Visually: a fully pill-shaped track (80×44px at full size) with a white circular thumb inside. Off state: warm sand/clay track (#B09478 light / #8C7B6B dark), thumb has a small bold X icon. On state: earthy moss/olive track (#6B8040 light / #4A5935 dark), thumb has a small bold ✓ icon. Both track and thumb have subtle shadows for depth.

When clicked, the thumb slides to the opposite side with a snappy spring animation. The track colour transitions smoothly as the thumb moves. The icon on the thumb morphs: the X spins/scales out while the ✓ spins/scales in (AnimatePresence mode="wait", spring ease).

Fully responsive: all dimensions scale down on smaller containers via ResizeObserver. Minimum track width 48px.

Built with Next.js App Router, Tailwind CSS, and Framer Motion. Supports both dark and light preview themes.`,
}
