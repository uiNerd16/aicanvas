'use client'

import type { ComponentType } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import { MotionConfig } from 'framer-motion'

// ─── Types (also used by ComponentPageView + registry) ────────────────────────

export type Platform = 'V0' | 'Bolt' | 'Lovable' | 'Claude Code' | 'Cursor'
export const PLATFORMS: Platform[] = ['V0', 'Bolt', 'Lovable', 'Claude Code', 'Cursor']

export interface Tag {
  label: string
  accent?: boolean
}

export interface ComponentCardProps {
  name: string
  description: string
  tags: Tag[]
  // Component type (not JSX) so MotionConfig context reaches it directly
  PreviewComponent: ComponentType
  href: string
}

// ─── ComponentCard ─────────────────────────────────────────────────────────────

export function ComponentCard({ name, description, PreviewComponent, href }: ComponentCardProps) {
  const [hovered, setHovered] = useState(false)
  const [mountKey, setMountKey] = useState(0)

  const handleMouseEnter = () => {
    setMountKey((k) => k + 1)
    setHovered(true)
  }

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-sand-300 bg-sand-100 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sand-400 hover:shadow-xl hover:shadow-sand-300/60 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700 dark:hover:shadow-2xl dark:hover:shadow-black/50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-48 overflow-hidden bg-sand-950">
        {hovered ? (
          // Hover: fresh mount so every animation replays from the start
          <div key={mountKey} className="absolute inset-0 flex items-center justify-center">
            <PreviewComponent />
          </div>
        ) : (
          // Default: MotionConfig IS a true ancestor here — context reaches PreviewComponent.
          // reducedMotion="always" freezes all motion.div animations at their target values.
          // [&_canvas]:hidden stops Three.js / WebGL canvases from rendering.
          <MotionConfig reducedMotion="always">
            <div className="absolute inset-0 flex items-center justify-center [&_canvas]:hidden">
              <PreviewComponent />
            </div>
          </MotionConfig>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-bold text-sand-900 dark:text-sand-50">{name}</h3>
          <p className="mt-1 line-clamp-2 text-sm font-normal text-sand-600 dark:text-sand-400">
            {description}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-1">
          <span className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-sand-300 py-2.5 text-sm font-semibold text-sand-700 transition-colors group-hover:border-olive-500 group-hover:bg-olive-500 group-hover:text-sand-950 dark:border-sand-700 dark:text-sand-300 dark:group-hover:border-olive-500 dark:group-hover:bg-olive-500 dark:group-hover:text-sand-950">
            View Component
            <ArrowRight weight="regular" size={14} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
