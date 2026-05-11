'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SignInFormFields } from '../../components/auth/SignInFormFields'
import { safeNext } from '../../lib/safe-next'

// Friendly text for the `?error=…` codes the auth callback may pass through
// after an OAuth / email-confirmation failure. Unknown codes still show a
// generic message so users at least see *something* went wrong.
const CALLBACK_ERROR_MESSAGES: Record<string, string> = {
  callback_failed: 'We couldn’t complete that sign-in. Please try again.',
  missing_code: 'That sign-in link is incomplete or expired. Please request a new one.',
}

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = safeNext(searchParams.get('next'))
  const errorCode = searchParams.get('error')
  const initialError = errorCode
    ? CALLBACK_ERROR_MESSAGES[errorCode] ?? 'Sign-in failed. Please try again.'
    : null

  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-xl border border-sand-300 bg-sand-100 p-8 dark:border-sand-800 dark:bg-sand-900">
        <SignInFormFields
          next={next}
          initialError={initialError}
          onSuccess={() => {
            router.push(next)
            router.refresh()
          }}
        />
      </div>
    </div>
  )
}
