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
import { MagnifyingGlass, CaretUp } from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { Checkbox } from '../../components/Checkbox';
import { requestRows, filterTabs } from './data';

// ── Filter tab pill ───────────────────────────────────────────────
function FilterTab({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: tokens.spacing[2],
        padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
        background: active ? tokens.color.surface.active : 'transparent',
        border: `${tokens.border.thin} ${active ? tokens.color.border.bright : 'transparent'}`,
        cursor: 'pointer',
        fontFamily: tokens.typography.fontMono,
        fontSize: tokens.typography.size.sm,
        color: active ? tokens.color.text.primary : tokens.color.text.muted,
        textTransform: 'uppercase',
        letterSpacing: tokens.typography.tracking.wider,
      }}
    >
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
        borderBottom: `${tokens.border.thin} ${tokens.color.border.subtle}`,
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

  const filteredKeys = filtered.map((r, i) => `${r.team}-${i}`);
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
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[1],
          padding: `${tokens.spacing[3]} ${tokens.spacing[3]}`,
          borderBottom: `${tokens.border.thin} ${tokens.color.border.subtle}`,
          minWidth: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[1], flex: 1, minWidth: 0, overflowX: 'auto' }}>
          {filterTabs.map((t) => (
            <FilterTab
              key={t.id}
              label={t.label}
              count={t.count}
              active={activeFilter === t.id}
              onClick={() => setActiveFilter(t.id)}
            />
          ))}
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
            <tr>
              <th
                style={{
                  width: tokens.spacing[8],
                  verticalAlign: 'top',
                  padding: `${tokens.spacing[3]} 0 ${tokens.spacing[3]} ${tokens.spacing[3]}`,
                  borderBottom: `${tokens.border.thin} ${tokens.color.border.subtle}`,
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
          <tbody>
            {filtered.map((r, idx) => {
              const key = `${r.team}-${idx}`;
              const isSelected = selected.has(key);
              return (
                <tr
                  key={key}
                  style={{
                    borderBottom: `${tokens.border.thin} ${tokens.color.border.subtle}`,
                    transition: 'background 100ms ease',
                  }}
                  className="rp-row"
                >
                  <td style={{ padding: `${tokens.spacing[3]} 0 ${tokens.spacing[3]} ${tokens.spacing[3]}`, verticalAlign: 'top' }}>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
