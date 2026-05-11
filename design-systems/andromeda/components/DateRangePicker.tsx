// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: DateRangePicker
// Trigger chip → expandable calendar panel positioned below.
// Range selection: first click sets the anchor; hovering previews
// the in-between band; second click commits the range and closes.
// ESC and click-outside close the panel. Controlled-only API:
//
//   <DateRangePicker
//     value={{ start: Date, end: Date | null }}
//     onChange={(next) => setRange(next)}
//     presetLabel="Last month"      // optional chip prefix
//     defaultOpen                   // calendar pre-opened (showcases / docs);
//                                   // ESC + click-outside still dismiss
//   />
//
// All visual values come from `tokens.ts` — selection / preview /
// today markers reuse the system accent stops because date selection
// IS a measurement (the rules.md "color is for meaning" exception).
// ============================================================

'use client';

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarBlank, CaretDown, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { tokens } from '../tokens';
import { CornerMarkers } from './CornerMarkers';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG  = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const CELL_PX = 32;
const NAV_PX  = 24;

function startOfDay(d) {
  if (!d) return null;
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth() &&
    a.getDate()     === b.getDate()
  );
}

function compareDays(a, b) {
  if (a.getFullYear() !== b.getFullYear()) return a.getFullYear() - b.getFullYear();
  if (a.getMonth()    !== b.getMonth())    return a.getMonth()    - b.getMonth();
  return a.getDate() - b.getDate();
}

