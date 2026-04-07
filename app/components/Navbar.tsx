'use client'

import Link from 'next/link'
import { GithubLogo, SignIn, UploadSimple } from '@phosphor-icons/react'
import { GITHUB_URL } from '../lib/config'

export function Navbar() {

  return (
    <header className="sticky top-0 z-50 border-b border-sand-300 bg-sand-200/90 backdrop-blur dark:border-sand-800 dark:bg-sand-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold text-sand-900 dark:text-sand-50">
          <span className="text-olive-500">◈</span>
          AI Canvas
        </Link>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Submit button */}
          <button className="hidden items-center gap-1.5 rounded-full border border-sand-300 bg-transparent px-3.5 py-1.5 text-sm font-semibold text-sand-700 transition-colors hover:border-sand-400 hover:bg-sand-100 sm:flex dark:border-sand-700 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:bg-sand-800">
            <UploadSimple weight="regular" size={15} />
            Submit
          </button>

          {/* Sign in button */}
          <button className="flex items-center gap-1.5 rounded-full border border-sand-300 bg-transparent px-3.5 py-1.5 text-sm font-semibold text-sand-700 transition-colors hover:border-sand-400 hover:bg-sand-100 dark:border-sand-700 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:bg-sand-800">
            <SignIn weight="regular" size={15} />
            <span className="hidden sm:inline">Sign in</span>
          </button>

          {/* GitHub repository */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="flex items-center gap-1.5 rounded-full border border-sand-300 bg-transparent px-3.5 py-1.5 text-sm font-semibold text-sand-700 transition-colors hover:border-sand-400 hover:bg-sand-100 dark:border-sand-700 dark:text-sand-300 dark:hover:border-sand-600 dark:hover:bg-sand-800"
          >
            <GithubLogo weight="regular" size={15} />
            GitHub
          </a>

        </div>

      </div>
    </header>
  )
}
