'use client'

// npm install framer-motion react

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'

// ─── Swap this to customise the ring text ─────────────────────────────────────
const PHRASE = 'COPY ✦ PASTE ✦ SHIP ✦ REPEAT ✦ '

// Static tilt + interaction tuning
const TILT_REST = 24 // rotateX at rest — a flat-ish ellipse
const TILT_HOVER = 24 // rotateX while hovered — no tilt change on hover
const SECONDS_PER_TURN = 14 // full rotation duration
const SPEED_HOVER = 0.3 // hover slows spin to 30%
const RADIUS_FRACTION = 0.35 // ring radius ≈ 35% of min(w, h) → diameter ≈ 70%
const STAR_SCALE = 0.65 // ✦ separators render smaller than letters

// ─── Local theme hook — observes `dark` class on <html> ──────────────────────
function useTheme(ref: React.RefObject<HTMLElement | null>) {
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

export default function HaloType() {
  const rootRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme(rootRef)
  const isDark = theme === 'dark'

  // Container size → drives radius + font-size
  const [size, setSize] = useState(480)
  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      setSize(Math.max(260, Math.min(rect.width, rect.height)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Reduced motion — freeze at a pleasing angle so both arcs are still visible.
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Hover / touch state drives a smoothly-interpolated "engagement" value in [0, 1].
  const engagement = useMotionValue(0)
  const engagementSmooth = useSpring(engagement, {
    stiffness: 120,
    damping: 22,
    mass: 0.6,
  })

  // Tilt + spin-speed multiplier derive from engagement.
  const tilt = useTransform(engagementSmooth, [0, 1], [TILT_REST, TILT_HOVER])
  const speedMul = useTransform(engagementSmooth, [0, 1], [1, SPEED_HOVER])

  // Continuous Y-rotation via MotionValue — no useState for animation values.
  const rotateY = useMotionValue(0)
  const prevTs = useRef<number | null>(null)

  // Refs to each rendered glyph so the per-frame loop can fade them smoothly
  // near the ±90° seam — a hard `backface-visibility` cutoff shows pixel-shred
  // artifacts at near-perpendicular angles.
  const frontRefs = useRef<Array<HTMLSpanElement | null>>([])
  const backRefs = useRef<Array<HTMLSpanElement | null>>([])

  // Geometry
  const radius = size * RADIUS_FRACTION
  const fontSize = Math.max(20, Math.min(48, radius * 0.22))
  const circumference = 2 * Math.PI * radius

  // Measure each PHRASE character's rendered width using a hidden DOM node +
  // Range API. Matches the live glyph rendering (font, kerning, subpixel)
  // exactly — canvas measureText can drift from DOM layout.
  const [phraseWidths, setPhraseWidths] = useState<number[]>([])
  const measureRef = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return
    const el = measureRef.current
    if (!el) return
    const measure = () => {
      const spans = el.querySelectorAll<HTMLSpanElement>('[data-m-char]')
      if (!spans.length) return
      const widths = Array.from(spans).map((s) => s.getBoundingClientRect().width)
      setPhraseWidths(widths)
    }
    measure()
    // Re-measure whenever any child's rendered size changes — this catches
    // the moment a late-loading webfont swaps in and fixes advance widths
    // the fallback font got wrong.
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    if (fonts?.ready) {
      fonts.ready.then(measure)
    }
    return () => ro.disconnect()
  }, [fontSize])

  // Tile the phrase around the ring, proportional to measured widths.
  const phraseWidth = phraseWidths.reduce((a, b) => a + b, 0)
  const repeats = phraseWidth > 0
    ? Math.max(1, Math.round(circumference / phraseWidth))
    : Math.max(1, Math.round(circumference / (PHRASE.length * fontSize * 0.55)))
  const characters = PHRASE.repeat(repeats).split('')
  const totalChars = characters.length
  const totalTiledWidth = phraseWidth * repeats
  // Per-character center angles (proportional spacing). Falls back to equal
  // spacing on the very first render before measurement lands.
  const charAngles: number[] = []
  if (totalTiledWidth > 0) {
    let cum = 0
    characters.forEach((_, i) => {
      const w = phraseWidths[i % PHRASE.length] ?? 0
      charAngles.push(((cum + w / 2) / totalTiledWidth) * 360)
      cum += w
    })
  } else {
    for (let i = 0; i < totalChars; i++) {
      charAngles.push((i / totalChars) * 360)
    }
  }

  // Advance the spin + update per-letter opacity each frame. Opacity is a
  // smooth cos() of each letter's effective angle vs. camera — the front
  // twin fades out and the back twin fades in as letters rotate past the
  // perpendicular, with no hard cutoff artifacts.
  useAnimationFrame((t) => {
    if (reducedMotion) {
      rotateY.set(30)
    } else {
      const last = prevTs.current
      prevTs.current = t
      if (last != null) {
        const dt = (t - last) / 1000
        const degPerSec = 360 / SECONDS_PER_TURN
        const next = rotateY.get() + degPerSec * speedMul.get() * dt
        rotateY.set(next % 360)
      }
    }
    const ry = rotateY.get()
    for (let i = 0; i < charAngles.length; i++) {
      const eff = ((ry + charAngles[i]) % 360 + 360) % 360
      const norm = eff > 180 ? eff - 360 : eff
      const c = Math.cos((norm * Math.PI) / 180)
      const frontOp = c > 0 ? c : 0
      const backOp = c < 0 ? -c : 0
      const fe = frontRefs.current[i]
      const be = backRefs.current[i]
      if (fe) fe.style.opacity = String(frontOp)
      if (be) be.style.opacity = String(backOp)
    }
  })

  // Colours — raw hex only; no design tokens inside the component.
  const bg = isDark ? '#0A0A0A' : '#F5F1E8'
  const fg = isDark ? '#F5F1E8' : '#0A0A0A'
  // Back-arc letters are rendered upside-down (not mirror-flipped) via a twin
  // glyph facing inward. They get a dimmer hue so the front arc stays hero.
  const fgBack = isDark ? '#7A756C' : '#6A655C'
  const vignette = isDark
    ? 'radial-gradient(60% 60% at 50% 52%, rgba(245,241,232,0.10) 0%, rgba(245,241,232,0.04) 35%, rgba(10,10,10,0) 70%)'
    : 'radial-gradient(60% 60% at 50% 52%, rgba(10,10,10,0.08) 0%, rgba(10,10,10,0.03) 35%, rgba(245,241,232,0) 70%)'

  // Shared pointer handlers — work for hover AND touch.
  const handleEngage = () => engagement.set(1)
  const handleRelease = () => engagement.set(0)

  // Build the CSS transform for the ring container from two MotionValues.
  const ringTransform = useTransform(
    [tilt, rotateY],
    ([x, y]) => `rotateX(${x}deg) rotateY(${y}deg)`,
  )

  // Fade the extreme left/right edges of the stage so any residual seam
  // pixels at the ±90° transition are masked cleanly. Long falloff so the
  // corners are almost invisible.
  const edgeMask =
    'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)'

  return (
    <div
      ref={rootRef}
      className="flex min-h-screen w-full items-center justify-center"
      style={{ backgroundColor: bg }}
    >
      <div
        ref={wrapRef}
        className="relative flex h-[min(100vh,100vw)] w-full items-center justify-center overflow-hidden"
        style={{
          touchAction: 'none',
          maskImage: edgeMask,
          WebkitMaskImage: edgeMask,
        }}
        onPointerEnter={handleEngage}
        onPointerLeave={handleRelease}
        onPointerDown={handleEngage}
        onPointerUp={handleRelease}
        onPointerCancel={handleRelease}
      >
        {/* Soft radial vignette behind the ring */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: vignette,
            pointerEvents: 'none',
          }}
        />

        {/* Hidden per-character spans used to measure exact advance widths.
            Each character gets its own inline-block sibling, styled the same
            as the live glyph (including the smaller star size) so widths
            match what renders on the ring. */}
        <span
          ref={measureRef}
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            visibility: 'hidden',
            pointerEvents: 'none',
            whiteSpace: 'pre',
            fontFamily:
              'var(--font-sans), ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}
        >
          {PHRASE.split('').map((ch, i) => (
            <span
              key={i}
              data-m-char=""
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
                fontSize: ch === '✦' ? fontSize * STAR_SCALE : fontSize,
              }}
            >
              {ch}
            </span>
          ))}
        </span>

        {/* Perspective stage */}
        <div
          style={{
            perspective: '1200px',
            perspectiveOrigin: '50% 50%',
            width: size,
            height: size,
            position: 'relative',
          }}
        >
          <motion.div
            aria-label={PHRASE.trim()}
            style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              transform: ringTransform,
              willChange: 'transform',
            }}
          >
            {characters.map((ch, i) => {
              const angle = charAngles[i] ?? (i / totalChars) * 360
              const display = ch === ' ' ? ' ' : ch
              const base = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`
              const glyphSize = ch === '✦' ? fontSize * STAR_SCALE : fontSize
              const glyphStyle: React.CSSProperties = {
                position: 'absolute',
                top: '50%',
                left: '50%',
                // Default transform-origin (center) is critical — with `0 0`
                // (top-left), narrow letters end up at different 3D positions
                // than wide letters at the same ring-angle, making the "I" in
                // SHIP look like it's on a different plane.
                transformOrigin: '50% 50%',
                fontFamily:
                  'var(--font-sans), ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
                fontWeight: 800,
                fontSize: glyphSize,
                lineHeight: 1,
                letterSpacing: '-0.01em',
                userSelect: 'none',
                whiteSpace: 'pre',
              }
              return (
                <React.Fragment key={i}>
                  {/* Front-facing glyph — visible on the front arc, upright.
                      Opacity is NOT set in the React style: the per-frame
                      loop manages it via ref so React re-renders (resize,
                      theme change) don't flash the letters to opacity 0. */}
                  <span
                    ref={(el) => {
                      frontRefs.current[i] = el
                    }}
                    style={{
                      ...glyphStyle,
                      transform: base,
                      color: fg,
                    }}
                  >
                    {display}
                  </span>
                  {/* Inward-facing twin — visible on the back arc, rotated
                      180° in its own plane so it reads upside-down instead
                      of mirror-flipped. Dimmer hue. */}
                  <span
                    ref={(el) => {
                      backRefs.current[i] = el
                    }}
                    style={{
                      ...glyphStyle,
                      transform: `${base} rotateY(180deg) rotateZ(180deg)`,
                      color: fgBack,
                    }}
                  >
                    {display}
                  </span>
                </React.Fragment>
              )
            })}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
