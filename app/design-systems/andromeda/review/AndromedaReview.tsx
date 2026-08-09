// @ts-nocheck — renders JSX design-system components whose forwardRef wrappers
// carry no TypeScript prop types.
//
// THE review surface: all 40 Andromeda components on one page, every declared
// variant and state, hover / focus / pressed painted at rest beside their own
// baseline. Components without a declaration yet fall back to the legacy
// per-component-page demo, so a missing component is structurally impossible —
// only a not-yet-migrated one is visible as such.
//
// This route is a MIGRATION SCAFFOLD. It collapses onto
// /design-systems/andromeda/system in phase 5 and is deleted; the gate
// attribute is therefore data-andromeda-matrix, a name that still reads right
// on the public system page.
'use client'

import Link from 'next/link'
import { JetBrains_Mono } from 'next/font/google'
import { tokens } from '../../../../design-systems/andromeda/tokens'
import { andromedaVars } from '../../../../design-systems/andromeda/components/lib/utils'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../../design-systems/andromeda/components/Card'
import { ANDROMEDA_COMPONENT_META } from '../../../_lib/andromeda/andromeda-meta'
import { AndromedaDemo } from '../../../_lib/andromeda/andromeda-demos'
import { MatrixBlock } from '../../../_lib/andromeda/matrix/Matrix'
import { SPEC_BY_SLUG } from '../../../_lib/andromeda/matrix'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const mono = {
  fontFamily: tokens.typography.fontMono,
  letterSpacing: tokens.typography.tracking.wider,
}

function StatusBadge({ declared }: { declared: boolean }) {
  return (
    <span
      style={{
        ...mono,
        fontSize: tokens.typography.size.sm,
        textTransform: 'uppercase',
        color: declared ? tokens.color.accent[300] : tokens.color.text.faint,
        whiteSpace: 'nowrap',
      }}
    >
      {declared ? 'DECLARED' : 'LEGACY DEMO'}
    </span>
  )
}

export default function AndromedaReview() {
  const declaredCount = ANDROMEDA_COMPONENT_META.filter((m) => SPEC_BY_SLUG[m.slug]).length
  const total = ANDROMEDA_COMPONENT_META.length

  return (
    <div
      data-andromeda-matrix
      className={jetbrainsMono.variable}
      style={{
        ...andromedaVars(),
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: tokens.color.surface.base,
        paddingTop: tokens.spacing[8],
        paddingLeft: tokens.spacing[8],
        paddingRight: tokens.spacing[8],
        paddingBottom: tokens.spacing[10],
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
          gap: tokens.spacing[8],
        }}
      >
        {/* The scroller is the AndromedaContentColumn, not the window, and the
            IdeationTopBar is sticky at top-0 h-14 inside it — so the rail pins
            at top-14 and every anchor target carries scroll-mt-14. */}
        <nav
          className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
          style={{
            flex: '0 0 auto',
            width: '180px',
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacing[1],
            paddingBottom: tokens.spacing[8],
          }}
        >
          <span
            style={{
              ...mono,
              fontSize: tokens.typography.size.sm,
              textTransform: 'uppercase',
              color: tokens.color.text.muted,
              marginBottom: tokens.spacing[2],
            }}
          >
            {declaredCount}/{total} declared
          </span>
          {/* Driven by the component catalog, never by the spec array: the rail
              has to list what EXISTS, not what has been migrated. */}
          {ANDROMEDA_COMPONENT_META.map((m) => (
            <a
              key={m.slug}
              href={`#c-${m.slug}`}
              style={{
                ...mono,
                fontSize: tokens.typography.size.sm,
                textDecoration: 'none',
                color: SPEC_BY_SLUG[m.slug] ? tokens.color.text.primary : tokens.color.text.faint,
              }}
            >
              {m.name}
            </a>
          ))}
        </nav>

        <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: tokens.spacing[6] }}>
          <header style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
            <span style={{ ...mono, fontSize: tokens.typography.size.sm, textTransform: 'uppercase', color: tokens.color.text.muted }}>
              {'/// '}Andromeda review
            </span>
            <h1 style={{ ...mono, margin: 0, fontSize: tokens.typography.size['2xl'], color: tokens.color.text.primary, letterSpacing: tokens.typography.tracking.wide }}>
              Every component, every state
            </h1>
            <p
              style={{
                ...mono,
                margin: 0,
                fontSize: tokens.typography.size.md,
                color: tokens.color.text.secondary,
                letterSpacing: tokens.typography.tracking.normal,
                lineHeight: tokens.typography.lineHeight.relaxed,
                maxWidth: '68ch',
              }}
            >
              Declared components render their full variant grid plus a states row where every
              forced state sits beside its own Rest baseline. Undeclared ones fall back to the
              legacy demo from their component page. States that cannot be painted at rest are
              listed with the mechanism that prevents it, never faked. The page is live, so
              anything listed as a gap can still be hovered by hand.
            </p>
          </header>

          {ANDROMEDA_COMPONENT_META.map((m) => {
            const spec = SPEC_BY_SLUG[m.slug]
            return (
              <Card
                key={m.slug}
                id={`c-${m.slug}`}
                className="scroll-mt-14"
                // Perf on a page this tall: skip offscreen sections. Skipped for
                // specs that open an INLINE popover, because content-visibility
                // implies contain:paint and would clip it.
                style={
                  spec?.overflow
                    ? undefined
                    : { contentVisibility: 'auto', containIntrinsicSize: 'auto 600px' }
                }
              >
                <CardHeader className="px-[var(--andromeda-6)] py-[var(--andromeda-6)]">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
                    <span style={{ ...mono, fontSize: tokens.typography.size.sm, textTransform: 'uppercase', color: tokens.color.text.muted }}>
                      {'/// '}{m.slug}
                    </span>
                    <CardTitle>{m.name}</CardTitle>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[4] }}>
                    <StatusBadge declared={Boolean(spec)} />
                    <Link
                      href={`/design-systems/andromeda/${m.slug}`}
                      style={{ ...mono, fontSize: tokens.typography.size.sm, textTransform: 'uppercase', color: tokens.color.text.secondary, textDecoration: 'none' }}
                    >
                      Open
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-[var(--andromeda-6)]">
                  {spec ? <MatrixBlock spec={spec} /> : <AndromedaDemo slug={m.slug} />}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
