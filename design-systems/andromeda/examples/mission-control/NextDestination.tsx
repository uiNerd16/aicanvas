// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL · Next Destination widget
// Full-width row that sits under the VehiclesTable + CommsLog row.
// Left half: rotating Planet (Three.js particle sphere, accent palette).
// Right half: a vertical "run" of mission readouts — target, status,
// distance, ETA, bearing, classification — closed by a CTA pair.
// ============================================================

import { ArrowRight, MapTrifold } from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { Card, CardHeader, CardTitle } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Planet } from '../../components/Planet';

const readouts = [
  { label: 'Target',    value: 'KEPLER-186F' },
  { label: 'Status',    value: 'APPROACHING' },
  { label: 'Distance',  value: '492.3 ly'    },
  { label: 'ETA',       value: '2027.04.18'  },
  { label: 'Bearing',   value: '042.7°'      },
  { label: 'Class',     value: 'M-DWARF'     },
  { label: 'Δv budget', value: '14.2 km/s'   },
];

export function NextDestination() {
  return (
    <Card style={{ flex: 1, minWidth: 0 }}>
      <CardHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}>
            /// Heading
          </span>
          <CardTitle>Next Destination</CardTitle>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[2] }}>
          <Badge variant="accent">LOCKED</Badge>
          <Button variant="ghost" size="sm">
            Map
            <MapTrifold weight="regular" size={14} />
          </Button>
        </div>
      </CardHeader>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(260px, 1fr) minmax(0, 1fr)',
          gap: tokens.spacing[5],
          padding: `${tokens.spacing[5]} ${tokens.spacing[5]}`,
          alignItems: 'stretch',
        }}
      >
        {/* Planet — left half */}
        <div
          style={{
            position: 'relative',
            minHeight: 280,
            borderRight: `${tokens.border.thin} ${tokens.color.border.subtle}`,
            paddingRight: tokens.spacing[5],
          }}
        >
          <Planet particleCount={6500} />
          {/* Tiny corner caption */}
          <span style={{
            position: 'absolute',
            left: 0, bottom: 0,
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.faint,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}>
            REAL-TIME ROTATION
          </span>
        </div>

        {/* Readouts — right half, single vertical column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[3] }}>
          {/* Hero row — target name in display size */}
          <div>
            <div style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.widest,
              marginBottom: tokens.spacing[1],
            }}>
              Target body
            </div>
            <div style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size['3xl'],
              fontWeight: tokens.typography.weight.bold,
              color: tokens.color.text.primary,
              letterSpacing: tokens.typography.tracking.wider,
              lineHeight: tokens.typography.lineHeight.tight,
            }}>
              KEPLER-186F
            </div>
          </div>

          {/* Telemetry rows — one line each, two columns */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {readouts.map(({ label, value }, i) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  padding: `${tokens.spacing[2]} 0`,
                  borderBottom: i === readouts.length - 1
                    ? 'none'
                    : `${tokens.border.thin} ${tokens.color.border.subtle}`,
                }}
              >
                <span style={{
                  fontFamily: tokens.typography.fontMono,
                  fontSize: tokens.typography.size.xs,
                  color: tokens.color.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: tokens.typography.tracking.wider,
                }}>
                  {label}
                </span>
                <span style={{
                  fontFamily: tokens.typography.fontMono,
                  fontSize: tokens.typography.size.sm,
                  color: tokens.color.text.primary,
                  letterSpacing: tokens.typography.tracking.wide,
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div style={{ display: 'flex', gap: tokens.spacing[2], marginTop: tokens.spacing[2] }}>
            <Button variant="default" size="md">
              ENGAGE TRAJECTORY
              <ArrowRight weight="regular" size={16} />
            </Button>
            <Button variant="ghost" size="md">
              DETAILS
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
