'use client'
// npm install framer-motion @phosphor-icons/react

import { useEffect, useRef, type RefObject } from 'react'
import {
  cubicBezier,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { CaretDown } from '@phosphor-icons/react'

const PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1634573826817-27d9e8da08df?w=1920&h=1080&fit=crop&crop=center&auto=format',
    alt: 'Modern structure mirrored in still water',
    title: 'Break Patterns',
  },
  {
    src: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=1920&h=1080&fit=crop&crop=center&auto=format',
    alt: 'Concrete facade seen from below in hard grayscale light',
    title: 'Push Forward',
  },
  {
    src: 'https://images.unsplash.com/photo-1532456745301-b2c645d8b80d?w=1920&h=1080&fit=crop&crop=center&auto=format',
    alt: 'Repeating white concrete balconies forming a dense pattern',
    title: 'Cut Through',
  },
  {
    src: 'https://images.unsplash.com/photo-1522743791393-522312deeebf?w=1920&h=1080&fit=crop&crop=center&auto=format',
    alt: 'Monolithic gray concrete mass against an open sky',
    title: 'Hold Steady',
  },
  {
    src: 'https://images.unsplash.com/photo-1483366774565-c783b9f70e2c?w=1920&h=1080&fit=crop&crop=center&auto=format',
    alt: 'Sharp geometric underside of a concrete building',
    title: 'Leave Marks',
  },
] as const

// Pinned on the section root so the type looks the same wherever this is
// pasted instead of inheriting whatever the host page happens to use. Manrope
// first because that is what it was designed against; the rest is a grotesque
// fallback chain that keeps the same wide, flat-sided feel.
const TYPEFACE =
  "'Manrope', 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif"

// Pacing knob. Every wipe and hold is a fraction of this height, so raising it
// slows the whole sequence without changing the rhythm between wipes.
const SECTION_HEIGHT = '1100vh'

// Each transition reveals from a different edge. The key names the direction
// the reveal travels, and the value is the fully hidden starting clip.
// Every inset slot carries an explicit percentage: Framer Motion cannot
// interpolate an inset() that mixes unitless 0 with 0%, and silently emits an
// invalid value the browser drops to clip-path: none (fully unclipped).
const HIDDEN_CLIP = {
  down: 'inset(0% 0% 100% 0%)',
  right: 'inset(0% 100% 0% 0%)',
  up: 'inset(100% 0% 0% 0%)',
  left: 'inset(0% 0% 0% 100%)',
} as const
const REVEALED_CLIP = 'inset(0% 0% 0% 0%)'

const DIRECTIONS = ['down', 'right', 'up', 'left'] as const

type Direction = (typeof DIRECTIONS)[number]

// Photo 0 is the base layer and is always visible. Every later photo gets an
// equal slice of the scroll, wiping in over the middle of its slice so the
// composition holds still before and after the cut.
const WIPE_SEQUENCE = PHOTOS.slice(1).map((photo, index) => {
  const segment = 1 / (PHOTOS.length - 1)
  const segmentStart = index * segment
  const from = segmentStart + segment * 0.18
  const to = segmentStart + segment * 0.72

  return {
    photo,
    direction: DIRECTIONS[index % DIRECTIONS.length],
    from,
    to,
    // The type keeps moving a beat past its own wipe, so the frame lands first
    // and the headline resolves into it instead of arriving pre-set.
    settled: to + (to - from) * 0.45,
  }
})

const TOTAL_LABEL = String(PHOTOS.length).padStart(2, '0')

// Type arrival, driven by each frame's own wipe. The headline enters loose and
// pushed along the direction the wipe travels, then tightens and locks. Tracking
// is in em so the arrival reads the same at any size. The old version ticked one
// shared spacing value on every cut, which twitched every title at once,
// including the ones nothing was happening to.
const ENTER_TRACKING = 0.16
const SETTLED_TRACKING = 0.02
const ENTER_OFFSET = 48
const ENTER_EASE = cubicBezier(0.16, 1, 0.3, 1)

// Which way the headline is pushed before it settles: with the wipe, never
// against it, so the type and the reveal read as one gesture.
const ENTER_FROM = {
  down: { axis: 'y', sign: -1 },
  right: { axis: 'x', sign: -1 },
  up: { axis: 'y', sign: 1 },
  left: { axis: 'x', sign: 1 },
} as const

