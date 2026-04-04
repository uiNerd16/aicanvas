import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
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

  Bolt: `Build a React component called TagaToggle using Framer Motion.

Layout: pill track centred in a full container (bg #110F0C dark / #EDEAE5 light).

Responsive sizing via ResizeObserver:
- trackW = clamp(48, round(containerMinDimension * 0.18), 80)
- trackH = round(trackW * 0.58), thumb = round(trackW * 0.50)
- pad = max(3, round(trackW * 0.04)), offX = pad, onX = trackW - thumb - pad
- faceSize = thumb * 0.78

Colours:
- offTrack: dark='#4A4540', light='#9E9890'
- onTrack:  dark='#D4960A', light='#F5C518'
- trackColor = useTransform(thumbX, [offX, onX], [offTrack, onTrack])
- FACE_COLOR = '#4A3F35' (constant, always dark on white)

Toggle: await animate(thumbX, target, { type:'spring', stiffness:500, damping:36 })

Face SVG (viewBox="-1 -1 2 2", width=faceSize, height=faceSize) inside thumb (flex center):

Blush (AnimatePresence, visible when isOn):
- motion.ellipse at cx=±0.42 cy=0.20 rx=0.19 ry=0.12, fill='#FFB3BA', opacity 0→0.65, scale 0→1, delay 0.12s

Left eye (AnimatePresence mode="wait"):
- isOn: motion.path d="M -0.50,-0.28 Q -0.32,-0.06 -0.14,-0.28" stroke fill=none, scale 0.3→1
- !isOn: motion.g with two crossing lines (x1="-0.50" y1="-0.33" x2="-0.14" y2="-0.01" and x1="-0.14" y1="-0.33" x2="-0.50" y2="-0.01"), scale 0.3→1

Right eye (AnimatePresence mode="wait"):
- isOn: motion.path d="M 0.14,-0.28 Q 0.32,-0.06 0.50,-0.28", scale 0.3→1
- !isOn: motion.g with two crossing lines (x1="0.14" y1="-0.33" x2="0.50" y2="-0.01" and x1="0.50" y1="-0.33" x2="0.14" y2="-0.01"), scale 0.3→1

Mouth (motion.path, animated d):
- off: d="M -0.40,0.30 Q 0,0.30 0.40,0.30"
- on:  d="M -0.40,0.15 Q 0,0.50 0.40,0.15"
- transition: duration 0.28, ease 'easeInOut'

All stroke: FACE_COLOR, strokeWidth 0.13, strokeLinecap round`,

  Lovable: `I want a toggle that makes people smile the moment they interact with it.

The pill toggle has a face living inside the white thumb circle. When it's off — grey track — the face is defeated: two ×× eyes and a flat, expressionless mouth. Like a crashed app icon. There's something gently funny about it.

Then you click. The thumb slides across as the grey track warms into a rich cheerful yellow. And as it arrives, the dead ×× eyes transform into squinting happy arcs, the flat line curves upward into a big smile, and two soft pink blush ovals appear on the cheeks. The whole face comes alive.

The transitions are quick but intentional — eyes snap in with a little spring bounce, the mouth curves smoothly, the blush fades in last with a slight delay, like the face is blushing with joy.

It shrinks gracefully on mobile while keeping the face perfectly readable. Works in both dark and light themes.`,

  'Claude Code': `Create \`components-workspace/taga-toggle/index.tsx\`. Export named function \`TagaToggle\`. Add \`'use client'\` at top.

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

  Cursor: `File: \`components-workspace/taga-toggle/index.tsx\`
Export: \`TagaToggle\`, \`'use client'\`
Imports: motion, AnimatePresence, useMotionValue, useTransform, animate (framer-motion); useState, useCallback, useEffect, useRef (react)

CONSTANTS: MAX_TRACK_W=80, MIN_TRACK_W=48, FACE_COLOR='#4A3F35'
STATE: isOn, animating, pageIsDark, trackW | REFS: containerRef, isOnRef

SIZING: trackH=round(trackW*0.58), thumb=round(trackW*0.50), pad=max(3,round(trackW*0.04))
offX=pad, onX=trackW-thumb-pad, faceSize=thumb*0.78

COLOURS:
- offTrack dark='#4A4540'/light='#9E9890', onTrack dark='#D4960A'/light='#F5C518'
- trackColor=useTransform(thumbX,[offX,onX],[offTrack,onTrack])

EFFECTS: combined theme+resize | resize snap
TOGGLE: spring stiffness:500 damping:36

SVG FACE (viewBox="-1 -1 2 2", all strokes FACE_COLOR strokeWidth:0.13 strokeLinecap:round):

Blush (AnimatePresence, isOn only):
  motion.ellipse ±0.42,0.20 rx:0.19 ry:0.12 fill:#FFB3BA → opacity 0→0.65, delay:0.12

Left eye (AnimatePresence mode="wait"):
  on  → motion.path d="M -0.50,-0.28 Q -0.32,-0.06 -0.14,-0.28", scale 0.3→1
  off → motion.g: line(-0.50,-0.33 to -0.14,-0.01) + line(-0.14,-0.33 to -0.50,-0.01)

Right eye (AnimatePresence mode="wait"):
  on  → motion.path d="M 0.14,-0.28 Q 0.32,-0.06 0.50,-0.28", scale 0.3→1
  off → motion.g: line(0.14,-0.33 to 0.50,-0.01) + line(0.50,-0.33 to 0.14,-0.01)

Mouth (motion.path animated d):
  off='M -0.40,0.30 Q 0,0.30 0.40,0.30' → on='M -0.40,0.15 Q 0,0.50 0.40,0.15'
  transition: duration:0.28 ease:'easeInOut'`,
}
