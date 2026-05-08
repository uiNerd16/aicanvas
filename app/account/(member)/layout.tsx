import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { createClient } from '../../lib/supabase/server'
import { AccountTabs } from './AccountTabs'
import { AccountTopBar } from './AccountTopBar'

export default async function MemberLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/account/sign-in?next=/account')

  return (
    <>
      <AccountTopBar />
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sand-900 dark:text-sand-50">Your account</h1>
          <p className="mt-1 text-sm text-sand-600 dark:text-sand-400">{user.email}</p>
        </div>
        <AccountTabs />
        <div className="mt-8">{children}</div>
      </div>
    </>
  )
}
