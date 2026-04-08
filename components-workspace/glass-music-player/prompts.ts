import type { Platform } from '../../app/components/ComponentCard'

export const prompts: Partial<Record<Platform, string>> = {
  Claude: `Create components-workspace/glass-music-player/index.tsx:

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
}
