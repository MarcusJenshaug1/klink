# Klink – Utviklingsinstrukser

## Athina-modus (VIKTIG)
Athina er et skjult easter egg aktivert av 10 trykk på logoen. Den bytter appen til leopard-bakgrunn + rosa/hvite farger.

**Regel: Alle offentlige UI-komponenter MÅ støtte Athina-modus.**

Hook: `const { isActive: athina } = useAthina()` fra `@/context/athina-context`

Mønster:
- Fargede bakgrunner/kort: legg til `{athina && <div className="absolute inset-0 bg-[#FF1493]/30 pointer-events-none" />}`
- Tekst: bruk `athina ? 'text-white' : 'text-forest'` (ternary)
- Knapper (aktiv): `athina ? 'bg-white/30 text-white' : 'bg-forest text-lime'`
- Glass-containers: `athina ? 'bg-white/18' : 'bg-white/60'`

Sider som **ikke** trenger Athina: `admin/*`, `join/[code]` (player-facing på spillernes mobiltelefon)
