'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  ArrowRight,
  MagnifyingGlass,
  CopySimple,
  RocketLaunch,
  ImageSquare,
  Code,
  Palette,
  UsersThree,
} from '@phosphor-icons/react'
import { HeaderSocials } from '../components/HeaderSocials'
import type { ComponentMeta } from '../lib/component-registry'
import { GITHUB_URL } from '../lib/config'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  total: number
  showcase: ComponentMeta[]
}

// ─── Platform labels ──────────────────────────────────────────────────────────

const PLATFORMS = ['Claude', 'GPT', 'Gemini', 'V0'] as const

// ─── Stacked cards visual ─────────────────────────────────────────────────────

function StackedCards() {
  const cards = [
    { rotate: -18, y: 6, z: 1, opacity: 0.35 },
    { rotate: -11, y: 3, z: 2, opacity: 0.50 },
    { rotate:  -4, y: 1, z: 3, opacity: 0.65 },
    { rotate:   4, y: 1, z: 4, opacity: 0.80 },
    { rotate:  11, y: 3, z: 5, opacity: 0.90 },
    { rotate:  18, y: 6, z: 6, opacity: 1.00 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mx-auto mb-8 flex h-28 w-48 items-end justify-center"
    >
      {cards.map(({ rotate, y, z, opacity }, i) => (
        <div
          key={i}
          className="absolute h-20 w-28 rounded-2xl border border-sand-700 bg-sand-800"
          style={{
            transform: `rotate(${rotate}deg) translateY(${-y}px)`,
            zIndex: z,
            opacity,
            transformOrigin: 'bottom center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
        />
      ))}
    </motion.div>
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedCount({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 900
    const step = 16
    const increment = to / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= to) { setCount(to); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [inView, to])

  return <span ref={ref}>{inView ? count : 0}{suffix}</span>
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
                alt={current.name}
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

// ─── HomePageClient ────────────────────────────────────────────────────────────

export function HomePageClient({ total, showcase }: Props) {
  return (
    <div className="flex min-h-full flex-col bg-sand-950">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 hidden h-14 shrink-0 items-center justify-between border-b border-sand-800 bg-sand-950/90 px-6 backdrop-blur md:flex">
        <CyclingGreeting />
        <HeaderSocials />
      </div>

      <main className="mx-auto w-full max-w-[720px] px-6 py-12 sm:px-8 sm:py-20">

        {/* ── Hero ── */}
        <section className="flex flex-col items-center text-center">
          <StackedCards />

          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-sand-700 bg-sand-900 px-3 py-1 text-xs font-semibold text-sand-300"
          >
            Free · Open source · AI-ready
            <ArrowRight weight="regular" size={11} className="text-sand-500" />
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.18 }}
            className="text-3xl font-extrabold tracking-tight text-sand-50 sm:text-4xl"
          >
            UI components and design systems
            <br />
            <span className="text-olive-500">with AI prompts built in.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.26 }}
            className="mt-4 max-w-xl text-base leading-relaxed text-sand-400"
          >
            Whether you copy the code, paste the prompt, or just need inspiration,
            everything here is free, open source, and ready to ship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.34 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-xl bg-olive-500 px-5 py-2.5 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400"
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: total, suffix: '+', label: 'Components' },
              { value: 4,     suffix: '',  label: 'AI Platforms' },
              { value: 100,   suffix: '%', label: 'Open Source' },
              { value: 0,     suffix: ' cost', label: 'Free forever' },
            ].map(({ value, suffix, label }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center rounded-xl border border-sand-800 bg-sand-900 px-4 py-5 text-center"
              >
                <span className="text-xl font-bold tabular-nums text-sand-50">
                  <AnimatedCount to={value} suffix={suffix} />
                </span>
                <span className="mt-0.5 text-xs font-medium text-sand-500">{label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Showcase card ── */}
        <section className="mt-16 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
          >
            {showcase.length > 0 && <ShowcaseCard items={showcase} />}
          </motion.div>
        </section>

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
            <p className="mt-3 text-sm leading-relaxed text-sand-400">
              Most component libraries are built for one kind of person. AI Canvas works however you work.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: <Code weight="regular" size={18} />,
                audience: 'Developers',
                description: 'The code tab has everything. TypeScript source, Framer Motion animations, Tailwind CSS. Copy and paste directly into your project.',
                badges: ['TypeScript', 'Framer Motion', 'Tailwind CSS'],
                badgeStyle: 'text-sand-500 ring-sand-800',
              },
              {
                icon: <Palette weight="regular" size={18} />,
                audience: 'Designers',
                description: 'Every component ships with expert-crafted prompts for the AI tools you already use. Describe what you want, generate, customize.',
                badges: ['Claude', 'GPT', 'Gemini', 'V0'],
                badgeStyle: 'text-olive-500 ring-olive-500/30 bg-olive-500/5',
              },
              {
                icon: <UsersThree weight="regular" size={18} />,
                audience: 'Everyone else',
                description: 'Building something and not sure if you\'ll code it or prompt it? Both are always here — code and prompts, every single component.',
                badges: ['Code ↔ Prompts', 'Always both', 'Always free'],
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
                <p className="flex-1 text-sm leading-relaxed text-sand-400">{description}</p>
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

        {/* ── How it works ── */}
        <section className="mt-16 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.35 }}
            className="mb-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-sand-600">How it works</p>
            <h2 className="mt-1 text-xl font-bold text-sand-50">Three steps. Your way.</h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: <MagnifyingGlass weight="regular" size={18} />,
                step: '01',
                title: 'Browse',
                description: 'Find the perfect animated component or explore a full design system from the curated, categorized collection.',
              },
              {
                icon: <CopySimple weight="regular" size={18} />,
                step: '02',
                title: 'Copy',
                description: 'Grab the source code, or pick the AI prompt for your preferred platform — or take both.',
              },
              {
                icon: <RocketLaunch weight="regular" size={18} />,
                step: '03',
                title: 'Ship',
                description: 'Paste into your project, or let your AI tool recreate and customize it instantly.',
              },
            ].map(({ icon, step, title, description }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="relative overflow-hidden rounded-xl border border-sand-800 bg-sand-900 p-5"
              >
                <span className="pointer-events-none absolute right-4 top-3 text-5xl font-black tabular-nums text-sand-800">
                  {step}
                </span>
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-sand-800 text-sand-300">
                  {icon}
                </div>
                <h3 className="text-sm font-bold text-sand-50">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-sand-500">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Component grid preview ── */}
        <section className="mt-16 sm:mt-24">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="text-xs font-semibold uppercase tracking-wider text-sand-600"
              >
                Featured
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="mt-1 text-xl font-bold text-sand-50"
              >
                A taste of what&apos;s inside.
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Link
                href="/"
                className="flex items-center gap-1 text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400"
              >
                Browse all <ArrowRight weight="regular" size={13} />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {showcase.slice(0, 4).map((entry, i) => (
              <motion.div
                key={entry.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <Link
                  href={`/components/${entry.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-sand-800 bg-sand-950 transition-all duration-200 hover:border-sand-700 hover:shadow-lg hover:shadow-black/30"
                >
                  <div className="relative aspect-video overflow-hidden bg-sand-900">
                    {entry.image ? (
                      <img
                        src={entry.image}
                        alt={entry.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }}
                      >
                        <ImageSquare weight="regular" size={22} className="text-sand-700" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-sand-50">{entry.name}</p>
                      <p className="text-xs text-sand-500">
                        {entry.tags.find((t) => t.accent)?.label ?? ''}
                      </p>
                    </div>
                    <ArrowRight
                      weight="regular"
                      size={14}
                      className="text-sand-600 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-olive-500"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Design systems teaser ── */}
        <section className="mt-16 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl border border-sand-800 bg-sand-900 p-6 sm:p-8"
          >
            {/* Blueprint grid decoration */}
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(190,207,93,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(190,207,93,0.15) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-olive-500/8 blur-3xl" />

            <p className="relative text-xs font-semibold uppercase tracking-wider text-sand-600">
              Also in AI Canvas
            </p>
            <h2 className="relative mt-1 text-xl font-bold text-sand-50">
              Not just components — full design systems.
            </h2>
            <p className="relative mt-3 max-w-md text-sm leading-relaxed text-sand-400">
              AI Canvas also ships curated design systems — complete visual languages
              with tokens, components, and AI prompts. Explore Andromeda: a sci-fi
              blueprint system built to feel like mission control.
            </p>

            <div className="relative mt-5 flex flex-wrap gap-3">
              <Link
                href="/design-systems/andromeda"
                className="inline-flex items-center gap-1.5 rounded-xl bg-olive-500 px-4 py-2 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400"
              >
                Explore Andromeda
                <ArrowRight weight="regular" size={13} />
              </Link>
              <span className="inline-flex items-center rounded-xl border border-sand-700 px-4 py-2 text-sm text-sand-500">
                Glass system · Meridian · more coming
              </span>
            </div>
          </motion.div>
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
              Every component ships with prompts for your AI.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-sand-400">
              Not generic instructions — prompts written specifically for how each
              platform thinks. Use the code, use the prompt, or use both. The choice
              is always yours.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { name: 'Claude',  description: "Tuned for Anthropic's reasoning strengths." },
              { name: 'GPT',     description: 'Optimized for ChatGPT and the API.' },
              { name: 'Gemini',  description: "Calibrated for Google Gemini's output." },
              { name: 'V0',      description: 'Ready for instant Vercel V0 generation.' },
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
            <p className="relative mt-2 text-sm text-sand-500">
              {total}+ components and design systems. Code and AI prompts. Always.
            </p>
            <Link
              href="/"
              className="relative mt-6 inline-flex items-center gap-1.5 rounded-xl bg-olive-500 px-5 py-2.5 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400"
            >
              Browse Components
              <ArrowRight weight="regular" size={14} />
            </Link>
          </motion.div>
        </section>

        <div className="h-16" />
      </main>
    </div>
  )
}
