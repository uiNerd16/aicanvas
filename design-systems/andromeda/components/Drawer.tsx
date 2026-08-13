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

import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  createContext,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, andromedaVars, easingArray } from './lib/utils';
import { CornerMarkers } from './CornerMarkers';
import { useReducedMotion } from './lib/motion';
import { tokens } from '../tokens';

// Shares the dialog's accessible-name / description ids from the Drawer root
// down to DrawerTitle / DrawerDescription so they can wire `id` ↔ `aria-*`.
const DrawerContext = createContext({
  titleId: undefined,
  descId: undefined,
  registerTitle: undefined,
  registerDescription: undefined,
});

// Focusable-element selector for the focus trap + initial focus move-in.
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ms = (v) => parseInt(v, 10) / 1000;
const PANEL_DURATION = ms(tokens.motion.duration.slow);
// framer boundary: derived from tokens, cannot follow runtime var overrides
const EASE_OUT = easingArray(tokens.motion.easing.out);
const EASE_IN  = easingArray(tokens.motion.easing.in);

// Vertical edges only. A drawer slides in from the LEFT or the RIGHT — the
// top/bottom sides were removed 2026-08-11: a full-width sheet dropping from
// the top is a different component with different rules (it competes with the
// template top bar), not a fourth value of this prop. Every side here is on
// the x axis, which is why nothing below branches on an axis any more.
const SIDE_MAP = {
  right: { sign:  1, position: 'right-0 top-0 bottom-0 h-full' },
  left:  { sign: -1, position: 'left-0 top-0 bottom-0 h-full'  },
};

