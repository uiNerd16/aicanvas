import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  Brain,
  DotsThreeOutline,
  ShieldCheck,
} from '@phosphor-icons/react/dist/ssr'

// Card for one plugin. The whole card is a single link: the title picks up an
// arrow, the content slides toward the cursor, and the preview panel is
// deliberately larger than the card so it runs off the bottom and right edges.

const CARD_BASE =
  'group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-sand-300 bg-sand-100 transition-colors hover:border-sand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-200 dark:border-sand-800 dark:bg-sand-900 dark:hover:border-sand-700 dark:focus-visible:ring-offset-sand-950'

// One transform carries the whole card content, text and preview together.
const SHIFT =
  'absolute inset-0 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:translate-x-2 motion-safe:group-hover:translate-y-2 motion-safe:group-focus-visible:translate-x-2 motion-safe:group-focus-visible:translate-y-2'

// Larger than the card on purpose, tilted, and clipped by the card edges.
const PANEL =
  'absolute left-[8%] top-[52%] w-[120%] overflow-hidden rounded-xl border border-sand-800 bg-sand-950 shadow-2xl shadow-sand-950/30 transition-shadow duration-300 group-hover:shadow-sand-950/50 [transform:perspective(1200px)_rotateX(6deg)_rotateY(-6deg)]'

export function PluginCard({
  href,
  name,
  line,
  badge,
  badgeTone,
  preview,
}: {
  href: string
  name: string
  line: string
  badge: string
  badgeTone: 'olive' | 'quiet'
  preview: ReactNode
}) {
  return (
    <Link href={href} className={CARD_BASE}>
      <div className={SHIFT}>
        <div className="px-6 pt-6 sm:px-7 sm:pt-7">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <h3 className="flex items-center gap-1.5 text-xl font-bold text-sand-900 dark:text-sand-50 sm:text-2xl">
              {name}
              <ArrowUpRight
                weight="regular"
                aria-hidden
                className="size-5 shrink-0 -translate-x-1 text-olive-500 opacity-0 transition duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
              />
            </h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                badgeTone === 'olive'
                  ? 'bg-olive-500/15 text-olive-600 dark:text-olive-400'
                  : 'bg-sand-300/60 text-sand-700 dark:bg-sand-800 dark:text-sand-300'
              }`}
            >
              {badge}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 pr-4 text-base text-sand-500 dark:text-sand-400 sm:text-lg">
            {line}
          </p>
        </div>

        <div aria-hidden className={PANEL}>
          {preview}
        </div>
      </div>
    </Link>
  )
}

// The hub is still filling up, so the last slot says so and stays quiet.
export function PlaceholderCard({
  title,
  line,
}: {
  title: string
  line: string
}) {
  return (
    <div className="flex aspect-[4/3] flex-col rounded-2xl border border-dashed border-sand-300 px-6 pt-6 dark:border-sand-800 sm:px-7 sm:pt-7">
      <DotsThreeOutline
        weight="regular"
        className="size-5 text-sand-400 dark:text-sand-600"
      />
      <h3 className="mt-3 text-xl font-bold text-sand-500 dark:text-sand-500 sm:text-2xl">
        {title}
      </h3>
      <p className="mt-2 line-clamp-2 pr-4 text-base text-sand-500 dark:text-sand-500 sm:text-lg">
        {line}
      </p>
    </div>
  )
}

// Shared window chrome for the mock previews. Always dark, like every other
// preview surface on the site.
function MockWindow({
  mark,
  label,
  children,
}: {
  mark: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="min-h-[190px]">
      <div className="flex items-center gap-2 border-b border-sand-800 px-3 py-2">
        {mark}
        <span className="font-mono text-[10px] text-sand-500">{label}</span>
        <span className="ml-auto flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-sand-800" />
          <span className="size-1.5 rounded-full bg-sand-800" />
          <span className="size-1.5 rounded-full bg-sand-800" />
        </span>
      </div>
      <div className="px-3 py-3">{children}</div>
    </div>
  )
}

function MockLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sand-500">
      {children}
    </p>
  )
}

const RECALLED = [
  { file: 'deploy-rules.md', hook: 'release branch, never main', age: '3d' },
  { file: 'pricing-copy.md', hook: 'one price, no per seat line', age: '1w' },
  { file: 'review-gate.md', hook: 'diff read before it counts', age: '2w' },
]

export function MemoryMock() {
  return (
    <MockWindow
      mark={<Brain weight="regular" className="size-5 text-sand-400" />}
      label="memoryhd"
    >
      <MockLabel>Recall</MockLabel>
      <ul className="mt-2 space-y-1.5">
        {RECALLED.map((note) => (
          <li key={note.file} className="flex items-baseline gap-2">
            <span className="shrink-0 font-mono text-[10px] text-sand-300">
              {note.file}
            </span>
            <span className="truncate text-[10px] text-sand-500">{note.hook}</span>
            <span className="ml-auto shrink-0 font-mono text-[10px] text-sand-500">
              {note.age}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-2 border-t border-sand-800 pt-2.5">
        <span className="size-1.5 shrink-0 rounded-full bg-olive-500" />
        <span className="text-[10px] text-sand-400">Saved to memory</span>
        <span className="ml-auto shrink-0 font-mono text-[10px] text-sand-500">
          deploy-rules.md
        </span>
      </div>
    </MockWindow>
  )
}

const CAGE_ROWS: { key: string; value: string; tone: 'blocked' | 'open' }[] = [
  { key: 'git', value: 'blocked', tone: 'blocked' },
  { key: 'network', value: 'blocked', tone: 'blocked' },
  { key: 'secrets', value: 'blocked', tone: 'blocked' },
  { key: 'diff', value: 'returned for review', tone: 'open' },
]

export function CageMock() {
  return (
    <MockWindow
      mark={<ShieldCheck weight="regular" className="size-5 text-sand-400" />}
      label="gpt-cage"
    >
      <MockLabel>Sandbox</MockLabel>
      <ul className="mt-2 space-y-1.5">
        {CAGE_ROWS.map((row) => (
          <li key={row.key} className="flex items-baseline gap-2">
            <span
              className={`size-1.5 shrink-0 translate-y-[-1px] rounded-full ${
                row.tone === 'blocked' ? 'bg-red-400/70' : 'bg-emerald-400/70'
              }`}
            />
            <span className="shrink-0 font-mono text-[10px] text-sand-300">
              {row.key}
            </span>
            <span className="truncate font-mono text-[10px] text-sand-500">
              {row.value}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-2 border-t border-sand-800 pt-2.5">
        <span className="size-1.5 shrink-0 rounded-full bg-olive-500" />
        <span className="text-[10px] text-sand-400">Waiting on your review</span>
        <span className="ml-auto shrink-0 font-mono text-[10px] text-sand-500">
          gpt_run
        </span>
      </div>
    </MockWindow>
  )
}
