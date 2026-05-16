# Reference: generer-festsporsmal

## Stilregler

### Generelt
- Norsk bokmål. Ingen nynorsk, ingen engelsk innblanding.
- Maks 12 ord per spørsmål. Kortere er bedre.
- Muntlig tone. Ikke skriftspråklig.
- Spørsmålene skal fungere høyt lest i et vors/nachspiel/festmiljø.
- Unngå generisk AI-språk ("Det er interessant å vurdere hvem som…").

### Foretrukket form
- `Hvem er mest sannsynlig til å …?` (kortere: `Hvem …?`)
- `Hvem ville …?`
- `Hvem har …?`
- `Hvem tør …?`

### Variasjon (maksgrenser)
| Type            | Maks per batch |
|-----------------|---------------|
| Handlingskort   | 12 %          |
| Skål-kort       | 8 %           |
| `Hvem …?`-form  | minst 75 %    |

### Handlingskort-eksempler
- "To fingre opp: alle som har …, drikk"
- "Pek på hvem som ville … Flest pekefingre drikker"
- "Personen til venstre for deg …"

### Skål-eksempler
- "Skål for den som alltid er sist klar"
- "Alle skåler for kveldets største løgner"

---

## Kategorier

| Kode                     | Beskrivelse |
|--------------------------|-------------|
| `fest_og_alkohol`        | Atferd på fest, drikking, nachspiel, vors |
| `flort_og_dating`        | Dating, kyss, ex, tinder, flørting |
| `personlighet_og_vane`   | Vaner, sovemønster, prokrastinering, hemmeligheter |
| `status_og_stil`         | Utseende, klær, sosial status, penger |
| `vennskap_og_gruppe`     | Grupperoller, lojalitet, drama, hemmeligheter |
| `fremtidsantakelser`     | Hvem vil gjøre X i fremtiden |
| `lett_drøy_humor`        | Lett frekk, voksenhumor, seksuelle hentydninger (ikke eksplisitt) |
| `handlingskort`          | Gjelder spillere direkte, krever handling |
| `skaal`                  | Kollektiv skåling med begrunnelse |

---

## Spice-skala

| Nivå | Beskrivelse |
|------|-------------|
| 1    | Ufarlig, kan brukes med familie |
| 2    | Litt sosialt utfordrende, rolig fest |
| 3    | Standard festnivå, litt personlig |
| 4    | Drøyere, krever trygg gruppe |
| 5    | Dristig voksenhumor, eksplisitt antydning |

Modus → spice-mapping:
- rolig: 1–2
- blandet: 1–4
- drøy: 3–5
- student: 1–3
- generic: 1–3

---

## Duplikatregler

### Nivå 1 — Eksakt duplikat
Identisk tekst. Automatisk forkastet.

### Nivå 2 — Normalisert duplikat
Etter normalisering er tekstene identiske:
1. Lowercase
2. Trim whitespace
3. Kollaps doble mellomrom
4. Fjern avsluttende `?`, `!`, `.`, `,`

Eksempel: `"Hvem blir full?" == "hvem blir full"`

Automatisk forkastet.

### Nivå 3 — Semantisk duplikat
Samme kjernebetydning, ulik formulering.

**Forbudte eksempelpar:**
```
❌ "Hvem blir fullest i kveld?"
❌ "Hvem ender mest drita i kveld?"

❌ "Hvem er sist hjem fra fest?"
❌ "Hvem holder ut lengst på nachspiel?"

❌ "Hvem har hatt flest one night stands?"
❌ "Hvem har sovet med flest fra denne gjengen?"

❌ "Hvem er mest sannsynlig å glemme å betale?"
❌ "Hvem stikker oftest uten å splitte regningen?"

❌ "Hvem ville flørtet med servitøren?"
❌ "Hvem er mest sannsynlig å be om nummeret til bartenderen?"
```

Merk: semantiske duplikater ekskluderes fra batchen, men bruker opplyses om treffet.

---

## Variasjon innen batch

**Forbudt:**
- To spørsmål med "hvem er sist" + "hvem er sist" (eksakt predicate repeat)
- Tre eller flere spørsmål som bare varierer på "mest/oftest/best" uten reell forskjell

**Eksempel på ulovlig batch-overlap:**
```
8.  Hvem er sist å legge seg?
17. Hvem legger seg sist av alle?        ← DUPLIKAT av 8
```

**Eksempel på lovlig variasjon:**
```
8.  Hvem er sist å legge seg?
17. Hvem er sist å gå til sengs i en kjærlighetssituasjon?   ← OK, annen kontekst
```

---

## Approvalsflyt

```
Skill genererer kandidater
      ↓
Duplikatsjekk (automatisk)
      ↓
Preview vises til bruker
      ↓
[STOPP — vent på bruker]
      ↓
Bruker: GODKJENT  →  Re-sjekk → Migrasjon → Push → Rapport
Bruker: AVVIS     →  Avslutt, slett temp-filer
Bruker: annet     →  Skill svarer "venter på GODKJENT/AVVIS"
```

---

## Supabase-arbeidsflyt

```
1. Sjekk tabell finnes
   → Mangler: kjør schema-migrasjon
2. Hent eksisterende canonical_text via REST API
3. Generer + dedupliser kandidater
4. Vis preview
5. GODKJENT mottatt
6. Re-sjekk (tidsluke mellom preview og godkjenning)
7. build_insert_migration.py → SQL-fil i supabase/migrations/
8. npx supabase db push --dry-run
9. npx supabase db push
10. Rapport
```

### REST API-kall for å hente eksisterende spørsmål
```bash
curl -s "<SUPABASE_URL>/rest/v1/festsporsmal?select=question_text,canonical_text&status=neq.rejected" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Prefer: count=exact"
```

Tabellen har RLS med `PUBLIC READ` for ikke-rejected spørsmål.

---

## Navnekonvensjoner

### Batchnavn
Format: `klink_<YYYYMMDD>_<modus>` hvis ikke overstyrt.
Eksempel: `klink_20260413_drøy`

### Migrasjonsfil
Format: `<NNNNN>_festsporsmal_<batchnavn>.sql`
Eksempel: `00005_festsporsmal_klink_20260413_drøy.sql`
