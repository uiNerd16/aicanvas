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
      { icon: User, label: 'Profile'  },
      { icon: Gear, label: 'Settings' },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { icon: Users,      label: 'Team'    },
      { icon: CreditCard, label: 'Billing' },
    ],
  },
]

// ─── Shared glass style ───────────────────────────────────────────────────────

const glassPanel = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(24px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)',
}

// ─── MenuItem ─────────────────────────────────────────────────────────────────

function MenuItem({
  icon: Icon,
  label,
  index,
}: {
  icon: typeof User
  label: string
  index: number
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26, delay: 0.06 + index * 0.04 }}
      whileHover={{ x: 3, backgroundColor: 'rgba(255,255,255,0.07)' }}
      whileTap={{ scale: 0.98 }}
      className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5"
      style={{ background: 'transparent' }}
    >
      <Icon size={20} weight="regular" className="shrink-0 text-white/50" />
      <span className="text-sm font-medium text-white/70">{label}</span>
    </motion.button>
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

      <div ref={ref} className="relative flex flex-col items-center px-4">

        {/* Trigger */}
        <motion.button
          onClick={() => setOpen(v => !v)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2.5"
          style={glassPanel}
        >
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

        {/* Dropdown — min-w matches trigger, max-w caps on small screens */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, y: -8, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="absolute top-full mt-2 w-[min(256px,calc(100vw-32px))] rounded-2xl p-2"
              style={{ ...glassPanel, transformOrigin: 'top center' }}
            >
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
                    <MenuItem key={item.label} icon={item.icon} label={item.label} index={itemIndex++} />
                  ))}
                </div>
              ))}

              {/* Divider */}
              <div className="mx-2 my-1.5 h-[1px]" style={{ background: 'rgba(255,255,255,0.07)' }} />

              {/* Log out */}
              <motion.button
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26, delay: 0.06 + itemIndex * 0.04 }}
                whileHover={{ x: 3, backgroundColor: 'rgba(255, 80, 80, 0.12)' }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5"
                style={{ background: 'transparent' }}
              >
                <SignOut size={20} weight="regular" style={{ color: 'rgba(255,90,90,0.7)' }} />
                <span className="text-sm font-medium" style={{ color: 'rgba(255,90,90,0.8)' }}>Log Out</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
