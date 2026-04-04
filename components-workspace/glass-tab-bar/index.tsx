'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { House, Compass, PlusCircle, ChatCircle, User } from '@phosphor-icons/react'

const TABS = [
  { icon: House,       label: 'Home'     },
  { icon: Compass,     label: 'Explore'  },
  { icon: PlusCircle,  label: 'Create'   },
  { icon: ChatCircle,  label: 'Messages' },
  { icon: User,        label: 'Profile'  },
]

const ACCENT = 'rgba(255, 155, 50, 1)'

export function GlassTabBar() {
  const [active, setActive]   = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-950">
      <img
        src="https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%201%20(1).png?updatedAt=1775223702866"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
      />

      {/* Glass tab bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        className="relative flex w-[380px] items-center justify-around rounded-full px-5 py-2.5"
        style={{
          background: 'rgba(255, 255, 255, 0.07)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          border: '1px solid rgba(255, 255, 255, 0.11)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}
      >
        {TABS.map((tab, i) => {
          const Icon     = tab.icon
          const isActive = active === i
          const isHover  = hovered === i && !isActive

          return (
            <motion.button
              key={tab.label}
              onClick={() => setActive(i)}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              className="relative flex cursor-pointer flex-col items-center gap-[3px] px-3 py-1"
              whileTap={{ scale: 0.85 }}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-glow"
                  className={`absolute -inset-y-1 rounded-full ${
                    i === 0                  ? '-left-5 -right-3'  :
                    i === TABS.length - 1   ? '-left-3 -right-5'  :
                                              '-inset-x-3'
                  }`}
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.08)' }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* Shift content to pill center for edge tabs (pill is asymmetric by 8px → offset 4px) */}
              <div
                className="relative z-10 flex flex-col items-center gap-[3px]"
                style={{
                  transform: i === 0 ? 'translateX(-4px)' : i === TABS.length - 1 ? 'translateX(4px)' : undefined,
                }}
              >
                <motion.div
                  animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -1 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Icon
                    size={24}
                    weight="regular"
                    style={{
                      color: isActive ? ACCENT : isHover ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.32)',
                      transition: 'color 0.2s ease',
                    }}
                  />
                </motion.div>

                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: isActive ? ACCENT : isHover ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.32)',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {tab.label}
                </span>
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
