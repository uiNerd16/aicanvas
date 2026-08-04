'use client'

// ============================================================
// CANDIDATE B: the Andromeda Brain as a designed essay.
//
// Deliberate departure from BrainStoryV4: no 3D hero, no bento,
// no benefit grid. One typographic spine, five numbered chapters,
// Manrope for prose against JetBrains Mono for every piece of
// structure and data. Accent teal is used only where something is
// measured (counts, the active chapter tick, the one CTA).
//
// Every number on the page derives from BRAIN_TEASER (file NAMES
// and counts only, generated at build time). Never brain content.
// ============================================================

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Lock } from '@phosphor-icons/react'
import { usePremiumStatus } from '@/app/components/billing/usePremiumStatus'
import { BRAIN_TEASER } from '@/app/lib/andromeda-brain-teaser.generated'

const SANS = "var(--font-sans), 'Manrope', system-ui, sans-serif"
const MONO = "var(--font-sans), 'Manrope', system-ui, sans-serif" // user call 2026-08-04: all page typography in Manrope

const C = {
  base: '#0E0E0F',
  text: '#F5F5F5',
  body: '#C3C3C4',
  muted: '#9A9A9A',
  faint: '#6E6E6E',
  hair: '#212122',
  rule: '#3E3E3F',
  accent: '#0FCFB2',
  accentDeep: '#109380',
  onAccent: '#0E0E0F',
}

interface TeaserSection {
  id: string
  label: string
  files: readonly string[]
}

const SECTIONS = BRAIN_TEASER.sections as readonly TeaserSection[]
const TOTAL = BRAIN_TEASER.totalFiles
// Sections cover the rule files. The remainder is the entry layer: the index
// the agent opens first, the component inventory, and the conformance tool.
// Computed, never typed by hand, so it self-corrects as the brain grows.
const SECTIONED = SECTIONS.reduce((n, s) => n + s.files.length, 0)
const REMAINDER = TOTAL - SECTIONED

// One line per known section. Unknown ids (the list is growing) render without
// a gloss rather than with a wrong one.
const GLOSS: Record<string, string> = {
  foundations: 'How the system thinks. Color, layout, spacing, motion, states, voice.',
  'component-rules':
    'One file per component, holding the decisions that make it Andromeda instead of generic.',
  skills: 'Working modes for the agent: build with the system, and review work against it.',
}

const CHAPTERS = [
  { id: 'drift', title: 'The drift' },
  { id: 'write-it-down', title: 'Write it down' },
  { id: 'inside', title: 'What is inside' },
  { id: 'a-day', title: 'A day with it' },
  { id: 'get-it', title: 'How to get it' },
]

const SAMPLE_FILE = SECTIONS[0]?.files[0] ?? 'foundations'
// Fixed widths so server and client render the same redaction. No randomness.
const REDACTION = [96, 78, 88, 62, 91, 71, 40]

const DAY: { head: string; body: string; code?: string }[] = [
  {
    head: 'Install it once',
    body: 'The corpus lands in your project as markdown, where your agent already reads. Run the command again any time to pull the latest rules over the old ones.',
    code: 'npx shadcn@latest add @aicanvas/andromeda-brain',
  },
  {
    head: 'Ask for the screen',
    body: 'No design context, no pasted style guide, no list of do and do not. The agent opens the index, reads the foundations the task touches, then the rule file for each component it plans to use.',
    code: 'Build the billing settings page.',
  },
  {
    head: 'Read what comes back',
    body: 'A finished screen that belongs to the system. You review a design decision instead of correcting a spacing scale, and the next request starts from the same rules rather than from your memory of the last correction.',
  },
]

// Four L-brackets, the Andromeda motif, used once on the page.
const MARKERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const

const pad = (i: number) => String(i + 1).padStart(2, '0')

const prose: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: 17,
  lineHeight: 1.75,
  color: C.body,
  margin: '0 0 22px',
  fontWeight: 400,
}

const kicker: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 10,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: C.faint,
}

function Chapter({
  index,
  id,
  title,
  children,
}: {
  index: number
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} style={{ marginTop: 104, scrollMarginTop: 96 }}>
      <header
        style={{
          borderTop: `1px solid ${C.rule}`,
          paddingTop: 16,
          marginBottom: 32,
          display: 'flex',
          alignItems: 'baseline',
          gap: 18,
        }}
      >
        <span style={{ ...kicker, color: C.accent, letterSpacing: '0.14em' }}>{pad(index)}</span>
        <h2
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(26px,4vw,34px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: C.text,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {title}
        </h2>
      </header>
      {children}
    </section>
  )
}

