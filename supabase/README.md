# Supabase migrations — conventions

## Every new `public` table needs an explicit GRANT

Supabase is removing the default that auto-exposes `public` tables to the Data
API (PostgREST / GraphQL / `supabase-js`). Enforced on **new tables in existing
projects from 2026-10-30**. After that, a table is invisible to the API until
it's explicitly granted — and **RLS does not cover this**: GRANT controls
table-level API access, RLS only filters rows. You need both.

So every table migration follows this order:

```sql
create table public.<name> ( ... );

-- indexes …

alter table public.<name> enable row level security;

create policy "<name>: owner all"
  on public.<name>
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Grant the API role exactly what the policy allows (least privilege).
-- All current tables are owner-scoped, so authenticated only — never anon.
grant select, insert, update, delete on table public.<name> to authenticated;
-- bigserial/serial PK? also: grant usage on sequence public.<name>_id_seq to authenticated;
```

Match the grant to the policy:
- policy `for all` → `grant select, insert, update, delete`
- policy is `select` + `insert` only → `grant select, insert` (e.g. `install_history`)
- a table meant for public reads → add `grant select … to anon` (we have none today)

Existing grants were backfilled in `0006_explicit_api_grants.sql`.
