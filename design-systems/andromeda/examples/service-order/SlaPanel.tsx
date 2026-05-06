// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SERVICE ORDER · SlaPanel
// Right panel — standalone. surface.raised bg, accent corner
// brackets (no gradient, no border). Four stacked zones:
//
//   ┌ panel-header: "Window Risk" + pin/close ─────────────┐
//   │  [7×5 risk grid]   60%    ← row 1                    │
//   │  description text         ← row 2                    │
//   │  231 USED · 102 REM · [SEE TRANSFERS] ← row 3        │
//   └──────────────────────────────────────────────────────┘
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import { PushPin, X, ArrowUpRight } from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Tag } from '../../components/Tag';
import { Tooltip } from '../../components/Tooltip';
import { RiskGrid } from './RiskGrid';
import { slaRisk } from './data';

// Stagger timing — values match the grid's stagger so the percentage
// kicks off the moment the wave-front cell finishes its transition.
const GRID_FINISH_MS    = 800;   // last grid cell finishes around here
const PERCENT_DURATION  = 500;   // count-up duration
const CURRENT_DELAY_MS  = GRID_FINISH_MS + PERCENT_DURATION;

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

export function SlaPanel() {
  const target = slaRisk.value;
  const [displayedPct, setDisplayedPct] = useState(0);
  const [showCurrent, setShowCurrent] = useState(false);

  useEffect(() => {
    // After the grid has finished its stagger, count up the percentage.
    let rafId;
    const startTimer = setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / PERCENT_DURATION);
        // ease-out cubic — fast start, gentle settle
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplayedPct(Math.round(target * eased));
        if (t < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }, GRID_FINISH_MS);

    // After the count-up settles, reveal CURRENT.
    const currentTimer = setTimeout(() => setShowCurrent(true), CURRENT_DELAY_MS);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(currentTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [target]);

  return (
    <Card
      variant="default"
      markerProps={{ color: tokens.color.accent[300] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Panel header */}
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
        <Tooltip label="Pin"><IconButton aria-label="Pin"   variant="ghost" size="sm" icon={PushPin} /></Tooltip>
        <Tooltip label="Close"><IconButton aria-label="Close" variant="ghost" size="sm" icon={X} /></Tooltip>
      </div>

      {/* Row 1 — grid · percentage · current chip — all on one line */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[5],
          padding: `${tokens.spacing[5]} ${tokens.spacing[5]} ${tokens.spacing[4]} ${tokens.spacing[5]}`,
        }}
      >
        <RiskGrid />

        {/* Percentage — accent-300 because it IS the measurement */}
        <span
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size['4xl'],
            fontWeight: tokens.typography.weight.bold,
            color: tokens.color.accent[300],
            letterSpacing: tokens.typography.tracking.tight,
            lineHeight: tokens.typography.lineHeight.tight,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {displayedPct}%
        </span>

        {/* Current — chip, fades in after the count-up settles */}
        <span
          style={{
            display: 'inline-flex',
            opacity: showCurrent ? 1 : 0,
            transform: showCurrent ? 'translateY(0)' : 'translateY(-4px)',
            transition: 'opacity 320ms ease, transform 320ms ease',
          }}
        >
          <Tag variant="default">Current</Tag>
        </span>
      </div>

      {/* Row 2 — stats + CTA on the same row */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          gap: tokens.spacing[5],
          padding: `${tokens.spacing[4]} ${tokens.spacing[5]} ${tokens.spacing[5]} ${tokens.spacing[5]}`,
          marginTop: 'auto',
        }}
      >
        <InsetDivider side="top" />
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

        <div style={{ flex: 1 }} />
        <Button variant="outline" size="sm" icon={ArrowUpRight} style={{ whiteSpace: 'nowrap' }}>See All</Button>
      </div>
    </Card>
  );
}
