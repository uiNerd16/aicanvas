'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Sun,
  Heart,
  MusicNote,
  Coffee,
  Leaf,
  Star,
  Moon,
  Flame,
  Cloud,
} from '@phosphor-icons/react'

const DOCK_ITEMS = [
  { icon: Sun,       color: '#FFBE0B', label: 'Energy' },
  { icon: Heart,     color: '#FF5C8A', label: 'Love' },
  { icon: MusicNote, color: '#FF7B54', label: 'Joy' },
  { icon: Coffee,    color: '#C9A96E', label: 'Comfort' },
  { icon: Leaf,      color: '#06D6A0', label: 'Nature' },
  { icon: Star,      color: '#FFBE0B', label: 'Dreams' },
  { icon: Moon,      color: '#B388FF', label: 'Rest' },
  { icon: Flame,     color: '#FF5C8A', label: 'Passion' },
  { icon: Cloud,     color: '#3A86FF', label: 'Peace' },
]

const ICON_SIZE = 44
const MAG_RANGE = 120
const MAG_SCALE = 1.55

// iOS-style continuous corner (squircle) — scales with objectBoundingBox
const SQUIRCLE_PATH =
  'M0.5 0C0.7413 0 0.8559 0 0.9227 0.0773C1 0.1441 1 0.2587 1 0.5C1 0.7413 1 0.8559 0.9227 0.9227C0.8559 1 0.7413 1 0.5 1C0.2587 1 0.1441 1 0.0773 0.9227C0 0.8559 0 0.7413 0 0.5C0 0.2587 0 0.1441 0.0773 0.0773C0.1441 0 0.2587 0 0.5 0Z'

function DockItem({
  icon: Icon,
  color,
  label,
  mouseX,
  index,
}: {
  icon: typeof Sun
  color: string
  label: string
  mouseX: ReturnType<typeof useMotionValue<number>>
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (mx: number) => {
    const el = ref.current
    if (!el || mx < 0) return 200
    const rect = el.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    return Math.abs(mx - center)
  })

  const rawSize = useTransform(distance, [0, MAG_RANGE], [ICON_SIZE * MAG_SCALE, ICON_SIZE])
  const size = useSpring(rawSize, { stiffness: 300, damping: 22, mass: 0.5 })
  const y = useTransform(size, [ICON_SIZE, ICON_SIZE * MAG_SCALE], [0, -12])

  return (
    <motion.div
      ref={ref}
      className="group relative flex cursor-pointer flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, delay: index * 0.04 }}
    >
      {/* Tooltip */}
      <motion.div
        className="pointer-events-none absolute -top-10 rounded-lg px-3 py-1.5 text-xs font-medium text-white/90 opacity-0 group-hover:opacity-100"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'opacity 0.15s',
        }}
      >
        {label}
      </motion.div>

      {/* Icon — squircle clip + drop-shadow so shadow is not clipped */}
      <motion.div
        style={{
          width: size,
          height: size,
          y,
          background: `linear-gradient(145deg, ${color}dd, ${color}88)`,
          clipPath: 'url(#squircle)',
          filter: `drop-shadow(0 4px 12px ${color}55)`,
        }}
        whileTap={{ scale: 0.82 }}
        className="relative flex items-center justify-center"
      >
        <Icon size={22} weight="regular" className="text-white" />

        {/* Gloss overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 50%, transparent 50%)',
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export function GlassDock() {
  const mouseX = useMotionValue(-200)

  return (
    <div className="relative flex h-full w-full items-center justify-end overflow-hidden bg-sand-950 pb-8">
      {/* Squircle clip-path definition — objectBoundingBox makes it scale with any element size */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="squircle" clipPathUnits="objectBoundingBox">
            <path d={SQUIRCLE_PATH} />
          </clipPath>
        </defs>
      </svg>

      {/* Background image */}
      <img
        src="https://ik.imagekit.io/aitoolkit/bg%20images/glass%20background.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
      />

      {/* Dock container */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(-200)}
        className="mx-auto flex items-end gap-2 rounded-3xl px-4 pb-3 pt-3"
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        }}
      >
        {DOCK_ITEMS.map((item, i) => (
          <DockItem key={item.label} {...item} mouseX={mouseX} index={i} />
        ))}
      </motion.div>
    </div>
  )
}
