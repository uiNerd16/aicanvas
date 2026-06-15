// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SERVICE ORDER
// Composition shell. Top bar (brand + nav + connection + avatar),
// page-header strip (back + title + micro KPIs + actions), then
// the OrderMetadataPanel + SlaPanel bento and the ItemsPanel.
//
// Responsive (desktop-first — see rules.md → Responsive): the
// default styles ARE the desktop layout; everything steps DOWN via
// `mq`. Below `mq.md` the metadata/SLA bento collapses to one column
// (metadata first, SLA second, in source order); the TopBar's inline
// horizontal nav is hidden (`display:none`) and a hamburger appears
// in its place that opens the same nav content in a left-side Drawer;
// the PageHeaderStrip's KPI cluster wraps; and the header rows tighten
// their inline padding. Drawer open/close is local client state,
// starts closed — SSR-safe, no hydration flash.
// ============================================================

'use client';

import { useState } from 'react';
import {
  ArrowsClockwise,
  CheckCircle,
  EyeSlash,
  Gear,
  Keyboard,
  List,
  SignOut,
  UserCircle,
  Warning,
  XCircle,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { tokens } from '../../tokens';
import { mq } from '../../components/lib/responsive';
import { CornerMarkers } from '../../components/CornerMarkers';
import { Badge } from '../../components/Badge';
import { IconButton } from '../../components/IconButton';
import { Tooltip } from '../../components/Tooltip';
import { UserMenu } from '../../components/UserMenu';
import { Drawer, DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody } from '../../components/Drawer';
import { useCascadeProps } from '../../components/lib/motion';
import { AndromedaIcon } from '../../AndromedaIcon';
import { OrderMetadataPanel } from './OrderMetadataPanel';
import { SlaPanel } from './SlaPanel';
import { ItemsPanel } from './ItemsPanel';
import { order, pageMetrics, navItems } from './data';

// ── Hover stylesheet ──────────────────────────────────────────────
function HoverStyles() {
  return (
    <style>{`
      .so-nav        { transition: color 140ms ease; }
      .so-nav:hover  { color: ${tokens.color.text.primary} !important; }
    `}</style>
  );
}

// ── Shared nav links ──────────────────────────────────────────────
// Rendered both inline in the TopBar (desktop, horizontal) and inside
// the mobile Drawer (vertical). `orientation` switches the flow.
function NavLinks({ orientation = 'horizontal', onNavigate }) {
  const vertical = orientation === 'vertical';
  return (
    <nav
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: vertical ? 'stretch' : 'center',
        gap: vertical ? tokens.spacing[1] : tokens.spacing[5],
      }}
    >
      {navItems.map((label, i) => {
        const active = i === 0;
        return (
          <button
            key={label}
            type="button"
            className="so-nav"
            onClick={onNavigate}
            style={{
              position: 'relative',
              padding: vertical
                ? `${tokens.spacing[3]} ${tokens.spacing[4]}`
                : `${tokens.spacing[2]} 0`,
              background: vertical && active ? tokens.color.surface.active : 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.sm,
              fontWeight: active ? tokens.typography.weight.semibold : tokens.typography.weight.regular,
              color: active ? tokens.color.text.primary : tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.wider,
            }}
          >
            {label}
            {active ? (
              <span
                aria-hidden
                style={
                  vertical
                    ? {
                        position: 'absolute',
                        left: 0,
                        top: tokens.spacing[2],
                        bottom: tokens.spacing[2],
                        width: '2px',
                        background: tokens.color.accent[300],
                      }
                    : {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: '-2px',
                        height: '2px',
                        background: tokens.color.accent[300],
                      }
                }
              />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

// ── User menu items (shared shape with mission-control / resource-planning) ─
const userMenuItems = [
  { id: 'profile',     label: 'Profile',             icon: UserCircle },
  { id: 'preferences', label: 'Preferences',         icon: Gear },
  { id: 'shortcuts',   label: 'Keyboard Shortcuts',  icon: Keyboard },
  { id: 'sep1',        type: 'separator' },
  { id: 'signout',     label: 'Sign Out',            icon: SignOut },
];

// ── Top bar ───────────────────────────────────────────────────────
function TopBar({ onMenuOpen, menuOpen = false }) {
  return (
    <header
      className="so-topbar"
      style={{
        position: 'relative',
        height: tokens.layout.headerHeight,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[5],
        padding: `0 ${tokens.spacing[6]}`,
        background: tokens.color.surface.raised,
      }}
    >
      <CornerMarkers />

      {/* Hamburger — opens the nav Drawer. Hidden on desktop (the inline nav
          is visible there); shown below `mq.md` where the inline nav is
          hidden. Carries the stateful data-state look while the drawer is open. */}
      <IconButton
        className="so-hamburger"
        variant="ghost"
        size="md"
        icon={List}
        aria-label="Open navigation"
        aria-expanded={menuOpen}
        data-state={menuOpen ? 'open' : 'closed'}
        onClick={onMenuOpen}
        style={{
          display: 'none',
          flexShrink: 0,
          ...(menuOpen
            ? { background: tokens.color.surface.active, color: tokens.color.text.primary }
            : null),
        }}
      />

      {/* Brand — Andromeda over the template name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[3], flexShrink: 0 }}>
        <AndromedaIcon size={22} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1] }}>
          <span
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.primary,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.widest,
              fontWeight: tokens.typography.weight.semibold,
            }}
          >
            Andromeda
          </span>
          <span
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.widest,
            }}
          >
            Service Order
          </span>
        </div>
      </div>

      <span className="so-nav-divider" aria-hidden style={{ width: '1px', height: tokens.spacing[6], background: tokens.color.border.base, flexShrink: 0 }} />

      {/* Inline nav — hidden below `mq.md`, where the hamburger + Drawer take over. */}
      <div className="so-inline-nav" style={{ display: 'flex', alignItems: 'center' }}>
        <NavLinks orientation="horizontal" />
      </div>

      <div style={{ flex: 1 }} />

      {/* Right cluster — independent gap so it isn't pulled wide
          by the header's spacing[5] rhythm. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[3] }}>
        <Badge variant="accent">Live Connection</Badge>
        <span
          className="so-connection"
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.sm,
            color: tokens.color.text.secondary,
            letterSpacing: tokens.typography.tracking.wider,
          }}
        >
          {order.connection}
        </span>
        <UserMenu
          name="OPS-01"
          src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          status="online"
          items={userMenuItems}
          placement="bottom"
          align="end"
        />
      </div>

      <style>{`
        ${mq.md} {
          /* Tighten the inline padding + gap so brand, hamburger and the
             right cluster fit the narrow row without forcing page scroll. */
          .so-topbar { padding: 0 ${tokens.spacing[4]} !important; gap: ${tokens.spacing[3]} !important; }
          /* Hamburger appears; inline display:none is overridden here. */
          .so-hamburger { display: inline-flex !important; }
          /* Inline horizontal nav + its leading divider move into the Drawer. */
          .so-inline-nav { display: none !important; }
          .so-nav-divider { display: none !important; }
        }
        ${mq.sm} {
          /* On the smallest phones drop the connection code — the Live
             Connection badge already signals the live link, and this keeps
             the avatar in view without crowding. */
          .so-connection { display: none !important; }
        }
      `}</style>
    </header>
  );
}

// ── Page header strip (back + title + KPIs + actions) ─────────────
function PageHeaderStrip() {
  return (
    <div
      className="so-page-header"
      style={{
        position: 'relative',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: tokens.spacing[3],
        padding: `${tokens.spacing[3]} ${tokens.spacing[6]}`,
        background: tokens.color.surface.raised,
      }}
    >
      <CornerMarkers />

      <span
        style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.md,
          fontWeight: tokens.typography.weight.semibold,
          color: tokens.color.text.primary,
          letterSpacing: tokens.typography.tracking.wider,
          textTransform: 'uppercase',
        }}
      >
        Contract Registry
      </span>

      <div className="so-page-header-spacer" style={{ flex: 1 }} />

      <div className="so-page-header-cluster" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: tokens.spacing[5] }}>
        {[
          { label: 'Issues',    value: pageMetrics[0].value, icon: Warning,      color: tokens.color.orange[300] },
          { label: 'Accidents', value: pageMetrics[2].value, icon: XCircle,      color: tokens.color.red[300]    },
          { label: 'Resolved',  value: pageMetrics[1].value, icon: CheckCircle,  color: tokens.color.accent[300] },
        ].map(({ label, value, icon: Icon, color }) => (
          <span
            key={label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: tokens.spacing[2],
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.sm,
              color,
              letterSpacing: tokens.typography.tracking.wider,
              textTransform: 'uppercase',
            }}
          >
            <Icon weight="regular" size={14} color={color} />
            {label}
            <span style={{ color }}>{value}</span>
          </span>
        ))}

        <span aria-hidden style={{ width: '1px', height: tokens.spacing[5], background: tokens.color.border.base }} />

        <Tooltip label="Refresh"><IconButton aria-label="Refresh" variant="ghost" size="sm" icon={ArrowsClockwise} /></Tooltip>
        <Tooltip label="Hide"><IconButton aria-label="Hide"    variant="ghost" size="sm" icon={EyeSlash} /></Tooltip>
      </div>

      <style>{`
        ${mq.md} {
          /* Tighten the inline padding + KPI gaps so the wrapped cluster
             doesn't run past the panel edges on a narrow row. */
          .so-page-header { padding: ${tokens.spacing[3]} ${tokens.spacing[4]} !important; }
          .so-page-header-cluster { gap: ${tokens.spacing[3]} !important; }
        }
        ${mq.sm} {
          /* Title takes the full first line; the KPI/action cluster drops
             to its own line and starts from the left instead of pinning
             right, so it reads as a tidy stacked block on a phone. */
          .so-page-header-spacer { display: none !important; }
          .so-page-header-cluster { flex-basis: 100% !important; }
        }
      `}</style>
    </div>
  );
}

// ── Composition ───────────────────────────────────────────────────
export default function ServiceOrder() {
  // Five cascade slots, top-to-bottom: TopBar, PageHeaderStrip, then
  // OrderMetadataPanel + SlaPanel side-by-side (left-to-right stagger),
  // then ItemsPanel.
  const topBarMotion         = useCascadeProps(0);
  const pageHeaderMotion     = useCascadeProps(1);
  const orderMetaMotion      = useCascadeProps(2);
  const slaMotion            = useCascadeProps(3);
  const itemsMotion          = useCascadeProps(4);

  // Mobile nav drawer — starts closed so SSR + first client render match the
  // desktop-first base (the drawer is portaled + display:none-gated anyway).
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        // 100% (not 100vw): 100vw includes the scrollbar gutter, so it runs wider
        // than the visible area and eats the right padding (left looks fine, right
        // is clipped). Matches mission-control / signal-room.
        width: '100%',
        background: tokens.color.surface.base,
        fontFamily: tokens.typography.fontSans,
        color: tokens.color.text.primary,
        gap: tokens.spacing[3],
        padding: tokens.spacing[6],
        boxSizing: 'border-box',
      }}
    >
      <HoverStyles />
      <motion.div {...topBarMotion} style={{ flexShrink: 0 }}>
        <TopBar onMenuOpen={() => setNavOpen(true)} menuOpen={navOpen} />
      </motion.div>
      <motion.div {...pageHeaderMotion} style={{ flexShrink: 0 }}>
        <PageHeaderStrip />
      </motion.div>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing[3],
          minHeight: 0,
        }}
      >
        {/* Two independent panels side by side. SLA panel is narrower — it
            doesn't need to be half; the metadata panel takes the rest.
            Below `mq.md` the bento collapses to one column: metadata first,
            SLA second, in source order. */}
        <div
          className="so-bento"
          style={{
            display: 'grid',
            // minmax(0, 1fr) so wide content can't blow the left track past its
            // share and overflow into the page padding on the right.
            gridTemplateColumns: 'minmax(0, 1fr) 400px',
            gap: tokens.spacing[3],
          }}
        >
          <motion.div {...orderMetaMotion} style={{ minWidth: 0 }}>
            <OrderMetadataPanel />
          </motion.div>
          <motion.div {...slaMotion} style={{ minWidth: 0 }}>
            <SlaPanel />
          </motion.div>
        </div>

        <motion.div {...itemsMotion} style={{ minWidth: 0 }}>
          <ItemsPanel />
        </motion.div>
      </main>

      {/* Mobile nav — the same TopBar nav content, served in a left-side
          Drawer below `mq.md`. The inline horizontal nav is hidden at that
          width (see TopBar's <style>); the hamburger lives in the TopBar. */}
      <Drawer open={navOpen} onOpenChange={setNavOpen} side="left" size={tokens.layout.sidebarWidth}>
        <DrawerHeader>
          <DrawerTitle>Andromeda</DrawerTitle>
          <DrawerDescription>Service Order</DrawerDescription>
        </DrawerHeader>
        <DrawerBody style={{ padding: 0 }}>
          <NavLinks orientation="vertical" onNavigate={() => setNavOpen(false)} />
        </DrawerBody>
      </Drawer>

      <style>{`
        ${mq.md} {
          /* Bento collapses to a single column; the two panels stack
             top-to-bottom (metadata, then SLA) in source order. */
          .so-bento { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
