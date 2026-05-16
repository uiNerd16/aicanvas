import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { createClient } from '../../lib/supabase/server'
import { EmailAvatar } from '../../components/auth/EmailAvatar'
import { AccountTabs } from './AccountTabs'
import { AccountTopBar } from './AccountTopBar'

export default async function MemberLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/account/sign-in?next=/account')

  const email = user.email ?? 'Account'

  return (
    <>
      <AccountTopBar />
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 flex items-center gap-4 sm:mb-8">
          <EmailAvatar email={email} className="h-12 w-12 shrink-0 sm:h-16 sm:w-16" />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-sand-900 dark:text-sand-50 sm:text-3xl">Your account</h1>
            <p className="mt-1 truncate text-sm text-sand-600 dark:text-sand-400">{email}</p>
          </div>
        </div>
        <AccountTabs />
        <div className="mt-6 sm:mt-8">{children}</div>
      </div>
    </>
  )
}
