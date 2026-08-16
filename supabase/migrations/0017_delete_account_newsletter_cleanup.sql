-- Account deletion also removes the newsletter row. Before this, the row's
-- user_id was merely SET NULL (0015), so a deleted account's email stayed in
-- the mailable set. Deleting before auth.users is required: afterwards the
-- SET NULL has already fired and the row is unreachable by user_id.
-- Brevo-side cleanup happens in scripts/sync-brevo-contacts.mjs, which runs
-- before every campaign send.
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
  delete from public.newsletter_subscribers where user_id = uid;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_my_account() from public;
revoke all on function public.delete_my_account() from anon;
grant execute on function public.delete_my_account() to authenticated;
