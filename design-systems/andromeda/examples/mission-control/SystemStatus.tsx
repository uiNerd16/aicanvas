// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// MISSION CONTROL: Row 2 right — Subsystem Status
// ============================================================

import { tokens } from '../../tokens';
import { Card, CardHeader, CardContent } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { ProgressBar } from '../../components/ProgressBar';
import { systems } from './data';

// Map data-level status names → new Badge variants
const statusBadgeVariant = {
  nominal: 'accent',
  caution: 'warning',
  fault:   'fault',
};

const statusLabel = {
  nominal: 'OK',
  caution: 'Caution',
  fault:   'Fault',
};

// Map data-level status names → new ProgressBar variants
const progressVariant = {
  nominal: 'default',
  caution: 'warning',
  fault:   'fault',
};

export function SystemStatus() {
  return (
    <Card style={{ flex: 1, minWidth: 0 }}>
      <CardHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}>
            /// Subsystems
          </span>
          <span style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.md,
            color: tokens.color.text.primary,
            fontWeight: tokens.typography.weight.medium,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}>
            Status
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[4] }}>
          {systems.map(sys => (
            <div key={sys.name} style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: tokens.spacing[2] }}>
                <span style={{
                  fontFamily: tokens.typography.fontMono,
                  fontSize: tokens.typography.size.xs,
                  color: tokens.color.text.primary,
                  fontWeight: tokens.typography.weight.medium,
                  textTransform: 'uppercase',
                  letterSpacing: tokens.typography.tracking.wider,
                }}>
                  {sys.name}
                </span>
                <Badge variant={statusBadgeVariant[sys.status]}>
                  {statusLabel[sys.status]}
                </Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[3] }}>
                <ProgressBar value={sys.value} variant={progressVariant[sys.status]} style={{ flex: 1 }} />
                <span style={{
                  fontFamily: tokens.typography.fontMono,
                  fontSize: tokens.typography.size.xs,
                  color: tokens.color.text.faint,
                  letterSpacing: tokens.typography.tracking.wider,
                  flexShrink: 0,
                  width: '28px',
                  textAlign: 'right',
                }}>
                  {sys.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
