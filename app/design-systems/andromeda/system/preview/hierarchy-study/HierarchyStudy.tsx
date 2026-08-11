// @ts-nocheck — renders JSX design-system components whose forwardRef wrappers
// carry no TypeScript prop types.
'use client'

// Button vs Tag vs Badge: does the family have a hierarchy?
//
// All three are rendered at the SAME size on purpose. Their defaults differ
// (Button md, Tag and Badge sm), which is the only reason they usually look
// distinct on a page — and a default is not a rule, so any composition that
// sets sizes explicitly collapses the distinction. Matching them is what makes
// the question visible.
//
// Every candidate is the REAL component plus a className. Nothing here edits
// Button.tsx, Tag.tsx or Badge.tsx; this is a decision aid.
//
// Class strings are written out in full — Tailwind scans source TEXT, so a class
// assembled by interpolation never compiles.
import { Button } from '../../../../../../design-systems/andromeda/components/Button'
import { Tag } from '../../../../../../design-systems/andromeda/components/Tag'
import { Badge } from '../../../../../../design-systems/andromeda/components/Badge'
import { andromedaVars } from '../../../../../../design-systems/andromeda/components/lib/utils'
import { tokens } from '../../../../../../design-systems/andromeda/tokens'

const noop = () => {}

type Treatment = {
  id: string
  name: string
  note: string
  button: string
  tag: string
  badge: string
}

// The neutral tint, used wherever the grid shows a label with no tone.
const NEUTRAL_ALPHA = 'bg-[rgba(255,255,255,0.10)] text-[#F5F5F5]'

// control ladder md = 32px. The off-ladder rows drop labels to 24px, which is
// below every rung, so a label can never line up with a field or a button again.
const TREATMENTS: Treatment[] = [
  {
    id: 'current',
    name: '01 · Current',
    note: 'What ships today, at one size. Same height, same mono uppercase at the same tracking and weight, same square frame — the only separation is a 4px padding step, and on the page it is really just the differing size defaults.',
    button: '',
    tag: '',
    badge: '',
  },
  {
    id: 'proposed',
    name: '02 · Proposed, text.primary on accent-300',
    note: 'The label asked for: text.primary #F5F5F5. On the accent-300 fill it measures 1.82:1 against the fill — below every threshold, and below the 3:1 floor for large text too. Shown because it is the treatment as asked; the row underneath is the same label on a fill that carries it.',
    button:
      'bg-[#0FCFB2] hover:bg-[#56F0D6] active:bg-[#109380] text-[#F5F5F5] hover:text-[#F5F5F5]',
    tag: `h-[24px] px-[8px] text-[10px] font-normal ${NEUTRAL_ALPHA}`,
    badge: `h-[24px] px-[8px] text-[10px] font-normal ${NEUTRAL_ALPHA}`,
  },
  {
    id: 'proposed-deep',
    name: '03 · Proposed, text.primary on accent-500',
    note: 'Same label, deeper fill: 6.77:1, clears AA for body text with room to spare. This is the only accent fill that carries text.primary. For reference, what ships today is accent-on on accent-400 at 3.22:1, which does not.',
    button:
      'bg-[#126059] hover:bg-[#109380] active:bg-[#126059] text-[#F5F5F5] hover:text-[#F5F5F5]',
    tag: `h-[24px] px-[8px] text-[10px] font-normal ${NEUTRAL_ALPHA}`,
    badge: `h-[24px] px-[8px] text-[10px] font-normal ${NEUTRAL_ALPHA}`,
  },
]

// The four meanings a label carries. There is no success/positive token in this
// system: accent doubles as the positive reading, which is worth deciding on its
// own — accent is otherwise "the measurement in focus", not "good".
//
// In the proposal the fills are the family ALPHA tokens instead of the solid
// -500 stops: one translucent tint per family is already sanctioned (each family
// carries exactly one), and a tint over the surface is what separates a label
// from a filled control without touching shape. The label takes the family's
// bright stop, because a light foreground on a 25% tint over surface.base is the
// only pairing that holds contrast — accent-on and friends are tuned for the
// SOLID fill and go muddy on a tint.
const TONES = [
  { label: 'Neutral', variant: 'default', alpha: 'bg-[rgba(255,255,255,0.10)] text-[#F5F5F5]' },
  { label: 'Positive', variant: 'accent', alpha: 'bg-[rgba(15,207,178,0.25)] text-[#BAF8EC]' },
  { label: 'Warning', variant: 'warning', alpha: 'bg-[rgba(255,160,0,0.25)] text-[#FFE5B5]' },
  { label: 'Fault', variant: 'fault', alpha: 'bg-[rgba(255,57,57,0.25)] text-[#FFCFCF]' },
]


const STATES = [
  { label: 'Rest', force: undefined },
  { label: 'Hover', force: 'hover' },
  { label: 'Focus', force: 'focus' },
  { label: 'Pressed', force: 'active' },
  { label: 'Disabled', force: undefined, disabled: true },
]

const caption = {
  fontFamily: tokens.typography.fontMono,
  fontSize: tokens.typography.size.xs,
  color: tokens.color.text.faint,
  textTransform: 'uppercase' as const,
  letterSpacing: tokens.typography.tracking.wider,
}

const rowLabel = {
  ...caption,
  color: tokens.color.text.secondary,
  whiteSpace: 'nowrap' as const,
}

