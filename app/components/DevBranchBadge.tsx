// Tiny bottom-left pill in dev mode that shows the current git branch.
// Renders nothing in production. Branch name is injected at build time
// via next.config.ts → NEXT_PUBLIC_GIT_BRANCH.

export function DevBranchBadge() {
  if (process.env.NODE_ENV !== 'development') return null
  const branch = process.env.NEXT_PUBLIC_GIT_BRANCH
  if (!branch) return null

  return (
    <div
      className="pointer-events-none fixed bottom-2 left-2 z-[9999] rounded-full bg-sand-950/80 px-2 py-0.5 font-mono text-[10px] text-sand-400 backdrop-blur-sm"
      aria-hidden="true"
    >
      {branch}
    </div>
  )
}
