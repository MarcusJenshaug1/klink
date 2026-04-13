-- Klink: Jeg har aldri — godkjente kort (4 runder med brukerreview)
-- 40 kort, type alle_drikker, blandet + drøy stil

BEGIN;

INSERT INTO kort (spillpakke_id, type, tittel, innhold, utfordring)
VALUES
  -- Runde 1 (blandet)
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri sendt en melding til exen jeg har angret på dagen derpå', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri våknet opp hjemme hos noen jeg ikke kjente før kvelden før', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri logget inn på eksens Netflix etter bruddet', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri diktet opp en sykdom for å slippe en sosial forpliktelse', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri hatt sex på en offentlig plass', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri stalket noen i dette rommet på Instagram', 'Vis den eldste bildet du har sett på av noen her, eller drikk {sips} slurker'),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri kysset noen i dette rommet', 'Alle som har: pek på hvem — de kan dele ut {sips} slurker'),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri skjult for foreldrene mine hvor full jeg egentlig var', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri holdt på med to personer som kjenner hverandre uten at de visste om det', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri sendt et nakenbilde', NULL),

  -- Runde 2 (blandet)
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri skrevet «jeg er på vei» når jeg ikke engang hadde begynt å kle på meg', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri kysset noen jeg visste hadde kjæreste', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri latt som jeg sov for å unngå en samtale', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri ringt exen etter midnatt og angret neste morgen', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri sjekket telefonen til noen i dette rommet uten at de visste om det', 'Alle som har: si hvem sin telefon — de deler ut {sips} slurker'),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri hatt sex med noen jeg møtte samme kveld', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri hatt en one night stand med noen fra vennegjengen', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri blitt tatt på fersken i en løgn og nektet å innrømme det', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri gjort noe på en fest som jeg håper ingen husker', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri brukt noen for å gjøre exen sjalu', NULL),

  -- Runde 3 (blandet/drøy)
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri ligget med noen bare for å se om gnisten fortsatt var der', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri løyet om å ha kommet for å slippe å fortsette', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri kansellert en date via melding fem minutter før', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri hatt sex med eksen etter at vi offisielt var ferdig', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri delt et skjermbilde av en samtale jeg ikke burde delt', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri ghostet noen etter en date jeg syntes var helt grei', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri flørtet med søskenet til en eks', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri lest en melding og latt den stå ulest med vilje', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri hatt sex med noen jeg egentlig ikke likte', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri lagt ut noe på sosiale medier for å gjøre noen sjalu', NULL),

  -- Runde 4 (drøy)
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri hatt sex med to fra samme vennekrets samme helg', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri sendt et nakenbilde til feil person', 'Vis forklaringsmeldingen du sendte etterpå, eller drikk {sips} ekstra'),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri hatt sex mens noen andre var i rommet', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri latt noen se på mens jeg hadde sex', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri filmet meg selv under sex', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri hatt sex med en kollega eller sjef', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri hatt trekant', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri fått eller gitt oralsex på en offentlig plass', NULL),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri hatt sex med noen i dette rommet', 'Drikk {sips} slurker for hver person i dette rommet du har hatt sex med'),
  ('25b1f74f-0b6b-468b-9289-f83812e80540', 'alle_drikker', '', 'Jeg har aldri betalt for noe seksuelt eller fått betalt', NULL)
ON CONFLICT DO NOTHING;

COMMIT;
