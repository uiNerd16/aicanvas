'use client'

import Link from 'next/link'
import { SignIn } from '@phosphor-icons/react'

export function SignInCta() {
  return (
    <Link
      href="/account/sign-in"
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-sand-700 transition-colors hover:bg-sand-300/50 hover:text-sand-900 dark:text-sand-300 dark:hover:bg-sand-800/60 dark:hover:text-sand-100"
    >
      <SignIn size={16} weight="regular" />
      <span>Sign in</span>
    </Link>
  )
}
