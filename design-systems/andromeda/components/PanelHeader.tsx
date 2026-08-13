// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: PanelHeader
// Title row that sits at the top of a panel — sentence-case mono
// title on the left, optional `actions` slot on the right (typically
// PanelMenu / IconButton). Bottom border uses the inset divider
// pattern: `border.subtle` line inset by spacing[3] from each edge.
//
//   <PanelHeader title="Capacity" actions={<PanelMenu items={…} />} />
//
// Distinct from CardHeader (uppercase widest mono, smaller padding,
// inset divider). PanelHeader is for top-level panels in dashboards;
// CardHeader is for nested compositions inside Card.
// ============================================================

'use client';

import { forwardRef } from 'react';
import { tokens } from '../tokens';
import { cn } from './lib/utils';
import { mq } from './lib/responsive';

// Size ramp. PanelHeader is a block header, not an inline control, so it does
// NOT pin to the 28/34/40 control ladder: a panel title sets the panel's weight
// in the page, and a fixed row height would cap the type. It steps the type
// scale instead (lg 16 / xl 18 / 2xl 20, one rung either side of today's xl)
// with the padding moving one spacing step alongside, which keeps the
// text-to-edge ratio roughly constant across rungs. padXNarrow is the existing
// below-md step-down, carried to every rung as the same one-notch cut.
// md reproduces the pre-size-prop values exactly, so no existing panel moves.
// The inline paddings stay var-with-fallback (a theme retuning --andromeda-4/5
// still moves the header); padXNarrow is a raw token because it is interpolated
// into the <style> block, the same split the file used before the prop existed.
const SIZES = {
  sm: { text: 'var(--andromeda-text-lg, 16px)',  padY: 'var(--andromeda-3, 12px)', padX: 'var(--andromeda-4, 16px)', padXNarrow: tokens.spacing[3] },
  md: { text: 'var(--andromeda-text-xl, 18px)',  padY: 'var(--andromeda-4, 16px)', padX: 'var(--andromeda-5, 20px)', padXNarrow: tokens.spacing[4] },
  lg: { text: 'var(--andromeda-text-2xl, 20px)', padY: 'var(--andromeda-5, 20px)', padX: 'var(--andromeda-6, 24px)', padXNarrow: tokens.spacing[5] },
};

/**
 * @typedef {object} PanelHeaderProps
 * @property {React.ReactNode} title             Sentence-case mono title.
 * @property {React.ReactNode} [actions]         Right-aligned slot (PanelMenu, IconButton, Button, etc.).
 * @property {'sm'|'md'|'lg'}  [size='md']       Header weight: title type + padding.
 *   The actions child keeps its OWN size prop (the header never forces it), so
 *   pair them by name: sm header + `size="sm"` control (28px), md + `md` (34px),
 *   lg + `lg` (40px). A mismatched pair is legal and occasionally right (a dense
 *   sm kebab on an md header), just make it deliberate.
 * @property {string}          [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<PanelHeaderProps & React.HTMLAttributes<HTMLDivElement>>} */
export const PanelHeader = forwardRef(function PanelHeader(
  { title, actions, size = 'md', className, style, ...props },
  ref,
) {
  // Resolve the rung once: the same key feeds the styles, data-size, and the
  // <style> selector, so an unknown value cannot land in the CSS selector.
  const rung = SIZES[size] ? size : 'md';
  const s = SIZES[rung];
  return (
    <div
      ref={ref}
      data-slot="panel-header"
      data-size={rung}
      className={cn('am-panel-header', className)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        // Title + actions stay on ONE row at every width, actions pushed right
        // by the spacer. The title truncates (min-width:0 + ellipsis below) so a
        // long title shortens rather than wrapping the actions down to their own
        // line — panel titles are short by design and a wrapped kebab reads as
        // broken (its menu then opens off the left edge). See <style> for the
        // phone padding step-down.
        gap: 'var(--andromeda-3, 12px)',
        padding: `${s.padY} ${s.padX}`,
        ...style,
      }}
      {...props}
    >
      <span
        className="am-panel-header-title"
        style={{
          // min-width:0 lets the title shrink and the spacer keep working;
          // a long title truncates rather than blowing the row out.
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: tokens.typography.fontSans,
          fontSize: s.text,
          fontWeight: tokens.typography.weight.semibold,
          color: 'var(--andromeda-text-primary, #F5F5F5)',
          letterSpacing: 'var(--andromeda-tracking-tight, 0)',
        }}
      >
        {title}
      </span>
      {actions ? (
        <>
          <div className="am-panel-header-spacer" style={{ flex: 1 }} />
          <div className="am-panel-header-actions" style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            {actions}
          </div>
        </>
      ) : null}
      {/* Inset divider — 12px from each edge, matches CardHeader convention. */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: tokens.spacing[3],
          right: tokens.spacing[3],
          bottom: 0,
          height: 'var(--andromeda-border-width, 1px)',
          background: tokens.color.border.subtle,
          pointerEvents: 'none',
        }}
      />
      <style>{`
        ${mq.md} {
          /* Phones keep the single row (title left, actions right) — only the
             horizontal padding steps down a notch for density. The title
             truncates via its base ellipsis style, so the actions slot never
             gets pushed onto its own line. Wrapping the row (the previous
             behaviour) dropped the kebab to the left edge and opened its menu
             off-screen, which read as broken. The inset divider still sits
             spacing[3] from each edge. Scoped to this instance's rung: every
             PanelHeader emits this block globally, so an unscoped selector
             would push one size's step-down onto every other size on the page. */
          .am-panel-header[data-size="${rung}"] {
            padding-left: ${s.padXNarrow} !important;
            padding-right: ${s.padXNarrow} !important;
          }
        }
      `}</style>
    </div>
  );
});
