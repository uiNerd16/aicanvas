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

// Three astronauts under the Unsplash licence, each a different suit and
// backdrop so a stack of them reads as three people rather than one repeated
// silhouette. Requested at 160w: the avatars render at lg, and a stacked group
// is the one place an oversized source would be paid for three times over.
const CREW = [
  'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=160&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1447433909565-04bfc496fe73?q=80&w=160&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1768005419000-d53e45851b50?q=80&w=160&auto=format&fit=crop',
]

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
    {
      label: 'Avatar Group',
      props: {},
      children: (
        <>
          <EmptyStateMedia>
            <div className="flex [&>*+*]:-ml-[var(--andromeda-2)]">
              <Avatar name="Mira Voss" src={CREW[0]} size="lg" />
              <Avatar name="Kai Ortiz" src={CREW[1]} size="lg" />
              <Avatar name="June Park" src={CREW[2]} size="lg" />
            </div>
          </EmptyStateMedia>
          <EmptyStateTitle>No crew linked</EmptyStateTitle>
          <EmptyStateDescription>
            The relay team is standing by for its next deep-space assignment.
          </EmptyStateDescription>
        </>
      ),
    },
  ],
  states: [],
}
