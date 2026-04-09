// ============================================================
// SHARED UTILITIES
// shadcn/ui-style helpers used by all Space components.
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
 * spaceVars — emits Space tokens as CSS custom properties.
 *
 * Tailwind v4 cannot reach JS-defined token values directly. By
 * spreading this object onto a component's root `style` prop we
 * cascade every token down to that subtree, where cva variants
 * can reference them via `[color:var(--space-…)]` arbitrary
 * classes — including in `hover:` / `focus-visible:` state
 * variants. Every value below traces back to `tokens.js` exactly.
 *
 * @returns {Record<string, string>}
 */
export function spaceVars() {
  const t = tokens;
  return {
    // Text
    '--space-text-primary':   t.color.text.primary,
    '--space-text-secondary': t.color.text.secondary,
    '--space-text-muted':     t.color.text.muted,
    '--space-text-faint':     t.color.text.faint,
    // Surfaces
    '--space-surface-base':    t.color.surface.base,
    '--space-surface-raised':  t.color.surface.raised,
    '--space-surface-overlay': t.color.surface.overlay,
    '--space-surface-hover':   t.color.surface.hover,
    '--space-surface-active':  t.color.surface.active,
    // Borders
    '--space-border-subtle': t.color.border.subtle,
    '--space-border-base':   t.color.border.base,
    '--space-border-bright': t.color.border.bright,
    '--space-border-strong': t.color.border.strong,
    // Accent
    '--space-accent-base':      t.color.accent.base,
    '--space-accent-bright':    t.color.accent.bright,
    '--space-accent-dim':       t.color.accent.dim,
    '--space-accent-glow':      t.color.accent.glow,
    '--space-accent-glow-soft': t.color.accent.glowSoft,
    // Semantic
    '--space-warning':      t.color.warning,
    '--space-warning-dim':  t.color.warningDim,
    '--space-warning-glow': t.color.warningGlow,
    '--space-warning-ring': t.color.warningRing,
    '--space-fault':        t.color.fault,
    '--space-fault-dim':    t.color.faultDim,
    '--space-fault-glow':   t.color.faultGlow,
    '--space-fault-ring':   t.color.faultRing,
    // Gradients
    '--space-gradient-accent-fade':  t.color.gradient.accentFade,
    '--space-gradient-accent-sweep': t.color.gradient.accentSweep,
    '--space-gradient-surface-soft': t.color.gradient.surfaceSoft,
    // Typography
    '--space-font-sans': t.typography.fontSans,
    '--space-font-mono': t.typography.fontMono,
    '--space-text-xs':   t.typography.size.xs,
    '--space-text-sm':   t.typography.size.sm,
    '--space-text-md':   t.typography.size.md,
    '--space-text-lg':   t.typography.size.lg,
    '--space-text-xl':   t.typography.size.xl,
    '--space-text-2xl':  t.typography.size['2xl'],
    '--space-text-3xl':  t.typography.size['3xl'],
    '--space-text-4xl':  t.typography.size['4xl'],
    '--space-text-5xl':  t.typography.size['5xl'],
    '--space-weight-thin':     String(t.typography.weight.thin),
    '--space-weight-regular':  String(t.typography.weight.regular),
    '--space-weight-medium':   String(t.typography.weight.medium),
    '--space-weight-semibold': String(t.typography.weight.semibold),
    '--space-weight-bold':     String(t.typography.weight.bold),
    '--space-leading-tight':  String(t.typography.lineHeight.tight),
    '--space-leading-snug':   String(t.typography.lineHeight.snug),
    '--space-leading-normal': String(t.typography.lineHeight.normal),
    '--space-tracking-tight':  t.typography.tracking.tight,
    '--space-tracking-normal': t.typography.tracking.normal,
    '--space-tracking-wide':   t.typography.tracking.wide,
    '--space-tracking-wider':  t.typography.tracking.wider,
    '--space-tracking-widest': t.typography.tracking.widest,
    // Spacing
    '--space-1':  t.spacing[1],
    '--space-2':  t.spacing[2],
    '--space-3':  t.spacing[3],
    '--space-4':  t.spacing[4],
    '--space-5':  t.spacing[5],
    '--space-6':  t.spacing[6],
    '--space-8':  t.spacing[8],
    '--space-10': t.spacing[10],
    '--space-12': t.spacing[12],
    // Radius
    '--space-radius-none': t.radius.none,
    '--space-radius-sm':   t.radius.sm,
    '--space-radius-md':   t.radius.md,
  };
}