/**
 * @typedef {object} DrawerProps
 * @property {boolean} open Whether the drawer is open.
 * @property {(next: boolean) => void} [onOpenChange] Handler called with the next open state when the drawer requests to close (ESC or backdrop click).
 * @property {'left'|'right'} [side='right'] Screen edge the panel slides in from.
 * @property {number|string} [size=420] Panel width. Number → px, string passed through.
 * @property {React.ReactNode} [children] Panel content, typically the Drawer compound parts (Header, Body, Footer).
 * @property {string} [className] Extra classes merged onto the panel element.
 * @property {React.CSSProperties} [style] Inline styles merged onto the panel element.
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

  // Accessible-name / description ids, shared via context to Title/Description.
  const reactId = useId();
  const titleId = `${reactId}-title`;
  const descId = `${reactId}-desc`;
  const [renderedTitleId, setRenderedTitleId] = useState(undefined);
  const [renderedDescId, setRenderedDescId] = useState(undefined);
  const registerTitle = useCallback((id) => {
    setRenderedTitleId(id);
    return () => setRenderedTitleId((current) => current === id ? undefined : current);
  }, []);
  const registerDescription = useCallback((id) => {
    setRenderedDescId(id);
    return () => setRenderedDescId((current) => current === id ? undefined : current);
  }, []);
  const reducedMotion = useReducedMotion();

  // Panel node + the element focused before opening (to restore focus on close).
  const panelRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  // ── Focus return — capture the trigger on open, restore it on close. ─────
  // Capturing in a layout-ish effect keyed on `open` grabs document.activeElement
  // (the trigger) just as the drawer opens, and the cleanup restores it on
  // close/unmount, guarding for a null or detached element.
  useEffect(() => {
    if (!open) return undefined;
    previouslyFocusedRef.current =
      typeof document !== 'undefined' ? document.activeElement : null;
    return () => {
      const el = previouslyFocusedRef.current;
      previouslyFocusedRef.current = null;
      if (el && typeof el.focus === 'function' && document.contains(el)) {
        el.focus();
      }
    };
  }, [open]);

  // ── Focus move-in — once the panel is in the DOM, move focus into it. ────
  // Focus the first focusable child, else the panel container itself
  // (it carries tabIndex={-1} so it can receive programmatic focus).
  useEffect(() => {
    if (!open || !canPortal) return;
    const panel = panelRef.current;
    if (!panel) return;
    const first = panel.querySelector(FOCUSABLE_SELECTOR);
    if (first && typeof first.focus === 'function') {
      first.focus();
    } else if (typeof panel.focus === 'function') {
      panel.focus();
    }
  }, [open, canPortal]);

  // ── Focus trap — wrap Tab / Shift+Tab so focus can't leave the panel. ────
  const onPanelKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = Array.from(
      panel.querySelectorAll(FOCUSABLE_SELECTOR),
    ).filter((el) => el.offsetParent !== null || el === panel);
    if (focusable.length === 0) {
      // Nothing focusable inside — keep focus pinned to the panel itself.
      e.preventDefault();
      panel.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (e.shiftKey) {
      if (active === first || !panel.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else if (active === last || !panel.contains(active)) {
      e.preventDefault();
      first.focus();
    }
  };

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
  const sizeValue = typeof size === 'number' ? `${size}px` : size;
  // Cap the panel to the viewport on phones: a drawer wider than
  // the screen (size=420 on a 320px phone) must never exceed the viewport and
  // force horizontal page scroll. min() keeps the desktop size on wide screens
  // and clamps to a token-sized inset from the edge below it. tokens.spacing[6]
  // (24px) leaves the backdrop peeking so the drawer still reads as an overlay.
  const sizeStyle = { width: `min(${sizeValue}, calc(100% - var(--andromeda-6, 24px)))` };
  const panelInitial = reducedMotion ? false : { x: `${closedOffset}%`, opacity: 1 };
  const panelAnimate = { x: 0, opacity: 1 };
  const panelExit = reducedMotion
    ? { x: 0, opacity: 1, transition: { duration: 0 } }
    : { x: `${closedOffset}%`, opacity: 1, transition: { duration: PANEL_DURATION, ease: EASE_IN } };

  return createPortal(
    <DrawerContext.Provider value={{ titleId, descId, registerTitle, registerDescription }}>
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
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: PANEL_DURATION, ease: EASE_OUT }}
              className={cn(
                'absolute inset-0 bg-[color:var(--andromeda-surface-alpha)]',
                '[backdrop-filter:blur(var(--andromeda-blur-sm,2px))] [-webkit-backdrop-filter:blur(var(--andromeda-blur-sm,2px))]',
              )}
            />
            {/* Panel */}
            <motion.div
              ref={(node) => {
                panelRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={renderedTitleId}
              aria-describedby={renderedDescId}
              tabIndex={-1}
              onKeyDown={onPanelKeyDown}
              data-slot="drawer-panel"
              initial={panelInitial}
              animate={panelAnimate}
              exit={panelExit}
              transition={reducedMotion ? { duration: 0 } : { duration: PANEL_DURATION, ease: EASE_OUT }}
              className={cn(
                'absolute',
                cfg.position,
                'flex flex-col',
                'bg-[color:var(--andromeda-surface-raised)]',
                '[backdrop-filter:blur(var(--andromeda-blur-lg,8px))] [-webkit-backdrop-filter:blur(var(--andromeda-blur-lg,8px))]',
                'rounded-[var(--andromeda-radius-frame,0px)]',
                'shadow-[0_0_60px_var(--andromeda-surface-base)]',
                'outline-none',
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
      </AnimatePresence>
    </DrawerContext.Provider>,
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
        'border-b-[length:var(--andromeda-border-width,1px)] border-solid border-[color:var(--andromeda-border-subtle)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export const DrawerTitle = forwardRef(function DrawerTitle(
  { className, children, id, ...props },
  ref,
) {
  const { titleId, registerTitle } = useContext(DrawerContext);
  const resolvedId = id ?? titleId;
  useEffect(() => registerTitle?.(resolvedId), [registerTitle, resolvedId]);
  return (
    <div
      ref={ref}
      id={resolvedId}
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
  { className, children, id, ...props },
  ref,
) {
  const { descId, registerDescription } = useContext(DrawerContext);
  const resolvedId = id ?? descId;
  useEffect(() => registerDescription?.(resolvedId), [registerDescription, resolvedId]);
  return (
    <div
      ref={ref}
      id={resolvedId}
      data-slot="drawer-description"
      className={cn(
        '[font-family:var(--andromeda-font-sans)]',
        // text.md, not xs: at 10px this was under the legibility floor and the
        // hardest line in the panel to read. Same call CardDescription took.
        'text-[length:var(--andromeda-text-md)]',
        'text-[color:var(--andromeda-text-secondary)]',
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
        // Actions fill the footer, splitting it evenly: a drawer is a
        // committed, focus-trapping surface, so its actions are the width of
        // the decision, not buttons huddled in a corner.
        'flex items-center gap-[var(--andromeda-3)] [&>*]:flex-1',
        'px-[var(--andromeda-3)] py-[var(--andromeda-3)]',
        'border-t-[length:var(--andromeda-border-width,1px)] border-solid border-[color:var(--andromeda-border-subtle)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
