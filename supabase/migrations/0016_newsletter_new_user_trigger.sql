-- 0016: keep newsletter_subscribers complete — every new auth.users row gets
-- a 'soft' newsletter row automatically (the 0015 backfill was a snapshot;
-- this closes the gap for all future signups).
--
-- Hardened after adversarial review:
--  * null-email guard: anonymous/phone/admin-created users must not raise a
--    not-null violation (ON CONFLICT only catches unique conflicts) — a raise
--    here would roll back the auth.users insert and break the signup itself.
--  * on conflict: claim orphaned rows (user_id null after account deletion +
--    re-signup, or webhook-inserted emails) so the settings toggle's RLS
--    write works. status/unsubscribed_at untouched — a prior opt-out for the
--    address is preserved.
--  * exception net: this row is a non-essential side effect; NOTHING may ever
--    abort a signup. Any unexpected error is swallowed.

create or replace function public.handle_new_user_newsletter()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.email is null then
    return new;
  end if;

  begin
    insert into public.newsletter_subscribers (email, user_id, name, status, source)
    values (
      new.email,
      new.id,
      nullif(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), ''),
      'soft',
      'signup_trigger'
    )
    on conflict (email) do update
      set user_id = excluded.user_id,
          updated_at = now()
      where newsletter_subscribers.user_id is null;
  exception when others then
    -- newsletter bookkeeping must never break a signup
    null;
  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_newsletter on auth.users;
create trigger on_auth_user_created_newsletter
  after insert on auth.users
  for each row execute function public.handle_new_user_newsletter();

-- The function runs only as a trigger (as table owner); nobody may call it
-- through the exposed API. Silences Supabase linter 0028/0029.
revoke execute on function public.handle_new_user_newsletter() from anon, authenticated, public;
