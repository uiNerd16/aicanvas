-- AI Canvas — newsletter opt-in flag
-- Adds a single boolean to user_preferences. Defaults to FALSE: under GDPR
-- Art. 7 marketing consent must be explicit, freely given, and not bundled
-- into account creation. The previous "default true + § 7 (3) UWG implicit
-- consent" reading didn't extend cleanly to the Google-OAuth signup path,
-- where the user never sees an in-flow notice — so we play it safe and
-- require an affirmative opt-in from /account/settings (or a future opt-in
-- checkbox on the sign-up form).
--
-- No newsletter is actually sent until we wire an email provider; this
-- migration only ships the data foundation so account holders' preferences
-- are recorded from day one. Existing rows in user_preferences (if any)
-- inherit the default via NOT NULL DEFAULT.

alter table public.user_preferences
  add column newsletter_opt_in boolean not null default false;
