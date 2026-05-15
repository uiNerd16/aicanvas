// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SERVICE ORDER
// Composition shell. Top bar (brand + nav + connection + avatar),
// page-header strip (back + title + micro KPIs + actions), then
// the OrderSummaryPanel and ItemsPanel stacked vertically.
// ============================================================

'use client';

import {
  ArrowsClockwise,
  CheckCircle,
  EyeSlash,
  Gear,
  Keyboard,
  SignOut,
  UserCircle,
  Warning,
  XCircle,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { tokens } from '../../tokens';
import { CornerMarkers } from '../../components/CornerMarkers';
import { Badge } from '../../components/Badge';
import { IconButton } from '../../components/IconButton';
import { Tooltip } from '../../components/Tooltip';
import { UserMenu } from '../../components/UserMenu';
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

// ── User menu items (shared shape with mission-control / resource-planning) ─
const userMenuItems = [
  { id: 'profile',     label: 'Profile',             icon: UserCircle },
  { id: 'preferences', label: 'Preferences',         icon: Gear },
  { id: 'shortcuts',   label: 'Keyboard Shortcuts',  icon: Keyboard },
  { id: 'sep1',        type: 'separator' },
  { id: 'signout',     label: 'Sign Out',            icon: SignOut },
];

// ── Top bar ───────────────────────────────────────────────────────
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

      <span aria-hidden style={{ width: '1px', height: tokens.spacing[6], background: tokens.color.border.base, flexShrink: 0 }} />

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[5] }}>
        {navItems.map((label, i) => {
          const active = i === 0;
          return (
            <button
              key={label}
              type="button"
              className="so-nav"
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

      {/* Right cluster — independent gap so it isn't pulled wide
          by the header's spacing[5] rhythm. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[3] }}>
        <Badge variant="accent">Live Connection</Badge>
        <span
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
    </header>
  );
}

// ── Page header strip (back + title + KPIs + actions) ─────────────
function PageHeaderStrip() {
  return (
    <div
      style={{
        position: 'relative',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
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

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[5] }}>
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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
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
        <TopBar />
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
            doesn't need to be half; the metadata panel takes the rest. */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 400px',
            gap: tokens.spacing[3],
          }}
        >
          <motion.div {...orderMetaMotion}>
            <OrderMetadataPanel />
          </motion.div>
          <motion.div {...slaMotion}>
            <SlaPanel />
          </motion.div>
        </div>

        <motion.div {...itemsMotion}>
          <ItemsPanel />
        </motion.div>
      </main>
    </div>
  );
}
