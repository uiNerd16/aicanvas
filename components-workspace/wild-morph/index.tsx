'use client'
// npm install framer-motion react
// font: Anton

import { useEffect, useRef, useState } from 'react'
import React from 'react'
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
} from 'framer-motion'
import type { AnimationPlaybackControls, MotionValue } from 'framer-motion'

// ─── WildMorph ────────────────────────────────────────────────────────────────
// Single full-viewport panel with one centered italic "wild" word on a warm
// off-white surface. The cursor's vertical position over the panel decides
// which warp engages:
//
//   • Cursor in the UPPER half  → top-corner warp: TL & TR pull up + outward;
//     bottom corners stay pinned. Transform-origin '0 100%' (bottom edge).
//   • Cursor in the LOWER half  → bottom-corner warp: BL & BR pull down +
//     outward; top corners stay pinned. Transform-origin '0 0' (top edge).
//   • Cursor leaves the panel    → all eight corner offsets ease back to 0.
//
// Crossing the midline mid-hover animates the active warp out to identity and
// the opposite warp in to its extreme — both transitions fire from the same
// onPointerMove handler, debounced by a `mode` ref so we only re-tween when
// the mode actually changes.
//
// Technique: CSS `transform: matrix3d(...)` driven by a 2D quad-to-quad
// homography computed per-frame from eight motion values (one X + one Y per
// corner). The source rect [(0,0),(w,0),(w,h),(0,h)] is always mapped onto
// the target quad built from those eight offsets.

const DARK_BG = '#1a1a19'
const LIGHT_BG = '#efeee6'

function useTheme(ref: React.RefObject<HTMLElement | null>) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const readTheme = () => {
      const cardScope = element.closest('[data-card-theme]') as HTMLElement | null
      if (cardScope) {
        setTheme(cardScope.dataset.cardTheme === 'dark' ? 'dark' : 'light')
        return
      }
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    }
    readTheme()

    const observers: MutationObserver[] = []
    let current: HTMLElement | null = element
    while (current) {
      const observer = new MutationObserver(readTheme)
      observer.observe(current, { attributes: true, attributeFilter: ['class', 'data-card-theme'] })
      observers.push(observer)
      current = current.parentElement
    }

    return () => observers.forEach((o) => o.disconnect())
  }, [ref])

  return { theme }
}

// Spring config for enter/cross: underdamped so corners overshoot and
// oscillate 2-3 times like a heavy mass snapping into place.
const ENTER_SPRING = { type: 'spring', stiffness: 280, damping: 14, mass: 1.8 } as const
// Spring config for release: same mass/stiffness, slightly more damping so
// the return oscillates but settles back to rest a touch more gently.
const RETURN_SPRING = { type: 'spring', stiffness: 280, damping: 16, mass: 1.8 } as const

// ── Homography (corner-pin) math ──────────────────────────────────────────────
// Given four target corners [tl, tr, br, bl] and the container's natural
// dimensions (w, h), compute the CSS matrix3d string that warps the natural
// rect [(0,0),(w,0),(w,h),(0,h)] onto that target quadrilateral.
//
// Derivation: we want a 3x3 projective matrix H such that for each source
// corner (uᵢ, vᵢ), H·(uᵢ, vᵢ, 1)ᵀ is homogeneous-equal to (xᵢ, yᵢ, 1)ᵀ. With
// H = [[a,c,e],[b,d,f],[g,h,1]] (bottom-right fixed to 1), each pair
// (source → target) gives two linear equations in the 8 unknowns
// (a,b,c,d,e,f,g,h):
//
//   a·u + c·v + e − g·u·x − h·v·x = x
//   b·u + d·v + f − g·u·y − h·v·y = y
//
// Four corner pairs → 8 equations → solve by Gaussian elimination. Then we
// embed H into a 4x4 CSS matrix3d (column-major), with the perspective
// components g, h placed in the w-row slots:
//
//   matrix3d(
//     a, b, 0, g,
//     c, d, 0, h,
//     0, 0, 1, 0,
//     e, f, 0, 1
//   )

type Pt = readonly [number, number]

