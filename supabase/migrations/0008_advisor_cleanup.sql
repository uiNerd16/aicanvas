-- AI Canvas — Supabase advisor cleanup (applied to prod 2026-06-11)
--
-- Three fixes flagged by the Security/Performance Advisors:
--
-- 1. rls_auto_enable() is an event-trigger function; it fires on its own and
--    nobody needs EXECUTE on it. Revoke the default broad grants.
-- 2. Rewrite all owner policies in the advisor-recommended form:
--    `to authenticated` (skips the policy entirely for anon) and
--    `(select auth.uid())` so Postgres evaluates it once per query
--    (initplan) instead of once per row. Same security semantics.
-- 3. Drop saved_components_collection_idx — zero scans since creation.
--    Recreate if a collections feature starts filtering on it.

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

drop policy "history: owner read" on public.install_history;
create policy "history: owner read" on public.install_history
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy "history: owner write" on public.install_history;
create policy "history: owner write" on public.install_history
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy "history: owner delete" on public.install_history;
create policy "history: owner delete" on public.install_history
  for delete to authenticated using ((select auth.uid()) = user_id);

drop policy "lab_presets: owner all" on public.lab_presets;
create policy "lab_presets: owner all" on public.lab_presets
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy "saved: owner all" on public.saved_components;
create policy "saved: owner all" on public.saved_components
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy "preferences: owner all" on public.user_preferences;
create policy "preferences: owner all" on public.user_preferences
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop index public.saved_components_collection_idx;
