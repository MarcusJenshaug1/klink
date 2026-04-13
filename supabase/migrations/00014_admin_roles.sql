-- Admin roles and pack access control

-- Table: admin_brukere
-- Tracks which auth users have admin access and what role they have
CREATE TABLE IF NOT EXISTS admin_brukere (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rolle         TEXT NOT NULL DEFAULT 'admin' CHECK (rolle IN ('admin', 'super_admin')),
  epost         TEXT NOT NULL,
  opprettet_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Table: pakke_tilgang
-- Which admins (non-super) can edit which packs
CREATE TABLE IF NOT EXISTS pakke_tilgang (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bruker_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spillpakke_id   UUID NOT NULL REFERENCES spillpakker(id) ON DELETE CASCADE,
  opprettet_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(bruker_id, spillpakke_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admin_brukere_user_id ON admin_brukere(user_id);
CREATE INDEX IF NOT EXISTS idx_pakke_tilgang_bruker ON pakke_tilgang(bruker_id);
CREATE INDEX IF NOT EXISTS idx_pakke_tilgang_pakke ON pakke_tilgang(spillpakke_id);

-- Enable RLS
ALTER TABLE admin_brukere ENABLE ROW LEVEL SECURITY;
ALTER TABLE pakke_tilgang ENABLE ROW LEVEL SECURITY;

-- admin_brukere policies:
-- Authenticated users can read their own row (to check their own role)
CREATE POLICY "admin_brukere_select_own"
  ON admin_brukere FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM admin_brukere ab
      WHERE ab.user_id = auth.uid() AND ab.rolle = 'super_admin'
    )
  );

CREATE POLICY "admin_brukere_insert"
  ON admin_brukere FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_brukere ab
      WHERE ab.user_id = auth.uid() AND ab.rolle = 'super_admin'
    )
  );

CREATE POLICY "admin_brukere_update"
  ON admin_brukere FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_brukere ab
      WHERE ab.user_id = auth.uid() AND ab.rolle = 'super_admin'
    )
  );

CREATE POLICY "admin_brukere_delete"
  ON admin_brukere FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_brukere ab
      WHERE ab.user_id = auth.uid() AND ab.rolle = 'super_admin'
    )
  );

-- pakke_tilgang policies:
-- Users see their own rows; super_admins see all
CREATE POLICY "pakke_tilgang_select"
  ON pakke_tilgang FOR SELECT
  TO authenticated
  USING (
    bruker_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM admin_brukere ab
      WHERE ab.user_id = auth.uid() AND ab.rolle = 'super_admin'
    )
  );

CREATE POLICY "pakke_tilgang_insert"
  ON pakke_tilgang FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_brukere ab
      WHERE ab.user_id = auth.uid() AND ab.rolle = 'super_admin'
    )
  );

CREATE POLICY "pakke_tilgang_delete"
  ON pakke_tilgang FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_brukere ab
      WHERE ab.user_id = auth.uid() AND ab.rolle = 'super_admin'
    )
  );

-- ---------------------------------------------------------------
-- IMPORTANT: Seed your first super_admin manually via Supabase SQL:
--
-- INSERT INTO admin_brukere (user_id, rolle, epost)
-- VALUES ('<din auth.users UUID>', 'super_admin', 'din@epost.no');
--
-- Find your user UUID in Supabase → Authentication → Users
-- ---------------------------------------------------------------
