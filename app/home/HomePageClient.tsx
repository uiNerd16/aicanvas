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
  Lightning,
  Code,
  Palette,
  HandTap,
  CaretLeft,
  CaretRight,
  Terminal,
  Sparkle,
  Fire,
} from '@phosphor-icons/react'
import { buttonClasses } from '../components/Button'
import { HeaderSocials } from '../components/HeaderSocials'
import { SiteFooter } from '../components/SiteFooter'
import { FoundationLoop } from '../_components/FoundationLoop'
import type { ComponentMeta } from '../lib/component-registry'
import { GITHUB_URL } from '../lib/config'
import { track } from '../lib/analytics'
import { ANDROMEDA_COMPONENT_META } from '../_lib/andromeda/andromeda-meta'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  total: number
  carouselItems: ComponentMeta[]
}

// ─── Hello card data ─────────────────────────────────────────────────────────

const HELLO_CARDS = ['Hello', 'こんにちは', 'Bonjour', 'Hola', 'Ciao', 'Hej', 'Hallo', '你好', ':)']

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
    <div
      aria-hidden
      className="aic-hero-rise relative mx-auto mb-10 flex h-28 w-48 cursor-pointer items-end justify-center"
      style={{ animationDuration: '0.5s' }}
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
    </div>
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

// ─── Wire icon row ────────────────────────────────────────────────────────────

