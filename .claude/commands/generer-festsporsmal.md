---
description: Genererer norske kortspørsmål til Klink-spillpakker (kort-tabellen) med duplikatsjekk, preview og godkjenningsflyt
---

Følg nøyaktig denne arbeidsflyten. Hopp aldri over steg. Stopp alltid ved godkjenningspunkt.

Stilguide og scripts: `.claude/skills/generer-festsporsmal/`

---

## STEG 1 — Parse argumenter

Argumenter: $ARGUMENTS

Format: `<antall> <pakke> [modus]`

Eksempler:
- `100 snusboksen drøy`
- `50 pekeleken blandet`
- `80 jeg-har-aldri rolig`
- `60 snusboksen student`

**Pakkenavn → visningsnavn:**
| Argument              | Pakkenavn i DB     |
|-----------------------|--------------------|
| snusboksen            | Snusboksen         |
| jeg-har-aldri         | Jeg har aldri      |
| pekeleken             | Pekeleken          |

Gyldige moduser: `rolig` | `blandet` | `drøy` | `student` | `generic`
Standard modus: `blandet`

Hvis antall eller pakke mangler, stopp og vis korrekt bruk.

---

## STEG 2 — Les miljøvariabler

```bash
grep "NEXT_PUBLIC_SUPABASE_URL\|NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local
```

Hold på URL og ANON_KEY for REST-kall.

---

## STEG 3 — Slå opp pack-ID fra Supabase

```bash
SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d= -f2)
ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d= -f2)

curl -s "${SUPABASE_URL}/rest/v1/spillpakker?select=id,navn&aktiv=eq.true" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY"
```

Finn `id` for ønsket pakke. Stopp med feilmelding hvis pakken ikke finnes.

---

## STEG 4 — Hent eksisterende kort for pakken

```bash
bash .claude/skills/generer-festsporsmal/scripts/check_duplicates.sh \
  --fetch-existing-kort <PACK_ID>
```

Skriver eksisterende kort til `/tmp/klink_existing_kort.json`. Merk antall.

---

## STEG 5 — Generer nye kort

Generer `antall * 1.4` kandidater som overskudd.

### Korttyper og schema

Hvert kort skal ha:
```json
{
  "spillpakke_id": "<uuid>",
  "type": "<kort_type>",
  "tittel": "<kort kategoritittel eller tom streng>",
  "innhold": "<selve kortteksten>"
}
```

**Gyldige typer** (`kort_type` enum): `utfordring` | `alle_drikker` | `pekelek` | `regel` | `kategori` | `snusboks`

### Typefordeling per pakke

**Snusboksen** — 100 % type `snusboks`:
- Alle kort er **én setning** i "Hvem…?"-format
- Maks 15 ord. Ingen rim. Ingen kupletter. Ingen "kast boksen til".
- Stilen er direkte, sosial, norsk hverdagsspråk
- Ingen `{spiller}`-plassholdere — peker generisk mot gruppen
- tittel: alltid `""`
- Varierte ingresser: "Hvem er mest sannsynlig til å…", "Hvem hadde…",
  "Hvem virker…, men…", "Hvem er typen til å…", "Hvem kunne…"
- Eksempler på RIKTIG format:
  ```
  Hvem er mest sannsynlig til å sende en melding de angrer på i kveld?
  Hvem hadde brukt lengst tid foran speilet i dag?
  Hvem virker uskyldig, men har egentlig de villeste historiene?
  Hvem er typen til å si «jeg tar det rolig» og holde ut i ti minutter?
  Hvem er minst sannsynlig til å gå hjem alene i kveld?
  ```

**Jeg har aldri** — 100 % type `alle_drikker`:
- tittel: alltid `""`
- innhold: alltid starter med `"Jeg har aldri …"` — én setning
- Alle i rommet som HAS gjort det, drikker

**Pekeleken** — 100 % type `pekelek`:
- tittel: alltid `""`
- innhold: `"Hvem er mest sannsynlig å …?"` eller `"Hvem ville …?"` eller `"Hvem i gjengen …?"`

### Stilregler

- Norsk bokmål. Maks 15 ord per kort.
- Muntlig, direkte tone — ikke AI-preget.
- Bruk `{spiller}`, `{spiller1}`, `{spiller2}` for spillerinterpolasjon.
- Ingen mindreårige, tvang, overgrep, farlig alkoholbruk, doxxing.

### Modus → intensitet

