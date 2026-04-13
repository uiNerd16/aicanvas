'use client'

import Link from 'next/link'
import { ArrowRight, ImageSquare } from '@phosphor-icons/react'

// ─── Types (also used by ComponentPageView + registry) ────────────────────────

export type Platform = 'Claude' | 'GPT' | 'Gemini' | 'V0'
export const PLATFORMS: Platform[] = ['Claude', 'GPT', 'Gemini', 'V0']

export interface Tag {
  label: string
  accent?: boolean
}

export interface ComponentCardProps {
  name: string
  description: string
  tags: Tag[]
  image?: string
  href: string
  badge?: string
}

// ─── ComponentCard ─────────────────────────────────────────────────────────────

export function ComponentCard({ name, description, href, image, badge }: ComponentCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-sand-300 bg-sand-950 shadow-sm transition-all duration-200 hover:border-sand-400 hover:shadow-xl hover:shadow-sand-300/60 dark:border-sand-800 dark:bg-sand-950 dark:hover:border-sand-700 dark:hover:shadow-2xl dark:hover:shadow-black/50"
    >
      {/* Image — extends slightly behind the content panel */}
      <div className="relative aspect-video overflow-hidden bg-sand-900">
        {badge && (
          <span className="absolute right-3 top-3 z-10 rounded-full border border-olive-500 px-2.5 py-0.5 text-[11px] font-semibold text-olive-400">
            {badge}
          </span>
        )}
        {image ? (
          <img src={image} alt={name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-125" />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          >
            <ImageSquare weight="regular" size={28} className="text-sand-700" />
          </div>
        )}
      </div>

      {/* Card body — floats over image with rounded top corners */}
      <div className="relative -mt-4 flex flex-1 flex-col gap-3 rounded-t-2xl bg-sand-100 p-5 shadow-[0_-8px_24px_rgba(0,0,0,0.10)] dark:bg-sand-900 dark:shadow-[0_-8px_24px_rgba(0,0,0,0.25)]">
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
