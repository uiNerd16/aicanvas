import { User } from '@phosphor-icons/react/dist/ssr'

// ─── Diagram primitives ──────────────────────────────────────────────────────
// One drawing vocabulary shared by every diagram on these pages, so a reader
// who learns it once can read all three:
//
//   rounded rect .......... a step, an agent, or a piece of the bundle
//   circle ................ a tool or a file
//   solid thin arrow ...... fixed flow, always happens
//   dashed stroke ......... delegated or dynamic work
//   dashed card + person .. the point where you decide
//
// Colour carries role: olive for something the machine does on its own, sand
// neutrals for artifacts and boundaries, and the approval card stands apart.

export const NEUTRAL_SURFACE =
  'fill-sand-50 stroke-sand-300 dark:fill-sand-800 dark:stroke-sand-700'
export const OLIVE_SURFACE =
  'fill-olive-500/15 stroke-olive-500 dark:fill-olive-400/15 dark:stroke-olive-400'
export const LINE = 'stroke-sand-400 dark:stroke-sand-600'
export const LINE_FILL = 'fill-sand-400 dark:fill-sand-600'
export const DELEGATED = 'stroke-olive-500 dark:stroke-olive-400'
export const DELEGATED_FILL = 'fill-olive-500 dark:fill-olive-400'
export const GATE_LINE = 'stroke-sand-500 dark:stroke-sand-400'
export const LABEL = 'fill-sand-900 dark:fill-sand-50'
export const MUTED = 'fill-sand-500 dark:fill-sand-400'

type Tone = 'neutral' | 'olive'

function Lines({
  cx,
  cy,
  lines,
  mono,
  size = 12,
}: {
  cx: number
  cy: number
  lines: string[]
  mono?: boolean
  size?: number
}) {
  const step = size + 3
  const start = cy - ((lines.length - 1) * step) / 2 + size / 3
  return (
    <>
      {lines.map((line, i) => (
        <text
          key={line}
          x={cx}
          y={start + i * step}
          textAnchor="middle"
          fontSize={size}
          fontWeight={600}
          className={LABEL}
          style={mono ? { fontFamily: 'var(--font-mono, monospace)' } : undefined}
        >
          {line}
        </text>
      ))}
    </>
  )
}

export function NodeCard({
  x,
  y,
  w,
  h,
  lines,
  tone = 'neutral',
  mono,
  size,
}: {
  x: number
  y: number
  w: number
  h: number
  lines: string[]
  tone?: Tone
  mono?: boolean
  size?: number
}) {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        strokeWidth={1.25}
        className={tone === 'olive' ? OLIVE_SURFACE : NEUTRAL_SURFACE}
      />
      <Lines cx={x + w / 2} cy={y + h / 2} lines={lines} mono={mono} size={size} />
    </>
  )
}

export function ToolChip({
  cx,
  cy,
  r,
  label,
  caption,
}: {
  cx: number
  cy: number
  r: number
  label: string
  caption?: string
}) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} strokeWidth={1.25} className={OLIVE_SURFACE} />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontSize={11.5}
        fontWeight={600}
        className={LABEL}
        style={{ fontFamily: 'var(--font-mono, monospace)' }}
      >
        {label}
      </text>
      {caption ? (
        <text
          x={cx}
          y={cy + r + 18}
          textAnchor="middle"
          fontSize={10.5}
          fontWeight={600}
          className={MUTED}
        >
          {caption}
        </text>
      ) : null}
    </>
  )
}

export function ArrowHead({
  x,
  y,
  angle = 0,
  className = LINE_FILL,
}: {
  x: number
  y: number
  angle?: number
  className?: string
}) {
  return (
    <path
      d="M -5.5 -4 L 5 0 L -5.5 4 Z"
      transform={`translate(${x} ${y}) rotate(${angle})`}
      className={className}
    />
  )
}

export function Flow({
  d,
  dashed,
  head,
}: {
  d: string
  dashed?: boolean
  head: { x: number; y: number; angle?: number }
}) {
  return (
    <>
      <path
        d={d}
        fill="none"
        strokeWidth={1.25}
        strokeDasharray={dashed ? '5 5' : undefined}
        className={dashed ? DELEGATED : LINE}
      />
      <ArrowHead
        x={head.x}
        y={head.y}
        angle={head.angle}
        className={dashed ? DELEGATED_FILL : LINE_FILL}
      />
    </>
  )
}

// The one card in every diagram where a person decides. Dashed outline, a
// person mark, and two labelled ways out: forward when approved, back when it
// needs changes.
export function ApprovalGate({
  x,
  y,
  w,
  h,
  label,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
}) {
  const cy = y + h / 2
  const textWidth = label.length * 6.4
  const iconX = x + (w - (26 + textWidth)) / 2
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill="none"
        strokeWidth={1.25}
        strokeDasharray="5 4"
        className={GATE_LINE}
      />
      <User
        weight="regular"
        x={iconX}
        y={cy - 9}
        width={18}
        height={18}
        className="fill-sand-600 dark:fill-sand-300"
      />
      <text
        x={iconX + 26}
        y={cy + 5}
        fontSize={12}
        fontWeight={700}
        className={LABEL}
      >
        {label}
      </text>
    </>
  )
}

export function EdgeLabel({
  x,
  y,
  text,
  anchor = 'middle',
}: {
  x: number
  y: number
  text: string
  anchor?: 'start' | 'middle' | 'end'
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={10.5}
      fontWeight={600}
      className={MUTED}
    >
      {text}
    </text>
  )
}

// Horizontal scroller so a wide diagram never pushes the page sideways.
export function DiagramFrame({
  minWidth,
  label,
  children,
}: {
  minWidth: number
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-sand-300 bg-sand-100 p-4 sm:p-6 dark:border-sand-800 dark:bg-sand-900">
      <div style={{ minWidth }} role="img" aria-label={label}>
        {children}
      </div>
    </div>
  )
}

export function DiagramLegend({
  items,
}: {
  items: { kind: 'solid' | 'dashed' | 'boundary' | 'gate'; text: string }[]
}) {
  return (
    <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-sand-500 dark:text-sand-400">
      {items.map((item) => (
        <li key={item.text} className="flex items-center gap-2">
          {item.kind === 'gate' ? (
            <span className="inline-block h-3.5 w-6 rounded border border-dashed border-sand-500 dark:border-sand-400" />
          ) : (
            <svg width="24" height="8" aria-hidden viewBox="0 0 24 8">
              <path
                d="M 0 4 L 24 4"
                fill="none"
                strokeWidth={1.5}
                strokeDasharray={item.kind === 'solid' ? undefined : '5 5'}
                className={item.kind === 'dashed' ? DELEGATED : LINE}
              />
            </svg>
          )}
          {item.text}
        </li>
      ))}
    </ul>
  )
}
