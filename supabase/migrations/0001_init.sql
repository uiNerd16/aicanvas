-- AI Canvas — Phase 1 user accounts schema
-- Two tables: saved_components (favorites) and install_history (CLI copy log).
-- All access is RLS-scoped to auth.uid(); no row crosses users.

-- ─────────────────────────────────────────────────────────────────────
-- saved_components: a user's favorites
-- ─────────────────────────────────────────────────────────────────────
create table public.saved_components (
  user_id   uuid not null references auth.users(id) on delete cascade,
  slug      text not null,
  system    text,                        -- "andromeda" | "meridian" | null
  saved_at  timestamptz not null default now(),
  primary key (user_id, slug)
);

create index saved_components_user_idx
  on public.saved_components (user_id, saved_at desc);

alter table public.saved_components enable row level security;

create policy "saved: owner all"
  on public.saved_components
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────
-- install_history: recorded when a user copies a CLI install command
-- No DELETE policy on purpose — clearing history will be a future server
-- route running with elevated privileges, not direct user delete.
-- ─────────────────────────────────────────────────────────────────────
create table public.install_history (
  id           bigserial primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  slug         text not null,
  system       text,
  pkg_manager  text,                     -- "npm" | "pnpm" | "yarn" | "bun"
  copied_at    timestamptz not null default now()
);

create index install_history_user_idx
  on public.install_history (user_id, copied_at desc);

alter table public.install_history enable row level security;

create policy "history: owner read"
  on public.install_history
  for select
  using (auth.uid() = user_id);

create policy "history: owner write"
  on public.install_history
  for insert
  with check (auth.uid() = user_id);
