// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SERVICE ORDER · OrderSummaryPanel
// Top section. Header strip (Order ID + countdown timer +
// Edit / Generate Report), then a 50 / 50 body:
//
//   LEFT  — SLA card (glow), rearranged:
//     ┌ panel-header: "Window Risk" + pin/close ──────────────┐
//     │  [110px gauge]  description                           │
//     │  (centered)     231 USED     102 REMAINING            │
//     │                                   [See Transfers →]   │
//     └───────────────────────────────────────────────────────┘
//
//   RIGHT — metadata grid, 3 cols × 3 rows (End Date / Group /
//     Fault Priority column removed).
// ============================================================

'use client';

import {
  PushPin,
  X,
  Pencil,
  FileText,
  Clock,
  CaretDown,
} from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { RiskGauge } from './RiskGauge';
import { order, slaRisk, orderMetadata } from './data';

// ── Inset divider — system rule: every horizontal divider inside a
// panel inset 12px from each side, never edge-to-edge. See
// `rules.md` → Section dividers.
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

// ── Header strip (Order ID · timer · actions) ──────────────────────
function HeaderStrip() {
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
        {order.timer}
      </span>

      <div style={{ flex: 1 }} />

      <Button variant="outline" size="md" icon={Pencil} style={{ height: tokens.spacing[8] }}>
        Edit
      </Button>
      <Button variant="default" size="md" icon={FileText} style={{ height: tokens.spacing[8] }}>
        Generate Report
      </Button>
    </div>
  );
}

// ── SLA risk card (rearranged) ─────────────────────────────────────
function SlaCard() {
  return (
    <Card
      variant="glow"
      bordered
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Panel-style header: title on left, pin + close on right */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          padding: `${tokens.spacing[4]} ${tokens.spacing[5]}`,
        }}
      >
        <InsetDivider />
        <span
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xl,
            fontWeight: tokens.typography.weight.semibold,
            color: tokens.color.text.primary,
            letterSpacing: tokens.typography.tracking.tight,
          }}
        >
          {slaRisk.title}
        </span>
        <div style={{ flex: 1 }} />
        <IconButton aria-label="Pin"   variant="ghost" size="sm" icon={PushPin} />
        <IconButton aria-label="Close" variant="ghost" size="sm" icon={X} />
      </div>

      {/* Body: gauge (left, fixed) + text+stats (right, fluid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '130px 1fr',
          gap: tokens.spacing[5],
          padding: `${tokens.spacing[5]} ${tokens.spacing[5]} ${tokens.spacing[3]} ${tokens.spacing[5]}`,
          flex: 1,
        }}
      >
        {/* Gauge — centered in its column */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RiskGauge value={slaRisk.value} />
        </div>

        {/* Right column: description at top, stats at bottom */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: tokens.spacing[4],
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.secondary,
              letterSpacing: tokens.typography.tracking.normal,
              lineHeight: tokens.typography.lineHeight.snug,
            }}
          >
            {slaRisk.description}
          </span>

          {/* Two stat blocks side by side */}
          <div style={{ display: 'flex', gap: tokens.spacing[6] }}>
            {[slaRisk.used, slaRisk.remaining].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: tokens.spacing[1],
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: tokens.typography.fontMono,
                    fontSize: tokens.typography.size['2xl'],
                    fontWeight: tokens.typography.weight.bold,
                    color: tokens.color.text.primary,
                    letterSpacing: tokens.typography.tracking.tight,
                    lineHeight: tokens.typography.lineHeight.tight,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: tokens.typography.fontMono,
                    fontSize: tokens.typography.size.xs,
                    color: tokens.color.text.muted,
                    textTransform: 'uppercase',
                    letterSpacing: tokens.typography.tracking.wider,
                    lineHeight: tokens.typography.lineHeight.snug,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: See Transfers right-aligned */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: `${tokens.spacing[3]} ${tokens.spacing[5]} ${tokens.spacing[5]} ${tokens.spacing[5]}`,
        }}
      >
        <Button variant="outline" size="sm">See Transfers</Button>
      </div>
    </Card>
  );
}

// ── Metadata cell (label / value) ──────────────────────────────────
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
        <button
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: tokens.spacing[2],
            padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
            background: tokens.color.surface.overlay,
            border: `${tokens.border.thin} ${tokens.color.border.base}`,
            cursor: 'pointer',
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.sm,
            color: tokens.color.text.primary,
            letterSpacing: tokens.typography.tracking.wide,
            textAlign: 'left',
            width: '100%',
            maxWidth: '160px',
          }}
        >
          {value}
          <CaretDown weight="regular" size={12} />
        </button>
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
export function OrderSummaryPanel() {
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

      {/* 50 / 50 split: SLA card (left) + metadata grid (right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: tokens.spacing[5],
          padding: tokens.spacing[5],
        }}
      >
        <SlaCard />

        {/* Metadata: 3 cols × 3 rows */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, auto)',
            columnGap: tokens.spacing[5],
            rowGap: tokens.spacing[5],
            alignContent: 'start',
          }}
        >
          {orderMetadata.map((cell, i) => (
            <MetaCell key={`${cell.label}-${i}`} {...cell} />
          ))}
        </div>
      </div>
    </div>
  );
}
