'use client'

// Cluster of 150 small AI Canvas marks in olive + sand shades arranged into
// an overlapping golden-angle pack. Three motion behaviours per icon:
//
//   1. Entry (one-shot framer spring): off-screen → rest.
//   2. Float (CSS @keyframes, GPU): infinite slow position drift + rotation
//      sway. Compositor-driven so no JS runs per frame while at rest.
//   3. Magnet (framer useSpring): cursor pulls nearby icons toward it like
//      a soft magnetic field — radial attraction with springy lag, so the
//      icons trail the cursor and overshoot before settling.
//
// Performance notes:
//   - Drift is pure CSS (zero JS per frame for at-rest icons).
//   - Magnet useTransform returns 0 outside the influence radius, so framer
//     parks those springs and only the icons near the cursor consume any
//     per-frame work. No explicit proximity gate needed.

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

// ── Tunables ───────────────────────────────────────────────────────────────
const ICON_COUNT = 150
const PACK_RADIUS_FRAC = 0.48
const MIN_ICON_FRAC = 0.028
const MAX_ICON_FRAC = 0.080
const ICON_ASPECT = 24 / 28

// Magnetic field (fractions of container).
//   MAGNET_RADIUS:   how far the cursor's pull reaches.
//   MAGNET_STRENGTH: peak displacement when icon is right under the cursor.
//   CURL_FACTOR:     mixes a tangential push perpendicular to the radial
//                    direction, giving the field a faint swirl instead of a
//                    pure straight-line tug (the satisfying part).
const MAGNET_RADIUS_FRAC = 0.42
const MAGNET_STRENGTH_FRAC = 0.18
const CURL_FACTOR = 0.30

// Floating drift loop (fractions of container) and rotation sway (degrees).
const DRIFT_MAG_MIN_FRAC = 0.006
const DRIFT_MAG_MAX_FRAC = 0.016
const DRIFT_ROT_AMPLITUDE = 1.6
const DRIFT_DURATION_MIN = 5
const DRIFT_DURATION_MAX = 9

type Palette = {
  id: string
  from: string
  to: string
  mid: string
  dark: string
}

const OLIVE_PALETTES: Palette[] = [
  { id: 'op0', from: '#EBF0C8', to: '#C5D672', mid: '#5C5C58', dark: '#262624' },
  { id: 'op1', from: '#DAE4A0', to: '#BECF5D', mid: '#4F4F4C', dark: '#1E1E1E' },
  { id: 'op2', from: '#BECF5D', to: '#92A143', mid: '#4F4F4C', dark: '#1E1E1E' },
  { id: 'op3', from: '#A8B94D', to: '#6E7E22', mid: '#3A3A38', dark: '#1A1A19' },
  { id: 'op4', from: '#869631', to: '#5C6A1C', mid: '#2E2E2C', dark: '#141413' },
]
const SAND_PALETTES: Palette[] = [
  { id: 'sp0', from: '#C8C8C0', to: '#BABAB4', mid: '#4F4F4C', dark: '#21211F' },
  { id: 'sp1', from: '#BABAB4', to: '#9E9E98', mid: '#383836', dark: '#1A1A19' },
  { id: 'sp2', from: '#9E9E98', to: '#7D7D78', mid: '#21211F', dark: '#141413' },
  { id: 'sp3', from: '#7D7D78', to: '#666662', mid: '#21211F', dark: '#141413' },
  { id: 'sp4', from: '#666662', to: '#4F4F4C', mid: '#1A1A19', dark: '#141413' },
]
const ALL_PALETTES: Palette[] = [...OLIVE_PALETTES, ...SAND_PALETTES]

// Weighted pool: 30% olive (45) + 70% sand (105) = ICON_COUNT, darker bias.
const PALETTE_WEIGHTS: Array<{ palette: Palette; count: number }> = [
  // Olive (45)
  { palette: OLIVE_PALETTES[0], count: 2 },
  { palette: OLIVE_PALETTES[1], count: 4 },
  { palette: OLIVE_PALETTES[2], count: 14 },
  { palette: OLIVE_PALETTES[3], count: 15 },
  { palette: OLIVE_PALETTES[4], count: 10 },
  // Sand (105)
  { palette: SAND_PALETTES[0], count: 6 },
  { palette: SAND_PALETTES[1], count: 17 },
  { palette: SAND_PALETTES[2], count: 30 },
  { palette: SAND_PALETTES[3], count: 36 },
  { palette: SAND_PALETTES[4], count: 16 },
]

