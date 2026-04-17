'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { GithubLogo, XLogo } from '@phosphor-icons/react'
import { GITHUB_URL, X_URL } from '../lib/config'

function Section({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export default function AboutPage() {
  // Set bg on the parent scroll container so there's no color bleed
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const scrollParent = ref.current?.parentElement
    if (scrollParent) {
      scrollParent.style.backgroundColor = 'var(--color-sand-950)'
      return () => { scrollParent.style.backgroundColor = '' }
    }
  }, [])

  return (
    <div ref={ref} className="min-h-full bg-sand-950">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 hidden h-14 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-sand-800 bg-sand-950/90 px-6 backdrop-blur md:grid">
        <div />
        <Link href="/components" className="text-sm font-semibold text-olive-500 transition-colors hover:text-olive-400">
          /About
        </Link>
        <div className="flex items-center justify-end gap-1">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-400 transition-colors hover:bg-sand-800 hover:text-sand-100">
            <GithubLogo weight="regular" size={20} />
          </a>
          <div className="mx-1 h-4 w-px bg-sand-700" />
          <a href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="X" className="flex h-9 w-9 items-center justify-center rounded-lg text-sand-400 transition-colors hover:bg-sand-800 hover:text-sand-100">
            <XLogo weight="regular" size={20} />
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-6 py-8 sm:px-8 sm:py-28">
        {/* Mobile breadcrumb */}
        <p className="mb-6 text-sm font-semibold md:hidden">
          <span className="text-olive-500">/About</span>
        </p>

        {/* ── The story ── */}
        <Section>
          <h1 className="text-3xl font-extrabold tracking-tight text-sand-50 sm:text-4xl">
            The Story
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-sand-400">
            We're living through a quiet shift. The way we design and build
            interfaces is changing, not with a bang, but with a conversation.
            Today you can describe what you need in plain words and watch it
            come to life. That felt like something worth exploring.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-sand-400">
            AI Canvas started as a small experiment: what if every piece of UI
            came with the right words to recreate it? Each prompt is tuned for
            Claude Code, V0, and Lovable, so you can pick the tool you're
            comfortable with and get something real on the first try.
          </p>
        </Section>

        {/* ── Why it exists ── */}
        <Section className="mt-20 sm:mt-28">
          <h2 className="text-xl font-bold tracking-tight text-sand-50">
            Why it exists
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-sand-400">
            AI tools are getting remarkably good, but the quality of what you
            get back still depends on how you ask. A thoughtful prompt produces
            something you can actually use. A vague one wastes your time.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-sand-400">
            It felt like there should be a place where prompts are treated with
            the same care as code: written thoughtfully, tested across
            platforms, and shared openly. A place built for today's workflow,
            where words are the starting point for everything you create.
          </p>
        </Section>

        {/* ── How it works ── */}
        <Section className="mt-20 sm:mt-28">
          <h2 className="text-xl font-bold tracking-tight text-sand-50">
            How it works
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-sand-400">
            Everything here, components, design systems (soon), and whatever comes
            next, is built directly with words. Most of the work happens in
            Claude Code, with Figma for visual tweaking when needed. Then each
            piece is distilled into prompts tuned per platform, because a Claude
            prompt reads differently from a V0 or Lovable prompt. The
            tools think differently.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-sand-400">
            The project itself runs on Claude Code, so the Claude prompts tend
            to give the most accurate results. But every platform is supported
            and tested. Browse, preview, pick your tool, copy the prompt.
            You can also grab the source code directly.
          </p>
          <p className="mt-4 text-sm font-bold leading-relaxed text-sand-50">
            Everything is open, nothing is locked away.
          </p>
        </Section>

        {/* ── CTA ── */}
        <Section className="mt-20 sm:mt-28">
          <div className="rounded-2xl bg-sand-900 px-5 py-6 sm:-mx-8 sm:px-6 sm:py-8">
            <p className="text-base leading-relaxed text-sand-300">
              This is an open-source project, still early, still growing.
            </p>
            <p className="mt-2 text-base leading-relaxed text-sand-300">
              If any of this resonates, come take a look.
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-olive-500 px-4 py-2 text-sm font-semibold text-sand-950 transition-colors hover:bg-olive-400"
            >
              <GithubLogo weight="regular" size={20} />
              View on GitHub
            </a>
          </div>
        </Section>

        {/* ── Footer ── */}
        <footer className="mt-20 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <img src="/icon.svg" alt="AI Canvas" className="h-5 w-5" />
            <p className="text-xs text-sand-500">AI native components. Free and open source.</p>
            <div className="flex items-center gap-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand-500 transition-colors hover:text-sand-200"
              >
                <GithubLogo weight="regular" size={18} />
              </a>
              <a
                href={X_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand-500 transition-colors hover:text-sand-200"
              >
                <XLogo weight="regular" size={18} />
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