| Modus   | Stil                                                    |
|---------|---------------------------------------------------------|
| rolig   | Ufarlig, sosialt. Ingen eksplisitt seksualitet.         |
| blandet | Mix. Litt personlig, litt drøyt.                        |
| drøy    | Dristig, voksen humor, flørtet. Tydelige antydninger.   |
| student | Studieliv, fadderuke, kollektiv, økonomi.               |
| generic | Universell, ikke kontekstspesifikk.                     |

---

## STEG 6 — Skriv kandidater til fil

Skriv alle genererte kandidater til `/tmp/klink_candidates.json`:
```json
[
  {
    "spillpakke_id": "<uuid>",
    "type": "utfordring",
    "tittel": "Utfordring",
    "innhold": "Fortell om siste gang du gjorde noe du angret på – eller drikk 4"
  }
]
```

---

## STEG 7 — Duplikatsjekk

```bash
bash .claude/skills/generer-festsporsmal/scripts/check_duplicates.sh \
  --check-batch /tmp/klink_candidates.json \
  --existing /tmp/klink_existing_kort.json
```

Tre nivåer: eksakt, normalisert (lowercase+trim+fjern tegnsetting), semantisk (Jaccard-trigram ≥ 0.55).
Forkastede kandidater erstattes til batchen er full.
Endelig godkjent batch skrives til `/tmp/klink_approved.json`.

---

## STEG 8 — Vis preview

⚠️ **STOPP HER. Vis preview. Gjør ingenting mer.**

Format:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 KLINK KORT — PREVIEW
 Batch:       <batchnavn>
 Pakke:       <pakkenavn>
 Modus:       <modus>
 Ønsket:      <antall>
 Klare:       <klare>
 Forkastet:   <forkastet> (duplikat/intern overlap)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. [utfordring] Fortell om siste gang du gjorde noe du angret på – eller drikk 4
     duplikat: OK

  2. [pekelek] Hvem er mest sannsynlig til å kysse noen i kveld?
     duplikat: OK

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Skriv GODKJENT for å lagre i databasen.
Skriv GODKJENT <batchnavn> for egendefinert navn.
Skriv AVVIS for å forkaste.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## STEG 9 — Vent på godkjenning

- `GODKJENT` → fortsett til steg 10
- `GODKJENT <navn>` → bruk `<navn>` som batchnavn, fortsett
- `AVVIS` → slett `/tmp/klink_*.json`, avslutt
- Alt annet → svar at du venter på GODKJENT eller AVVIS

---

## STEG 10 — Re-sjekk rett før insert

```bash
bash .claude/skills/generer-festsporsmal/scripts/check_duplicates.sh \
  --check-batch /tmp/klink_approved.json \
  --existing /tmp/klink_existing_kort.json \
  --recheck
```

Fjern stille eventuelle nye duplikater. Noter antall fjernet.

---

## STEG 11 — Bygg insert-migrasjon

Finn neste migrasjonsnummer:
```bash
ls supabase/migrations/ | grep "^[0-9]" | sort | tail -1
```

Bygg migrasjon:
```bash
python3 .claude/skills/generer-festsporsmal/scripts/build_insert_migration.py \
  --input /tmp/klink_approved.json \
  --batch-name "<batchnavn>" \
  --pack-name "<pakkenavn>" \
  --mode "<modus>" \
  --next-migration-number <N+1> \
  --output supabase/migrations/<NNNNN>_kort_<batchnavn>.sql
```

Les gjennom SQL-filen og verifiser at den ser riktig ut.

---

## STEG 12 — Dry-run push

```bash
npx supabase db push --dry-run 2>&1
```

Sjekk at ingen feil rapporteres.

---

## STEG 13 — Faktisk push

```bash
echo "Y" | npx supabase db push 2>&1
```

---

## STEG 14 — Sluttstatus og opprydding

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PUSH FULLFØRT
 Batch:         <batchnavn>
 Pakke:         <pakkenavn>
 Lagt inn:      <N> kort
 Hoppet over:   <M> (duplikater ved re-sjekk)
 Migrasjonsfil: supabase/migrations/<fil>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

```bash
rm -f /tmp/klink_*.json
```

---

## Feilhåndtering

- Pakke ikke funnet → vis tilgjengelige pakker og avslutt
- Supabase CLI mangler → informer om `npm install -g supabase`
- Nettverksfeil → ikke fortsett, informer brukeren
- Python mangler → vis SQL og be brukeren kjøre det manuelt
- Push feiler → vis feilmelding, behold temp-filer
