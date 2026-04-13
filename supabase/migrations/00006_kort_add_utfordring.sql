-- Legg til utfordring-kolonne på kort-tabellen
ALTER TABLE kort ADD COLUMN IF NOT EXISTS utfordring TEXT;
