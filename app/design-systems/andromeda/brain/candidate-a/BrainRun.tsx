'use client'

// ============================================================
// CANDIDATE A — "the run".
//
// Show, don't tell. The page opens mid-build: a prompt types itself,
// the agent's reading list streams past (real file NAMES from the
// generated brain teaser, never brain content), and a real Andromeda
// dashboard fills in panel by panel beside it. Below that, the corpus
// itself is browsable by name, with the rules behind a lock.
//
// Everything is derived from BRAIN_TEASER — counts, sections, names.
// Nothing about the brain's size or shape is hardcoded here.
// ============================================================

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useReducedMotion } from 'framer-motion'
import { ArrowClockwise, ArrowRight, CaretRight, Check, LockSimple } from '@phosphor-icons/react'
import { BRAIN_TEASER } from '@/app/lib/andromeda-brain-teaser.generated'
import { usePremiumStatus } from '@/app/components/billing/usePremiumStatus'
import { tokens } from '@/design-systems/andromeda/tokens'
import { Button, buttonVariants } from '@/design-systems/andromeda/components/Button'
import { andromedaVars } from '@/design-systems/andromeda/components/lib/utils'
import { CornerMarkers } from '@/design-systems/andromeda/components/CornerMarkers'
import { FleetScreen } from './FleetScreen'

const T = tokens
const MONO = "var(--font-sans), 'Manrope', system-ui, sans-serif" // user call 2026-08-04: all page typography in Manrope

// design-systems/ ships as JSDoc-annotated JSX (see design-systems/CLAUDE.md),
// so its forwardRef wrappers carry no prop types in a .tsx context. The rest of
// the repo blanket-@ts-nocheck's the consuming file; these three narrow aliases
// buy the same thing while keeping THIS file fully type-checked.
const Markers = CornerMarkers as unknown as React.FC<{ color?: string }>
const Btn = Button as unknown as React.FC<{
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ElementType
  onClick?: () => void
  children?: React.ReactNode
}>
const dsVars = () => andromedaVars() as React.CSSProperties

type Section = { id: string; label: string; files: readonly string[] }
// Generic over the section list on purpose: the brain is growing to five
// sections, so nothing here may assume three.
const SECTIONS: Section[] = BRAIN_TEASER.sections.map((s) => ({ id: s.id, label: s.label, files: s.files }))

// The reading list shown during the run. Files whose names match what the demo
// screen actually composes float to the front; anything else falls back to the
// section's own order, so a renamed or brand-new file still lists cleanly.
const ON_SCREEN = [
  'composition-recipes', 'layout', 'color-philosophy', 'motion', 'spacing', 'charts',
  'StatTile', 'TrendChart', 'HeatGrid', 'PanelHeader', 'Card', 'Badge',
  'building-with-andromeda',
]
const rank = (f: string) => { const i = ON_SCREEN.indexOf(f); return i < 0 ? 999 : i }
const FEED: string[] = SECTIONS.flatMap((s) =>
  [...s.files].sort((a, b) => rank(a) - rank(b)).slice(0, 4).map((f) => `${s.id}/${f}`),
)

const PROMPT = 'build me a fleet monitoring dashboard'
const PANELS = ['fleet overview', 'telemetry throughput', 'route risk', 'active units']

// One interval, one counter; every phase is derived from it. Cheaper to reason
// about than a chain of timeouts and trivially resettable by "Run again".
const TICK_MS = 40
const T_TYPE = 6
const T_READ = T_TYPE + PROMPT.length + 6
const READ_EVERY = 3
const T_BUILD = T_READ + FEED.length * READ_EVERY + 4
const BUILD_EVERY = 8
const T_PASS = T_BUILD + PANELS.length * BUILD_EVERY + 4
const T_END = T_PASS + 8
const clamp = (n: number, hi: number) => Math.max(0, Math.min(hi, n))

const eyebrow: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: T.typography.size.xs,
  letterSpacing: T.typography.tracking.widest,
  textTransform: 'uppercase',
  color: T.color.text.faint,
  margin: 0,
}
const h2: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 'clamp(20px, 3vw, 28px)',
  fontWeight: T.typography.weight.medium,
  color: T.color.text.primary,
  lineHeight: T.typography.lineHeight.snug,
  margin: `${T.spacing[3]} 0 0`,
}
const body: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: T.typography.size.md,
  color: T.color.text.secondary,
  lineHeight: T.typography.lineHeight.relaxed,
  margin: `${T.spacing[4]} 0 0`,
  maxWidth: 620,
}

