'use client'

import { useRouter } from 'next/navigation'
import { SignInFormFields } from '../../components/auth/SignInFormFields'
import { safeNext } from '../../lib/safe-next'

// Client wrapper for /account/sign-in. The page-level server component reads
// `?next=` and `?error=` from the URL and passes them in as props — so we
// avoid the `useSearchParams` Suspense dance and the error message renders
// on the first paint (instead of post-hydration).

type Props = {
  next: string
  initialError: string | null
}

export function SignInForm({ next: rawNext, initialError }: Props) {
  const router = useRouter()
  const next = safeNext(rawNext)

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
