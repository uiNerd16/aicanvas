'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, Crown, Lightning, Sparkle } from '@phosphor-icons/react'
import type { ComponentType, ReactNode } from 'react'
import { buttonClasses } from '../components/Button'
import { HeaderSocials } from '../components/HeaderSocials'
import { SiteFooter } from '../components/SiteFooter'
import { NerdSvg, SuperheroSvg } from '../components/auth/NerdToHero'
import { premiumEnabled } from '../../lib/flags'
import { useSession } from '../components/auth/SessionProvider'
import { UpgradeButton } from '../components/billing/UpgradeButton'

// ─── Plan data ──────────────────────────────────────────────────────────────
// Two tiers, both free. Nerd is the unauthenticated baseline; Hero is the
// signed-in experience that unlocks save/preset/export from the Lab.
// Icons are reused from the sign-up auth animation (NerdToHero).

type Plan = {
  name: string
  Icon: ComponentType
  tagline: string
  priceLabel: string
  priceSuffix: string
  cta: { label: string; href: string; variant: 'primary' | 'outline' }
  listLabel: string
  features: string[]
  featured?: boolean
}

const PLANS: Plan[] = [
  {
    name: 'Nerd',
    Icon: NerdSvg,
    tagline:
      'Browse the canvas freely. Copy any component or prompt with no account, no friction.',
    priceLabel: 'Free',
    priceSuffix: 'Forever',
    cta: { label: 'Browse Components', href: '/components', variant: 'outline' },
    listLabel: 'GET STARTED WITH',
    features: [
      'Browse every public component',
      'Copy component source code',
      'Copy prompts for Claude Code, Lovable, V0',
      'Access the MCP server',
      'Experiment in the Lab',
    ],
  },
  {
    name: 'Hero',
    Icon: SuperheroSvg,
    tagline:
      'Sign in and unlock the canvas. Save what you love, tune in the Lab, export to your machine.',
    priceLabel: 'Free',
    priceSuffix: 'Forever',
    cta: {
      label: 'Become a Hero',
      href: '/account/sign-up',
      variant: 'primary',
    },
    listLabel: 'EVERYTHING IN NERD, PLUS',
    features: [
      'Save your favorite components',
      'Save preferences across sessions',
      'Keep Lab presets you can revisit',
      'Export from the Lab directly to your computer',
      'Access to more resources and features',
    ],
    featured: true,
  },
]

// ─── Section wrapper ────────────────────────────────────────────────────────

