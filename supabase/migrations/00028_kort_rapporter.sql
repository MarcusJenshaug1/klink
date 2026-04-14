-- Flag-kort: spillere kan rapportere dårlige kort
CREATE TABLE IF NOT EXISTS kort_rapporter (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kort_id       UUID NOT NULL REFERENCES kort(id) ON DELETE CASCADE,
  grunn         TEXT NOT NULL,
  kommentar     TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kort_rapporter_kort ON kort_rapporter(kort_id);

ALTER TABLE kort_rapporter ENABLE ROW LEVEL SECURITY;

-- Alle kan poste (anonyme spillere)
CREATE POLICY "kort_rapporter_insert_public"
  ON kort_rapporter FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Kun super_admin kan lese
CREATE POLICY "kort_rapporter_select_super_admin"
  ON kort_rapporter FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_brukere ab
      WHERE ab.user_id = auth.uid() AND ab.rolle = 'super_admin'
    )
  );

CREATE POLICY "kort_rapporter_delete_super_admin"
  ON kort_rapporter FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_brukere ab
      WHERE ab.user_id = auth.uid() AND ab.rolle = 'super_admin'
    )
  );
