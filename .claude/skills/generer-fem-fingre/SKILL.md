---
name: generer-fem-fingre
description: Genererer "Fem fingre"-kort til Klink (5 påstander per kort). Duplikatsjekk mot kort-tabellen, preview og godkjenningsflyt.
allowed-tools: Bash, Read, Write, Glob, Grep
---

# Skill: generer-fem-fingre

Følg nøyaktig denne arbeidsflyten. Hopp aldri over steg. Stopp alltid ved godkjenningspunkt.

Hvert Fem fingre-kort har:
- `tittel`: kort kategori-label (f.eks. "Fest", "Dating", "Pinlig", "Drøyt")
- `paastander`: nøyaktig 5 korte påstander på norsk — hver påstand starter med verb i infinitiv/preteritum og dekker en ting man kan ha gjort eller ikke gjort.
- `droyhet`: `mild` | `normal` | `droy`

---

## STEG 1 — Parse argumenter

`$ARGUMENTS` format: `<antall> [modus]`

- `15` → antall=15, modus=**blandet**
- `25 drøy` → antall=25, modus=**drøy**
- `10 rolig` → antall=10, modus=**rolig**

Gyldige moduser: `rolig` | `blandet` | `drøy`
Standard modus: `blandet`

Hvis antall mangler eller er ugyldig, stopp og forklar korrekt bruk.

---

## STEG 2 — Finn prosjektroten og Fem fingre-pakken

Led etter `supabase/config.toml` og `.env.local` oppover fra current working directory.

Les miljøvariabler fra `.env.local`:
```bash
grep "SUPABASE_URL\|SUPABASE_ANON_KEY\|SUPABASE_SERVICE_ROLE_KEY" .env.local
```

Hold på `SUPABASE_URL` og `SUPABASE_ANON_KEY`.

Hent Fem fingre-pakkens `id`:
```bash
bash .claude/skills/generer-fem-fingre/scripts/fetch_pack_id.sh
```

Scriptet skriver ut `FEM_FINGRE_PACK_ID=<uuid>` eller `PACK_MISSING`.

**Hvis PACK_MISSING:** Informer brukeren om at Fem fingre-pakken ikke er seedet. Be dem kjøre migrasjon `00029_fem_fingre.sql` først, eller opprette pakken manuelt via admin.

---

## STEG 3 — Hent eksisterende Fem fingre-kort

Kjør:
```bash
bash .claude/skills/generer-fem-fingre/scripts/fetch_existing.sh > /tmp/klink_femfingre_existing.json
```

Scriptet henter alle eksisterende kort med `type='femfingre'` (inkl. paastander-arrayet og tittel).

---

## STEG 4 — Generer nye kort

Generer `antall * 1.4` kandidater for å kompensere for duplikater.

### Regler per modus

**rolig**: hverdagslige, ufarlige temaer (mat, reise, skjult talent, filmer). `droyhet = 'mild'` eller `'normal'`.
**blandet**: mix av kategorier. `droyhet` valgt per kort, typisk `normal`.
**drøy**: voksen humor, flørt, dating, edru pinlige ting. `droyhet = 'droy'`.

### Stilregler per påstand
- Språk: norsk bokmål
- Maks 10 ord
- Start med verb i preteritum ("Sovnet på nachspiel") eller perfektum ("Har kysset noen av samme kjønn") — vær konsekvent innenfor ett kort
- Ingen `{spiller}`-tokens (påstandene er generelle)
- Ingen spørsmålstegn
- Alle 5 påstander på ett kort skal tilhøre samme kategori/tema

### Tittel per kort
- Kort, 1–2 ord (f.eks. "Fest", "Dating", "Skjult talent", "Pinlig", "Drøyt", "Teknologi", "Reise")
- Brukes som badge over kortet i spillet

