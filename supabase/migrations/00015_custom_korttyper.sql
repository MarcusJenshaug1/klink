-- Custom global card types (korttyper)

-- 1. Change kort.type from enum to TEXT
ALTER TABLE kort ALTER COLUMN type TYPE TEXT;

-- 2. Drop the old enum (CASCADE handles any remaining references)
DROP TYPE IF EXISTS kort_type CASCADE;

-- 3. Global custom card types table
CREATE TABLE IF NOT EXISTS korttyper (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label        TEXT NOT NULL,
  icon_name    TEXT NOT NULL DEFAULT 'Star',
  opprettet_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE korttyper ENABLE ROW LEVEL SECURITY;

-- Public read (needed so game can fetch custom types)
CREATE POLICY "korttyper_public_read"
  ON korttyper FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated (admin) full management
CREATE POLICY "korttyper_admin_manage"
  ON korttyper FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
