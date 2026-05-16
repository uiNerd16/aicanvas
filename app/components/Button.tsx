'use client'

import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

// ─── Button ───────────────────────────────────────────────────────────────────
// The one button. Five variants × four sizes. If a new use site doesn't fit
// these, push back before adding a variant — most "new" buttons are an existing
// variant in disguise.
//
// Use the <Button> component for <button> elements. For <a> / next/link / etc.
// that should *look* like a button, use buttonClasses() to grab the same class
// string and apply it to the element directly.
//
//   <Button variant="primary" size="md" onClick={...}>Save</Button>
//   <Link href="/x" className={buttonClasses({ variant: 'primary', size: 'lg' })}>Browse</Link>

export type ButtonVariant = 'primary' | 'outline' | 'icon' | 'link' | 'destructive'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

type ButtonOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Square icon-only layout. Required for `variant="icon"`, optional elsewhere. */
  iconOnly?: boolean
  /** Stretch to the container's width. */
  fullWidth?: boolean
  /** For `variant="destructive"`. `outline` = trigger, `solid` = confirm. */
  tone?: 'outline' | 'solid'
}

// ─── locked tokens — every button uses these and only these ─────────────────
const BASE = 'inline-flex items-center justify-center font-semibold transition-colors active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'
const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-500/40'

// Label sizes — height matched: xs=28, sm=32, md=36, lg=40
const LABEL_SIZES: Record<ButtonSize, string> = {
  xs: 'gap-1.5 rounded-lg px-3 py-1.5 text-xs',
  sm: 'gap-1.5 rounded-lg px-3.5 py-1.5 text-sm',
  md: 'gap-2 rounded-lg px-4 py-2 text-sm',
  lg: 'gap-2 rounded-lg px-5 py-2.5 text-sm',
}

// Icon-only sizes — square; matches label heights
const ICON_SIZES: Record<ButtonSize, string> = {
  xs: 'h-7 w-7 rounded-md',
  sm: 'h-8 w-8 rounded-lg',
  md: 'h-9 w-9 rounded-lg',
  lg: 'h-10 w-10 rounded-lg',
}

// ─── variants ──────────────────────────────────────────────────────────────
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-olive-500 text-sand-950 hover:bg-olive-400',
  outline:
    'border border-sand-300 bg-transparent text-sand-700 hover:border-sand-400 hover:text-sand-900 dark:border-sand-700 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:text-sand-100',
  icon:
    'bg-transparent text-sand-600 hover:bg-sand-200 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800 dark:hover:text-sand-100',
  link:
    'bg-transparent text-sand-700 hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100',
  destructive: '',
}

const DESTRUCTIVE_TONES = {
  outline:
    'border border-red-500/40 bg-transparent text-red-700 hover:bg-red-500/10 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/15',
  solid:
    'bg-red-600 text-white hover:bg-red-500',
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  fullWidth = false,
  tone = 'solid',
}: ButtonOptions = {}): string {
  // `icon` variant is always icon-only.
  const square = iconOnly || variant === 'icon'
  const sizing = square ? ICON_SIZES[size] : LABEL_SIZES[size]

  const skin = variant === 'destructive' ? DESTRUCTIVE_TONES[tone] : VARIANTS[variant]

  return [
    BASE,
    FOCUS,
    sizing,
    skin,
    fullWidth ? 'w-full' : '',
  ]
    .filter(Boolean)
    .join(' ')
}

type ButtonProps = ButtonOptions & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, iconOnly, fullWidth, tone, className = '', type = 'button', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`${buttonClasses({ variant, size, iconOnly, fullWidth, tone })} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  )
})
