// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// RESOURCE PLANNING
// Composition shell. Top bar (brand + nav + actions), status bar
// (date range + manage layout), then the 2-column main grid:
//   - Left: Capacity panel + Allocation chart
//   - Right: Requests panel + Requests table
//
// Responsive (desktop-first — see rules.md → Responsive): the shell
// is width:100% + boxSizing:border-box (never 100vw), each grid item
// minWidth:0. The 2×2 bento grid collapses to ONE column below
// `mq.md`, rows flowing top-to-bottom in source order (Capacity →
// Requests → Allocation → Table). This template carries its nav
// HORIZONTALLY in the TopBar rather than in a left sidebar, so the
// sidebar→drawer rule is met by hiding the inline nav below `mq.md`
// and serving the SAME nav rows through a left-side Drawer opened
// from a hamburger IconButton in the TopBar. The nav rows are
// factored into <TopNav> so the inline strip and the Drawer never
// drift. The StatusBar's date-picker / manage-layout row wraps, and
// the CapacityPanel / RequestsPanel cell rows stack at the same
// threshold. Drawer open/close is local client state, starts closed —
// SSR-safe, no hydration flash.
// ============================================================

'use client';

import { useState } from 'react';
import {
  Download,
  Gear,
  Keyboard,
  List,
  SignOut,
  Sliders,
  UserCircle,
} from '@phosphor-icons/react';
import { motion, LayoutGroup } from 'framer-motion';
import { tokens } from '../../tokens';
import { mq } from '../../components/lib/responsive';
import { CornerMarkers } from '../../components/CornerMarkers';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { NavItem } from '../../components/NavItem';
import { DateRangePicker } from '../../components/DateRangePicker';
import { UserMenu } from '../../components/UserMenu';
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
} from '../../components/Drawer';
import { useCascadeProps } from '../../components/lib/motion';
import { AndromedaIcon } from '../../AndromedaIcon';
import { CapacityPanel } from './CapacityPanel';
import { AllocationChart } from './AllocationChart';
import { RequestsPanel } from './RequestsPanel';
import { RequestsTable } from './RequestsTable';
import { navItems } from './data';

// ─── Hover stylesheet ───────────────────────────────────────────────────
function HoverStyles() {
  return (
    <style>{`
      .rp-nav { transition: color 140ms ease; }
      .rp-nav:hover { color: ${tokens.color.text.primary} !important; }

      .rp-row { transition: background 100ms ease; cursor: pointer; }
      .rp-row:hover { background: ${tokens.color.surface.hover}; }

      .rp-link { transition: color 140ms ease; }
      .rp-link:hover { color: ${tokens.color.text.primary} !important; }
    `}</style>
  );
}

// ─── User menu items (shared shape with mission-control / service-order) ─
const userMenuItems = [
  { id: 'profile',     label: 'Profile',             icon: UserCircle },
  { id: 'preferences', label: 'Preferences',         icon: Gear },
  { id: 'shortcuts',   label: 'Keyboard Shortcuts',  icon: Keyboard },
  { id: 'sep1',        type: 'separator' },
  { id: 'signout',     label: 'Sign Out',            icon: SignOut },
];

