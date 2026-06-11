-- API tokens: one per user, auto-issued at signup, URL-safe, revocable, expiring.
-- The website bakes the token into the copied CLI/MCP commands so the registry
-- route (Plan 3) can attribute a pull to the account. Stored as a retrievable
-- secret (RLS owner-read only) because the site must embed the literal value;
-- it expires (90d) and is user-rotatable so a leak is bounded and fixable.
create extension if not exists pgcrypto;

create table public.user_api_keys (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  token        text unique not null,
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null default now() + interval '90 days',
  last_used_at timestamptz,
  revoked      boolean not null default false
);

create index user_api_keys_token_idx on public.user_api_keys (token) where revoked = false;

alter table public.user_api_keys enable row level security;

-- Owner may read their own token (so the signed-in website can embed it).
-- Post-0008 convention: scope to authenticated + initplan-cached auth.uid().
create policy "api_keys: owner read" on public.user_api_keys
  for select to authenticated using ((select auth.uid()) = user_id);

-- No client writes; tokens are created by the trigger and rotated server-side
-- via the secret key only. Read-only grant for the Data API.
grant select on table public.user_api_keys to authenticated;

-- Issue a token on signup.
create or replace function public.issue_api_token()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_api_keys (user_id, token)
  values (new.id, 'aic_' || encode(gen_random_bytes(24), 'hex'))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created_issue_token
  after insert on auth.users
  for each row execute function public.issue_api_token();

-- Backfill: every user who already exists gets a token (idempotent).
insert into public.user_api_keys (user_id, token)
select id, 'aic_' || encode(gen_random_bytes(24), 'hex') from auth.users
on conflict (user_id) do nothing;