function buildPalettePool(): Palette[] {
  const pool: Palette[] = []
  for (const { palette, count } of PALETTE_WEIGHTS) {
    for (let i = 0; i < count; i++) pool.push(palette)
  }
  return pool
}

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let x = t
    x = Math.imul(x ^ (x >>> 15), x | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const out = arr.slice()
  const rand = mulberry32(seed)
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

type Item = {
  id: number
  xFrac: number
  yFrac: number
  sizeFrac: number
  rotation: number
  palette: Palette
  fromXFrac: number
  fromYFrac: number
  driftXFrac: number
  driftYFrac: number
  driftDuration: number
  driftDelay: number
  entryDelay: number
  zIndex: number
}

function buildCluster(): Item[] {
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
  const palettes = shuffle(buildPalettePool(), 0xabcdef12).slice(0, ICON_COUNT)
  const items: Item[] = []
  for (let i = 0; i < ICON_COUNT; i++) {
    const rand = mulberry32(0x9e3779b1 + i * 2654435761)
    const t = i / (ICON_COUNT - 1)
    const baseR = PACK_RADIUS_FRAC * Math.sqrt(t)
    const angle = i * GOLDEN_ANGLE + rand() * 0.4
    const jitter = (rand() - 0.5) * 0.018
    const xFrac = (baseR + jitter) * Math.cos(angle) + (rand() - 0.5) * 0.012
    const yFrac = (baseR + jitter) * Math.sin(angle) + (rand() - 0.5) * 0.012
    const sizeFrac =
      MAX_ICON_FRAC -
      (MAX_ICON_FRAC - MIN_ICON_FRAC) * t +
      (rand() - 0.5) * 0.008

    const fromAngle = rand() * Math.PI * 2
    const fromDist = 1.6 + rand() * 0.4

    const driftAngle = rand() * Math.PI * 2
    const driftMag =
      DRIFT_MAG_MIN_FRAC + rand() * (DRIFT_MAG_MAX_FRAC - DRIFT_MAG_MIN_FRAC)

    items.push({
      id: i,
      xFrac,
      yFrac,
      sizeFrac,
      // Fully random base rotation in ±180°. The float loop sways
      // ±DRIFT_ROT_AMPLITUDE around this base.
      rotation: (rand() - 0.5) * 360,
      palette: palettes[i],
      fromXFrac: Math.cos(fromAngle) * fromDist,
      fromYFrac: Math.sin(fromAngle) * fromDist,
      driftXFrac: Math.cos(driftAngle) * driftMag,
      driftYFrac: Math.sin(driftAngle) * driftMag,
      driftDuration:
        DRIFT_DURATION_MIN +
        rand() * (DRIFT_DURATION_MAX - DRIFT_DURATION_MIN),
      driftDelay: -rand() * DRIFT_DURATION_MAX,
      // Generous per-icon stagger so the cluster takes its time gathering.
      // 150 × 0.022s ≈ 3.3s before the last icon launches.
      entryDelay: i * 0.022,
      zIndex: 250 - i,
    })
  }
  return items
}

// Shared gradient defs (10) live in a single hidden <svg>, so all 150 icons
// reference them by id instead of carrying per-icon <defs>.
function GradientDefs() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0 }}
    >
      <defs>
        {ALL_PALETTES.map((p) => (
          <linearGradient
            key={p.id}
            id={`iconCluster-${p.id}`}
            x1="9"
            y1="3"
            x2="24.8756"
            y2="17"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={p.from} />
            <stop offset="1" stopColor={p.to} />
          </linearGradient>
        ))}
      </defs>
    </svg>
  )
}

function MarkIcon({ palette }: { palette: Palette }) {
  const gradUrl = `url(#iconCluster-${palette.id})`
  return (
    <svg
      viewBox="0 0 28 24"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: 'auto' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.8513 0C20.5626 0 21.2204 0.377823 21.5788 0.992258L22.75 3L27.4122 10.9923C27.7754 11.615 27.7754 12.385 27.4122 13.0077L22.75 21L21.5788 23.0077C21.2204 23.6222 20.5626 24 19.8513 24H8.14874C7.43741 24 6.7796 23.6222 6.42118 23.0077L0.587849 13.0077C0.224593 12.385 0.224593 11.615 0.58785 10.9923L6.42118 0.992257C6.7796 0.377822 7.43741 0 8.14874 0H19.8513ZM4 12L9 21H18.25L13 12L18.25 3H9L4 12Z"
        fill={gradUrl}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 21L4 12H13L18.25 21H9Z"
        fill={palette.dark}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 12H4L9 3H18.25L13 12Z"
        fill={palette.mid}
      />
    </svg>
  )
}

