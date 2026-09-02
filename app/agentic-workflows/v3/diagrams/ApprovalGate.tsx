import { ArrowDefs, EdgeLabel, Flow, NodeCard } from './parts'

const M = 'aic-v3-gate-arrow'

/**
 * The pattern both products end in. Work flows left to right, the gate in the
 * middle has exactly two exits, and only one of them moves forward.
 */
export function ApprovalGate() {
  return (
    <svg
      viewBox="0 0 1020 300"
      className="h-auto w-full min-w-[780px]"
      role="img"
      aria-label="A brief goes to an agent, the agent produces a diff, and the diff reaches a decision step. Approved work ships. Requested changes loop back to the agent."
    >
      <ArrowDefs id={M} />

      <Flow d="M180,138 H230" markerId={M} />
      <Flow d="M400,138 H450" markerId={M} />
      <Flow d="M580,138 H630" markerId={M} />
      <Flow d="M800,138 H870" markerId={M} />
      <EdgeLabel x={835} y={128}>
        approved
      </EdgeLabel>

      <Flow d="M715,184 V250 H315 V176" dashed markerId={M} />
      <EdgeLabel x={515} y={242}>
        changes
      </EdgeLabel>

      <NodeCard x={30} y={100} w={150} h={76} title="Brief" />
      <NodeCard
        x={230}
        y={100}
        w={170}
        h={76}
        title="Agent works"
        tone="agent"
      />
      <NodeCard x={450} y={100} w={130} h={76} title="Diff" />
      <NodeCard
        x={630}
        y={92}
        w={170}
        h={92}
        title="You decide"
        sub="nothing is silent"
        tone="human"
      />
      <NodeCard x={870} y={100} w={120} h={76} title="Shipped" />
    </svg>
  )
}
