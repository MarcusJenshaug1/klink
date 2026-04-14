-- Extend kort with metadata for drafting, drøyhet, spiller-krav, vekt, kjønn, notater
ALTER TABLE kort
  ADD COLUMN IF NOT EXISTS aktiv BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS droyhet TEXT NOT NULL DEFAULT 'normal'
    CHECK (droyhet IN ('mild','normal','droy')),
  ADD COLUMN IF NOT EXISTS min_spillere INT NOT NULL DEFAULT 2 CHECK (min_spillere >= 1),
  ADD COLUMN IF NOT EXISTS standard_slurker INT
    CHECK (standard_slurker IS NULL OR standard_slurker >= 0),
  ADD COLUMN IF NOT EXISTS notater TEXT,
  ADD COLUMN IF NOT EXISTS kjonn TEXT NOT NULL DEFAULT 'alle'
    CHECK (kjonn IN ('alle','mann','kvinne')),
  ADD COLUMN IF NOT EXISTS vekt TEXT NOT NULL DEFAULT 'vanlig'
    CHECK (vekt IN ('sjelden','vanlig','ofte')),
  ADD COLUMN IF NOT EXISTS endret_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION kort_bump_endret_at() RETURNS trigger AS $$
BEGIN
  NEW.endret_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_kort_endret_at ON kort;
CREATE TRIGGER trg_kort_endret_at
  BEFORE UPDATE ON kort
  FOR EACH ROW
  EXECUTE FUNCTION kort_bump_endret_at();

CREATE INDEX IF NOT EXISTS idx_kort_aktiv ON kort(aktiv);
CREATE INDEX IF NOT EXISTS idx_kort_droyhet ON kort(droyhet);
