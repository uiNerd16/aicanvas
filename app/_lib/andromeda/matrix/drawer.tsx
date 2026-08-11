// @ts-nocheck — this spec AUTHORS JSX against untyped design-system
// components. Data-only specs in this directory need no such line.
'use client'

import { useState } from 'react'
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
} from '../../../../design-systems/andromeda/components/Drawer'
import { Button } from '../../../../design-systems/andromeda/components/Button'
import { Input } from '../../../../design-systems/andromeda/components/Input'
import { Toggle } from '../../../../design-systems/andromeda/components/Toggle'
import type { MatrixSpec } from './types'

// The one component whose open state cannot be a static cell: an open drawer is
// a full-viewport portal, so a pair of them pinned open would bury the page. Each
// case is therefore its own trigger — the honest inline representation, and the
// only one that lets the reviewer see both sides without leaving the page.
function DrawerCase({ side }: { side: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Open {side}
      </Button>
      <Drawer open={open} onOpenChange={setOpen} side={side} size={420}>
        <DrawerHeader>
          <DrawerTitle>System parameters</DrawerTitle>
          <DrawerDescription>Configure flight envelope</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Callsign" placeholder="ENTER CALLSIGN" />
            <Toggle label="Autopilot" defaultChecked />
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => setOpen(false)}>
            Engage
          </Button>
        </DrawerFooter>
      </Drawer>
    </>
  )
}

export const drawer: MatrixSpec = {
  slug: 'drawer',
  sizes: null,
  render: (_size, props) => <DrawerCase side={props.side} />,
  variants: [
    { label: 'Right', props: { side: 'right' } },
    { label: 'Left', props: { side: 'left' } },
  ],
  states: [],
  gaps: {
    Open: 'the panel renders through a portal behind a mount gate, so it exists only in the browser and only over the whole viewport — each cell above opens the real thing',
  },
}
