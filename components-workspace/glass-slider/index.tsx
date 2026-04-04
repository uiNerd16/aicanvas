'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

function Slider({
  label,
  defaultValue,
  color,
  delay,
}: {
  label: string
  defaultValue: number
  color: string
  delay: number
}) {
  const [value, setValue] = useState(defaultValue)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useMotionValue(0)
  const thumbScale = useSpring(useTransform(dragging, [0, 1], [1, 1.3]), {
    stiffness: 400,
    damping: 20,
  })
  const glowOpacity = useSpring(useTransform(dragging, [0, 1], [0, 0.6]), {
    stiffness: 300,
    damping: 25,
  })

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    dragging.set(1)

    const track = trackRef.current
    if (!track) return

    const updateValue = (clientX: number) => {
      const rect = track.getBoundingClientRect()
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      setValue(Math.round(pct * 100))
    }

    updateValue(e.clientX)

    const onMove = (ev: PointerEvent) => updateValue(ev.clientX)
    const onUp = () => {
      dragging.set(0)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22, delay }}
      className="flex w-full items-center gap-4"
    >
      <span className="w-20 text-right text-sm font-medium text-white/50">{label}</span>

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        className="relative flex h-10 flex-1 cursor-pointer items-center rounded-2xl px-1"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Fill */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-2xl"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}22, ${color}44)`,
          }}
          layout
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />

        {/* Active glow */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-2xl"
          style={{
            width: `${value}%`,
            opacity: glowOpacity,
            background: `linear-gradient(90deg, transparent 60%, ${color}33)`,
            boxShadow: `0 0 20px ${color}22`,
          }}
        />

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 flex items-center justify-center"
          style={{
            left: `${value}%`,
            x: '-50%',
            y: '-50%',
            scale: thumbScale,
          }}
        >
          <div
            className="h-6 w-6 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}bb)`,
              border: '2px solid rgba(255, 255, 255, 0.25)',
              boxShadow: `0 2px 12px ${color}55, 0 0 0 4px ${color}11`,
            }}
          />
        </motion.div>
      </div>

      {/* Value display */}
      <motion.span
        className="w-12 text-right font-mono text-sm font-semibold"
        style={{ color }}
      >
        {value}
      </motion.span>
    </motion.div>
  )
}

export function GlassSlider() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950">
      {/* Background image */}
      <img
        src="https://ik.imagekit.io/aitoolkit/bg%20images/glass%20background.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
      />
      {/* Slider panel */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="relative flex w-[400px] flex-col gap-5 rounded-3xl px-8 py-8"
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(24px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Top highlight */}
        <div
          className="absolute left-8 right-8 top-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
        />

        <h3 className="mb-1 text-base font-semibold text-white/80">Audio Settings</h3>

        <Slider label="Volume" defaultValue={72} color="#FF6BF5" delay={0.1} />
        <Slider label="Bass" defaultValue={45} color="#FF7B54" delay={0.15} />
        <Slider label="Treble" defaultValue={60} color="#06D6A0" delay={0.2} />
        <Slider label="Balance" defaultValue={50} color="#FFBE0B" delay={0.25} />
      </motion.div>
    </div>
  )
}
