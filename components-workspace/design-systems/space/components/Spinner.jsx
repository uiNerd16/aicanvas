// ============================================================
// COMPONENT: Spinner
// shadcn/ui-aligned API: forwardRef, variant/size, cva.
// SVG arc that rotates continuously. Uses an inline @keyframes
// rule injected once at module load — no Framer Motion, no
// per-frame React work, runs entirely on the compositor.
// Variants: default | accent | warning | fault
// Sizes:    sm | md | lg
// ============================================================

'use client';

import { forwardRef, useEffect } from 'react';
import { cva } from 'class-variance-authority';
import { cn, spaceVars } from './lib/utils';

const STYLE_ID = 'space-spinner-keyframes';
const KEYFRAMES = `@keyframes space-spinner-spin { to { transform: rotate(360deg); } }`;

function ensureKeyframesInjected() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = KEYFRAMES;
  document.head.appendChild(style);
}

const wrapperVariants = cva(
  ['inline-flex items-center justify-center'],
  {
    variants: {
      size: {
        sm: 'w-[14px] h-[14px]',
        md: 'w-[20px] h-[20px]',
        lg: 'w-[28px] h-[28px]',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const colorByVariant = {
  default: 'var(--space-text-secondary)',
  accent:  'var(--space-accent-base)',
  warning: 'var(--space-warning)',
  fault:   'var(--space-fault)',
};

/**
 * @typedef {object} SpinnerProps
 * @property {'default'|'accent'|'warning'|'fault'} [variant='default']
 * @property {'sm'|'md'|'lg'} [size='md']
 * @property {string} [label='Loading'] Accessible label.
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<SpinnerProps & React.HTMLAttributes<HTMLSpanElement>>} */
export const Spinner = forwardRef(function Spinner(
  { className, variant = 'default', size = 'md', label = 'Loading', style, ...props },
  ref,
) {
  useEffect(() => { ensureKeyframesInjected(); }, []);
  // Run on first render in case the effect hasn't fired yet (SSR hydration).
  ensureKeyframesInjected();

  const stroke = colorByVariant[variant];

  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cn(wrapperVariants({ size }), className)}
      style={{ ...spaceVars(), ...style }}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        width="100%"
        height="100%"
        fill="none"
        style={{
          animation: 'space-spinner-spin 1s linear infinite',
          transformOrigin: 'center',
        }}
      >
        {/* Background ring — very faint full circle */}
        <circle cx="12" cy="12" r="9" stroke={stroke} strokeOpacity="0.18" strokeWidth="2" />
        {/* Foreground arc — quarter sweep */}
        <path
          d="M21 12 A 9 9 0 0 0 12 3"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="square"
        />
      </svg>
    </span>
  );
});

export { wrapperVariants as spinnerVariants };
