-- Klink spillpakke — challenge pack med 5 subkategorier
DO $$
DECLARE
  klink_id UUID;
BEGIN

INSERT INTO spillpakker (navn, beskrivelse, regler, farge, ikon, aktiv)
VALUES (
  'Klink',
  'Party-pakken for de som vil ha det gøy. Utfordringer, imitasjoner, hot seats og mer.',
  'Trekk ett kort og gjør som det sier. Spiller utpekes automatisk.',
  '#7C3AED',
  'zap',
  true
) RETURNING id INTO klink_id;

-- Shot or Text
INSERT INTO kort (spillpakke_id, type, tittel, innhold) VALUES
  (klink_id, 'kaos', 'Shot or Text', '{spiller}, send «Vet du hvor jeg får tak i hemorroidekrem? Blør litt fra ræva når jeg tørker» til den siste du chattet med — eller ta en shot'),
  (klink_id, 'kaos', 'Shot or Text', '{spiller}, send «Har du noen erfaring med hemorroider? Spør for en venn» til en tilfeldig kontakt — eller ta en shot'),
  (klink_id, 'kaos', 'Shot or Text', '{spiller}, send «Savner deg, tenkte bare du skulle vite det ❤️» til den siste eksens du har i telefonen — eller ta en shot');

-- Imitatoren
INSERT INTO kort (spillpakke_id, type, tittel, innhold) VALUES
  (klink_id, 'kaos', 'Imitatoren', '{spiller} imiterer en valgfri kjendis. Den første som gjetter riktig deler ut {sips} slurker!'),
  (klink_id, 'kaos', 'Imitatoren', '{spiller} imiterer en norsk politiker. Den første som gjetter hvem deler ut {sips} slurker!'),
  (klink_id, 'kaos', 'Imitatoren', '{spiller} imiterer en kjent filmkarakter. Den første som gjetter deler ut {sips} slurker!');

-- Kategorien er...
INSERT INTO kort (spillpakke_id, type, tittel, innhold) VALUES
  (klink_id, 'kaos', 'Kategorien er...', 'Kategorien er: ting man aldri burde si under sex. {spiller} starter!'),
  (klink_id, 'kaos', 'Kategorien er...', 'Kategorien er: det verste som kan skje under en begravelse. {spiller} starter!'),
  (klink_id, 'kaos', 'Kategorien er...', 'Kategorien er: unnskyldninger for å komme for sent på jobb. {spiller} starter!');

-- Hot Seat (timer_sekunder = 60)
INSERT INTO kort (spillpakke_id, type, tittel, innhold, timer_sekunder) VALUES
  (klink_id, 'kaos', 'Hot Seat', '{spiller} settes i the Hot Seat! Resten av gjengen griller deg i 1 minutt. Trykk Start når du er klar — og si Stopp når du tror det har gått nøyaktig 1 minutt!', 60),
  (klink_id, 'kaos', 'Hot Seat', '{spiller} i the Hot Seat! Svar ærlig på alt gjengen spør om. Trykk Start og prøv å stoppe på nøyaktig 1 minutt!', 60),
  (klink_id, 'kaos', 'Hot Seat', 'Hot Seat — {spiller}! Gjengen bestemmer temaet. Trykk Start og si Stopp når du tror minuttet er ute!', 60);

-- Pek på én
INSERT INTO kort (spillpakke_id, type, tittel, innhold) VALUES
  (klink_id, 'kaos', 'Pek på én', '{spiller}, hvem her blir mest drita i kveld?'),
  (klink_id, 'kaos', 'Pek på én', '{spiller}, hvem i gjengen ville vært best som stripper?'),
  (klink_id, 'kaos', 'Pek på én', '{spiller}, hvem her tror du har flest eksers?');

END $$;
