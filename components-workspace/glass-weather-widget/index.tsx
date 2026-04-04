'use client'

import { useRef, useEffect, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  Cloud,
  CloudRain,
  Snowflake,
  CloudLightning,
  CloudSnow,
} from '@phosphor-icons/react'
import type { ComponentType } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ParticleKind = 'sunny' | 'cloudy' | 'rainy' | 'snowy'

interface HourlyEntry {
  icon: ComponentType<{ weight: 'regular'; size: number }>
  temp: string
}

interface WeatherState {
  condition: string
  temp: number
  high: number
  low: number
  gradient: string
  particles: ParticleKind
}

// ─── Weather Data ─────────────────────────────────────────────────────────────

const WEATHER_STATES: WeatherState[] = [
  {
    condition: 'Early',
    temp: -5,
    high: -2,
    low: -8,
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    particles: 'snowy',
  },
  {
    condition: 'Cloudy',
    temp: -1,
    high: 1,
    low: -4,
    gradient: 'linear-gradient(135deg, #334155 0%, #475569 50%, #64748b 100%)',
    particles: 'cloudy',
  },
  {
    condition: 'Rainy',
    temp: 14,
    high: 16,
    low: 11,
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #1e3a5f 50%, #0f172a 100%)',
    particles: 'rainy',
  },
  {
    condition: 'Snowing',
    temp: -5,
    high: -2,
    low: -8,
    gradient: 'linear-gradient(135deg, #bfdbfe 0%, #dde8f5 50%, #e2e8f0 100%)',
    particles: 'snowy',
  },
]

// Fixed hourly forecast — independent of active weather state
const HOURLY_DATA: HourlyEntry[] = [
  { icon: Cloud,     temp:  '0°' },
  { icon: CloudRain, temp: '-2°' },
  { icon: Snowflake, temp: '-2°' },
  { icon: Snowflake, temp: '-3°' },
]

// ─── Glass Style ──────────────────────────────────────────────────────────────

const GLASS_STYLE: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.10)',
  backdropFilter: 'blur(24px) saturate(1.6)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  boxShadow:
    '0 8px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
}

// ─── Particle Structs ─────────────────────────────────────────────────────────

interface SunnyParticle {
  x: number
  y: number
  r: number
  offset: number
  vx: number
  vy: number
}

interface CloudyBlob {
  x: number
  y: number
  circles: { dx: number; dy: number; r: number }[]
}

interface RainStreak {
  x: number
  y: number
  speed: number
}

interface SnowParticle {
  x: number
  y: number
  r: number
  speed: number
  phase: number
  phaseSpeed: number
  rotAngle: number
  rotSpeed: number
}

// ─── Canvas Particle Renderer ─────────────────────────────────────────────────

function useParticleCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  kind: ParticleKind,
) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height

    let rafId: number
    let alive = true

    // ── Sunny ─────────────────────────────────────────────────────────────────
    if (kind === 'sunny') {
      const particles: SunnyParticle[] = Array.from({ length: 25 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 1 + Math.random() * 2,
        offset: Math.random() * Math.PI * 2,
        vx: 0.1 + Math.random() * 0.2,
        vy: -(0.15 + Math.random() * 0.25),
      }))

      let time = 0
      function tick() {
        if (!alive) return
        ctx.clearRect(0, 0, W, H)
        time += 0.03
        for (const p of particles) {
          const alpha = 0.3 + 0.7 * ((Math.sin(time + p.offset) + 1) / 2)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 220, 100, ${alpha})`
          ctx.fill()
          p.x += p.vx
          p.y += p.vy
          if (p.y < -4) p.y = H + 4
          if (p.x > W + 4) p.x = -4
        }
        rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)
    }

    // ── Cloudy ────────────────────────────────────────────────────────────────
    else if (kind === 'cloudy') {
      const blobs: CloudyBlob[] = Array.from({ length: 6 }, (_, i) => ({
        x: (W / 6) * i + Math.random() * 40,
        y: 20 + Math.random() * (H - 60),
        circles: [
          { dx: 0,   dy: 0,    r: 22 + Math.random() * 6 },
          { dx: 24,  dy: -8,   r: 18 + Math.random() * 6 },
          { dx: -20, dy: -6,   r: 16 + Math.random() * 6 },
        ],
      }))

      function tick() {
        if (!alive) return
        ctx.clearRect(0, 0, W, H)
        for (const blob of blobs) {
          for (const c of blob.circles) {
            ctx.beginPath()
            ctx.arc(blob.x + c.dx, blob.y + c.dy, c.r, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
            ctx.fill()
          }
          blob.x -= 0.3
          // Reset when fully off-screen left — use widest extent (24+28=52px)
          const rightEdge = blob.circles.reduce(
            (max, c) => Math.max(max, c.dx + c.r),
            0,
          )
          if (blob.x + rightEdge < 0) {
            blob.x = W + 30
          }
        }
        rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)
    }

    // ── Rainy ─────────────────────────────────────────────────────────────────
    else if (kind === 'rainy') {
      const streaks: RainStreak[] = Array.from({ length: 40 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        speed: 4 + Math.random() * 3,
      }))

      function tick() {
        if (!alive) return
        ctx.clearRect(0, 0, W, H)
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.5)'
        ctx.lineWidth = 1
        for (const s of streaks) {
          ctx.beginPath()
          ctx.moveTo(s.x, s.y)
          ctx.lineTo(s.x - 4, s.y + 14)
          ctx.stroke()
          s.y += s.speed
          if (s.y > H + 14) {
            s.y = -14
            s.x = Math.random() * W
          }
        }
        rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)
    }

    // ── Snowy ─────────────────────────────────────────────────────────────────
    else if (kind === 'snowy') {
      const flakes: SnowParticle[] = Array.from({ length: 30 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 1.5 + Math.random() * 2,
        speed: 0.5 + Math.random() * 1.0,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.01 + Math.random() * 0.02,
        rotAngle: Math.random() * Math.PI * 2,
        rotSpeed: 0.005 + Math.random() * 0.01,
      }))

      let time = 0
      function tick() {
        if (!alive) return
        ctx.clearRect(0, 0, W, H)
        time += 1
        for (const f of flakes) {
          f.phase += f.phaseSpeed
          f.rotAngle += f.rotSpeed
          f.y += f.speed
          f.x += Math.sin(f.phase) * 0.4

          if (f.y > H + 4) {
            f.y = -4
            f.x = Math.random() * W
          }

          // Draw a 6-pointed ✱ snowflake
          ctx.save()
          ctx.translate(f.x, f.y)
          ctx.rotate(f.rotAngle)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
          ctx.lineWidth = f.r * 0.5
          ctx.lineCap = 'round'
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(Math.cos(angle) * f.r * 2.2, Math.sin(angle) * f.r * 2.2)
            ctx.stroke()
          }
          ctx.restore()
        }
        rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)
    }

    return () => {
      alive = false
      cancelAnimationFrame(rafId)
    }
  }, [canvasRef, kind])
}

// ─── Stagger Variants ─────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function GlassWeatherWidget() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [now, setNow] = useState(() => new Date())
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const activeState = WEATHER_STATES[activeIndex]!

  // Live clock — updates every minute
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  // Temperature spring animation
  const displayTemp = useMotionValue(WEATHER_STATES[0]!.temp)
  const springTemp = useSpring(displayTemp, { stiffness: 80, damping: 18 })
  const roundedTemp = useTransform(springTemp, (v) => `${Math.round(v)}°`)

  useEffect(() => {
    displayTemp.set(activeState.temp)
  }, [activeIndex, activeState.temp, displayTemp])

  // Particle canvas — size the canvas to card dimensions
  const CARD_W = 300
  const CARD_H = 220

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = CARD_W
    canvas.height = CARD_H
  }, [])

  // Re-run particles when state changes
  useParticleCanvas(canvasRef, activeState.particles)

  // Hourly hours
  const baseHour = now.getHours()
  const hours = [0, 1, 2, 3].map((offset) =>
    ((baseHour + offset) % 24).toString().padStart(2, '0'),
  )

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950">
      {/* ── Animated gradient background ──────────────────────────────────── */}
      <AnimatePresence>
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute inset-0"
          style={{ background: activeState.gradient }}
        />
      </AnimatePresence>

      {/* ── Frosted glass card ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 180,
          damping: 20,
          delay: 0.1,
        }}
        style={{
          ...GLASS_STYLE,
          width: CARD_W,
          borderRadius: 28,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Canvas particle layer */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 28,
            pointerEvents: 'none',
          }}
        />

        {/* Card content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ position: 'relative', zIndex: 1, padding: '20px 20px 16px' }}
        >
          {/* Cross-fade text content on state change */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {/* ── Top row: city + temperature ─────────────────────────── */}
              <motion.div
                variants={itemVariants}
                className="mb-1 flex items-start justify-between"
              >
                <span
                  className="text-lg font-semibold"
                  style={{ color: 'rgba(255, 255, 255, 1)' }}
                >
                  Tallinn
                </span>
                <motion.span
                  className="text-5xl font-bold leading-none"
                  style={{ color: 'rgba(255, 255, 255, 1)' }}
                >
                  {roundedTemp}
                </motion.span>
              </motion.div>

              {/* ── Second row: condition + high/low ────────────────────── */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <span className="text-sm font-medium">
                  {activeState.condition}
                </span>
                <span className="text-xs">
                  H: {activeState.high > 0 ? '+' : ''}{activeState.high}°&nbsp;&nbsp;
                  L: {activeState.low > 0 ? '+' : ''}{activeState.low}°
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* ── Divider ───────────────────────────────────────────────────── */}
          <motion.div
            variants={itemVariants}
            className="my-4"
            style={{
              height: 1,
              background: 'rgba(255, 255, 255, 0.15)',
            }}
          />

          {/* ── Hourly pills row ──────────────────────────────────────────── */}
          <div className="mb-4 flex gap-2">
            {HOURLY_DATA.map((entry, i) => {
                const IconComp = entry.icon
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                    className="flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <span
                      className="text-xs"
                      style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    >
                      {hours[i]}
                    </span>
                    <IconComp weight="regular" size={18} />
                    <span
                      className="text-xs font-medium"
                      style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    >
                      {entry.temp}
                    </span>
                  </motion.div>
                )
              })}
          </div>

          {/* ── Condition dots ────────────────────────────────────────────── */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-2"
          >
            {WEATHER_STATES.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveIndex(i)}
                animate={{
                  width: i === activeIndex ? 8 : 6,
                  height: i === activeIndex ? 8 : 6,
                  opacity: i === activeIndex ? 1 : 0.35,
                  scale: i === activeIndex ? 1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                style={{
                  borderRadius: '50%',
                  background: 'white',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'block',
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
