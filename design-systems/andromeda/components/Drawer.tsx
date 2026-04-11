// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Drawer
// shadcn/ui-aligned API: controlled (`open`/`onOpenChange`),
// `side`, compound parts (DrawerHeader / Body / Footer / Title /
// Description). Uses React Portal so the panel escapes any
// transformed/clipped ancestor. ESC closes; outside-click on
// the backdrop closes; body scroll is locked while open.
//
// Animation: pure CSS transitions on transform + opacity, gated
// by an internal `mounted` state so the open/close transitions
// run cleanly without Framer Motion.
//
//   <Drawer open={open} onOpenChange={setOpen} side="right">
//     <DrawerHeader>
//       <DrawerTitle>Settings</DrawerTitle>
//       <DrawerDescription>Mission parameters</DrawerDescription>
//     </DrawerHeader>
//     <DrawerBody>…</DrawerBody>
//     <DrawerFooter><Button>Save</Button></DrawerFooter>
//   </Drawer>
// ============================================================

'use client';

import { forwardRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn, andromedaVars } from './lib/utils';
import { CornerMarkers } from './CornerMarkers';

const SIDE_MAP = {
  right:  { axis: 'X', sign:  1, position: 'right-0 top-0 bottom-0 h-full' },
  left:   { axis: 'X', sign: -1, position: 'left-0 top-0 bottom-0 h-full'  },
  top:    { axis: 'Y', sign: -1, position: 'top-0 left-0 right-0 w-full'   },
  bottom: { axis: 'Y', sign:  1, position: 'bottom-0 left-0 right-0 w-full' },
};

/**
 * @typedef {object} DrawerProps
 * @property {boolean} open
 * @property {(next: boolean) => void} [onOpenChange]
 * @property {'left'|'right'|'top'|'bottom'} [side='right']
 * @property {number|string} [size=420] Width (left/right) or height (top/bottom). Number → px, string passed through.
 * @property {React.ReactNode} [children]
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/** @type {React.ForwardRefExoticComponent<DrawerProps & React.HTMLAttributes<HTMLDivElement>>} */
export const Drawer = forwardRef(function Drawer(
  {
    open,
    onOpenChange,
    side = 'right',
    size = 420,
    children,
    className,
    style,
    ...props
  },
  ref,
) {
  // mounted: in DOM at all (controls portal lifecycle)
  // visible: open transition state (controls transform/opacity)
  // We delay unmount until the close transition finishes.
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Next frame, flip visible so the CSS transition runs.
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    // Closing: hide first, then unmount after the transition.
    setVisible(false);
    const t = setTimeout(() => setMounted(false), 240);
    return () => clearTimeout(t);
  }, [open]);

  // ── Body scroll lock ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, [mounted]);

  // ── ESC to close ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onOpenChange?.(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mounted, onOpenChange]);

  if (!mounted || typeof document === 'undefined') return null;

  const cfg = SIDE_MAP[side] ?? SIDE_MAP.right;
  const closedTransform = `translate${cfg.axis}(${cfg.sign * 100}%)`;
  const sizeStyle =
    cfg.axis === 'X'
      ? { width: typeof size === 'number' ? `${size}px` : size }
      : { height: typeof size === 'number' ? `${size}px` : size };

  return createPortal(
    <div
      data-slot="drawer-root"
      style={{ ...andromedaVars() }}
      className="fixed inset-0 z-[1000]"
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => onOpenChange?.(false)}
        className={cn(
          'absolute inset-0 bg-black/60',
          '[backdrop-filter:blur(2px)] [-webkit-backdrop-filter:blur(2px)]',
          'transition-opacity duration-200 ease-out',
          visible ? 'opacity-100' : 'opacity-0',
        )}
      />
      {/* Panel */}
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        data-slot="drawer-panel"
        className={cn(
          'absolute',
          cfg.position,
          'flex flex-col',
          'bg-[color:var(--andromeda-surface-raised)]',
          '[backdrop-filter:blur(8px)] [-webkit-backdrop-filter:blur(8px)]',
          'rounded-[var(--andromeda-radius-none)]',
          'shadow-[0_0_60px_rgba(0,0,0,0.5)]',
          'transition-transform duration-240 ease-out',
          className,
        )}
        style={{
          ...sizeStyle,
          transform: visible ? 'translate(0,0)' : closedTransform,
          ...style,
        }}
        {...props}
      >
        <CornerMarkers />
        {children}
      </div>
    </div>,
    document.body,
  );
});

export const DrawerHeader = forwardRef(function DrawerHeader(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="drawer-header"
      className={cn(
        'flex flex-col gap-[2px]',
        'px-[var(--andromeda-3)] py-[var(--andromeda-3)]',
        'border-b border-solid border-[color:var(--andromeda-border-subtle)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export const DrawerTitle = forwardRef(function DrawerTitle(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="drawer-title"
      className={cn(
        '[font-family:var(--andromeda-font-mono)]',
        'text-[length:var(--andromeda-text-md)]',
        'font-[number:var(--andromeda-weight-medium)]',
        'uppercase [letter-spacing:var(--andromeda-tracking-wider)]',
        'text-[color:var(--andromeda-text-primary)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export const DrawerDescription = forwardRef(function DrawerDescription(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="drawer-description"
      className={cn(
        '[font-family:var(--andromeda-font-mono)]',
        'text-[length:var(--andromeda-text-xs)]',
        'text-[color:var(--andromeda-text-muted)]',
        'uppercase [letter-spacing:var(--andromeda-tracking-wide)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export const DrawerBody = forwardRef(function DrawerBody(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="drawer-body"
      className={cn(
        'flex-1 min-h-0 overflow-auto',
        'p-[var(--andromeda-3)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export const DrawerFooter = forwardRef(function DrawerFooter(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="drawer-footer"
      className={cn(
        'flex items-center justify-end gap-[var(--andromeda-3)]',
        'px-[var(--andromeda-3)] py-[var(--andromeda-3)]',
        'border-t border-solid border-[color:var(--andromeda-border-subtle)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
