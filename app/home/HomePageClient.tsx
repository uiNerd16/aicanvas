'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useInView, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion'
import {
  ArrowRight,
  MagnifyingGlass,
  CopySimple,
  RocketLaunch,
  ImageSquare,
  Code,
  Palette,
  UsersThree,
  HandTap,
  CaretLeft,
  CaretRight,
  Terminal,
} from '@phosphor-icons/react'
import { buttonClasses } from '../components/Button'
import { HeaderSocials } from '../components/HeaderSocials'
import { SiteFooter } from '../components/SiteFooter'
import type { ComponentMeta } from '../lib/component-registry'
import { GITHUB_URL } from '../lib/config'
import { track } from '../lib/analytics'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  total: number
  showcase: ComponentMeta[]
  carouselItems: ComponentMeta[]
}

// ─── Platform labels ──────────────────────────────────────────────────────────

const PLATFORMS = ['Claude Code', 'Lovable', 'V0'] as const

// ─── Hello card data ─────────────────────────────────────────────────────────

const HELLO_CARDS = ['Hello', 'こんにちは', 'Bonjour', 'Hola', 'Ciao', 'Hej', 'Hallo', '你好', ':)']
const LANG_LABELS  = ['EN',    'JA',        'FR',      'ES',   'IT',   'SV',  'DE',   'ZH' ]

// Position 0 = front, 1-5 = visible stack, 6-7 = parked behind stack (zIndex 0).
// The exiting card uses a dedicated keyframe animation (swing right → arc to back)
// rather than these positions. Positions 6-7 are the rest pose it settles into.
const CARD_POSITIONS = [
  { x: 0, y: -10, rotate:  24, scale: 1,    opacity: 1, zIndex: 10 },
  { x: 0, y:  -6, rotate:  15, scale: 0.97, opacity: 1, zIndex: 5  },
  { x: 0, y:  -3, rotate:   5, scale: 0.94, opacity: 1, zIndex: 4  },
  { x: 0, y:  -3, rotate:  -5, scale: 0.91, opacity: 1, zIndex: 3  },
  { x: 0, y:  -6, rotate: -15, scale: 0.88, opacity: 1, zIndex: 2  },
  { x: 0, y: -10, rotate: -24, scale: 0.85, opacity: 1, zIndex: 1  },
  { x: 0, y: -10, rotate: -24, scale: 0.85, opacity: 0, zIndex: 0  }, // parked behind
  { x: 0, y: -10, rotate: -24, scale: 0.85, opacity: 0, zIndex: 0  }, // parked behind
  { x: 0, y: -10, rotate: -24, scale: 0.85, opacity: 0, zIndex: 0  }, // parked behind
]

// ─── Stacked cards visual ─────────────────────────────────────────────────────

