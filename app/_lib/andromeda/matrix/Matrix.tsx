// @ts-nocheck — renders JSX design-system components whose forwardRef wrappers
// carry no TypeScript prop types. The coverage test is the enforcement.
//
// ONE renderer, every surface. A declaration (MatrixSpec) goes in, DOM comes
// out; no consuming page carries component content of its own, which is what
// makes a repeat of today's showcase-vs-component-page drift structurally
// impossible rather than merely discouraged.
'use client'

import { tokens } from '../../../../design-systems/andromeda/tokens'
import { matrixId, REST, type MatrixCase, type MatrixSpec } from './types'

const head = {
  fontFamily: tokens.typography.fontMono,
  fontSize: tokens.typography.size.sm,
  color: tokens.color.text.faint,
  textTransform: 'uppercase' as const,
  letterSpacing: tokens.typography.tracking.widest,
}

function defaultRender(spec: MatrixSpec) {
  // Named, because a bare arrow here reads to the linter as an anonymous
  // component. It is a render callback, not a component.
  return function renderCase(size: string | undefined, props: Record<string, unknown>, c?: MatrixCase) {
    const children = c?.children ?? spec.children
    const C = spec.Component
    return (
      <C
        {...spec.baseProps}
        {...props}
        {...(size ? { size } : {})}
        {...(children !== undefined ? { children } : {})}
      />
    )
  }
}

// The case CANVAS: the box holding the component and nothing else. Every
// machine-readable attribute lives here, never on the card chrome around it —
// data-force is a descendant selector root, so a stamp one box too high lights
// rules that belong to the chrome. (data-force paints nothing itself; it only
// unlocks rules the component already declared.)
function MatrixCell({
  spec,
  kind,
  c,
  size,
  render,
}: {
  spec: MatrixSpec
  kind: 'variant' | 'state'
  c: MatrixCase
  size?: string
  render: ReturnType<typeof defaultRender>
}) {
  return (
    <span
      data-case-slug={spec.slug}
      data-case-kind={kind}
      data-case-label={c.label}
      data-force={c.force && !c.forceSelf ? c.force : undefined}
      style={{ display: spec.wide ? 'block' : 'inline-flex', minWidth: 0 }}
    >
      {c.node ?? render(size, c.props ?? {}, c)}
    </span>
  )
}

// One CARD per case, two across. The old dense grid put every case on one row
// of a size × case table, which reads as a spreadsheet; a labelled card per case
// is what the component pages needed and what the sibling system uses.
//
// The size ladder stays INSIDE a variant card, side by side with its own
// captions, so "how big can it be" is still one glance and does not become
// three more cards.
//
// A STATE card carries its own Rest baseline beside the forced instance. That
// adjacency is the whole reason a forced state is legible: an 8-point border
// shift is invisible without the default sitting next to it, and two cards apart
// in a grid is not next to it.
function CaseCard({
  spec,
  kind,
  c,
  render,
}: {
  spec: MatrixSpec
  kind: 'variant' | 'state'
  c: MatrixCase
  render: ReturnType<typeof defaultRender>
}) {
  const sizes = kind === 'variant' && spec.sizes && !c.node ? spec.sizes : null
  const withBaseline = kind === 'state' && c.label !== REST.label && !c.node

  return (
    <div
      id={matrixId(spec.slug, kind, c.label)}
      className="scroll-mt-14"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: tokens.color.surface.raised,
        border: `1px solid ${tokens.color.border.subtle}`,
        minWidth: 0,
      }}
    >
      <div
        style={{
          padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
          borderBottom: `1px solid ${tokens.color.border.subtle}`,
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.sm,
          color: tokens.color.text.primary,
          fontWeight: tokens.typography.weight.medium,
          letterSpacing: tokens.typography.tracking.wide,
        }}
      >
        {c.label}
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: tokens.spacing[6],
          padding: `${tokens.spacing[6]} ${tokens.spacing[4]}`,
          overflowX: 'auto',
        }}
      >
        {withBaseline ? (
          <>
            <Instance caption="Rest" spec={spec} kind={kind} c={REST} render={render} />
            <Instance caption={c.label} spec={spec} kind={kind} c={c} render={render} />
          </>
        ) : sizes ? (
          sizes.map((s) => (
            <Instance key={s} caption={s} spec={spec} kind={kind} c={c} size={s} render={render} />
          ))
        ) : (
          <MatrixCell spec={spec} kind={kind} c={c} size="md" render={render} />
        )}
      </div>
    </div>
  )
}