// ─── Inline horizontal nav (desktop TopBar) ──────────────────────────────
// Factored out so the desktop strip and the mobile Drawer render the SAME
// rows from one source. Hidden below `mq.md` via the `rp-topnav` class; its
// content reappears as Drawer NavItems at that width.
function TopNav() {
  return (
    <nav className="rp-topnav" style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[5] }}>
      {navItems.map((label, i) => {
        const active = i === 0;
        return (
          <button
            key={label}
            type="button"
            className="rp-nav"
            style={{
              position: 'relative',
              padding: `${tokens.spacing[2]} 0`,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
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
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: '-2px',
                  height: '2px',
                  background: tokens.color.accent[300],
                }}
              />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

// ─── Drawer nav (mobile) ──────────────────────────────────────────────────
// The same nav items as <TopNav>, rendered as Andromeda NavItems inside the
// left Drawer below `mq.md`. Selecting a row closes the drawer. LayoutGroup
// scopes NavItem's active-dot layoutId so the drawer copy can't fight the
// (hidden) desktop strip for the shared animation.
function DrawerNav({ onNavigate }) {
  return (
    <LayoutGroup id="rp-drawer-nav">
      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        {navItems.map((label, i) => (
          <NavItem
            key={label}
            label={label}
            active={i === 0}
            onClick={onNavigate}
          />
        ))}
      </nav>
    </LayoutGroup>
  );
}

// ─── Top bar ────────────────────────────────────────────────────────────
function TopBar({ onMenuOpen, menuOpen = false }) {
  return (
    <header
      className="rp-topbar"
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
          hidden. Carries the stateful data-state look while the drawer is
          open (see rules.md → Interaction states → stateful triggers). */}
      <IconButton
        className="rp-hamburger"
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
      <div className="rp-brand" style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[3], flexShrink: 0, minWidth: 0 }}>
        <AndromedaIcon size={22} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[1], minWidth: 0 }}>
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
            className="rp-brand-sub"
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.widest,
            }}
          >
            Resource Planning
          </span>
        </div>
      </div>

      {/* Brand / nav divider — hidden below `mq.md` with the inline nav. */}
      <span
        aria-hidden
        className="rp-nav-divider"
        style={{
          width: '1px',
          height: tokens.spacing[6],
          background: tokens.color.border.base,
          flexShrink: 0,
        }}
      />

      {/* Nav — inline strip on desktop, hidden below `mq.md`. */}
      <TopNav />

      <div style={{ flex: 1 }} />

      {/* Right cluster — wrapped so its inner gap (spacing[3]) is independent
          of the header's spacing[5] rhythm. Without the wrapper, the Button
          and Avatar would inherit the header gap. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[3], flexShrink: 0 }}>
        <Button
          className="rp-report-btn"
          variant="outline"
          size="md"
          icon={Download}
          style={{ height: tokens.spacing[8] }}
        >
          Generate Report
        </Button>
        <UserMenu
          name="OPS-01"
          src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          status="online"
          items={userMenuItems}
          placement="bottom"
          align="end"
        />
      </div>
    </header>
  );
}

// ─── Status bar (date range + manage layout) ────────────────────────────
function StatusBar() {
  // Default: "Last month" — the preset label clears to null on a manual pick.
  const [range, setRange] = useState({
    start: new Date(2026, 6, 20),
    end:   new Date(2026, 7, 20),
  });
  const [presetLabel, setPresetLabel] = useState('Last month');

  return (
    <div
      className="rp-statusbar"
      style={{
        position: 'relative',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[4],
        padding: `${tokens.spacing[3]} ${tokens.spacing[6]}`,
        background: tokens.color.surface.raised,
      }}
    >
      <CornerMarkers />

      <DateRangePicker
        value={range}
        presetLabel={presetLabel}
        onChange={(next) => {
          setRange(next);
          setPresetLabel(null);
        }}
      />

      <span
        style={{
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.sm,
          color: tokens.color.text.muted,
          letterSpacing: tokens.typography.tracking.wide,
        }}
      >
        Last update: 3 min ago
      </span>

      <div style={{ flex: 1 }} />

      <button
        type="button"
        className="rp-link"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: tokens.spacing[2],
          padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: tokens.typography.fontMono,
          fontSize: tokens.typography.size.sm,
          color: tokens.color.text.muted,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.wider,
        }}
      >
        <Sliders weight="regular" size={14} />
        Manage layout
      </button>
    </div>
  );
}

// ─── Composition ────────────────────────────────────────────────────────
export default function ResourcePlanning() {
  // Mobile nav drawer — starts closed so SSR + first client render match the
  // desktop-first base (the drawer is portaled + display:none-gated anyway).
  const [navOpen, setNavOpen] = useState(false);

  // Six cascade slots, top-to-bottom: TopBar, StatusBar, then the 2×2
  // bento grid in reading order — top-left, top-right, bottom-left,
  // bottom-right. Cascade indices line up with grid positions so the
  // user reads the page composing itself the way the eye scans. When the
  // grid collapses to one column below `mq.md` the source order
  // (Capacity → Requests → Allocation → Table) reads sensibly stacked:
  // the headline KPI panel first, the request log last.
  const topBarMotion       = useCascadeProps(0);
  const statusBarMotion    = useCascadeProps(1);
  const capacityMotion     = useCascadeProps(2);
  const requestsPanelMotion = useCascadeProps(3);
  const allocationMotion   = useCascadeProps(4);
  const requestsTableMotion = useCascadeProps(5);

  return (
    <div
      className="rp-shell"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        // 100% (not 100vw): 100vw includes the scrollbar gutter, so it runs wider
        // than the visible area and eats the right padding (left looks fine, right
        // is clipped). Matches mission-control / signal-room.
        width: '100%',
        background: tokens.color.surface.base,
        fontFamily: tokens.typography.fontSans,
        color: tokens.color.text.primary,
        overflow: 'hidden',
        gap: tokens.spacing[3],
        padding: tokens.spacing[6],
        boxSizing: 'border-box',
      }}
    >
      <HoverStyles />
      <motion.div {...topBarMotion} style={{ flexShrink: 0 }}>
        <TopBar onMenuOpen={() => setNavOpen(true)} menuOpen={navOpen} />
      </motion.div>
      <motion.div {...statusBarMotion} style={{ flexShrink: 0 }}>
        <StatusBar />
      </motion.div>

      {/* Main 2×2 bento grid. Grid (not flex) is used so the top row shares
          a single height across both columns and the bottom row fills the
          remaining space — guaranteeing the panel seams line up across the
          left/right divide regardless of intrinsic content height. Below
          `mq.md` it collapses to a single minmax(0,1fr) column and the rows
          flow top-to-bottom in source order. */}
      <main
        className="rp-grid"
        style={{
          flex: 1,
          display: 'grid',
          // minmax(0, fr) — without the 0 minimum a wide nowrap table in the
          // right column blows the track past its fraction and overflows into
          // the page padding (content touches / overlaps the frame on the right).
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gridTemplateRows: 'minmax(220px, auto) 1fr',
          gap: tokens.spacing[3],
          minHeight: 0,
        }}
      >
        <motion.div className="rp-grid-item" {...capacityMotion} style={{ minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <CapacityPanel />
        </motion.div>
        <motion.div className="rp-grid-item" {...requestsPanelMotion} style={{ minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <RequestsPanel />
        </motion.div>
        <motion.div className="rp-grid-item rp-grid-item-chart" {...allocationMotion} style={{ minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <AllocationChart />
        </motion.div>
        <motion.div className="rp-grid-item rp-grid-item-table" {...requestsTableMotion} style={{ minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <RequestsTable />
        </motion.div>
      </main>

      {/* Mobile nav — the same TopBar nav rows, served in a left-side Drawer
          below `mq.md`. The inline TopNav strip is hidden at that width (see
          <style> below); the hamburger lives in the TopBar. Selecting a row
          closes the drawer. */}
      <Drawer open={navOpen} onOpenChange={setNavOpen} side="left" size={tokens.layout.sidebarWidth}>
        <DrawerHeader>
          <DrawerTitle>Andromeda</DrawerTitle>
          <DrawerDescription>Resource Planning</DrawerDescription>
        </DrawerHeader>
        <DrawerBody style={{ padding: 0 }}>
          <DrawerNav onNavigate={() => setNavOpen(false)} />
        </DrawerBody>
      </Drawer>

      <style>{`
        ${mq.md} {
          /* Tighter shell padding + gap so the stacked panels keep their
             breathing room without crowding the viewport edge. */
          .rp-shell {
            gap: ${tokens.spacing[3]} !important;
            padding: ${tokens.spacing[3]} !important;
            /* Desktop pins the shell to a fixed 100vh + overflow:hidden so the
               bento fr-tracks align the seams. On a phone that fixed height is
               the LARGE viewport (address bar retracted), so the internally-
               scrolling grid's bottom hides under the address bar with no way to
               reach it. Below md, let the SHELL scroll to the dynamic viewport
               instead (matches exchange-terminal) — nothing clips. */
            height: auto !important;
            min-height: 100dvh !important;
            overflow-y: auto !important;
          }
          /* Bento grid collapses to ONE column; rows flow top-to-bottom in
             source order (Capacity → Requests → Allocation → Table). Rows
             become content-sized (auto) and the grid itself scrolls
             vertically inside the fixed-height shell — the page never grows
             past the viewport, the stacked panels scroll within. */
          .rp-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            grid-template-rows: auto !important;
            grid-auto-rows: auto !important;
            /* The shell scrolls now (above), so the grid is content-sized — no
               nested scroller. */
            overflow: visible !important;
            min-height: 0 !important;
          }
          /* The chart and table panels lay out against a parent-provided
             height on desktop (the fr track). Once the rows are content-sized
             they would collapse, so pin a usable minimum — reusing the 220px
             that already anchors the desktop top-row track in this file, so no
             new magic number is introduced. */
          .rp-grid-item-chart { min-height: 220px !important; }
          .rp-grid-item-table { min-height: 220px !important; }
          /* TopBar: tighten inline padding/gap; hide the inline nav + its
             divider — that content now lives in the Drawer — and reveal the
             hamburger (its inline display:none is overridden here). */
          .rp-topbar {
            padding: 0 ${tokens.spacing[4]} !important;
            gap: ${tokens.spacing[3]} !important;
          }
          .rp-topnav { display: none !important; }
          .rp-nav-divider { display: none !important; }
          .rp-hamburger { display: inline-flex !important; }
          /* StatusBar: let the date-picker / last-update / manage-layout row
             wrap instead of overflowing the narrow viewport. */
          .rp-statusbar {
            flex-wrap: wrap !important;
            padding: ${tokens.spacing[3]} ${tokens.spacing[4]} !important;
            row-gap: ${tokens.spacing[2]} !important;
          }
        }
        ${mq.sm} {
          /* Smallest phones: drop the "Generate Report" label, keep the icon,
             so the TopBar right cluster never pushes the row wider than the
             viewport. The icon is a fixed-size SVG, so font-size:0 collapses
             only the text label. */
          .rp-report-btn { font-size: 0 !important; gap: 0 !important; }
          /* Drop the brand subtitle — it already names the template in the
             Drawer header — so the brand block can never force page scroll on
             a 320px phone. The Andromeda wordmark stays. */
          .rp-brand-sub { display: none !important; }
        }
      `}</style>
    </div>
  );
}
