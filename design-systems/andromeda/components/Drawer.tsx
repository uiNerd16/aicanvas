// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Drawer
// shadcn/ui-aligned API: controlled (`open`/`onOpenChange`),
// `side`, compound parts (DrawerHeader / Body / Footer / Title /
// Description). Uses React Portal so the panel escapes any
// transformed/clipped ancestor. ESC closes; outside-click on
// the backdrop closes; body scroll is locked while open.
//
// Animation: framer-motion's <AnimatePresence> handles the open/
// close lifecycle. Backdrop fades opacity; panel slides in from
// `side`. Both use `tokens.motion.duration.slow` and the brand's
// ease-out (entrance) / ease-in (exit). No setTimeout-driven
// unmount, no raw timing strings.
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
import { motion, AnimatePresence } from 'framer-motion';
import { cn, andromedaVars } from './lib/utils';
import { CornerMarkers } from './CornerMarkers';
import { tokens } from '../tokens';

const ms = (v) => parseInt(v, 10) / 1000;
const PANEL_DURATION = ms(tokens.motion.duration.slow);
const EASE_OUT = [0, 0, 0.2, 1];   // tokens.motion.easing.out
const EASE_IN  = [0.4, 0, 1, 1];   // tokens.motion.easing.in

const SIDE_MAP = {
  right:  { axis: 'x', sign:  1, position: 'right-0 top-0 bottom-0 h-full' },
  left:   { axis: 'x', sign: -1, position: 'left-0 top-0 bottom-0 h-full'  },
  top:    { axis: 'y', sign: -1, position: 'top-0 left-0 right-0 w-full'   },
  bottom: { axis: 'y', sign:  1, position: 'bottom-0 left-0 right-0 w-full' },
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
  // SSR / portal target gate. Tracks whether we have a document to portal into.
  const [canPortal, setCanPortal] = useState(false);
  useEffect(() => { setCanPortal(typeof document !== 'undefined'); }, []);

  // ── Body scroll lock — engaged whenever the drawer is open. ──────────────
  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, [open]);

  // ── ESC to close ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onOpenChange?.(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  if (!canPortal) return null;

  const cfg = SIDE_MAP[side] ?? SIDE_MAP.right;
  const closedOffset = cfg.sign * 100;
  const sizeStyle =
    cfg.axis === 'x'
      ? { width: typeof size === 'number' ? `${size}px` : size }
      : { height: typeof size === 'number' ? `${size}px` : size };
  const panelInitial = { [cfg.axis]: `${closedOffset}%`, opacity: 1 };
  const panelAnimate = { [cfg.axis]: 0, opacity: 1 };
  const panelExit    = { [cfg.axis]: `${closedOffset}%`, opacity: 1 };

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div
          key="drawer-root"
          data-slot="drawer-root"
          style={{ ...andromedaVars() }}
          className="fixed inset-0 z-[1000]"
        >
          {/* Backdrop */}
          <motion.div
            aria-hidden="true"
            onClick={() => onOpenChange?.(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: PANEL_DURATION, ease: EASE_OUT }}
            className={cn(
              'absolute inset-0 bg-black/60',
              '[backdrop-filter:blur(2px)] [-webkit-backdrop-filter:blur(2px)]',
            )}
          />
          {/* Panel */}
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            data-slot="drawer-panel"
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelExit}
            transition={{ duration: PANEL_DURATION, ease: open ? EASE_OUT : EASE_IN }}
            className={cn(
              'absolute',
              cfg.position,
              'flex flex-col',
              'bg-[color:var(--andromeda-surface-raised)]',
              '[backdrop-filter:blur(8px)] [-webkit-backdrop-filter:blur(8px)]',
              'rounded-[var(--andromeda-radius-none)]',
              'shadow-[0_0_60px_var(--andromeda-surface-base)]',
              className,
            )}
            style={{
              ...sizeStyle,
              ...style,
            }}
            {...props}
          >
            <CornerMarkers />
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
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