export function BrainEssay() {
  // Tri-state: treat 'unknown' as open so a paying subscriber is never flashed
  // an upgrade pitch while entitlement loads. Same rule as the live page.
  const canOpen = usePremiumStatus() !== 'not-premium'
  const ctaLabel = canOpen ? 'Read the brain' : 'Get the brain with premium'
  const ctaHref = canOpen ? '/design-systems/andromeda/brain/explore' : '/pricing'

  const [active, setActive] = useState(CHAPTERS[0].id)

  useEffect(() => {
    const nodes = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (n): n is HTMLElement => !!n,
    )
    // A narrow band across the middle of the viewport: whichever chapter head
    // crosses it owns the spine.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return (
    <div style={{ background: C.base, minHeight: '100vh', fontFamily: SANS }}>
      <style>{`
        .essay-spine { display: none; }
        @media (min-width: 1180px) {
          .essay-spine { display: block; }
          .essay-spine-inline { display: none; }
        }
        .essay-link { transition: color .15s ease, border-color .15s ease; }
        .essay-cta { transition: background .15s ease; }
        .essay-cta:hover { background: ${C.accentDeep}; }
        .essay-ghost:hover { color: ${C.text}; border-color: ${C.rule}; }
        .essay-toc:hover { color: ${C.text}; }
        @media (max-width: 640px) {
          .essay-masthead-meta { flex-direction: column; align-items: flex-start; gap: 6px; }
          .essay-manifest-head { flex-wrap: wrap; }
        }
      `}</style>

      {/* ── Masthead ─────────────────────────────────────────────────────── */}
      <div style={{ borderBottom: `1px solid ${C.hair}` }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              height: 46,
              borderBottom: `1px solid ${C.hair}`,
            }}
          >
            <Link
              href="/design-systems/andromeda"
              className="essay-link essay-toc"
              style={{ ...kicker, textDecoration: 'none' }}
            >
              Andromeda
            </Link>
            <span style={{ ...kicker }}>The brain</span>
          </div>
        </div>
      </div>

      {/* ── Body: sticky spine + essay column ────────────────────────────── */}
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '0 24px 120px',
          display: 'flex',
          gap: 72,
          justifyContent: 'center',
        }}
      >
        {/* Typographic spine. Desktop only; the inline contents list below the
            lede carries the same information on narrow screens. */}
        <nav
          className="essay-spine"
          aria-label="Contents"
          style={{
            position: 'sticky',
            top: 40,
            alignSelf: 'flex-start',
            width: 148,
            flex: '0 0 148px',
            // margin, not padding: the offset positions it beside the lede but
            // does not travel with the sticky box once it pins.
            marginTop: 200,
          }}
        >
          <div style={{ ...kicker, marginBottom: 14 }}>Contents</div>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {CHAPTERS.map((c, i) => {
              const on = active === c.id
              return (
                <li key={c.id} style={{ marginBottom: 10 }}>
                  <a
                    href={`#${c.id}`}
                    className="essay-link essay-toc"
                    aria-current={on ? 'true' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 10,
                      textDecoration: 'none',
                      fontFamily: MONO,
                      fontSize: 11,
                      letterSpacing: '0.04em',
                      color: on ? C.text : C.faint,
                    }}
                  >
                    <span
                      style={{
                        width: on ? 18 : 8,
                        height: 1,
                        background: on ? C.accent : C.rule,
                        flexShrink: 0,
                        transition: 'width .2s ease, background .2s ease',
                      }}
                    />
                    <span>
                      {pad(i)} {c.title}
                    </span>
                  </a>
                </li>
              )
            })}
          </ol>
        </nav>

        <article style={{ flex: '1 1 680px', maxWidth: 680, minWidth: 0 }}>
          {/* ── Lede ──────────────────────────────────────────────────────── */}
          <div style={{ paddingTop: 88 }}>
            <div style={{ ...kicker, marginBottom: 22 }}>The judgment layer</div>
            <h1
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(38px,7vw,62px)',
                fontWeight: 800,
                letterSpacing: '-0.045em',
                lineHeight: 1.02,
                color: C.text,
                margin: 0,
              }}
            >
              Any AI tool can build you a screen.
              <br />
              <span style={{ color: C.muted }}>Almost none of them build yours.</span>
            </h1>
            <p
              style={{
                ...prose,
                fontSize: 19,
                lineHeight: 1.7,
                color: C.body,
                margin: '32px 0 0',
                maxWidth: 600,
              }}
            >
              Andromeda ships a rulebook your agent reads before it writes a line. {TOTAL} files
              holding the judgment a design system usually leaves in someone&apos;s head. This is
              what is in it, and why it changes the first draft.
            </p>

            {/* Byline row: mono data between two hairlines. */}
            <div
              className="essay-masthead-meta"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
                margin: '44px 0 0',
                padding: '12px 0',
                borderTop: `1px solid ${C.hair}`,
                borderBottom: `1px solid ${C.hair}`,
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: '0.06em',
                color: C.faint,
              }}
            >
              <span>Andromeda design system</span>
              <span>
                <span style={{ color: C.accent }}>{TOTAL}</span> files
              </span>
              <span>About 4 minutes</span>
            </div>

            {/* Inline contents: the narrow-screen carrier for the spine. */}
            <ol
              className="essay-spine-inline"
              style={{
                listStyle: 'none',
                margin: '28px 0 0',
                padding: 0,
                display: 'grid',
                gap: 2,
              }}
            >
              {CHAPTERS.map((c, i) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className="essay-link essay-toc"
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 12,
                      padding: '7px 0',
                      textDecoration: 'none',
                      fontFamily: MONO,
                      fontSize: 12,
                      color: C.muted,
                      borderBottom: `1px solid ${C.hair}`,
                    }}
                  >
                    <span style={{ color: C.faint }}>{pad(i)}</span>
                    <span>{c.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* ── 01 The drift ──────────────────────────────────────────────── */}
          <Chapter index={0} id="drift" title="The drift">
            <p style={prose}>
              Every team building with AI meets the same wall. The output looks fine on its own and
              wrong next to everything else. Spacing is close but not the scale. The accent color
              turns up as decoration where the system uses it as measurement. Motion is added
              because motion is nice, not because something changed.
            </p>
            <p style={prose}>
              So you correct it. Then you correct it again on the next prompt, because the
              correction lived in a chat window and the chat window is gone. Most teams end up
              pasting a paragraph of design context in front of every request, a paragraph that is
              always out of date and never covers the case in front of it.
            </p>

            {/* Pull quote: the one device in this chapter. */}
            <blockquote
              style={{
                margin: '40px 0',
                paddingLeft: 28,
                borderLeft: `1px solid ${C.accent}`,
              }}
            >
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 'clamp(22px,3.4vw,28px)',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.25,
                  color: C.text,
                  margin: 0,
                }}
              >
                The agent is not guessing at random. It is guessing because nobody wrote the answer
                down.
              </p>
            </blockquote>

            <p style={{ ...prose, marginBottom: 0 }}>
              Tokens and components do not close that gap. They are the pieces. The part that
              decides how the pieces go together was never written anywhere an agent could reach.
            </p>
          </Chapter>

          {/* ── 02 Write it down ──────────────────────────────────────────── */}
          <Chapter index={1} id="write-it-down" title="Write it down">
            <p style={prose}>
              A design system usually ships two things and stops. What it almost never ships is the
              judgment that assembles them: when a color carries meaning and when it is only paint,
              which surface owns the frame, what a disabled state owes the reader, how far motion is
              allowed to go before it starts lying about the data.
            </p>
            <p style={prose}>
              The brain is that judgment, written down as plain markdown in the project, at paths an
              agent already looks in. No plugin, no chat history, no context window trick. The rules
              sit beside the code, so any AI tool that can read a file can read them, and the same
              file answers the same question every time.
            </p>

            {/* Locked file card: names are public, the text is not. */}
            <figure style={{ margin: '40px 0 0' }}>
              <div style={{ border: `1px solid ${C.hair}`, background: 'rgba(255,255,255,0.015)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '11px 16px',
                    borderBottom: `1px solid ${C.hair}`,
                    fontFamily: MONO,
                    fontSize: 12,
                    color: C.body,
                  }}
                >
                  <span>{SAMPLE_FILE}</span>
                  <span style={{ ...kicker, fontSize: 9 }}>Markdown</span>
                </div>
                <div
                  style={{
                    padding: '20px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 11,
                    position: 'relative',
                  }}
                  aria-hidden
                >
                  {REDACTION.map((w, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'block',
                        height: 7,
                        width: `${w}%`,
                        background: 'rgba(255,255,255,0.055)',
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    padding: '11px 16px',
                    borderTop: `1px solid ${C.hair}`,
                    fontFamily: MONO,
                    fontSize: 11,
                    color: C.faint,
                  }}
                >
                  <Lock size={12} weight="regular" color={C.accent} />
                  <span>Locked until premium</span>
                </div>
              </div>
              <figcaption
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  lineHeight: 1.7,
                  color: C.faint,
                  marginTop: 12,
                }}
              >
                Every file name is public. The rule text is what you are paying for.
              </figcaption>
            </figure>
          </Chapter>

          {/* ── 03 What is inside ─────────────────────────────────────────── */}
          <Chapter index={2} id="inside" title="What is inside">
            <p style={prose}>
              Here is the whole corpus, section by section, read straight off the current release.
              An agent starts at the index, which tells it what exists and where. From there it
              opens only what the task needs: the foundations that apply, then the rule file for
              every component it plans to use.
            </p>

            <div style={{ marginTop: 40, borderTop: `1px solid ${C.rule}` }}>
              {SECTIONS.map((s, i) => (
                <div key={s.id} style={{ padding: '26px 0', borderBottom: `1px solid ${C.hair}` }}>
                  <div
                    className="essay-manifest-head"
                    style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}
                  >
                    <span style={{ ...kicker, fontSize: 11, letterSpacing: '0.14em' }}>
                      {pad(i)}
                    </span>
                    <h3
                      style={{
                        fontFamily: SANS,
                        fontSize: 19,
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: C.text,
                        margin: 0,
                        flex: 1,
                      }}
                    >
                      {s.label}
                    </h3>
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: 13,
                        color: C.accent,
                        fontWeight: 700,
                      }}
                    >
                      {s.files.length}
                    </span>
                  </div>
                  {GLOSS[s.id] && (
                    <p
                      style={{
                        ...prose,
                        fontSize: 15,
                        color: C.muted,
                        margin: '10px 0 0',
                        paddingLeft: 36,
                      }}
                    >
                      {GLOSS[s.id]}
                    </p>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px 14px',
                      marginTop: 16,
                      paddingLeft: 36,
                      fontFamily: MONO,
                      fontSize: 11,
                      lineHeight: 1.6,
                      color: C.faint,
                    }}
                  >
                    {s.files.map((f) => (
                      <span key={f}>{f}</span>
                    ))}
                  </div>
                </div>
              ))}

              {REMAINDER > 0 && (
                <div style={{ padding: '26px 0', borderBottom: `1px solid ${C.hair}` }}>
                  <div
                    className="essay-manifest-head"
                    style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}
                  >
                    <span style={{ ...kicker, fontSize: 11, letterSpacing: '0.14em' }}>
                      {pad(SECTIONS.length)}
                    </span>
                    <h3
                      style={{
                        fontFamily: SANS,
                        fontSize: 19,
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: C.text,
                        margin: 0,
                        flex: 1,
                      }}
                    >
                      Index and tooling
                    </h3>
                    <span
                      style={{ fontFamily: MONO, fontSize: 13, color: C.accent, fontWeight: 700 }}
                    >
                      {REMAINDER}
                    </span>
                  </div>
                  <p
                    style={{
                      ...prose,
                      fontSize: 15,
                      color: C.muted,
                      margin: '10px 0 0',
                      paddingLeft: 36,
                    }}
                  >
                    The entry point the agent opens first, the inventory of what already exists so
                    it stops reinventing components, and a conformance tool it can run against its
                    own output.
                  </p>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  padding: '20px 0 0',
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.muted,
                }}
              >
                <span>Total</span>
                <span>
                  <span style={{ color: C.accent, fontWeight: 700, fontSize: 15 }}>{TOTAL}</span>{' '}
                  files
                </span>
              </div>
            </div>

            <p
              style={{
                fontFamily: MONO,
                fontSize: 11,
                lineHeight: 1.7,
                color: C.faint,
                margin: '16px 0 0',
              }}
            >
              Counts on this page are read from the release, not typed by hand.
            </p>
          </Chapter>

          {/* ── 04 A day with it ──────────────────────────────────────────── */}
          <Chapter index={3} id="a-day" title="A day with it">
            <p style={prose}>
              Nothing about the workflow changes except the length of the prompt and the quality of
              the first answer.
            </p>

            <ol style={{ listStyle: 'none', margin: '40px 0 0', padding: 0 }}>
              {DAY.map((step, i) => (
                <li
                  key={step.head}
                  style={{
                    display: 'flex',
                    gap: 24,
                    paddingBottom: 32,
                    marginBottom: 32,
                    borderBottom: i === DAY.length - 1 ? 'none' : `1px solid ${C.hair}`,
                  }}
                >
                  <span
                    style={{
                      ...kicker,
                      fontSize: 11,
                      letterSpacing: '0.14em',
                      color: C.accent,
                      paddingTop: 5,
                      flexShrink: 0,
                    }}
                  >
                    {pad(i)}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{
                        fontFamily: SANS,
                        fontSize: 19,
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: C.text,
                        margin: 0,
                      }}
                    >
                      {step.head}
                    </h3>
                    <p style={{ ...prose, fontSize: 16, margin: '10px 0 0' }}>{step.body}</p>
                    {step.code && (
                      <div
                        style={{
                          marginTop: 16,
                          padding: '12px 14px',
                          border: `1px solid ${C.hair}`,
                          background: 'rgba(255,255,255,0.015)',
                          fontFamily: MONO,
                          fontSize: 12,
                          lineHeight: 1.6,
                          color: C.body,
                          overflowX: 'auto',
                          whiteSpace: 'pre',
                        }}
                      >
                        {step.code}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <p style={{ ...prose, marginBottom: 0 }}>
              The prompt got shorter and the output got closer. That is the entire trade.
            </p>
          </Chapter>

          {/* ── 05 How to get it ──────────────────────────────────────────── */}
          <Chapter index={4} id="get-it" title="How to get it">
            <p style={prose}>
              Andromeda components and tokens are yours to use. The brain is the premium layer:
              one install puts all {TOTAL} files in your project, and the web reader keeps every
              rule a click away while you work.
            </p>

            {/* The one framed panel on the page. Corner markers earn their place
                here because this is the only thing being asked for. */}
            <div
              style={{
                position: 'relative',
                marginTop: 40,
                padding: '40px 32px',
                border: `1px solid ${C.hair}`,
                background: 'rgba(255,255,255,0.015)',
              }}
            >
              {MARKERS.map((k) => {
                const [v, h] = k.split('-')
                return (
                  <span
                    key={k}
                    aria-hidden
                    style={
                      {
                        position: 'absolute',
                        width: 10,
                        height: 10,
                        [v]: 10,
                        [h]: 10,
                        borderStyle: 'solid',
                        borderColor: C.rule,
                        borderWidth: 0,
                        [v === 'top' ? 'borderTopWidth' : 'borderBottomWidth']: 1,
                        [h === 'left' ? 'borderLeftWidth' : 'borderRightWidth']: 1,
                      } as React.CSSProperties
                    }
                  />
                )
              })}

              <div style={{ ...kicker, marginBottom: 16 }}>Premium</div>
              <p
                style={{
                  fontFamily: SANS,
                  fontSize: 'clamp(22px,3.4vw,28px)',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.2,
                  color: C.text,
                  margin: 0,
                  maxWidth: 460,
                }}
              >
                Stop re-explaining your design system to every prompt.
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 20,
                  marginTop: 28,
                }}
              >
                <Link
                  href={ctaHref}
                  className="essay-cta"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 9,
                    padding: '13px 22px',
                    background: C.accent,
                    color: C.onAccent,
                    fontFamily: MONO,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textDecoration: 'none',
                  }}
                >
                  {ctaLabel}
                  <ArrowRight size={14} weight="regular" />
                </Link>
                <Link
                  href="/design-systems/andromeda"
                  className="essay-link essay-ghost"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '13px 20px',
                    border: `1px solid ${C.hair}`,
                    color: C.muted,
                    fontFamily: MONO,
                    fontSize: 12,
                    letterSpacing: '0.06em',
                    textDecoration: 'none',
                  }}
                >
                  Explore Andromeda
                </Link>
              </div>
            </div>
          </Chapter>

          {/* ── Colophon ──────────────────────────────────────────────────── */}
          <div
            style={{
              marginTop: 96,
              paddingTop: 18,
              borderTop: `1px solid ${C.hair}`,
              fontFamily: MONO,
              fontSize: 11,
              lineHeight: 1.8,
              color: C.faint,
              maxWidth: 520,
            }}
          >
            Andromeda is a design system built for interfaces that agents write. The brain is its
            judgment layer, and it works with any AI tool that can read a file.
          </div>
        </article>
      </div>
    </div>
  )
}
