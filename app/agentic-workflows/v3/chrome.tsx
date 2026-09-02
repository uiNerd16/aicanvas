import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import { HeaderSocials } from '../../components/HeaderSocials'

const CRUMB = '/Agentic workflows · v3'

export function V3Header() {
  return (
    <header className="sticky top-0 z-10 hidden h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-sand-300 bg-sand-200 px-6 dark:border-sand-800 dark:bg-sand-950 md:grid">
      <div />
      <Link
        href="/agentic-workflows/v3"
        className="text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400"
      >
        {CRUMB}
      </Link>
      <div className="flex items-center justify-end">
        <HeaderSocials />
      </div>
    </header>
  )
}

export function V3Crumb() {
  return (
    <p className="mb-6 text-sm font-semibold md:hidden">
      <Link href="/agentic-workflows/v3" className="text-olive-500">
        {CRUMB}
      </Link>
    </p>
  )
}

export function Badge({
  tone,
  children,
}: {
  tone: 'free' | 'soon'
  children: ReactNode
}) {
  return (
    <span
      className={
        tone === 'free'
          ? 'rounded-full bg-olive-500/15 px-2.5 py-0.5 text-xs font-semibold text-olive-600 dark:text-olive-400'
          : 'rounded-full bg-sand-300/60 px-2.5 py-0.5 text-xs font-semibold text-sand-700 dark:bg-sand-800 dark:text-sand-300'
      }
    >
      {children}
    </span>
  )
}

/** Section heading used by every act and every detail-page section. */
export function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title: string
  children?: ReactNode
}) {
  return (
    <>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-olive-500">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`${eyebrow ? 'mt-3' : ''} max-w-2xl text-2xl font-bold leading-tight tracking-tight text-sand-900 dark:text-sand-50 sm:text-3xl`}
      >
        {title}
      </h2>
      {children ? (
        <div className="mt-4 max-w-2xl space-y-4 text-base leading-relaxed text-sand-600 dark:text-sand-300 sm:text-lg">
          {children}
        </div>
      ) : null}
    </>
  )
}

export function TextLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-olive-600 transition-colors hover:text-olive-500 dark:text-olive-400"
    >
      {children}
      <ArrowRight
        weight="regular"
        className="size-4 transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  )
}

/** One promise, and the one sentence that says how it is held. */
export function Guarantee({
  claim,
  how,
  enforced,
}: {
  claim: string
  how: string
  enforced: 'code' | 'policy'
}) {
  return (
    <li className="border-t border-sand-300 py-5 dark:border-sand-800">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <h3 className="text-base font-bold text-sand-900 dark:text-sand-50">
          {claim}
        </h3>
        <span
          className={
            enforced === 'code'
              ? 'rounded-full bg-olive-500/15 px-2 py-0.5 text-[11px] font-semibold text-olive-600 dark:text-olive-400'
              : 'rounded-full bg-sand-300/60 px-2 py-0.5 text-[11px] font-semibold text-sand-700 dark:bg-sand-800 dark:text-sand-300'
          }
        >
          {enforced === 'code' ? 'enforced in code' : 'policy'}
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-sand-600 dark:text-sand-400">
        {how}
      </p>
    </li>
  )
}

/** Compact product row used in the closing strip and on the detail pages. */
export function ProductRow({
  href,
  name,
  line,
  badge,
}: {
  href: string
  name: string
  line: string
  badge: ReactNode
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 border-t border-sand-300 py-5 transition-colors hover:bg-sand-100/70 dark:border-sand-800 dark:hover:bg-sand-900/50"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-base font-bold text-sand-900 dark:text-sand-50">
            {name}
          </span>
          {badge}
        </div>
        <p className="mt-1.5 text-sm text-sand-600 dark:text-sand-400">
          {line}
        </p>
      </div>
      <ArrowRight
        weight="regular"
        className="mt-1 size-5 shrink-0 text-sand-400 transition-transform group-hover:translate-x-0.5 group-hover:text-olive-500"
      />
    </Link>
  )
}

export function ExternalLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-medium text-sand-700 underline underline-offset-2 hover:text-sand-900 dark:text-sand-300 dark:hover:text-sand-50"
    >
      {children}
      <ArrowUpRight weight="regular" className="size-3.5" />
    </a>
  )
}
