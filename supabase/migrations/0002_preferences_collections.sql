-- AI Canvas — preferences + collections
-- Adds two member-only features:
--   1. user_preferences — synced settings (package manager, AI platform).
--   2. saved_components.collection — free-form bucket name; lets users
--      organize favorites without a separate collections table.

-- ─────────────────────────────────────────────────────────────────────
-- user_preferences: one row per user, all fields nullable so a user
-- with no opinions still has a sensible default at the call site.
-- ─────────────────────────────────────────────────────────────────────
create table public.user_preferences (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  package_manager  text,                 -- "pnpm" | "npm" | "yarn" | "bun" | null
  ai_platform      text,                 -- "Claude Code" | "Lovable" | "V0" | null
  updated_at       timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

create policy "preferences: owner all"
  on public.user_preferences
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────
-- saved_components.collection — free-form bucket. NULL means
-- "uncategorized"; collections "exist" implicitly when at least one
-- save references the name. No separate collections table needed.
-- ─────────────────────────────────────────────────────────────────────
alter table public.saved_components
  add column collection text;

create index saved_components_collection_idx
  on public.saved_components (user_id, collection)
  where collection is not null;
