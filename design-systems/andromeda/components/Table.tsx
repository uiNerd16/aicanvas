// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Table
// Compound primitive for dense data tables:
//   Table / TableHead / TableBody / TableRow / TableHeader / TableCell
//
// Features:
//   - Consistent mono typography, verticalAlign:top, 1px subtle dividers
//   - TableHeader accepts sort="asc|desc|sortable" → renders the correct caret
//   - TableRow accepts selected (accent-300 left edge + surface.active bg)
//     and hover state via the included <TableStyles /> helper
// ============================================================

'use client';

import { forwardRef, useEffect } from 'react';
import { CaretUp, CaretDown, CaretUpDown } from '@phosphor-icons/react';
import { tokens } from '../tokens';
import { andromedaVars } from './lib/utils';

// ── Global hover stylesheet ────────────────────────────────────────
// Inject once per page. Class-based rules beat inline styles so the
// hover lift fires correctly even when rows carry an inline background.
const TABLE_STYLE_ID = 'andromeda-table-styles';
const TABLE_STYLES = `
      .andro-tr         { transition: background-color 100ms ease; cursor: default; }
      .andro-tr-hover   { cursor: pointer; }
      .andro-tr-hover:hover { background-color: ${tokens.color.surface.hover} !important; }
    `;

export function TableStyles() {
  // Dedupe guard — multiple <Table> instances on a page would otherwise
  // each inject this stylesheet. Mirror the keyframe-injection guard used
  // in Spinner/StatTile: check for the id before appending so the rules
  // land exactly once per document.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(TABLE_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = TABLE_STYLE_ID;
    style.textContent = TABLE_STYLES;
    document.head.appendChild(style);
  }, []);
  return null;
}

// Linear-gradient bottom line that insets 12px from each side.
// Used as a TR background-image so it survives border-collapse:collapse
// (real TR borders don't render under collapse).
const ROW_INSET_LINE = `linear-gradient(to right, transparent ${tokens.spacing[3]}, ${tokens.color.border.subtle} ${tokens.spacing[3]}, ${tokens.color.border.subtle} calc(100% - ${tokens.spacing[3]}), transparent calc(100% - ${tokens.spacing[3]}))`;

// ── Table ──────────────────────────────────────────────────────────
export const Table = forwardRef(function Table(
  { className, style, children, ...props },
  ref,
) {
  return (
    <div
      style={{ width: '100%', overflow: 'auto', ...andromedaVars() }}
    >
      <table
        ref={ref}
        className={className}
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'auto',
          fontFamily: tokens.typography.fontMono,
          ...style,
        }}
        {...props}
      >
        {children}
      </table>
    </div>
  );
});

// ── TableHead / TableBody ──────────────────────────────────────────
export const TableHead = forwardRef(function TableHead({ children, ...props }, ref) {
  return <thead ref={ref} {...props}>{children}</thead>;
});

export const TableBody = forwardRef(function TableBody({ children, ...props }, ref) {
  return <tbody ref={ref} {...props}>{children}</tbody>;
});

// ── TableRow ───────────────────────────────────────────────────────
/**
 * @typedef {object} TableRowProps
 * @property {boolean} [selected]  Applies surface.active bg + accent-300 left edge.
 * @property {boolean} [hoverable] Adds the hover-lift class (default true).
 */
export const TableRow = forwardRef(function TableRow(
  { selected = false, hoverable = true, className = '', style, children, ...props },
  ref,
) {
  return (
    <tr
      ref={ref}
      className={`andro-tr${hoverable ? ' andro-tr-hover' : ''}${className ? ` ${className}` : ''}`}
      style={{
        backgroundColor: selected ? tokens.color.surface.active : 'transparent',
        backgroundImage: ROW_INSET_LINE,
        backgroundSize: '100% 1px',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat',
        boxShadow: selected ? `inset 2px 0 0 0 ${tokens.color.accent[300]}` : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </tr>
  );
});

// ── TableHeader (sortable <th>) ────────────────────────────────────
/**
 * @typedef {object} TableHeaderProps
 * @property {'asc'|'desc'|'sortable'|undefined} [sort]
 * @property {'left'|'right'|'center'} [align='left']
 */
export const TableHeader = forwardRef(function TableHeader(
  { sort, align = 'left', children, style, ...props },
  ref,
) {
  const sorted = sort === 'asc' || sort === 'desc';
  const sortable = sorted || sort === 'sortable';
  const ariaSort =
    sort === 'asc'      ? 'ascending'  :
    sort === 'desc'     ? 'descending' :
    sort === 'sortable' ? 'none'       :
    undefined;
  const sortIcon =
    sort === 'asc'      ? <CaretUp     weight="bold"    size={10} /> :
    sort === 'desc'     ? <CaretDown   weight="bold"    size={10} /> :
    sort === 'sortable' ? <CaretUpDown weight="regular" size={10} /> :
    null;

  return (
    <th
      ref={ref}
      scope="col"
      aria-sort={sortable ? ariaSort : undefined}
      style={{
        textAlign: align,
        verticalAlign: 'top',
        padding: `${tokens.spacing[3]} ${tokens.spacing[3]}`,
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.xs,
        fontWeight: tokens.typography.weight.medium,
        color: sorted ? tokens.color.text.primary : tokens.color.text.muted,
        textTransform: 'uppercase',
        letterSpacing: tokens.typography.tracking.widest,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...props}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: tokens.spacing[1] }}>
        {children}
        {sortIcon ? (
          <span style={{ color: sorted ? tokens.color.text.primary : tokens.color.text.faint, display: 'inline-flex' }}>
            {sortIcon}
          </span>
        ) : null}
      </span>
    </th>
  );
});

// ── TableCell ──────────────────────────────────────────────────────
/**
 * @typedef {object} TableCellProps
 * @property {'left'|'right'|'center'} [align='left']
 * @property {boolean} [muted=false]  Uses text.secondary instead of text.primary.
 * @property {boolean} [nowrap=true]
 */
export const TableCell = forwardRef(function TableCell(
  { align = 'left', muted = false, nowrap = true, children, style, ...props },
  ref,
) {
  return (
    <td
      ref={ref}
      style={{
        textAlign: align,
        verticalAlign: 'top',
        padding: `${tokens.spacing[3]} ${tokens.spacing[3]}`,
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.sm,
        color: muted ? tokens.color.text.secondary : tokens.color.text.primary,
        letterSpacing: tokens.typography.tracking.wide,
        whiteSpace: nowrap ? 'nowrap' : 'normal',
        lineHeight: 1,
        ...style,
      }}
      {...props}
    >
      {children}
    </td>
  );
});
