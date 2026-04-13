-- Fix recursive RLS on admin_brukere
-- The original SELECT policy had a self-referencing subquery which causes infinite recursion.
-- Fix: allow all authenticated users to read admin_brukere (it's not sensitive data),
-- keeping write operations super_admin-only.

DROP POLICY IF EXISTS "admin_brukere_select_own" ON admin_brukere;

CREATE POLICY "admin_brukere_select"
  ON admin_brukere FOR SELECT
  TO authenticated
  USING (true);
