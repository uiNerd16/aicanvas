// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// RESOURCE PLANNING
// Composition shell. Top bar (brand + nav + actions), status bar
// (date range + manage layout), then the 2-column main grid:
//   - Left: Capacity panel + Allocation chart
//   - Right: Requests panel + Requests table
// ============================================================

'use client';

import { useState } from 'react';
import {
  Download,
  Gear,
  Keyboard,
  SignOut,
  Sliders,
  UserCircle,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { Button } from '../../components/Button';
import { DateRangePicker } from '../../components/DateRangePicker';
import { UserMenu } from '../../components/UserMenu';
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

// ─── Top bar ────────────────────────────────────────────────────────────
function TopBar() {
  return (
    <header
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

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[3], flexShrink: 0 }}>
        <AndromedaIcon size={22} />
        <span
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.lg,
            fontWeight: tokens.typography.weight.bold,
            color: tokens.color.text.primary,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}
        >
          Andromeda
        </span>
      </div>

      {/* Brand / nav divider */}
      <span
        aria-hidden
        style={{
          width: '1px',
          height: tokens.spacing[6],
          background: tokens.color.border.base,
          flexShrink: 0,
        }}
      />

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[5] }}>
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

      <div style={{ flex: 1 }} />

      {/* Right cluster — wrapped so its inner gap (spacing[3]) is independent
          of the header's spacing[5] rhythm. Without the wrapper, the Button
          and Avatar would inherit the header gap. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[3] }}>
        <Button
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
  // Six cascade slots, top-to-bottom: TopBar, StatusBar, then the 2×2
  // bento grid in reading order — top-left, top-right, bottom-left,
  // bottom-right. Cascade indices line up with grid positions so the
  // user reads the page composing itself the way the eye scans.
  const topBarMotion       = useCascadeProps(0);
  const statusBarMotion    = useCascadeProps(1);
  const capacityMotion     = useCascadeProps(2);
  const requestsPanelMotion = useCascadeProps(3);
  const allocationMotion   = useCascadeProps(4);
  const requestsTableMotion = useCascadeProps(5);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
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
        <TopBar />
      </motion.div>
      <motion.div {...statusBarMotion} style={{ flexShrink: 0 }}>
        <StatusBar />
      </motion.div>

      {/* Main 2×2 bento grid. Grid (not flex) is used so the top row shares
          a single height across both columns and the bottom row fills the
          remaining space — guaranteeing the panel seams line up across the
          left/right divide regardless of intrinsic content height. */}
      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gridTemplateRows: 'minmax(220px, auto) 1fr',
          gap: tokens.spacing[3],
          minHeight: 0,
        }}
      >
        <motion.div {...capacityMotion} style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <CapacityPanel />
        </motion.div>
        <motion.div {...requestsPanelMotion} style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <RequestsPanel />
        </motion.div>
        <motion.div {...allocationMotion} style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <AllocationChart />
        </motion.div>
        <motion.div {...requestsTableMotion} style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <RequestsTable />
        </motion.div>
      </main>
    </div>
  );
}
