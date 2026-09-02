import type { CSSProperties, ReactNode } from 'react'
import { User } from '@phosphor-icons/react/dist/ssr'

// ─── Shared diagram vocabulary ──────────────────────────────────────────────
// Every diagram on these pages speaks the same language:
//   rounded-rect card  = a step or an agent
//   olive              = automated action taken by an agent
//   sand neutral       = an artifact you can look at
//   dashed outline     = a delegated, dynamic or async hop
//   dashed card + user = the human decision, always drawn the same way
// The panels these diagrams sit on are sand-950 in both themes (the site's
// preview-surface pattern), so the palette here is written dark-first.

export type Tone = 'agent' | 'artifact' | 'human'

const TONE_BASE: Record<Tone, string> = {
  agent: 'fill-olive-500/12 stroke-olive-500',
  artifact: 'fill-sand-900 stroke-sand-700',
  human: 'fill-sand-900/60 stroke-sand-400',
}

const TONE_TITLE: Record<Tone, string> = {
  agent: 'fill-olive-400',
  artifact: 'fill-sand-100',
  human: 'fill-sand-50',
}

export function NodeCard({
  x,
  y,
  w,
  h,
  title,
  sub,
  tone = 'artifact',
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub?: string
  tone?: Tone
}) {
  const cx = x + w / 2
  const isHuman = tone === 'human'
  const iconH = isHuman ? 20 : 0
  const gap = isHuman ? 8 : 0
  const titleH = 14
  const subH = sub ? 16 : 0
  const top = y + (h - (iconH + gap + titleH + subH)) / 2
  const titleBaseline = top + iconH + gap + titleH
  const subBaseline = titleBaseline + subH

  return (
    <g>
      {/* Opaque base so the travelling pulse disappears behind a card. */}
      <rect x={x} y={y} width={w} height={h} rx={12} className="fill-sand-950" />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        strokeWidth={1.5}
        strokeDasharray={isHuman ? '6 5' : undefined}
        className={TONE_BASE[tone]}
      />
      {isHuman ? (
        <User
          weight="regular"
          size={20}
          x={cx - 10}
          y={top}
          className="text-sand-300"
        />
      ) : null}
      <text
        x={cx}
        y={titleBaseline}
        textAnchor="middle"
        className={`${TONE_TITLE[tone]} text-[14px] font-semibold`}
      >
        {title}
      </text>
      {sub ? (
        <text
          x={cx}
          y={subBaseline}
          textAnchor="middle"
          className="fill-sand-500 text-[11px]"
        >
          {sub}
        </text>
      ) : null}
    </g>
  )
}

/** Dashed container that groups nodes, e.g. the sandbox or the plugin. */
export function Frame({
  x,
  y,
  w,
  h,
  label,
  note,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
  note?: string
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={16}
        strokeWidth={1.5}
        strokeDasharray="7 6"
        className="fill-sand-900/30 stroke-sand-600"
      />
      <text
        x={x + 16}
        y={y + 26}
        className="fill-sand-400 text-[11px] font-semibold tracking-[0.14em] uppercase"
      >
        {label}
      </text>
      {note ? (
        <text
          x={x + w - 16}
          y={y + 26}
          textAnchor="end"
          className="fill-sand-500 text-[11px]"
        >
          {note}
        </text>
      ) : null}
    </g>
  )
}

export function Flow({
  d,
  dashed,
  arrow = true,
  markerId,
}: {
  d: string
  dashed?: boolean
  arrow?: boolean
  markerId: string
}) {
  return (
    <path
      d={d}
      fill="none"
      strokeWidth={1.5}
      strokeDasharray={dashed ? '6 5' : undefined}
      markerEnd={arrow ? `url(#${markerId})` : undefined}
      className={dashed ? 'stroke-sand-600' : 'stroke-sand-500'}
    />
  )
}

export function EdgeLabel({
  x,
  y,
  anchor = 'middle',
  children,
}: {
  x: number
  y: number
  anchor?: 'start' | 'middle' | 'end'
  children: ReactNode
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className="fill-sand-400 text-[11px] font-medium"
    >
      {children}
    </text>
  )
}

export function ArrowDefs({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M0,1.5 L9,5 L0,8.5 z" className="fill-sand-500" />
      </marker>
    </defs>
  )
}

/**
 * A single pulse travelling along `d`. Implemented as a short round dash whose
 * offset animates across the full path length, so no animation library and no
 * client component is needed. `length` is the path length in viewBox units.
 */
export function TravelPath({
  d,
  length,
  duration = 7,
}: {
  d: string
  length: number
  duration?: number
}) {
  const style = {
    strokeDasharray: `6 ${length}`,
    '--aic-v3-len': String(length + 6),
    '--aic-v3-dur': `${duration}s`,
  } as CSSProperties

  return (
    <>
      <style href="aic-v3-motion" precedence="default">
        {MOTION_CSS}
      </style>
      <path
        d={d}
        fill="none"
        strokeWidth={4}
        strokeLinecap="round"
        className="aic-v3-travel stroke-olive-400"
        style={style}
      />
    </>
  )
}

const MOTION_CSS = `
@keyframes aicV3Travel {
  from { stroke-dashoffset: var(--aic-v3-len, 0); }
  to { stroke-dashoffset: 0; }
}
.aic-v3-travel {
  animation: aicV3Travel var(--aic-v3-dur, 7s) linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .aic-v3-travel { animation: none; opacity: 0; }
}
`

/**
 * Dark panel every diagram sits on. Always sand-950, in both themes, matching
 * the component preview surface used across the site. The diagram keeps its
 * own horizontal scroll on small screens so the page never scrolls sideways.
 */
export function DiagramPanel({
  children,
  caption,
}: {
  children: ReactNode
  caption?: ReactNode
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-sand-300 bg-sand-950 dark:border-sand-800">
      <div className="overflow-x-auto px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </div>
      {caption ? (
        <figcaption className="border-t border-sand-800 px-5 py-3 text-xs leading-relaxed text-sand-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

/** Legend row, drawn with the same vocabulary as the diagrams. */
export function DiagramLegend() {
  return (
    <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-sand-400">
      <li className="flex items-center gap-2">
        <svg width="26" height="8" viewBox="0 0 26 8" aria-hidden>
          <path d="M0,4 H26" strokeWidth="1.5" className="stroke-sand-500" />
        </svg>
        Fixed flow
      </li>
      <li className="flex items-center gap-2">
        <svg width="26" height="8" viewBox="0 0 26 8" aria-hidden>
          <path
            d="M0,4 H26"
            strokeWidth="1.5"
            strokeDasharray="6 5"
            className="stroke-sand-600"
          />
        </svg>
        Delegated hop
      </li>
      <li className="flex items-center gap-2">
        <svg width="26" height="14" viewBox="0 0 26 14" aria-hidden>
          <rect
            x="1"
            y="1"
            width="24"
            height="12"
            rx="4"
            strokeWidth="1.5"
            strokeDasharray="5 4"
            className="fill-sand-900/60 stroke-sand-400"
          />
        </svg>
        You decide
      </li>
      <li className="flex items-center gap-2">
        <svg width="26" height="14" viewBox="0 0 26 14" aria-hidden>
          <rect
            x="1"
            y="1"
            width="24"
            height="12"
            rx="4"
            strokeWidth="1.5"
            className="fill-olive-500/12 stroke-olive-500"
          />
        </svg>
        Agent runs it
      </li>
    </ul>
  )
}
