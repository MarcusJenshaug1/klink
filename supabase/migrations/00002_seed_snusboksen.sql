-- Seed: Snusboksen spillpakke
-- Run after 00001_schema.sql

INSERT INTO spillpakker (id, navn, beskrivelse, regler, farge, ikon, aktiv) VALUES (
  'a1b2c3d4-0001-4000-8000-000000000001',
  'Snusboksen',
  'Den klassiske snusboksen! Send boksen rundt og svar pa sporsmal.',
  '## Slik spiller du

1. En tilfeldig spiller starter med snusboksen
2. Spilleren leser kortet hoyt
3. Svarer spilleren feil eller nekter, ma de drikke
4. Snusboksen sendes videre til neste spiller

**Tips:** Vær kreativ med svarene!',
  '#4B3FC7',
  '🫙',
  true
);

-- Snusboks-kort (kast-sporsmal)
INSERT INTO kort (spillpakke_id, type, tittel, innhold) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'snusboks', 'Snusboksen starter', '{spiller} starter med snusboksen!'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'snusboks', 'Nevn 3', 'Nevn 3 land i Asia'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'snusboks', 'Nevn 3', 'Nevn 3 norske fotballag'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'snusboks', 'Nevn 3', 'Nevn 3 olmerker'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'snusboks', 'Nevn 3', 'Nevn 3 filmer med Leonardo DiCaprio'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'snusboks', 'Nevn 3', 'Nevn 3 hovedsteder i Europa'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'snusboks', 'Nevn 3', 'Nevn 3 norske artister'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'snusboks', 'Nevn 3', 'Nevn 3 typer ost'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'snusboks', 'Sporsmal', 'Hva er hovedstaden i Australia?'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'snusboks', 'Sporsmal', 'Hvilket ar ble Norge selvstendig?'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'snusboks', 'Sporsmal', 'Hva heter den lengste elven i verden?'),

  -- Utfordringer
  ('a1b2c3d4-0001-4000-8000-000000000001', 'utfordring', 'Utfordring', '{spiller} ma ta en slurk med lukkede oyne'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'utfordring', 'Utfordring', '{spiller1} og {spiller2} skaler!'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'utfordring', 'Utfordring', '{spiller} velger noen som ma drikke'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'utfordring', 'Utfordring', '{spiller} ma fortelle en flau historie, eller drikke dobbelt'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'utfordring', 'Utfordring', 'Alle som har {spiller} pa telefonen sin drikker'),

  -- Pekelek
  ('a1b2c3d4-0001-4000-8000-000000000001', 'pekelek', 'Pek pa', 'Hvem er mest sannsynlig til a sove pa jobb?'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'pekelek', 'Pek pa', 'Hvem er worst sjanser for a overleve en zombie-apokalypse?'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'pekelek', 'Pek pa', 'Hvem ville blitt den beste presidenten?'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'pekelek', 'Pek pa', 'Hvem her har flest hemmeligheter?'),

  -- Alle drikker
  ('a1b2c3d4-0001-4000-8000-000000000001', 'alle_drikker', 'Skal!', 'Alle drikker! Ingen unntak!'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'alle_drikker', 'Vannfall!', 'Vannfall! {spiller} begynner, alle folger etter. Du kan ikke stoppe for personen for deg stopper.'),

  -- Regel
  ('a1b2c3d4-0001-4000-8000-000000000001', 'regel', 'Ny regel', 'Ingen far si navnet til {spiller} resten av spillet. Straff: drikk!'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'regel', 'Ny regel', 'Alle ma snakke med aksent til neste regel-kort. Straff: drikk!'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'regel', 'Ny regel', 'Thumbmaster! {spiller} kan legge tommelen pa bordet nar som helst. Siste som gjor det drikker.'),

  -- Kategori
  ('a1b2c3d4-0001-4000-8000-000000000001', 'kategori', 'Kategori', 'Ting man finner pa badet. {spiller} begynner!'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'kategori', 'Kategori', 'Cocktails. {spiller} begynner!'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'kategori', 'Kategori', 'Norske byer. {spiller} begynner!'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'kategori', 'Kategori', 'Ting som er gronne. {spiller} begynner!');
