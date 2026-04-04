'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Rocket, Brain, Sparkle } from '@phosphor-icons/react'

const CARDS = [
  { Icon: Rocket,  title: 'Ship Fast',   sub: 'Drop-in components', delay: 0    },
  { Icon: Brain,   title: 'AI Prompts',  sub: 'For 5 platforms',    delay: 0.25 },
  { Icon: Sparkle, title: 'Open Source', sub: 'MIT licensed',       delay: 0.5  },
]

type PhosphorIcon = typeof Rocket

function FloatingCard({
  Icon,
  title,
  sub,
  delay,
  isDark,
}: {
  Icon: PhosphorIcon
  title: string
  sub: string
  delay: number
  isDark: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 3.5, delay, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.06, transition: { duration: 0.2, ease: 'easeOut' } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-1 cursor-default flex-col items-center gap-2 rounded-2xl px-2 py-4 backdrop-blur-sm sm:gap-3 sm:px-4 sm:py-6"
      style={{
        background: hovered
          ? (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.96)')
          : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.65)'),
        border: `1px solid ${hovered ? 'rgba(167,139,250,0.40)' : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.09)')}`,
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <div
        className="flex h-8 w-8 items-center justify-center rounded-xl sm:h-10 sm:w-10"
        style={{
          background: hovered ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.15)',
          transition: 'background 0.3s',
        }}
      >
        <Icon
          weight="duotone"
          size={18}
          style={{
            color: hovered
              ? (isDark ? '#c4b5fd' : '#7c3aed')
              : (isDark ? '#a78bfa' : '#8b5cf6'),
            transition: 'color 0.3s',
          }}
        />
      </div>
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span
          className="text-xs font-semibold sm:text-sm"
          style={{ color: isDark ? '#ffffff' : '#1C1916' }}
        >
          {title}
        </span>
        <span
          className="hidden text-[11px] sm:block"
          style={{
            color: hovered
              ? (isDark ? '#a1a1aa' : '#4A453F')
              : (isDark ? '#71717a' : '#736D65'),
            transition: 'color 0.3s',
          }}
        >
          {sub}
        </span>
      </div>
    </motion.div>
  )
}

export function FloatingCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const check = () => {
      const card = el.closest('[data-card-theme]')
      setIsDark(card ? card.classList.contains('dark') : document.documentElement.classList.contains('dark'))
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const cardWrapper = el.closest('[data-card-theme]')
    if (cardWrapper) observer.observe(cardWrapper, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: isDark ? '#110F0C' : '#F5F1EA' }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Violet glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-64 w-64 rounded-full blur-3xl"
          style={{ background: isDark ? 'rgba(124,58,237,0.20)' : 'rgba(109,81,160,0.12)' }}
        />
      </div>

      {/* Floating cards */}
      <div className="relative flex w-full items-center gap-3 px-4 sm:gap-5 sm:px-8">
        {CARDS.map(({ Icon, title, sub, delay }) => (
          <FloatingCard
            key={title}
            Icon={Icon}
            title={title}
            sub={sub}
            delay={delay}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  )
}
