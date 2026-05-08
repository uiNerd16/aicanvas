'use client'

import type { ReactNode } from 'react'
import { useSession } from './SessionProvider'

export function SignedIn({ children }: { children: ReactNode }) {
  const { user } = useSession()
  if (!user) return null
  return <>{children}</>
}
