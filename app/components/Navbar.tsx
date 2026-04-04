'use client'

import Link from 'next/link'
import { MagnifyingGlass, SignIn, UploadSimple } from '@phosphor-icons/react'

export function Navbar() {

  return (
    <header className="sticky top-0 z-50 border-b border-sand-300 bg-sand-200/90 backdrop-blur dark:border-sand-800 dark:bg-sand-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold text-sand-900 dark:text-sand-50">
          <span className="text-olive-500">◈</span>
          AI Toolkit
        </Link>

        {/* Search — centered, grows to fill space */}
        <div className="mx-4 flex flex-1 items-center gap-2 rounded-full border border-sand-300 bg-sand-100 px-3.5 py-2 transition-colors focus-within:border-sand-400 focus-within:bg-sand-50 dark:border-sand-700 dark:bg-sand-900 dark:focus-within:border-sand-600 dark:focus-within:bg-sand-800/50">
          <MagnifyingGlass weight="regular" size={15} className="shrink-0 text-sand-400 dark:text-sand-500" />
          <input
            type="search"
            placeholder="Search components…"
            className="flex-1 bg-transparent text-sm text-sand-700 outline-none placeholder:text-sand-400 dark:text-sand-300 dark:placeholder:text-sand-600"
          />
        </div>

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

        </div>

      </div>
    </header>
  )
}
