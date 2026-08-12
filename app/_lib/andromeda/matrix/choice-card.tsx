// @ts-nocheck — this spec AUTHORS JSX against untyped design-system
// components. Data-only specs in this directory need no such line.
'use client'

import { useState } from 'react'
import {
  ChoiceCard,
  ChoiceCardGroup,
} from '../../../../design-systems/andromeda/components/ChoiceCard'
import { CONTROL_STATES, type MatrixSpec } from './types'

function LiveRadioChoiceCards() {
  const [value, setValue] = useState('autonomous')

  return (
    // Two columns: a choice group is a comparison, and side by side is how
    // two options get compared. One short line each keeps the pair scannable
    // at a glance instead of turning the row into a paragraph.
    <ChoiceCardGroup
      aria-label="Flight control mode"
      value={value}
      onValueChange={setValue}
      className="grid grid-cols-2 gap-[var(--andromeda-3)]"
    >
      <ChoiceCard
        control="radio"
        value="autonomous"
        title="Autonomous flight"
        description="Applies approved vectors."
      />
      <ChoiceCard
        control="radio"
        value="crew"
        title="Crew-directed flight"
        description="Crew confirms each vector."
      />
    </ChoiceCardGroup>
  )
}

export const choiceCard: MatrixSpec = {
  slug: 'choice-card',
  Component: ChoiceCard,
  sizes: ['md', 'lg'],
  wide: true,
  baseProps: {
    control: 'checkbox',
    title: 'Retain telemetry',
    description: 'Archive the sensor stream.',
  },
  variants: [
    { label: 'Radio group', node: <LiveRadioChoiceCards /> },
    { label: 'Checkbox', props: {} },
    {
      label: 'Toggle',
      props: {
        control: 'toggle',
        title: 'Beacon uplink',
        description: 'Transmit status to the relay.',
        defaultChecked: true,
      },
    },
  ],
  states: [
    ...CONTROL_STATES,
    { label: 'Selected', props: { defaultChecked: true } },
    {
      label: 'Selected hover',
      props: { defaultChecked: true },
      force: 'hover',
    },
    {
      label: 'Disabled selected',
      props: { disabled: true, defaultChecked: true },
    },
  ],
}
