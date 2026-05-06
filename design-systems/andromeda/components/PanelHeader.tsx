// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: PanelHeader
// Title row that sits at the top of a panel — sentence-case mono
// title on the left, optional `actions` slot on the right (typically
// PanelMenu / IconButton). Bottom border uses the inset divider
// pattern: `border.subtle` line that spans the full width.
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

/**
 * @typedef {object} PanelHeaderProps
 * @property {React.ReactNode} title             Sentence-case mono title.
 * @property {React.ReactNode} [actions]         Right-aligned slot (PanelMenu, IconButton, Button, etc.).
 * @property {string}          [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<PanelHeaderProps & React.HTMLAttributes<HTMLDivElement>>} */
export const PanelHeader = forwardRef(function PanelHeader(
  { title, actions, className, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="panel-header"
      className={className}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: `${tokens.spacing[4]} ${tokens.spacing[5]}`,
        ...style,
      }}
      {...props}
    >
      <span
        style={{
          fontFamily: tokens.typography.fontSans,
          fontSize: tokens.typography.size.xl,
          fontWeight: tokens.typography.weight.semibold,
          color: tokens.color.text.primary,
          letterSpacing: tokens.typography.tracking.tight,
        }}
      >
        {title}
      </span>
      {actions ? (
        <>
          <div style={{ flex: 1 }} />
          {actions}
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
          height: '1px',
          background: tokens.color.border.subtle,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
});