function Section({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// ─── Plan card ──────────────────────────────────────────────────────────────

function PlanCard({ plan, delay }: { plan: Plan; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative flex flex-col rounded-3xl border bg-sand-100 p-2 dark:bg-sand-900 ${
        plan.featured
          ? 'border-olive-500/50 dark:border-olive-500/40'
          : 'border-sand-300 dark:border-sand-800'
      }`}
    >
      {/* Top — icon + name row, tagline below, then price, CTA */}
      <div className="px-5 pt-6 pb-6 sm:px-6 sm:pt-7">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-end justify-center [--ic-stroke:#1A1A19] [--ic-tint:#D4D4CC]">
            <plan.Icon />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-sand-900 dark:text-sand-50">
            {plan.name}
          </h2>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-sand-600 dark:text-sand-400">
          {plan.tagline}
        </p>

        <div className="mt-6 flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight text-sand-900 dark:text-sand-50 sm:text-5xl">
            {plan.priceLabel}
          </span>
          <span className="text-sm font-medium text-sand-500">
            / {plan.priceSuffix}
          </span>
        </div>

        <Link
          href={plan.cta.href}
          className={`mt-6 ${buttonClasses({
            variant: plan.cta.variant,
            size: 'lg',
            fullWidth: true,
          })}`}
        >
          {plan.cta.label}
        </Link>
      </div>

      {/* Bottom — features inset */}
      <div className="rounded-2xl bg-sand-200/70 px-5 py-6 dark:bg-sand-950 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sand-500">
          {plan.listLabel}
        </p>
        <ul className="mt-4 space-y-3">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-sm leading-relaxed text-sand-700 dark:text-sand-200"
            >
              <CheckCircle
                weight="regular"
                size={18}
                className={`mt-0.5 shrink-0 ${
                  plan.featured
                    ? 'text-olive-600 dark:text-olive-400'
                    : 'text-sand-400 dark:text-sand-300'
                }`}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

// ─── Premium pricing (flag-gated) ───────────────────────────────────────────
// Rendered only when NEXT_PUBLIC_PREMIUM_ENABLED=true. Free vs Premium with a
// monthly/yearly toggle, yearly default and highlighted. The Premium card
// lists ONLY the three real unlocks; every free perk stays on the Free card
// so the copy never sells free things as premium. CTAs navigate for now,
// Plan 4 wires the Paddle overlay.

const FREE_FEATURES = [
  'Browse every component, preview and prompts',
  '10 component installs a day with a free account',
  'Remix with AI, always free',
  'MCP server for Claude Code, Codex, and Cursor',
  'Lab access with presets and export',
  'Save your favorite components',
]

const PREMIUM_FEATURES = [
  'Unlimited component installs per day',
  'Pull design systems through the CLI and MCP',
  'Templates, full access',
  'Every new design system and template, included',
  'One command installs a whole system, wired up',
  'Cancel anytime',
]

function PremiumCards() {
  const { user } = useSession()
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('yearly')
  const price = cycle === 'yearly' ? '$49.99' : '$9.99'
  const suffix = cycle === 'yearly' ? 'year' : 'month'

  // Reflect the real subscription so a premium user isn't pitched "Go Premium".
  const [isPremium, setIsPremium] = useState(false)
  useEffect(() => {
    if (!user) { setIsPremium(false); return }
    let cancelled = false
    fetch('/api/me/entitlement')
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setIsPremium(d?.tier === 'premium') })
      .catch(() => {})
    return () => { cancelled = true }
  }, [user])

  return (
    <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-2">
      {/* ── Free card ── */}
      <div className="relative flex flex-col rounded-3xl border border-sand-300 bg-sand-100 p-2 dark:border-sand-800 dark:bg-sand-900">
        <div className="px-5 pt-6 pb-6 sm:px-6 sm:pt-7">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-end justify-center [--ic-stroke:#1A1A19] [--ic-tint:#D4D4CC]">
              <NerdSvg />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-sand-900 dark:text-sand-50">
              Free
            </h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-sand-600 dark:text-sand-400">
            Browse everything, install components daily, and remix with AI.
          </p>
          {/* Invisible mirror of the Premium card's billing-cycle toggle so the
              price and CTA align across both cards. Same box height, no toggle
              on the free tier. */}
          <div
            aria-hidden
            className="invisible mt-5 inline-flex rounded-lg border border-sand-300 bg-sand-200/70 p-0.5 dark:border-sand-700 dark:bg-sand-950"
          >
            <span className="rounded-md px-3 py-1 text-xs font-semibold">Monthly</span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-sand-900 dark:text-sand-50 sm:text-5xl">
              $0
            </span>
            <span className="text-sm font-medium text-sand-500">/ forever</span>
          </div>
          <Link
            href={user ? '/components' : '/account/sign-up'}
            className={`mt-6 ${buttonClasses({ variant: 'outline', size: 'lg', fullWidth: true })}`}
          >
            {user ? 'Browse Components' : 'Sign up free'}
          </Link>
        </div>
        <div className="rounded-2xl bg-sand-200/70 px-5 py-6 dark:bg-sand-950 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sand-500">
            ALWAYS INCLUDED
          </p>
          <ul className="mt-4 space-y-3">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-sand-700 dark:text-sand-200">
                <CheckCircle weight="regular" size={18} className="mt-0.5 shrink-0 text-sand-400 dark:text-sand-300" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Premium card ── */}
      <div className="relative flex flex-col rounded-3xl border border-olive-500/50 bg-sand-100 p-2 dark:border-olive-500/40 dark:bg-sand-900">
        <div className="px-5 pt-6 pb-6 sm:px-6 sm:pt-7">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-end justify-center [--ic-stroke:#1A1A19] [--ic-tint:#D4D4CC]">
              <SuperheroSvg />
            </div>
            <h2 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-sand-900 dark:text-sand-50">
              Premium
              <Crown weight="regular" size={22} className="text-olive-500 dark:text-olive-400" />
            </h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-sand-600 dark:text-sand-400">
            Everything in Free, without limits. Whole design systems and
            templates, installed with one command.
          </p>

          {/* Billing cycle toggle — yearly default + highlighted */}
          <div className="mt-5 inline-flex rounded-lg border border-sand-300 bg-sand-200/70 p-0.5 dark:border-sand-700 dark:bg-sand-950">
            <button
              type="button"
              onClick={() => setCycle('monthly')}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                cycle === 'monthly'
                  ? 'bg-sand-100 text-sand-900 dark:bg-sand-800 dark:text-sand-50'
                  : 'text-sand-500 hover:text-sand-700 dark:hover:text-sand-300'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setCycle('yearly')}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                cycle === 'yearly'
                  ? 'bg-olive-500 text-sand-950'
                  : 'text-sand-500 hover:text-sand-700 dark:hover:text-sand-300'
              }`}
            >
              Yearly <span className={cycle === 'yearly' ? 'opacity-80' : 'text-olive-600 dark:text-olive-400'}>· save 58%</span>
            </button>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-sand-900 dark:text-sand-50 sm:text-5xl">
              {price}
            </span>
            <span className="text-sm font-medium text-sand-500">/ {suffix}</span>
          </div>

          {isPremium ? (
            <Link
              href="/account/settings"
              className={`mt-6 ${buttonClasses({ variant: 'outline', size: 'lg', fullWidth: true })}`}
            >
              You&rsquo;re on Premium · Manage
            </Link>
          ) : (
            <UpgradeButton
              cycle={cycle}
              className={`mt-6 ${buttonClasses({ variant: 'primary', size: 'lg', fullWidth: true })}`}
            >
              Go Premium
            </UpgradeButton>
          )}
        </div>
        <div className="rounded-2xl bg-sand-200/70 px-5 py-6 dark:bg-sand-950 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sand-500">
            EVERYTHING IN FREE, PLUS
          </p>
          <ul className="mt-4 space-y-3">
            {PREMIUM_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-sand-700 dark:text-sand-200">
                <CheckCircle weight="regular" size={18} className="mt-0.5 shrink-0 text-olive-600 dark:text-olive-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const premium = premiumEnabled()
  return (
    <div className="flex min-h-full flex-col bg-sand-200 dark:bg-sand-950">
      {/* ── Top bar — mirrors /About: olive /Pricing centered, HeaderSocials right ── */}
      <div className="sticky top-0 z-10 hidden h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-sand-300 bg-sand-200 px-6 dark:border-sand-800 dark:bg-sand-950 md:grid">
        <div />
        <Link
          href="/pricing"
          className="text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400"
        >
          /Pricing
        </Link>
        <div className="flex justify-end">
          <HeaderSocials />
        </div>
      </div>

      <main className="relative mx-auto w-full max-w-4xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        {/* Mobile breadcrumb */}
        <p className="mb-6 text-sm font-semibold md:hidden">
          <span className="text-olive-500">/Pricing</span>
        </p>

        {/* ── Hero ── */}
        <Section className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 bg-sand-100 px-3 py-1 text-xs font-semibold text-sand-700 dark:border-sand-800 dark:bg-sand-900 dark:text-sand-300">
            <Sparkle weight="regular" size={12} className="text-olive-500 dark:text-olive-400" />
            Our Pricing Plan
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-sand-900 dark:text-sand-50">
            {premium ? 'Start free, upgrade when you need more' : 'Pick your side'}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-sand-600 dark:text-sand-400">
            {premium
              ? 'Free accounts install 10 components a day and remix with AI at no cost. Premium unlocks design systems, templates, and unlimited installs.'
              : 'AI Canvas is free, forever. Browse as a Nerd or sign up as a Hero to save your work, keep Lab presets, and export to your machine.'}
          </p>
        </Section>

        {/* ── Plan cards ── */}
        {premium ? (
          <PremiumCards />
        ) : (
          <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-2">
            {PLANS.map((plan, i) => (
              <PlanCard key={plan.name} plan={plan} delay={0.1 + i * 0.08} />
            ))}
          </div>
        )}

        {/* ── Footnote ── */}
        <Section className="mt-12 text-center sm:mt-16" delay={0.2}>
          <div className="inline-flex items-center gap-2 text-xs text-sand-500 dark:text-sand-500">
            <Lightning weight="regular" size={14} className="text-olive-500 dark:text-olive-400" />
            Everything is possible.
          </div>
        </Section>

        <SiteFooter />
      </main>
    </div>
  )
}
