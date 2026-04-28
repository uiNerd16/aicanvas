'use client'

// npm install framer-motion @phosphor-icons/react react

import { useEffect, useRef, useState, type ComponentType, type RefObject } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { Footprints, Fire, Moon, Drop, Heart, Lightning, Path } from '@phosphor-icons/react'

// ─── Theme + tuning constants ────────────────────────────────────────────────
const SECONDS_PER_TURN = 45
const REDUCED_SECONDS_PER_TURN = SECONDS_PER_TURN * 4 // 1/4 speed when reduced

const ENGAGED_LIFT_Z = 120
const REDUCED_LIFT_Z = 30
const ENGAGED_SCALE = 1.18
const REDUCED_ENGAGED_SCALE = 1.06

// Lift/scale/centering — softer, glide-forward feel (no flip snap).
const LIFT_SPRING = { stiffness: 140, damping: 28, mass: 1 } as const
// Redistribution (slot angle, idle rotation factor, skew, outward) — softened
// slightly so the post-click rearrangement glides instead of snapping.
const SPRING = { stiffness: 200, damping: 24, mass: 1 } as const
const SPEED_SPRING = { stiffness: 90, damping: 20, mass: 1 } as const

// Card dimensions.
const CARD_W = 240
const CARD_H = 138

// Petal tilt — slight skew so the rectangle reads as a slightly off-rectangular
// petal in the bouquet, matching the reference image.
const PETAL_SKEW_Y = 0

// Outward push from the shared anchor — set to 0 per the Figma redesign so all
// 7 cards converge at a single anchor point with no perimeter ring. The
// centeringFactor interpolation collapses on the slot side to translate(-50%,
// -100%) — cards sit with their bottom-centre exactly at the anchor.
const OUTWARD_OFFSET_PX = '0px'

// Hand-arranged slot angles for the 7-card bouquet, in clockwise order
// starting from the upper-right (Steps).
const SLOT_ANGLES: readonly number[] = [
  -35.55, // 0 Steps
  22.14, // 1 Calories
  71.01, // 2 Sleep
  122.25, // 3 Water
  161.58, // 4 Heart
  -150.4, // 5 Active
  -108.41, // 6 Distance
]

// Stage that holds the bouquet. With BL pivot, cards extend up-and-right from
// the shared anchor at the canvas centre. The bouquet bounding box is roughly
// 2 × max(W, H) ≈ 560px, so the clamp gives some breathing room around the
// rotated bouquet without clipping.
const STAGE_SIZE = 'clamp(300px, 50vw, 560px)'

// ─── 7 metrics + theme palette ───────────────────────────────────────────────
type PhosphorIconProps = {
  size?: number | string
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
  color?: string
}

type Metric = {
  title: string
  label: string
  value: string
  delta: string
  /** Pastel card gradient start (top). */
  surface: string
  /** Deeper gradient end (bottom). */
  gradientEnd: string
  /** Dark variant — used for metric value, pill bg, sparkline stroke. */
  dark: string
  /** 7 y-values (px, 0=top 31=bottom) for the sparkline in viewBox 0 0 108 31. */
  sparkline: readonly number[]
  /** Phosphor icon for the header. */
  Icon: ComponentType<PhosphorIconProps>
}

const METRICS: Metric[] = [
  {
    title: 'Steps',
    label: 'TODAY',
    value: '20.5K',
    delta: '+5K',
    surface: '#EAF6AE',
    gradientEnd: '#ACC13C',
    dark: '#5C662A',
    sparkline: [28, 18, 10, 6],
    Icon: Footprints,
  },
  {
    title: 'Calories',
    label: 'BURNED',
    value: '1,820',
    delta: '+120',
    surface: '#F9C8A7',
    gradientEnd: '#D4783A',
    dark: '#853C0B',
    sparkline: [30, 8, 20, 6],
    Icon: Fire,
  },
  {
    title: 'Sleep',
    label: 'LAST NIGHT',
    value: '7h 42m',
    delta: '+18m',
    surface: '#C1C2FA',
    gradientEnd: '#7B7DF0',
    dark: '#363885',
    sparkline: [22, 30, 14, 18],
    Icon: Moon,
  },
  {
    title: 'Water',
    label: 'TODAY',
    value: '2.1 L',
    delta: '+0.4 L',
    surface: '#96D9F7',
    gradientEnd: '#4BB8F0',
    dark: '#085B80',
    sparkline: [26, 14, 20, 4],
    Icon: Drop,
  },
  {
    title: 'Heart',
    label: 'RESTING',
    value: '72 BPM',
    delta: '−4',
    surface: '#FBB1BE',
    gradientEnd: '#F07090',
    dark: '#862334',
    sparkline: [8, 22, 16, 28],
    Icon: Heart,
  },
  {
    title: 'Active',
    label: 'THIS WEEK',
    value: '48 min',
    delta: '+12 min',
    surface: '#9BE6DD',
    gradientEnd: '#48C7B8',
    dark: '#0B655B',
    sparkline: [32, 20, 10, 4],
    Icon: Lightning,
  },
  {
    title: 'Distance',
    label: 'THIS WEEK',
    value: '8.4 km',
    delta: '+1.2 km',
    surface: '#FAD79C',
    gradientEnd: '#E8B040',
    dark: '#875706',
    sparkline: [24, 12, 20, 6],
    Icon: Path,
  },
]

