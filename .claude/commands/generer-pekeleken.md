---
description: Genererer Pekeleken-kort til Klink. "Hvem...?"-format med preview og godkjenningsflyt.
---

Følg arbeidsflyten nøyaktig. Stopp alltid ved godkjenningspunkt.

Scripts: `.claude/skills/generer-festsporsmal/`

---

## ARGUMENTER

$ARGUMENTS format: `<antall> [modus]`

Moduser: `rolig` | `blandet` | `drøy`
Standard: `blandet`

---

## PACK-INFO

- Pakkenavn: **Pekeleken**
- Pack-ID: `24d547bb-d794-4eb0-8296-599a6f15740e`
- Korttype: `pekelek`
- tittel: alltid `""`
- utfordring: alltid `null`

---

## MEKANIKK

Alle peker samtidig på den som passer best. Flest pekefingre = drikker.

**Mål:** klein stemning, flauhet, ubehagelig øyekontakt, latterkrampe.

---

## STILREGLER

### Godkjente ingresser
```
Hvem her ville du helst...?
Hvem i rommet tror du...?
Hvem er mest sannsynlig å...?
Hvem ville...?
Hvem i gjengen...?
Hvem her har du...?
```

### Tone per modus

| Modus  | Innhold |
|--------|---------|
| rolig  | Personlighet, vaner, sosiale situasjoner. Ingen sex. |
| blandet | Mix — flørting, konkrete sosiale situasjoner, lett drøyt. |
| drøy   | Eksplisitt sex, direkte referanser til folk i rommet, maksimal klein stemning. |

---

## KRYSSPACK-LÆRDOMMER (fra snusboks + jeg-har-aldri)

### Direkthet vinner — samme regel som snusboks:
```
✓ Hvem her ville du helst hatt sex med?
✓ Hvem ville hatt sex med en her inne hvis alle glemte det neste dag?
✗ Hvem er den typen som kanskje kunne tenke seg å...
```

### Presens/fremtid > hypotetisk fortid (fra snusboks):
```
✓ Hvem her ville du kysset nå hvis du måtte velge?
✓ Hvem i rommet tror du er villest i sengen?
✗ Hvem hadde vært mest sannsynlig til å...
```

### "Her inne / i dette rommet / noen her" = gull (fra alle tre packs):
Skaper direkte spenning mellom folk i rommet. Bruk aktivt i alle modi.
```
✓ Hvem her har du tenkt på seksuelt mer enn én gang?
✓ Hvem er mest sannsynlig å ha sendt nakenbilder til noen i dette rommet?
✓ Hvem i gjengen er mest sannsynlig å ha en hemmelig crush på noen her?
```

### Konsept-treff slår lange setninger (fra snusboks):
```
✓ Hvem i rommet har den skittenste fantasien?
✓ Hvem her tror du har flest på samvittigheten?
✗ Hvem er den personen som mest sannsynlig har gjort ting de ikke har fortalt andre om?
```

---

## HVA SOM FUNKER ✅
- Direkte tiltrekning mellom folk i rommet
- Konkret handling > vag personlighetsbeskrivelse
- "Ville du helst..." / "Tror du er..." / "Her inne..." = spenning
- Flauhet som trigger diskusjon og latter

## HVA SOM IKKE FUNKER ❌
- Generisk/kjedelig: "holdt ut lengst uten telefon", "ville droppet jobben" — ingen spenning
- Vag moralkritikk: "løyet om noe i kveld" — ingen kobling til rommet
- Klønete norsk — les høyt før godkjenning
- Hypotetisk fortid: "hadde hatt størst sjanse for å..."

---

## GODE EKSEMPLER (fasit)

**Blandet:**
```
Hvem ville flørtet seg ut av en fartsbot?
Hvem er mest sannsynlig å ha en hemmelig crush på noen her?
Hvem er mest sannsynlig å sende en full melding til exen i natt?
Hvem i gjengen er best i sengen?
Hvem i gjengen har størst sjanse for å bli kjendis?
Hvem ville tatt med seg to stykker hjem fra denne festen?
Hvem her tror du har flest på samvittigheten?
```

**Drøy (10/10 godkjent):**
```
Hvem her ville du helst hatt sex med?
Hvem i rommet tror du er villest i sengen?
Hvem her har du tenkt på seksuelt mer enn én gang?
Hvem ville hatt sex med en her inne hvis alle glemte det neste dag?
Hvem er mest sannsynlig å ha sendt nakenbilder til noen i dette rommet?
Hvem her ville du kysset nå hvis du måtte velge?
Hvem i rommet har den skittenste fantasien?
Hvem i gjengen er mest sannsynlig å ha hatt trekant?
```

---

## FORBUDT
- Mindreårige, tvang, overgrep.
- Angrep som peker ut én person på sårbar/krenkende måte.

---

## ARBEIDSFLYT

### 1. Hent eksisterende kort
```bash
bash .claude/skills/generer-festsporsmal/scripts/check_duplicates.sh \
  --fetch-existing-kort 24d547bb-d794-4eb0-8296-599a6f15740e
```

### 2. Generer kandidater (`antall × 1.4`)
```json
[{
  "spillpakke_id": "24d547bb-d794-4eb0-8296-599a6f15740e",
  "type": "pekelek",
  "tittel": "",
  "innhold": "Hvem her ville du helst hatt sex med?",
  "utfordring": null
}]
```

### 3. Duplikatsjekk
```bash
bash .claude/skills/generer-festsporsmal/scripts/check_duplicates.sh \
  --check-batch /tmp/klink_candidates.json \
  --existing /tmp/klink_existing_kort.json
```

### 4. ⚠️ STOPP — vis preview, vent på GODKJENT

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PEKELEKEN — PREVIEW
 Modus: <modus>  |  Ønsket: <antall>  |  Klare: <N>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Hvem her ville du helst hatt sex med?
     duplikat: OK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GODKJENT — eller gi tilbakemelding.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Ved GODKJENT → bygg og push
```bash
py .claude/skills/generer-festsporsmal/scripts/build_insert_migration.py \
  --input /tmp/klink_approved.json \
  --batch-name "<batchnavn>" \
  --pack-name "Pekeleken" \
  --mode "<modus>" \
  --next-migration-number <N+1> \
  --output supabase/migrations/<NNNNN>_kort_pekeleken_<batchnavn>.sql

echo "Y" | npx supabase db push
```
