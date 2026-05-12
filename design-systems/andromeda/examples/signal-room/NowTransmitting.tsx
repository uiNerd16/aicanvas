// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SIGNAL ROOM: Now Transmitting
// Hero panel. Replaces the Spotify "Sound without limits"
// marketing hero with a telemetry-style readout of the active
// stream: title + description on the left, live waveform
// visualisation on the right. The 4 StatTiles (signal/bitrate/
// latency/channel) live OUTSIDE this panel as a sibling row —
// nesting corner-marked surfaces inside another corner-marked
// surface produces bracket-inside-bracket clutter. See rules.md
// → "Frames don't nest". The waveform is the only live element
// in the hero — it redraws every 1.4s to signal continuous
// transmission (movement signals data movement).
// ============================================================

'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Play, Heart } from '@phosphor-icons/react';
import { tokens } from '../../tokens';
import { Card } from '../../components/Card';
import { PanelHeader } from '../../components/PanelHeader';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { useReducedMotion } from '../../components/lib/motion';

const WAVE_SAMPLES = 120;
const WAVE_W = 800;
const WAVE_H = 120;
const STEP_X = WAVE_W / (WAVE_SAMPLES - 1);
const MID_Y  = WAVE_H / 2;
const AMP    = WAVE_H * 0.4;

// Deterministic-ish noise that takes a continuous time value (in seconds).
// Pure superposition of sines — passing fractional `t` (rather than integer
// ticks) makes the waveform morph smoothly frame-to-frame instead of
// snapping. Returns the array of normalised values for one full waveform;
// the consumer derives the polyline points AND the level-bar path from it
// so they share a single source of truth.
function computeValues(t) {
  const out = new Array(WAVE_SAMPLES);
  for (let i = 0; i < WAVE_SAMPLES; i++) {
    const x = (i / WAVE_SAMPLES) * Math.PI * 6;
    const base = Math.sin(x + t * 0.7) * 0.5 + Math.sin(x * 2.3 + t) * 0.25;
    const wobble = (Math.sin(i * 0.13 + t * 1.4) + Math.cos(i * 0.07 + t)) * 0.12;
    out[i] = base + wobble;
  }
  return out;
}

function pointsFrom(values) {
  let out = '';
  for (let i = 0; i < WAVE_SAMPLES; i++) {
    out += `${(i * STEP_X).toFixed(2)},${(MID_Y + values[i] * AMP).toFixed(2)} `;
  }
  return out;
}

// Build a single path with all level bars as alternating M/L pairs — one
// `<path>` updates with a single `setAttribute('d', …)` per frame, instead
// of 240 line elements each. Bars sit a few px clear of the centreline so
// they don't touch the polyline.
function barsFrom(values) {
  let d = '';
  for (let i = 0; i < WAVE_SAMPLES; i++) {
    const x = i * STEP_X;
    const h = Math.abs(values[i]) * (WAVE_H * 0.18);
    d += `M${x.toFixed(2)},${(MID_Y - h - 4).toFixed(2)}L${x.toFixed(2)},${(MID_Y - 4).toFixed(2)}`;
    d += `M${x.toFixed(2)},${(MID_Y + 4).toFixed(2)}L${x.toFixed(2)},${(MID_Y + h + 4).toFixed(2)}`;
  }
  return d;
}