const WIRE_SCALES  = [1.5, 1.2, 1.1]
const WIRE_Y       = [-8, -4, -2]
const WIRE_LABELS  = ['For developers', 'For designers', 'For makers and founders']
// Only the first icon carries descriptive alt text; the other two are decorative
// duplicates and use alt="" so screen readers skip them and crawlers don't see
// the brand name repeated three times in a row.
const WIRE_ALTS    = [
  'AI Canvas component registry: animated React components preview',
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
        <a
          key={idx}
          href="#audience"
          aria-label={WIRE_LABELS[idx]}
          className="relative flex flex-col items-center"
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered(idx)}
          onBlur={() => setHovered(null)}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('audience')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <AnimatePresence>
            {hovered === idx && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-sand-500"
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
            className="cursor-pointer"
          />
        </a>
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
        {entry.badge && (
          <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-sand-950/85 px-2.5 py-1 text-[11px] font-semibold text-olive-400 ring-1 ring-olive-500/40 backdrop-blur-sm">
            <Lightning weight="fill" size={12} />
            {entry.badge === 'Premium' ? 'Premium component' : entry.badge}
          </span>
        )}
        {entry.image ? (
          <img
            src={entry.image}
            alt={`${entry.name}: ${entry.description.split('.')[0]}`}
            loading="lazy"
            decoding="async"
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
        className="mb-4"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-sand-600">The library</p>
        <h2 className="mt-1 text-xl font-bold text-sand-50">Components and blocks, one command away.</h2>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="mb-8 max-w-2xl text-base leading-relaxed text-sand-400"
      >
        Copy one CLI command and a finished, animated React piece lands in your project, no
        tokens spent generating it.
      </motion.p>

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
            aria-hidden
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
            aria-hidden
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
                    {current.badge && (
                      <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-sand-950/85 px-2.5 py-1 text-[11px] font-semibold text-olive-400 ring-1 ring-olive-500/40 backdrop-blur-sm">
                        <Lightning weight="fill" size={12} />
                        {current.badge === 'Premium' ? 'Premium component' : current.badge}
                      </span>
                    )}
                    {current.image ? (
                      <img
                        src={current.image}
                        alt={`${current.name}: ${current.description.split('.')[0]}`}
                        loading="lazy"
                        decoding="async"
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
            aria-hidden
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
            aria-hidden
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

      {/* Prev / next — under the cards */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          onClick={goPrev}
          aria-label="Previous"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-sand-700 text-sand-400 transition-colors hover:border-sand-500 hover:text-sand-200"
        >
          <CaretLeft weight="regular" size={14} />
        </button>
        <button
          onClick={goNext}
          aria-label="Next"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-sand-700 text-sand-400 transition-colors hover:border-sand-500 hover:text-sand-200"
        >
          <CaretRight weight="regular" size={14} />
        </button>
      </div>
    </section>
  )
}

// ─── FAQ ────────────────────────────────────────────────────────────────────
// Rendered in the homepage FAQ section. The FAQPage JSON-LD for rich results
// lives on the dedicated /faq page, so it is not duplicated here.

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'What is AI Canvas?',
    a: 'AI Canvas is a registry of animated React components and design systems you install with one command, no tokens spent generating them. Every install lands real, editable source in your project. Free and premium options both ship the full source.',
  },
  {
    q: 'Do I need to know how to code?',
    a: 'No. If you can copy and paste, you can use AI Canvas. And if you do not write code, paste the install command into your AI agent and it will pull the component, design system, or template into your project for you.',
  },
  {
    q: 'Is AI Canvas free?',
    a: 'Yes. Browsing, previewing, copying prompts, and remixing with AI are always free, and a free account unlocks unlimited one-command installs, free forever. Premium adds the closed-source premium components, design systems, and templates at $8.99 per month or $49.99 per year when you want more.',
  },
  {
    q: 'How do I get my first component in under a minute?',
    a: 'Open any component page, click Copy CLI to grab its install command, paste it into your terminal, and run it. The component drops into your project as real, editable code.',
  },
  {
    q: 'What is the AI Canvas MCP server?',
    a: 'MCP, short for Model Context Protocol, is an open standard for AI tools to plug into outside services, and nearly every AI coding agent now supports it. The AI Canvas MCP is a small server that connects your agent to AI Canvas, so it can find and install components without you leaving the chat, whether you use Claude Code, Cursor, Codex, Copilot, Gemini, or anything else. It is free to use.',
  },
  {
    q: 'Can I use the components in commercial projects?',
    a: 'Yes. Free components are MIT. Premium components, design systems, and templates are proprietary under the AI Canvas Premium License. Either way you can use what you install in personal and commercial projects and ship it. Any third-party assets, fonts, or images a component references may carry their own terms, so check those before shipping.',
  },
  {
    q: 'How is AI Canvas different from other component libraries?',
    a: 'Most libraries serve one audience, but AI Canvas fits however you build: copy an AI prompt, run one command with the shadcn CLI, or hand it to an AI agent. The code lands as real code in your project, not a screenshot to chase, so you can restyle, extend, or ship it as is.',
  },
  {
    q: 'Who is behind AI Canvas?',
    a: 'One person. AI Canvas is a solo project, built and cared for one component at a time by someone who worries about the easing curve more than is strictly reasonable. It is still early and still growing, and if it makes your work easier, going Premium is the most direct way to help one maker keep building it with the same care.',
  },
]

// ─── HomePageClient ────────────────────────────────────────────────────────────

export function HomePageClient({ total, carouselItems }: Props) {
  // Hero stat: standalone components + the Andromeda design-system components
  // (those live in their own registry, so they aren't part of `total`).
  const componentTotal = total + ANDROMEDA_COMPONENT_META.length
  const [openFaq, setOpenFaq] = useState<number | null>(0)
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

          <span
            className="aic-hero-rise mb-5 inline-flex items-center rounded-full border border-sand-700 bg-sand-900 px-3 py-1 text-xs font-semibold text-sand-300"
            style={{ animationDelay: '0.1s' }}
          >
            One command, zero tokens
          </span>

          <h1
            className="aic-hero-slide text-balance text-2xl font-extrabold tracking-tight text-sand-50 sm:text-4xl"
            style={{ animationDelay: '0.18s' }}
          >
            AI
            {' '}
            <img
              src="/ai-canvas-icon.svg"
              alt=""
              aria-hidden
              className="inline-block h-[0.6em] w-auto align-[0.02em]"
            />
            {' '}Native Components and Blocks,
            <br />
            <span className="mt-2 inline-block text-olive-500">Design Systems and Templates</span>
          </h1>

          <p
            className="aic-hero-rise mt-4 max-w-2xl text-base leading-relaxed text-sand-400"
            style={{ animationDelay: '0.26s' }}
          >
            Copy one shadcn CLI command and a finished component, block, or complete
            design system lands in your project in seconds. No tokens spent asking an
            AI to generate it from scratch, just real, editable React you own.
          </p>

          <div
            className="aic-hero-rise mt-7 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '0.34s' }}
          >
            <Link
              href="/components"
              className={buttonClasses({ variant: 'primary', size: 'lg' })}
            >
              Browse Components
              <ArrowRight weight="regular" size={14} />
            </Link>
            <Link
              href="/mcp"
              className="flex items-center gap-1.5 rounded-xl border border-sand-700 px-5 py-2.5 text-sm font-semibold text-sand-300 transition-colors hover:border-sand-600 hover:text-sand-100"
            >
              Get MCP
            </Link>
          </div>
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
                  { value: componentTotal, suffix: '+', label: 'Components' },
                  { value: 3,     suffix: '',  label: 'AI platforms' },
                ],
                [
                  { text: 'MIT',  suffix: '',  label: 'Open source', minWidth: '6rem' },
                  { text: 'MCP',  suffix: '',  label: 'Ready' },
                ],
              ] as {
                value?: number
                suffix: string
                label: string
                prefix?: string
                minWidth?: string
                text?: string
              }[][]
            ).map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-center sm:contents">
                {rowIdx > 0 && (
                  <div className="hidden h-10 w-px bg-sand-800 mx-6 sm:block" aria-hidden />
                )}
                {row.map(({ value, suffix, prefix = '', label, minWidth, text }, colIdx) => {
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
                          {text ? text : <>{prefix}<AnimatedCount to={value ?? 0} suffix={suffix} /></>}
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

        {/* ── Andromeda spotlight (foundation loop) — same bordered-card treatment
             as the Overview page's System card, with the homepage's own copy/CTA ── */}
        <section className="mt-16 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.35 }}
          >
            <Link
              href="/design-systems/andromeda"
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-sand-800 bg-sand-900 transition-all duration-200 hover:border-sand-700 sm:flex-row"
            >
              <span
                aria-hidden
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/40 bg-sand-950/85 text-red-500 backdrop-blur-sm"
              >
                <Fire weight="fill" size={15} />
              </span>
              <div className="flex flex-col justify-center gap-3 p-6 sm:w-1/2 sm:p-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-olive-400">Featured</span>
                <h2 className="text-2xl font-bold tracking-tight text-sand-50">Andromeda • Design System</h2>
                <p className="text-sm leading-relaxed text-sand-400">
                  A complete design system for dashboards, control panels, and data-dense
                  interfaces. Components, templates, and the rules that keep them all speaking the
                  same visual language.
                </p>
                <div className="mt-1">
                  <span className={`${buttonClasses({ variant: 'primary', size: 'md' })} group-hover:bg-olive-400`}>
                    Discover more
                    <ArrowRight weight="regular" size={14} />
                  </span>
                </div>
              </div>
              <div className="relative min-h-[280px] overflow-hidden sm:min-h-[360px] sm:w-1/2">
                <FoundationLoop />
              </div>
            </Link>
          </motion.div>
        </section>

        {/* ── Featured carousel ── */}
        <FeaturedCarousel items={carouselItems} />



        {/* ── Who it's for ── */}
        <section id="audience" className="mt-16 sm:mt-24 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.35 }}
            className="mb-8"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-sand-600">Built for everyone</p>
            <h2 className="mt-1 text-xl font-bold text-sand-50">
              For developers. For designers. For makers. For your AI agent.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-sand-400">
              Most component libraries serve one kind of person. AI Canvas installs the same finished code for everyone who builds, and every install costs zero AI tokens instead of burning them on a from-scratch generation. Drop a component in with the shadcn CLI, reshape it with an AI agent, or let an agent browse and install it for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            {[
              {
                icon: <Code weight="regular" size={18} />,
                audience: 'Developers',
                description: 'Drop finished, typed components into your project with one command. No boilerplate, no screenshot to rebuild, and no tokens spent generating what already works.',
                badges: ['TypeScript', 'Motion', 'Tailwind CSS'],
                badgeStyle: 'text-sand-500 ring-sand-800',
              },
              {
                icon: <Palette weight="regular" size={18} />,
                audience: 'Designers',
                description: 'Start from something already crafted, then reshape it in your AI agent, Cursor, Claude Code, or Codex, whichever you use: the colors, the layout, the motion, fast, without rebuilding it from scratch.',
                badges: ['Cursor', 'Claude Code', 'Codex'],
                badgeStyle: 'text-olive-500 ring-olive-500/30 bg-olive-500/5',
              },
              {
                icon: <RocketLaunch weight="regular" size={18} />,
                audience: 'Makers & Founders',
                description: 'Building with AI in Lovable, V0, Cursor, or any AI agent? Hand it real, polished components to install so your product ships fast and does not look generated, with no tokens spent regenerating UI from scratch.',
                badges: ['No-code', 'AI-built', 'Real code'],
                badgeStyle: 'text-sand-400 ring-sand-700',
              },
              {
                icon: <Sparkle weight="regular" size={18} />,
                audience: 'AI agents',
                description: 'Point your agent at the AI Canvas MCP and it browses, inspects, and installs finished components for you: fewer tokens, no writing UI from scratch, and you keep control. Works with any MCP client, Claude Code, Cursor, Codex, Copilot, Gemini, and more.',
                badges: ['MCP', 'Agent-ready', 'No copy-paste'],
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
              className="dot-flow absolute left-[19px] top-6 bottom-16 w-px overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(79,79,76,0.5) 1px, transparent 1px)',
                backgroundSize: '1px 8px',
                animation: 'dotFlow 1.5s linear infinite',
              }}
            />
            <style>{`@keyframes dotFlow { from { background-position-y: 0; } to { background-position-y: 8px; } } @media (prefers-reduced-motion: reduce) { .dot-flow { animation: none !important; } }`}</style>

            {[
              {
                num: '01',
                icon: <MagnifyingGlass weight="regular" size={16} />,
                title: 'Browse',
                desc: 'Search components, blocks, and design systems, and preview each one live before you choose.',
              },
              {
                num: '02',
                icon: <Terminal weight="regular" size={16} />,
                title: 'Install',
                desc: 'Run the one shadcn CLI command, or point your AI agent at the MCP. The finished, typed source lands in your project, no tokens spent generating it.',
              },
              {
                num: '03',
                icon: <RocketLaunch weight="regular" size={16} />,
                title: 'Ship',
                desc: 'It arrives as real code you own. Ship it as is, or reshape it with an AI agent in seconds. It is yours.',
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


        {/* ── FAQ ── */}
        <section className="mt-16 sm:mt-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-[2fr_3fr] sm:gap-12">
            {/* Intro rail, sticky on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.35 }}
              className="self-start sm:sticky sm:top-24"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-sand-600">FAQ</p>
              <h2 className="mt-1 text-xl font-bold text-sand-50">Questions, answered.</h2>
              <p className="mt-3 text-base leading-relaxed text-sand-400">
                The short version of everything people ask before shipping their
                first component.
              </p>
              <Link
                href="/faq"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400"
              >
                See all FAQs
                <CaretRight weight="regular" size={14} />
              </Link>
            </motion.div>

            {/* Accordion cards */}
            <div className="space-y-2.5">
              {FAQ_ITEMS.map(({ q, a }, i) => {
                const open = openFaq === i
                return (
                  <motion.div
                    key={q}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className={`rounded-xl border transition-colors ${
                      open
                        ? 'border-sand-700 bg-sand-900'
                        : 'border-sand-800 bg-sand-900/50 hover:border-sand-700'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                    >
                      <span className={`w-7 shrink-0 text-sm font-bold tabular-nums ${open ? 'text-olive-500' : 'text-sand-600'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="flex-1 text-base font-semibold text-sand-50">{q}</h3>
                      <CaretRight
                        weight="regular"
                        size={16}
                        className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-90 text-olive-500' : 'text-sand-500'}`}
                      />
                    </button>
                    {/* Answer stays in the DOM (SEO); grid-rows trick animates the collapse */}
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                    >
                      {/* visibility rides the same 300ms as the grid collapse, so the
                          answer leaves the a11y tree when closed without a visual pop */}
                      <div className={`overflow-hidden transition-[visibility] duration-300 ${open ? 'visible' : 'invisible'}`}>
                        <p className="px-4 pb-4 pl-14 pr-8 text-base leading-relaxed text-sand-400">{a}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
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
              One command from your next screen.
            </h2>
            <p className="relative mt-2 text-base text-sand-500">
              {componentTotal}+ components and design systems, each one command away. Copy it
              yourself, or tell your agent to install it. No tokens spent generating what
              already works.
            </p>
            <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
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
                className={buttonClasses({ variant: 'outline', size: 'lg' })}
              >
                View on GitHub
              </a>
            </div>
          </motion.div>
        </section>

        <SiteFooter />
      </main>
    </div>
  )
}
