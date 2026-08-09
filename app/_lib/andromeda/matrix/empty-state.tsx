// @ts-nocheck — this spec AUTHORS JSX against untyped design-system
// components. Data-only specs in this directory need no such line.
import { EnvelopeOpen } from '@phosphor-icons/react'
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateAction,
} from '../../../../design-systems/andromeda/components/EmptyState'
import { Button } from '../../../../design-systems/andromeda/components/Button'
import type { MatrixSpec } from './types'

export const emptyState: MatrixSpec = {
  slug: 'empty-state',
  Component: EmptyState,
  sizes: null,
  wide: true,
  // One shape, no variant axis in the source. The second case is the same
  // component without its action slot, which is the real choice a consumer
  // makes here.
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
            <Button variant="outline" size="sm">
              Refresh
            </Button>
            <Button size="sm">Open log</Button>
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
  ],
  states: [],
}
