// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SIGNAL ROOM: Transport
// Bottom player bar. Three regions, each fixed width except the
// scrub bar in the middle that flexes:
//
//   [ track meta ]   [ controls + scrub ]   [ volume + queue ]
//
// The play button is the one primary action of the bar — accent
// fill, accent border, default IconButton variant. Everything
// else is ghost/outline.
//
// The scrub value lives in local state; dragging it doesn't
// actually advance the (silent) "transmission" — purely visual.
//
// Responsive (desktop-first — see rules.md → Responsive): the bar
// stays a single transport bar at every width (a faithful stack,
// never a bottom tab bar). Below `mq.md` the two 260px side regions
// release their fixed width so the flexing centre keeps the play
// controls usable, and inline padding/gap tighten. Below `mq.sm`
// the right-side volume/queue cluster — the least essential on a
// phone — is hidden so the cover, title and transport controls keep
// their room.
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  SpeakerHigh,
  ListBullets,
  Heart,
  Broadcast,
  Queue,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { tokens } from '../../tokens';
import { mq } from '../../components/lib/responsive';
import { CornerMarkers } from '../../components/CornerMarkers';
import { IconButton } from '../../components/IconButton';
import { Slider } from '../../components/Slider';
import { nowPlaying } from './data';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function Cover({ cover, title }) {
  // Shows the current item's cover art when it has one (routine cards), else a
  // stylised waveform glyph (transmissions / channels have no artwork).
  return (
    <div
      style={{
        position: 'relative',
        width: '40px',
        height: '40px',
        flexShrink: 0,
        background: cover ? `center / cover no-repeat url(${cover})` : tokens.color.surface.overlay,
        border: `${tokens.border.thin} ${tokens.color.border.subtle}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      role="img"
      aria-label={title ? `${title} cover` : undefined}
    >
      <CornerMarkers size={4} offset={1} />
      {cover ? null : <Broadcast size={16} weight="regular" color={tokens.color.text.muted} />}
    </div>
  );
}

export function Transport({ current, isPlaying, onTogglePlay, motionProps }) {
  // Controlled by the parent (SignalRoom) when wired to the play buttons;
  // falls back to the static demo track + local state if rendered standalone.
  const cur = current ?? {
    title: nowPlaying.track,
    subtitle: nowPlaying.artist,
    code: nowPlaying.code,
    cover: null,
    duration: nowPlaying.duration,
  };
  const [localPlaying, setLocalPlaying] = useState(true);
  const playing = isPlaying ?? localPlaying;
  const togglePlay = onTogglePlay ?? (() => setLocalPlaying((p) => !p));

  const [elapsed, setElapsed] = useState(0);
  const [volume, setVolume] = useState(72);

  // Visual-only player: no real audio (the demo ships no licensed tracks).
  // Reset the scrubber when the track changes.
  useEffect(() => { setElapsed(0); }, [cur.code]);

  // Advance the elapsed time once per second while playing so the scrubber
  // moves and the transport reads as playing, capped at the track duration.
  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => {
      setElapsed((e) => (e >= cur.duration ? cur.duration : e + 1));
    }, 1000);
    return () => clearInterval(id);
  }, [playing, cur.code, cur.duration]);

  return (
    <motion.div
      {...(motionProps ?? {})}
      className="sr-transport"
      style={{
        position: 'relative',
        flexShrink: 0,
        height: '72px',
        background: tokens.color.surface.raised,
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${tokens.spacing[5]}`,
        gap: tokens.spacing[5],
      }}
    >
      <CornerMarkers />

      {/* Left: track metadata */}
      <div
        className="sr-transport-meta"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[3],
          flex: '0 0 260px',
          minWidth: 0,
        }}
      >
        <Cover cover={cur.cover} title={cur.title} />
        <div className="sr-transport-title" style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
          <span
            style={{
              fontFamily: tokens.typography.fontSans,
              fontSize: tokens.typography.size.sm,
              fontWeight: tokens.typography.weight.medium,
              color: tokens.color.text.primary,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {cur.title}
          </span>
          <span
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: '10px',
              color: tokens.color.text.muted,
              textTransform: 'uppercase',
              letterSpacing: tokens.typography.tracking.widest,
            }}
          >
            {cur.subtitle} · {cur.code}
          </span>
        </div>
        <IconButton variant="ghost" size="sm" icon={Heart} aria-label="Like" />
      </div>

      {/* Center: transport controls + scrub */}
      <div
        className="sr-transport-center"
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: tokens.spacing[1],
        }}
      >
        <div
          className="sr-transport-controls"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: tokens.spacing[3],
          }}
        >
          <IconButton variant="ghost" size="sm" icon={Shuffle} aria-label="Shuffle" />
          <IconButton variant="ghost" size="md" icon={SkipBack} aria-label="Previous" />
          <IconButton
            variant="default"
            size="md"
            icon={playing ? Pause : Play}
            aria-label={playing ? 'Pause' : 'Play'}
            onClick={togglePlay}
          />
          <IconButton variant="ghost" size="md" icon={SkipForward} aria-label="Next" />
          <IconButton variant="ghost" size="sm" icon={Repeat} aria-label="Repeat" />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[3],
          }}
        >
          <span
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.muted,
              letterSpacing: tokens.typography.tracking.wide,
              flexShrink: 0,
              width: '40px',
              textAlign: 'right',
            }}
          >
            {formatTime(elapsed)}
          </span>
          <Slider
            min={0}
            max={cur.duration}
            step={1}
            value={elapsed}
            onValueChange={setElapsed}
            showValue={false}
            style={{ flex: 1 }}
          />
          <span
            style={{
              fontFamily: tokens.typography.fontMono,
              fontSize: tokens.typography.size.xs,
              color: tokens.color.text.muted,
              letterSpacing: tokens.typography.tracking.wide,
              flexShrink: 0,
              width: '44px',
              textAlign: 'left',
            }}
          >
            {/* Remaining time — counts down as the scrubber advances (was the
                static total, which read as "stuck" next to a moving scrubber). */}
            -{formatTime(Math.max(0, cur.duration - elapsed))}
          </span>
        </div>
      </div>

      {/* Right: volume + queue actions */}
      <div
        className="sr-transport-aux"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[3],
          flex: '0 0 260px',
          justifyContent: 'flex-end',
        }}
      >
        <IconButton variant="ghost" size="sm" icon={Queue} aria-label="Queue" />
        <IconButton variant="ghost" size="sm" icon={ListBullets} aria-label="Lyrics" />
        <SpeakerHigh size={14} weight="regular" color={tokens.color.text.muted} />
        <div style={{ width: '120px' }}>
          <Slider
            min={0}
            max={100}
            step={1}
            value={volume}
            onValueChange={setVolume}
            showValue={false}
          />
        </div>
      </div>

      <style>{`
        ${mq.md} {
          /* Phone / narrow: the desktop bar squeezed onto a phone was crowded, so
             the transport STACKS into three rows — track meta, then the
             timer/scrub, then the transport controls — one clear row each, like
             a real mobile music player. Sticky to the bottom (music-app style)
             so it stays put while the page scrolls; the shell top bar owns the
             top, so there's nothing to overlap. */
          .sr-transport {
            flex-direction: column !important;
            align-items: stretch !important;
            height: auto !important;
            padding: ${tokens.spacing[4]} !important;
            gap: ${tokens.spacing[3]} !important;
            position: sticky !important;
            bottom: ${tokens.spacing[4]} !important;
            z-index: 20 !important;
          }
          /* Row 1 — track meta across the width; the title takes the slack so
             the like button sits at the far right. */
          .sr-transport-meta { flex: 0 0 auto !important; }
          .sr-transport-title { flex: 1 1 auto !important; }
          /* Rows 2 + 3 — reverse the centre column so the timer/scrub sits ABOVE
             the transport controls (meta / timer / controls, top to bottom). */
          .sr-transport-center {
            flex: 0 0 auto !important;
            flex-direction: column-reverse !important;
            gap: ${tokens.spacing[3]} !important;
          }
          /* A little more room between the transport controls on a phone. */
          .sr-transport-controls { gap: ${tokens.spacing[4]} !important; }
          /* Volume/queue — least essential on a phone; dropped so the three
             rows stay uncrowded. */
          .sr-transport-aux { display: none !important; }
        }
      `}</style>
    </motion.div>
  );
}
