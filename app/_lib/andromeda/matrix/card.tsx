// @ts-nocheck — this spec AUTHORS JSX against untyped design-system
// components. Data-only specs in this directory need no such line.
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '../../../../design-systems/andromeda/components/Card'
import { Badge } from '../../../../design-systems/andromeda/components/Badge'
import { Button } from '../../../../design-systems/andromeda/components/Button'
import type { MatrixSpec } from './types'

const body = (title: string, description: string, badge: string, badgeVariant: string) => (
  <>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <Badge variant={badgeVariant}>{badge}</Badge>
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>
    </CardContent>
    <CardFooter>
      <Button size="sm" variant="outline">
        Configure
      </Button>
    </CardFooter>
  </>
)

export const card: MatrixSpec = {
  slug: 'card',
  Component: Card,
  sizes: null,
  wide: true,
  variants: [
    {
      label: 'Default',
      props: {},
      children: body('Default card', 'Corner brackets are the frame — no perimeter stroke.', 'Idle', 'default'),
    },
    {
      label: 'Glow',
      props: { variant: 'glow' },
      children: body('Highlight card', 'Tinted accent gradient surface with an accent border.', 'Live', 'accent'),
    },
    {
      // bordered and markers are independent booleans, not members of the cva
      // variant axis, so they are their own cases rather than variant values.
      label: 'Bordered',
      props: { bordered: true },
      children: body('Bordered card', 'A continuous 1px border instead of the bracket frame.', 'Idle', 'default'),
    },
    {
      label: 'No markers',
      props: { markers: false },
      children: body('Unframed card', 'Markers off — for a card nested inside another frame.', 'Idle', 'default'),
    },
  ],
  // A card is a surface, not a control: no hover, focus or pressed treatment
  // exists in the source to force.
  states: [],
}
