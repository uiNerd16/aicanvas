-- 0015: newsletter_subscribers — dedicated newsletter list, replaces user_preferences.newsletter_opt_in
--
-- One row per email address. status is the single truth:
--   'subscribed'   — explicitly opted in (settings toggle / future signup form)
--   'soft'         — existing account, never chose; mailable under §7(3) UWG existing-customer
--                    basis (ECJ C-654/23) until they unsubscribe
--   'unsubscribed' — explicitly opted out; NEVER mailed again (unsubscribed_at = proof)
-- Premium is intentionally NOT a column: join user_subscriptions at read time so it can't go stale.
-- Sending happens through Brevo (updates.aicanvas.me); this table is the source of truth,
-- Brevo's list is a mirror synced by app code + the unsubscribe webhook.

create table public.newsletter_subscribers (
  email           text primary key,
  user_id         uuid references auth.users(id) on delete set null,
  name            text,
  status          text not null default 'soft'
                    check (status in ('subscribed','soft','unsubscribed')),
  source          text,
  subscribed_at   timestamptz,
  unsubscribed_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create unique index newsletter_subscribers_user_id_key
  on public.newsletter_subscribers (user_id) where user_id is not null;

create index newsletter_subscribers_status_idx
  on public.newsletter_subscribers (status);

alter table public.newsletter_subscribers enable row level security;

-- Same owner-scoped policy shape as user_preferences / saved_components.
-- Rows with user_id null (footer signups, imports) are server-only (service role).
create policy "newsletter: owner all" on public.newsletter_subscribers
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Backfill from current reality (idempotent; see plan memory project_newsletter_brevo_plan):
--   opted in                      -> subscribed
--   prefs row with ONLY newsletter=false (no pkg/platform) -> unsubscribed (probable deliberate opt-out)
--   everyone else with an account -> soft
insert into public.newsletter_subscribers (email, user_id, name, status, source, subscribed_at, unsubscribed_at)
select
  u.email,
  u.id,
  nullif(coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'), ''),
  case
    when p.newsletter_opt_in is true then 'subscribed'
    when p.newsletter_opt_in is false
         and p.package_manager is null and p.ai_platform is null then 'unsubscribed'
    else 'soft'
  end,
  'backfill_0015',
  case when p.newsletter_opt_in is true then coalesce(p.updated_at, now()) end,
  case when p.newsletter_opt_in is false
        and p.package_manager is null and p.ai_platform is null
       then coalesce(p.updated_at, now()) end
from auth.users u
left join public.user_preferences p on p.user_id = u.id
where u.email is not null
on conflict (email) do nothing;
