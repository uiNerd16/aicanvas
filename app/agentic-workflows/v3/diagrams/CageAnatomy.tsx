import { ArrowDefs, EdgeLabel, Flow, Frame, NodeCard } from './parts'

const M = 'aic-v3-cage-arrow'

/**
 * The cage, opened up: one plugin holding the policy and the server that
 * enforces it, and the two lanes it hands your agent. The read lane ends in an
 * answer. The write lane ends at you.
 */
export function CageAnatomy() {
  return (
    <svg
      viewBox="0 0 1080 460"
      className="h-auto w-full min-w-[900px]"
      role="img"
      aria-label="A plugin containing a skill for policy and an MCP server that is the cage, giving Claude two tools. The gpt_ask lane only reads. The gpt_run lane writes inside a sandbox with no network and no git, produces a diff, and reaches you for review before anything is applied."
    >
      <ArrowDefs id={M} />

      {/* ── The plugin, and what it hands your agent ── */}
      <Frame x={40} y={20} w={430} h={136} label="Plugin" />
      <Flow d="M470,92 H610" markerId={M} />
      <EdgeLabel x={540} y={84}>
        two tools
      </EdgeLabel>

      {/* ── Bus down into the two lanes ── */}
      <Flow d="M690,132 V166 H60 V350" arrow={false} dashed markerId={M} />
      <Flow d="M60,218 H100" dashed markerId={M} />
      <Flow d="M60,350 H100" dashed markerId={M} />

      {/* ── Read lane ── */}
      <text
        x={100}
        y={180}
        className="fill-sand-500 text-[11px] font-semibold tracking-[0.14em] uppercase"
      >
        Read lane
      </text>
      <Flow d="M250,218 H300" markerId={M} />
      <Flow d="M440,218 H490" markerId={M} />
      <text x={660} y={222} className="fill-sand-500 text-[11px]">
        nothing on disk changes
      </text>

      {/* ── Write lane ── */}
      <text
        x={100}
        y={312}
        className="fill-sand-500 text-[11px] font-semibold tracking-[0.14em] uppercase"
      >
        Write lane
      </text>
      <Flow d="M240,350 H284" markerId={M} />
      <Frame
        x={284}
        y={290}
        w={286}
        h={120}
        label="Sandbox"
        note="no network, no git"
      />
      <Flow d="M570,350 H600" markerId={M} />
      <Flow d="M704,350 H740" markerId={M} />
      <Flow d="M890,350 H950" markerId={M} />
      <EdgeLabel x={920} y={342}>
        approved
      </EdgeLabel>
      <Flow d="M815,388 V430 H170 V378" dashed markerId={M} />
      <EdgeLabel x={480} y={424}>
        changes
      </EdgeLabel>

      {/* ── Nodes ── */}
      <NodeCard
        x={62}
        y={62}
        w={186}
        h={72}
        title="Skill"
        sub="the policy"
        tone="agent"
      />
      <NodeCard
        x={266}
        y={62}
        w={186}
        h={72}
        title="MCP server"
        sub="the cage"
      />
      <NodeCard
        x={610}
        y={52}
        w={160}
        h={80}
        title="Claude"
        sub="your agent"
        tone="agent"
      />

      <NodeCard
        x={100}
        y={190}
        w={150}
        h={56}
        title="gpt_ask"
        tone="agent"
      />
      <NodeCard x={300} y={190} w={140} h={56} title="Reads" />
      <NodeCard x={490} y={190} w={140} h={56} title="Answer" />

      <NodeCard
        x={100}
        y={322}
        w={140}
        h={56}
        title="gpt_run"
        tone="agent"
      />
      <NodeCard
        x={310}
        y={322}
        w={234}
        h={56}
        title="GPT builds"
        tone="agent"
      />
      <NodeCard x={600} y={322} w={104} h={56} title="Diff" />
      <NodeCard
        x={740}
        y={312}
        w={150}
        h={76}
        title="You review"
        tone="human"
      />
      <NodeCard x={950} y={322} w={104} h={56} title="Applied" />
    </svg>
  )
}
