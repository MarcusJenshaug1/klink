-- Fem fingre — ny korttype med 5 påstander per kort
--
-- Strukturert felt for påstander + dedikert spillpakke med seed-kort.

-- 1. Kolonne for de 5 påstandene (kun brukt av type='femfingre')
ALTER TABLE kort
  ADD COLUMN IF NOT EXISTS paastander TEXT[];

ALTER TABLE kort
  DROP CONSTRAINT IF EXISTS kort_paastander_length_check;
ALTER TABLE kort
  ADD CONSTRAINT kort_paastander_length_check
  CHECK (paastander IS NULL OR array_length(paastander, 1) = 5);

-- 2. Seed spillpakke "Fem fingre"
DO $$
DECLARE
  fem_fingre_id UUID;
BEGIN

INSERT INTO spillpakker (navn, beskrivelse, regler, farge, ikon, aktiv, droyhet)
VALUES (
  'Fem fingre',
  'Fem påstander — tell fingre ned for hver ting du har gjort. Du velger selv om du drikker per treff eller per miss.',
  'Hold opp fem fingre. Les påstandene én for én. Bøy en finger for hver påstand som stemmer på deg. Når alle fem er lest, drikk én slurk per finger nede — eller én slurk per finger oppe. Bestem selv før runden starter.',
  '#F59E0B',
  'hand',
  true,
  'normal'
) RETURNING id INTO fem_fingre_id;

-- Seed-kort: hvert kort har nøyaktig 5 påstander
INSERT INTO kort (spillpakke_id, type, tittel, innhold, paastander, droyhet) VALUES
  (fem_fingre_id, 'femfingre', 'Fest', '', ARRAY[
    'Sovnet på et nachspiel',
    'Mistet telefonen på byen',
    'Danset på et bord',
    'Kastet opp på offentlig sted',
    'Våknet uten å vite hvordan du kom hjem'
  ], 'normal'),

  (fem_fingre_id, 'femfingre', 'Dating', '', ARRAY[
    'Hatt en Tinder-date',
    'Ghostet noen',
    'Blitt ghostet',
    'Datet to personer samtidig',
    'Blitt dumpet på SMS'
  ], 'normal'),

  (fem_fingre_id, 'femfingre', 'Reise', '', ARRAY[
    'Reist alene i utlandet',
    'Mistet passet',
    'Sovnet på flyplassen',
    'Endt opp i feil land',
    'Havnet i bråk med tollen'
  ], 'normal'),

  (fem_fingre_id, 'femfingre', 'Jobb & skole', '', ARRAY[
    'Løyet for sjefen/læreren',
    'Sovnet på jobb eller i time',
    'Kommet bakfull på jobb',
    'Sagt opp på dramatisk vis',
    'Stjålet noe fra arbeidsplassen'
  ], 'normal'),

  (fem_fingre_id, 'femfingre', 'Pinlig', '', ARRAY[
    'Sendt melding til feil person',
    'Ringt en eks i fylla',
    'Likt et bilde fra 2014 ved et uhell',
    'Kalt en lærer «mamma»',
    'Gått på do med noen som hørte alt'
  ], 'normal'),

  (fem_fingre_id, 'femfingre', 'Drøyt', '', ARRAY[
    'Kysset noen av samme kjønn',
    'Hatt en one-night stand',
    'Hatt sex på et offentlig sted',
    'Flørtet med en som er tatt',
    'Sendt nudes'
  ], 'droy'),

  (fem_fingre_id, 'femfingre', 'Teknologi', '', ARRAY[
    'Googlet deg selv',
    'Hatt en falsk profil',
    'Stalket en eks',
    'Kjøpt noe i fylla',
    'Blitt blokkert av noen du kjenner'
  ], 'normal'),

  (fem_fingre_id, 'femfingre', 'Venner', '', ARRAY[
    'Kranglet med en bestevenn',
    'Snakket dritt om en venn',
    'Latt en venn betale for deg',
    'Glemt en bursdag',
    'Løyet til vennene dine for å slippe å bli med ut'
  ], 'normal'),

  (fem_fingre_id, 'femfingre', 'Skjult talent', '', ARRAY[
    'Sunget karaoke edru',
    'Stått på scene foran flere enn 50',
    'Vunnet en konkurranse',
    'Lært deg selv et språk',
    'Kan et instrument de fleste ikke vet om'
  ], 'mild'),

  (fem_fingre_id, 'femfingre', 'Ungdomsskolen', '', ARRAY[
    'Skulket en time',
    'Blitt tatt for juks',
    'Hatt en kjæreste du skammer deg over',
    'Brent opp noe du ikke burde',
    'Stjålet godteri fra en butikk'
  ], 'normal'),

  (fem_fingre_id, 'femfingre', 'Vorspiel', '', ARRAY[
    'Drukket opp andres alkohol',
    'Kommet for sent med vilje',
    'Forlatt et vorspiel uten å si hei',
    'Spydd hos en venn',
    'Blitt hentet av politiet'
  ], 'normal'),

  (fem_fingre_id, 'femfingre', 'Filmen i hodet', '', ARRAY[
    'Sett en film du sier du har sett, men ikke har',
    'Grått til en Pixar-film som voksen',
    'Sett en hel sesong på én dag',
    'Spoilert en film for noen',
    'Elsket en film alle hater'
  ], 'mild'),

  (fem_fingre_id, 'femfingre', 'Penger', '', ARRAY[
    'Vært helt blakk',
    'Lånt penger av foreldre som voksen',
    'Kjøpt noe dumt dyrt',
    'Tjent penger under bordet',
    'Tapt penger på gambling'
  ], 'normal'),

  (fem_fingre_id, 'femfingre', 'Sommeren', '', ARRAY[
    'Brent deg så kraftig at du ikke kunne sove',
    'Badet naken',
    'Hatt ferieromantikk',
    'Glemt solkremen på bestevennen din',
    'Havnet i bråk i ferien'
  ], 'normal'),

  (fem_fingre_id, 'femfingre', 'Selvtillit', '', ARRAY[
    'Gått av scenen i protest',
    'Sagt nei til en sjef',
    'Flørtet aktivt med noen høyere i status',
    'Gjort narr av en lærer foran klassen',
    'Bedt noen om å gå ut av rommet'
  ], 'normal');

END $$;
