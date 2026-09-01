// ============================================================
// SELFCHECK: theme contrast
//
// Andromeda ships two palettes from one contract, so every pairing
// has to clear WCAG AA on BOTH of them. This walks the pairings the
// components actually paint and prints the ratio for each.
//
//   node design-systems/andromeda/_tools/light-contrast.selfcheck.mjs
//
// No dependencies, and no build step: Node strips the types out of
// tokens.ts on import. Exits 1 on the first failing run so it can
// sit in front of any palette change.
// ============================================================

import { tokens, light } from '../tokens.ts';

// ── Color math ───────────────────────────────────────────────────
// Everything reduces to sRGB channels 0..255 plus an alpha, so hex
// and rgb()/rgba() can be compared against each other directly.
function parse(css) {
  const s = String(css).trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, (d) => d + d) : hex[1];
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 };
  }
  const rgb = /^rgba?\(([^)]+)\)$/i.exec(s);
  if (rgb) {
    const p = rgb[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  throw new Error(`cannot parse color: ${css}`);
}

// Source-over compositing. A translucent token is never seen on its
// own, so it is flattened onto the ground it is painted over before
// anything is measured against it.
function over(top, ground) {
  const t = parse(top);
  const g = parse(ground);
  if (t.a >= 1) return t;
  const a = t.a;
  return {
    r: t.r * a + g.r * (1 - a),
    g: t.g * a + g.g * (1 - a),
    b: t.b * a + g.b * (1 - a),
    a: 1,
  };
}

function luminance(c) {
  const ch = (v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b);
}

function contrast(fg, bg) {
  const a = luminance(typeof fg === 'string' ? parse(fg) : fg);
  const b = luminance(typeof bg === 'string' ? parse(bg) : bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

// ── The pairings ─────────────────────────────────────────────────
// AA body text is 4.5. The 3.0 floor is AA for large text and for
// non-text boundaries (a border is an outline, not a word).
const BODY = 4.5;
const LARGE = 3.0;
const FAMILIES = ['accent', 'red', 'orange'];
const GROUNDS = ['base', 'raised', 'overlay'];

function pairsFor(color) {
  const out = [];

  // Text on every ground a panel can sit on.
  for (const ground of GROUNDS) {
    for (const key of ['primary', 'secondary', 'muted', 'faint']) {
      out.push({
        what: `text.${key} on surface.${ground}`,
        ratio: contrast(color.text[key], color.surface[ground]),
        min: key === 'faint' ? LARGE : BODY,
      });
    }
  }

  for (const family of FAMILIES) {
    // The two stops components use as colored text on the page ground.
    for (const stop of [200, 300]) {
      out.push({
        what: `${family}.${stop} text on surface.base`,
        ratio: contrast(color[family][stop], color.surface.base),
        min: BODY,
      });
    }
    // The pairing token: every filled badge, tag and alert takes its
    // foreground from `on`, so this is the one that must never slip.
    out.push({
      what: `${family}.on over ${family}.500 fill`,
      ratio: contrast(color[family].on, color[family][500]),
      min: BODY,
    });
    // Tinted rows (order books, heat rows) put ordinary text over an
    // alpha wash, so the wash is flattened onto the ground first.
    const tint = over(color[family].alpha, color.surface.base);
    for (const key of ['primary', 'secondary']) {
      out.push({
        what: `text.${key} over ${family}.alpha on surface.base`,
        ratio: contrast(color.text[key], tint),
        min: BODY,
      });
    }
  }

  // The heaviest border weight has to stay visible as an outline.
  out.push({
    what: 'border.strong vs surface.base',
    ratio: contrast(color.border.strong, color.surface.base),
    min: LARGE,
  });
  // Same for the glassy edge, which is alpha over the ground.
  out.push({
    what: 'border.alpha vs surface.base',
    ratio: contrast(over(color.border.alpha, color.surface.base), color.surface.base),
    min: 1.2,
  });

  return out;
}

// ── Run ──────────────────────────────────────────────────────────
const themes = [
  ['dark', tokens.color],
  ['light', light.color],
];

let failed = 0;
const failures = [];

for (const [name, color] of themes) {
  const rows = pairsFor(color);
  const width = Math.max(...rows.map((r) => r.what.length));
  console.log(`\n${name.toUpperCase()}`);
  for (const row of rows) {
    const ok = row.ratio >= row.min;
    if (!ok) {
      failed++;
      failures.push(`${name}: ${row.what} is ${row.ratio.toFixed(2)}:1, needs ${row.min.toFixed(1)}:1`);
    }
    console.log(
      `  ${ok ? 'pass' : 'FAIL'}  ${row.what.padEnd(width)}  ${row.ratio.toFixed(2)}:1  (min ${row.min.toFixed(1)})`,
    );
  }
}

if (failed) {
  console.error(`\n${failed} pairing${failed === 1 ? '' : 's'} below the floor:`);
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}

console.log(`\nAll pairings clear on both themes.`);
