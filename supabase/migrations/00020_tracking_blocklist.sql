-- Tracking blocklist: IPs / networks that should NOT be tracked by analytics

CREATE TABLE IF NOT EXISTS tracking_blocklist (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip           TEXT NOT NULL UNIQUE,
  label        TEXT,
  created_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tracking_blocklist_ip ON tracking_blocklist(ip);

ALTER TABLE tracking_blocklist ENABLE ROW LEVEL SECURITY;

-- Only super_admin can read/write
CREATE POLICY "tracking_blocklist_select_super_admin"
  ON tracking_blocklist FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_brukere ab
      WHERE ab.user_id = auth.uid() AND ab.rolle = 'super_admin'
    )
  );

CREATE POLICY "tracking_blocklist_insert_super_admin"
  ON tracking_blocklist FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_brukere ab
      WHERE ab.user_id = auth.uid() AND ab.rolle = 'super_admin'
    )
  );

CREATE POLICY "tracking_blocklist_delete_super_admin"
  ON tracking_blocklist FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_brukere ab
      WHERE ab.user_id = auth.uid() AND ab.rolle = 'super_admin'
    )
  );
