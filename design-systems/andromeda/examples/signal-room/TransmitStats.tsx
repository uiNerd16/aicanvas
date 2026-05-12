// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SIGNAL ROOM: Transmit stats
// Row of telemetry-style readouts that report on the active
// transmission (signal / bitrate / latency / channel). Lives as
// a sibling of NowTransmitting — NOT nested inside it — so the
// StatTile corner markers don't sit inside the hero panel's
// corner markers. See rules.md → "Frames don't nest".
// ============================================================

'use client';

import { StatTile } from '../../components/StatTile';
import { nowTransmittingStats } from './data';

export function TransmitStats() {
  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {nowTransmittingStats.map((stat, i) => (
        <StatTile
          key={stat.code}
          code={stat.code}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          delta={stat.delta}
          deltaLabel={stat.deltaLabel}
          live
          style={{ marginLeft: i > 0 ? -1 : 0 }}
        />
      ))}
    </div>
  );
}
