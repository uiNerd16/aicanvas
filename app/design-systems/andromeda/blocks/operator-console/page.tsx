// @ts-nocheck — consumes Andromeda tokens which are not type-checked yet.
'use client'

import { X } from '@phosphor-icons/react'
import { tokens } from '../../../../../design-systems/andromeda/tokens'

// Placeholder block — second tile in the Sci-Fi domain so the row
// fills out. Every value here references design-systems/andromeda/tokens
// so the placeholder is itself a small audit of token usage.

export default function OperatorConsoleBlock() {
  function handleExit() {
    window.close()
    setTimeout(() => {
      if (!window.closed) {
        window.location.href = '/design-systems/andromeda/showcase'
      }
    }, 50)
  }

  return (
    <div
      className="relative flex min-h-full items-center justify-center"
      style={{ backgroundColor: tokens.color.surface.base }}
    >
      {/* Faint grid for visual continuity with the rest of Andromeda */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${tokens.color.border.subtle} 1px, transparent 1px), linear-gradient(90deg, ${tokens.color.border.subtle} 1px, transparent 1px)`,
          backgroundSize: `${tokens.spacing[8]} ${tokens.spacing[8]}`,
        }}
      />

      {/* Coming-soon card */}
      <div
        className="relative z-10 max-w-md text-center"
        style={{
          padding: `${tokens.spacing[12]} ${tokens.spacing[10]}`,
          fontFamily: tokens.typography.fontMono,
        }}
      >
        <div
          style={{
            marginBottom: tokens.spacing[3],
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}
        >
          /// Andromeda example
        </div>
        <div
          style={{
            fontSize: tokens.typography.size['3xl'],
            fontWeight: tokens.typography.weight.medium,
            color: tokens.color.text.primary,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wide,
            lineHeight: tokens.typography.lineHeight.tight,
          }}
        >
          Operator Console
        </div>
        <div
          style={{
            marginTop: tokens.spacing[4],
            fontSize: tokens.typography.size.md,
            color: tokens.color.text.secondary,
            lineHeight: tokens.typography.lineHeight.normal,
          }}
        >
          Coming soon. A single-vehicle operator view — live telemetry,
          comms log, and override controls.
        </div>
      </div>

      {/* Exit affordance — token-compliant chrome on the example surface */}
      <button
        type="button"
        onClick={handleExit}
        aria-label="Close example"
        className="fixed z-50 flex items-center justify-center transition-colors"
        style={{
          top: tokens.spacing[4],
          right: tokens.spacing[4],
          width: tokens.spacing[10],
          height: tokens.spacing[10],
          borderRadius: tokens.radius.sm,
          backgroundColor: tokens.color.surface.hover,
          border: `${tokens.border.thin} ${tokens.color.border.base}`,
          color: tokens.color.text.secondary,
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
      >
        <X weight="regular" size={16} />
      </button>
    </div>
  )
}
