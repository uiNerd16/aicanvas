'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Gear,
  SignOut,
  Users,
  CreditCard,
  CaretDown,
} from '@phosphor-icons/react'

// ─── Config ───────────────────────────────────────────────────────────────────

const BACKGROUND = 'https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133'

const USER = {
  name: 'Jennifer Rivera',
  email: 'jennifer@studio.io',
  initials: 'JR',
}

const MENU_GROUPS = [
  {
    label: 'Account',
    items: [
      { icon: User, label: 'Profile',  color: '#3A86FF' },
      { icon: Gear, label: 'Settings', color: '#B388FF' },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { icon: Users,      label: 'Team',    color: '#06D6A0' },
      { icon: CreditCard, label: 'Billing', color: '#FFBE0B' },
    ],
  },
]

// ─── Shared glass style ───────────────────────────────────────────────────────

const glassPanel = {
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)',
}

const glassPanelBlur = {
  backdropFilter: 'blur(24px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
}

// Active glow — warm orange border + ambient glow (matches glass-search-bar)
const ACTIVE_GLOW =
  '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1.5px rgba(255, 160, 50, 0.5), 0 0 20px rgba(255, 160, 50, 0.12)'

// ─── MenuItem ─────────────────────────────────────────────────────────────────

function MenuItem({
  icon: Icon,
  label,
  color,
  index,
}: {
  icon: typeof User
  label: string
  color: string
  index: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay: 0.06 + index * 0.04 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5"
      style={{ minHeight: 44, background: 'transparent' }}
    >
      {/* Animated group: icon badge + label — scales and nudges right on hover */}
      <motion.button
        onClick={() => {}}
        animate={{
          x: hovered ? 3 : 0,
          scale: hovered ? 1.08 : 1,
        }}
        whileTap={{ scale: 0.90 }}
        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5"
        style={{ background: 'transparent', transformOrigin: 'left center' }}
      >
        {/* Icon badge — notification-style tinted */}
        <div
          className="flex shrink-0 items-center justify-center rounded-xl"
          style={{
            width: 32,
            height: 32,
            background: `${color}18`,
            border: `1px solid ${color}22`,
          }}
        >
          <Icon size={16} weight="regular" style={{ color }} />
        </div>
        <span
          className="text-sm font-medium"
          style={{
            color: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.70)',
            transition: 'color 0.15s',
          }}
        >
          {label}
        </span>
      </motion.button>
    </motion.div>
  )
}

// ─── GlassUserMenu ────────────────────────────────────────────────────────────

export function GlassUserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click or touch
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [open])

  let itemIndex = 0

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950">
      <img
        src={BACKGROUND}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
      />

      <div ref={ref} className="relative flex flex-col items-center px-4" style={{ marginTop: -150 }}>

        {/* Trigger — orange glow when open */}
        <motion.button
          onClick={() => setOpen(v => !v)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          animate={{ boxShadow: open ? ACTIVE_GLOW : glassPanel.boxShadow }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="relative isolate flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2.5"
          style={{
            background: glassPanel.background,
            border: glassPanel.border,
          }}
        >
          <div className="pointer-events-none absolute inset-0 z-[-1] rounded-2xl" style={glassPanelBlur} />
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #FF7B54, #FF6BF5)' }}
          >
            {USER.initials}
          </div>
          <span className="text-sm font-semibold text-white/80">{USER.name}</span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            <CaretDown size={18} weight="regular" className="text-white/40" />
          </motion.div>
        </motion.button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, y: -8, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="absolute isolate top-full mt-2 w-[min(256px,calc(100vw-32px))] rounded-2xl p-2"
              style={{ ...glassPanel, transformOrigin: 'top center' }}
            >
              <div className="pointer-events-none absolute inset-0 z-[-1] rounded-2xl" style={glassPanelBlur} />
              {/* Top edge highlight */}
              <div
                className="absolute left-6 right-6 top-0 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }}
              />

              {/* Menu groups */}
              {MENU_GROUPS.map((group) => (
                <div key={group.label} className="mb-1">
                  <p className="mb-0.5 px-3 pt-1 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                    {group.label}
                  </p>
                  {group.items.map((item) => (
                    <MenuItem key={item.label} icon={item.icon} label={item.label} color={item.color} index={itemIndex++} />
                  ))}
                </div>
              ))}

              {/* Divider */}
              <div className="mx-2 my-1.5 h-[1px]" style={{ background: 'rgba(255,255,255,0.07)' }} />

              {/* Log out — same hover pattern */}
              <LogOutItem index={itemIndex} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Log Out Item ─────────────────────────────────────────────────────────────

function LogOutItem({ index }: { index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay: 0.06 + index * 0.04 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5"
      style={{ minHeight: 44, background: 'transparent' }}
    >
      <motion.button
        onClick={() => {}}
        animate={{
          x: hovered ? 3 : 0,
          scale: hovered ? 1.08 : 1,
        }}
        whileTap={{ scale: 0.90 }}
        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5"
        style={{ background: 'transparent', transformOrigin: 'left center' }}
      >
        <div
          className="flex shrink-0 items-center justify-center rounded-xl"
          style={{
            width: 32,
            height: 32,
            background: '#FF5A5A18',
            border: '1px solid #FF5A5A22',
          }}
        >
          <SignOut size={16} weight="regular" style={{ color: '#FF5A5A' }} />
        </div>
        <span
          className="text-sm font-medium"
          style={{
            color: hovered ? 'rgba(255,90,90,0.95)' : 'rgba(255,90,90,0.70)',
            transition: 'color 0.15s',
          }}
        >
          Log Out
        </span>
      </motion.button>
    </motion.div>
  )
}