function LiveWaveform() {
  const reduced = useReducedMotion();
  const lineRef = useRef(null);
  const barsRef = useRef(null);

  // SSR + reduced-motion: render a single static frame at t=0. The rAF
  // loop below only runs in the browser when motion is allowed.
  const initialPoints = useMemo(() => pointsFrom(computeValues(0)), []);
  const initialBars   = useMemo(() => barsFrom(computeValues(0)),   []);

  useEffect(() => {
    if (reduced) return undefined;

    let raf = 0;
    let last = performance.now();
    let t = 0;

    const tick = (now) => {
      // Continuous time — fractional dt makes the morph framerate-independent.
      // Speed (0.6) tuned so the wave reads as "lively but unhurried" — fast
      // enough to feel alive, slow enough that the eye can follow individual
      // peaks rolling across.
      const dt = (now - last) / 1000;
      last = now;
      t += dt * 0.6;

      const values = computeValues(t);
      if (lineRef.current) lineRef.current.setAttribute('points', pointsFrom(values));
      if (barsRef.current) barsRef.current.setAttribute('d',      barsFrom(values));

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <div style={{ position: 'relative', width: '100%', height: WAVE_H }}>
      <svg
        width="100%"
        height={WAVE_H}
        viewBox={`0 0 ${WAVE_W} ${WAVE_H}`}
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        {/* Centreline reference */}
        <line
          x1={0}
          x2={WAVE_W}
          y1={MID_Y}
          y2={MID_Y}
          stroke={tokens.color.border.subtle}
          strokeDasharray="2 4"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        {/* Level bars — mirrored verticals as a single path for fast updates */}
        <path
          ref={barsRef}
          d={initialBars}
          fill="none"
          stroke={tokens.color.text.faint}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        {/* Waveform polyline — text.primary per single-series rule. Animated
            via rAF writing directly to the `points` attribute (CSS can't
            transition SVG point lists). */}
        <polyline
          ref={lineRef}
          fill="none"
          stroke={tokens.color.text.primary}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          points={initialPoints}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export function NowTransmitting() {
  return (
    <Card style={{ width: '100%' }}>
      <PanelHeader
        title="Now transmitting"
        actions={
          <Badge variant="accent">
            Live · Channel 04
          </Badge>
        }
      />

      <div style={{ padding: tokens.spacing[5] }}>
        <div style={{ display: 'flex', gap: tokens.spacing[5], alignItems: 'stretch' }}>
          {/* Left: stream metadata */}
          <div
            style={{
              flex: '0 0 36%',
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing[3],
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
              <span
                style={{
                  fontFamily: tokens.typography.fontMono,
                  fontSize: tokens.typography.size.xs,
                  color: tokens.color.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: tokens.typography.tracking.widest,
                }}
              >
                /// Featured stream
              </span>
              <h2
                style={{
                  margin: 0,
                  fontFamily: tokens.typography.fontSans,
                  fontSize: tokens.typography.size['3xl'],
                  fontWeight: tokens.typography.weight.semibold,
                  color: tokens.color.text.primary,
                  letterSpacing: '-0.02em',
                  lineHeight: tokens.typography.lineHeight.tight,
                }}
              >
                Sound without limits.
              </h2>
              <p
                style={{
                  margin: 0,
                  fontFamily: tokens.typography.fontSans,
                  fontSize: tokens.typography.size.sm,
                  color: tokens.color.text.secondary,
                  lineHeight: tokens.typography.lineHeight.normal,
                  maxWidth: '40ch',
                }}
              >
                Continuous transmission across 12 channels, mastered at 320 kbps.
                Discover the weekly mix or tune any frequency on the dial.
              </p>
            </div>

            <div style={{ display: 'flex', gap: tokens.spacing[3], alignItems: 'center' }}>
              <Button variant="default" size="sm" icon={Play}>
                Engage stream
              </Button>
              <Button variant="outline" size="sm" icon={Heart}>
                Save
              </Button>
            </div>
          </div>

          {/* Right: live waveform */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing[2],
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span
                style={{
                  fontFamily: tokens.typography.fontMono,
                  fontSize: tokens.typography.size.xs,
                  color: tokens.color.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: tokens.typography.tracking.widest,
                }}
              >
                /// Waveform
              </span>
              <span
                style={{
                  fontFamily: tokens.typography.fontMono,
                  fontSize: tokens.typography.size.xs,
                  color: tokens.color.text.faint,
                  textTransform: 'uppercase',
                  letterSpacing: tokens.typography.tracking.widest,
                }}
              >
                T-LIVE · 96 SAMPLES/S
              </span>
            </div>
            <LiveWaveform />
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
              <span>−12dB</span>
              <span>0dB</span>
              <span>+12dB</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
