// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SIGNAL ROOM: Routines
// Replaces the Spotify "Made for you" row of glossy artwork
// tiles. Each card is a corner-marked surface with a mono code
// label (MIX-01..05), the mix name, an "updates daily" caption,
// a play count, and a signal-strength meter at the bottom. The
// signal meter is the only colour — it's a live measurement, so
// accent is on-rule.
//
// Responsive (desktop-first — see rules.md → Responsive): below
// `mq.md` five flex-1 cards would crush into illegible slivers, so
// the faithful-stack strategy applies — the row scrolls horizontally
// inside its panel (overflow-x:auto) and each card holds a legible
// token-sized minimum (flex:0 0 auto + min-width). On desktop the
// cards keep their equal `flex-1` stretch.
// ============================================================

import { Play, Pause } from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { mq } from '../../components/lib/responsive';
import { Card } from '../../components/Card';
import { PanelHeader } from '../../components/PanelHeader';
import { IconButton } from '../../components/IconButton';
import { mixes } from './data';

function SignalMeter({ value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div
        style={{
          position: 'relative',
          height: '2px',
          width: '100%',
          background: tokens.color.surface.overlay,
          border: `${tokens.border.thin} ${tokens.color.border.subtle}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${value}%`,
            background: tokens.color.accent[300],
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: tokens.typography.fontMono,
          fontSize: '10px',
          color: tokens.color.text.faint,
          textTransform: 'uppercase',
          letterSpacing: tokens.typography.tracking.widest,
        }}
      >
        <span>Signal</span>
        <span style={{ color: tokens.color.accent[300] }}>{value}%</span>
      </div>
    </div>
  );
}

function MixCard({ mix, onPlay, isCurrent, isPlaying }) {
  const playingThis = isCurrent && isPlaying;
  // Markers off entirely — the image overlay carries the card's identity,
  // corner brackets would compete with it.
  return (
    <Card
      markers={false}
      className="sr-mix-card"
      style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing[3],
        padding: tokens.spacing[3],
        height: '200px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Image overlay — abstract dark photo, full-bleed across the card.
          A soft bottom-anchored vignette keeps the signal meter + text
          legible without crushing the image to black; the image stays
          visible all the way to each edge. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${mix.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.20,
          filter: 'grayscale(35%) contrast(1.05)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, rgba(20,20,21,0) 0%, rgba(20,20,21,0) 50%, rgba(20,20,21,0.45) 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Top row: code label + play action (top-right, secondary). Pressing it
          starts the routine in the bottom player. */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.faint,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.widest,
          }}
        >
          {mix.code}
        </span>
        <IconButton
          variant={playingThis ? 'default' : 'outline'}
          size="sm"
          icon={playingThis ? Pause : Play}
          aria-label={playingThis ? `Pause ${mix.name}` : `Play ${mix.name}`}
          onClick={() => onPlay?.(mix)}
        />
      </div>

      {/* Spacer pushes the meta to the middle */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: tokens.spacing[1] }}>
        <span
          style={{
            fontFamily: tokens.typography.fontSans,
            fontSize: tokens.typography.size.lg,
            fontWeight: tokens.typography.weight.semibold,
            color: tokens.color.text.primary,
            letterSpacing: '-0.01em',
          }}
        >
          {mix.name}
        </span>
        <span
          style={{
            fontFamily: tokens.typography.fontMono,
            fontSize: tokens.typography.size.xs,
            color: tokens.color.text.muted,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.tracking.wider,
          }}
        >
          {mix.desc} · {mix.plays} plays
        </span>
      </div>

      {/* Bottom signal meter — the live measurement */}
      <div style={{ position: 'relative' }}>
        <SignalMeter value={mix.signal} />
      </div>
    </Card>
  );
}

export function MixesRow({ onPlay, currentCode, isPlaying }) {
  return (
    <Card>
      <PanelHeader
        title="Routines"
        actions={
          <span
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.widest,
              cursor: 'pointer',
            }}
          >
            See all
          </span>
        }
      />
      <div
        className="sr-mixes-row"
        style={{
          display: 'flex',
          gap: tokens.spacing[3],
          padding: tokens.spacing[3],
        }}
      >
        {mixes.map(mix => (
          <MixCard
            key={mix.code}
            mix={mix}
            onPlay={onPlay}
            isCurrent={mix.code === currentCode}
            isPlaying={isPlaying}
          />
        ))}
      </div>

      <style>{`
        ${mq.md} {
          .sr-mixes-row {
            overflow-x: auto !important;
          }
          /* Release the flex-1 stretch so the cards keep a legible width and
             scroll horizontally instead of collapsing into slivers. The inline
             flex:1 needs !important to beat the inline style. */
          .sr-mix-card {
            flex: 0 0 auto !important;
            width: calc(${tokens.spacing[12]} * 4) !important;
          }
        }
      `}</style>
    </Card>
  );
}
