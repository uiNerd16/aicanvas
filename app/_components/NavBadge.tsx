// Small pill for per-row nav highlights (New, Updated, …). Lived inline in
// DesignSystemsPole; lifted out so any nav row can reuse it.
export function NavBadge({ children, tone = 'olive' }: { children: string; tone?: 'olive' | 'cyan' }) {
  const palette =
    tone === 'cyan'
      ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
      : 'border-olive-500/30 bg-olive-500/10 text-olive-600 dark:text-olive-400'
  return (
    <span
      className={`shrink-0 rounded-md border px-1.5 py-0.5 text-xxs font-semibold uppercase tracking-wider ${palette}`}
    >
      {children}
    </span>
  )
}
