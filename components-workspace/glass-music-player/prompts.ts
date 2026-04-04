import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Record<Platform, string> = {
  V0: `Create a "Glass Music Player" component — a polished dark glass card with a Now Playing header, circular vinyl disc art, track pagination dots, progress bar, and a full playback control row.

Layout (top to bottom):
- Top bar: back arrow (left) · "NOW PLAYING" uppercase label (center) · heart/like toggle (right)
- Large circular album art (176×176px) with ambient color glow behind it. Inside: animated concentric rings that spin when playing, glowing center dot
- Track title (bold, white/95) + artist name (muted white/38), with blur-fade transition between tracks
- Pagination dots: 3 pill-shaped dots — active one stretches wider (20px) and takes the track's accent color at 50% opacity
- Progress bar: 3px thin track, gradient fill matching track color, timestamps below
- Control row: Shuffle · SkipBack · Play/Pause (52px circle with radial gradient) · SkipForward · Queue

3 tracks cycling: "Midnight Drive" (#FF6BF5), "Glass Horizons" (#06D6A0), "Warm Signal" (#FF7B54). Each track colors the accent, glow, disc rings, play button, and progress fill.

Progress uses useMotionValue for zero-React-render animation. Background: floral image with 60% opacity over dark base. Card: rgba(12,10,14,0.55) with 48px blur, rounded-[32px].`,

  Bolt: `Build a GlassMusicPlayer component:

TRACKS:
\`\`\`
const TRACKS = [
  { title: 'Midnight Drive',  artist: 'Neon Collective', color: '#FF6BF5', duration: 234 },
  { title: 'Glass Horizons',  artist: 'Aurora Synth',    color: '#06D6A0', duration: 198 },
  { title: 'Warm Signal',     artist: 'Dusk Protocol',   color: '#FF7B54', duration: 267 },
]
\`\`\`

CARD STYLE: w-320px, rounded-[32px], background rgba(12,10,14,0.55), backdropFilter blur(48px) saturate(1.6), border rgba(255,255,255,0.09)

TOP BAR: ArrowLeft icon (left) · "NOW PLAYING" text-[10px] uppercase tracking-[0.18em] (center) · Heart icon toggle with liked state (right)

ALBUM ART:
- 176×176px circle with radial gradient from track.color+'28'
- Ambient glow div: track.color bg, 18% opacity, blur(28px), scale(1.15)
- 4 concentric ring divs inside at scales [1, 0.78, 0.58, 0.38] with track.color borders
- Center dot 20×20px with radial gradient in track.color
- Spin animation on rings when playing: rotate 360, duration 4s, repeat Infinity, ease linear
- AnimatePresence mode="wait" on track change, spring scale 0.85→1

TRACK INFO: AnimatePresence mode="wait", blur(4px) fade in/out on track change

PAGINATION DOTS: 3 motion.button pills, active: width 20px, opacity 0.5, track.color. Inactive: width 5px, opacity 0.22, white. Spring stiffness 400 damping 28.

PROGRESS: useMotionValue + useTransform for bar width (zero re-renders). setElapsed every 250ms for timestamps. SPEED constant multiplies playback for demo.

CONTROLS ROW (full width justified):
- Shuffle (Shuffle icon, toggles track.color)
- SkipBack (26px, fill weight, white/65)
- Play/Pause button: 52px circle, radial-gradient track.color, AnimatePresence icon swap with scale 0.6→1
- SkipForward (26px, fill weight, white/65)
- Queue icon (19px, white/35)

State: trackIdx, playing, liked, shuffled, elapsed. useMotionValue progressMV. RAF loop with SPEED multiplier.`,

  Lovable: `Build a beautiful glass music player card with these features:

A dark frosted-glass card floating over a floral background image. The card has:

**Header**: A back arrow on the left, "Now Playing" label centered, and a heart/like button on the right that glows with the current track's color when liked.

**Album art**: A large circle (about 176px) with a soft ambient glow behind it that matches the track's color. Inside, concentric rings slowly spin when music is playing. The center has a glowing dot.

**Track info**: Song title in bold white, artist name in muted gray. When switching tracks, the text smoothly blurs and slides in.

**Three pagination dots** below the track info — the active one is wider and takes the track's accent color. Clicking a dot jumps to that track.

**Progress bar**: Very thin (3px), gradient fill in the track's color. Timestamps on each side. Progress animates smoothly using motion values (no jank).

**Controls**: Shuffle icon · Previous · Play/Pause button (big circle with gradient) · Next · Queue icon. All spaced evenly. Shuffle and heart toggle between muted and the track color.

Three tracks cycle: a purple one, a teal one, and an orange one. Each changes the color theme of the entire card — glow, disc, button, progress bar.

Make it feel premium — dark, atmospheric, smooth.`,

  'Claude Code': `Create components-workspace/glass-music-player/index.tsx:

\`\`\`
'use client'
export function GlassMusicPlayer()
\`\`\`

STATE: trackIdx, playing, liked, shuffled, elapsed(number). Refs: rafRef, startRef, progressRef.
MOTION: useMotionValue(0) → progressMV; useTransform(progressMV, v => v*100+'%') → barWidth

TRACKS: 3 entries with title/artist/color/duration. Colors: #FF6BF5, #06D6A0, #FF7B54.

RAF LOOP (inside useEffect on [playing, track.duration, progressMV]):
- const SPEED = 15 (demo speed multiplier)
- startRef = now - progressRef * duration * (1000/SPEED)
- tick(now): pct = ms / (duration * 1000/SPEED)
- progressMV.set(pct) — no setState
- if now - lastLabelUpdate > 250: setElapsed(pct * duration)
- on complete: setPlaying(false), progressMV.set(0), setElapsed(0)

LAYOUT inside dark glass card (rgba(12,10,14,0.55), blur 48px, rounded-[32px], w-320px):

1. Top bar flex justify-between:
   - ArrowLeft size=20 white/35
   - "NOW PLAYING" text-[10px] uppercase tracking-[0.18em] white/40
   - Heart size=20, animate color: liked→track.color else white/35, weight fill when liked

2. Album disc AnimatePresence mode="wait" key=trackIdx:
   - Outer wrapper: relative, ambient glow div (track.color bg, opacity 0.18, blur 28px, scale 1.15)
   - Circle div h-44 w-44: radial-gradient from track.color+'28', border track.color+'25'
   - Inside: motion.div animate rotate 360 when playing (duration 4, repeat Infinity, linear)
   - 4 ring divs at scales [1, 0.78, 0.58, 0.38] with track.color borders
   - Center dot h-5 w-5: radial-gradient track.color+cc to track.color+66

3. Track info AnimatePresence mode="wait": blur(4px)+y slide, spring 0.4s bounce 0

4. Pagination dots: 3 motion.button, animate width/opacity/backgroundColor, spring 400/28
   - Active: width 20, opacity 0.5, track.color
   - Inactive: width 5, opacity 0.22, #ffffff
   - onClick: reset progress, setTrackIdx

5. Progress bar:
   - div h-[3px] overflow-hidden bg rgba(255,255,255,0.07)
   - motion.div style={{ width: barWidth, background: gradient track.color }}
   - timestamps: formatTime(elapsed) and formatTime(track.duration)

6. Controls row flex justify-between:
   - Shuffle size=19: animate color shuffled→track.color, whileHover color white/75
   - SkipBack size=26 weight=fill: onClick skipTo(-1)
   - Play button h-52px w-52px circle: animate background radial-gradient track.color
     AnimatePresence mode="wait" for Play/Pause icon swap (scale 0.6→1, 150ms)
   - SkipForward size=26 weight=fill: onClick skipTo(1)
   - Queue size=19 weight=regular white/35

skipTo(dir): setPlaying(false), progressRef=0, progressMV.set(0), setElapsed(0), setTrackIdx`,

  Cursor: `Build components-workspace/glass-music-player/index.tsx — a polished glass music player card.

Named export: GlassMusicPlayer. 'use client' at top.
Imports: useState, useEffect, useRef from react; motion, AnimatePresence, useMotionValue, useTransform from framer-motion; Play, Pause, SkipBack, SkipForward, Heart, Shuffle, Queue, ArrowLeft from @phosphor-icons/react.

Key architecture — smooth progress without jank:
- useMotionValue(0) for progress → useTransform to barWidth string
- RAF loop sets progressMV.set(pct) directly (no setState per frame)
- setElapsed(seconds) only every 250ms for timestamp text
- const SPEED = 15 multiplies playback speed for demo

Card: w-[320px] rounded-[32px] bg rgba(12,10,14,0.55) backdropFilter blur(48px) saturate(1.6) border rgba(255,255,255,0.09)

Structure (top→bottom):
1. Top bar: ArrowLeft · "NOW PLAYING" tracking-[0.18em] uppercase · Heart (liked toggles to track.color fill)
2. Album art circle h-44 w-44 with ambient glow (blur 28px, track.color, 18% opacity), spinning concentric rings (4 at scales 1/0.78/0.58/0.38), glowing center dot. AnimatePresence on trackIdx change.
3. Track title + artist, blur-fade AnimatePresence transition
4. Pagination pills: 3 dots, active expands to 20px width + track.color at 0.5 opacity
5. Progress: h-[3px] bar, motion.div style={{width: barWidth}}, gradient track.color. Timestamps below.
6. Controls: Shuffle · SkipBack(fill) · Play/Pause 52px circle with animated radial-gradient · SkipForward(fill) · Queue

Play button: AnimatePresence mode="wait" swaps Play/Pause icons with scale 0.6→1 transition.
Shuffle: motion button animate color between white/35 and track.color.
Background: full-bleed image at 60% opacity behind card.`,
}
