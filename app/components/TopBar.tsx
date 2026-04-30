'use client'

export function TopBar({ count }: { count: number }) {
  return (
    <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center border-b border-sand-300 bg-sand-200 px-6 dark:border-sand-800 dark:bg-sand-950">
      <h1 className="text-sm font-semibold text-sand-900 dark:text-sand-50">Components</h1>
      <span className="ml-2 text-sm text-sand-400 dark:text-sand-600">{count}</span>
    </div>
  )
}
