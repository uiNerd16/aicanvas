// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL · Vehicles section
// 3-column grid of vehicle cards. Each card shows a placeholder
// thumbnail (Unsplash space imagery), callsign + status, mission line,
// telemetry strip, fuel reserve, and a Details CTA. Andromeda doesn't
// ship an Image primitive yet — flagged: if a second example also wants
// thumbnail tiles, this is the trigger to promote a `<Thumbnail>` or
// `<Image>` component into design-systems/andromeda/components.
// ============================================================

import { tokens } from '../../../tokens';
import { Card, CardHeader, CardContent, CardFooter } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { ProgressBar } from '../../../components/ProgressBar';
import { CornerMarkers } from '../../../components/CornerMarkers';
import { vehiclesDetailed } from '../data';

const statusBadge = {
  active:  { variant: 'accent',  label: 'Active'  },
  standby: { variant: 'default', label: 'Standby' },
  caution: { variant: 'warning', label: 'Caution' },
  fault:   { variant: 'fault',   label: 'Fault'   },
};

const fuelVariant = {
  active:  'default',
  standby: 'default',
  caution: 'warning',
  fault:   'fault',
};

function VehicleCard({ vehicle }) {
  const sb = statusBadge[vehicle.status];

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      {/* Thumbnail — 16:9 with bracket motif overlaid in the corners */}
      <div style={{
        position: 'relative',
        aspectRatio: '16 / 9',
        overflow: 'hidden',
        borderBottom: `${tokens.border.thin} ${tokens.color.border.base}`,
        background: tokens.color.surface.void,
      }}>
        <img
          src={vehicle.image}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.85,
          }}
        />
        {/* Soft top-down dim so text in the header reads against the image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${tokens.color.surface.void} 0%, transparent 30%, transparent 70%, ${tokens.color.surface.void} 100%)`,
          opacity: 0.6,
        }} />
        <CornerMarkers />
        <span style={{
          position: 'absolute',
          left: tokens.spacing[3],
          bottom: tokens.spacing[3],
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.xs,
          color: tokens.color.text.faint,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.widest,
        }}>
          /// {vehicle.type}
        </span>
      </div>

      <CardHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}>
            /// Callsign
          </span>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.lg,
            color: tokens.color.text.primary,
            fontWeight: tokens.typography.weight.medium,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}>
            {vehicle.callsign}
          </span>
        </div>
        <Badge variant={sb.variant}>{sb.label}</Badge>
      </CardHeader>

      <CardContent>
        {/* Mission line */}
        <div style={{
          fontFamily: tokens.typography.fontSans,
          fontSize: tokens.typography.size.sm,
          color: tokens.color.text.secondary,
          lineHeight: tokens.typography.lineHeight.snug,
          marginBottom: tokens.spacing[4],
        }}>
          {vehicle.mission}
        </div>

        {/* Stats strip — distance + last contact + crew */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: tokens.spacing[3],
          marginBottom: tokens.spacing[4],
        }}>
          {[
            { label: 'Distance',    value: vehicle.distance    },
            { label: 'Last Contact', value: vehicle.lastContact },
            { label: 'Crew',        value: String(vehicle.crew) },
          ].map((s) => (
            <div key={s.label}>
              <div style={{
                fontFamily: tokens.typography.fontMono,
                fontSize: tokens.typography.size.xs,
                color: tokens.color.text.faint,
                textTransform: 'uppercase',
                letterSpacing: tokens.typography.tracking.widest,
                marginBottom: tokens.spacing[1],
              }}>
                {s.label}
              </div>
              <div style={{
                fontFamily: tokens.typography.fontMono,
                fontSize: tokens.typography.size.sm,
                color: tokens.color.text.primary,
                letterSpacing: tokens.typography.tracking.wide,
              }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Fuel reserve */}
        <ProgressBar
          label="Fuel Reserve"
          value={vehicle.fuel}
          variant={fuelVariant[vehicle.status]}
        />
      </CardContent>

      <CardFooter>
        <Button variant="outline" size="sm" style={{ width: '100%' }}>
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}

export function VehiclesSection() {
  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: tokens.spacing[5],
      }}>
        {vehiclesDetailed.map(v => (
          <VehicleCard key={v.callsign} vehicle={v} />
        ))}
      </div>
    </>
  );
}
