'use client'

import { useSearchParams } from 'next/navigation'
import { SignUpFormFields } from '../../components/auth/SignUpFormFields'
import { safeNext } from '../../lib/safe-next'
import { AuthPagePopup } from '../AuthPagePopup'

export function SignUpForm() {
  const searchParams = useSearchParams()
  const next = safeNext(searchParams.get('next'))

  return (
    <AuthPagePopup>
      <SignUpFormFields next={next} />
    </AuthPagePopup>
  )
}
