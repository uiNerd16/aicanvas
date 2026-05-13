'use client'

import type { ReactNode } from 'react'

export function SectionLabel({
  children,
  value,
}: {
  children: ReactNode
  value?: ReactNode
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between">
      <span className="text-xs font-semibold text-sand-500 dark:text-sand-500">
        {children}
      </span>
      {value !== undefined && (
        <span className="font-mono text-xs text-sand-600 dark:text-sand-400">
          {value}
        </span>
      )}
    </div>
  )
}
