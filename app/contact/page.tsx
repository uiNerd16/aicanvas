'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CheckCircle } from '@phosphor-icons/react'
import { Button } from '../components/Button'
import { SiteFooter } from '../components/SiteFooter'
import { HeaderSocials } from '../components/HeaderSocials'

// ─── /contact ─────────────────────────────────────────────────────────────────
// The public contact form. Posts {name, email, message} to /api/contact, which
// sends a branded email from contact@aicanvas.me to the project inbox with
// reply_to set to the visitor. Replaces the old mailto: links in the nav.
//
// Always-dark like /privacy and /terms: colors are hardcoded to the sand-950
// palette (no `dark:` variants) because the page renders dark regardless of the
// site theme. The useEffect paints the scroll parent so overscroll stays dark.

const INPUT_CLASS =
  'w-full rounded-lg border border-sand-800 bg-sand-950 px-3 py-2 text-sm text-sand-50 outline-none transition-colors placeholder:text-sand-600 focus:border-olive-500 focus:ring-2 focus:ring-olive-500/20'
const LABEL_CLASS =
  'mb-1 block text-xs font-semibold uppercase tracking-wider text-sand-400'

export default function ContactPage() {
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

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot — must stay empty
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website }),
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
    <div ref={ref} className="min-h-full bg-sand-950">
      <header className="sticky top-0 z-50 hidden h-14 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-sand-800 bg-sand-950 px-6 md:grid">
        <div />
        <Link
          href="/contact"
          className="text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400"
        >
          /Contact
        </Link>
        <div className="flex items-center justify-end">
          <HeaderSocials />
        </div>
      </header>

      <main className="relative mx-auto max-w-xl px-4 pt-6 pb-8 sm:px-6 sm:pt-12">
        <p className="mb-6 text-sm font-semibold md:hidden">
          <span className="text-olive-500">/Contact</span>
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-sand-50 sm:text-4xl">
          Contact
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-sand-400">
          Have a question, spotted a bug, or want a component built? Send a
          message and it lands straight in our inbox. We read every one and reply
          by email, usually within a day or two.
        </p>

        {sent ? (
          <div className="mt-8 rounded-2xl border border-olive-500/30 bg-olive-500/10 p-6">
            <div className="flex items-start gap-3">
              <CheckCircle weight="regular" size={22} className="mt-0.5 shrink-0 text-olive-400" />
              <div>
                <h2 className="text-base font-bold text-sand-50">Message sent</h2>
                <p className="mt-1 text-sm leading-relaxed text-sand-300">
                  Thanks, {name || 'there'}. Your message is on its way and we&apos;ll
                  reply to <strong className="text-sand-100">{email}</strong>. No
                  account or follow-up needed on your end.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4 rounded-2xl border border-sand-800 bg-sand-900 p-6 sm:p-8"
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

            <div>
              <label htmlFor="name" className={LABEL_CLASS}>
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                autoFocus
                autoComplete="name"
                maxLength={100}
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="email" className={LABEL_CLASS}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                maxLength={200}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="message" className={LABEL_CLASS}>
                Message
              </label>
              <textarea
                id="message"
                required
                maxLength={5000}
                rows={6}
                placeholder="What's on your mind?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${INPUT_CLASS} min-h-[140px] resize-y`}
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="md" fullWidth disabled={submitting}>
              {submitting ? 'Sending…' : 'Send message'}
            </Button>

            <p className="text-xs leading-relaxed text-sand-500">
              We use your email only to reply to this message. Nothing else.
            </p>
          </form>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