### Kvoter per batch
- Minst 4 ulike tittel-kategorier
- Maks 2 kort med samme tittel
- Blanding av forsiktige og dristige påstander på samme kort (så "drikk per miss" blir like gøy som "drikk per treff")

### Forbudt innhold
- Mindreårige
- Tvang, overgrep, ikke-samtykke
- Seksualisert vold
- Farlig alkoholinntak
- Doxxing / ekte navngitte personer

---

## STEG 5 — Kandidat-output

Skriv kandidater til `/tmp/klink_femfingre_candidates.json` som JSON-array:

```json
[
  {
    "tittel": "Fest",
    "droyhet": "normal",
    "paastander": [
      "Sovnet på nachspiel",
      "Mistet telefonen på byen",
      "Danset på et bord",
      "Kastet opp offentlig",
      "Våknet uten å vite hvordan du kom hjem"
    ]
  }
]
```

---

## STEG 6 — Duplikatsjekk

Kjør:
```bash
bash .claude/skills/generer-fem-fingre/scripts/check_duplicates.sh \
  --candidates /tmp/klink_femfingre_candidates.json \
  --existing /tmp/klink_femfingre_existing.json \
  --output /tmp/klink_femfingre_ok.json
```

Scriptet:
1. Avviser kort der ≥3 av 5 påstander matcher et eksisterende kort (normalisert sammenligning).
2. Avviser duplikater internt i batchen.
3. Skriver godkjente kort til `--output`.

Generer erstatninger hvis batchen er underfylt.

---

## STEG 7 — Vis preview

⚠️ **STOPP HER. Vis preview og vent på GODKJENT.**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FEM FINGRE — PREVIEW
 Batch:       femfingre_<YYYYMMDD>_<modus>
 Modus:       <modus>
 Ønsket:      <antall>
 Klare:       <antall>
 Forkastet:   <antall> (duplikat)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 1. [Fest] (normal)
    1. Sovnet på nachspiel
    2. Mistet telefonen på byen
    3. Danset på et bord
    4. Kastet opp offentlig
    5. Våknet uten å vite hvordan du kom hjem

 2. [Dating] (droy)
    ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Skriv GODKJENT for å lagre i databasen.
Skriv AVVIS for å forkaste hele batchen.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Vent. Gjør ingenting mer.**

---

## STEG 8 — Vent på godkjenning

- `GODKJENT` → fortsett til STEG 9
- `AVVIS` → slett temp-filer, avslutt
- Noe annet → svar at du venter på GODKJENT eller AVVIS

---

## STEG 9 — Bygg insert-migrasjon

Finn neste migrasjonsnummer:
```bash
ls supabase/migrations/ | grep "^[0-9]" | sort | tail -1
```

Kjør:
```bash
python3 .claude/skills/generer-fem-fingre/scripts/build_insert_migration.py \
  --input /tmp/klink_femfingre_ok.json \
  --pack-id "$FEM_FINGRE_PACK_ID" \
  --batch-name "femfingre_<YYYYMMDD>_<modus>" \
  --output supabase/migrations/<NNNNN>_kort_femfingre_<batchnavn>.sql
```

Les gjennom den genererte SQL-filen — hver INSERT skal ha `paastander` som `ARRAY[...]::TEXT[]` med nøyaktig 5 strenger.

---

## STEG 10 — Dry-run og push

```bash
npx supabase db push --dry-run 2>&1
echo "Y" | npx supabase db push 2>&1
```

---

## STEG 11 — Sluttstatus

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PUSH FULLFØRT
 Batch:        <batchnavn>
 Lagt inn:     <N> kort
 Migrasjonsfil: supabase/migrations/<fil>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Rydd opp:
```bash
rm -f /tmp/klink_femfingre_*.json
```

---

## Feilhåndtering

- Supabase CLI ikke funnet → informer om `npm install -g supabase`
- Pakken mangler → be bruker kjøre migrasjon 00029 først
- Push feiler → vis full feilmelding, ikke slett temp-filer
