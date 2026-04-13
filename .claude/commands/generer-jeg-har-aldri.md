---
description: Genererer "Jeg har aldri"-kort til Klink. Klassisk format med preview og godkjenningsflyt.
---

Følg arbeidsflyten nøyaktig. Stopp alltid ved godkjenningspunkt.

Scripts: `.claude/skills/generer-festsporsmal/`

---

## ARGUMENTER

$ARGUMENTS format: `<antall> [modus]`

Eksempler: `30`, `50 drøy`, `20 rolig`

Moduser: `rolig` | `blandet` | `drøy`  
Standard: `blandet`

---

## PACK-INFO

- Pakkenavn: **Jeg har aldri**
- Pack-ID: `25b1f74f-0b6b-468b-9289-f83812e80540`
- Korttype: `alle_drikker`
- tittel: alltid `""`
- utfordring: valgfritt — kun på kort som naturlig åpner for en gruppehandling

---

## STILREGLER

### Format
Hvert kort starter med **"Jeg har aldri"** etterfulgt av noe spillerne kan ha gjort.
Alle som HAR gjort det, drikker.

### Tone per modus

| Modus  | Innhold |
|--------|---------|
| rolig  | Ufarlig, sosialt, lett personlig. Ingen sex. |
| blandet | Mix — noen personlige, noen litt drøye. |
| drøy   | Eksplisitt seksuell atferd, provoserende situasjoner, ingen sensur. |

### Stilregler
- Norsk bokmål. Maks 12 ord etter "Jeg har aldri".
- Ingen tegnsetting på slutten (ingen punktum eller spørsmålstegn).
- Direkte og spesifikk — unngå for vage utsagn.
- Relaterbart for 20–35 år i festsetting.
- Maks 2 kort per batch med samme tema.

### Hva som funker ✅
- **Spesifikt moderne scenario**: `«jeg er på vei» når jeg ikke engang hadde begynt å kle på meg`, `logget inn på eksens Netflix etter bruddet`
- **Konkret handling + flauhet**: `ringt exen etter midnatt og angret neste morgen`, `løyet om å ha kommet for å slippe å fortsette`
- **"i dette rommet"** — skaper spenning: `kysset noen i dette rommet`, `hatt sex med noen i dette rommet`
- **Moderne digital atferd**: skjermbilder, ghosting, Instagram-stalking, nakenbilder
- **Spesifikt pinlig**: `kansellert en date via melding fem minutter før`, `sendt nakenbilde til feil person`
- **Drøyt og eksplisitt** (drøy-modus): trekant, filmet seg selv, oralsex på offentlig plass

### Hva som ikke funker ❌
- **For generisk**: `tatt bilde av noen uten at de visste om det` — ingen spenning
- **Abstrakt/filosofisk**: `latt noen tro vi var noe mer enn vi egentlig var` — for vagt
- **Ulogisk setning**: `late som telefonen var tom for å slippe å svare` — henger ikke logisk sammen
- **Trist og hverdagslig**: `drukket alene på en tirsdag` — ikke morsomt
- **For generisk**: `løyet for å komme meg ut av en plan` — for uspesifikt

### Gode eksempler (fasit)

**Blandet:**
```
Jeg har aldri ringt exen etter midnatt og angret neste morgen
Jeg har aldri løyet om å ha kommet for å slippe å fortsette
Jeg har aldri skrevet «jeg er på vei» når jeg ikke engang hadde begynt å kle på meg
Jeg har aldri kysset noen jeg visste hadde kjæreste
Jeg har aldri sjekket telefonen til noen i dette rommet uten at de visste om det
Jeg har aldri hatt sex med eksen etter at vi offisielt var ferdig
Jeg har aldri ghostet noen etter en date jeg syntes var helt grei
Jeg har aldri flørtet med søskenet til en eks
Jeg har aldri hatt sex med noen jeg egentlig ikke likte
Jeg har aldri lagt ut noe på sosiale medier for å gjøre noen sjalu
Jeg har aldri logget inn på eksens Netflix etter bruddet
Jeg har aldri delt et skjermbilde av en samtale jeg ikke burde delt
Jeg har aldri kansellert en date via melding fem minutter før
Jeg har aldri lest en melding og latt den stå ulest med vilje
Jeg har aldri ligget med noen bare for å se om gnisten fortsatt var der
Jeg har aldri hatt sex med noen jeg møtte samme kveld
Jeg har aldri hatt en one night stand med noen fra vennegjengen
Jeg har aldri blitt tatt på fersken i en løgn og nektet å innrømme det
```

