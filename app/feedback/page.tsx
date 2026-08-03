'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Bug,
  ChatCircleText,
  CheckCircle,
  CreditCard,
  DotsThreeCircle,
  Smiley,
  SmileyMeh,
  SmileySad,
  Sparkle,
} from '@phosphor-icons/react'
import { Button } from '../components/Button'
import { SiteFooter } from '../components/SiteFooter'
import { HeaderSocials } from '../components/HeaderSocials'

// ─── /feedback ────────────────────────────────────────────────────────────────
// The category-first feedback form. Sibling of /contact, deliberately a separate
// page with a different job:
//
//   /contact   "I need a human to answer me"  → email required, reply expected
//   /feedback  "here is one thing to improve" → email OPTIONAL, no reply promised
//
// Making email optional is the whole point. It is the single biggest lever on
// completion for feedback (vs contact), because leaving an address reads as a
// commitment to a conversation the person may not want.
//
// Posts to /api/feedback, which prefixes the email subject with the category
// ([Bug], [Billing], …) so Gmail filters do the triage. There is no database:
// the inbox IS the backlog until it stops being readable.
//
// Deep links preset the form: /feedback?type=bug&from=scroll-wipe-gallery
//
// Always-dark like /contact, /privacy and /terms: colors are hardcoded to the
// sand-950 palette (no `dark:` variants) because the page renders dark
// regardless of site theme. The useEffect paints the scroll parent so overscroll
// stays dark. The footer lives INSIDE <main> so its edges line up with content.

const INPUT_CLASS =
  'w-full rounded-lg border border-sand-800 bg-sand-950 px-3 py-2 text-base text-sand-50 outline-none transition-colors placeholder:text-sand-600 focus:border-olive-500 focus:ring-2 focus:ring-olive-500/20 md:text-sm'
const LABEL_CLASS =
  'mb-1 block text-xs font-semibold uppercase tracking-wider text-sand-400'

type CategoryId = 'general' | 'bug' | 'billing' | 'request' | 'other'

const CATEGORIES: { id: CategoryId; label: string; icon: React.ReactNode }[] = [
  { id: 'general', label: 'General feedback', icon: <ChatCircleText weight="regular" size={18} /> },
  { id: 'bug', label: 'Found a bug', icon: <Bug weight="regular" size={18} /> },
  { id: 'billing', label: 'Payment or subscription', icon: <CreditCard weight="regular" size={18} /> },
  { id: 'request', label: 'Component request', icon: <Sparkle weight="regular" size={18} /> },
  { id: 'other', label: 'Something else', icon: <DotsThreeCircle weight="regular" size={18} /> },
]

const SENTIMENTS: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'rough', label: 'Rough', icon: <SmileySad weight="regular" size={22} /> },
  { id: 'fine', label: 'Fine', icon: <SmileyMeh weight="regular" size={22} /> },
  { id: 'great', label: 'Great', icon: <Smiley weight="regular" size={22} /> },
]

// Selectable chip. Wraps a visually hidden native radio so keyboard support,
// arrow-key roving and form semantics come free instead of being reimplemented
// with role="radio" and a keydown handler.
//
// Layout utilities (gap, padding, direction) stay at the call site: the two chip
// rows want different ones, and this repo has no twMerge helper, so overlapping
// utilities in one string would resolve by CSS order rather than by intent.
const CHIP_BASE =
  'flex cursor-pointer items-center rounded-lg border px-3 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-olive-500/40'

function chipTone(selected: boolean): string {
  return selected
    ? 'border-olive-500 bg-olive-500/10 text-sand-50'
    : 'border-sand-800 bg-sand-950 text-sand-300 hover:border-sand-700 hover:text-sand-100'
}

