// ============================================================
// MISSION CONTROL: Row 3 left — Vehicles Table
// ============================================================

import { useState } from 'react';
import { tokens } from '../../tokens';
import { Card, CardHeader } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { vehicles, vehicleStatusLabel } from './data';

// Local map: data status → new Badge variants
// (data.js still uses the legacy 'nominal'/'caution' values)
const vehicleBadgeVariant = {
  active:  'accent',
  standby: 'default',
  caution: 'warning',
  fault:   'fault',
};

function VehicleRow({ vehicle, isLast }) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? tokens.color.surface.hover : 'transparent',
        transition: 'background 0.15s ease',
        borderBottom: isLast ? 'none' : `${tokens.border.thin} ${tokens.color.border.subtle}`,
      }}
    >
      {/* Callsign */}
      <td style={{ padding: `${tokens.spacing[3]} ${tokens.spacing[3]}` }}>
        <span style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.sm,
          color: tokens.color.text.primary,
          fontWeight: tokens.typography.weight.medium,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.wider,
        }}>
          {vehicle.callsign}
        </span>
      </td>
      {/* Type */}
      <td style={{ padding: `${tokens.spacing[3]} ${tokens.spacing[3]}` }}>
        <span style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.muted,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.wider,
        }}>
          {vehicle.type}
        </span>
      </td>
      {/* Status */}
      <td style={{ padding: `${tokens.spacing[3]} ${tokens.spacing[3]}` }}>
        <Badge variant={vehicleBadgeVariant[vehicle.status]}>
          {vehicleStatusLabel[vehicle.status]}
        </Badge>
      </td>
      {/* Distance */}
      <td style={{ padding: `${tokens.spacing[3]} ${tokens.spacing[3]}`, textAlign: 'right' }}>
        <span style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.sm,
          color: tokens.color.text.secondary,
          letterSpacing: tokens.typography.tracking.wide,
        }}>
          {vehicle.distance}
        </span>
      </td>
      {/* Last contact */}
      <td style={{ padding: `${tokens.spacing[3]} ${tokens.spacing[3]}`, textAlign: 'right' }}>
        <span style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.muted,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.wide,
        }}>
          {vehicle.lastContact}
        </span>
      </td>
    </tr>
  );
}

export function VehiclesTable() {
  return (
    <Card style={{ flex: '0 0 calc(65% - 10px)', minWidth: 0 }}>
      <CardHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}>
            /// Fleet
          </span>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.md,
            color: tokens.color.text.primary,
            fontWeight: tokens.typography.weight.medium,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}>
            Vehicles
          </span>
        </div>
        <Button variant="ghost" size="sm">View all</Button>
      </CardHeader>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `${tokens.border.thin} ${tokens.color.border.base}` }}>
            {[
              { label: 'Callsign',     align: 'left'  },
              { label: 'Type',         align: 'left'  },
              { label: 'Status',       align: 'left'  },
              { label: 'Distance',     align: 'right' },
              { label: 'Last Contact', align: 'right' },
            ].map((col, i) => (
              <th key={i} style={{
                padding: `${tokens.spacing[3]} ${tokens.spacing[3]}`,
                textAlign: col.align,
                fontFamily: tokens.typography.fontMono,
                fontSize: tokens.typography.size.xs,
                fontWeight: tokens.typography.weight.medium,
                color: tokens.color.text.faint,
                textTransform: 'uppercase',
                letterSpacing: tokens.typography.tracking.widest,
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle, i) => (
            <VehicleRow
              key={vehicle.callsign}
              vehicle={vehicle}
              isLast={i === vehicles.length - 1}
            />
          ))}
        </tbody>
      </table>
    </Card>
  );
}