// One icon:
//   outer (static):       pins centre to rest point in px
//   magnet (motion.div):  spring-lagged x/y from cursor attraction
//   entry  (motion.div):  one-shot off-screen → 0
//   float  (plain div):   GPU-driven CSS animation (no per-frame JS)
function ClusterIcon({
  item,
  size,
  mouseX,
  mouseY,
  reduceMotion,
}: {
  item: Item
  size: number
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  reduceMotion: boolean
}) {
  const restX = item.xFrac * size
  const restY = item.yFrac * size
  const iconW = item.sizeFrac * size
  const iconH = iconW * ICON_ASPECT
  const influence = MAGNET_RADIUS_FRAC * size
  const strength = MAGNET_STRENGTH_FRAC * size
  const driftAmpX = item.driftXFrac * size
  const driftAmpY = item.driftYFrac * size

  // Magnetic attraction. Pulls the icon toward the cursor with a smoothstep
  // falloff over the influence radius, plus a small tangential component
  // (perpendicular to the radial direction) so the field has a faint swirl
  // — like iron filings curving around a magnet pole.
  //
  // useTransform returns 0 once the cursor is outside the influence radius,
  // so the spring's target is 0 for distant icons and framer parks them.
  // That's why we don't need an explicit proximity gate.
  const magnetX = useTransform([mouseX, mouseY], (input) => {
    const [mx, my] = input as [number, number]
    const dx = mx - restX
    const dy = my - restY
    const d = Math.hypot(dx, dy)
    if (d >= influence || d < 0.0001) return 0
    const fall = 1 - smoothstep(0, influence, d)
    const normX = dx / d
    const normY = dy / d
    // Tangential (radial rotated 90° CCW) gives the field a curl.
    const tanX = -normY
    return (normX + tanX * CURL_FACTOR) * strength * fall
  })
  const magnetY = useTransform([mouseX, mouseY], (input) => {
    const [mx, my] = input as [number, number]
    const dx = mx - restX
    const dy = my - restY
    const d = Math.hypot(dx, dy)
    if (d >= influence || d < 0.0001) return 0
    const fall = 1 - smoothstep(0, influence, d)
    const normX = dx / d
    const normY = dy / d
    const tanY = normX
    return (normY + tanY * CURL_FACTOR) * strength * fall
  })

  // Spring config tuned for "magnetic chase": low mass + medium damping = a
  // slight overshoot when icons reach toward the cursor, gentle return when
  // it moves away.
  const springConfig = { stiffness: 180, damping: 14, mass: 0.6 }
  const springX = useSpring(magnetX, springConfig)
  const springY = useSpring(magnetY, springConfig)

  // CSS custom properties drive the @keyframes float loop (defined once at
  // the cluster root). Each icon has its own amplitude/period/phase, so the
  // cluster never sways in unison.
  const floatStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    ['--ic-dx' as never]: driftAmpX,
    ['--ic-dy' as never]: driftAmpY,
    ['--ic-rot' as never]: item.rotation,
    ['--ic-rot-amp' as never]: DRIFT_ROT_AMPLITUDE,
    ['--ic-duration' as never]: `${item.driftDuration}s`,
    ['--ic-delay' as never]: `${item.driftDelay}s`,
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(50% + ${restX}px)`,
        top: `calc(50% + ${restY}px)`,
        width: iconW,
        height: iconH,
        marginLeft: -iconW / 2,
        marginTop: -iconH / 2,
        zIndex: item.zIndex,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          x: reduceMotion ? 0 : springX,
          y: reduceMotion ? 0 : springY,
          willChange: 'transform',
        }}
      >
        <motion.div
          style={{ width: '100%', height: '100%' }}
          initial={
            reduceMotion
              ? false
              : {
                  x: item.fromXFrac * size,
                  y: item.fromYFrac * size,
                  opacity: 0,
                  scale: 0.5,
                }
          }
          animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          transition={{
            // Softer entry spring (lower stiffness + higher damping) so each
            // icon glides into rest over ~1.4s instead of snapping.
            type: 'spring',
            stiffness: 42,
            damping: 18,
            mass: 1,
            delay: reduceMotion ? 0 : item.entryDelay,
          }}
        >
          {reduceMotion ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                transform: `rotate(${item.rotation}deg)`,
              }}
            >
              <MarkIcon palette={item.palette} />
            </div>
          ) : (
            <div className="iconCluster-float" style={floatStyle}>
              <MarkIcon palette={item.palette} />
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

// Shared CSS for the GPU-driven float loop. Each icon's CSS variables fill
// in the per-icon amplitude / rotation / period / phase.
const FLOAT_CSS = `
.iconCluster-float {
  animation: iconCluster-float var(--ic-duration) ease-in-out var(--ic-delay) infinite alternate;
  will-change: transform;
  transform: translateZ(0);
}
@keyframes iconCluster-float {
  from {
    transform:
      translate(calc(var(--ic-dx) * -1px), calc(var(--ic-dy) * -1px))
      rotate(calc((var(--ic-rot) - var(--ic-rot-amp)) * 1deg));
  }
  to {
    transform:
      translate(calc(var(--ic-dx) * 1px), calc(var(--ic-dy) * 1px))
      rotate(calc((var(--ic-rot) + var(--ic-rot-amp)) * 1deg));
  }
}
`

export function IconCluster({ className = '' }: { className?: string }) {
  const items = useMemo(() => buildCluster(), [])
  const reduceMotion = useReducedMotion() ?? false

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState(0)
  // Tracks whether the user has interacted yet. Used to skip the auto demo
  // sweep once they've discovered the magnetic interaction themselves.
  const interactedRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0
      setSize(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const mouseX = useMotionValue(99999)
  const mouseY = useMotionValue(99999)

  function handlePointer(e: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || !containerRef.current) return
    interactedRef.current = true
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }
  function handlePointerLeave() {
    mouseX.set(99999)
    mouseY.set(99999)
  }

  // ── Auto demo sweep ─────────────────────────────────────────────────────
  // Right after the cluster finishes its entry, we run a single scripted
  // "ghost cursor" pass: animate the same mouseX/mouseY motion values along
  // a curve from the cluster's left edge, through its centre, out past the
  // right edge. Icons reach toward the invisible cursor and trail behind,
  // showing the magnetic interaction to a user who never touched the page.
  // Cancelled if they move their own cursor first, and skipped entirely
  // for reduce-motion or before the cluster has been measured.
  useEffect(() => {
    if (reduceMotion || size <= 0) return

    // Wait for the entry stagger + spring settle to mostly finish before
    // showing the demo so it doesn't overlap with the gather animation.
    const entryDoneMs = ICON_COUNT * 22 + 1400 // matches entryDelay i*0.022s + ~1.4s spring
    const startDelay = entryDoneMs + 500       // small pause for the eye to settle
    const sweepDuration = 1700                  // total sweep time, ms
    const pauseAfter = 400                      // hold off-screen briefly post-sweep

    let cancelled = false
    let rafId = 0

    const startTimer = window.setTimeout(() => {
      if (cancelled || interactedRef.current) return
      const startedAt = performance.now()

      const tick = () => {
        if (cancelled || interactedRef.current) {
          mouseX.set(99999)
          mouseY.set(99999)
          return
        }
        const elapsed = performance.now() - startedAt
        const t = Math.min(1, elapsed / sweepDuration)
        // Smooth in/out so the ghost cursor doesn't snap into motion.
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        // Sweep from -45% to +65% of half-size on X. Ending past the cluster's
        // right edge so the trailing icons demonstrate spillover into copy
        // sitting to the right of the cluster.
        const startX = -size * 0.45
        const endX = size * 0.65
        const x = startX + (endX - startX) * eased
        // Gentle vertical sine so the path is a soft arc, not a flat line.
        const y = Math.sin(eased * Math.PI) * size * -0.08
        mouseX.set(x)
        mouseY.set(y)
        if (t < 1) {
          rafId = requestAnimationFrame(tick)
        } else {
          // Park the cursor far away after a short hold so the springs
          // return all the way to rest gracefully.
          window.setTimeout(() => {
            if (cancelled) return
            mouseX.set(99999)
            mouseY.set(99999)
          }, pauseAfter)
        }
      }
      rafId = requestAnimationFrame(tick)
    }, startDelay)

    return () => {
      cancelled = true
      window.clearTimeout(startTimer)
      cancelAnimationFrame(rafId)
    }
  }, [size, reduceMotion, mouseX, mouseY])

  return (
    <div
      ref={containerRef}
      className={`relative aspect-square w-full ${className}`}
      onPointerMove={handlePointer}
      onPointerLeave={handlePointerLeave}
      role="img"
      aria-label="A cluster of AI Canvas marks in olive and sand shades"
      style={{ touchAction: 'none' }}
    >
      <style dangerouslySetInnerHTML={{ __html: FLOAT_CSS }} />
      <GradientDefs />
      {size > 0 &&
        items.map((item) => (
          <ClusterIcon
            key={item.id}
            item={item}
            size={size}
            mouseX={mouseX}
            mouseY={mouseY}
            reduceMotion={reduceMotion}
          />
        ))}
    </div>
  )
}
