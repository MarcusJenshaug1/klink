-- Slett alle kort fra Snusboksen, Jeg har aldri og Pekeleken
DELETE FROM kort
WHERE spillpakke_id IN (
  SELECT id FROM spillpakker
  WHERE navn IN ('Snusboksen', 'Jeg har aldri', 'Pekeleken')
);
