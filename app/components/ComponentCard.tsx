'use client'

import Link from 'next/link'
import { ArrowRight, ImageSquare } from '@phosphor-icons/react'

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
  image?: string
  href: string
}

// ─── ComponentCard ─────────────────────────────────────────────────────────────

export function ComponentCard({ name, description, href, image }: ComponentCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-sand-300 bg-sand-100 shadow-sm transition-all duration-200 hover:border-sand-400 hover:shadow-xl hover:shadow-sand-300/60 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700 dark:hover:shadow-2xl dark:hover:shadow-black/50"
    >
      <div className="relative aspect-video overflow-hidden bg-sand-950">
        {image ? (
          <>
            <img src={image} alt={name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-125" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-sand-900 to-transparent dark:from-sand-900" />
          </>
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
