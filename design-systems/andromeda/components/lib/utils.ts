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
    // Surfaces — solid + one alpha (scrim/backdrop)
    '--andromeda-surface-base':    t.color.surface.base,
    '--andromeda-surface-raised':  t.color.surface.raised,
    '--andromeda-surface-overlay': t.color.surface.overlay,
    '--andromeda-surface-hover':   t.color.surface.hover,
    '--andromeda-surface-active':  t.color.surface.active,
    '--andromeda-surface-alpha':   t.color.surface.alpha,
    // Borders — solid + one alpha (glassy edge)
    '--andromeda-border-subtle': t.color.border.subtle,
    '--andromeda-border-base':   t.color.border.base,
    '--andromeda-border-bright': t.color.border.bright,
    '--andromeda-border-strong': t.color.border.strong,
    '--andromeda-border-alpha':  t.color.border.alpha,
    // Accent (turquoise) — 5 stops + 1 alpha
    '--andromeda-accent-100':   t.color.accent[100],
    '--andromeda-accent-200':   t.color.accent[200],
    '--andromeda-accent-300':   t.color.accent[300],
    '--andromeda-accent-400':   t.color.accent[400],
    '--andromeda-accent-500':   t.color.accent[500],
    '--andromeda-accent-alpha': t.color.accent.alpha,
    // Red — 5 stops + 1 alpha
    '--andromeda-red-100':   t.color.red[100],
    '--andromeda-red-200':   t.color.red[200],
    '--andromeda-red-300':   t.color.red[300],
    '--andromeda-red-400':   t.color.red[400],
    '--andromeda-red-500':   t.color.red[500],
    '--andromeda-red-alpha': t.color.red.alpha,
    // Orange — 5 stops + 1 alpha
    '--andromeda-orange-100':   t.color.orange[100],
    '--andromeda-orange-200':   t.color.orange[200],
    '--andromeda-orange-300':   t.color.orange[300],
    '--andromeda-orange-400':   t.color.orange[400],
    '--andromeda-orange-500':   t.color.orange[500],
    '--andromeda-orange-alpha': t.color.orange.alpha,
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
    // Motion — every duration, easing, and stagger from tokens.motion.
    // Components and templates reference these as `var(--andromeda-duration-*)`
    // and `var(--andromeda-easing-*)` instead of hardcoding ms / cubic-bezier.
    '--andromeda-duration-fast':       t.motion.duration.fast,
    '--andromeda-duration-normal':     t.motion.duration.normal,
    '--andromeda-duration-slow':       t.motion.duration.slow,
    '--andromeda-duration-cascade':    t.motion.duration.cascade,
    '--andromeda-duration-countup':    t.motion.duration.countup,
    '--andromeda-easing-standard':     t.motion.easing.standard,
    '--andromeda-easing-out':          t.motion.easing.out,
    '--andromeda-easing-in':           t.motion.easing.in,
    '--andromeda-easing-sharp':        t.motion.easing.sharp,
    '--andromeda-stagger-cascade':     t.motion.stagger.cascade,
    '--andromeda-stagger-progressbar': t.motion.stagger.progressBar,
  };
}
