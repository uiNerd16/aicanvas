import {
  DiagramFrame,
  DiagramLegend,
  Flow,
  MUTED,
  NodeCard,
} from './DiagramPrimitives'

// The container diagram from the detail pages, flattened into one row: a
// plugin is a bundle of parts, and installing it hands all of them to Claude
// Code at once. Each plugin here uses the parts it needs.
export function BundleStrip() {
  return (
    <div>
      <DiagramFrame
        minWidth={700}
        label="A plugin is a bundle: a skill carrying policy, an MCP server holding tools, hooks that fire on their own, and commands you run. Installing it hands all of them to Claude Code at once."
      >
        <svg viewBox="0 0 790 140" className="h-auto w-full">
          <rect
            x={190}
            y={24}
            width={578}
            height={92}
            rx={14}
            fill="none"
            strokeWidth={1.25}
            strokeDasharray="6 5"
            className="stroke-sand-400 dark:stroke-sand-600"
          />
          <text x={190} y={16} fontSize={10.5} fontWeight={700} letterSpacing={1.2} className={MUTED}>
            PLUGIN
          </text>

          <NodeCard x={206} y={48} w={132} h={44} lines={['Skill', 'policy']} tone="olive" size={11} />
          <NodeCard x={348} y={48} w={132} h={44} lines={['MCP server', 'tools']} size={11} />
          <NodeCard x={490} y={48} w={132} h={44} lines={['Hooks', 'automatic']} tone="olive" size={11} />
          <NodeCard x={632} y={48} w={120} h={44} lines={['Commands', 'you run']} size={11} />

          <Flow d="M 186 70 L 150 70" head={{ x: 146, y: 70, angle: 180 }} />
          <NodeCard x={16} y={48} w={126} h={44} lines={['Claude Code']} tone="olive" size={11.5} />
        </svg>
      </DiagramFrame>
      <DiagramLegend
        items={[
          { kind: 'solid', text: 'one install, every part' },
          { kind: 'boundary', text: 'the plugin boundary' },
        ]}
      />
    </div>
  )
}
