// @ts-nocheck — renders JSX design-system components whose forwardRef wrappers
// carry no TypeScript prop types. The coverage test is the enforcement.
//
// ONE renderer, every surface. A declaration (MatrixSpec) goes in, DOM comes
// out; no consuming page carries component content of its own, which is what
// makes a repeat of today's showcase-vs-component-page drift structurally
// impossible rather than merely discouraged.
'use client'

import { Fragment } from 'react'
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
  return (size: string | undefined, props: Record<string, unknown>, c?: MatrixCase) => {
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
      {render(size, c.props ?? {}, c)}
    </span>
  )
}

// Cases down the rows, sizes across the columns. `sizes: null` renders a single
// column — that is how the states grid always renders, because hover at sm and
// hover at lg are the same border colour and tripling the states would spend
// half the page's height on zero information.
export function CaseGrid({
  spec,
  kind,
  cases,
  sizes,
  render,
}: {
  spec: MatrixSpec
  kind: 'variant' | 'state'
  cases: readonly MatrixCase[]
  sizes: readonly string[] | null
  render: ReturnType<typeof defaultRender>
}) {
  const cols = sizes ?? [undefined]
  const track = spec.wide ? 'minmax(0, 1fr)' : 'max-content'
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `max-content repeat(${cols.length}, ${track})`,
        gap: `${tokens.spacing[4]} ${tokens.spacing[6]}`,
        alignItems: 'center',
        justifyContent: 'start',
        // The matrix is the widest thing in a narrow card, so it scrolls inside
        // its own box rather than forcing the page to scroll.
        overflowX: 'auto',
      }}
    >
      <span />
      {cols.map((s, i) => (
        <span key={i} style={head}>
          {s ?? 'md'}
        </span>
      ))}
      {cases.map((c) => (
        <Fragment key={c.label}>
          {/* The deep-link anchor sits once per case row, on its label, not on
              every cell across the size axis. scroll-mt-14 clears the sticky
              topbar inside the scroll column. */}
          <span id={matrixId(spec.slug, kind, c.label)} className="scroll-mt-14" style={head}>
            {c.label}
          </span>
          {cols.map((s, i) => (
            <MatrixCell key={i} spec={spec} kind={kind} c={c} size={s ?? 'md'} render={render} />
          ))}
        </Fragment>
      ))}
    </div>
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
          /// NOT SHOWABLE AT REST — {label}: {reason}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[6] }}>
      {spec.variants.length > 0 ? (
        <CaseGrid spec={spec} kind="variant" cases={spec.variants} sizes={spec.sizes} render={render} />
      ) : null}
      {spec.states.length > 0 ? (
        <CaseGrid spec={spec} kind="state" cases={[REST, ...spec.states]} sizes={null} render={render} />
      ) : null}
      {spec.gaps ? <GapList gaps={spec.gaps} /> : null}
    </div>
  )
}
