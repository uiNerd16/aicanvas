'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import {
  ArrowClockwise,
  Check,
  Copy,
  DeviceMobile,
  DeviceTablet,
  Lightning,
  Monitor,
  SignIn,
  Terminal,
} from '@phosphor-icons/react'
import { useSession } from '../components/auth/SessionProvider'
import { useAuthModal } from '../components/auth/AuthModalProvider'
import { usePaywallModal } from '../components/billing/PaywallModalProvider'
import { usePremiumStatus } from '../components/billing/usePremiumStatus'
import { EmailAvatar } from '../components/auth/EmailAvatar'
import { Button, buttonClasses } from '../components/Button'

// ────────────────────────────────────────────────────────────────────────────
// TemplatePreviewShell — the shared top-bar chrome for design-system template
// previews (replaces the old floating TemplateChrome widget on these routes).
//
//   ┌ logo · System / Template ──── ▢ desktop tablet phone | ↺ ──── Install / Unlock · auth ┐
//
// Device toggles give TRUE responsive previews: tablet/phone load the same
// route inside an <iframe> so the composition's CSS @media queries fire against
// the iframe's own viewport width (Andromeda is desktop-first / max-width).
// Desktop renders the children directly (native, full-bleed — no frame).
//
// The iframe payload is this same route with `?frame=1`, which makes the shell
// render ONLY the children (no recursive chrome).
// ────────────────────────────────────────────────────────────────────────────

type Device = 'desktop' | 'tablet' | 'phone'

// Honest device viewport widths. Desktop is frameless (width doesn't matter —
// it fills). Tablet ≈ iPad portrait, phone ≈ iPhone 14.
const DEVICES: Record<
  Exclude<Device, 'desktop'>,
  { label: string; width: number }
> = {
  tablet: { label: 'Tablet', width: 834 },
  phone: { label: 'Phone', width: 390 },
}

const DEVICE_ORDER: { key: Device; label: string; icon: ComponentType<{ weight?: 'regular'; size?: number }> }[] = [
  { key: 'desktop', label: 'Desktop', icon: Monitor },
  { key: 'tablet', label: 'Tablet', icon: DeviceTablet },
  { key: 'phone', label: 'Phone', icon: DeviceMobile },
]

interface TemplatePreviewShellProps {
  templateSlug: string // registry slug, e.g. 'andromeda-mission-control'
  templateName: string // e.g. 'Mission Control'
  systemName: string // e.g. 'Andromeda'
  systemHref: string // where the system-name crumb links, e.g. the showcase
  description?: string[] // overrides the install-popover bullet copy
  children: ReactNode // the template composition
}

export function TemplatePreviewShell(props: TemplatePreviewShellProps) {
  // useSearchParams() must sit under a Suspense boundary. Fallback = the
  // full-chrome shell (frame flag defaults false), so there's no flash.
  return (
    <Suspense fallback={<ShellInner {...props} forceFrame={false} />}>
      <ShellInner {...props} />
    </Suspense>
  )
}

function ShellInner({
  templateSlug,
  templateName,
  systemName,
  systemHref,
  description,
  children,
  forceFrame,
}: TemplatePreviewShellProps & { forceFrame?: boolean }) {
  const searchParams = useSearchParams()
  const isFramePayload = forceFrame ?? searchParams.get('frame') === '1'

  // Inside the iframe: render the composition bare, no chrome, no recursion.
  if (isFramePayload) {
    return <div className="relative h-full w-full">{children}</div>
  }

  return (
    <PreviewChrome
      templateSlug={templateSlug}
      templateName={templateName}
      systemName={systemName}
      systemHref={systemHref}
      description={description}
    >
      {children}
    </PreviewChrome>
  )
}

