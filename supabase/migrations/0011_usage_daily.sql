-- Daily usage, slug-keyed: one row per (subject, UTC day, slug). The metering
-- unit is the UNIQUE COMPONENT per day — all actions (Code tab, CLI, MCP) on
-- the same component in one day are ONE pull, and re-access of an
-- already-pulled slug stays free even at the limit. "Used" = row count for
-- (subject, day). Resets implicitly: a new day is new rows.
-- Subject = 'user:<uuid>' or 'ip:<per-day hash>'.
create table public.usage_daily (
  subject    text not null,
  day        date not null,
  slug       text not null,
  created_at timestamptz not null default now(),
  primary key (subject, day, slug)
);

create index usage_daily_day_idx on public.usage_daily (day);

alter table public.usage_daily enable row level security;
-- No client access at all: only the server (admin/secret key) reads & writes.
-- (RLS on with no policies = deny all for anon/authenticated.)

-- Idempotent "consume one unique-component unit if allowed". Returns true when
-- the pull is allowed: either the slug was already pulled today (free
-- re-access, no new unit) or the subject is under the limit (insert one row).
create or replace function public.consume_quota(
  p_subject text, p_day date, p_slug text, p_limit int
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Re-access of an already-pulled slug: always allowed, never counted.
  if exists (
    select 1 from public.usage_daily
    where subject = p_subject and day = p_day and slug = p_slug
  ) then
    return true;
  end if;

  -- Serialize concurrent consumes for the same subject+day so the count
  -- check below is race-free and the limit is a hard ceiling (without the
  -- lock, N concurrent first-pulls could each pass the count and overrun
  -- the limit by N-1). Transaction-scoped; released at commit.
  perform pg_advisory_xact_lock(hashtext(p_subject || ':' || p_day::text));

  -- New slug: insert iff under the limit.
  insert into public.usage_daily (subject, day, slug)
  select p_subject, p_day, p_slug
  where (
    select count(*) from public.usage_daily
    where subject = p_subject and day = p_day
  ) < p_limit
  on conflict (subject, day, slug) do nothing;

  -- found = inserted; the OR covers a concurrent insert of the same slug.
  return found or exists (
    select 1 from public.usage_daily
    where subject = p_subject and day = p_day and slug = p_slug
  );
end;
$$;

revoke all on function public.consume_quota(text, date, text, int) from public, anon, authenticated;
-- Explicit grant for the server (secret-key) role. Supabase default privileges
-- usually cover this, but never rely on defaults for the role the gate runs as.
grant execute on function public.consume_quota(text, date, text, int) to service_role;
