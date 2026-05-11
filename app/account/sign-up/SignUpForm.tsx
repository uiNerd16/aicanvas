'use client'

import { useSearchParams } from 'next/navigation'
import { SignUpFormFields } from '../../components/auth/SignUpFormFields'
import { safeNext } from '../../lib/safe-next'

export function SignUpForm() {
  const searchParams = useSearchParams()
  const next = safeNext(searchParams.get('next'))

  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-xl border border-sand-300 bg-sand-100 p-8 dark:border-sand-800 dark:bg-sand-900">
        <SignUpFormFields next={next} />
      </div>
    </div>
  )
}
