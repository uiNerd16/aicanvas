'use client'

import { useCallback, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthModal } from '../../components/auth/AuthModalProvider'
import { useSession } from '../../components/auth/SessionProvider'

// Auth gate hook for /lab/* tools. Wraps the soft-paywall pattern:
//   - signed-in user → run the action immediately
//   - signed-out user → snapshot the current tune to localStorage, open the
//     auth modal in sign-up mode with `next` set to this page, and remember
//     which action to fire on return
// On mount the hook checks localStorage for a pending hand-off matching this
// tool; if found, it hydrates the tune (via a caller-supplied `applyState`)
// and auto-fires the originally-clicked action so the user doesn't have to
// re-click after sign-up.
//
// State preservation is opaque to the hook — each tool ships its own
// SerializedState type. The hook only knows how to JSON.stringify it.

const STORAGE_KEY_PREFIX = 'lab:gate:'

type PendingHandoff<S> = {
  state: S
  action: string
}

type UseLabAuthGateArgs<S> = {
  tool: string
  // Snapshot current state to a JSON-safe value. Called when an unauthenticated
  // user clicks a gated action — the return value is stored in localStorage
  // so the tune survives the auth round-trip.
  serializeState: () => Promise<S> | S
  // Restore state from a saved snapshot. Called on mount when a pending
  // handoff is found in localStorage.
  applyState: (state: S) => void | Promise<void>
  // Map of action names to their handlers. After auth, the originally-clicked
  // action is looked up here and fired.
  actions: Record<string, () => void | Promise<void>>
}

export function useLabAuthGate<S>({
  tool,
  serializeState,
  applyState,
  actions,
}: UseLabAuthGateArgs<S>) {
  const { user } = useSession()
  const { open } = useAuthModal()
  const pathname = usePathname()
  const storageKey = STORAGE_KEY_PREFIX + tool

  // Ref the live values so the mount-effect below can call the latest
  // serialize/apply/action handlers without depending on identities.
  const actionsRef = useRef(actions)
  const applyStateRef = useRef(applyState)
  useEffect(() => {
    actionsRef.current = actions
    applyStateRef.current = applyState
  })

  // On mount: check for a pending handoff for this tool. If the user just
  // came back from sign-up and is now authenticated, hydrate + fire.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!user) return
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return

    // Always clear the entry first so a failure path doesn't loop on every
    // mount. If hydration throws, the user just loses the in-flight state.
    window.localStorage.removeItem(storageKey)

    let parsed: PendingHandoff<S> | null = null
    try {
      parsed = JSON.parse(raw) as PendingHandoff<S>
    } catch {
      return
    }
    if (!parsed?.state || !parsed?.action) return

    void Promise.resolve(applyStateRef.current(parsed.state)).then(() => {
      const handler = actionsRef.current[parsed!.action]
      if (handler) void handler()
    })
    // Only run once per mount — user is the only meaningful trigger.
  }, [user, storageKey])

  // Gate runner. Pass the action name; signed-in users get an instant call,
  // signed-out users get the modal + state snapshot.
  const run = useCallback(
    async (action: string) => {
      if (user) {
        const handler = actionsRef.current[action]
        if (handler) await handler()
        return
      }

      try {
        const state = await Promise.resolve(serializeState())
        const payload: PendingHandoff<S> = { state, action }
        window.localStorage.setItem(storageKey, JSON.stringify(payload))
      } catch {
        // If serialization fails, still open the modal — the user can sign
        // up; they just won't auto-resume their tune.
      }

      open({ mode: 'sign-up', next: pathname })
    },
    [user, open, pathname, serializeState, storageKey],
  )

  return { run, isSignedIn: !!user }
}