function solve8(
  A: number[][], // 8x8
  b: number[], // length 8
): number[] {
  // Gaussian elimination with partial pivoting on an 8x9 augmented matrix.
  const n = 8
  const M: number[][] = A.map((row, i) => [...row, b[i]])

  for (let col = 0; col < n; col++) {
    // Partial pivot: find row with largest absolute value in this column.
    let pivot = col
    let maxAbs = Math.abs(M[col][col])
    for (let r = col + 1; r < n; r++) {
      const v = Math.abs(M[r][col])
      if (v > maxAbs) {
        maxAbs = v
        pivot = r
      }
    }
    if (maxAbs < 1e-12) {
      // Degenerate quad (collinear corners). Fall back to identity contrib.
      return [1, 0, 0, 1, 0, 0, 0, 0]
    }
    if (pivot !== col) {
      const tmp = M[col]
      M[col] = M[pivot]
      M[pivot] = tmp
    }
    // Normalize pivot row.
    const p = M[col][col]
    for (let c = col; c <= n; c++) M[col][c] /= p
    // Eliminate other rows.
    for (let r = 0; r < n; r++) {
      if (r === col) continue
      const factor = M[r][col]
      if (factor === 0) continue
      for (let c = col; c <= n; c++) {
        M[r][c] -= factor * M[col][c]
      }
    }
  }

  const x: number[] = new Array(n)
  for (let i = 0; i < n; i++) x[i] = M[i][n]
  return x
}

function cornerPinMatrix3d(
  tl: Pt,
  tr: Pt,
  br: Pt,
  bl: Pt,
  w: number,
  h: number,
): string {
  // Source corners are the container's natural rect.
  const src: readonly Pt[] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ] as const
  const dst: readonly Pt[] = [tl, tr, br, bl] as const

  // Build the 8x8 system. Unknown order: [a, b, c, d, e, f, g, h].
  const A: number[][] = []
  const rhs: number[] = []

  for (let i = 0; i < 4; i++) {
    const [u, v] = src[i]
    const [x, y] = dst[i]
    // x-row:  a·u + c·v + e − g·u·x − h·v·x = x
    A.push([u, 0, v, 0, 1, 0, -u * x, -v * x])
    rhs.push(x)
    // y-row:  b·u + d·v + f − g·u·y − h·v·y = y
    A.push([0, u, 0, v, 0, 1, -u * y, -v * y])
    rhs.push(y)
  }

  const [a, b, c, d, e, f, g, hh] = solve8(A, rhs)

  // Embed the 3x3 homography into a 4x4 CSS matrix3d (column-major).
  //
  //   matrix3d(
  //     a, b, 0, g,
  //     c, d, 0, h,
  //     0, 0, 1, 0,
  //     e, f, 0, 1
  //   )
  return `matrix3d(${a},${b},0,${g},${c},${d},0,${hh},0,0,1,0,${e},${f},0,1)`
}

// ── Hover targets ─────────────────────────────────────────────────────────────
// Multipliers of W / H; materialized into pixels at animation start from the
// container's real size. Deliberately asymmetric L/R (1.00 vs 1.05, 1.55 vs
// 1.48) so the stretched trapezoid doesn't feel mirror-perfect.
const X_OUTER_LEFT = -1.0 // mult of W — left column pulled hard outward (-X)
const X_OUTER_RIGHT = 1.05 // mult of W — right column pushed past the edge (+X)
const Y_LEFT_MAG = 1.55 // mult of H — left-corner vertical magnitude
const Y_RIGHT_MAG = 1.48 // mult of H — right-corner vertical magnitude

// Mode reflects which warp is currently engaged.
//   'none'   — pointer outside; all 8 offsets = 0.
//   'top'    — pointer in upper half; TL/TR pull UP (-Y) + outward.
//   'bottom' — pointer in lower half; BL/BR pull DOWN (+Y) + outward.
type Mode = 'none' | 'top' | 'bottom'

// The 8 corner offsets, in a fixed order matching the motion-value tuple
// the panel owns: [tlX, tlY, trX, trY, blX, blY, brX, brY].
type Offsets8 = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]

// Compute the target offset vector (in pixel space) for a given mode.
function targetsFor(mode: Mode, w: number, h: number): Offsets8 {
  if (mode === 'top') {
    return [
      X_OUTER_LEFT * w, // tlX
      -Y_LEFT_MAG * h, // tlY (UP)
      X_OUTER_RIGHT * w, // trX
      -Y_RIGHT_MAG * h, // trY (UP)
      0,
      0, // blX, blY pinned
      0,
      0, // brX, brY pinned
    ] as const
  }
  if (mode === 'bottom') {
    return [
      0,
      0, // tlX, tlY pinned
      0,
      0, // trX, trY pinned
      X_OUTER_LEFT * w, // blX
      Y_LEFT_MAG * h, // blY (DOWN)
      X_OUTER_RIGHT * w, // brX
      Y_RIGHT_MAG * h, // brY (DOWN)
    ] as const
  }
  return [0, 0, 0, 0, 0, 0, 0, 0] as const
}

