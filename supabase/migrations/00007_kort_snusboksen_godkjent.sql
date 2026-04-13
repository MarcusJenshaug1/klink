-- Klink: Snusboksen — godkjente kort (3 runder med brukerreview)
-- 33 kort, type snusboks, drøy stil

BEGIN;

INSERT INTO kort (spillpakke_id, type, tittel, innhold, utfordring)
VALUES
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem er mest sannsynlig til å bli med noen de ikke kjenner hjem?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem hadde klart seg best på en spontan date?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem virker uskyldig, men har egentlig de villeste historiene?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem er typen til å si «bare én til» og mene det seks ganger?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem ser ut som de har full kontroll, men mister den raskest?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem hadde vært farligst å gi tilgang til andres telefon i to minutter?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem er typen til å flørte med feil person på feil tidspunkt?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem kommer til å bli kveldens store snakkis?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem kommer til å kline med noen på dansegulvet?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem sover med en fremmed i natt?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem skal møte noen fra Tinder i kveld?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem kommer til å dra sist fra nach?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem hadde klart å flørte seg til gratis drinker hele kvelden?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem er mest sannsynlig til å ha googlet noen i dette rommet?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem kommer til å gjøre noe i kveld de vil skryte av i morgen?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem er ikke singel, men oppfører seg som det i kveld?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem har allerede bestemt seg for hvem de vil kline med?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem ender kvelden et helt annet sted enn planlagt?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem er gjengens homewrecker?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem drar fra vorset med noen ingen visste de likte?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem er her for å møte noen, ikke bare henge med gjengen?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem later som de ikke er interessert, men er det?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem sender melding til exen i kveld?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem ender ikke alene i natt?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem har hatt sex med noen andre i dette rommet?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem er best i sengen ifølge resten av gjengen?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem ville gjort det på do på en bar hvis stemningen var riktig?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem har hatt «vi er bare venner»-sex flest ganger?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem sender nakenbilde i kveld hvis noen spør pent?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem har ligget med flest fra denne gjengen?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem kler seg av raskest?', 'Den som klarer å legge en truse på bordet raskest kan dele ut {sips} slurker!'),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem er mest sannsynlig til å ha sex i kveld?', NULL),
  ('fe203ea0-6a68-4a76-ba23-cfba9141bfb0', 'snusboks', '', 'Hvem har det villeste sexlivet ingen aner om?', NULL)
ON CONFLICT DO NOTHING;

COMMIT;
