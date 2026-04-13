---
description: Genererer Snusboksen-kort til Klink. Kort, direkte "Hvem...?"-spørsmål med preview og godkjenningsflyt.
---

Følg arbeidsflyten nøyaktig. Stopp alltid ved godkjenningspunkt.

Scripts og referanse: `.claude/skills/generer-festsporsmal/`

---

## ARGUMENTER

$ARGUMENTS format: `<antall> [modus]`

Eksempler:
- `20` → 20 kort, modus=blandet
- `30 drøy` → 30 kort, drøy modus
- `15 rolig` → 15 kort, rolig modus

Moduser: `rolig` | `blandet` | `drøy`  
Standard: `blandet`

---

## PACK-INFO

- Pakkenavn: **Snusboksen**
- Pack-ID: `fe203ea0-6a68-4a76-ba23-cfba9141bfb0`
- Korttype: `snusboks`
- tittel: alltid `""`
- utfordring: valgfritt — kun på kort som egner seg for fysisk challenge

---

## STILREGLER — LÆRT FRA BRUKERREVIEW

### Hva som funker

**Direkthet vinner alltid:**
```
✓ Hvem sover med en fremmed i natt?
✓ Hvem er gjengens homewrecker?
✓ Hvem ender ikke alene i natt?
```

**Presens/fremtid > hypotetisk fortid:**
```
✓ Hvem kommer til å kline med noen på dansegulvet?
✓ Hvem er ikke singel, men oppfører seg som det i kveld?
✗ Hvem hadde hatt størst sjanse for å bli kveldens...
```

**Konsept-spørsmål — ett ord/begrep slår en hel setning:**
```
✓ Hvem er gjengens homewrecker?
✓ Hvem er best i sengen ifølge resten av gjengen?
```

**Konkret > vagt — spesifikke detaljer:**
```
✓ Hvem sender melding til exen i kveld?
✓ Hvem skal møte noen fra Tinder i kveld?
✗ Hvem er typen til å ta kontakt med noen de tidligere hadde et forhold til?
```

**Provoserende er bra når det er direkte:**
```
✓ Hvem har ligget med flest fra denne gjengen?
✓ Hvem sender nakenbilde i kveld hvis noen spør pent?
✓ Hvem har hatt «vi er bare venner»-sex flest ganger?
```

### Hva som ikke funker

```
✗ Vage konsekvenser: "...angre på noe", "...stikke av uten å si fra"
✗ Selvreferererende: "...svare ærlig på dette spørsmålet"
✗ For lang setning: "Hvem hadde hatt størst sjanse for å ende opp på feil sted til rett tid?"
✗ Overkomplisert: "Hvem er typen til å si «jeg liker deg ikke på den måten» og mene det minst?"
✗ For kjedelig: "Hvem hadde klart å holde en hemmelighet i under 24 timer?"
```

### Godkjente eksempler (fasit)
```
Hvem er mest sannsynlig til å bli med noen de ikke kjenner hjem?
Hvem virker uskyldig, men har egentlig de villeste historiene?
Hvem sover med en fremmed i natt?
Hvem er gjengens homewrecker?
Hvem har ligget med flest fra denne gjengen?
Hvem kler seg av raskest?
Hvem har det villeste sexlivet ingen aner om?
Hvem sender melding til exen i kveld?
Hvem ender ikke alene i natt?
Hvem har hatt sex med noen andre i dette rommet?
```

### Modus-kalibrering

| Modus  | Stil |
|--------|------|
| rolig  | Sosiale situasjoner, flørting, dating. Ingen eksplisitt sex. |
| blandet | Mix. Konkrete romantiske/sosiale scenarioer. |
| drøy   | Direkte seksuelt innhold, provocerende, ingen sensur. |

### Kvoter
- Maks 2 spørsmål med samme predicate (eks. "kline", "sove med")
- Maks 15 % med "Hvem hadde..."-form — foretrekk presens
- Maks 10 % challenge-kort (`utfordring` utfylt)

---

## UTFORDRING-FELT

Noen kort kan ha en fysisk challenge knyttet til seg.
Bruk kun når kortet naturlig åpner for en handling.

Format: `"Den/de som [betingelse] kan dele ut {sips} slurker!"`

`{sips}` erstattes automatisk av appen med riktig antall basert på valgt intensitet.

Eksempel:
```
innhold:    "Hvem kler seg av raskest?"
utfordring: "Den som klarer å legge en truse på bordet raskest kan dele ut {sips} slurker!"
```

---

## ARBEIDSFLYT

### 1. Hent eksisterende kort

```bash
bash .claude/skills/generer-festsporsmal/scripts/check_duplicates.sh \
  --fetch-existing-kort fe203ea0-6a68-4a76-ba23-cfba9141bfb0
```

### 2. Generer kandidater

Generer `antall × 1.4` kandidater. Skriv til `/tmp/klink_candidates.json`:
```json
[{
  "spillpakke_id": "fe203ea0-6a68-4a76-ba23-cfba9141bfb0",
  "type": "snusboks",
  "tittel": "",
  "innhold": "Hvem sover med en fremmed i natt?",
  "utfordring": null
}]
```

### 3. Duplikatsjekk

```bash
bash .claude/skills/generer-festsporsmal/scripts/check_duplicates.sh \
  --check-batch /tmp/klink_candidates.json \
  --existing /tmp/klink_existing_kort.json
```

### 4. Preview

⚠️ **STOPP. Vis preview. Vent på GODKJENT.**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SNUSBOKSEN — PREVIEW
 Modus: <modus>  |  Ønsket: <antall>  |  Klare: <N>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Hvem sover med en fremmed i natt?
     duplikat: OK

  2. Hvem kler seg av raskest?
     utfordring: "Den som klarer å legge en truse på bordet raskest kan dele ut {sips} slurker!"
     duplikat: OK
...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Skriv GODKJENT eller GODKJENT <batchnavn>.
Skriv AVVIS for å forkaste.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Brukeren kan godkjenne enkeltspørsmål, be om endringer, eller avvise hele batchen.

### 5. Ved GODKJENT → bygg og push migrasjon

```bash
# Finn neste migrasjonsnummer
ls supabase/migrations/ | grep "^[0-9]" | sort | tail -1

# Bygg migrasjon
py .claude/skills/generer-festsporsmal/scripts/build_insert_migration.py \
  --input /tmp/klink_approved.json \
  --batch-name "<batchnavn>" \
  --pack-name "Snusboksen" \
  --mode "<modus>" \
  --next-migration-number <N+1> \
  --output supabase/migrations/<NNNNN>_kort_snusboks_<batchnavn>.sql

echo "Y" | npx supabase db push
```

**NB:** build_insert_migration.py støtter ikke `utfordring`-feltet direkte — skriv INSERT manuelt for kort med utfordring, eller legg til støtte i scriptet.

### 6. Sluttstatus

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PUSH FULLFØRT — Snusboksen
 Lagt inn: <N> kort  |  Migrasjon: <fil>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
