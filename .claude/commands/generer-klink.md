---
description: Genererer Klink-pakke-kort med preview og godkjenningsflyt. Støtter alle 5 subkategorier.
---

Følg arbeidsflyten nøyaktig. Stopp alltid ved godkjenningspunkt.

Scripts: `.claude/skills/generer-festsporsmal/`

---

## ARGUMENTER

$ARGUMENTS format: `<antall> <subkategori>`

Subkategorier:
- `shot-or-text`
- `imitatoren`
- `kategorien`
- `hot-seat`
- `pek-pa-en`

Eksempler: `10 shot-or-text`, `15 imitatoren`, `5 hot-seat`

---

## PACK-INFO

- Pakkenavn: **Klink**
- Pack-ID: hent dynamisk via:
  ```bash
  curl -s "$SUPABASE_URL/rest/v1/spillpakker?navn=eq.Klink&select=id" \
    -H "apikey: $ANON_KEY" | py -c "import sys,json; print(json.load(sys.stdin)[0]['id'])"
  ```
- Korttype: `kaos`
- utfordring: alltid `null` (bortsett fra evt. manuelt)

---

## SUBKATEGORI-REGLER

### Shot or Text
- tittel: `"Shot or Text"`
- Format: `"{spiller}, [pinlig handling] — eller ta en shot"`
- `{spiller}` påkrevd, én forekomst
- Ingen `{sips}` i innhold
- Teksten som skal sendes bør være pinlig, teit eller flaut — men ikke slem
- Variasjon: bytt mellom "send til siste du chattet med", "send til eks", "send til onkel/tante/foreldre", "send til tilfeldig kontakt"
- timer_sekunder: null

### Imitatoren
- tittel: `"Imitatoren"`
- Format: `"{spiller} imiterer [hvem/kategori]. Den første som gjetter riktig deler ut {sips} slurker!"`
- `{spiller}` påkrevd, `{sips}` påkrevd i innhold
- Variasjon: kjendis, norsk politiker, filmkarakter, sangtekst, TV-program
- timer_sekunder: null

### Kategorien er...
- tittel: `"Kategorien er..."`
- Format: `"Kategorien er: [kategori]. {spiller} starter!"`
- `{spiller}` påkrevd, siste setning alltid "{spiller} starter!"
- Kategoriene skal være morsomme, litt vågale, men ikke stygge
- Eksempler: "ting man aldri burde si under sex", "unnskyldninger for å hooke opp med eksen", "tegn på at man er for full"
- timer_sekunder: null

### Hot Seat
- tittel: `"Hot Seat"`
- timer_sekunder: **alltid 60**
- `{spiller}` påkrevd
- Ingen `{sips}` i innhold
- Instruksjon til spiller: start timer, svar ærlig, si stopp når de tror 1 min er ute
- **NB:** build_insert_migration.py støtter ikke timer_sekunder — skriv INSERT direkte i SQL

### Pek på én
- tittel: `"Pek på én"`
- Format: `"{spiller}, [Hvem...?-spørsmål]"`
- `{spiller}` påkrevd
- Spørsmålet peker ut én person i gruppen basert på {spiller}s mening
- Kan være drøy eller rolig
- timer_sekunder: null

---

## STILREGLER

### Hva funker ✅
- Konkret og spesifikt > vagt
- Pinlighet + gruppedynamikk = gull
- "Shot or Text"-tekster: jo mer absurd jo bedre
- Kategorier: starte enkelt, eskalere i grøsshet
- Hot Seat: enkle instruksjoner, klar mekanikk

### Hva funker ikke ❌
- Slemme eller personlig angrep
- For lang tekst (maks ~20 ord i innhold)
- Repeterende struktur innen samme batch

---

## ARBEIDSFLYT

### 1. Hent Pack-ID
```bash
source .env.local 2>/dev/null || true
SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d= -f2-)
ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d= -f2-)
KLINK_ID=$(curl -s "$SUPABASE_URL/rest/v1/spillpakker?navn=eq.Klink&select=id" \
  -H "apikey: $ANON_KEY" | py -c "import sys,json; print(json.load(sys.stdin)[0]['id'])")
```

### 2. Hent eksisterende kort
```bash
bash .claude/skills/generer-festsporsmal/scripts/check_duplicates.sh \
  --fetch-existing-kort $KLINK_ID
```

### 3. Generer kandidater → `/tmp/klink_candidates.json`
```json
[{
  "spillpakke_id": "<KLINK_ID>",
  "type": "kaos",
  "tittel": "Shot or Text",
  "innhold": "{spiller}, send «...» til eks — eller ta en shot",
  "utfordring": null
}]
```
For Hot Seat: legg til `"timer_sekunder": 60` i hvert objekt.

### 4. Duplikatsjekk
```bash
bash .claude/skills/generer-festsporsmal/scripts/check_duplicates.sh \
  --check-batch /tmp/klink_candidates.json \
  --existing /tmp/klink_existing_kort.json
```

### 5. ⚠️ STOPP — vis preview, vent på GODKJENT

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 KLINK — PREVIEW (<subkategori>)
 Klare: <N>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. [tittel] {spiller}, ...
     timer: 60s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GODKJENT for å lagre.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. Ved GODKJENT → bygg SQL og push

For kort UTEN timer_sekunder: bruk build_insert_migration.py
For Hot Seat (timer_sekunder=60): skriv INSERT manuelt i SQL-filen

```bash
echo "Y" | npx supabase db push
```
