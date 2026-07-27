-- 0016: keep newsletter_subscribers complete — every new auth.users row gets
-- a 'soft' newsletter row automatically (the 0015 backfill was a snapshot;
-- this closes the gap for all future signups). Standard Supabase
-- handle_new_user trigger pattern: security definer, owned by postgres.

create or replace function public.handle_new_user_newsletter()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.newsletter_subscribers (email, user_id, name, status, source)
  values (
    new.email,
    new.id,
    nullif(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), ''),
    'soft',
    'signup_trigger'
  )
  on conflict (email) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created_newsletter
  after insert on auth.users
  for each row execute function public.handle_new_user_newsletter();
