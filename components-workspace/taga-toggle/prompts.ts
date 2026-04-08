import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create \`components-workspace/taga-toggle/index.tsx\`. Export named function \`TagaToggle\`. Add \`'use client'\` at top.

IMPORTS: useState, useCallback, useEffect, useRef (react); motion, AnimatePresence, useMotionValue, useTransform, animate (framer-motion)

CONSTANTS: MAX_TRACK_W=80, MIN_TRACK_W=48, FACE_COLOR='#4A3F35'

SIZING (from trackW state):
- trackH=round(trackW*0.58), thumb=round(trackW*0.50)
- pad=max(3,round(trackW*0.04)), offX=pad, onX=trackW-thumb-pad
- faceSize=thumb*0.78

MOTION: thumbX=useMotionValue(offX)
COLOURS: offTrack dark='#4A4540'/light='#9E9890', onTrack dark='#D4960A'/light='#F5C518'
trackColor=useTransform(thumbX,[offX,onX],[offTrack,onTrack])

COMBINED useEffect: MutationObserver([data-card-theme]/documentElement)→setPageIsDark + ResizeObserver→setTrackW
RESIZE SNAP: useEffect(()=>{thumbX.set(isOnRef.current?onX:offX)},[trackW])
TOGGLE: await animate(thumbX,target,{type:'spring',stiffness:500,damping:36})

MOUTH PATH (both M+Q for interpolation):
- off: 'M -0.40,0.30 Q 0,0.30 0.40,0.30'
- on:  'M -0.40,0.15 Q 0,0.50 0.40,0.15'

RENDER:
- motion.button track (backgroundColor=trackColor, whileTap scale:0.96)
- motion.div thumb (x=thumbX, white circle, flex center)
- SVG viewBox="-1 -1 2 2" width/height=faceSize:

  AnimatePresence (blush, isOn only):
    motion.ellipse key="blush-l" cx=-0.42 cy=0.20 rx=0.19 ry=0.12 fill=#FFB3BA opacity 0→0.65 scale 0→1 delay:0.12
    motion.ellipse key="blush-r" cx=+0.42 same

  AnimatePresence mode="wait" (left eye):
    isOn: motion.path d="M -0.50,-0.28 Q -0.32,-0.06 -0.14,-0.28" initial/exit scale:0.3 opacity:0
    !isOn: motion.g — line (-0.50,-0.33)→(-0.14,-0.01) + line (-0.14,-0.33)→(-0.50,-0.01)

  AnimatePresence mode="wait" (right eye):
    isOn: motion.path d="M 0.14,-0.28 Q 0.32,-0.06 0.50,-0.28" initial/exit scale:0.3 opacity:0
    !isOn: motion.g — line (0.14,-0.33)→(0.50,-0.01) + line (0.50,-0.33)→(0.14,-0.01)

  motion.path mouth (animated d, duration:0.28 ease:easeInOut)

All strokes: FACE_COLOR, strokeWidth:0.13, strokeLinecap:round`,

  V0: `Create a playful iOS-style pill toggle called Taga Toggle. The thumb carries an expressive face that changes with the toggle state.

Off state: warm grey track, dead face on thumb (×× eyes made of crossing lines, flat mouth, no blush).
On state: warm yellow track (#F5C518 light / #D4960A dark), happy face (arc squint eyes, big curved smile, soft pink blush cheeks).

The face is drawn as SVG inside the white thumb circle (viewBox "-1 -1 2 2"):
- Dead eyes: two crossing lines per eye at positions (±0.32, -0.17)
- Happy eyes: downward-opening arcs: left "M -0.50,-0.28 Q -0.32,-0.06 -0.14,-0.28", right "M 0.14,-0.28 Q 0.32,-0.06 0.50,-0.28"
- Mouth off (straight): "M -0.40,0.30 Q 0,0.30 0.40,0.30"
- Mouth on (smile): "M -0.40,0.15 Q 0,0.50 0.40,0.15" — same M+Q structure enables smooth Framer Motion path interpolation
- Blush: two ellipses at (±0.42, 0.20), fill #FFB3BA at 65% opacity, fade in on "on" state

Track: 80×46px max. Thumb: 50% of track width.
Spring: stiffness 500, damping 36. Track colour transitions via useTransform(thumbX).
Responsive via ResizeObserver. Dual theme via MutationObserver on [data-card-theme].`,
}