export default function FeedbackPage() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const scrollParent = ref.current?.parentElement
    if (scrollParent) {
      scrollParent.style.backgroundColor = 'var(--color-sand-950)'
      return () => {
        scrollParent.style.backgroundColor = ''
      }
    }
  }, [])

  const [category, setCategory] = useState<CategoryId>('general')
  const [sentiment, setSentiment] = useState('')
  const [message, setMessage] = useState('')
  const [where, setWhere] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot — must stay empty
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Deep-link presets, read from window rather than useSearchParams so the page
  // needs no Suspense boundary and keeps static rendering.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const type = params.get('type')
    if (type && CATEGORIES.some((c) => c.id === type)) setCategory(type as CategoryId)
    const from = params.get('from')
    if (from) setWhere(from.slice(0, 200))
  }, [])

  // Billing is support, not feedback: without an address we cannot fix anyone's
  // charge, so it is the one branch where the reply channel is mandatory.
  const emailRequired = category === 'billing'
  // "How is it going" is tone-deaf to someone who was charged twice.
  const showSentiment = category !== 'billing'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          sentiment: showSentiment ? sentiment : '',
          message,
          where,
          email,
          website,
          // Attached silently. Asking a person for their browser version is
          // friction and they get it wrong anyway.
          context: {
            referrer: document.referrer || '',
            viewport: `${window.innerWidth}x${window.innerHeight}`,
          },
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || 'Something went wrong. Please try again.')
        return
      }
      setSent(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div ref={ref} className="flex min-h-full flex-col bg-sand-950">
      <header className="sticky top-0 z-50 hidden h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-sand-800 bg-sand-950 px-6 md:grid">
        <div />
        <Link
          href="/feedback"
          className="text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400"
        >
          /Feedback
        </Link>
        <div className="flex items-center justify-end">
          <HeaderSocials />
        </div>
      </header>

      <main className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        <div className="flex-1">
          <p className="mb-6 text-sm font-semibold md:hidden">
            <span className="text-olive-500">/Feedback</span>
          </p>

          <h1 className="text-center text-3xl font-extrabold tracking-tight text-sand-50 sm:text-4xl">
            Feedback
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-sand-400">
            One thing we should fix, build, or stop doing. Pick a category, say
            it in a sentence, and leave an email only if you want an answer. This
            is what decides what we work on next.
          </p>

          {sent ? (
            <div className="mx-auto mt-8 w-full max-w-xl rounded-2xl border border-olive-500/30 bg-olive-500/10 p-6">
              <div className="flex items-start gap-3">
                <CheckCircle weight="regular" size={22} className="mt-0.5 shrink-0 text-olive-400" />
                <div>
                  <h2 className="text-base font-bold text-sand-50">Got it, thank you</h2>
                  <p className="mt-1 text-sm leading-relaxed text-sand-300">
                    {email ? (
                      <>
                        We read every single one. We&apos;ll reply to{' '}
                        <strong className="text-sand-100">{email}</strong>, usually
                        within a day or two.
                      </>
                    ) : (
                      <>
                        We read every single one. You didn&apos;t leave an email, so
                        there won&apos;t be a reply, but this still lands on the list
                        that decides what gets built.
                      </>
                    )}
                  </p>
                  <Link
                    href="/components"
                    className="mt-4 inline-block text-sm font-semibold text-olive-400 transition-colors hover:text-olive-300"
                  >
                    Back to components
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 w-full max-w-xl space-y-5 rounded-2xl border border-sand-800 bg-sand-900 p-6 sm:p-8"
            >
              {/* Honeypot: off-screen, hidden from humans and assistive tech. */}
              <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <fieldset>
                <legend className={LABEL_CLASS}>What&apos;s this about?</legend>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {CATEGORIES.map((c) => (
                    <label key={c.id} className={`${CHIP_BASE} gap-2 py-2.5 ${chipTone(category === c.id)}`}>
                      <input
                        type="radio"
                        name="category"
                        value={c.id}
                        checked={category === c.id}
                        onChange={() => setCategory(c.id)}
                        className="sr-only"
                      />
                      <span className="shrink-0">{c.icon}</span>
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {showSentiment && (
                <fieldset>
                  <legend className={LABEL_CLASS}>
                    How has AI Canvas been so far?{' '}
                    <span className="font-normal normal-case tracking-normal text-sand-500">
                      optional
                    </span>
                  </legend>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {SENTIMENTS.map((s) => (
                      <label
                        key={s.id}
                        className={`${CHIP_BASE} flex-col justify-center gap-1 py-3 ${chipTone(sentiment === s.id)}`}
                      >
                        <input
                          type="radio"
                          name="sentiment"
                          value={s.id}
                          checked={sentiment === s.id}
                          onChange={() => setSentiment(s.id)}
                          className="sr-only"
                        />
                        {s.icon}
                        <span>{s.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {category === 'bug' && (
                <div>
                  <label htmlFor="where" className={LABEL_CLASS}>
                    Where did it happen?
                  </label>
                  <input
                    id="where"
                    type="text"
                    maxLength={200}
                    placeholder="Component name or page URL"
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
              )}

              <div>
                <label htmlFor="message" className={LABEL_CLASS}>
                  {category === 'bug'
                    ? 'What happened, and what did you expect?'
                    : category === 'request'
                      ? 'What should we build?'
                      : category === 'billing'
                        ? 'What went wrong?'
                        : 'Your feedback'}
                </label>
                <textarea
                  id="message"
                  required
                  // No autoFocus: it would scroll the category chips out of view
                  // on load and pop the mobile keyboard before the first choice.
                  maxLength={5000}
                  rows={6}
                  placeholder={
                    category === 'bug'
                      ? 'I clicked the copy button and nothing happened. I expected the code on my clipboard.'
                      : 'Say it however you like. One sentence is plenty.'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${INPUT_CLASS} min-h-[140px] resize-y`}
                />
              </div>

              <div>
                <label htmlFor="email" className={LABEL_CLASS}>
                  {emailRequired ? 'Email used at checkout' : 'Email'}
                </label>
                <input
                  id="email"
                  type="email"
                  required={emailRequired}
                  autoComplete="email"
                  maxLength={200}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={INPUT_CLASS}
                  aria-describedby="email-hint"
                />
                <p id="email-hint" className="mt-1.5 text-xs leading-relaxed text-sand-500">
                  {emailRequired
                    ? 'Required for payment issues. We need it to find your account and fix the charge.'
                    : 'Optional. Only if you want a reply.'}
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" size="md" fullWidth disabled={submitting}>
                {submitting ? 'Sending…' : 'Send feedback'}
              </Button>

              <p className="text-center text-xs leading-relaxed text-sand-500">
                We also attach the page you came from, your screen size and your
                browser, so bug reports are actually fixable. Nothing is stored in
                a database, it goes straight to our inbox. See the{' '}
                <Link href="/privacy" className="text-sand-400 underline underline-offset-2 hover:text-sand-200">
                  privacy policy
                </Link>
                .
              </p>
            </form>
          )}
        </div>

        <SiteFooter />
      </main>
    </div>
  )
}
