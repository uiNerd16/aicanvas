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
      // (a session alone never grants premium). Reload so the gate sees it.
      eventCallback: (e) => {
        if (e?.name === 'checkout.completed') {
          const transactionId = (e.data as { transaction_id?: string } | undefined)?.transaction_id
          fetch('/api/checkout/completed', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ transactionId }),
          })
            .then(() => window.location.reload())
            .catch(() => {})
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
