-- AI Canvas — account deletion + granular install_history erasure
-- GDPR Art. 17 (right to erasure):
--   1. Add a DELETE policy on install_history so users can clear individual
--      rows from their history (Phase 1 left this open with a TODO comment).
--   2. Add delete_my_account() so users can erase their entire account
--      from a button in /account/settings without us shipping the Supabase
--      service-role key to the browser. The function runs with security
--      definer so it can reach into auth.users with elevated privileges
--      while still scoping the delete to the caller's auth.uid().
--      The existing ON DELETE CASCADE foreign keys on saved_components,
--      install_history, and user_preferences clean up the rest.

-- ─────────────────────────────────────────────────────────────────────
-- 1. Granular delete on install_history
-- ─────────────────────────────────────────────────────────────────────
create policy "history: owner delete"
  on public.install_history
  for delete
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────
-- 2. Self-service account deletion
-- ─────────────────────────────────────────────────────────────────────
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_my_account() from public;
revoke all on function public.delete_my_account() from anon;
grant execute on function public.delete_my_account() to authenticated;