**Drøy:**
```
Jeg har aldri hatt sex med to fra samme vennekrets samme helg
Jeg har aldri sendt et nakenbilde til feil person
Jeg har aldri hatt sex mens noen andre var i rommet
Jeg har aldri latt noen se på mens jeg hadde sex
Jeg har aldri filmet meg selv under sex
Jeg har aldri hatt sex med en kollega eller sjef
Jeg har aldri hatt trekant
Jeg har aldri fått eller gitt oralsex på en offentlig plass
Jeg har aldri hatt sex med noen i dette rommet
Jeg har aldri betalt for noe seksuelt eller fått betalt
```

### Forbudt
- Mindreårige, tvang, overgrep, doxxing.
- "Jeg har aldri hatt sex" alene — for vagt, vær spesifikk.

---

## UTFORDRING-FELT

Noen kort kan ha en fysisk/sosial challenge.
Bruk kun når kortet naturlig åpner for en gruppehandling.

Format: `"[handling], eller drikk {sips} slurker"` / `"Drikk {sips} slurker for hver [betingelse]"`

`{sips}` erstattes automatisk av appen med riktig antall basert på valgt intensitet.

**Eksempler:**
```
innhold:    "Jeg har aldri hatt sex med noen i dette rommet"
utfordring: "Drikk {sips} slurker for hver person i dette rommet du har hatt sex med"

innhold:    "Jeg har aldri kysset noen i dette rommet"
utfordring: "Alle som har: pek på hvem — de kan dele ut {sips} slurker"

innhold:    "Jeg har aldri sendt et nakenbilde til feil person"
utfordring: "Vis forklaringsmeldingen du sendte etterpå, eller drikk {sips} ekstra"
```

---

## ARBEIDSFLYT

### 1. Hent eksisterende kort

```bash
bash .claude/skills/generer-festsporsmal/scripts/check_duplicates.sh \
  --fetch-existing-kort 25b1f74f-0b6b-468b-9289-f83812e80540
```

### 2. Generer kandidater

Generer `antall × 1.4` kandidater. Skriv til `/tmp/klink_candidates.json`:
```json
[{
  "spillpakke_id": "25b1f74f-0b6b-468b-9289-f83812e80540",
  "type": "alle_drikker",
  "tittel": "",
  "innhold": "Jeg har aldri sendt en melding til feil person",
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
 JEG HAR ALDRI — PREVIEW
 Modus: <modus>  |  Ønsket: <antall>  |  Klare: <N>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Jeg har aldri sendt en melding til feil person
     duplikat: OK

  2. Jeg har aldri hatt sex med noen i dette rommet
     utfordring: "Drikk {sips} slurker for hver person i dette rommet du har hatt sex med"
     duplikat: OK
...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Skriv GODKJENT eller GODKJENT <batchnavn>.
Skriv AVVIS for å forkaste.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Ved GODKJENT → bygg og push

```bash
py .claude/skills/generer-festsporsmal/scripts/build_insert_migration.py \
  --input /tmp/klink_approved.json \
  --batch-name "<batchnavn>" \
  --pack-name "Jeg har aldri" \
  --mode "<modus>" \
  --next-migration-number <N+1> \
  --output supabase/migrations/<NNNNN>_kort_jeg_har_aldri_<batchnavn>.sql

echo "Y" | npx supabase db push
```

**NB:** Kort med `utfordring` må ha manuell INSERT i SQL — build_insert_migration.py støtter ikke utfordring-feltet.