function findNearestScrollContainer(element: HTMLElement): HTMLElement | null {
  let ancestor = element.parentElement

  while (ancestor) {
    const { overflowY } = window.getComputedStyle(ancestor)

    // The overflow check alone is not enough: an element with
    // `overflow-x: hidden` computes overflowY to `auto` even though it never
    // scrolls, and `body { overflow-x: hidden }` is on half the pages this
    // could be pasted into. Requiring real overflow keeps the walk going.
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      ancestor.scrollHeight > ancestor.clientHeight
    ) {
      return ancestor
    }

    ancestor = ancestor.parentElement
  }

  return null
}

// Progress is measured from the wrapper's own viewport rect rather than through
// Framer Motion's container option, which requires the scrolling ancestor to be
// non-static. Reading getBoundingClientRect keeps this correct inside an app
// shell that scrolls an inner div and on a page that scrolls the window.
function useElementScrollProgress(targetRef: RefObject<HTMLElement | null>): {
  progress: MotionValue<number>
  viewportHeight: MotionValue<number>
} {
  const progress = useMotionValue(0)
  // The height of whatever actually scrolls. The sticky panel sizes off this
  // instead of 100vh, which is only correct when the scroller IS the viewport:
  // inside an app shell with a fixed header, or on iOS where 100vh is the large
  // viewport, a 100vh panel hangs below the visible area and clips its own
  // bottom chrome. 0 means "not measured yet" and falls back to 100vh.
  const viewportHeight = useMotionValue(0)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const scrollContainer = findNearestScrollContainer(target)
    let animationFrame: number | null = null

    const updateProgress = () => {
      animationFrame = null

      const rect = target.getBoundingClientRect()
      const containerTop = scrollContainer
        ? scrollContainer.getBoundingClientRect().top
        : 0
      const nextViewportHeight =
        scrollContainer?.clientHeight ?? window.innerHeight
      const scrollDistance = Math.max(rect.height - nextViewportHeight, 1)
      const nextProgress = Math.min(
        Math.max((containerTop - rect.top) / scrollDistance, 0),
        1,
      )

      viewportHeight.set(nextViewportHeight)
      progress.set(nextProgress)
    }

    const requestUpdate = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateProgress)
      }
    }

    updateProgress()
    // Both, always: the container listener covers an app shell that scrolls an
    // inner div, and window covers a plain page. Scroll events do not bubble
    // from an inner scroller to window, so neither one alone is enough.
    scrollContainer?.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      scrollContainer?.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame)
      }
    }
  }, [progress, targetRef, viewportHeight])

  return { progress, viewportHeight }
}

function useWipeClip(
  progress: MotionValue<number>,
  from: number,
  to: number,
  hidden: string,
  reduceMotion: boolean,
): MotionValue<string> {
  const wipe = useTransform(progress, [from, to], [hidden, REVEALED_CLIP])
  const snap = useTransform(progress, (value) =>
    value < (from + to) / 2 ? hidden : REVEALED_CLIP,
  )

  return reduceMotion ? snap : wipe
}

type WipeStep = (typeof WIPE_SEQUENCE)[number]

