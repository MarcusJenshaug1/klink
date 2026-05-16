# Eksempler: generer-festsporsmal

---

## Eksempel 1: `/generer-festsporsmal 10 rolig`

### Preview-output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FESTSPØRSMÅL — PREVIEW
 Batch:       klink_20260413_rolig
 Modus:       rolig
 Ønsket:      10
 Klare:       10
 Forkastet:   2 (duplikat/nesten-duplikat)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 1. Hvem er sist opp om morgenen?
    kategori: personlighet_og_vane | tone: rolig | spice: 1 | duplikat: OK

 2. Hvem betaler oftest for alle?
    kategori: status_og_stil | tone: rolig | spice: 1 | duplikat: OK

 3. Hvem er alltid tidligst til avtaler?
    kategori: personlighet_og_vane | tone: rolig | spice: 1 | duplikat: OK

 4. Hvem er best på å holde hemmeligheter?
    kategori: vennskap_og_gruppe | tone: rolig | spice: 2 | duplikat: OK

 5. Hvem ville overleve lengst uten telefon?
    kategori: personlighet_og_vane | tone: rolig | spice: 1 | duplikat: OK

 6. Hvem er gjengens beste kokk?
    kategori: vennskap_og_gruppe | tone: rolig | spice: 1 | duplikat: OK

 7. Hvem glemmer alltid nøklene?
    kategori: personlighet_og_vane | tone: rolig | spice: 1 | duplikat: OK

 8. Hvem har mest ro i en krisesituasjon?
    kategori: personlighet_og_vane | tone: rolig | spice: 2 | duplikat: OK

 9. Skål for den som sist kom hjem etter soloppgang!
    kategori: skaal | tone: rolig | spice: 2 | duplikat: OK | is_cheers: true

10. Hvem ville gjort seg best på reality-TV?
    kategori: fremtidsantakelser | tone: rolig | spice: 2 | duplikat: OK

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Forkastede kandidater (nærmeste DB-treff):
  "Hvem sover lengst?" (sim: 0.88) ← avviste "Hvem er sist opp om morgenen" [kandidat 14]
  "Hvem betaler for alle på baren?" (sim: 0.83) ← avviste "Hvem spanderer oftest" [kandidat 9]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Skriv GODKJENT for å lagre i databasen.
Skriv GODKJENT <batchnavn> for egendefinert batchnavn.
Skriv AVVIS for å forkaste hele batchen.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Bruker svarer: `GODKJENT`

```
Re-sjekker mot database... 0 nye duplikater oppdaget.
Bygger migrasjon: supabase/migrations/00005_festsporsmal_klink_20260413_rolig.sql
Kjører dry-run... OK
Pusher migrasjon...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PUSH FULLFØRT
 Batch:         klink_20260413_rolig
 Lagt inn:      10 spørsmål
 Hoppet over:   0
 Migrasjonsfil: supabase/migrations/00005_festsporsmal_klink_20260413_rolig.sql
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Eksempel 2: `/generer-festsporsmal 15 blandet`

### Preview-output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FESTSPØRSMÅL — PREVIEW
 Batch:       klink_20260413_blandet
 Modus:       blandet
 Ønsket:      15
 Klare:       15
 Forkastet:   3 (duplikat/nesten-duplikat)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 1. Hvem er mest sannsynlig å foreslå én drink til etter klokken 03?
    kategori: fest_og_alkohol | tone: blandet | spice: 3 | duplikat: OK

 2. Hvem har flest matcher på Tinder akkurat nå?
    kategori: flort_og_dating | tone: blandet | spice: 3 | duplikat: OK

 3. Hvem ville stukket av med festen selv om de var syk?
    kategori: fest_og_alkohol | tone: blandet | spice: 2 | duplikat: OK

 4. Hvem er mest sannsynlig å bli kjendis?
    kategori: fremtidsantakelser | tone: blandet | spice: 2 | duplikat: OK

 5. Hvem flørter med alle uten å mene det?
    kategori: flort_og_dating | tone: blandet | spice: 3 | duplikat: OK

 6. Hvem er gjengens uoffisielle terapeut?
    kategori: vennskap_og_gruppe | tone: blandet | spice: 2 | duplikat: OK

 7. Hvem bruker lengst tid på å bli klar?
    kategori: status_og_stil | tone: blandet | spice: 2 | duplikat: OK

 8. Hvem er mest sannsynlig å smile hele veien gjennom en krangel?
    kategori: personlighet_og_vane | tone: blandet | spice: 3 | duplikat: OK

 9. Pek på den som ville rømt fra middagen uten å ta regningen. Flest pekefingre drikker.
    kategori: handlingskort | tone: blandet | spice: 3 | duplikat: OK | is_action: true

10. Hvem er stiligst kledd i kveld?
    kategori: status_og_stil | tone: blandet | spice: 1 | duplikat: OK

11. Hvem er mest sannsynlig til å si "bare én til" og mene det?
    kategori: fest_og_alkohol | tone: blandet | spice: 3 | duplikat: OK

12. Hvem har den beste historien fra i natt?
    kategori: vennskap_og_gruppe | tone: blandet | spice: 2 | duplikat: OK

13. Hvem er sist å gi opp i en diskusjon?
    kategori: personlighet_og_vane | tone: blandet | spice: 2 | duplikat: OK

14. Hvem ville lurt til seg andres dessert?
    kategori: lett_drøy_humor | tone: blandet | spice: 2 | duplikat: OK

15. Skål for den som er minst fornøyd med egen lønn!
    kategori: skaal | tone: blandet | spice: 3 | duplikat: OK | is_cheers: true

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Skriv GODKJENT for å lagre i databasen.
Skriv GODKJENT <batchnavn> for egendefinert batchnavn.
Skriv AVVIS for å forkaste hele batchen.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Bruker svarer: `GODKJENT vors_april`

```
Batchnavn satt til: vors_april
Re-sjekker mot database... 0 nye duplikater oppdaget.
Bygger migrasjon: supabase/migrations/00006_festsporsmal_vors_april.sql
Kjører dry-run... OK
Pusher migrasjon...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PUSH FULLFØRT
 Batch:         vors_april
 Lagt inn:      15 spørsmål
 Hoppet over:   0
 Migrasjonsfil: supabase/migrations/00006_festsporsmal_vors_april.sql
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Eksempel 3: `/generer-festsporsmal 20 drøy`

