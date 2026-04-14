-- Add droyhet to packs so admin kan tagge hele pakker (f.eks. "Snusboksen Drøy")
ALTER TABLE spillpakker
  ADD COLUMN IF NOT EXISTS droyhet TEXT NOT NULL DEFAULT 'normal'
    CHECK (droyhet IN ('mild','normal','droy'));

CREATE INDEX IF NOT EXISTS idx_spillpakker_droyhet ON spillpakker(droyhet);
