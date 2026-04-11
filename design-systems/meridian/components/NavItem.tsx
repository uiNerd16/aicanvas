// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: NavItem
// ============================================================

import { useState } from 'react';
import { tokens } from '../tokens';

export function NavItem({ icon: Icon, label, active, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[2],
        width: '100%',
        padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
        borderRadius: tokens.radius.md,
        border: 'none',
        cursor: 'pointer',
        fontFamily: tokens.typography.fontFamily,
        fontSize: tokens.typography.size.md,
        fontWeight: active ? tokens.typography.weight.semibold : tokens.typography.weight.regular,
        color: active
          ? tokens.color.primary[50]
          : hovered
            ? tokens.color.neutral[100]
            : tokens.color.neutral[80],
        background: active
          ? tokens.color.primary[10]
          : hovered
            ? tokens.color.neutral[30]
            : 'transparent',
        transition: 'all 0.1s ease',
        textAlign: 'left',
        boxSizing: 'border-box',
      }}
    >
      <Icon size={17} strokeWidth={active ? 2 : 1.5} />
      {label}
    </button>
  );
}
