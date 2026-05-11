// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// RESOURCE PLANNING · RequestsTable
// Filter tabs, search field, and the request log itself. Rows
// are neutral — selection is the only row-level state, conveyed
// by the leading checkbox; the active filter tab carries the
// "kind of request" context above the table.
// ============================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { MagnifyingGlass, CaretUp } from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { Checkbox } from '../../components/Checkbox';
import { rowContainer, rowItem } from '../../components/lib/motion';
import { requestRows, filterTabs } from './data';

function InsetDivider({ side = 'bottom' }) {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        left: tokens.spacing[3],
        right: tokens.spacing[3],
        [side]: 0,
        height: '1px',
        background: tokens.color.border.subtle,
        pointerEvents: 'none',
      }}
    />
  );
}

const ROW_INSET_LINE = `linear-gradient(to right, transparent ${tokens.spacing[3]}, ${tokens.color.border.subtle} ${tokens.spacing[3]}, ${tokens.color.border.subtle} calc(100% - ${tokens.spacing[3]}), transparent calc(100% - ${tokens.spacing[3]}))`;
const rowSeparatorStyle = {
  backgroundImage: ROW_INSET_LINE,
  backgroundSize: '100% 1px',
  backgroundPosition: 'bottom',
  backgroundRepeat: 'no-repeat',
};

// ── Filter tab pill ───────────────────────────────────────────────
// The active fill (surface.active + border.bright) lives in a sibling
// motion.span with a shared `layoutId`. Framer animates it between
// tabs as `active` flips — the wrapping <LayoutGroup> in the parent
// scopes the layoutId so two filter strips don't fight each other.
const ms = (v) => parseInt(v, 10) / 1000;
const FILTER_TX = {
  duration: ms(tokens.motion.duration.slow),
  ease: [0.4, 0, 0.2, 1],
};

function FilterTab({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: tokens.spacing[2],
        padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
        background: 'transparent',
        border: `${tokens.border.thin} transparent`,
        cursor: 'pointer',
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.sm,
        color: active ? tokens.color.text.primary : tokens.color.text.muted,
        textTransform: 'uppercase',
        letterSpacing: tokens.typography.tracking.wider,
        transition: `color ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`,
      }}
    >
      {active ? (
        <motion.span
          layoutId="rp-filter-indicator"
          aria-hidden="true"
          transition={FILTER_TX}
          style={{
            position: 'absolute',
            inset: 0,
            background: tokens.color.surface.active,
            border: `${tokens.border.thin} ${tokens.color.border.bright}`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      ) : null}
      <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: tokens.spacing[2] }}>
        {label}
        <span
          style={{
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.faint,
            letterSpacing: tokens.typography.tracking.wide,
          }}
        >
          {count}
        </span>
      </span>
    </button>
  );
}

// ── Sortable column header ───────────────────────────────────────
// verticalAlign:'top' so the header label's top edge aligns with the
// checkbox column's top edge (which also uses 'top'); padding-top
// matches the row cells so the rhythm reads as a single grid.
function ColHeader({ children, sorted, align = 'left' }) {
  return (
    <th
      style={{
        textAlign: align,
        verticalAlign: 'top',
        padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.xs,
        fontWeight: tokens.typography.weight.medium,
        color: sorted ? tokens.color.text.primary : tokens.color.text.muted,
        textTransform: 'uppercase',
        letterSpacing: tokens.typography.tracking.widest,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: tokens.spacing[1], lineHeight: 1, height: '16px' }}>
        {children}
        {sorted ? <CaretUp weight="bold" size={10} /> : null}
      </span>
    </th>
  );
}