function PhotoLayer({
  step,
  progress,
  reduceMotion,
}: {
  step: WipeStep
  progress: MotionValue<number>
  reduceMotion: boolean
}) {
  const clipPath = useWipeClip(
    progress,
    step.from,
    step.to,
    HIDDEN_CLIP[step.direction],
    reduceMotion,
  )
  const enter = useTransform(progress, [step.from, step.settled], [0, 1], {
    ease: ENTER_EASE,
  })

  return (
    <motion.div
      data-layer="photo"
      className="absolute inset-0 isolate"
      style={{ clipPath, willChange: 'clip-path' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={step.photo.src}
        alt={step.photo.alt}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <FrameTitle
        title={step.photo.title}
        enter={reduceMotion ? undefined : enter}
        direction={step.direction}
      />
    </motion.div>
  )
}

// The title lives inside its own photo layer rather than above the whole
// stack. Text has a transparent background, so a shared layer would let every
// title accumulate on screen at once. Nested here, the next opaque photo
// covers the previous title for free and exactly one title is ever visible.
// `isolate` on the layer keeps the difference blend scoped to its own photo.
//
// Each word is its own line rather than a natural wrap: the animated letter
// spacing changes the measured text width, so a short title reflowed from two
// lines to one halfway through its own cut. Stacking the words makes the line
// count a property of the copy, not of the current spacing or viewport width.
function FrameTitle({
  title,
  enter,
  direction,
}: {
  title: string
  // Absent for the frame that is already on screen at rest, and whenever the
  // viewer asked for reduced motion: the title just sits at its settled state.
  enter?: MotionValue<number>
  direction?: Direction
}) {
  const atRest = useMotionValue(1)
  const arrival = enter ?? atRest
  const from = direction ? ENTER_FROM[direction] : null

  const tracking = useTransform(
    arrival,
    [0, 1],
    [ENTER_TRACKING, SETTLED_TRACKING],
  )
  const letterSpacing = useTransform(tracking, (value) => `${value}em`)
  // Letter spacing also lands after the last letter, so wide tracking drags the
  // word off centre. Cancelling it on the trailing edge keeps every line
  // optically centred while it tightens.
  const trailing = useTransform(tracking, (value) => `${-value}em`)
  const offset = useTransform(
    arrival,
    [0, 1],
    [from ? ENTER_OFFSET * from.sign : 0, 0],
  )

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center font-extrabold uppercase leading-none text-[#FFFFFF] dark:text-[#FFFFFF] md:p-8"
      style={{
        fontSize: 'clamp(32px, 14vw, 160px)',
        letterSpacing,
        mixBlendMode: 'difference',
        x: from?.axis === 'x' ? offset : 0,
        y: from?.axis === 'y' ? offset : 0,
      }}
    >
      {title.split(' ').map((word, index) => (
        <motion.span key={`${word}-${index}`} style={{ marginRight: trailing }}>
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

export default function FrameWipe() {
  const wrapperRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion() ?? false
  const { progress: scrollYProgress, viewportHeight } =
    useElementScrollProgress(wrapperRef)

  // 100vh until the real scroller has been measured, so the server render and
  // the first client render agree.
  const panelHeight = useTransform(viewportHeight, (value) =>
    value > 0 ? `${value}px` : '100vh',
  )

  // The scroll cue has done its job the moment the first cut starts moving.
  const cueOpacity = useTransform(scrollYProgress, [0, 0.03], [1, 0])

  // Counts the cuts that have passed their midpoint, so the label flips with
  // the frame the viewer is actually looking at.
  const frameLabel = useTransform(scrollYProgress, (value) => {
    const passed = WIPE_SEQUENCE.filter(
      (step) => value >= (step.from + step.to) / 2,
    ).length

    return String(passed + 1).padStart(2, '0')
  })

  return (
    <section
      ref={wrapperRef}
      aria-label="Frame Wipe editorial gallery"
      className="relative min-h-screen w-full bg-[#0A0A0A] dark:bg-[#0A0A0A]"
      style={{ height: SECTION_HEIGHT, fontFamily: TYPEFACE }}
    >
      <motion.div
        className="sticky top-0 w-full overflow-hidden bg-[#0A0A0A] dark:bg-[#0A0A0A]"
        style={{ height: panelHeight }}
      >
        {/* The visible titles are decorative duplicates of this one heading, so
            the sequence reads as a single headline to a screen reader. h2, not
            h1: this is a section pasted into someone else's page, which already
            has its own top-level heading. */}
        <h2 className="sr-only">
          {PHOTOS.map((photo) => photo.title).join('. ')}
        </h2>

        <div className="absolute inset-0 isolate">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PHOTOS[0].src}
            alt={PHOTOS[0].alt}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <FrameTitle title={PHOTOS[0].title} />
        </div>

        {WIPE_SEQUENCE.map((step) => (
          <PhotoLayer
            key={step.photo.src}
            step={step}
            progress={scrollYProgress}
            reduceMotion={shouldReduceMotion}
          />
        ))}

        {/* Orientation chrome. White on difference blend inverts against
            whatever frame is underneath, so it stays legible without a scrim
            and reads as part of the same typographic system as the headline. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 text-[#FFFFFF] dark:text-[#FFFFFF]"
          style={{ mixBlendMode: 'difference' }}
        >
          <div className="absolute left-4 top-4 flex flex-col gap-2 md:left-8 md:top-8">
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">
              Selected Works
            </span>
            <span className="text-[12px] uppercase tracking-[0.18em]">
              Concrete and Light
            </span>
          </div>

          <div className="absolute right-4 top-4 text-[12px] font-semibold uppercase tracking-[0.18em] md:right-8 md:top-8">
            <motion.span>{frameLabel}</motion.span>
            <span className="opacity-70"> / {TOTAL_LABEL}</span>
          </div>

          <motion.div
            className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 md:bottom-8"
            style={{ opacity: cueOpacity }}
          >
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">
              Scroll
            </span>
            <motion.span
              className="flex"
              animate={shouldReduceMotion ? undefined : { y: [0, 6, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <CaretDown size={16} weight="regular" />
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
