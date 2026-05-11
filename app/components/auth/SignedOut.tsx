'use client'

import type { ReactNode } from 'react'
import { useSession } from './SessionProvider'

export function SignedOut({ children }: { children: ReactNode }) {
  const { user } = useSession()
  if (user) return null
  return <>{children}</>
}
