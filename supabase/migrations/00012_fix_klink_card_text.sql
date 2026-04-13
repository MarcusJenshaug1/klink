-- Fjern "—" fra Shot or Text kort, fjern "Kategorien er: " prefiks fra Kategorien-kort
UPDATE kort
SET innhold = REPLACE(innhold, ' — eller ta en shot', ', eller ta en shot')
WHERE type = 'kaos' AND tittel = 'Shot or Text';

UPDATE kort
SET innhold = REPLACE(innhold, 'Kategorien er: ', '')
WHERE type = 'kaos' AND tittel = 'Kategorien er...';