function StackedCards() {
  const N = HELLO_CARDS.length
  const [startIdx, setStartIdx] = useState(0)
  // Track which card is mid-exit so we can give it a bespoke keyframe animation
  const [exitingCard, setExitingCard] = useState<number | null>(null)
  const startIdxRef = useRef(0)

  function handleClick() {
    if (exitingCard !== null) return // ignore clicks mid-animation
    const exitIdx = startIdxRef.current % N
    startIdxRef.current = (startIdxRef.current + 1) % N
    setStartIdx(startIdxRef.current)
    setExitingCard(exitIdx)
    setTimeout(() => setExitingCard((c) => (c === exitIdx ? null : c)), 850)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mx-auto mb-10 flex h-28 w-48 cursor-pointer items-end justify-center"
      onClick={handleClick}
    >
      {HELLO_CARDS.map((text, cardIdx) => {
        const relPos = (cardIdx - startIdx + N) % N
        const pos = CARD_POSITIONS[relPos]
        const isFront = relPos === 0
        const isExiting = cardIdx === exitingCard
        // Non-exiting cards wait for the exit arc to finish (~0.9 s), then cascade
        // forward from front to back with a small stagger between each card.
        const delay = isExiting || relPos >= 6 ? 0 : 0.1 + relPos * 0.04

        return (
          <motion.div
            key={cardIdx}
            initial={{ opacity: 0, transform: 'translateX(0px) translateY(0px) rotateZ(0deg) scale(1)' }}
            animate={
              isExiting
                ? {
                    transform: [
                      'translateX(0px) translateY(-10px) rotateZ(24deg) scale(1)',
                      'translateX(80px) translateY(20px) rotateZ(60deg) scale(0.9)',
                    ],
                    opacity: [1, 0],
                  }
                : {
                    transform: `translateX(${pos.x}px) translateY(${pos.y}px) rotateZ(${pos.rotate}deg) scale(${pos.scale})`,
                    opacity: pos.opacity,
                  }
            }
            transition={
              isExiting
                ? {
                    duration: 0.8,
                    ease: 'easeOut',
                    opacity: { delay: 0.5, duration: 0.3 },
                  }
                : {
                    duration: 0.5,
                    ease: 'easeInOut',
                    delay,
                  }
            }
            drag={isFront && !isExiting ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={isFront ? (_e: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
              if (Math.abs(info.offset.x) > 40 || Math.abs(info.velocity.x) > 300) {
                handleClick()
              }
            } : undefined}
            className={`absolute flex h-20 w-28 flex-col items-center justify-center rounded-2xl border border-sand-700 bg-sand-800 transition-[border-color,box-shadow] duration-200 hover:border-sand-600 hover:shadow-lg hover:shadow-black/20 ${isFront ? 'touch-none' : ''}`}
            style={{
              zIndex: isExiting ? 11 : pos.zIndex,
              transformOrigin: 'bottom center',
              boxShadow: isFront
                ? '0 6px 28px rgba(0,0,0,0.28)'
                : '0 3px 10px rgba(0,0,0,0.14)',
            }}
          >
            {(relPos < 6 || isExiting) && (
              <span className={`text-sm font-bold leading-none ${
                (isFront || isExiting) ? 'text-olive-400'
                : relPos === 1         ? 'text-sand-300'
                : relPos === 2         ? 'text-sand-400'
                : relPos === 3         ? 'text-sand-500'
                :                        'text-sand-600'
              }`}>
                {text}
              </span>
            )}
            {isFront && !isExiting && (
              <HandTap weight="regular" size={18} className="absolute bottom-2 right-2 text-sand-500" />
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedCount({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  // Start 10% below the real number so SSR / crawlers / LLMs see real numbers in
  // the initial HTML rather than zeros. Rounded so suffixed values (%, +) still
  // read cleanly.
  const initial = Math.max(0, Math.round(to * 0.9))
  const [count, setCount] = useState(initial)

  useEffect(() => {
    if (!inView) return
    let start = initial
    const duration = 900
    const step = 16
    const increment = Math.max(1, (to - initial) / (duration / step))
    const timer = setInterval(() => {
      start += increment
      if (start >= to) { setCount(to); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [inView, to, initial])

  return <span ref={ref}>{count}{suffix}</span>
}

// ─── Showcase cycling card ────────────────────────────────────────────────────
// Cycles through component screenshots. Each card shows the component image,
// its name, category, and the four AI platforms it ships prompts for.

function ShowcaseCard({ items }: { items: ComponentMeta[] }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % items.length)
    }, 2800)
    return () => clearInterval(id)
  }, [items.length])

  const current = items[idx]
  if (!current) return null
  const categoryTag = current.tags.find((t) => t.accent)?.label ?? ''

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sand-800 bg-sand-950 shadow-2xl shadow-black/40">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-olive-500/10 blur-3xl" />

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col"
        >
          <div className="relative aspect-video overflow-hidden bg-sand-900">
            {current.image ? (
              <img
                src={current.image}
                alt={`${current.name} — ${current.description.split('.')[0]}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageSquare weight="regular" size={28} className="text-sand-700" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-sand-50">{current.name}</p>
              {categoryTag && <p className="text-xs text-sand-500">{categoryTag}</p>}
            </div>
            <div className="flex gap-1">
              {PLATFORMS.map((p) => (
                <span
                  key={p}
                  className="rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-sand-500 ring-1 ring-sand-800"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-1.5 pb-3">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1 rounded-full transition-all duration-300 ${i === idx ? 'w-4 bg-olive-500' : 'w-1 bg-sand-700'}`}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Typewriter greeting ──────────────────────────────────────────────────────

const GREETINGS = ['designer', 'developer', 'builder', 'vibe coder', 'creator', 'friend']

function CyclingGreeting() {
  const [displayText, setDisplayText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [erasing, setErasing] = useState(false)

  useEffect(() => {
    const word = GREETINGS[wordIndex]

    if (!erasing) {
      if (displayText.length < word.length) {
        const id = setTimeout(
          () => setDisplayText(word.slice(0, displayText.length + 1)),
          80,
        )
        return () => clearTimeout(id)
      } else {
        // Fully typed — pause, then start erasing
        const id = setTimeout(() => setErasing(true), 1400)
        return () => clearTimeout(id)
      }
    } else {
      if (displayText.length > 0) {
        const id = setTimeout(
          () => setDisplayText(displayText.slice(0, -1)),
          45,
        )
        return () => clearTimeout(id)
      } else {
        // Fully erased — move to next word
        const id = setTimeout(() => {
          setWordIndex((i) => (i + 1) % GREETINGS.length)
          setErasing(false)
        }, 220)
        return () => clearTimeout(id)
      }
    }
  }, [displayText, erasing, wordIndex])

  return (
    <span className="flex items-center gap-1.5 text-sm font-semibold text-sand-50">
      Hello,
      <span className="inline-flex items-center" style={{ minWidth: '6.5rem' }}>
        <span className="text-olive-500">{displayText}</span>
        <motion.span
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear', times: [0, 0.45, 0.55, 1] }}
          className="ml-px inline-block h-[13px] w-[1.5px] translate-y-px rounded-full bg-olive-500"
        />
      </span>
    </span>
  )
}

// ─── Wire icon row ────────────────────────────────────────────────────────────

const WIRE_SCALES  = [1.5, 1.2, 1.1]
const WIRE_Y       = [-8, -4, -2]
const WIRE_LABELS  = ['What?', 'Why?', 'How?']
// Only the first icon carries descriptive alt text; the other two are decorative
// duplicates and use alt="" so screen readers skip them and crawlers don't see
// the brand name repeated three times in a row.
const WIRE_ALTS    = [
  'AI Canvas component registry — animated React components preview',
  '',
  '',
]

function WireIcons() {
  const [hovered, setHovered] = useState<number | null>(null)

  function scale(idx: number) {
    if (hovered === null) return 1
    const d = Math.abs(idx - hovered)
    return WIRE_SCALES[d] ?? 1
  }

  function y(idx: number) {
    if (hovered === null) return 0
    const d = Math.abs(idx - hovered)
    return WIRE_Y[d] ?? 0
  }

  return (
    <div className="mt-16 flex justify-center gap-16 sm:mt-24">
      {[0, 1, 2].map((idx) => (
        <div
          key={idx}
          className="relative flex flex-col items-center"
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {hovered === idx && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="absolute -top-8 text-xs font-semibold text-sand-500"
              >
                {WIRE_LABELS[idx]}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.img
            src="/ai-canvas-wire.svg"
            alt={WIRE_ALTS[idx]}
            aria-hidden={WIRE_ALTS[idx] === '' ? true : undefined}
            width={28}
            height={24}
            animate={{ scale: scale(idx), y: y(idx) }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="cursor-default"
          />
        </div>
      ))}
    </div>
  )
}

// ─── Featured carousel ────────────────────────────────────────────────────────

const CAROUSEL_SPRING = { type: 'spring' as const, stiffness: 240, damping: 28 }

function CarouselCard({ entry }: { entry: ComponentMeta }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-sand-800/60 bg-sand-900">
      <div className="relative h-56 overflow-hidden bg-sand-900">
        {entry.image ? (
          <img
            src={entry.image}
            alt={`${entry.name} — ${entry.description.split('.')[0]}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          >
            <ImageSquare weight="regular" size={22} className="text-sand-700" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-4 py-5">
        <div>
          <p className="text-sm font-semibold text-sand-50">{entry.name}</p>
          <p className="text-xs text-sand-500">{entry.tags.find((t) => t.accent)?.label ?? ''}</p>
        </div>
        <ArrowRight weight="regular" size={16} className="shrink-0 text-sand-500" />
      </div>
    </div>
  )
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rawGlowX = useMotionValue(50)
  const rawGlowY = useMotionValue(50)
  const rawStripeOpacity = useMotionValue(0)
  const springConfig = { stiffness: 150, damping: 18, mass: 0.5 }
  const rotateX = useSpring(rawX, springConfig)
  const rotateY = useSpring(rawY, springConfig)
  const glowX = useSpring(rawGlowX, { stiffness: 100, damping: 22 })
  const glowY = useSpring(rawGlowY, { stiffness: 100, damping: 22 })
  const stripeOpacity = useSpring(rawStripeOpacity, { stiffness: 200, damping: 26 })

  function handleMouse(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    rawX.set(y * -16)
    rawY.set(x * 16)
    rawGlowX.set(((e.clientX - rect.left) / rect.width) * 100)
    rawGlowY.set(((e.clientY - rect.top) / rect.height) * 100)
    rawStripeOpacity.set(1)
  }

  function handleLeave() {
    rawX.set(0)
    rawY.set(0)
    rawStripeOpacity.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', position: 'relative' }}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          opacity: stripeOpacity,
          background: useMotionTemplate`radial-gradient(ellipse 600px 300px at ${glowX}% ${glowY}%, rgba(255,255,255,0.1) 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  )
}

function FeaturedCarousel({ items }: { items: ComponentMeta[] }) {
  const count = items.length
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(0)

  function goNext() { setDir(1);  setIdx((i) => (i + 1) % count) }
  function goPrev() { setDir(-1); setIdx((i) => (i - 1 + count) % count) }

  const current  = items[idx]
  const prevItem = items[(idx - 1 + count) % count]
  const nextItem = items[(idx + 1) % count]
  const prevPrev = items[(idx - 2 + count) % count]
  const nextNext = items[(idx + 2) % count]

  return (
    <section className="mt-16 sm:mt-24">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-sand-600">Featured</p>
          <h2 className="mt-1 text-xl font-bold text-sand-50">A taste of what&apos;s inside.</h2>
        </motion.div>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-sand-700 text-sand-400 transition-colors hover:border-sand-500 hover:text-sand-200"
          >
            <CaretLeft weight="regular" size={14} />
          </button>
          <button
            onClick={goNext}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-sand-700 text-sand-400 transition-colors hover:border-sand-500 hover:text-sand-200"
          >
            <CaretRight weight="regular" size={14} />
          </button>
        </div>
      </div>

      {/* Track — breaks out of the 720px container.
          The inner row is draggable horizontally so users can swipe through
          the carousel (great for mobile). Dragging past threshold advances
          one step; tapping a side card also advances it in that direction.
          The center card keeps its Link for navigation. */}
      <div className="-mx-4 overflow-hidden sm:-mx-6">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50 || info.velocity.x < -400) goNext()
            else if (info.offset.x > 50 || info.velocity.x > 400) goPrev()
          }}
          className="flex cursor-grab items-center justify-center py-4 active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        >

          {/* Far prev — outermost left, smallest. Tap cycles 2 back. */}
          <motion.div
            className="relative z-[1] -mr-[140px] hidden w-[240px] flex-shrink-0 cursor-pointer lg:block"
            animate={{ opacity: 0.3, scale: 0.75 }}
            transition={{ duration: 0.2 }}
            style={{ filter: 'blur(5px)' }}
            onClick={() => { goPrev(); goPrev() }}
          >
            <CarouselCard entry={prevPrev} />
          </motion.div>

          {/* Prev — behind center, peeking left. Tap cycles back by one. */}
          <motion.div
            className="relative z-[5] -mr-[200px] w-[300px] flex-shrink-0 cursor-pointer"
            animate={{ opacity: 0.8, scale: 0.88 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{ filter: 'blur(3px)' }}
            onClick={goPrev}
          >
            <CarouselCard entry={prevItem} />
          </motion.div>

          {/* Center — on top, with 3D tilt, links to component */}
          <div className="relative z-10 w-[min(480px,calc(100vw-80px))] flex-shrink-0">
            <TiltCard>
              <Link
                href={`/components/${current.slug}`}
                onClick={() => track('Component Card Click', { component: current.slug, position: idx, source: 'homepage-hero' })}
              >
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.div
                  key={current.slug}
                  custom={dir}
                  variants={{
                    enter: (d: number) => ({ x: d > 0 ? 180 : -180, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit:  (d: number) => ({ x: d > 0 ? -180 : 180, opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={CAROUSEL_SPRING}
                  className="flex flex-col overflow-hidden rounded-xl border border-sand-800 bg-sand-900"
                >
                  <div className="relative h-64 overflow-hidden">
                    {current.image ? (
                      <img
                        src={current.image}
                        alt={`${current.name} — ${current.description.split('.')[0]}`}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-sand-900">
                        <ImageSquare weight="regular" size={22} className="text-sand-700" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between px-4 py-5">
                    <div>
                      <p className="text-sm font-semibold text-sand-50">{current.name}</p>
                      <p className="text-xs text-sand-500">{current.tags.find((t) => t.accent)?.label ?? ''}</p>
                    </div>
                    <ArrowRight weight="regular" size={16} className="shrink-0 text-sand-500" />
                  </div>
                </motion.div>
              </AnimatePresence>
              </Link>
            </TiltCard>
          </div>

          {/* Next — behind center, peeking right. Tap advances by one. */}
          <motion.div
            className="relative z-[5] -ml-[200px] w-[300px] flex-shrink-0 cursor-pointer"
            animate={{ opacity: 0.8, scale: 0.88 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{ filter: 'blur(3px)' }}
            onClick={goNext}
          >
            <CarouselCard entry={nextItem} />
          </motion.div>

          {/* Far next — outermost right, smallest. Tap cycles 2 forward. */}
          <motion.div
            className="relative z-[1] -ml-[140px] hidden w-[240px] flex-shrink-0 cursor-pointer lg:block"
            animate={{ opacity: 0.3, scale: 0.75 }}
            transition={{ duration: 0.2 }}
            style={{ filter: 'blur(5px)' }}
            onClick={() => { goNext(); goNext() }}
          >
            <CarouselCard entry={nextNext} />
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}

// ─── HomePageClient ────────────────────────────────────────────────────────────

// ─── HomePageClient ────────────────────────────────────────────────────────────
// (DeckCarousel, SpotlightCarousel, CoverflowCarousel removed)
// ─── HomePageClient ────────────────────────────────────────────────────────────

export function HomePageClient({ total, showcase, carouselItems }: Props) {
  return (
    <div className="flex min-h-full flex-col overflow-x-hidden bg-sand-950">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20 hidden h-14 shrink-0 items-center justify-between border-b border-sand-800 bg-sand-950 px-6 md:flex">
        <span className="text-sm font-semibold text-sand-50">Overview</span>
        <HeaderSocials />
      </div>

      <main className="relative mx-auto w-full min-w-0 max-w-4xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">

        {/* ── Hero ── */}
        <section className="flex flex-col items-center text-center">
          <StackedCards />

          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="mb-5 inline-flex items-center rounded-full border border-sand-700 bg-sand-900 px-3 py-1 text-xs font-semibold text-sand-300"
          >
            Free · Open source
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.18 }}
            className="text-balance text-2xl font-extrabold tracking-tight text-sand-50 sm:text-4xl"
          >
            AI
            {' '}
            <img
              src="/ai-canvas-icon.svg"
              alt=""
              aria-hidden
              className="inline-block h-[0.6em] w-auto align-[0.02em]"
            />
            {' '}Native Components
            <br />
            <span className="mt-2 inline-block text-olive-500">for Designers and Developers.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.26 }}
            className="mt-4 max-w-xl text-base leading-relaxed text-sand-400"
          >
            Install with one command, remix with AI, or just get inspired.
            Everything here is free, open source, and ready to ship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.34 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/components"
              className={buttonClasses({ variant: 'primary', size: 'lg' })}
            >
              Browse Components
              <ArrowRight weight="regular" size={14} />
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-sand-700 px-5 py-2.5 text-sm font-semibold text-sand-300 transition-colors hover:border-sand-600 hover:text-sand-100"
            >
              View on GitHub
            </a>
          </motion.div>
        </section>

        {/* ── Stats strip ── */}
        <section className="mt-16 sm:mt-24">
          {/* Mobile: 2×2 grid with a vertical divider between each row's two items
              and no divider between rows. Desktop: single flex row with three
              dividers — the row-wrappers use `sm:contents` so they disappear from
              layout and the inner stats become direct children of the flex row. */}
          <div className="flex flex-col items-center gap-y-8 sm:flex-row sm:justify-center sm:gap-y-0">
            {(
              [
                [
                  { value: total, suffix: '+', label: 'Components' },
                  { value: 3,     suffix: '',  label: 'AI Platforms' },
                ],
                [
                  { value: 100,   suffix: '%', label: 'Open Source', minWidth: '6rem' },
                  { value: 0,     suffix: '',  prefix: '$', label: 'Free Forever' },
                ],
              ] as {
                value: number
                suffix: string
                label: string
                prefix?: string
                minWidth?: string
              }[][]
            ).map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-center sm:contents">
                {rowIdx > 0 && (
                  <div className="hidden h-10 w-px bg-sand-800 mx-6 sm:block" aria-hidden />
                )}
                {row.map(({ value, suffix, prefix = '', label, minWidth }, colIdx) => {
                  const i = rowIdx * 2 + colIdx
                  return (
                    <div key={label} className="flex items-center sm:contents">
                      {colIdx > 0 && (
                        <div className="h-10 w-px bg-sand-800 mx-6" aria-hidden />
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.06 }}
                        className="flex flex-col items-center text-center"
                      >
                        <span className="text-4xl font-bold tabular-nums text-sand-50" style={minWidth ? { minWidth } : undefined}>
                          {prefix}<AnimatedCount to={value} suffix={suffix} />
                        </span>
                        <span className="mt-1 text-xs font-medium text-sand-500">{label}</span>
                      </motion.div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </section>

        {/* ── Wire icon divider ── */}
        <WireIcons />

        {/* ── Featured carousel ── */}
        <FeaturedCarousel items={carouselItems} />



        {/* ── Who it's for ── */}
        <section className="mt-16 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.35 }}
            className="mb-8"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-sand-600">Built for everyone</p>
            <h2 className="mt-1 text-xl font-bold text-sand-50">
              For designers. For developers. For everyone in between.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-sand-400">
              Most component libraries are built for one audience. AI Canvas works however you work.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            {[
              {
                icon: <Palette weight="regular" size={18} />,
                audience: 'Designers',
                description: 'Hit "Remix with AI" and try the component in Claude Code, Lovable, or V0. One click copies the prompt — paste it and go.',
                badges: ['Claude Code', 'Lovable', 'V0'],
                badgeStyle: 'text-olive-500 ring-olive-500/30 bg-olive-500/5',
              },
              {
                icon: <Code weight="regular" size={18} />,
                audience: 'Developers',
                description: 'One CLI command installs any component into your project. TypeScript, Framer Motion, Tailwind CSS — all included, ready to run.',
                badges: ['TypeScript', 'Framer Motion', 'Tailwind CSS'],
                badgeStyle: 'text-sand-500 ring-sand-800',
              },
              {
                icon: <UsersThree weight="regular" size={18} />,
                audience: 'Everyone else',
                description: 'Not sure if you\'ll install it or remix it? Every component gives you both paths — CLI install and AI prompts, always.',
                badges: ['CLI + AI', 'Always both', 'Always free'],
                badgeStyle: 'text-sand-400 ring-sand-700',
              },
            ].map(({ icon, audience, description, badges, badgeStyle }, i) => (
              <motion.div
                key={audience}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="flex flex-col rounded-xl border border-sand-800 bg-sand-900 p-5"
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sand-800 text-sand-300">
                    {icon}
                  </div>
                  <span className="text-sm font-bold text-sand-50">{audience}</span>
                </div>
                <p className="flex-1 text-base leading-relaxed text-sand-400">{description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {badges.map((badge) => (
                    <span
                      key={badge}
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${badgeStyle}`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── How it works — vertical timeline ── */}
        <section id="how-remix" className="mt-16 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.35 }}
            className="mb-8"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-sand-600">How it works</p>
            <h2 className="mt-1 text-xl font-bold text-sand-50">Three steps. Your way.</h2>
          </motion.div>

          <div className="relative flex flex-col gap-0">
            {/* Connecting dotted line */}
            <div
              className="absolute left-[19px] top-6 bottom-16 w-px overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(79,79,76,0.5) 1px, transparent 1px)',
                backgroundSize: '1px 8px',
                animation: 'dotFlow 1.5s linear infinite',
              }}
            />
            <style>{`@keyframes dotFlow { from { background-position-y: 0; } to { background-position-y: 8px; } }`}</style>

            {[
              {
                num: '01',
                icon: <MagnifyingGlass weight="regular" size={16} />,
                title: 'Browse',
                desc: 'Find the perfect animated component from the curated, categorized collection.',
              },
              {
                num: '02',
                icon: <Terminal weight="regular" size={16} />,
                title: 'Install or remix',
                desc: 'Copy the CLI command to install directly, or hit Remix with AI to try it in Claude Code, Lovable, or V0.',
              },
              {
                num: '03',
                icon: <RocketLaunch weight="regular" size={16} />,
                title: 'Ship',
                desc: 'The component is in your project. Customize it, extend it, or ship it as-is.',
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                className="flex items-start gap-5 py-5"
              >
                {/* Node on the timeline */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sand-700 bg-sand-900 text-sand-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  {step.icon}
                </div>
                {/* Content */}
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-bold tabular-nums text-olive-500">{step.num}</span>
                    <h3 className="text-base font-bold text-sand-50">{step.title}</h3>
                  </div>
                  <p className="mt-1.5 text-base leading-relaxed text-sand-500">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* ── Prompt differentiator ── */}
        <section className="mt-16 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.35 }}
            className="mb-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-sand-600">
              The AI prompts
            </p>
            <h2 className="mt-1 text-xl font-bold text-sand-50">
              Every component ships with prompts for three AI platforms.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-sand-400">
              Not generic instructions. Each prompt is a precise reproduction brief —
              tested to recreate the component faithfully. Pick your platform,
              paste, and go.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { name: 'Claude Code',  description: "Builds the component in your existing project with full environment setup." },
              { name: 'Lovable',   description: 'Builds a full working app from the prompt — no setup needed.' },
              { name: 'V0',           description: 'Ready for instant Vercel V0 generation.' },
            ].map(({ name, description }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                className="rounded-xl border border-sand-800 bg-sand-900 p-4"
              >
                <span className="mb-2 inline-block rounded-md bg-olive-500/10 px-2 py-0.5 text-xs font-semibold text-olive-500">
                  {name}
                </span>
                <p className="text-xs leading-relaxed text-sand-500">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="mt-16 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl border border-olive-500/20 bg-gradient-to-br from-olive-500/8 via-transparent to-transparent p-8 text-center ring-1 ring-inset ring-olive-500/10"
          >
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-40 w-64 rounded-full bg-olive-500/10 blur-3xl" />
            </div>
            <p className="relative text-xs font-semibold uppercase tracking-wider text-sand-600">
              Ready to build?
            </p>
            <h2 className="relative mt-2 text-xl font-bold text-sand-50">
              Everything is free. Everything is open source.
            </h2>
            <p className="relative mt-2 text-base text-sand-500">
              {total}+ AI-native components with prompts for Claude Code, Lovable, and V0. Design systems coming soon.
            </p>
            <Link
              href="/components"
              className={`relative mt-6 ${buttonClasses({ variant: 'primary', size: 'lg' })}`}
            >
              Browse Components
              <ArrowRight weight="regular" size={14} />
            </Link>
          </motion.div>
        </section>

        <SiteFooter />
      </main>
    </div>
  )
}
