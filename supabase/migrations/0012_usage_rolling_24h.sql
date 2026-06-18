-- Switch metering from a UTC-calendar-day counter to a ROLLING 24-HOUR window.
-- "Used" = COUNT(DISTINCT slug) for a subject whose install landed within the
-- last 24h. A slug pulled in the last 24h is free to re-pull; the oldest
-- in-window install ages out at +24h, freeing one slot — no more midnight-UTC
-- cliff. The table is unchanged; `day` is retained only as a PK partition and
-- for the retention prune, all LIMIT logic now reads `created_at`.
--
-- NOTE: anonymous subjects (ip:<per-day hash>) rotate at UTC midnight BY DESIGN
-- (GDPR data-minimization — see 0011 / quota.ts subjectFor), so anon rows never
-- span the rotation and anonymous effectively still resets daily. Stable
-- subjects (user:<uuid>) get a true rolling 24h window. Intentional: anonymous
-- is a 2/day floor, the free *account* (10/day) is the real rolling tier.

-- ── consume: window-scoped (replaces the day-scoped 4-arg version) ───────────
drop function if exists public.consume_quota(text, date, text, int);

create or replace function public.consume_quota(
  p_subject text, p_slug text, p_limit int
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Re-access of a slug pulled within the last 24h: allowed, never re-counted.
  if exists (
    select 1 from public.usage_daily
    where subject = p_subject and slug = p_slug
      and created_at > now() - interval '24 hours'
  ) then
    return true;
  end if;

  -- Serialize concurrent first-pulls for the same subject so the window count
  -- below is race-free and the limit is a hard ceiling.
  perform pg_advisory_xact_lock(hashtext(p_subject));

  -- New slug: insert iff the subject is under the limit within the 24h window.
  insert into public.usage_daily (subject, day, slug)
  select p_subject, (now() at time zone 'utc')::date, p_slug
  where (
    select count(distinct slug) from public.usage_daily
    where subject = p_subject and created_at > now() - interval '24 hours'
  ) < p_limit
  on conflict (subject, day, slug) do nothing;

  return found or exists (
    select 1 from public.usage_daily
    where subject = p_subject and slug = p_slug
      and created_at > now() - interval '24 hours'
  );
end;
$$;

revoke all on function public.consume_quota(text, text, int) from public, anon, authenticated;
grant execute on function public.consume_quota(text, text, int) to service_role;

-- ── usage_status: read-only snapshot for the website's proactive limit check ──
-- used         = distinct slugs in the 24h window
-- slug_counted = is THIS slug already in the window (so re-copying is free)
-- oldest_at    = created_at of the oldest in-window install; the next slot
--                frees at oldest_at + 24h (the reset time shown to the user).
create or replace function public.usage_status(p_subject text, p_slug text)
returns table (used int, slug_counted boolean, oldest_at timestamptz)
language sql
security definer
set search_path = ''
as $$
  select
    (select count(distinct slug)::int from public.usage_daily
       where subject = p_subject and created_at > now() - interval '24 hours'),
    exists (select 1 from public.usage_daily
       where subject = p_subject and slug = p_slug
         and created_at > now() - interval '24 hours'),
    (select min(created_at) from public.usage_daily
       where subject = p_subject and created_at > now() - interval '24 hours');
$$;

revoke all on function public.usage_status(text, text) from public, anon, authenticated;
grant execute on function public.usage_status(text, text) to service_role;

-- The window math counts distinct slugs for a subject by created_at, so index
-- (subject, created_at) to keep that lookup cheap as history grows. The old
-- (day) index is now only used by the retention prune.
create index if not exists usage_daily_subject_created_idx
  on public.usage_daily (subject, created_at);
