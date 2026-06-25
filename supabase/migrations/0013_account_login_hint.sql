-- account_login_hint(email): returns 'google' when the email belongs to a
-- Google-OAuth-only account (has a google identity AND no usable password),
-- otherwise NULL. Lets the sign-in form steer a user who forgot they signed up
-- with Google toward the Google button instead of a dead-end "wrong password"
-- loop.
--
-- SECURITY DEFINER so it can read the auth schema. Locked to service_role only
-- (revoked from PUBLIC) — it is called solely by the rate-limited server route
-- /api/auth/login-hint via the admin client, never directly by the browser, so
-- it is not a public account-enumeration oracle.
create or replace function public.account_login_hint(p_email text)
returns text
language sql
security definer
set search_path = ''
as $$
  select case
    when exists (
      select 1
      from auth.identities i
      join auth.users u on u.id = i.user_id
      where lower(u.email) = lower(p_email)
        and i.provider = 'google'
    )
    and not exists (
      select 1
      from auth.users u
      where lower(u.email) = lower(p_email)
        and u.encrypted_password is not null
        and length(u.encrypted_password) > 0
    )
    then 'google'
    else null
  end;
$$;

-- Supabase auto-grants EXECUTE on public functions to anon + authenticated via
-- default privileges, so a bare `revoke ... from public` leaves those explicit
-- grants in place (the function would stay callable from the browser via
-- PostgREST rpc — a public enumeration oracle). Revoke them explicitly.
revoke all on function public.account_login_hint(text) from public, anon, authenticated;
grant execute on function public.account_login_hint(text) to service_role;
