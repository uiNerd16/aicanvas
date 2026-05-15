-- AI Canvas — LAB presets
-- A user-named tune configuration for any /lab/* tool. Pure JSON: no binaries
-- (export PNGs and MP4s are not stored — only the slider, colour, density and
-- image-reference values needed to re-create them client-side). One row per
-- saved preset.
--
-- The `tool` column is free-form text rather than an enum so adding a new lab
-- tool (e.g. 'glow-aura') is a code-only change with no migration. Current
-- values in use: '60k-particles', 'mesh-gradient', 'noise-field'.
--
-- `updated_at` is maintained by the API route (PATCH/PUT handler), matching
-- the same pattern as user_preferences in migration 0002 — no trigger needed.

create table public.lab_presets (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  tool       text not null,
  name       text not null,
  config     jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index lab_presets_user_idx
  on public.lab_presets (user_id, created_at desc);

create index lab_presets_user_tool_idx
  on public.lab_presets (user_id, tool, created_at desc);

alter table public.lab_presets enable row level security;

create policy "lab_presets: owner all"
  on public.lab_presets
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
