// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// COMPONENT: Card
// padding variants: none | sm | md | lg
// ============================================================

import { tokens } from '../tokens';

export function Card({ children, header, footer, padding = 'md', style: extraStyle }) {
  const paddingValues = {
    none: '0',
    sm:   tokens.spacing[3],
    md:   tokens.spacing[4],
    lg:   tokens.spacing[6],
  };

  return (
    <div style={{
      background: tokens.color.neutral[0],
      border: `1px solid ${tokens.color.neutral[50]}`,
      borderRadius: tokens.radius.xl,
      boxShadow: tokens.shadow[2],
      overflow: 'hidden',
      ...extraStyle,
    }}>
      {header && (
        <div style={{
          padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
          borderBottom: `1px solid ${tokens.color.neutral[40]}`,
        }}>
          {header}
        </div>
      )}
      <div style={{ padding: paddingValues[padding] }}>
        {children}
      </div>
      {footer && (
        <div style={{
          padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
          borderTop: `1px solid ${tokens.color.neutral[40]}`,
          background: tokens.color.neutral[20],
        }}>
          {footer}
        </div>
      )}
    </div>
  );
}