// Badge and Tag take no `disabled` prop — they are not controls. The cell says
// so rather than rendering a copy of Rest and letting it read as a bug.
function NotApplicable() {
  return <span style={{ ...caption, color: tokens.color.text.faint }}>n/a</span>
}

function Cell({ children }: { children: React.ReactNode }) {
  return <span style={{ display: 'inline-flex' }}>{children}</span>
}

export function HierarchyStudy() {
  return (
    <div
      data-andromeda-matrix
      style={{
        ...andromedaVars(),
        minHeight: '100vh',
        boxSizing: 'border-box',
        background: tokens.color.surface.base,
        padding: `${tokens.spacing[10]} ${tokens.spacing[8]}`,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1
          style={{
            margin: 0,
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size['3xl'],
            color: tokens.color.text.primary,
            letterSpacing: tokens.typography.tracking.wide,
          }}
        >
          Button · Tag · Badge — hierarchy
        </h1>
        <p
          style={{
            marginTop: tokens.spacing[3],
            marginBottom: tokens.spacing[8],
            maxWidth: '72ch',
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.md,
            color: tokens.color.text.secondary,
            lineHeight: tokens.typography.lineHeight.relaxed,
          }}
        >
          All three at md, so the comparison is like-for-like. Read the Rest column first: that is
          the hierarchy question. The state columns answer a second one — Badge declares no
          interaction rules at all, so its row is flat by design, and that flatness is itself an
          argument for making it look like a label.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[5] }}>
          {TREATMENTS.map((t) => (
            <section
              key={t.id}
              style={{
                background: tokens.color.surface.raised,
                border: `1px solid ${tokens.color.border.subtle}`,
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  padding: `${tokens.spacing[3]} ${tokens.spacing[5]}`,
                  borderBottom: `1px solid ${tokens.color.border.subtle}`,
                }}
              >
                <div
                  style={{
                    fontFamily: tokens.typography.fontMono,
                    fontSize: tokens.typography.size.md,
                    color: tokens.color.text.primary,
                    letterSpacing: tokens.typography.tracking.wide,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    marginTop: tokens.spacing[1],
                    maxWidth: '80ch',
                    fontFamily: tokens.typography.fontMono,
                    fontSize: tokens.typography.size.sm,
                    color: tokens.color.text.secondary,
                    lineHeight: tokens.typography.lineHeight.relaxed,
                  }}
                >
                  {t.note}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `max-content repeat(${STATES.length}, max-content)`,
                  gap: `${tokens.spacing[4]} ${tokens.spacing[6]}`,
                  padding: `${tokens.spacing[6]} ${tokens.spacing[5]}`,
                  alignItems: 'center',
                  justifyContent: 'start',
                  overflowX: 'auto',
                }}
              >
                <span />
                {STATES.map((s) => (
                  <span key={s.label} style={caption}>
                    {s.label}
                  </span>
                ))}

                <span style={rowLabel}>Button</span>
                {STATES.map((s) => (
                  <span key={`btn-${s.label}`} data-force={s.force}>
                    <Cell>
                      <Button variant="default" size="md" className={t.button} disabled={s.disabled}>
                        Deploy
                      </Button>
                    </Cell>
                  </span>
                ))}

                <span style={rowLabel}>Tag</span>
                {STATES.map((s) => (
                  <span key={`tag-${s.label}`} data-force={s.force}>
                    <Cell>
                      {s.disabled ? (
                        <NotApplicable />
                      ) : (
                        <Tag variant="default" size="md" className={t.tag} onClose={noop}>
                          Filter
                        </Tag>
                      )}
                    </Cell>
                  </span>
                ))}

                <span style={rowLabel}>Badge</span>
                {STATES.map((s) => (
                  <span key={`badge-${s.label}`} data-force={s.force}>
                    <Cell>
                      {s.disabled ? (
                        <NotApplicable />
                      ) : (
                        <Badge variant="default" size="md" className={t.badge}>
                          Nominal
                        </Badge>
                      )}
                    </Cell>
                  </span>
                ))}
              </div>

              {/* Tones. Same treatment, every meaning a label carries — the
                  hierarchy has to survive colour, not just the neutral case. */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `max-content repeat(${TONES.length}, max-content)`,
                  gap: `${tokens.spacing[4]} ${tokens.spacing[6]}`,
                  padding: `0 ${tokens.spacing[5]} ${tokens.spacing[6]}`,
                  alignItems: 'center',
                  justifyContent: 'start',
                  overflowX: 'auto',
                  borderTop: `1px solid ${tokens.color.border.subtle}`,
                  paddingTop: tokens.spacing[6],
                  marginTop: tokens.spacing[2],
                }}
              >
                <span />
                {TONES.map((tone) => (
                  <span key={tone.label} style={caption}>
                    {tone.label}
                  </span>
                ))}

                <span style={rowLabel}>Badge</span>
                {TONES.map((tone) => (
                  <Cell key={`badge-tone-${tone.label}`}>
                    <Badge
                      variant={tone.variant}
                      size="md"
                      className={t.id === 'current' ? t.badge : `${t.badge} ${tone.alpha}`}
                    >
                      {tone.label}
                    </Badge>
                  </Cell>
                ))}

                <span style={rowLabel}>Tag</span>
                {TONES.map((tone) => (
                  <Cell key={`tag-tone-${tone.label}`}>
                    <Tag
                      variant={tone.variant}
                      size="md"
                      className={t.id === 'current' ? t.tag : `${t.tag} ${tone.alpha}`}
                      onClose={noop}
                    >
                      {tone.label}
                    </Tag>
                  </Cell>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
