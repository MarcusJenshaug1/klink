-- Legg til timer_synlig-kolonne: false = skjult (Hot Seat), true = synlig nedtelling
ALTER TABLE kort ADD COLUMN IF NOT EXISTS timer_synlig BOOLEAN NOT NULL DEFAULT false;
