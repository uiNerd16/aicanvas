import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create a React client component named \`GlassMusicPlayer\` — a frosted-glass "Now Playing" card with an animated vinyl disc, RAF-driven progress bar, pagination dots, and full playback controls.

Write this as a single self-contained React client component. Inline everything. Do not extract helper hooks, utility functions, or separate files. 'use client' at the top. No 'any' types.

Background image (absolute inset-0 object-cover opacity-60 pointer-events-none):
\`https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png\`

TRACKS (title, artist, color, duration seconds):
- 'Midnight Drive' / 'Neon Collective' / '#FF6BF5' / 234
- 'Glass Horizons' / 'Aurora Synth' / '#06D6A0' / 198
- 'Warm Signal' / 'Dusk Protocol' / '#FF7B54' / 267

formatTime(s): \`\${Math.floor(s/60)}:\${Math.floor(s%60).toString().padStart(2,'0')}\`.

State: trackIdx, playing, liked, shuffled, elapsed (number). Refs: rafRef (number), startRef, progressRef. progressMV = useMotionValue(0); barWidth = useTransform(progressMV, v => \`\${v*100}%\`). track = TRACKS[trackIdx].

RAF LOOP (useEffect deps [playing, track.duration, progressMV]):
- If !playing → cancelAnimationFrame(rafRef.current); return.
- const SPEED = 15 (demo multiplier).
- startRef.current = performance.now() - progressRef.current * track.duration * (1000/SPEED).
- lastLabelUpdate = 0.
- tick(now): ms = now - startRef; pct = min(ms/(duration*1000/SPEED), 1); progressRef=pct; progressMV.set(pct); if now-lastLabelUpdate > 250 setElapsed(pct*duration) + lastLabelUpdate=now. If pct<1 rafRef = requestAnimationFrame(tick); else setPlaying(false), progressRef=0, progressMV.set(0), setElapsed(0).
- Return () => cancelAnimationFrame(rafRef.current).

skipTo(dir: -1|1): setPlaying(false); progressRef=0; progressMV.set(0); setElapsed(0); setTrackIdx(i => (i+dir+TRACKS.length) % TRACKS.length).

Root: relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950. Background img.

Card motion.div: initial {y:24, scale:0.95} animate {y:0, scale:1} transition {type:'spring', stiffness:200, damping:22}. className "relative isolate w-[320px] overflow-hidden rounded-[32px]". style background 'rgba(12,10,14,0.55)', border '1px solid rgba(255,255,255,0.09)', boxShadow '0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)'. Separate blur layer z-[-1], backdropFilter 'blur(48px) saturate(1.6)'. Top highlight: absolute left-12 right-12 top-0 h-[1px] linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent).

Inside (flex flex-col items-center px-7 pb-7 pt-6):

1) Top bar mb-6 flex justify-between:
   - ArrowLeft size=20 weight="regular" motion.button whileHover {scale:1.15, color:'rgba(255,255,255,0.8)'} whileTap {scale:0.85}, style color 'rgba(255,255,255,0.35)'.
   - "Now Playing" span text-[10px] font-semibold uppercase tracking-[0.18em] color 'rgba(255,255,255,0.4)'.
   - Heart motion.button size=20 weight={liked?'fill':'regular'}, animate color liked?track.color:'rgba(255,255,255,0.35)', transition {duration:0.2}, whileHover {scale:1.15} whileTap {scale:0.85}. onClick toggle liked.

2) Album disc — AnimatePresence mode="wait" key=trackIdx → motion.div initial {opacity:0, scale:0.85} animate {opacity:1, scale:1} exit {opacity:0, scale:0.85} transition {type:'spring', stiffness:260, damping:26} className "relative mb-7".
   Ambient glow div: absolute inset-0 rounded-full, background track.color, opacity 0.18, filter 'blur(28px)', transform 'scale(1.15)'.
   Disc: relative flex h-44 w-44 items-center justify-center rounded-full, style background \`radial-gradient(circle at 38% 35%, \${track.color}28, \${track.color}08 60%, transparent)\`, border \`1.5px solid \${track.color}25\`, boxShadow \`0 0 0 8px rgba(255,255,255,0.03), 0 12px 40px rgba(0,0,0,0.5)\`.
   Inner motion.div animate {rotate: playing ? 360 : 0}, transition {duration:4, repeat:Infinity, ease:'linear'}, className "relative h-28 w-28". Four ring divs at scales [1, 0.78, 0.58, 0.38]: absolute inset-0 rounded-full, transform scale, border \`1px solid \${track.color}\${i===0?'30':i===1?'1e':'14'}\`. Center hole: h-5 w-5 absolute centered, radial-gradient track.color cc→66, boxShadow \`0 0 10px \${track.color}55\`.

3) Track info — AnimatePresence mode="wait" key=trackIdx → motion.div initial {opacity:0, y:10, filter:'blur(4px)'} animate {opacity:1, y:0, filter:'blur(0px)'} exit {opacity:0, y:-10, filter:'blur(4px)'} transition {type:'spring', duration:0.4, bounce:0} className "mb-4 flex flex-col items-center gap-1". <h3 text-lg font-bold tracking-tight text-white/95>{title}</h3> + <p text-[13px] font-medium color rgba(255,255,255,0.38)>{artist}</p>.

4) Pagination dots: mb-5 flex items-center gap-[7px]. Each motion.button animate {width: i===trackIdx?20:5, opacity: i===trackIdx?0.5:0.22, backgroundColor: i===trackIdx?track.color:'#ffffff'} transition {type:'spring', stiffness:400, damping:28} className "h-[5px] cursor-pointer rounded-full" style {minWidth:5}. onClick: reset progress, setTrackIdx(i).

5) Progress bar mb-5 w-full: track div relative h-[3px] w-full overflow-hidden rounded-full, bg 'rgba(255,255,255,0.07)'. Fill motion.div absolute left-0 top-0 h-full rounded-full, style {width:barWidth, background:\`linear-gradient(90deg, \${track.color}70, \${track.color}dd)\`}. Below: flex justify-between — two spans text-[10px] font-medium tabular-nums color 'rgba(255,255,255,0.28)': formatTime(elapsed), formatTime(track.duration).

6) Controls row flex w-full items-center justify-between:
   - Shuffle motion.button size=19 weight="regular" onClick toggle shuffled, animate color shuffled?track.color:'rgba(255,255,255,0.35)' transition {duration:0.2}, whileHover {scale:1.15, color: shuffled?track.color:'rgba(255,255,255,0.75)'} whileTap {scale:0.85}.
   - SkipBack motion.button size=26 weight="fill" onClick skipTo(-1), style color 'rgba(255,255,255,0.65)', whileHover {scale:1.12, color:'rgba(255,255,255,0.95)'} whileTap {scale:0.9}.
   - Play/Pause motion.button h-[52px] w-[52px] rounded-full flex centered, animate {background:\`radial-gradient(circle at 38% 35%, \${track.color}ee, \${track.color}99)\`, boxShadow:\`0 4px 20px \${track.color}55, 0 0 0 1px \${track.color}33\`}, transition {duration:0.3}, whileHover {scale:1.07} whileTap {scale:0.92}. onClick toggle playing. Inside AnimatePresence mode="wait": Pause or Play motion.div key swap initial {scale:0.6, opacity:0} animate {scale:1, opacity:1} exit {scale:0.6, opacity:0} {duration:0.15}. Pause size=22 weight="fill" text-white. Play size=22 weight="fill" ml-0.5 text-white.
   - SkipForward size=26 weight="fill" onClick skipTo(1) (same style as SkipBack).
   - Queue motion.button size=19 weight="regular" style color 'rgba(255,255,255,0.35)', whileHover {scale:1.15, color:'rgba(255,255,255,0.75)'} whileTap {scale:0.85}.

Imports: useState, useEffect, useRef from react; motion, AnimatePresence, useMotionValue, useTransform from framer-motion; Play, Pause, SkipBack, SkipForward, Heart, Shuffle, Queue, ArrowLeft from @phosphor-icons/react.`,

  GPT: `Build a React client component named \`GlassMusicPlayer\`. Single file. TypeScript strict, no \`any\`. 'use client' at top. Do not add feature flags, error boundaries, or prop interfaces. This is a self-contained showcase component with no props. Implement exactly what is specified — no more, no less.

## Data
Background URL: https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png
TRACKS: [
  { title: 'Midnight Drive', artist: 'Neon Collective', color: '#FF6BF5', duration: 234 },
  { title: 'Glass Horizons', artist: 'Aurora Synth',    color: '#06D6A0', duration: 198 },
  { title: 'Warm Signal',    artist: 'Dusk Protocol',   color: '#FF7B54', duration: 267 },
]
formatTime(s): \`\${Math.floor(s/60)}:\${Math.floor(s%60).toString().padStart(2,'0')}\`.

## Glass surface
- Card: w-[320px], rounded-[32px], overflow-hidden, isolate.
- background: rgba(12,10,14,0.55), border: 1px solid rgba(255,255,255,0.09), boxShadow: '0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)'.
- backdrop-filter (separate child z-[-1] rounded-[32px]): blur(48px) saturate(1.6) (+ WebkitBackdropFilter).
- Top highlight: absolute left-12 right-12 top-0 h-[1px] linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent).

## Framer Motion
- Card entrance: initial {y:24, scale:0.95} animate {y:0, scale:1}, {type:'spring', stiffness:200, damping:22}.
- Album disc AnimatePresence mode="wait" key=trackIdx: initial {opacity:0, scale:0.85} animate {opacity:1, scale:1} exit {opacity:0, scale:0.85}, {type:'spring', stiffness:260, damping:26}. Inner vinyl motion.div animate {rotate: playing ? 360 : 0}, {duration:4, repeat:Infinity, ease:'linear'}.
- Track info AnimatePresence mode="wait": initial {opacity:0, y:10, filter:'blur(4px)'} animate {opacity:1, y:0, filter:'blur(0px)'} exit {opacity:0, y:-10, filter:'blur(4px)'}, {type:'spring', duration:0.4, bounce:0}.
- Pagination dots: animate {width, opacity, backgroundColor}, {type:'spring', stiffness:400, damping:28}.
- Play/Pause button: animate {background, boxShadow}, {duration:0.3}. Icon swap AnimatePresence mode="wait" initial {scale:0.6, opacity:0} animate {scale:1, opacity:1} exit {scale:0.6, opacity:0}, {duration:0.15}.
- Heart/Shuffle: animate {color}, {duration:0.2}.
- Progress bar: motion.div style={{width: barWidth, background: linear-gradient(90deg, \${track.color}70, \${track.color}dd)}}. progressMV = useMotionValue(0); barWidth = useTransform(progressMV, v => \`\${v*100}%\`).

## RAF progress
useEffect([playing, track.duration, progressMV]): if !playing cancelAnimationFrame and return. SPEED=15. startRef = performance.now() - progressRef.current * track.duration * (1000/SPEED). tick(now): ms = now - startRef.current; pct = Math.min(ms/(track.duration*(1000/SPEED)),1); progressRef.current=pct; progressMV.set(pct); if(now-lastLabelUpdate > 250) setElapsed(pct*track.duration), lastLabelUpdate=now. If pct<1 rafRef=requestAnimationFrame(tick); else setPlaying(false), progressRef.current=0, progressMV.set(0), setElapsed(0). Cleanup cancelAnimationFrame.

skipTo(dir): setPlaying(false); progressRef.current=0; progressMV.set(0); setElapsed(0); setTrackIdx(i => (i+dir+TRACKS.length)%TRACKS.length).

## Hover state
- Heart/Shuffle/Queue/ArrowLeft: whileHover {scale:1.15, color:'rgba(255,255,255,0.75 or 0.8)'} whileTap {scale:0.85}.
- SkipBack/SkipForward: whileHover {scale:1.12, color:'rgba(255,255,255,0.95)'} whileTap {scale:0.9}.
- Play button: whileHover {scale:1.07} whileTap {scale:0.92}.

## JSX structure
Root (relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950) → background img → Card motion.div → blur layer → top highlight → content col (flex flex-col items-center px-7 pb-7 pt-6):
1) Top bar (mb-6 flex w-full justify-between): ArrowLeft (left, white/35), "Now Playing" uppercase (text-[10px] tracking-[0.18em] color rgba(255,255,255,0.4)), Heart (right, toggles liked).
2) Album disc block (AnimatePresence mode="wait"): ambient glow (absolute inset-0 rounded-full bg track.color opacity 0.18 filter blur(28px) transform scale(1.15)). Outer disc (h-44 w-44 rounded-full, radial-gradient track.color28→08→transparent, border 1.5px \`\${track.color}25\`, boxShadow \`0 0 0 8px rgba(255,255,255,0.03), 0 12px 40px rgba(0,0,0,0.5)\`). Inner vinyl (h-28 w-28 relative): 4 ring divs at scales [1, 0.78, 0.58, 0.38] with border \`1px solid \${track.color}\${['30','1e','14','14'][i]}\`; center hole h-5 w-5 radial-gradient \`\${track.color}cc\`→\`\${track.color}66\` boxShadow \`0 0 10px \${track.color}55\`.
3) Track info AnimatePresence (mb-4): h3 text-lg font-bold text-white/95 + p text-[13px] color rgba(255,255,255,0.38).
4) Pagination dots (mb-5 gap-[7px]): 3 motion.button h-[5px] rounded-full, minWidth 5. Active: width 20, opacity 0.5, bg track.color. Inactive: width 5, opacity 0.22, bg #ffffff.
5) Progress (mb-5 w-full): track div h-[3px] bg rgba(255,255,255,0.07); fill motion.div width=barWidth gradient \`\${track.color}70→\${track.color}dd\`. Timestamps below: formatTime(elapsed) / formatTime(track.duration), text-[10px] tabular-nums color rgba(255,255,255,0.28).
6) Controls (flex justify-between): Shuffle 19 · SkipBack 26 fill · Play 52×52 circle · SkipForward 26 fill · Queue 19.

Icons from @phosphor-icons/react (weight="regular" unless marked fill): ArrowLeft, Heart, Shuffle, SkipBack, SkipForward, Play, Pause, Queue. Heart uses weight={liked?'fill':'regular'}. Play/Pause/Skip use weight="fill".`,

  Gemini: `Implement a React client component named \`GlassMusicPlayer\` as a single TypeScript file. Implement the complete component in one response. Do not abbreviate any section.

## Required imports (use these exact names, no substitutions)
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Heart, Shuffle, Queue, ArrowLeft } from '@phosphor-icons/react'

## API guardrails
USE these hooks and no others. DO NOT invent \`useAudio\`, \`useInterval\`, \`useRaf\`, \`useSpringValue\`, or helpers not shown. Call \`useMotionValue()\` and \`useTransform()\` at the top of the component function only — never inline inside JSX. Use \`requestAnimationFrame\` / \`cancelAnimationFrame\` directly (no lodash, no external lib). Phosphor icons: Play, Pause, SkipBack, SkipForward, Heart, Shuffle, Queue, ArrowLeft — spell them exactly.

## Constants (module scope)
const TRACKS = [
  { title: 'Midnight Drive', artist: 'Neon Collective', color: '#FF6BF5', duration: 234 },
  { title: 'Glass Horizons', artist: 'Aurora Synth',    color: '#06D6A0', duration: 198 },
  { title: 'Warm Signal',    artist: 'Dusk Protocol',   color: '#FF7B54', duration: 267 },
]
function formatTime(s: number) { const m=Math.floor(s/60); const sec=Math.floor(s%60); return \`\${m}:\${sec.toString().padStart(2,'0')}\` }
const BACKGROUND = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png'

## State + refs (top of function)
const [trackIdx, setTrackIdx] = useState(0)
const [playing, setPlaying] = useState(false)
const [liked, setLiked] = useState(false)
const [shuffled, setShuffled] = useState(false)
const [elapsed, setElapsed] = useState(0)
const rafRef = useRef<number>(0)
const startRef = useRef(0)
const progressRef = useRef(0)
const progressMV = useMotionValue(0)
const barWidth = useTransform(progressMV, v => \`\${v * 100}%\`)
const track = TRACKS[trackIdx]

## RAF effect
useEffect(() => {
  if (!playing) { cancelAnimationFrame(rafRef.current); return }
  const SPEED = 15
  startRef.current = performance.now() - progressRef.current * track.duration * (1000 / SPEED)
  let lastLabelUpdate = 0
  const tick = (now: number) => {
    const ms = now - startRef.current
    const pct = Math.min(ms / (track.duration * (1000 / SPEED)), 1)
    progressRef.current = pct
    progressMV.set(pct)
    if (now - lastLabelUpdate > 250) { setElapsed(pct * track.duration); lastLabelUpdate = now }
    if (pct < 1) rafRef.current = requestAnimationFrame(tick)
    else { setPlaying(false); progressRef.current = 0; progressMV.set(0); setElapsed(0) }
  }
  rafRef.current = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(rafRef.current)
}, [playing, track.duration, progressMV])

## skipTo
const skipTo = (dir: -1 | 1) => { setPlaying(false); progressRef.current=0; progressMV.set(0); setElapsed(0); setTrackIdx(i => (i + dir + TRACKS.length) % TRACKS.length) }

## Layout
Root: <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950">
  <img src={BACKGROUND} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />
  Card: <motion.div initial={{y:24,scale:0.95}} animate={{y:0,scale:1}} transition={{type:'spring',stiffness:200,damping:22}} className="relative isolate w-[320px] overflow-hidden rounded-[32px]" style={{background:'rgba(12,10,14,0.55)', border:'1px solid rgba(255,255,255,0.09)', boxShadow:'0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)'}}>
    Blur layer <div className="pointer-events-none absolute inset-0 z-[-1] rounded-[32px]" style={{backdropFilter:'blur(48px) saturate(1.6)', WebkitBackdropFilter:'blur(48px) saturate(1.6)'}} />
    Top highlight (absolute left-12 right-12 top-0 h-[1px], linear-gradient 90deg transparent→rgba(255,255,255,0.18)→transparent)
    Content <div className="flex flex-col items-center px-7 pb-7 pt-6">
      (1) Top bar — mb-6 flex w-full items-center justify-between.
      (2) Album disc — wrap in <AnimatePresence mode="wait"><motion.div key={trackIdx} initial={{opacity:0,scale:0.85}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.85}} transition={{type:'spring',stiffness:260,damping:26}} className="relative mb-7">. Ambient glow + 176px disc + rotating vinyl with 4 rings + center hole (see Claude lane for all exact styles — reproduce them exactly).
      (3) Track info AnimatePresence mode="wait" with blur/y exit.
      (4) Pagination dots row (3 dots).
      (5) Progress bar + timestamps.
      (6) Controls row.

## Hover state
See spec in other lanes — whileHover scale 1.07–1.15, whileTap scale 0.82–0.92. Heart weight toggles fill/regular.

Named export \`GlassMusicPlayer\`, no props. No \`any\`. Always dark.`,

  V0: `Create a GlassMusicPlayer component — a polished dark frosted-glass "Now Playing" card floating over an ethereal orange flower background photo (opacity 60).

The card is 320px wide, rounded-[32px], with a very dark translucent fill (rgba 12,10,14,0.55), a subtle 1px white border, a deep 24px drop shadow with inset top highlight, and a heavy 48px backdrop blur at 1.6 saturation. A thin gradient highlight line runs across the top edge.

Layout top to bottom:
- Top bar: back arrow (left, muted), "NOW PLAYING" uppercase label (center, text-[10px], tracking-[0.18em], white/40), heart/like toggle (right — fills and colors to the current track's accent when liked).
- Large circular album art (176×176) with a soft colored ambient glow behind it (the track's color at 18% opacity, blurred ~28px). Inside a radial-gradient disc is a rotating vinyl made of 4 concentric thin rings (scales 1, 0.78, 0.58, 0.38) and a glowing center dot. The vinyl spins 360° continuously (4s linear) while playing.
- Track title (bold, white/95) and artist (white/38). Transitions between tracks with a blur-fade slide.
- 3 pagination dots (pill-shaped). Active dot stretches to 20px wide and takes the track color at 50% opacity; inactive dots are 5px white at 22%.
- Thin 3px progress track (white/7 background) with a gradient fill (track.color 70→dd). Timestamps below: elapsed/total in tabular-nums.
- Control row: Shuffle (toggleable, tints to track color), SkipBack, a 52×52 circular Play/Pause button with a radial-gradient fill in the track's color plus a glow shadow, SkipForward, Queue.

3 tracks cycle: "Midnight Drive" by Neon Collective (#FF6BF5, 3:54), "Glass Horizons" by Aurora Synth (#06D6A0, 3:18), "Warm Signal" by Dusk Protocol (#FF7B54, 4:27). Each track's color themes the disc rings, glow, progress fill, play button, active dot, and liked heart.

The progress bar should be driven by a Framer Motion useMotionValue (set inside a requestAnimationFrame loop) so the bar animates at 60fps without causing React re-renders — only update the numeric elapsed label at ~4fps. Use a demo speed multiplier so a full track completes quickly. Skipping tracks resets progress.

Use Tailwind CSS, Framer Motion, and Phosphor Icons (weight='regular'): ArrowLeft, Heart, Shuffle, SkipBack, SkipForward, Play, Pause, Queue (Play/Pause/Skip use weight='fill').`,
}
