---
name: generer-festsporsmal
description: Genererer norske festspørsmål til Klink-drikkespillet med full duplikatsjekk mot Supabase, preview og godkjenningsflyt
allowed-tools: Bash, Read, Write, Glob, Grep
---

# Skill: generer-festsporsmal

Følg nøyaktig denne arbeidsflyten. Hopp aldri over steg. Stopp alltid ved godkjenningspunkt.

---

## STEG 1 — Parse argumenter

`$ARGUMENTS` format: `<antall> [modus]`

- `20` → antall=20, modus=**blandet**
- `50 drøy` → antall=50, modus=**drøy**
- `15 rolig` → antall=15, modus=**rolig**
- `25 student` → antall=25, modus=**student**
- `40 generic` → antall=40, modus=**generic**

Gyldige moduser: `rolig` | `blandet` | `drøy` | `student` | `generic`
Standard modus: `blandet`

Hvis antall mangler eller er ugyldig, stopp og forklar korrekt bruk.

---

## STEG 2 — Finn prosjektroten

Led etter `supabase/config.toml` og `.env.local` oppover fra current working directory.
Kjør:
```bash
pwd
ls supabase/config.toml .env.local 2>&1
```

Les miljøvariabler fra `.env.local`:
```bash
grep "SUPABASE_URL\|SUPABASE_ANON_KEY\|SUPABASE_SERVICE_ROLE_KEY" .env.local
```

Hold på `SUPABASE_URL` og `SUPABASE_ANON_KEY` for REST-kall.

---

## STEG 3 — Sjekk om `festsporsmal`-tabellen finnes

Kjør check_duplicates.sh med `--check-table`:
```bash
bash .claude/skills/generer-festsporsmal/scripts/check_duplicates.sh --check-table
```

Scriptet returnerer `TABLE_EXISTS` eller `TABLE_MISSING`.

**Hvis TABLE_MISSING:**
- Informer brukeren om at tabellen mangler
- Kjør schema-migrasjonen først:
  ```bash
  # Finn neste migrasjonsnummer
  ls supabase/migrations/ | sort | tail -1
  # Kopier schema.sql som ny migrasjon
  cp .claude/skills/generer-festsporsmal/sql/schema.sql supabase/migrations/XXXXX_festsporsmal_schema.sql
  echo "Y" | npx supabase db push
  ```
- Bekreft at tabellen nå finnes før du fortsetter.

---

## STEG 4 — Hent eksisterende spørsmål fra databasen

Kjør:
```bash
bash .claude/skills/generer-festsporsmal/scripts/check_duplicates.sh --fetch-existing
```

Scriptet skriver eksisterende spørsmål til `/tmp/klink_existing_questions.json`.
Merk antall eksisterende spørsmål.

---

## STEG 5 — Generer nye spørsmål

Generer `antall * 1.5` kandidater (overskudd for å kompensere for duplikater).

### Regler per modus

**rolig**: sosiale, ufarlige, festlige. Ingen seksuelle referanser. Maks spice_level=2.
**blandet**: mix av rolig og drøy. Spredt på alle kategorier. Spice 1–4.
**drøy**: dristig, voksen humor, flørtet, lett frekk. Ingen vold/tvang. Spice 3–5.
**student**: studieliv, fadderuke, kollektiv, økonomi, kunnskap. Spice 1–3.
**generic**: universell, ikke stedspesifikk. Fungerer i alle settinger. Spice 1–3.

### Stilregler
- Språk: norsk bokmål
- Tone: kort, direkte, muntlig. Maks 12 ord per spørsmål.
- Hovedform: `Hvem …?`-spørsmål (minst 75 %)
- Variasjon: noen handlingskort, noen skåler — se kvoter
- Ingen generisk AI-stil. Spørsmålene skal høres menneskeskapte ut.

### Kvoter per batch
- Maks 12 % handlingskort (`is_action=true`)
- Maks 8 % skål-kort (`is_cheers=true`)
- Minst 75 % `Hvem …?`-spørsmål
- Maks 1 spørsmål per batch med samme kjerneidé
- Maks 2 spørsmål med samme predicate (eks. "mest full", "lettest å overtale")

### Kategorier å balansere
1. fest_og_alkohol
2. flort_og_dating
3. personlighet_og_vane
4. status_og_stil
5. vennskap_og_gruppe
6. fremtidsantakelser
7. lett_drøy_humor
8. handlingskort
9. skaal

### Forbudt innhold
- Mindreårige
- Tvang, overgrep, ikke-samtykke
- Seksualisert vold
- Instruksjoner om farlig alkoholinntak
- Doxxing / ekte navngitte personer
- Nedverdigende / ulovlig oppfordring

