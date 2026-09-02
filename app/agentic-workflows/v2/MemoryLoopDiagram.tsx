import {
  ApprovalGate,
  DiagramFrame,
  DiagramLegend,
  EdgeLabel,
  Flow,
  LINE,
  MUTED,
  NodeCard,
  ArrowHead,
  DELEGATED,
} from './DiagramPrimitives'

// Ring geometry. The loop runs clockwise from the top: you work, notes get
// written, the next prompt pulls them back.
const CX = 170
const CY = 170
const R = 95
const CIRCUMFERENCE = 2 * Math.PI * R

// A short olive dash travels the ring to show the loop is always turning.
// Held still for anyone who asked their system to reduce motion.
const RING_MOTION = `
@keyframes aicV2RingTravel {
  to { stroke-dashoffset: ${-CIRCUMFERENCE}; }
}
.aic-v2-ring-travel {
  animation: aicV2RingTravel 7s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .aic-v2-ring-travel { animation: none; }
}
`

export function MemoryLoopDiagram() {
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: RING_MOTION }} />
      <DiagramFrame
        minWidth={760}
        label="A loop where you work, notes get written, and the next prompt recalls them. A separate branch runs the librarian, which proposes changes for you to approve before anything is applied."
      >
        <svg viewBox="0 0 800 350" className="h-auto w-full">
          {/* ── The loop itself ── */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            strokeWidth={1.25}
            className={LINE}
          />
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={`26 ${CIRCUMFERENCE - 26}`}
            className={`${DELEGATED} aic-v2-ring-travel`}
          />
          <ArrowHead x={252.3} y={122.5} angle={60} className="fill-sand-400 dark:fill-sand-600" />
          <ArrowHead x={170} y={265} angle={180} className="fill-sand-400 dark:fill-sand-600" />
          <ArrowHead x={87.7} y={122.5} angle={-60} className="fill-sand-400 dark:fill-sand-600" />

          <text
            x={CX}
            y={CY + 4}
            textAnchor="middle"
            fontSize={10.5}
            fontWeight={700}
            letterSpacing={1.4}
            className={MUTED}
          >
            AUTOMATIC
          </text>

          <NodeCard x={112} y={56} w={116} h={38} lines={['You work']} />
          <NodeCard
            x={194}
            y={198}
            w={116}
            h={38}
            lines={['Notes written']}
            tone="olive"
          />
          <NodeCard
            x={30}
            y={198}
            w={116}
            h={38}
            lines={['Recall', 'next prompt']}
            tone="olive"
            size={11}
          />

          {/* ── The branch you trigger ── */}
          <Flow
            d="M 230 75 L 372 75"
            dashed
            head={{ x: 376, y: 75 }}
          />
          <NodeCard
            x={380}
            y={56}
            w={200}
            h={38}
            lines={['/memoryhd:librarian']}
            mono
            size={11.5}
          />
          <Flow d="M 480 94 L 480 118" dashed head={{ x: 480, y: 122, angle: 90 }} />
          <NodeCard
            x={380}
            y={122}
            w={200}
            h={38}
            lines={['Librarian agent']}
            tone="olive"
          />
          <Flow d="M 480 160 L 480 184" head={{ x: 480, y: 188, angle: 90 }} />
          <NodeCard x={380} y={188} w={200} h={38} lines={['Proposes changes']} />
          <Flow d="M 480 226 L 480 250" head={{ x: 480, y: 254, angle: 90 }} />

          <ApprovalGate x={380} y={254} w={200} h={44} label="You approve" />

          {/* Forward when approved, back around when it needs changes. */}
          <Flow d="M 580 276 L 610 276" head={{ x: 614, y: 276 }} />
          <EdgeLabel x={597} y={266} text="approved" />
          <NodeCard x={618} y={257} w={108} h={38} lines={['Applied']} />

          <Flow
            d="M 480 298 C 430 330 344 328 344 250 L 344 207 L 372 207"
            head={{ x: 376, y: 207 }}
          />
          <EdgeLabel x={336} y={262} text="changes" anchor="end" />
        </svg>
      </DiagramFrame>
      <DiagramLegend
        items={[
          { kind: 'solid', text: 'happens every time' },
          { kind: 'dashed', text: 'delegated work' },
          { kind: 'gate', text: 'you decide' },
        ]}
      />
    </div>
  )
}