function PreviewChrome({
  templateSlug,
  templateName,
  systemName,
  systemHref,
  description,
  children,
}: Omit<TemplatePreviewShellProps, 'children'> & { children: ReactNode }) {
  const pathname = usePathname() ?? ''
  const [device, setDevice] = useState<Device>('desktop')

  return (
    <div className="flex h-full min-h-full w-full flex-col">
      <TopBar
        templateSlug={templateSlug}
        templateName={templateName}
        systemName={systemName}
        systemHref={systemHref}
        description={description}
        device={device}
        onDevice={setDevice}
      />

      {/* Preview region */}
      <div className="relative min-h-0 flex-1">
        {/* Desktop: native, full-bleed. */}
        <div className={device === 'desktop' ? 'h-full w-full' : 'hidden'}>{children}</div>

        {/* Tablet / phone: real viewport via iframe on a device backdrop. Kept
            mounted across the two so switching just resizes (media queries
            re-fire on resize) instead of reloading. */}
        {device !== 'desktop' && (
          <div className="absolute inset-0 flex items-stretch justify-center overflow-auto bg-sand-950 p-4 md:p-6">
            <iframe
              title={`${templateName} responsive preview`}
              src={`${pathname}?frame=1`}
              style={{ width: DEVICES[device].width }}
              className="h-full max-w-full shrink-0 rounded-2xl border border-sand-800 bg-sand-950 shadow-2xl transition-[width] duration-300 ease-out"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Top bar ─────────────────────────────────────────────────────────────────

function TopBar({
  templateSlug,
  templateName,
  systemName,
  systemHref,
  description,
  device,
  onDevice,
}: Omit<TemplatePreviewShellProps, 'children'> & {
  device: Device
  onDevice: (d: Device) => void
}) {
  return (
    <header className="sticky top-0 z-50 grid h-14 shrink-0 grid-cols-[auto_1fr] items-center gap-2 border-b border-sand-300 bg-sand-200/90 px-3 backdrop-blur md:grid-cols-[1fr_auto_1fr] dark:border-sand-800 dark:bg-sand-950/90">
      {/* Left — logo + breadcrumb */}
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/"
          aria-label="AI Canvas home"
          className="flex shrink-0 items-center gap-2 font-bold text-sand-900 dark:text-sand-50"
        >
          <img src="/ai-canvas-icon.svg" alt="" width={20} height={17} className="shrink-0" />
          <span className="hidden lg:inline">AI Canvas</span>
        </Link>
        <span className="h-5 w-px shrink-0 bg-sand-300 dark:bg-sand-800" aria-hidden />
        <nav aria-label="Breadcrumb" className="min-w-0 truncate text-sm font-semibold">
          <Link
            href={systemHref}
            className="text-sand-600 transition-colors hover:text-sand-900 dark:text-sand-400 dark:hover:text-sand-100"
          >
            {systemName}
          </Link>
          <span className="mx-1 text-sand-400 dark:text-sand-600">/</span>
          <span className="text-olive-500">{templateName}</span>
        </nav>
      </div>

      {/* Middle — device toggles + reset (desktop only; on a phone you already
          see the responsive layout). */}
      <div className="hidden items-center gap-1 justify-self-center rounded-lg border border-sand-300 bg-sand-100 p-1 md:flex dark:border-sand-800 dark:bg-sand-900">
        {DEVICE_ORDER.map(({ key, label, icon: Icon }) => {
          const active = device === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onDevice(key)}
              aria-label={`${label} preview`}
              aria-pressed={active}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                active
                  ? 'bg-sand-50 text-sand-900 shadow-sm dark:bg-sand-800 dark:text-sand-50'
                  : 'text-sand-500 hover:text-sand-800 dark:text-sand-400 dark:hover:text-sand-100'
              }`}
            >
              <Icon weight="regular" size={18} />
            </button>
          )
        })}
        <span className="mx-0.5 h-5 w-px bg-sand-300 dark:bg-sand-700" aria-hidden />
        <button
          type="button"
          onClick={() => onDevice('desktop')}
          aria-label="Reset to desktop"
          disabled={device === 'desktop'}
          className="flex h-8 w-8 items-center justify-center rounded-md text-sand-500 transition-colors hover:text-sand-800 disabled:opacity-40 disabled:hover:text-sand-500 dark:text-sand-400 dark:hover:text-sand-100 dark:disabled:hover:text-sand-400"
        >
          <ArrowClockwise weight="regular" size={17} />
        </button>
      </div>

      {/* Right — entitlement CTA + auth */}
      <div className="flex items-center justify-end gap-2">
        <RightCluster
          templateSlug={templateSlug}
          systemName={systemName}
          description={description}
        />
      </div>
    </header>
  )
}

// ── Right cluster: Install (premium) / Unlock (free-anon) + auth ─────────────

function RightCluster({
  templateSlug,
  systemName,
  description,
}: {
  templateSlug: string
  systemName: string
  description?: string[]
}) {
  const { user } = useSession()
  const { open: openAuthModal } = useAuthModal()
  const status = usePremiumStatus()
  // Install shows for premium AND the in-flight 'unknown' window — only a
  // RESOLVED free/anon tier sees the Unlock pitch (never flash an upgrade at a
  // paying customer mid-load). Anon derives to 'not-premium' synchronously.
  const canInstall = status !== 'not-premium'

  return (
    <>
      {canInstall ? (
        <InstallButton templateSlug={templateSlug} systemName={systemName} description={description} />
      ) : (
        <Link href="/pricing" className={buttonClasses({ variant: 'primary', size: 'sm' })}>
          <Lightning weight="regular" size={14} />
          <span className="hidden sm:inline">Unlock with Premium</span>
          <span className="sm:hidden">Unlock</span>
        </Link>
      )}

      {user ? (
        <Link
          href="/account"
          aria-label="Account"
          className={buttonClasses({ variant: 'outline', size: 'xs', iconOnly: true })}
        >
          <EmailAvatar email={user.email ?? 'Account'} className="h-4 w-4" />
        </Link>
      ) : (
        <Button variant="outline" size="xs" onClick={() => openAuthModal()}>
          <SignIn size={13} weight="regular" />
          <span className="hidden sm:inline">Sign in</span>
        </Button>
      )}
    </>
  )
}

// ── Install button + CLI popover (ported from TemplateChrome, opens downward) ─

function InstallButton({
  templateSlug,
  systemName,
  description,
}: {
  templateSlug: string
  systemName: string
  description?: string[]
}) {
  const { user } = useSession()
  const { open: openPaywall } = usePaywallModal()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Tokenized install for signed-in users so the registry attributes the pull
  // to the account (templates are premium — a plain command would 402). The
  // token is masked on screen; copy writes the real one.
  const [fetchedToken, setFetchedToken] = useState<string | null>(null)
  useEffect(() => {
    if (!user) return
    let cancelled = false
    const refresh = () =>
      fetch('/api/me/token')
        .then((r) => r.json())
        .then((d) => {
          if (!cancelled) setFetchedToken(d?.token ?? null)
        })
        .catch(() => {})
    refresh()
    window.addEventListener('focus', refresh)
    return () => {
      cancelled = true
      window.removeEventListener('focus', refresh)
    }
  }, [user])

  const userToken = user ? fetchedToken : null
  const installReference = userToken
    ? `"https://aicanvas.me/r/${templateSlug}.json?token=${userToken}"`
    : `@aicanvas/${templateSlug}`
  const installReferenceMasked = userToken
    ? `"https://aicanvas.me/r/${templateSlug}.json?token=aic_••••••••"`
    : `@aicanvas/${templateSlug}`
  const cliCommand = `npx shadcn@latest add ${installReference}`
  const cliCommandMasked = `npx shadcn@latest add ${installReferenceMasked}`

  const bullets = description ?? [
    `Installs this template plus the full ${systemName} system.`,
    `Subsequent templates reuse what's already there.`,
  ]

  // Non-premium hitting Install sees the paywall instead of the popover. Fails
  // open (opens the popover) so a hiccup never dead-ends the button.
  async function handleInstall() {
    try {
      const res = await fetch(`/api/me/install-check?slug=${templateSlug}`)
      const d = await res.json().catch(() => null)
      if (d?.blocked) {
        openPaywall({ reason: 'premium-only', limit: d.limit, resetAt: d.resetAt })
        return
      }
    } catch {}
    setOpen((o) => !o)
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(cliCommand)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <Button variant="primary" size="sm" onClick={handleInstall}>
        <Terminal weight="regular" size={14} />
        Install
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(480px,calc(100vw-24px))] overflow-hidden rounded-xl border border-sand-300 bg-sand-100 shadow-2xl dark:border-sand-800 dark:bg-sand-900">
          <div className="space-y-3 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {copied ? (
                  <span className="text-xs font-semibold uppercase tracking-wider text-olive-500 dark:text-olive-400">
                    Install command copied
                  </span>
                ) : (
                  <>
                    <span className="text-xs font-semibold uppercase tracking-wider text-sand-500 dark:text-sand-400">
                      CLI install
                    </span>
                    <span className="rounded-md border border-olive-500/30 bg-olive-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-olive-600 dark:text-olive-400">
                      One command
                    </span>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy CLI command"
                className="rounded-md p-1.5 text-sand-500 transition-colors hover:bg-sand-200 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-800/60 dark:hover:text-sand-100"
              >
                {copied ? (
                  <Check weight="regular" size={14} className="text-olive-500 dark:text-olive-400" />
                ) : (
                  <Copy weight="regular" size={14} />
                )}
              </button>
            </div>
            <div className="rounded-lg bg-sand-950 px-4 py-3">
              <code className="block break-all font-mono text-xs text-sand-300">{cliCommandMasked}</code>
            </div>
            <div className="space-y-1.5">
              {bullets.map((line, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check weight="bold" size={12} className="shrink-0 text-olive-500 dark:text-olive-400" />
                  <p className="text-xs leading-relaxed text-sand-600 dark:text-sand-400">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
