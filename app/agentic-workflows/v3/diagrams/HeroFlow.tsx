import {
  ArrowDefs,
  EdgeLabel,
  Flow,
  Frame,
  NodeCard,
  TravelPath,
} from './parts'

const M = 'aic-v3-hero-arrow'

/**
 * The whole workflow on one line: you brief your agent, the agent leans on a
 * memory loop above and a caged second builder below, and both converge on the
 * one place you decide. The pulse travels the fixed spine only.
 */
export function HeroFlow() {
  return (
    <svg
      viewBox="0 0 1040 364"
      className="h-auto w-full min-w-[860px]"
      role="img"
      aria-label="You brief Claude. Claude writes notes and recalls them on the next prompt, and delegates larger builds to a second model inside a sandbox. Both lanes reach your review, which either ships the work or sends changes back."
    >
      <ArrowDefs id={M} />

      {/* ── The spine: the path your work actually travels ── */}
      <Flow d="M108,176 H156" markerId={M} />
      <Flow d="M296,176 H690" markerId={M} />
      <Flow d="M840,176 H920" markerId={M} />
      <TravelPath d="M108,176 H920" length={812} duration={7} />
      <EdgeLabel x={493} y={166}>
        your work
      </EdgeLabel>
      <EdgeLabel x={880} y={166}>
        approved
      </EdgeLabel>

      {/* ── Memory loop, above ── */}
      <Flow d="M282,142 V100 H416 V96" dashed markerId={M} />
      <Flow d="M476,68 H536" markerId={M} />
      <Flow d="M596,40 V20 H196 V142" dashed markerId={M} />
      <EdgeLabel x={334} y={92}>
        writes
      </EdgeLabel>
      <EdgeLabel x={396} y={14}>
        recalls on the next prompt
      </EdgeLabel>

      {/* ── Delegated build, below ── */}
      <Flow d="M262,210 V226 H424 V260" dashed markerId={M} />
      <Flow d="M480,286 H520" markerId={M} />
      <Flow d="M632,286 H700 V215" dashed markerId={M} />
      <EdgeLabel x={326} y={220}>
        delegates
      </EdgeLabel>
      <Frame
        x={344}
        y={232}
        w={316}
        h={96}
        label="Sandbox"
        note="no network, no git"
      />

      {/* ── Back around: what you send back ── */}
      <Flow d="M765,215 V348 H190 V210" dashed markerId={M} />
      <EdgeLabel x={470} y={340}>
        changes
      </EdgeLabel>

      {/* ── Nodes ── */}
      <NodeCard x={16} y={150} w={92} h={52} title="You" />
      <NodeCard
        x={156}
        y={142}
        w={140}
        h={68}
        title="Claude"
        sub="your agent"
        tone="agent"
      />
      <NodeCard x={356} y={40} w={120} h={56} title="Notes" />
      <NodeCard x={536} y={40} w={120} h={56} title="Recall" tone="agent" />
      <NodeCard x={368} y={260} w={112} h={52} title="GPT" tone="agent" />
      <NodeCard x={520} y={260} w={112} h={52} title="Diff" />
      <NodeCard
        x={690}
        y={137}
        w={150}
        h={78}
        title="Your review"
        tone="human"
      />
      <NodeCard x={920} y={150} w={104} h={52} title="Shipped" />
    </svg>
  )
}
