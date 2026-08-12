// @ts-nocheck — this spec AUTHORS JSX against untyped design-system
// components. Data-only specs in this directory need no such line.
import { EnvelopeOpen } from '@phosphor-icons/react'
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateMedia,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateAction,
} from '../../../../design-systems/andromeda/components/EmptyState'
import { Avatar } from '../../../../design-systems/andromeda/components/Avatar'
import { Button } from '../../../../design-systems/andromeda/components/Button'
import type { MatrixSpec } from './types'

// Reused from Avatar's image configuration so the two component pages exercise
// the same known portrait and the same built-in image failure fallback.
const PORTRAIT =
  'https://images.unsplash.com/photo-1669287731461-bd8ce3126710?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

export const emptyState: MatrixSpec = {
  slug: 'empty-state',
  Component: EmptyState,
  sizes: null,
  wide: true,
  // The configurations keep the original action and message-only choices,
  // then show the outline frame and both media substitution patterns.
  variants: [
    {
      label: 'With actions',
      props: {},
      children: (
        <>
          <EmptyStateIcon>
            <EnvelopeOpen weight="light" />
          </EmptyStateIcon>
          <EmptyStateTitle>No activity</EmptyStateTitle>
          <EmptyStateDescription>
            Awaiting signal from the deep-space array. The next pass is in approximately 14 minutes.
          </EmptyStateDescription>
          <EmptyStateAction>
            <Button size="sm">Open log</Button>
            <Button variant="outline" size="sm">
              Refresh
            </Button>
          </EmptyStateAction>
        </>
      ),
    },
    {
      label: 'Message only',
      props: {},
      children: (
        <>
          <EmptyStateIcon>
            <EnvelopeOpen weight="light" />
          </EmptyStateIcon>
          <EmptyStateTitle>No activity</EmptyStateTitle>
          <EmptyStateDescription>Awaiting signal from the deep-space array.</EmptyStateDescription>
        </>
      ),
    },
    {
      label: 'Outline',
      props: { variant: 'outline' },
      children: (
        <>
          <EmptyStateIcon>
            <EnvelopeOpen weight="light" />
          </EmptyStateIcon>
          <EmptyStateTitle>No payload detected</EmptyStateTitle>
          <EmptyStateDescription>
            Drop a mission file here to begin the first deep-space transmission.
          </EmptyStateDescription>
        </>
      ),
    },
    {
      label: 'Avatar',
      props: {},
      children: (
        <>
          <EmptyStateMedia>
            <Avatar name="Reza Quinn" src={PORTRAIT} size="lg" />
          </EmptyStateMedia>
          <EmptyStateTitle>No watch assigned</EmptyStateTitle>
          <EmptyStateDescription>
            Reza Quinn is awaiting a telemetry window from the deep-space array.
          </EmptyStateDescription>
        </>
      ),
    },
  ],
  states: [],
}
