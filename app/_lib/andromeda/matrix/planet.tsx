// @ts-nocheck — this spec AUTHORS JSX against untyped design-system
// components. Data-only specs in this directory need no such line.
import { Planet } from '../../../../design-systems/andromeda/components/Planet'
import { Badge } from '../../../../design-systems/andromeda/components/Badge'
import { Button } from '../../../../design-systems/andromeda/components/Button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from '../../../../design-systems/andromeda/components/Card'
import { tokens } from '../../../../design-systems/andromeda/tokens'
import type { MatrixSpec } from './types'

const label = {
  fontFamily: tokens.typography.fontMono,
  fontSize: tokens.typography.size.xs,
  color: tokens.color.text.muted,
  textTransform: 'uppercase' as const,
  letterSpacing: tokens.typography.tracking.wider,
}

// The "Next destination" widget, carried verbatim from the system page's
// hand-written section in the 2026-08-09 collapse. It is the only thing on this
// component that is a USAGE example rather than a configuration: a hero body
// composed into a panel with its own readout and actions.
function PlanetPanel() {
  return (
    <Card style={{ maxWidth: 620 }}>
      <CardHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
          <span style={{ ...label, letterSpacing: tokens.typography.tracking.widest }}>{'/// '}Heading</span>
          <CardTitle>Next destination</CardTitle>
        </div>
        <Badge variant="accent">Locked</Badge>
      </CardHeader>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: tokens.spacing[4],
          padding: tokens.spacing[4],
          alignItems: 'center',
        }}
      >
        <div style={{ height: 220, position: 'relative' }}>
          <Planet particleCount={5500} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[3] }}>
          <div>
            <div style={{ ...label, letterSpacing: tokens.typography.tracking.widest }}>Target</div>
            <div
              style={{
                fontFamily: tokens.typography.fontMono,
                fontSize: tokens.typography.size.xl,
                color: tokens.color.text.primary,
                fontWeight: tokens.typography.weight.bold,
                letterSpacing: tokens.typography.tracking.wider,
                marginTop: tokens.spacing[1],
              }}
            >
              KEPLER-186F
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
            {[
              { k: 'Distance', v: '492.3 ly' },
              { k: 'ETA', v: '2027.04.18' },
              { k: 'Bearing', v: '042.7°' },
              { k: 'Class', v: 'M-Dwarf' },
            ].map(({ k, v }) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: `1px solid ${tokens.color.border.subtle}`,
                  paddingBottom: tokens.spacing[2],
                }}
              >
                <span style={label}>{k}</span>
                <span
                  style={{
                    fontFamily: tokens.typography.fontMono,
                    fontSize: tokens.typography.size.sm,
                    color: tokens.color.text.primary,
                    letterSpacing: tokens.typography.tracking.wide,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CardFooter>
        <Button variant="default" size="sm">
          Engage trajectory
        </Button>
        <Button variant="ghost" size="sm">
          Details
        </Button>
      </CardFooter>
    </Card>
  )
}

export const planet: MatrixSpec = {
  slug: 'planet',
  sizes: null,
  // Three.js needs a sized, positioned box to fill.
  render: (_size, props) => (
    <div style={{ width: 320, height: 260, position: 'relative' }}>
      <Planet {...props} />
    </div>
  ),
  variants: [
    { label: 'Default', props: {}, clientOnly: 'the particle field is built in an effect against a canvas; SSR emits an empty container' },
    { label: 'Sparse', props: { particleCount: 2000 }, clientOnly: 'same WebGL mount gate as Default' },
    { label: 'Paused', props: { paused: true }, clientOnly: 'same WebGL mount gate as Default' },
    {
      label: 'In a panel',
      node: <PlanetPanel />,
      clientOnly: 'the panel chrome SSRs, the body inside it does not — same WebGL mount gate',
    },
  ],
  states: [],
  gaps: {
    Rotation: 'perpetual motion with no rest frame; the paused variant above is the closest thing to a still',
  },
}
