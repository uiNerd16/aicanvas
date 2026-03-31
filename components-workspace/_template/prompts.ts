import type { Platform } from '../../app/components/ComponentCard'

// ─── Prompts ──────────────────────────────────────────────────────────────────
// Write one prompt per platform. Each prompt must be fully self-contained —
// the AI receiving it should be able to recreate the component from scratch.
//
// Guidelines per platform:
//   V0       — conversational, describe visuals and behaviour in plain English
//   Bolt     — semi-technical, mention stack + key implementation details
//   Lovable  — friendly + visual, describe the "feeling" and reference design inspiration
//   Claude Code — precise technical spec: file path, constants, types, algorithm steps
//   Cursor   — concise spec format with explicit file path and implementation details

export const prompts: Record<Platform, string> = {
  V0: ``,

  Bolt: ``,

  Lovable: ``,

  'Claude Code': ``,

  Cursor: ``,
}
