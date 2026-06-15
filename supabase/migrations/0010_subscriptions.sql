-- Paddle-synced subscription state, one row per user. Written server-side only
-- (the Paddle webhook via the admin client), read by the owner. `last_event_at`
-- holds the occurred_at of the newest applied Paddle event so the webhook can
-- discard stale / out-of-order retries (idempotency + ordering guard).
create table public.user_subscriptions (
  user_id                uuid primary key references auth.users(id) on delete cascade,
  paddle_customer_id     text,
  paddle_subscription_id text unique,
  status                 text not null default 'none',  -- none | active | trialing | past_due | paused | canceled
  plan                   text,                           -- monthly | annual | null
  current_period_end     timestamptz,
  last_event_at          timestamptz,
  updated_at             timestamptz not null default now()
);

create index user_subscriptions_paddle_sub_idx on public.user_subscriptions (paddle_subscription_id);

alter table public.user_subscriptions enable row level security;

-- Owner may read their own subscription. Writes happen server-side via the
-- admin client only (the Paddle webhook), so no write policy for clients.
create policy "subscriptions: owner read" on public.user_subscriptions
  for select to authenticated using ((select auth.uid()) = user_id);

grant select on table public.user_subscriptions to authenticated;
