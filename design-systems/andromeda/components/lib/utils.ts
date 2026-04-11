// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SHARED UTILITIES
// shadcn/ui-style helpers used by all Andromeda components.
// ============================================================

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { tokens } from '../../tokens';

/**
 * cn — class name merger.
 * Combines clsx (conditional class joining) with tailwind-merge
 * (conflict resolution for Tailwind utilities).
 *
 * @param {...(string | undefined | null | false | Record<string, boolean>)} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * andromedaVars — emits Andromeda tokens as CSS custom properties.
 *
 * Tailwind v4 cannot reach JS-defined token values directly. By
 * spreading this object onto a component's root `style` prop we
 * cascade every token down to that subtree, where cva variants
 * can reference them via `[color:var(--andromeda-…)]` arbitrary
 * classes — including in `hover:` / `focus-visible:` state
 * variants. Every value below traces back to `tokens.js` exactly.
 *
 * @returns {Record<string, string>}
 */
export function andromedaVars() {
  const t = tokens;
  return {
    // Text
    '--andromeda-text-primary':   t.color.text.primary,
    '--andromeda-text-secondary': t.color.text.secondary,
    '--andromeda-text-muted':     t.color.text.muted,
    '--andromeda-text-faint':     t.color.text.faint,
    // Surfaces
    '--andromeda-surface-base':    t.color.surface.base,
    '--andromeda-surface-raised':  t.color.surface.raised,
    '--andromeda-surface-overlay': t.color.surface.overlay,
    '--andromeda-surface-hover':   t.color.surface.hover,
    '--andromeda-surface-active':  t.color.surface.active,
    // Borders
    '--andromeda-border-subtle': t.color.border.subtle,
    '--andromeda-border-base':   t.color.border.base,
    '--andromeda-border-bright': t.color.border.bright,
    '--andromeda-border-strong': t.color.border.strong,
    // Accent
    '--andromeda-accent-base':      t.color.accent.base,
    '--andromeda-accent-bright':    t.color.accent.bright,
    '--andromeda-accent-dim':       t.color.accent.dim,
    '--andromeda-accent-glow':      t.color.accent.glow,
    '--andromeda-accent-glow-soft': t.color.accent.glowSoft,
    // Semantic
    '--andromeda-warning':      t.color.warning,
    '--andromeda-warning-dim':  t.color.warningDim,
    '--andromeda-warning-glow': t.color.warningGlow,
    '--andromeda-warning-ring': t.color.warningRing,
    '--andromeda-fault':        t.color.fault,
    '--andromeda-fault-dim':    t.color.faultDim,
    '--andromeda-fault-glow':   t.color.faultGlow,
    '--andromeda-fault-ring':   t.color.faultRing,
    // Gradients
    '--andromeda-gradient-accent-fade':  t.color.gradient.accentFade,
    '--andromeda-gradient-accent-sweep': t.color.gradient.accentSweep,
    '--andromeda-gradient-surface-soft': t.color.gradient.surfaceSoft,
    // Typography
    '--andromeda-font-sans': t.typography.fontSans,
    '--andromeda-font-mono': t.typography.fontMono,
    '--andromeda-text-xs':   t.typography.size.xs,
    '--andromeda-text-sm':   t.typography.size.sm,
    '--andromeda-text-md':   t.typography.size.md,
    '--andromeda-text-lg':   t.typography.size.lg,
    '--andromeda-text-xl':   t.typography.size.xl,
    '--andromeda-text-2xl':  t.typography.size['2xl'],
    '--andromeda-text-3xl':  t.typography.size['3xl'],
    '--andromeda-text-4xl':  t.typography.size['4xl'],
    '--andromeda-text-5xl':  t.typography.size['5xl'],
    '--andromeda-weight-thin':     String(t.typography.weight.thin),
    '--andromeda-weight-regular':  String(t.typography.weight.regular),
    '--andromeda-weight-medium':   String(t.typography.weight.medium),
    '--andromeda-weight-semibold': String(t.typography.weight.semibold),
    '--andromeda-weight-bold':     String(t.typography.weight.bold),
    '--andromeda-leading-tight':  String(t.typography.lineHeight.tight),
    '--andromeda-leading-snug':   String(t.typography.lineHeight.snug),
    '--andromeda-leading-normal': String(t.typography.lineHeight.normal),
    '--andromeda-tracking-tight':  t.typography.tracking.tight,
    '--andromeda-tracking-normal': t.typography.tracking.normal,
    '--andromeda-tracking-wide':   t.typography.tracking.wide,
    '--andromeda-tracking-wider':  t.typography.tracking.wider,
    '--andromeda-tracking-widest': t.typography.tracking.widest,
    // Spacing
    '--andromeda-1':  t.spacing[1],
    '--andromeda-2':  t.spacing[2],
    '--andromeda-3':  t.spacing[3],
    '--andromeda-4':  t.spacing[4],
    '--andromeda-5':  t.spacing[5],
    '--andromeda-6':  t.spacing[6],
    '--andromeda-8':  t.spacing[8],
    '--andromeda-10': t.spacing[10],
    '--andromeda-12': t.spacing[12],
    // Radius
    '--andromeda-radius-none': t.radius.none,
    '--andromeda-radius-sm':   t.radius.sm,
    '--andromeda-radius-md':   t.radius.md,
  };
}
