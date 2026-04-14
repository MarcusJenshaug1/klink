-- Per-intensitet standard slurker
ALTER TABLE kort
  ADD COLUMN IF NOT EXISTS slurker_lett INT CHECK (slurker_lett IS NULL OR slurker_lett >= 0),
  ADD COLUMN IF NOT EXISTS slurker_medium INT CHECK (slurker_medium IS NULL OR slurker_medium >= 0),
  ADD COLUMN IF NOT EXISTS slurker_borst INT CHECK (slurker_borst IS NULL OR slurker_borst >= 0);

-- Migrate existing standard_slurker value to all three levels
UPDATE kort
SET slurker_lett = standard_slurker,
    slurker_medium = standard_slurker,
    slurker_borst = standard_slurker
WHERE standard_slurker IS NOT NULL
  AND slurker_lett IS NULL;

ALTER TABLE kort DROP COLUMN IF EXISTS standard_slurker;