export default function WildMorph({ text = 'wild' }: { text?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme(containerRef)
  const isDark = theme === 'dark'
  const bgColor = isDark ? DARK_BG : LIGHT_BG
  const inkColor = isDark ? LIGHT_BG : DARK_BG

  // Eight motion values — one X + one Y per corner. All start at 0 → identity
  // matrix → static text.
  const tlX: MotionValue<number> = useMotionValue(0)
  const tlY: MotionValue<number> = useMotionValue(0)
  const trX: MotionValue<number> = useMotionValue(0)
  const trY: MotionValue<number> = useMotionValue(0)
  const blX: MotionValue<number> = useMotionValue(0)
  const blY: MotionValue<number> = useMotionValue(0)
  const brX: MotionValue<number> = useMotionValue(0)
  const brY: MotionValue<number> = useMotionValue(0)

  // Container ref — where we write `style.transform` imperatively every frame.
  const warpRef = useRef<HTMLDivElement>(null)
  // Host of the hover / touch area.
  const panelRef = useRef<HTMLDivElement>(null)
  // SVG and text element refs for getBBox measurement.
  const svgRef = useRef<SVGSVGElement>(null)
  const textRef = useRef<SVGTextElement>(null)

  // Natural (un-warped) container size in px. Stored in a ref so the matrix
  // builder doesn't need a render to re-read it.
  const sizeRef = useRef<{ w: number; h: number }>({ w: 1, h: 1 })

  // Active animation controls, so a transition can cancel any in-flight tweens
  // before firing fresh ones.
  const controlsRef = useRef<AnimationPlaybackControls[]>([])

  // Current mode — kept in a ref so the pointer-move handler can dedupe
  // without triggering re-renders.
  const modeRef = useRef<Mode>('none')

  // Natural SVG bounding box dimensions, derived from getBBox().
  // ascent = -getBBox().y (distance from baseline up to top of ink).
  const [natural, setNatural] = useState({ width: 1, height: 1, ascent: 1 })

  // Responsive font size — JS equivalent of clamp(4rem, 12vw, 9rem).
  const [fontSize, setFontSize] = useState(144)

  // Track responsive font size based on viewport width.
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth
      const clamped = Math.min(Math.max(vw * 0.12, 64), 144)
      setFontSize(clamped)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Re-measure the SVG text bounding box whenever fontSize or text changes.
  useEffect(() => {
    const el = textRef.current
    if (!el) return
    const bbox = el.getBBox()
    if (bbox.width === 0) return
    setNatural({
      width: bbox.width,
      height: bbox.height,
      ascent: -bbox.y, // y is negative: distance from baseline up to top of ink
    })
  }, [fontSize, text])

  // Build the matrix3d string from all 8 motion values and write it.
  const applyTransform = () => {
    const el = warpRef.current
    if (!el) return
    const { w, h } = sizeRef.current

    const tl: Pt = [0 + tlX.get(), 0 + tlY.get()]
    const tr: Pt = [w + trX.get(), 0 + trY.get()]
    const br: Pt = [w + brX.get(), h + brY.get()]
    const bl: Pt = [0 + blX.get(), h + blY.get()]

    el.style.transform = cornerPinMatrix3d(tl, tr, br, bl, w, h)
  }

  // When natural dimensions update, sync sizeRef and recompute the transform.
  useEffect(() => {
    if (natural.width > 1 && natural.height > 1) {
      sizeRef.current = { w: natural.width, h: natural.height }
      applyTransform()
    }
    // applyTransform reads refs only; not a dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [natural])

  // Measure natural size via ResizeObserver. The warp container keeps its
  // intrinsic layout size (it's the transform that changes), so we can read
  // offsetWidth / offsetHeight directly.
  useEffect(() => {
    const el = warpRef.current
    if (!el) return

    const update = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      if (w > 0 && h > 0) {
        sizeRef.current = { w, h }
        // Rebuild once with fresh dimensions (in case we're at rest with all
        // offsets at 0, this still produces identity — which is correct).
        applyTransform()
      }
    }

    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()

    return () => ro.disconnect()
    // applyTransform reads refs only; not a dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // One subscription per motion value — all eight tick in the same animation
  // frame, so any change event means the whole frame is ready to paint.
  useMotionValueEvent(tlX, 'change', applyTransform)
  useMotionValueEvent(tlY, 'change', applyTransform)
  useMotionValueEvent(trX, 'change', applyTransform)
  useMotionValueEvent(trY, 'change', applyTransform)
  useMotionValueEvent(blX, 'change', applyTransform)
  useMotionValueEvent(blY, 'change', applyTransform)
  useMotionValueEvent(brX, 'change', applyTransform)
  useMotionValueEvent(brY, 'change', applyTransform)

  // ── Mode orchestration ─────────────────────────────────────────────────────
  const stopAll = () => {
    for (const c of controlsRef.current) c.stop()
    controlsRef.current = []
  }

  // Apply a mode change: cancel in-flight tweens, switch transform-origin, and
  // animate all 8 motion values to the target vector for the new mode.
  const applyMode = (next: Mode) => {
    if (next === modeRef.current) return
    modeRef.current = next

    // Always keep transform-origin at '0 0'. The matrix3d homography already
    // pins the correct corners via the target quad — no origin trick needed.
    // Using any other origin pre-shifts coordinates before the matrix, feeding
    // out-of-domain inputs to the homography and causing wild extrapolation.
    if (warpRef.current) {
      warpRef.current.style.transformOrigin = '0 0'
    }

    stopAll()

    const { w, h } = sizeRef.current
    const targets = targetsFor(next, w, h)

    // Faster, punchier curve when warping in / crossing; gentler easeOut on
    // return to identity.
    const opts = next === 'none' ? RETURN_SPRING : ENTER_SPRING

    controlsRef.current = [
      animate(tlX, targets[0], opts),
      animate(tlY, targets[1], opts),
      animate(trX, targets[2], opts),
      animate(trY, targets[3], opts),
      animate(blX, targets[4], opts),
      animate(blY, targets[5], opts),
      animate(brX, targets[6], opts),
      animate(brY, targets[7], opts),
    ]
  }

  // Cleanup on unmount.
  useEffect(() => {
    return () => stopAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Derive mode from a clientY relative to the panel's bounding rect.
  // Returns 'top' for upper half, 'bottom' for lower half, 'none' if outside.
  const modeFromClientY = (clientY: number): Mode => {
    const el = panelRef.current
    if (!el) return 'none'
    const rect = el.getBoundingClientRect()
    if (clientY < rect.top || clientY > rect.bottom) return 'none'
    return clientY < rect.top + rect.height / 2 ? 'top' : 'bottom'
  }

  // ── Pointer (mouse + pen) handlers ─────────────────────────────────────────
  // Unified pointer handlers — covers mouse, touch, and pen in one path.
  // setPointerCapture keeps move/up events firing even if pointer drifts outside.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    applyMode(modeFromClientY(e.clientY))
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    applyMode(modeFromClientY(e.clientY))
  }

  const onPointerUp = () => applyMode('none')
  const onPointerLeave = () => applyMode('none')
  const onPointerCancel = () => applyMode('none')

  return (
    <div
      ref={(el) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      className="relative flex min-h-screen w-full select-none items-center justify-center"
      style={{
        backgroundColor: bgColor,
        perspective: '1400px',
        perspectiveOrigin: '50% 50%',
        cursor: 'crosshair',
        touchAction: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerCancel}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');`}</style>

      <div
        ref={warpRef}
        className="relative"
        style={{
          transformOrigin: '0 0',
          willChange: 'transform',
          display: 'inline-block',
        }}
      >
        <svg
          ref={svgRef}
          style={{ display: 'block', overflow: 'visible' }}
          width={natural.width}
          height={natural.height}
        >
          <text
            ref={textRef}
            x={0}
            y={natural.ascent}
            fontFamily='Anton, "Arial Narrow", Impact, sans-serif'
            fontStyle="italic"
            fontWeight={400}
            fontSize={fontSize}
            letterSpacing="-0.02em"
            fill={inkColor}
          >
            {text}
          </text>
        </svg>
      </div>
    </div>
  )
}
