import { ArrowDefs, EdgeLabel, Flow, NodeCard, TravelPath } from './parts'

const M = 'aic-v3-memory-arrow'

/**
 * memoryHD as a closed ring: you work, notes get written, the next prompt gets
 * them back. Below the ring, the dashed branch is the librarian: it reads, it
 * proposes, and nothing lands until you approve it.
 */
export function MemoryRing() {
  return (
    <svg
      viewBox="0 0 960 340"
      className="h-auto w-full min-w-[760px]"
      role="img"
      aria-label="A loop: you work, notes are written, recall returns them on the next prompt. A separate branch shows the librarian auditing the notes, proposing cleanup, and an approval step before anything is applied."
    >
      <ArrowDefs id={M} />

      {/* ── The ring ── */}
      <Flow d="M250,94 H385" markerId={M} />
      <Flow d="M575,94 H710" markerId={M} />
      <Flow d="M805,56 V24 H155 V56" markerId={M} />
      <TravelPath d="M155,94 H805 V24 H155 V94" length={1440} duration={9} />
      <EdgeLabel x={480} y={18}>
        every following prompt
      </EdgeLabel>

      {/* ── Librarian branch ── */}
      <Flow d="M480,132 V166 H195 V204" dashed markerId={M} />
      <EdgeLabel x={330} y={160}>
        audits
      </EdgeLabel>
      <Flow d="M270,236 H340" markerId={M} />
      <Flow d="M490,236 H560" markerId={M} />
      <Flow d="M720,236 H790" markerId={M} />
      <EdgeLabel x={755} y={228}>
        approved
      </EdgeLabel>
      <Flow d="M640,276 V312" dashed markerId={M} />
      <EdgeLabel x={652} y={308} anchor="start">
        skipped
      </EdgeLabel>

      {/* ── Nodes ── */}
      <NodeCard x={60} y={56} w={190} h={76} title="You work" />
      <NodeCard
        x={385}
        y={56}
        w={190}
        h={76}
        title="Notes written"
        sub="as it happens"
        tone="agent"
      />
      <NodeCard
        x={710}
        y={56}
        w={190}
        h={76}
        title="Recall"
        sub="with an age stamp"
        tone="agent"
      />
      <NodeCard
        x={120}
        y={204}
        w={150}
        h={64}
        title="Librarian"
        sub="read only"
        tone="agent"
      />
      <NodeCard x={340} y={204} w={150} h={64} title="Proposals" />
      <NodeCard
        x={560}
        y={196}
        w={160}
        h={80}
        title="You approve"
        tone="human"
      />
      <NodeCard x={790} y={204} w={130} h={64} title="Applied" />
    </svg>
  )
}
