-- Klink database schema
-- Run this in Supabase SQL Editor to set up the database

-- 1. Create card type enum
CREATE TYPE kort_type AS ENUM (
  'pekelek',
  'snusboks',
  'utfordring',
  'regel',
  'alle_drikker',
  'kategori'
);

-- 2. Create spillpakker (game packs) table
CREATE TABLE spillpakker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  navn TEXT NOT NULL,
  beskrivelse TEXT,
  regler TEXT,
  farge TEXT NOT NULL DEFAULT '#A8E63D',
  ikon TEXT DEFAULT 'default',
  aktiv BOOLEAN NOT NULL DEFAULT true,
  opprettet_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create kort (cards) table
CREATE TABLE kort (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spillpakke_id UUID NOT NULL REFERENCES spillpakker(id) ON DELETE CASCADE,
  type kort_type NOT NULL,
  tittel TEXT NOT NULL,
  innhold TEXT NOT NULL,
  opprettet_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_kort_spillpakke ON kort(spillpakke_id);

-- 4. Enable RLS
ALTER TABLE spillpakker ENABLE ROW LEVEL SECURITY;
ALTER TABLE kort ENABLE ROW LEVEL SECURITY;

-- 5. RLS policies: public read, admin full access
CREATE POLICY "Alle kan lese aktive pakker"
  ON spillpakker FOR SELECT
  USING (aktiv = true);

CREATE POLICY "Admin full tilgang pakker"
  ON spillpakker FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Alle kan lese kort i aktive pakker"
  ON kort FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM spillpakker
      WHERE spillpakker.id = kort.spillpakke_id
      AND spillpakker.aktiv = true
    )
  );

CREATE POLICY "Admin full tilgang kort"
  ON kort FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