export function BrainRun() {
  const reduced = useReducedMotion()
  const [runId, setRunId] = useState(0)
  const [tick, setTick] = useState(0)

  // Premium tri-state: treat 'unknown' as open so a paying subscriber is never
  // flashed an upgrade pitch while entitlement loads. /explore is server-gated,
  // so this can never hand a free user the brain.
  const canOpen = usePremiumStatus() !== 'not-premium'
  const ctaLabel = canOpen ? 'Read the brain' : 'Get the brain with Premium'
  const ctaHref = canOpen ? '/design-systems/andromeda/brain/explore' : '/pricing'

  // The clock only advances from inside the interval callback; the reset lives
  // in the click handler. Nothing sets state synchronously in the effect body.
  useEffect(() => {
    if (reduced) return
    let t = 0
    const id = setInterval(() => {
      t += 1
      setTick(t)
      if (t >= T_END) clearInterval(id)
    }, TICK_MS)
    return () => clearInterval(id)
  }, [runId, reduced])

  // Reduced motion gets the finished state, no animation.
  const clock = reduced ? T_END : tick
  const typed = PROMPT.slice(0, clamp(clock - T_TYPE, PROMPT.length))
  const readCount = clamp(Math.floor((clock - T_READ) / READ_EVERY), FEED.length)
  const built = clamp(Math.floor((clock - T_BUILD) / BUILD_EVERY), PANELS.length)
  const passed = clock >= T_PASS
  const running = clock < T_END

  // A sliding window keeps the log a fixed height, so nothing below it jumps.
  const feedWindow = FEED.slice(Math.max(0, readCount - 5), readCount)

  return (
    <div style={{ background: T.color.surface.base, minHeight: '100%', fontFamily: MONO }}>
      <style>{`
        @keyframes ca-blink { 0%, 55% { opacity: 1 } 56%, 100% { opacity: 0 } }
        .ca-caret { animation: ca-blink 1s steps(1) infinite; }
        .ca-wrap { max-width: 1280px; margin: 0 auto; padding: ${T.spacing[8]} ${T.spacing[6]} ${T.spacing[12]}; }
        .ca-run { display: grid; gap: ${T.spacing[3]}; grid-template-columns: minmax(320px, 400px) 1fr; align-items: start; }
        .ca-corpus { display: grid; gap: ${T.spacing[3]}; grid-template-columns: 210px 1fr 280px; align-items: start; }
        @media (max-width: 1080px) {
          .ca-run { grid-template-columns: 1fr; }
          .ca-corpus { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .ca-wrap { padding: ${T.spacing[6]} ${T.spacing[4]} ${T.spacing[10]}; }
        }
      `}</style>

      <div className="ca-wrap">
        {/* ── HERO ──────────────────────────────────────────────── */}
        <p style={eyebrow}>Andromeda / Brain</p>
        <h1
          style={{
            fontFamily: MONO,
            fontSize: 'clamp(28px, 5vw, 46px)',
            fontWeight: T.typography.weight.medium,
            color: T.color.text.primary,
            lineHeight: T.typography.lineHeight.tight,
            letterSpacing: '-0.01em',
            margin: `${T.spacing[3]} 0 0`,
          }}
        >
          One prompt in.{' '}
          <span style={{ color: T.color.accent[300] }}>A finished screen out.</span>
        </h1>
        <p style={body}>
          This is the loop, replayed. The prompt, the rule files the agent opens on the way, and the screen
          it hands back. Every panel on the right is a real Andromeda component, assembled in the order the
          rules prescribe.
        </p>

        <div className="ca-run" style={{ marginTop: T.spacing[8] }}>
          {/* terminal */}
          <div
            style={{
              position: 'relative',
              background: T.color.surface.raised,
              border: `${T.border.width} solid ${T.color.border.subtle}`,
              padding: T.spacing[4],
            }}
          >
            <Markers color={T.color.border.bright} />

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: T.spacing[3], paddingBottom: T.spacing[3], borderBottom: `${T.border.width} solid ${T.color.border.subtle}` }}>
              <span style={{ ...eyebrow, color: T.color.text.muted }}>Agent session</span>
              <span style={{ ...eyebrow, color: running ? T.color.accent[300] : T.color.text.faint }}>
                {running ? 'running' : 'complete'}
              </span>
            </div>

            <div style={{ minHeight: 250, paddingTop: T.spacing[3], display: 'flex', flexDirection: 'column', gap: T.spacing[2], fontSize: T.typography.size.sm }}>
              {/* the one prompt */}
              <div style={{ display: 'flex', gap: T.spacing[2], color: T.color.text.primary, lineHeight: T.typography.lineHeight.normal }}>
                <span style={{ color: T.color.accent[300] }}>$</span>
                <span style={{ wordBreak: 'break-word' }}>
                  {typed}
                  {typed.length < PROMPT.length && <span className="ca-caret" style={{ color: T.color.accent[300] }}>_</span>}
                </span>
              </div>

              {/* reading list — names only, never rule text */}
              {readCount > 0 && (
                <div style={{ marginTop: T.spacing[2] }}>
                  {/* A sample of the reading list, not a count of it: the log
                      streams a handful of names, the corpus is much bigger. */}
                  <div style={{ ...eyebrow, marginBottom: T.spacing[2] }}>
                    Reading brain, {BRAIN_TEASER.totalFiles} files available
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {feedWindow.map((f) => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: T.spacing[2], color: T.color.text.muted }}>
                        <Check weight="regular" size={T.iconSize.xs} color={T.color.accent[300]} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* composition */}
              {built > 0 && (
                <div style={{ marginTop: T.spacing[3] }}>
                  <div style={{ ...eyebrow, marginBottom: T.spacing[2] }}>Composing screen</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {PANELS.slice(0, built).map((p) => (
                      <div key={p} style={{ display: 'flex', alignItems: 'center', gap: T.spacing[2], color: T.color.text.secondary }}>
                        <CaretRight weight="regular" size={T.iconSize.xs} color={T.color.text.faint} />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {passed && (
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: T.spacing[3],
                    display: 'flex',
                    alignItems: 'center',
                    gap: T.spacing[2],
                    color: T.color.accent[300],
                    borderTop: `${T.border.width} solid ${T.color.border.subtle}`,
                  }}
                >
                  <Check weight="regular" size={T.iconSize.sm} />
                  <span style={{ letterSpacing: T.typography.tracking.wide, textTransform: 'uppercase', fontSize: T.typography.size.xs }}>
                    Conformance tool: on brand
                  </span>
                </div>
              )}
            </div>

            <div style={{ marginTop: T.spacing[4] }}>
              <Btn variant="ghost" size="sm" icon={ArrowClockwise} onClick={() => { setTick(0); setRunId((n) => n + 1) }}>
                Run again
              </Btn>
            </div>
          </div>

          {/* the screen it produced */}
          <FleetScreen revealed={built} />
        </div>

        {/* ── THE CORPUS ────────────────────────────────────────── */}
        <CorpusExplorer />

        {/* ── CTA ───────────────────────────────────────────────── */}
        <div
          style={{
            position: 'relative',
            marginTop: T.spacing[12],
            padding: `${T.spacing[10]} ${T.spacing[6]}`,
            background: T.color.gradient.accentFade,
            border: `${T.border.width} solid ${T.color.border.subtle}`,
            textAlign: 'center',
          }}
        >
          <Markers color={T.color.accent[400]} />
          <p style={{ ...eyebrow, color: T.color.accent[300] }}>Andromeda Premium</p>
          <h2 style={{ ...h2, maxWidth: 620, marginInline: 'auto' }}>Hand the same brain to any AI tool.</h2>
          <p style={{ ...body, marginInline: 'auto', textAlign: 'center' }}>
            Premium installs the whole corpus into your project with one CLI command, and opens the same files
            in a web reader whenever you want to read them yourself.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: T.spacing[3], justifyContent: 'center', marginTop: T.spacing[6] }}>
            {/* Plain Links styled with buttonVariants — Radix Slot doesn't
                tolerate the Button's internal `{icon}{children}` render, so
                asChild would drop the styles onto a Fragment. */}
            <Link href={ctaHref} className={buttonVariants({ variant: 'default', size: 'lg' })} style={dsVars()}>
              {ctaLabel}
              <ArrowRight weight="regular" size={T.iconSize.lg} />
            </Link>
            <Link href="/design-systems/andromeda" className={buttonVariants({ variant: 'outline', size: 'lg' })} style={dsVars()}>
              Explore Andromeda
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── the corpus, browsable by name ───────────────────────────────────────────
function CorpusExplorer() {
  const [sectionId, setSectionId] = useState<string>(SECTIONS[0]?.id ?? '')
  const section = useMemo(() => SECTIONS.find((s) => s.id === sectionId) ?? SECTIONS[0], [sectionId])
  const [selected, setSelected] = useState<string>(section?.files[0] ?? '')

  const pick = (id: string) => {
    const next = SECTIONS.find((s) => s.id === id)
    setSectionId(id)
    setSelected(next?.files[0] ?? '')
  }

  return (
    <div style={{ marginTop: T.spacing[12] }}>
      <p style={eyebrow}>The corpus</p>
      <h2 style={h2}>
        <span style={{ color: T.color.accent[300] }}>{BRAIN_TEASER.totalFiles} files</span> the agent reads
        before it writes a line.
      </h2>
      <p style={body}>
        Not documentation for you. Rules for the machine: when a color is allowed to carry meaning, how far a
        panel may breathe, what every state owes the user. The names are open. The judgment inside them ships
        with Premium.
      </p>

      <div className="ca-corpus" style={{ marginTop: T.spacing[6] }}>
        {/* section rail */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {SECTIONS.map((s) => {
            const active = s.id === section?.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => pick(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: T.spacing[3],
                  padding: `${T.spacing[3]} ${T.spacing[3]}`,
                  background: active ? T.color.surface.raised : 'transparent',
                  border: 'none',
                  borderLeft: `2px solid ${active ? T.color.accent[300] : T.color.border.subtle}`,
                  cursor: 'pointer',
                  fontFamily: MONO,
                  fontSize: T.typography.size.sm,
                  letterSpacing: T.typography.tracking.wide,
                  textTransform: 'uppercase',
                  color: active ? T.color.text.primary : T.color.text.muted,
                  textAlign: 'left',
                  transition: `color ${T.motion.duration.normal} ease, background ${T.motion.duration.normal} ease`,
                }}
              >
                <span>{s.label}</span>
                <span style={{ color: active ? T.color.accent[300] : T.color.text.faint }}>{s.files.length}</span>
              </button>
            )
          })}
        </div>

        {/* file list */}
        <div
          style={{
            position: 'relative',
            border: `${T.border.width} solid ${T.color.border.subtle}`,
            background: T.color.surface.raised,
            padding: T.spacing[3],
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 2,
            maxHeight: 360,
            overflowY: 'auto',
          }}
        >
          <Markers color={T.color.border.bright} />
          {section?.files.map((f) => {
            const active = f === selected
            return (
              <button
                key={f}
                type="button"
                onClick={() => setSelected(f)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: T.spacing[2],
                  padding: `6px ${T.spacing[2]}`,
                  background: active ? T.color.surface.active : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: MONO,
                  fontSize: T.typography.size.sm,
                  color: active ? T.color.text.primary : T.color.text.secondary,
                  textAlign: 'left',
                  transition: `background ${T.motion.duration.normal} ease`,
                }}
              >
                <LockSimple weight="regular" size={T.iconSize.xs} color={active ? T.color.accent[300] : T.color.text.faint} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f}</span>
              </button>
            )
          })}
        </div>

        {/* locked preview — placeholder bars only, never a line of the real file */}
        <div
          style={{
            position: 'relative',
            border: `${T.border.width} solid ${T.color.border.subtle}`,
            background: T.color.surface.raised,
            padding: T.spacing[4],
          }}
        >
          <Markers color={T.color.border.bright} />
          <div style={{ ...eyebrow, color: T.color.text.muted }}>{section?.label}</div>
          <div
            style={{
              marginTop: T.spacing[2],
              fontSize: T.typography.size.lg,
              color: T.color.text.primary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {selected}
          </div>

          <div style={{ marginTop: T.spacing[4], display: 'flex', flexDirection: 'column', gap: T.spacing[2], filter: 'blur(3px)', opacity: 0.5 }} aria-hidden>
            {[92, 68, 80, 44, 88, 60, 74, 36].map((w, i) => (
              <div key={i} style={{ height: 7, width: `${w}%`, background: i % 3 === 0 ? T.color.border.bright : T.color.border.base }} />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: T.spacing[2], marginTop: T.spacing[4], color: T.color.text.muted, fontSize: T.typography.size.xs, letterSpacing: T.typography.tracking.wide, textTransform: 'uppercase' }}>
            <LockSimple weight="regular" size={T.iconSize.sm} color={T.color.accent[300]} />
            <span>Rules ship with Premium</span>
          </div>
        </div>
      </div>
    </div>
  )
}
