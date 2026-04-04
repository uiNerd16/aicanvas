'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useMotionTemplate, useTransform, useSpring } from 'framer-motion'
import { ChartLineUp, Lightning, ShieldCheck, ArrowRight } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

// ─── Customise here ──────────────────────────────────────────────────────────

const BACKGROUND = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133'

const CARDS: { title: string; subtitle: string; gradient: string; cta: string; Icon: Icon }[] = [
  { title: 'Analytics',  subtitle: 'Real-time metrics and insights for your application.',    gradient: '#5B8FF9, #A78BFA', cta: 'View Dashboard',    Icon: ChartLineUp },
  { title: 'Automation', subtitle: 'Streamline your workflows with intelligent triggers.',     gradient: '#FF6BF5, #FF6680', cta: 'Create Workflow',    Icon: Lightning    },
  { title: 'Security',   subtitle: 'Enterprise-grade protection for your data.',              gradient: '#FF7B54, #FFBE0B', cta: 'View Report',        Icon: ShieldCheck  },
]

// ─────────────────────────────────────────────────────────────────────────────

function GlassCardItem({
  title,
  subtitle,
  gradient,
  cta,
  Icon,
}: {
  title: string
  subtitle: string
  gradient: string
  cta: string
  Icon: Icon
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 })
  const glareX  = useTransform(mouseX, [0, 1], [0, 100])
  const glareY  = useTransform(mouseY, [0, 1], [0, 100])
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4), transparent 50%)`

  const handleMouse = (e: React.MouseEvent) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const handleLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="relative w-64 cursor-pointer overflow-hidden rounded-3xl p-[1px]"
    >
      {/* Rotating border gradient */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-30"
        style={{ background: `linear-gradient(135deg, ${gradient}, transparent 60%)` }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Card body */}
      <div
        className="relative rounded-3xl p-6"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        }}
      >
        {/* Glare highlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-40"
          style={{ background: glareBackground }}
        />

        {/* Icon */}
        <motion.div
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${gradient})`,
            boxShadow: `0 4px 16px ${gradient.split(',')[0]}44`,
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <Icon size={22} weight="regular" color="rgba(255,255,255,0.9)" />
        </motion.div>

        <h3 className="mb-2 text-base font-semibold text-white/90">{title}</h3>
        <p className="mb-5 text-sm leading-relaxed text-white/40">{subtitle}</p>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-between rounded-2xl px-4 py-3"
          style={{
            background: `linear-gradient(135deg, ${gradient.split(',')[0]}40, ${gradient.split(',')[1]?.trim() ?? gradient.split(',')[0]}28)`,
            border: `1px solid ${gradient.split(',')[0]}55`,
            boxShadow: `0 2px 12px ${gradient.split(',')[0]}25`,
            transition: 'box-shadow 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 4px 20px ${gradient.split(',')[0]}45`)}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 2px 12px ${gradient.split(',')[0]}25`)}
        >
          <span
            className="text-sm font-semibold"
            style={{ color: `${gradient.split(',')[0]}ee` }}
          >
            {cta}
          </span>
          <ArrowRight
            size={16}
            weight="regular"
            style={{ color: `${gradient.split(',')[0]}cc` }}
          />
        </motion.button>

        {/* Top edge highlight */}
        <div
          className="absolute left-6 right-6 top-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
        />
      </div>
    </motion.div>
  )
}

export function GlassCard() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950">
      <img
        src={BACKGROUND}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="relative flex flex-wrap items-center justify-center gap-6 px-6">
        {CARDS.map((card) => (
          <GlassCardItem key={card.title} {...card} />
        ))}
      </div>
    </div>
  )
}
