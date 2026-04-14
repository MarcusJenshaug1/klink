-- Add navn column to admin_brukere so invited users' names persist
ALTER TABLE admin_brukere
  ADD COLUMN IF NOT EXISTS navn TEXT;

-- Backfill from auth.users.raw_user_meta_data where possible
UPDATE admin_brukere ab
SET navn = u.raw_user_meta_data->>'full_name'
FROM auth.users u
WHERE ab.user_id = u.id
  AND ab.navn IS NULL
  AND u.raw_user_meta_data->>'full_name' IS NOT NULL;