// ─── Sparkline ───────────────────────────────────────────────────────────────
// Proper Catmull-Rom → cubic bezier conversion for silky-smooth curves.
function SparkLine({ points, color, id }: { points: readonly number[]; color: string; id: string }) {
  const W = 54, H = 36
  const n = points.length
  const xs = points.map((_, i) => (i / (n - 1)) * W)
  const pts = points.map((y, i) => ({ x: xs[i], y }))

  const segs: string[] = [`M ${pts[0].x},${pts[0].y}`]
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(n - 1, i + 2)]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    segs.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`)
  }
  const linePath = segs.join(' ')
  const areaPath = `${linePath} L ${W},${H} L 0,${H} Z`
  const gradId = `spark-${id}`

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useTheme(ref: RefObject<HTMLElement | null>) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const read = () => {
      const scope = element.closest('[data-card-theme]') as HTMLElement | null
      if (scope) {
        setTheme(scope.dataset.cardTheme === 'dark' ? 'dark' : 'light')
        return
      }
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    }
    read()
    const observers: MutationObserver[] = []
    let current: HTMLElement | null = element
    while (current) {
      const o = new MutationObserver(read)
      o.observe(current, { attributes: true, attributeFilter: ['class', 'data-card-theme'] })
      observers.push(o)
      current = current.parentElement
    }
    return () => observers.forEach((o) => o.disconnect())
  }, [ref])
  return { theme }
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

// ─── Card ────────────────────────────────────────────────────────────────────
type CardProps = {
  index: number
  metric: Metric
  /** Shared idle rotation in degrees. */
  rotation: MotionValue<number>
  /** Index of the currently engaged card, or null. */
  engagedIndex: number | null
  /** Index of the most-recently-clicked card, or null. Persists past release. */
  topIndex: number | null
  /** True when reduced motion is in effect. */
  reduced: boolean
  onToggle: (index: number) => void
}

function Card({
  index,
  metric,
  rotation,
  engagedIndex,
  topIndex,
  reduced,
  onToggle,
}: CardProps) {
  const engaged = engagedIndex === index
  const isTop = topIndex === index

  // ─── Compute the target slot angle ──────────────────────────────────────
  // Idle (engagedIndex == null): 7-slot bouquet using the hand-arranged
  // SLOT_ANGLES array.
  // Someone-else engaged: 6-slot redistribution. j is this card's index in
  // the 6-card layout (0..5), computed by skipping the engaged slot.
  // Self engaged: slot is irrelevant because centeringFactor=1 collapses
  // outwardOffset+rotation contribution; we just feed a placeholder.
  // Each card always owns its hand-tuned slot — no redistribution when a sibling engages.
  const slotTargetDeg = SLOT_ANGLES[index]

  // Per-card springs ──────────────────────────────────────────────────────
  const outwardFactorTarget = useMotionValue(1)
  const outwardFactor = useSpring(outwardFactorTarget, SPRING)

  // Centering uses the softer LIFT_SPRING — it drives the move-to-centre
  // glide alongside the lift/scale, so they should share the same easing.
  const centeringFactorTarget = useMotionValue(0)
  const centeringFactor = useSpring(centeringFactorTarget, LIFT_SPRING)

  const skewFactorTarget = useMotionValue(1)
  const skewFactor = useSpring(skewFactorTarget, SPRING)

  const liftTarget = useMotionValue(0)
  const lift = useSpring(liftTarget, LIFT_SPRING)

  const scaleTarget = useMotionValue(1)
  const scale = useSpring(scaleTarget, LIFT_SPRING)

  const opacityTarget = useMotionValue(1)
  const cardOpacity = useSpring(opacityTarget, SPRING)

  // ─── Per-card rotation MotionValue (shortest-path engagement) ──────────
  // This single MotionValue is the actual visual rotation of the card's
  // pivot in degrees. It operates in two modes:
  //
  //   FOLLOW mode (default, non-engaged, no transition in flight):
  //     cardRotation continuously syncs to SLOT_ANGLES[index] + idleRotation.
  //     Updated via a useMotionValueEvent listener on idleRotation — no
  //     spring lag, no separate slot spring. Both engaging and releasing
  //     transitions briefly leave this mode.
  //
  //   SPRING mode (engagement transitions):
  //     cardRotation is animated by `animate(...)` to a shortest-path
  //     equivalent of the desired target (engaged: 0; non-engaged: current
  //     slot+idle). The spring traverses at most 180° in either direction —
  //     never a full revolution.
  //
  // The mode is tracked by `followModeRef`. It flips off at engagement
  // transitions and back on after the spring lands.
  //
  // The "follow base" — the slot angle this card tracks while in FOLLOW
  // mode — is held in a ref so the listener always reads the latest value
  // (it changes when another card engages and redistribution kicks in).
  const initialRot = SLOT_ANGLES[index] + rotation.get()
  const cardRotation = useMotionValue(initialRot)
  const followModeRef = useRef<boolean>(true)
  const followBaseRef = useRef<number>(SLOT_ANGLES[index])

  // FOLLOW mode listener — when active, cardRotation tracks idle continuously.
  // While in spring mode this listener is a no-op (followModeRef.current is
  // false), so the running spring is not fought by idle drift.
  useMotionValueEvent(rotation, 'change', (latest) => {
    if (!followModeRef.current) return
    cardRotation.set(followBaseRef.current + latest)
  })

  // ─── Engagement transition driver ───────────────────────────────────────
  // On engagement state change (or redistribution-base change), compute the
  // shortest-path equivalent target and animate cardRotation there with
  // LIFT_SPRING. After the spring lands (or is interrupted), if we're back
  // in non-engaged state, re-enable FOLLOW mode so cardRotation resumes
  // tracking idle from the (possibly new) base slot.
  useEffect(() => {
    // Compute the shortest-path equivalent of `target` relative to `current`.
    // Returns a value V such that V ≡ target (mod 360) and |V - current| ≤ 180.
    const shortestEquivalent = (current: number, target: number): number => {
      let delta = target - current
      while (delta > 180) delta -= 360
      while (delta <= -180) delta += 360
      return current + delta
    }

    if (engaged) {
      // Engaging: spring cardRotation from current slot angle toward 0 (centre).
      // The card is at its slot (centeringFactor≈0) so this rotation is visible
      // and intentional — it sweeps the card inward along its arc.
      followBaseRef.current = 0
      followModeRef.current = false

      const current = cardRotation.get()
      const shortestTarget = shortestEquivalent(current, 0)

      const controls = animate(cardRotation, shortestTarget, {
        type: 'spring',
        ...LIFT_SPRING,
      })
      return () => controls.stop()
    } else {
      // Releasing: snap rotation instantly to the correct slot+idle angle.
      // This is invisible — while centeringFactor=1 the card is centred ON its
      // pivot, so rotating the pivot doesn't change the card's screen position.
      // The visual return is handled entirely by the centeringFactor/lift/scale
      // springs: the card glides straight outward along its slot direction.
      followBaseRef.current = slotTargetDeg
      cardRotation.set(slotTargetDeg + rotation.get())
      followModeRef.current = true
    }
    // Run when engagement state OR the redistribution slot changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engaged, slotTargetDeg, index])

  // Drive remaining (non-rotation) targets from the engagement model ──────
  useEffect(() => {
    if (engaged) {
      // This is the focused card. Move to centre, lift forward in Z, scale
      // up — front face stays visible the whole time. No flip.
      outwardFactorTarget.set(0)
      centeringFactorTarget.set(1)
      skewFactorTarget.set(0)
      liftTarget.set(reduced ? REDUCED_LIFT_Z : ENGAGED_LIFT_Z)
      scaleTarget.set(reduced ? REDUCED_ENGAGED_SCALE : ENGAGED_SCALE)
      opacityTarget.set(1)
    } else {
      // Petal — either idle or sibling of an engaged card. Same target either
      // way (slot-centre with full skew + outward offset + idle rotation).
      outwardFactorTarget.set(1)
      centeringFactorTarget.set(0)
      skewFactorTarget.set(1)
      liftTarget.set(0)
      scaleTarget.set(1)
      // In reduced motion, petals dim slightly when a sibling is engaged.
      opacityTarget.set(reduced && engagedIndex != null ? 0.7 : 1)
    }
  }, [
    engaged,
    engagedIndex,
    reduced,
    slotTargetDeg,
    outwardFactorTarget,
    centeringFactorTarget,
    skewFactorTarget,
    liftTarget,
    scaleTarget,
    opacityTarget,
  ])

  // Pivot transform — uses the per-card rotation MotionValue directly.
  // FOLLOW mode keeps it tracking SLOT_ANGLES[index] + idle continuously;
  // SPRING mode glides it along the shortest path to the engagement target.
  const pivotTransform = useTransform(
    cardRotation,
    (r) => `rotate(${r as number}deg)`,
  )

  // Card body transform — interpolates between two anchors. The card element
  // has transform-origin at its bottom-left (0% 100%), so:
  //   centeringFactor=0 → bottom-LEFT at the pivot (translate(0, -100%))
  //                       all 7 cards' BL corners coincide at the canvas centre
  //   centeringFactor=1 → CENTRE on the pivot (translate(-50%, -50%))
  // Both translateX and translateY interpolate together via centeringFactor.
  // Plus skewY scaled by skewFactor so the engaged card eases to 0° skew.
  // outwardFactor multiplies OFFSET (currently 0) for any future radial gap.
  const cardBodyTransform = useTransform(
    [centeringFactor, skewFactor, outwardFactor],
    ([c, sk, ow]) => {
      const cf = c as number
      const skf = sk as number
      const owf = ow as number
      // X-anchor blend: 0% (BL at pivot) → -50% (centre)
      // Y-anchor blend: -100% (BL at pivot) → -50% (centre)
      const txPct = -50 * cf
      return (
        `translate(${txPct}%, calc(-50% - (50% + (${OUTWARD_OFFSET_PX}) * ${owf}) * ${1 - cf})) ` +
        `skewY(${PETAL_SKEW_Y * skf}deg)`
      )
    },
  )

  // Lift transform — applied to a CHILD wrapper inside the layout transform,
  // so the lift comes off the petal's surface in its LOCAL frame (which reads
  // as "out of the bouquet" in screen space). translateZ requires the
  // ancestors' transform-style: preserve-3d + the stage's perspective.
  const liftTransform = useTransform(
    [lift, scale],
    ([z, s]) => `translateZ(${z as number}px) scale(${s as number})`,
  )

  // Z-index priority (highest to lowest):
  //   lift > 4 (mid-glide, either lifting or returning)        → 50
  //   currently engaged at rest                                → 40
  //   most-recently-clicked card (persists past release)       → 30
  //   default (slot, never clicked OR superseded by a newer)   → 1
  // The closure captures `engaged` and `isTop` at hook setup time. When state
  // changes, the component re-renders and useTransform is re-invoked with the
  // fresh closure values; we additionally nudge the underlying MotionValue
  // (see useEffect below) so the transform recomputes immediately rather than
  // waiting for the next lift change.
  const dynamicZIndex = useTransform(lift, (z) => {
    if (z > 4) return 50
    if (engaged) return 40
    if (isTop) return 30
    return 1
  })

  // Force the dynamicZIndex transform to recompute when the booleans change.
  // Without this, the zIndex would only update on the next lift spring tick.
  useEffect(() => {
    lift.set(lift.get())
  }, [engaged, isTop, lift])

  // Layered drop shadow grows when engaged for the "lifted" feel.
  const restShadow =
    '4px 6px 14px rgba(0,0,0,0.18), 12px 18px 40px rgba(0,0,0,0.22)'
  const liftedShadow =
    '8px 14px 26px rgba(0,0,0,0.30), 28px 36px 70px rgba(0,0,0,0.34)'

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    onToggle(index)
  }

  // ─── Face content ──────────────────────────────────────────────────────────
  const interStack =
    '"Manrope", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'

  const frontShadow =
    '-8px 16px 32px rgba(0,0,0,0.12), -3px 6px 14px rgba(0,0,0,0.18)'

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        transformOrigin: '0 0',
        zIndex: dynamicZIndex,
        transformStyle: 'preserve-3d',
        transform: pivotTransform,
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: CARD_W,
          height: CARD_H,
          transformOrigin: '0% 100%',
          transformStyle: 'preserve-3d',
          transform: cardBodyTransform,
          opacity: cardOpacity,
          touchAction: 'manipulation',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onPointerDown={handlePointerDown}
      >
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            transform: liftTransform,
          }}
        >
          {/* Outer card shell — gradient + border */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 24,
              overflow: 'hidden',
              background: `linear-gradient(to bottom, ${metric.surface}, ${metric.gradientEnd})`,
              boxShadow: engaged ? liftedShadow : frontShadow,
              transition: 'box-shadow 320ms ease',
              padding: '12px 4px 4px 4px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              fontFamily: interStack,
            }}
          >
            {/* Header — 12px circle bullet + title */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                paddingLeft: 6,
                paddingTop: 2,
                flexShrink: 0,
              }}
            >
              <metric.Icon size={12} weight="regular" color={metric.dark} />
              <span
                style={{
                  color: '#1a1a1a',
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                {metric.title}
              </span>
            </div>

            {/* Inner panel — cream bg, pill top-right, text+sparkline bottom */}
            <div
              style={{
                flex: '1 0 0',
                background: '#f7f7f5',
                borderRadius: 20,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0px 1px 12px rgba(0,0,0,0.25)',
                minHeight: 0,
              }}
            >
              {/* Pill — top right */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span
                  style={{
                    background: metric.dark,
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '5px 10px',
                    borderRadius: 999,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {metric.delta}
                </span>
              </div>

              {/* Bottom row — label+value left, sparkline right */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <span
                    style={{
                      color: '#1a1a1a',
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.48px',
                      lineHeight: 1,
                    }}
                  >
                    {metric.label}
                  </span>
                  <span
                    style={{
                      color: metric.dark,
                      fontSize: 23,
                      fontWeight: 600,
                      letterSpacing: '-0.28px',
                      lineHeight: 1,
                    }}
                  >
                    {metric.value}
                  </span>
                </div>

                <SparkLine points={metric.sparkline} color={metric.dark} id={String(index)} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function RadialCards() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme(rootRef)
  const isDark = theme === 'dark'
  const reduced = useReducedMotion()

  // Shared idle rotation (degrees) — single source for all 7 cards.
  const rotation = useMotionValue(0)

  // Speed multiplier eases between idle (1) and paused (0) so rotation never
  // snaps to a stop when a card engages.
  const speedTargetRef = useRef(1)
  const speedTarget = useMotionValue(1)
  const speedSmooth = useSpring(speedTarget, SPEED_SPRING)

  // Engagement state — single source of truth.
  const [engagedIndex, setEngagedIndex] = useState<number | null>(null)

  // Most-recently-clicked card. Persists across release so the just-released
  // card retains a higher zIndex than its untouched neighbours until a
  // different card is clicked. Background releases do NOT clear this.
  const [topIndex, setTopIndex] = useState<number | null>(null)

  // Push speed target whenever engagement changes — petals keep orbiting at
  // full speed when nothing is engaged; when something engages, the SHARED
  // rotation continues (petals continue), but the engaged card's
  // idleRotationFactor=0 keeps it locked relative to the screen.
  useEffect(() => {
    speedTargetRef.current = 1
    speedTarget.set(speedTargetRef.current)
  }, [engagedIndex, speedTarget])

  // Continuous rotation tick — degrees per second × dt × speed multiplier.
  const prevTs = useRef<number | null>(null)
  useAnimationFrame((t) => {
    const last = prevTs.current
    prevTs.current = t
    if (last == null) return
    const dt = (t - last) / 1000
    const seconds = reduced ? REDUCED_SECONDS_PER_TURN : SECONDS_PER_TURN
    const degPerSec = 360 / seconds
    const next = rotation.get() + degPerSec * speedSmooth.get() * dt
    rotation.set(((next % 360) + 360) % 360)
  })

  function handleToggle(i: number) {
    // Every click — engaging OR releasing — marks this card as the top of the
    // stack. topIndex is independent of engagement and only changes when a
    // different card is clicked.
    setTopIndex(i)
    setEngagedIndex((prev) => (prev === i ? null : i))
  }

  function handleStageRelease() {
    // Tap outside any card on the stage / root background. Engagement clears,
    // but topIndex is intentionally preserved — the last-clicked card keeps
    // its top-of-stack status until someone else clicks a different card.
    setEngagedIndex(null)
  }

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{
        background: isDark ? '#1A1A19' : '#F0F0E8',
      }}
      onPointerDown={handleStageRelease}
    >
      {/* Subtle radial vignette to lift the centre of the bouquet. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 35%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Perspective stage / bouquet container — clicking the empty stage clears engagement. */}
      <div
        style={{
          position: 'relative',
          width: STAGE_SIZE,
          height: STAGE_SIZE,
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
          touchAction: 'manipulation',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
          }}
        >
          {METRICS.map((metric, i) => (
            <Card
              key={metric.title}
              index={i}
              metric={metric}
              rotation={rotation}
              engagedIndex={engagedIndex}
              topIndex={topIndex}
              reduced={reduced}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
