-- Klink: Pekeleken — drøy runde 1, 10/10 godkjent
BEGIN;

INSERT INTO kort (spillpakke_id, type, tittel, innhold, utfordring)
VALUES
  ('24d547bb-d794-4eb0-8296-599a6f15740e', 'pekelek', '', 'Hvem her ville du helst hatt sex med?', NULL),
  ('24d547bb-d794-4eb0-8296-599a6f15740e', 'pekelek', '', 'Hvem i rommet tror du er villest i sengen?', NULL),
  ('24d547bb-d794-4eb0-8296-599a6f15740e', 'pekelek', '', 'Hvem her har du tenkt på seksuelt mer enn én gang?', NULL),
  ('24d547bb-d794-4eb0-8296-599a6f15740e', 'pekelek', '', 'Hvem ville tatt med seg to stykker hjem fra denne festen?', NULL),
  ('24d547bb-d794-4eb0-8296-599a6f15740e', 'pekelek', '', 'Hvem her tror du har flest på samvittigheten?', NULL),
  ('24d547bb-d794-4eb0-8296-599a6f15740e', 'pekelek', '', 'Hvem er mest sannsynlig å ha sendt nakenbilder til noen i dette rommet?', NULL),
  ('24d547bb-d794-4eb0-8296-599a6f15740e', 'pekelek', '', 'Hvem ville hatt sex med en her inne hvis alle glemte det neste dag?', NULL),
  ('24d547bb-d794-4eb0-8296-599a6f15740e', 'pekelek', '', 'Hvem i gjengen er mest sannsynlig å ha hatt trekant?', NULL),
  ('24d547bb-d794-4eb0-8296-599a6f15740e', 'pekelek', '', 'Hvem her ville du kysset nå hvis du måtte velge?', NULL),
  ('24d547bb-d794-4eb0-8296-599a6f15740e', 'pekelek', '', 'Hvem i rommet har den skittenste fantasien?', NULL)
ON CONFLICT DO NOTHING;

COMMIT;
