-- AI Canvas — newsletter is explicit opt-in
--
-- Switch the email newsletter to an explicit opt-in model: the column now
-- defaults to FALSE, so a user is only subscribed if they affirmatively turn
-- the toggle on in /account/settings. No newsletter is sent until an email
-- provider is wired; this only governs how consent is recorded.
--
-- Existing rows that were set to true did so via the previous NOT NULL DEFAULT
-- true (often a side effect of saving an unrelated preference), not an
-- affirmative choice. They are reset to false so that only genuine, explicit
-- opt-ins count going forward. Users who want the newsletter simply toggle it
-- on again from /account/settings.

alter table public.user_preferences
  alter column newsletter_opt_in set default false;

update public.user_preferences
  set newsletter_opt_in = false
  where newsletter_opt_in = true;
