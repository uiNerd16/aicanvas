import type { Platform } from '../../app/components/ComponentCard'

// ─── Prompts ──────────────────────────────────────────────────────────────────
// Write one prompt per model family. Each prompt must be fully self-contained —
// the model receiving it should be able to recreate the component from scratch.
//
// Guidelines per lane:
//   Claude  — mid-density spec. Constants + core math, trust Claude on idiomatic
//             React + Framer Motion. "Inline everything, single file, no helper
//             hooks" to defend against over-engineering.
//   GPT     — highest density. Exact constants, easing curves, spring params,
//             phase thresholds. Pseudo-code blocks. Treat as precise executor.
//   Gemini  — defensive and explicit. Include exact imports. Call out "use these
//             hooks and no others". Inline DPR/canvas scaffolding for creative
//             components (Gemini has the biggest gap on Framer Motion's surface).
//   V0      — natural language, UI-framed, no math. Describe the component as
//             prose: visual intent, animation behaviour in plain words, key
//             constants as labelled numbers (e.g. "RADIUS = 340"). Works for
//             every component type — canvas, particles, waves, 3D, buttons,
//             glass, etc. V0 has been validated on Claude-style prose prompts
//             even for heavy canvas/hover/wave work; don't omit it.

export const prompts: Partial<Record<Platform, string>> = {
  Claude: ``,

  GPT: ``,

  Gemini: ``,

  V0: ``,
}
