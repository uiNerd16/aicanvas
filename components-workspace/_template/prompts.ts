import type { Platform } from '../../app/components/ComponentCard'

// ─── Prompts ──────────────────────────────────────────────────────────────────
// Write one prompt per platform. Each prompt must be fully self-contained —
// the AI receiving it should be able to recreate the component from scratch.
//
// Guidelines per platform:
//   'Claude Code'  — mid-density spec. Constants + core math, trust Claude on
//                   idiomatic React + Framer Motion. "Inline everything, single
//                   file." Prepend an env-check preamble: verify Tailwind CSS v4,
//                   TypeScript, React are set up (shadcn CLI if missing).
//   'Lovable'   — same content as Claude Code prompt but without the env preamble.
//                   Lovable builds a full working app from the prompt.
//   'V0'           — same content as Claude Code prompt. Claude-style prompts
//                   outperform V0-specific prompts even in V0.

export const prompts: Partial<Record<Platform, string>> = {
  'Claude Code': ``,

  'Lovable': ``,

  'V0': ``,
}
