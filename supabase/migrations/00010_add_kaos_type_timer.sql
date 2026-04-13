-- Add kaos korttype and timer_sekunder column
ALTER TYPE kort_type ADD VALUE IF NOT EXISTS 'kaos';
ALTER TABLE kort ADD COLUMN IF NOT EXISTS timer_sekunder INT NULL;