---

## STEG 6 — Duplikatsjekk

Kjør:
```bash
bash .claude/skills/generer-festsporsmal/scripts/check_duplicates.sh \
  --check-batch /tmp/klink_candidates.json \
  --existing /tmp/klink_existing_questions.json
```

Scriptet sjekker tre nivåer:
1. **Eksakt**: identisk tekst
2. **Normalisert**: lowercase + trim + fjern avsluttende tegnsetting
3. **Semantisk**: samme kjerneidé selv om formuleringen varierer

Forkast kandidater som matcher nivå 1 eller 2 automatisk.
Merk nivå-3-treff som `NESTEN_DUPLIKAT` og ekskluder dem fra batchen.

Generer erstatninger for forkastede kandidater til batchen er full.

Sjekk også intern duplikasjon i batchen selv.

---

## STEG 7 — Vis preview

⚠️ **STOPP HER. Vis preview og vent på GODKJENT.**

Vis følgende format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FESTSPØRSMÅL — PREVIEW
 Batch:       klink_<YYYYMMDD>_<modus>
 Modus:       <modus>
 Ønsket:      <antall>
 Klare:       <antall godkjenningsklare>
 Forkastet:   <antall forkastet> (duplikat/nesten-duplikat)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 1. Hvem ville sovnet på nachspiel?
    kategori: fest_og_alkohol | tone: rolig | spice: 2 | duplikat: OK

 2. Hvem er mest sannsynlig å flørte med servitøren?
    kategori: flort_og_dating | tone: blandet | spice: 3 | duplikat: OK

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Skriv GODKJENT for å lagre i databasen.
Skriv GODKJENT <batchnavn> for å gi batchen et egendefinert navn.
Skriv AVVIS for å forkaste hele batchen.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Hvis noen kandidater ble avvist som duplikater, vis:
```
Topp 5 nærmeste treff fra databasen:
  "Hvem blir fullest i kveld?" (sim: 0.91)  ← avviste "Hvem ender mest drita i kveld?"
  ...
```

**Vent. Gjør ingenting mer.**

---

## STEG 8 — Vent på godkjenning

Les brukerens neste melding.

- Hvis meldingen starter med `GODKJENT`: fortsett til STEG 9.
- Hvis meldingen er `AVVIS`: avslutt, informer brukeren, slett temp-filer.
- Noe annet: svar at du venter på GODKJENT eller AVVIS, ikke fortsett.

Hvis brukeren skriver `GODKJENT <navn>`: bruk `<navn>` som batchnavn.

---

## STEG 9 — Re-sjekk rett før insert

Kjør en ny runde duplikatsjekk mot databasen:
```bash
bash .claude/skills/generer-festsporsmal/scripts/check_duplicates.sh \
  --check-batch /tmp/klink_approved.json \
  --existing /tmp/klink_existing_questions.json \
  --recheck
```

Hvis nye duplikater dukker opp (noen pushet i mellomtiden): fjern dem stille og noter.

---

## STEG 10 — Bygg insert-migrasjon

Finn neste migrasjonsnummer:
```bash
ls supabase/migrations/ | grep "^[0-9]" | sort | tail -1
```

Kjør:
```bash
python3 .claude/skills/generer-festsporsmal/scripts/build_insert_migration.py \
  --input /tmp/klink_approved.json \
  --batch-name "<batchnavn>" \
  --mode "<modus>" \
  --next-migration-number <N+1> \
  --output supabase/migrations/<NNNNN>_festsporsmal_<batchnavn>.sql
```

Les gjennom den genererte SQL-filen og verifiser at den ser riktig ut.

---

## STEG 11 — Dry-run push

```bash
npx supabase db push --dry-run 2>&1
```

Sjekk at ingen feil rapporteres.

---

## STEG 12 — Faktisk push

```bash
echo "Y" | npx supabase db push 2>&1
```

---

## STEG 13 — Sluttstatus

Vis:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PUSH FULLFØRT
 Batch:        <batchnavn>
 Lagt inn:     <N> spørsmål
 Hoppet over:  <M> (duplikater oppdaget i re-sjekk)
 Migrasjonsfil: supabase/migrations/<fil>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Rydd opp temp-filer:
```bash
rm -f /tmp/klink_*.json
```

---

## Feilhåndtering

- Supabase CLI ikke funnet → informer om `npm install -g supabase`
- Tabellen finnes ikke → kjør schema-migrasjon automatisk (se Steg 3)
- Nettverksfeil ved duplikatsjekk → ikke fortsett, informer brukeren
- Python ikke tilgjengelig → vis SQL manuelt og be brukeren kjøre det
- Push feiler → vis full feilmelding, ikke slett temp-filer
