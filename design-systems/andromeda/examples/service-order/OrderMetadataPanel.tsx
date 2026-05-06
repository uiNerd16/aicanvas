// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SERVICE ORDER · OrderMetadataPanel
// Left panel — standalone. Header strip with Order ID, countdown
// timer, Edit + Generate Report; below it the 3-col × 3-row
// contract metadata grid.
// ============================================================

'use client';

import { useEffect, useRef, useState } from 'react';
import { Pencil, FileText, Clock, CaretDown } from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';

// Inset divider — 12px from each edge. Sibling of content inside a position:relative parent.
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

const FOLLOW_UP_OPTIONS = ['02:00 Hours', '04:00 Hours', '12:00 Hours', '24:00 Hours'];

function FollowUpDropdown({ initial = '24:00 Hours' }) {
  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleDown(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', maxWidth: '160px' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-state={open ? 'open' : 'closed'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: tokens.spacing[2],
          padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
          background: open ? tokens.color.surface.hover : tokens.color.surface.overlay,
          border: `${tokens.border.thin} ${open ? tokens.color.border.bright : tokens.color.border.base}`,
          cursor: 'pointer',
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.sm,
          color: tokens.color.text.primary,
          letterSpacing: tokens.typography.tracking.wide,
          width: '100%',
          transition: 'background 140ms ease, border-color 140ms ease',
        }}
      >
        {value}
        <CaretDown
          weight="regular"
          size={12}
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 140ms ease', flexShrink: 0 }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: `calc(100% + ${tokens.spacing[2]})`,
            left: 0,
            right: 0,
            zIndex: 50,
            background: tokens.color.surface.raised,
            border: `${tokens.border.thin} ${tokens.color.border.base}`,
            boxShadow: `0 8px 32px ${tokens.color.surface.base}`,
          }}
        >
          <CornerMarkers />
          {FOLLOW_UP_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { setValue(opt); setCustom(''); setOpen(false); }}
              style={{
                display: 'block',
                width: '100%',
                padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
                background: opt === value ? tokens.color.surface.active : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: tokens.typography.fontMono,
                fontSize: tokens.typography.size.sm,
                color: opt === value ? tokens.color.text.primary : tokens.color.text.secondary,
                letterSpacing: tokens.typography.tracking.wide,
                textAlign: 'left',
                transition: 'background 100ms ease, color 100ms ease',
              }}
              onMouseEnter={(e) => { if (opt !== value) { e.currentTarget.style.background = tokens.color.surface.hover; e.currentTarget.style.color = tokens.color.text.primary; }}}
              onMouseLeave={(e) => { if (opt !== value) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = tokens.color.text.secondary; }}}
            >
              {opt}
            </button>
          ))}

          {/* Custom input — separated by a divider */}
          <div style={{ borderTop: `${tokens.border.thin} ${tokens.color.border.subtle}`, padding: tokens.spacing[2] }}>
            <input
              ref={inputRef}
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && custom.trim()) {
                  const num = parseFloat(custom.trim());
                  const formatted = !isNaN(num) && num > 0
                    ? `${String(Math.floor(num)).padStart(2, '0')}:00 Hours`
                    : custom.trim();
                  setValue(formatted);
                  setCustom('');
                  setOpen(false);
                }
                if (e.key === 'Escape') setOpen(false);
              }}
              placeholder="Custom…"
              style={{
                display: 'block',
                width: '100%',
                padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
                background: tokens.color.surface.overlay,
                border: `${tokens.border.thin} ${tokens.color.border.base}`,
                outline: 'none',
                fontFamily: tokens.typography.fontMono,
                fontSize: tokens.typography.size.sm,
                color: tokens.color.text.primary,
                letterSpacing: tokens.typography.tracking.wide,
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = tokens.color.border.bright; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = tokens.color.border.base; }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
import { Button } from '../../components/Button';
import { order, orderMetadata } from './data';

function parseSeconds(hms) {
  const [h, m, s] = hms.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

function formatSeconds(total) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

// ── Header strip ───────────────────────────────────────────────────
function HeaderStrip() {
  const [seconds, setSeconds] = useState(() => parseSeconds(order.timer));

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds <= 0]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[3],
        padding: `${tokens.spacing[4]} ${tokens.spacing[5]}`,
      }}
    >
      <InsetDivider />
      <span
        style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.muted,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.widest,
        }}
      >
        Order
      </span>
      <span
        style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.lg,
          fontWeight: tokens.typography.weight.semibold,
          color: tokens.color.text.primary,
          letterSpacing: tokens.typography.tracking.wide,
        }}
      >
        {order.id}
      </span>

      {/* Timer chip — accent-300 because the value IS the measurement */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: tokens.spacing[2],
          padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
          background: tokens.color.surface.overlay,
          border: `${tokens.border.thin} ${tokens.color.border.base}`,
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.sm,
          color: tokens.color.accent[300],
          letterSpacing: tokens.typography.tracking.wider,
        }}
      >
        <Clock weight="regular" size={14} />
        {formatSeconds(seconds)}
      </span>

      <div style={{ flex: 1 }} />

      <Button variant="outline" size="sm" icon={Pencil}>
        Edit
      </Button>
      <Button variant="default" size="sm" icon={FileText}>
        Generate Report
      </Button>
    </div>
  );
}

// ── Metadata cell ──────────────────────────────────────────────────
function MetaCell({ label, value, type }) {
  if (type === 'spacer') return <div />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2], minWidth: 0 }}>
      <span
        style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.muted,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.widest,
          lineHeight: 1,
        }}
      >
        {label}
      </span>

      {type === 'follow-up' ? (
        <FollowUpDropdown initial={value} />
      ) : (
        <span
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.sm,
            color: type === 'link' ? tokens.color.accent[300] : tokens.color.text.primary,
            letterSpacing: tokens.typography.tracking.wide,
            cursor: type === 'link' ? 'pointer' : 'default',
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

// ── Composition ────────────────────────────────────────────────────
export function OrderMetadataPanel() {
  return (
    <div
      style={{
        position: 'relative',
        background: tokens.color.surface.raised,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CornerMarkers />

      <HeaderStrip />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          columnGap: tokens.spacing[5],
          rowGap: tokens.spacing[5],
          padding: tokens.spacing[5],
          alignContent: 'start',
        }}
      >
        {orderMetadata.map((cell, i) => (
          <MetaCell key={`${cell.label}-${i}`} {...cell} />
        ))}
      </div>
    </div>
  );
}