function buildMonthGrid(viewDate) {
  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const first = new Date(year, month, 1);
  // Monday-first week: Mon=0, ..., Sun=6
  const offset = (first.getDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(year, month, 1 - offset + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

function formatRangeChip(range) {
  if (!range || !range.start) return '—';
  const fmt = (d) => `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
  if (!range.end || isSameDay(range.start, range.end)) return fmt(range.start);
  return `${fmt(range.start)} → ${fmt(range.end)}`;
}

// One-shot stylesheet for hover/focus states. Inline styles can't express
// :hover or :focus-visible, so we inject a scoped sheet keyed off classes.
function PickerStyles() {
  return (
    <style>{`
      .adp-trigger { transition: background 120ms ease, border-color 120ms ease; outline: none; }
      .adp-trigger:hover { border-color: ${tokens.color.border.bright} !important; }
      .adp-trigger[data-state="open"] {
        background: ${tokens.color.surface.hover};
        border-color: ${tokens.color.border.bright};
      }
      .adp-trigger:focus-visible {
        border-color: ${tokens.color.accent[400]} !important;
        box-shadow: 0 0 0 1px ${tokens.color.accent[400]}, 0 0 8px ${tokens.color.accent[500]};
      }
      .adp-nav { transition: color 120ms ease, background 120ms ease; outline: none; }
      .adp-nav:hover { color: ${tokens.color.text.primary} !important; background: ${tokens.color.surface.hover} !important; }
      .adp-nav:focus-visible {
        color: ${tokens.color.text.primary};
        box-shadow: 0 0 0 1px ${tokens.color.accent[400]};
      }
      .adp-day { transition: background 100ms ease, color 100ms ease, border-color 100ms ease; outline: none; }
      .adp-day[data-state="default"]:hover {
        background: ${tokens.color.surface.hover} !important;
        color: ${tokens.color.text.primary} !important;
      }
      .adp-day[data-state="inrange"]:hover {
        background: ${tokens.color.surface.hover} !important;
        color: ${tokens.color.text.primary} !important;
      }
      .adp-day[data-state="selected"]:hover {
        border-color: ${tokens.color.accent[300]} !important;
      }
      .adp-day:focus-visible {
        box-shadow: 0 0 0 1px ${tokens.color.accent[400]};
      }
    `}</style>
  );
}

export const DateRangePicker = forwardRef(function DateRangePicker(
  { value, onChange, presetLabel, defaultOpen = false, style, ...props },
  ref,
) {
  const [open, setOpen]         = useState(defaultOpen);
  const [anchor, setAnchor]     = useState(null);
  const [hover, setHover]       = useState(null);
  const [viewDate, setViewDate] = useState(() => {
    const seed = value?.start ?? new Date();
    return new Date(seed.getFullYear(), seed.getMonth(), 1);
  });
  const wrapRef = useRef(null);

  // Click-outside + ESC to dismiss. Only attaches when open to avoid
  // listening across the entire app lifetime.
  useEffect(() => {
    if (!open) return undefined;
    const handleDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close();
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', handleDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  // When the panel opens, jump the visible month to the current start.
  useEffect(() => {
    if (open && value?.start) {
      setViewDate(new Date(value.start.getFullYear(), value.start.getMonth(), 1));
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  function close() {
    setOpen(false);
    setAnchor(null);
    setHover(null);
  }

  function handleDayClick(day) {
    if (!anchor) {
      setAnchor(day);
      setHover(day);
      return;
    }
    const cmp   = compareDays(day, anchor);
    const start = cmp >= 0 ? anchor : day;
    const end   = cmp >= 0 ? day    : anchor;
    onChange?.({ start, end });
    // Stay open. Reset the anchor so a follow-up click starts a fresh range
    // rather than extending the one that was just committed. The panel
    // dismisses only on click-outside or ESC.
    setAnchor(null);
    setHover(null);
  }

  const grid  = useMemo(() => buildMonthGrid(viewDate), [viewDate]);
  const today = useMemo(() => startOfDay(new Date()), []);

  // While anchor is set, the visible "range" is the in-progress preview.
  // Otherwise it falls back to the committed value.
  const drawRange = anchor
    ? (() => {
        const probe = hover ?? anchor;
        const cmp   = compareDays(probe, anchor);
        return cmp >= 0
          ? { start: anchor, end: probe }
          : { start: probe,  end: anchor };
      })()
    : { start: value?.start ?? null, end: value?.end ?? null };

  return (
    <div
      ref={(node) => {
        wrapRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      {...props}
    >
      <PickerStyles />

      <button
        type="button"
        className="adp-trigger"
        data-state={open ? 'open' : 'closed'}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: tokens.spacing[2],
          padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
          background: tokens.color.surface.active,
          border: `${tokens.border.thin} ${tokens.color.border.base}`,
          borderRadius: tokens.radius.none,
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.sm,
          color: tokens.color.text.secondary,
          letterSpacing: tokens.typography.tracking.wide,
          cursor: 'pointer',
        }}
      >
        <CalendarBlank weight="regular" size={13} />
        {presetLabel ? `${presetLabel} — ` : ''}
        {formatRangeChip(value)}
        <CaretDown
          weight="bold"
          size={10}
          style={{
            color: tokens.color.text.faint,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 140ms ease',
          }}
        />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Select date range"
          style={{
            position: 'absolute',
            top: `calc(100% + ${tokens.spacing[2]})`,
            left: 0,
            zIndex: 50,
            background: tokens.color.surface.raised,
            border: `${tokens.border.thin} ${tokens.color.border.base}`,
            padding: tokens.spacing[3],
            boxShadow: `0 8px 32px ${tokens.color.surface.base}`,
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacing[3],
          }}
        >
          <CornerMarkers />

          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <button
              type="button"
              className="adp-nav"
              onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              aria-label="Previous month"
              style={{
                width: `${NAV_PX}px`,
                height: `${NAV_PX}px`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                color: tokens.color.text.muted,
                cursor: 'pointer',
                borderRadius: tokens.radius.none,
              }}
            >
              <CaretLeft weight="bold" size={12} />
            </button>

            <span
              style={{
                fontFamily: tokens.typography.fontMono,
                fontSize: tokens.typography.size.sm,
                fontWeight: tokens.typography.weight.semibold,
                color: tokens.color.text.primary,
                letterSpacing: tokens.typography.tracking.wider,
                textTransform: 'uppercase',
              }}
            >
              {MONTHS_LONG[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>

            <button
              type="button"
              className="adp-nav"
              onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              aria-label="Next month"
              style={{
                width: `${NAV_PX}px`,
                height: `${NAV_PX}px`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                color: tokens.color.text.muted,
                cursor: 'pointer',
                borderRadius: tokens.radius.none,
              }}
            >
              <CaretRight weight="bold" size={12} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(7, ${CELL_PX}px)`,
              gap: tokens.spacing[1],
            }}
          >
            {DOW.map((d, i) => (
              <span
                key={`dow-${i}`}
                style={{
                  fontFamily: tokens.typography.fontMono,
                  fontSize: tokens.typography.size.xs,
                  color: tokens.color.text.faint,
                  textAlign: 'center',
                  padding: `${tokens.spacing[1]} 0`,
                  letterSpacing: tokens.typography.tracking.wider,
                  textTransform: 'uppercase',
                }}
              >
                {d}
              </span>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(7, ${CELL_PX}px)`,
              gap: tokens.spacing[1],
            }}
            onMouseLeave={() => { if (anchor) setHover(anchor); }}
          >
            {grid.map((day, i) => {
              const inMonth = day.getMonth() === viewDate.getMonth();
              const isStart = isSameDay(day, drawRange.start);
              const isEnd   = isSameDay(day, drawRange.end);
              const inRange = drawRange.start && drawRange.end
                && compareDays(day, drawRange.start) > 0
                && compareDays(day, drawRange.end)   < 0;
              const isToday  = isSameDay(day, today);
              const selected = isStart || isEnd;

              const dataState = selected ? 'selected' : inRange ? 'inrange' : 'default';

              const cellStyle = {
                position: 'relative',
                width:  `${CELL_PX}px`,
                height: `${CELL_PX}px`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: selected ? tokens.color.accent[500] : 'transparent',
                border: selected
                  ? `${tokens.border.thin} transparent`
                  : inRange
                    ? `${tokens.border.thin} ${tokens.color.accent[400]}`
                    : isToday
                      ? `${tokens.border.thin} ${tokens.color.border.bright}`
                      : `${tokens.border.thin} transparent`,
                borderRadius: tokens.radius.none,
                color: selected
                  ? tokens.color.accent[100]
                  : inMonth
                    ? tokens.color.text.secondary
                    : tokens.color.text.faint,
                fontFamily: tokens.typography.fontMono,
                fontSize: tokens.typography.size.sm,
                fontWeight: selected
                  ? tokens.typography.weight.semibold
                  : tokens.typography.weight.regular,
                cursor: 'pointer',
                padding: 0,
              };

              return (
                <button
                  key={i}
                  type="button"
                  className="adp-day"
                  data-state={dataState}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => { if (anchor) setHover(day); }}
                  style={cellStyle}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
});
