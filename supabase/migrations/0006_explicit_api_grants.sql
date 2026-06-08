-- AI Canvas — explicit Data API grants
-- Supabase is deprecating the implicit "auto-expose public tables to the Data
-- API" default (new projects: 2026-05-30; enforced on NEW tables in existing
-- projects: 2026-10-30). After that, a public table is invisible to PostgREST /
-- supabase-js until an explicit GRANT is issued.
--
-- GRANT and RLS are separate layers: GRANT decides whether an API role can
-- touch the table at all; RLS filters which rows it sees. RLS alone is not
-- enough once the default goes away.
--
-- This migration makes our four existing tables self-contained — each grant is
-- stated explicitly and matches that table's RLS policy exactly (least
-- privilege), so the schema no longer relies on the deprecated default. Only
-- `authenticated` is granted: every policy is auth.uid()-scoped, so `anon` has
-- nothing to read or write and is intentionally left ungranted. Re-granting an
-- already-granted privilege is a no-op, so this is safe to apply to prod.

-- saved_components — policy "saved: owner all" (FOR ALL)
grant select, insert, update, delete on table public.saved_components to authenticated;

-- install_history — policies are SELECT + INSERT only (no update/delete by design).
-- The bigserial PK needs sequence USAGE for inserts via the API.
grant select, insert on table public.install_history to authenticated;
grant usage on sequence public.install_history_id_seq to authenticated;

-- user_preferences — policy "preferences: owner all" (FOR ALL)
grant select, insert, update, delete on table public.user_preferences to authenticated;

-- lab_presets — policy "lab_presets: owner all" (FOR ALL)
grant select, insert, update, delete on table public.lab_presets to authenticated;
