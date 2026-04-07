'use client'

// ─── Sand color scale ────────────────────────────────────────────────────────

const SAND_SCALE = [
  { token: 'sand-50',  hex: '#FAF7F2', usage: 'Elevated surfaces, hover fills' },
  { token: 'sand-100', hex: '#F5F1EA', usage: 'Card bg (light), input fills' },
  { token: 'sand-200', hex: '#EDEAE5', usage: 'Page bg (light)' },
  { token: 'sand-300', hex: '#DDD8CE', usage: 'Borders (light), dividers' },
  { token: 'sand-400', hex: '#C8C2B8', usage: 'Muted borders, placeholder icons' },
  { token: 'sand-500', hex: '#9E9890', usage: 'Secondary text (light)' },
  { token: 'sand-600', hex: '#736D65', usage: 'Body text (light)' },
  { token: 'sand-700', hex: '#4A453F', usage: 'UI labels, buttons (light)' },
  { token: 'sand-800', hex: '#2E2A24', usage: 'Card bg (dark)' },
  { token: 'sand-900', hex: '#1C1916', usage: 'Page bg (dark)' },
  { token: 'sand-950', hex: '#110F0C', usage: 'Deepest dark, preview bg' },
]

const OLIVE_SCALE = [
  { token: 'olive-400', hex: '#96A452', usage: 'Hover accent, gradient end' },
  { token: 'olive-500', hex: '#7D8D41', usage: 'Primary accent — buttons, badges, logo' },
  { token: 'olive-600', hex: '#697535', usage: 'Pressed / darker accent state' },
]

// ─── Typography ──────────────────────────────────────────────────────────────

const TYPOGRAPHY = [
  { weight: 800, name: 'Extra Bold', usage: 'Hero h1', sample: 'AI Canvas' },
  { weight: 700, name: 'Bold', usage: 'Section headings', sample: 'Components' },
  { weight: 600, name: 'Semi Bold', usage: 'UI labels, buttons', sample: 'View Component' },
  { weight: 400, name: 'Regular', usage: 'Body text, descriptions', sample: 'Beautiful animated components with AI prompts.' },
]

// ─── Semantic mappings ───────────────────────────────────────────────────────

const SEMANTIC_ROLES = [
  { role: 'Page background', light: 'bg-sand-200', dark: 'bg-sand-950' },
  { role: 'Card / surface', light: 'bg-sand-100', dark: 'bg-sand-900' },
  { role: 'Elevated (navbar)', light: 'bg-sand-200/90', dark: 'bg-sand-950/90' },
  { role: 'Primary text', light: 'text-sand-900', dark: 'text-sand-50' },
  { role: 'Secondary text', light: 'text-sand-600', dark: 'text-sand-400' },
  { role: 'Border default', light: 'border-sand-300', dark: 'border-sand-800' },
  { role: 'Border hover', light: 'border-sand-400', dark: 'border-sand-700' },
  { role: 'Accent', light: 'text-olive-500', dark: 'text-olive-400' },
]

// ─── Spacing scale ───────────────────────────────────────────────────────────

const SPACING = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64]

// ─── Radius ──────────────────────────────────────────────────────────────────

const RADII = [
  { name: 'sm', value: '6px' },
  { name: 'md', value: '8px' },
  { name: 'lg', value: '12px' },
  { name: 'xl', value: '16px' },
  { name: '2xl', value: '24px' },
  { name: '3xl', value: '32px' },
  { name: 'full', value: '9999px' },
]

// ─── Component ───────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 text-2xl font-bold text-sand-900 dark:text-sand-50">
      {children}
    </h2>
  )
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-lg font-semibold text-sand-700 dark:text-sand-300">
      {children}
    </h3>
  )
}

