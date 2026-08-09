// @ts-nocheck — this spec AUTHORS JSX against untyped design-system
// components. Data-only specs in this directory need no such line.
import { Info, Pulse, Warning } from '@phosphor-icons/react'
import {
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from '../../../../design-systems/andromeda/components/Alert'
import type { MatrixSpec } from './types'

// Each variant carries its own icon and copy, because the severity is the
// point: a fault banner illustrated with an info glyph teaches the wrong thing.
const body = (Icon: unknown, title: string, description: string) => (
  <>
    <AlertIcon>
      <Icon weight="light" />
    </AlertIcon>
    <AlertContent>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </AlertContent>
  </>
)

export const alert: MatrixSpec = {
  slug: 'alert',
  Component: Alert,
  // No size axis in the source: an alert is a full-width banner.
  sizes: null,
  wide: true,
  variants: [
    {
      label: 'Default',
      props: { variant: 'default' },
      children: body(Info, 'System nominal', 'All systems reporting in.'),
    },
    {
      label: 'Accent',
      props: { variant: 'accent' },
      children: body(Pulse, 'New activity', 'Burst received from VHCL-04.'),
    },
    {
      label: 'Warning',
      props: { variant: 'warning' },
      children: body(Warning, 'Caution', 'Heat shield within 12% of operational limit.'),
    },
    {
      label: 'Fault',
      props: { variant: 'fault' },
      children: body(Warning, 'Connection lost', 'Reconnecting. ETA 8 seconds.'),
    },
  ],
  // A banner is not interactive; the source declares no hover, focus or
  // pressed treatment, so it gets no states grid rather than four copies of
  // its own baseline.
  states: [],
}