// ── Composition ──────────────────────────────────────────────────
export function RequestsTable() {
  const [activeFilter, setActiveFilter] = useState('pending');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(() => new Set());

  const filtered = requestRows.filter((r) => {
    if (activeFilter !== 'all' && activeFilter !== 'recent' && r.status !== activeFilter) return false;
    if (query && !r.team.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  // Use the team name as the row identity — it's unique across requestRows
  // and stable across filter changes, which is what AnimatePresence needs
  // to track which row entered, which left, and which stayed put.
  const filteredKeys = filtered.map((r) => r.team);
  const allSelected = filteredKeys.length > 0 && filteredKeys.every((k) => selected.has(k));

  function toggleRow(key) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleAll(next) {
    setSelected((prev) => {
      const out = new Set(prev);
      if (next) filteredKeys.forEach((k) => out.add(k));
      else filteredKeys.forEach((k) => out.delete(k));
      return out;
    });
  }

  return (
    <div
      style={{
        position: 'relative',
        background: tokens.color.surface.raised,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      <CornerMarkers />

      {/* Filter row */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[1],
          padding: `${tokens.spacing[3]} ${tokens.spacing[3]}`,
          minWidth: 0,
        }}
      >
        <InsetDivider />
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[1], flex: 1, minWidth: 0, overflowX: 'auto' }}>
          <LayoutGroup id="rp-filter-tabs">
            {filterTabs.map((t) => (
              <FilterTab
                key={t.id}
                label={t.label}
                count={t.count}
                active={activeFilter === t.id}
                onClick={() => setActiveFilter(t.id)}
              />
            ))}
          </LayoutGroup>
        </div>
        <button
          type="button"
          aria-label="Search"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: tokens.spacing[8],
            height: tokens.spacing[8],
            flexShrink: 0,
            background: 'transparent',
            border: `${tokens.border.thin} ${tokens.color.border.base}`,
            cursor: 'pointer',
            color: tokens.color.text.muted,
          }}
        >
          <MagnifyingGlass weight="regular" size={14} />
        </button>
      </div>

      {/* Table — auto layout so columns size to content; cells nowrap so the
          horizontal rhythm is consistent regardless of content length. The
          parent has overflow:auto, so on narrow widths the table scrolls
          horizontally rather than corrupting the layout. */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
          <thead>
            <tr style={rowSeparatorStyle}>
              <th
                style={{
                  width: tokens.spacing[8],
                  verticalAlign: 'top',
                  padding: `${tokens.spacing[3]} 0 ${tokens.spacing[3]} ${tokens.spacing[3]}`,
                  lineHeight: 1,
                }}
              >
                <Checkbox
                  aria-label="Select all"
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                />
              </th>
              <ColHeader>Team</ColHeader>
              <ColHeader sorted>Date</ColHeader>
              <ColHeader align="right">Amount</ColHeader>
            </tr>
          </thead>
          <motion.tbody
            variants={rowContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <AnimatePresence initial={false}>
            {filtered.map((r) => {
              const key = r.team;
              const isSelected = selected.has(key);
              return (
                <motion.tr
                  key={key}
                  variants={rowItem}
                  exit="exit"
                  style={{
                    ...rowSeparatorStyle,
                    transition: 'background 100ms ease',
                  }}
                  className="rp-row"
                >
                  <td style={{ position: 'relative', padding: `${tokens.spacing[3]} 0 ${tokens.spacing[3]} ${tokens.spacing[3]}`, verticalAlign: 'top' }}>
                    {/* Selection edge bar — slides in from left when the row
                        is selected. Anchored to the first TD which provides
                        the relative positioning context. transformOrigin:left
                        + scaleX is what gives the wipe; opacity carries the
                        moment the bar is fully out. */}
                    <AnimatePresence>
                      {isSelected ? (
                        <motion.span
                          aria-hidden
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          exit={{ scaleX: 0, opacity: 0 }}
                          transition={{
                            duration: parseInt(tokens.motion.duration.normal, 10) / 1000,
                            ease: [0, 0, 0.2, 1],
                          }}
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: tokens.spacing[1],
                            bottom: tokens.spacing[1],
                            width: '2px',
                            background: tokens.color.accent[300],
                            transformOrigin: 'left',
                            pointerEvents: 'none',
                          }}
                        />
                      ) : null}
                    </AnimatePresence>
                    <Checkbox
                      aria-label={`Select ${r.team}`}
                      checked={isSelected}
                      onCheckedChange={() => toggleRow(key)}
                    />
                  </td>
                  <td
                    style={{
                      padding: `${tokens.spacing[3]} ${tokens.spacing[3]}`,
                      whiteSpace: 'nowrap',
                      verticalAlign: 'top',
                    }}
                  >
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                      <span
                        style={{
                          fontFamily: tokens.typography.fontMono,
                          fontSize: tokens.typography.size.sm,
                          color: tokens.color.text.primary,
                          letterSpacing: tokens.typography.tracking.wide,
                          lineHeight: 1,
                          height: '16px',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        {r.team}
                      </span>
                      <span
                        style={{
                          fontFamily: tokens.typography.fontMono,
                          fontSize: tokens.typography.size.xs,
                          color: tokens.color.text.muted,
                          letterSpacing: tokens.typography.tracking.wide,
                          lineHeight: 1,
                        }}
                      >
                        {r.owner}
                      </span>
                    </span>
                  </td>
                  <td
                    style={{
                      padding: `${tokens.spacing[3]} ${tokens.spacing[3]}`,
                      fontFamily: tokens.typography.fontMono,
                      fontSize: tokens.typography.size.sm,
                      color: tokens.color.text.secondary,
                      letterSpacing: tokens.typography.tracking.wide,
                      whiteSpace: 'nowrap',
                      verticalAlign: 'top',
                      lineHeight: 1,
                      height: '16px',
                    }}
                  >
                    {r.submitted}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: `${tokens.spacing[3]} ${tokens.spacing[3]} ${tokens.spacing[3]} 0`,
                      fontFamily: tokens.typography.fontMono,
                      fontSize: tokens.typography.size.sm,
                      fontWeight: tokens.typography.weight.medium,
                      color: tokens.color.text.primary,
                      letterSpacing: tokens.typography.tracking.wide,
                      whiteSpace: 'nowrap',
                      verticalAlign: 'top',
                      lineHeight: 1,
                    }}
                  >
                    {r.amount}
                  </td>
                </motion.tr>
              );
            })}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}