// One rendered component plus the caption that says which one it is. The caption
// is what turns two look-alike boxes into a comparison.
function Instance({
  caption,
  spec,
  kind,
  c,
  size,
  render,
}: {
  caption: string
  spec: MatrixSpec
  kind: 'variant' | 'state'
  c: MatrixCase
  size?: string
  render: ReturnType<typeof defaultRender>
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: tokens.spacing[3],
        minWidth: 0,
        flex: spec.wide ? '1 1 100%' : '0 1 auto',
      }}
    >
      <MatrixCell spec={spec} kind={kind} c={c} size={size} render={render} />
      <span style={head}>{caption}</span>
    </div>
  )
}

function CaseSection({
  spec,
  kind,
  cases,
  render,
}: {
  spec: MatrixSpec
  kind: 'variant' | 'state'
  cases: readonly MatrixCase[]
  render: ReturnType<typeof defaultRender>
}) {
  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: tokens.spacing[4],
          marginBottom: tokens.spacing[4],
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.md,
            fontWeight: tokens.typography.weight.medium,
            color: tokens.color.text.primary,
            letterSpacing: tokens.typography.tracking.wide,
          }}
        >
          {kind === 'variant' ? 'Variants' : 'States'}
        </h3>
        <span style={head}>
          {cases.length} {cases.length === 1 ? 'example' : 'examples'}
        </span>
      </div>
      <div
        className={`andromeda-matrix-grid${spec.wide ? ' is-wide' : ''}`}
        style={{ display: 'grid', gap: tokens.spacing[3] }}
      >
        {cases.map((c) => (
          <CaseCard key={c.label} spec={spec} kind={kind} c={c} render={render} />
        ))}
      </div>
    </section>
  )
}

// Gaps are shown, never swallowed: a state that cannot be painted at rest says
// so on the page, with the mechanism that prevents it.
function GapList({ gaps }: { gaps: Record<string, string> }) {
  return (
    <div style={{ marginTop: tokens.spacing[4], display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
      {Object.entries(gaps).map(([label, reason]) => (
        <span
          key={label}
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.sm,
            color: tokens.color.text.muted,
            lineHeight: tokens.typography.lineHeight.relaxed,
          }}
        >
          {'/// '}NOT SHOWABLE AT REST — {label}: {reason}
        </span>
      ))}
    </div>
  )
}

// The preview surface for a single component, gated so its forced states can
// paint. Every consumer goes through this rather than placing the attribute
// itself — a gate on the wrong box is the one mistake this system can make.
export function MatrixPreview({ spec }: { spec: MatrixSpec }) {
  return (
    <div data-andromeda-matrix style={{ width: '100%' }}>
      <MatrixBlock spec={spec} />
    </div>
  )
}

export function MatrixBlock({ spec }: { spec: MatrixSpec }) {
  const render = spec.render ?? defaultRender(spec)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[8], width: '100%' }}>
      {/* Two across on anything but a phone. A `wide` component (tables, charts,
          banners) takes the full row instead — two charts side by side in a
          preview panel are two unreadable charts. */}
      <style>{`
        .andromeda-matrix-grid { grid-template-columns: minmax(0, 1fr); }
        @media (min-width: 768px) {
          .andromeda-matrix-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .andromeda-matrix-grid.is-wide { grid-template-columns: minmax(0, 1fr); }
        }
      `}</style>
      {spec.variants.length > 0 ? (
        <CaseSection spec={spec} kind="variant" cases={spec.variants} render={render} />
      ) : null}
      {spec.states.length > 0 ? (
        <CaseSection spec={spec} kind="state" cases={spec.states} render={render} />
      ) : null}
      {spec.gaps ? <GapList gaps={spec.gaps} /> : null}
    </div>
  )
}
