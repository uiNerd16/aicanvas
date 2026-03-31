'use client'

import { motion } from 'framer-motion'

const CARDS = [
  { label: 'Components', value: '2,847', symbol: '◈', delay: 0 },
  { label: 'Downloads', value: '94.2k', symbol: '↓', delay: 0.2 },
  { label: 'Stars', value: '12.1k', symbol: '★', delay: 0.4 },
]

export function AnimatedPreview() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Violet glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-56 w-56 rounded-full bg-violet-600/25 blur-3xl" />
      </div>

      {/* Floating cards */}
      <div className="relative flex items-end gap-4">
        {CARDS.map((card) => (
          <motion.div
            key={card.label}
            animate={{ y: [0, -14, 0] }}
            transition={{
              duration: 3.5,
              delay: card.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-sm"
          >
            <span className="text-2xl text-violet-400">{card.symbol}</span>
            <span className="text-xl font-bold text-white">{card.value}</span>
            <span className="text-xs text-zinc-500">{card.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
