-- current_user_has_password(): true when the CURRENT caller (auth.uid()) has a
-- usable password. Needed because setting a password on an OAuth (e.g. Google)
-- account via updateUser({ password }) writes encrypted_password but does NOT
-- add an 'email' identity, so app_metadata.providers can't tell us whether a
-- password exists. This reads encrypted_password directly.
--
-- Scoped to the caller's own auth.uid() (no email argument), so it reveals
-- nothing about any other account — safe to expose to `authenticated`. anon has
-- no session (auth.uid() is null) so it's revoked there.
create or replace function public.current_user_has_password()
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users
    where id = auth.uid()
      and encrypted_password is not null
      and length(encrypted_password) > 0
  );
$$;

revoke all on function public.current_user_has_password() from public, anon;
grant execute on function public.current_user_has_password() to authenticated, service_role;
