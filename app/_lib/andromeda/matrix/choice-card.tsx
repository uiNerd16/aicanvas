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
    <ChoiceCardGroup
      aria-label="Flight control mode"
      value={value}
      onValueChange={setValue}
    >
      <ChoiceCard
        control="radio"
        value="autonomous"
        title="Autonomous flight"
        description="Guidance applies approved vectors as telemetry arrives."
      />
      <ChoiceCard
        control="radio"
        value="crew"
        title="Crew-directed flight"
        description="Flight crew confirms each vector before execution."
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
    description: "Archive this flight's sensor stream after debrief.",
  },
  variants: [
    { label: 'Radio group', node: <LiveRadioChoiceCards /> },
    { label: 'Checkbox', props: {} },
    {
      label: 'Toggle',
      props: {
        control: 'toggle',
        title: 'Beacon uplink',
        description: 'Transmit vessel status through the deep-space relay.',
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
