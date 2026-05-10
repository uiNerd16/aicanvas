'use client'

import { useSearchParams } from 'next/navigation'
import { SignUpFormFields } from '../../components/auth/SignUpFormFields'

export function SignUpForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/account'

  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-xl border border-sand-300 bg-sand-100 p-8 dark:border-sand-800 dark:bg-sand-900">
        <SignUpFormFields next={next} />
      </div>
    </div>
  )
}
