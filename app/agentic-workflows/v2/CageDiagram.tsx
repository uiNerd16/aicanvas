import {
  ApprovalGate,
  ArrowHead,
  DiagramFrame,
  DiagramLegend,
  EdgeLabel,
  Flow,
  LABEL,
  MUTED,
  NEUTRAL_SURFACE,
  NodeCard,
  ToolChip,
} from './DiagramPrimitives'

export function CageDiagram() {
  return (
    <div>
      <DiagramFrame
        minWidth={760}
        label="One plugin holds a skill that carries the policy and an MCP server that holds the cage. It gives Claude two tools: gpt_ask reads only, and gpt_run writes inside a sandbox and comes back as a diff you review before anything is kept."
      >
        <svg viewBox="0 0 800 430" className="h-auto w-full">
          {/* ── The bundle, and the one arrow out of it ── */}
          <NodeCard x={20} y={40} w={120} h={44} lines={['Claude']} tone="olive" />
          <Flow d="M 196 62 L 150 62" head={{ x: 146, y: 62, angle: 180 }} />

          <rect
            x={200}
            y={22}
            width={400}
            height={82}
            rx={14}
            fill="none"
            strokeWidth={1.25}
            strokeDasharray="6 5"
            className="stroke-sand-400 dark:stroke-sand-600"
          />
          <text x={200} y={14} fontSize={10.5} fontWeight={700} letterSpacing={1.2} className={MUTED}>
            PLUGIN
          </text>

          <NodeCard x={216} y={42} w={164} h={44} lines={['Skill', 'policy']} tone="olive" size={11} />
          <Flow d="M 380 64 L 414 64" head={{ x: 418, y: 64 }} />
          <NodeCard x={420} y={42} w={164} h={44} lines={['MCP server', 'cage']} size={11} />

          {/* ── Two lanes out of the cage ── */}
          <path
            d="M 502 86 L 502 122"
            fill="none"
            strokeWidth={1.25}
            className="stroke-sand-400 dark:stroke-sand-600"
          />
          <path
            d="M 502 122 C 470 150 330 138 230 148"
            fill="none"
            strokeWidth={1.25}
            className="stroke-sand-400 dark:stroke-sand-600"
          />
          <ArrowHead x={230} y={152} angle={90} />
          <Flow d="M 502 122 C 522 140 536 140 555 148" head={{ x: 555, y: 152, angle: 90 }} />

          <ToolChip cx={230} cy={190} r={38} label="gpt_ask" caption="read only" />
          <ToolChip cx={555} cy={190} r={38} label="gpt_run" caption="workspace write" />

          {/* Read lane ends where it started: an answer, nothing written. */}
          <Flow d="M 230 228 L 230 258" head={{ x: 230, y: 262, angle: 90 }} />
          <NodeCard x={160} y={262} w={140} h={44} lines={['Answer back']} />

          {/* Write lane runs through the sandbox, then past you. */}
          <Flow d="M 555 228 L 555 258" head={{ x: 555, y: 262, angle: 90 }} />
          <rect
            x={440}
            y={262}
            width={230}
            height={44}
            rx={12}
            strokeWidth={1.25}
            className={NEUTRAL_SURFACE}
          />
          <text
            x={555}
            y={288}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            className={LABEL}
          >
            Sandbox
          </text>
          <Flow d="M 555 306 L 555 330" head={{ x: 555, y: 334, angle: 90 }} />

          <ApprovalGate x={440} y={334} w={230} h={48} label="You review the diff" />

          <Flow d="M 670 358 L 706 358" head={{ x: 710, y: 358 }} />
          <EdgeLabel x={688} y={348} text="approved" />
          <NodeCard x={714} y={340} w={76} h={36} lines={['Kept']} size={11.5} />

          <Flow
            d="M 440 358 C 398 358 386 322 386 250 C 386 210 452 190 513 190"
            head={{ x: 517, y: 190 }}
          />
          <EdgeLabel x={378} y={300} text="changes" anchor="end" />
        </svg>
      </DiagramFrame>
      <DiagramLegend
        items={[
          { kind: 'solid', text: 'happens every time' },
          { kind: 'boundary', text: 'a boundary, not a step' },
          { kind: 'gate', text: 'you decide' },
        ]}
      />
    </div>
  )
}
