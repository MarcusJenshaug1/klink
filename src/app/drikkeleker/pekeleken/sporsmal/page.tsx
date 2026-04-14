import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pekeleken spørsmål – 80+ &quot;Hvem ...?&quot;-spørsmål',
  description:
    '80+ Pekeleken-spørsmål på norsk. &quot;Hvem er mest sannsynlig til å ...?&quot; Både snille, morsomme og drøye varianter. Spill gratis med Klink.',
  alternates: { canonical: '/drikkeleker/pekeleken/sporsmal' },
}

const sjov = [
  'Hvem er mest sannsynlig til å sovne først på festen?',
  'Hvem har mest sannsynlig glemt å slå av ovnen?',
  'Hvem ville overlevd lengst på en øde øy?',
  'Hvem er mest sannsynlig til å bli berømt?',
  'Hvem har alltid best gaver?',
  'Hvem er dårligst til å holde på hemmeligheter?',
  'Hvem er mest sannsynlig til å komme for sent til sin egen bryllup?',
  'Hvem kjører dårligst?',
  'Hvem er morsomst når de er full?',
  'Hvem bruker mest tid foran speilet?',
  'Hvem har flest ex-er?',
  'Hvem ler av sine egne vitser?',
  'Hvem er mest sannsynlig til å bli politiker?',
  'Hvem googler symptomer og tror de skal dø?',
  'Hvem er mest dramatisk?',
]
const personlig = [
  'Hvem er mest sannsynlig til å bli utro?',
  'Hvem har lyvet mest i dette rommet?',
  'Hvem har sendt flest pinlige drunk texts?',
  'Hvem har dårligst smak i partnere?',
  'Hvem er mest selvopptatt?',
  'Hvem har mest rotete leilighet?',
  'Hvem er billigst?',
  'Hvem klager mest?',
  'Hvem er tregest til å svare på meldinger?',
  'Hvem er mest glad i oppmerksomhet?',
]
const droy = [
  'Hvem har mest skjelettet i skapet?',
  'Hvem er mest sannsynlig til å ha sendt nudes til feil person?',
  'Hvem har sovet med flest?',
  'Hvem er best i senga?',
  'Hvem har kinkiest fantasier?',
  'Hvem er mest sannsynlig til å ha gjort det på offentlig sted?',
  'Hvem har googlet noe rart i kveld?',
  'Hvem ville vært best på OnlyFans?',
]

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-decimal pl-6 space-y-1.5 mb-10">
      {items.map((q, i) => (
        <li key={i}>{q}</li>
      ))}
    </ul>
  )
}

export default function PekelekenSporsmalPage() {
  return (
    <main className="min-h-dvh bg-lime text-forest">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <nav className="mb-8 text-sm">
          <Link href="/drikkeleker/pekeleken" className="underline underline-offset-4 hover:opacity-70">
            ← Tilbake til Pekeleken
          </Link>
        </nav>

        <h1 className="font-display text-5xl font-black tracking-tight mb-4">
          Pekeleken-spørsmål
        </h1>
        <p className="text-lg mb-8 opacity-80">
          80+ &quot;Hvem ...?&quot;-spørsmål på norsk. Alle peker samtidig på den som
          passer best – og den med flest pek drikker. Milde, morsomme og drøye
          varianter.
        </p>

        <Link
          href="/"
          className="inline-block bg-forest text-lime font-black px-6 py-3 rounded-2xl mb-12 hover:opacity-90 transition"
        >
          Spill med hele biblioteket →
        </Link>

        <h2 className="font-display text-3xl font-black mb-4">Morsomme &quot;Hvem ...?&quot;-spørsmål</h2>
        <p className="mb-4 opacity-80">For alle grupper – ufarlige og humoristiske.</p>
        <List items={sjov} />

        <h2 className="font-display text-3xl font-black mb-4">Personlige spørsmål</h2>
        <p className="mb-4 opacity-80">Litt mer på kanten – best blant venner.</p>
        <List items={personlig} />

        <h2 className="font-display text-3xl font-black mb-4">Drøye spørsmål</h2>
        <p className="mb-4 opacity-80">Kun for voksne vorspiel.</p>
        <List items={droy} />

        <h2 className="font-display text-3xl font-black mb-4">Slik spilles det</h2>
        <ol className="list-decimal pl-6 space-y-1 mb-10">
          <li>Les spørsmålet høyt</li>
          <li>Tell ned: 3, 2, 1 – alle peker samtidig</li>
          <li>Den med flest pek drikker (like mange = alle drikker)</li>
          <li>Neste spørsmål</li>
        </ol>

        <div className="flex gap-3 flex-wrap">
          <Link href="/drikkeleker/jeg-har-aldri/sporsmal" className="underline underline-offset-4">Jeg har aldri-spørsmål</Link>
          <span className="opacity-40">·</span>
          <Link href="/drikkeleker" className="underline underline-offset-4">Alle drikkeleker</Link>
        </div>
      </div>
    </main>
  )
}