### Preview-output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FESTSPØRSMÅL — PREVIEW
 Batch:       klink_20260413_drøy
 Modus:       drøy
 Ønsket:      20
 Klare:       20
 Forkastet:   4 (duplikat/nesten-duplikat)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 1. Hvem har sendt en melding de tydelig angret på?
    kategori: flort_og_dating | tone: drøy | spice: 4 | duplikat: OK

 2. Hvem er mest sannsynlig å kysse noen i dette rommet i kveld?
    kategori: flort_og_dating | tone: drøy | spice: 4 | duplikat: OK

 3. Hvem er best til å unngå en ubehagelig samtale?
    kategori: personlighet_og_vane | tone: drøy | spice: 3 | duplikat: OK

 4. Hvem er minst sannsynlig til å si nei på en date?
    kategori: flort_og_dating | tone: drøy | spice: 4 | duplikat: OK

 5. Hvem har ligget med noen de møtte samme kveld?
    kategori: lett_drøy_humor | tone: drøy | spice: 5 | duplikat: OK

 6. Hvem er mest sannsynlig å laste opp en pinlig story klokken 02?
    kategori: fest_og_alkohol | tone: drøy | spice: 3 | duplikat: OK

 7. Hvem er best til å rettferdiggjøre dårlige valg?
    kategori: personlighet_og_vane | tone: drøy | spice: 3 | duplikat: OK

 8. Hvem har sendt en flørtemelding til feil person?
    kategori: flort_og_dating | tone: drøy | spice: 4 | duplikat: OK

 9. Hvem ville tatt med seg noen hjem uten å fortelle det til de andre?
    kategori: lett_drøy_humor | tone: drøy | spice: 4 | duplikat: OK

10. Hvem sjekker ex'ens Instagram minst én gang i uka?
    kategori: flort_og_dating | tone: drøy | spice: 4 | duplikat: OK

11. Hvem lyver mest overbevisende?
    kategori: personlighet_og_vane | tone: drøy | spice: 3 | duplikat: OK

12. Hvem er mest sannsynlig å si de er singel når de ikke er det?
    kategori: flort_og_dating | tone: drøy | spice: 5 | duplikat: OK

13. Pek på den du ville stolt mest på etter fire øl. Flest pekefingre drikker.
    kategori: handlingskort | tone: drøy | spice: 3 | duplikat: OK | is_action: true

14. Hvem er sist på Snapchat om natten?
    kategori: fest_og_alkohol | tone: drøy | spice: 3 | duplikat: OK

15. Hvem er mest sannsynlig å gifte seg med noen de kjenner i dette rommet?
    kategori: fremtidsantakelser | tone: drøy | spice: 4 | duplikat: OK

16. Hvem er lettest å overtale til å gjøre noe dumt?
    kategori: vennskap_og_gruppe | tone: drøy | spice: 3 | duplikat: OK

17. Hvem har flest bilder de aldri ville vist mor sin?
    kategori: lett_drøy_humor | tone: drøy | spice: 5 | duplikat: OK

18. Hvem er mest sannsynlig til å starte et rykte?
    kategori: vennskap_og_gruppe | tone: drøy | spice: 4 | duplikat: OK

19. Hvem er best til å holde et fjes rett med en løgn?
    kategori: personlighet_og_vane | tone: drøy | spice: 3 | duplikat: OK

20. Skål for den som er mest desperat etter kjærlighet!
    kategori: skaal | tone: drøy | spice: 4 | duplikat: OK | is_cheers: true

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Forkastede kandidater (nærmeste DB-treff):
  "Hvem har hatt flest one night stands?" (sim: 0.87)
    ← avviste "Hvem har ligget med flest fra gjengen?"
  "Hvem stalker ex mest på sosiale medier?" (sim: 0.91)
    ← avviste "Hvem følger ex mest på Instagram?"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Skriv GODKJENT for å lagre i databasen.
Skriv AVVIS for å forkaste hele batchen.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Bruker svarer: `AVVIS`

```
Batch forkastet. Ingen endringer i databasen.
Temp-filer slettet.
```