function ColorSwatch({ hex, token, usage }: { hex: string; token: string; usage: string }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="h-12 w-12 shrink-0 rounded-xl border border-sand-300 dark:border-sand-700"
        style={{ background: hex }}
      />
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-sm font-semibold text-sand-900 dark:text-sand-100">{token}</span>
          <span className="font-mono text-xs text-sand-500">{hex}</span>
        </div>
        <p className="text-xs text-sand-500 dark:text-sand-400">{usage}</p>
      </div>
    </div>
  )
}

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
      {/* Header */}
      <div className="mb-16">
        <h1 className="mb-3 text-4xl font-extrabold text-sand-900 dark:text-sand-50">
          Design System
        </h1>
        <p className="max-w-2xl text-lg text-sand-600 dark:text-sand-400">
          AI Canvas global design tokens — colors, typography, spacing, and semantic mappings used across the entire website.
        </p>
      </div>

      {/* ── Colors ── */}
      <section className="mb-16">
        <SectionTitle>Colors</SectionTitle>

        <SubTitle>Sand Scale — Warm Neutral</SubTitle>
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SAND_SCALE.map((c) => (
            <ColorSwatch key={c.token} {...c} />
          ))}
        </div>

        <SubTitle>Olive Scale — Muted Green Accent</SubTitle>
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OLIVE_SCALE.map((c) => (
            <ColorSwatch key={c.token} {...c} />
          ))}
        </div>

        {/* Full palette strip */}
        <SubTitle>Full Palette</SubTitle>
        <div className="flex overflow-hidden rounded-2xl">
          {SAND_SCALE.map((c) => (
            <div
              key={c.token}
              className="h-16 flex-1"
              style={{ background: c.hex }}
              title={`${c.token} — ${c.hex}`}
            />
          ))}
          {OLIVE_SCALE.map((c) => (
            <div
              key={c.token}
              className="h-16 flex-1"
              style={{ background: c.hex }}
              title={`${c.token} — ${c.hex}`}
            />
          ))}
        </div>
      </section>

      {/* ── Semantic Mappings ── */}
      <section className="mb-16">
        <SectionTitle>Semantic Mappings</SectionTitle>
        <div className="overflow-hidden rounded-2xl border border-sand-300 dark:border-sand-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand-100 dark:bg-sand-900">
                <th className="px-4 py-3 text-left font-semibold text-sand-700 dark:text-sand-300">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-sand-700 dark:text-sand-300">Light</th>
                <th className="px-4 py-3 text-left font-semibold text-sand-700 dark:text-sand-300">Dark</th>
              </tr>
            </thead>
            <tbody>
              {SEMANTIC_ROLES.map((row, i) => (
                <tr
                  key={row.role}
                  className={i % 2 === 0 ? 'bg-sand-50 dark:bg-sand-950' : 'bg-sand-100 dark:bg-sand-900'}
                >
                  <td className="px-4 py-3 text-sand-900 dark:text-sand-100">{row.role}</td>
                  <td className="px-4 py-3 font-mono text-xs text-sand-600 dark:text-sand-400">{row.light}</td>
                  <td className="px-4 py-3 font-mono text-xs text-sand-600 dark:text-sand-400">{row.dark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Typography ── */}
      <section className="mb-16">
        <SectionTitle>Typography</SectionTitle>
        <p className="mb-6 text-sm text-sand-500 dark:text-sand-400">
          Font: <span className="font-semibold text-sand-700 dark:text-sand-200">Manrope</span> — loaded via next/font/google, registered as <code className="rounded bg-sand-100 px-1.5 py-0.5 font-mono text-xs dark:bg-sand-800">--font-sans</code>
        </p>
        <div className="flex flex-col gap-6">
          {TYPOGRAPHY.map((t) => (
            <div
              key={t.weight}
              className="rounded-2xl border border-sand-300 p-6 dark:border-sand-800"
            >
              <div className="mb-2 flex items-baseline gap-3">
                <span className="font-mono text-xs text-olive-500">{t.weight}</span>
                <span className="text-sm font-semibold text-sand-700 dark:text-sand-300">{t.name}</span>
                <span className="text-xs text-sand-500">— {t.usage}</span>
              </div>
              <p
                className="text-sand-900 dark:text-sand-50"
                style={{ fontWeight: t.weight, fontSize: t.weight >= 700 ? 28 : t.weight >= 600 ? 18 : 16 }}
              >
                {t.sample}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Spacing ── */}
      <section className="mb-16">
        <SectionTitle>Spacing</SectionTitle>
        <div className="flex flex-wrap items-end gap-4">
          {SPACING.map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div
                className="rounded-lg bg-olive-500"
                style={{ width: s, height: s }}
              />
              <span className="font-mono text-[10px] text-sand-500">{s}px</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Border Radius ── */}
      <section className="mb-16">
        <SectionTitle>Border Radius</SectionTitle>
        <div className="flex flex-wrap items-end gap-6">
          {RADII.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-2">
              <div
                className="h-16 w-16 border-2 border-olive-500 bg-olive-500/10"
                style={{ borderRadius: r.value }}
              />
              <span className="font-mono text-xs font-semibold text-sand-700 dark:text-sand-300">{r.name}</span>
              <span className="font-mono text-[10px] text-sand-500">{r.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Glass Effect ── */}
      <section className="mb-16">
        <SectionTitle>Glass Effect</SectionTitle>
        <p className="mb-6 text-sm text-sand-500 dark:text-sand-400">
          Used across all glass-family components. The blur layer is always on a separate non-animating div for performance.
        </p>
        <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-sand-950">
          <img
            src="https://ik.imagekit.io/aitoolkit/bg%20images/Ethereal%20Orange%20Flower%204%20(1).png?updatedAt=1775226802133"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="relative isolate rounded-3xl px-10 py-8">
            <div
              className="pointer-events-none absolute inset-0 z-[-1] rounded-3xl"
              style={{
                backdropFilter: 'blur(24px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
              }}
            />
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
              }}
            />
            <div className="relative z-10">
              <p className="mb-1 text-sm font-semibold text-white/90">Glass Panel</p>
              <p className="font-mono text-[10px] leading-relaxed text-white/40">
                blur(24px) saturate(1.8)<br />
                bg: rgba(255, 255, 255, 0.06)<br />
                border: 1px solid rgba(255, 255, 255, 0.1)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="mb-16">
        <SectionTitle>Tech Stack</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Next.js 16', detail: 'App Router' },
            { name: 'TypeScript', detail: 'Strict mode' },
            { name: 'Tailwind CSS v4', detail: '@theme inline' },
            { name: 'Framer Motion', detail: 'All animations' },
            { name: 'Phosphor Icons', detail: 'weight="regular"' },
            { name: 'Manrope', detail: 'Primary font' },
          ].map((tech) => (
            <div
              key={tech.name}
              className="rounded-2xl border border-sand-300 px-5 py-4 dark:border-sand-800"
            >
              <p className="text-sm font-semibold text-sand-900 dark:text-sand-100">{tech.name}</p>
              <p className="text-xs text-sand-500 dark:text-sand-400">{tech.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
