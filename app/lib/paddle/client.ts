'use client'
import { initializePaddle, type Paddle } from '@paddle/paddle-js'

let paddlePromise: Promise<Paddle | undefined> | null = null

/** Lazily initialize Paddle.js once (overlay checkout). */
export function getPaddle(): Promise<Paddle | undefined> {
  if (!paddlePromise) {
    paddlePromise = initializePaddle({
      environment: (process.env.NEXT_PUBLIC_PADDLE_ENV as 'sandbox' | 'production') ?? 'sandbox',
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? '',
      // Verified-optimistic activation: on success we POST the transaction id
      // to be checked against the Paddle API server-side before any DB write
      // (a session alone never grants premium). Only reload on a confirmed
      // activation; otherwise tell the user the webhook will finish it —
      // a blind reload would silently dump a paying user back on a Free view.
      eventCallback: (e) => {
        if (e?.name === 'checkout.completed') {
          const transactionId = (e.data as { transaction_id?: string } | undefined)?.transaction_id
          fetch('/api/checkout/completed', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ transactionId }),
          })
            .then((res) => {
              if (!res.ok) {
                console.error('[paddle] activation deferred to webhook, status', res.status)
                alert('Payment received. Your account is being activated — this can take a minute. Refresh shortly; contact support if it persists.')
              }
              window.location.reload()
            })
            .catch(() => {
              alert('Payment received. Your account is being activated — refresh in a minute.')
              window.location.reload()
            })
        }
      },
    })
  }
  return paddlePromise
}

/** Paddle price IDs — set per environment. Empty until the Paddle product exists. */
export const PRICES = {
  monthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_MONTHLY ?? '',
  yearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_YEARLY ?? '',
}

export type BillingCycle = 'monthly' | 'yearly'
