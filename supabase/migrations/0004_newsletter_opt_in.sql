-- AI Canvas — newsletter opt-in flag
-- Adds a single boolean to user_preferences. Defaults to true because the
-- /account/sign-up form's inline notice ("We may occasionally email you about
-- AI Canvas updates; you can opt out anytime") satisfies § 7 (3) UWG's
-- informational duty under the post-ECJ-C-654/23 reading of the
-- existing-customer exception. Users can flip the flag off at any time from
-- /account/settings or via the unsubscribe link in any email we send.
--
-- No newsletter is actually sent until we wire an email provider; this
-- migration only ships the data foundation so account holders' preferences
-- are recorded from day one. Existing rows in user_preferences (if any)
-- inherit the default via the NOT NULL DEFAULT.

alter table public.user_preferences
  add column newsletter_opt_in boolean not null default true;
