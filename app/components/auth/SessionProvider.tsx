'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '../../lib/supabase/client'

type SessionContextValue = {
  user: User | null
  savedSlugs: Set<string>
  loading: boolean
  refreshSaved: () => Promise<void>
  toggleSaved: (slug: string, system: string | null) => Promise<void>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser: User | null
}) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  const refreshSaved = useCallback(async () => {
    if (!user) {
      setSavedSlugs(new Set())
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/saved', { method: 'GET' })
      if (res.ok) {
        const { slugs } = await res.json()
        setSavedSlugs(new Set(slugs))
      }
    } catch {
      // Network failure — leave the prior set in place.
    } finally {
      setLoading(false)
    }
  }, [user])

  const toggleSaved = useCallback(async (slug: string, system: string | null) => {
    if (!user) return
    const isSaved = savedSlugs.has(slug)
    setSavedSlugs((prev) => {
      const next = new Set(prev)
      if (isSaved) next.delete(slug)
      else next.add(slug)
      return next
    })
    try {
      await fetch('/api/saved', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug, system }),
      })
    } catch {
      // Roll back the optimistic update on network failure.
      setSavedSlugs((prev) => {
        const next = new Set(prev)
        if (isSaved) next.add(slug)
        else next.delete(slug)
        return next
      })
    }
  }, [user, savedSlugs])

  useEffect(() => {
    void refreshSaved()
  }, [refreshSaved])

  useEffect(() => {
    const supabase = createClient()
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  return (
    <SessionContext.Provider
      value={{ user, savedSlugs, loading, refreshSaved, toggleSaved }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within <SessionProvider>')
  return ctx
}
