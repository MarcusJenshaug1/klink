import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Regler – Slik spiller du Klink drikkespill',
  description:
    'Enkle regler for alle drikkeleker i Klink: Jeg har aldri, Pekeleken, Snusboksen og Klink-pakker. Sett opp spillere og start festen på sekunder.',
  alternates: { canonical: '/regler' },
}

export default function ReglerPage() {
  return (
    <main className="min-h-dvh bg-lime text-forest">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <nav className="mb-8 text-sm">
          <Link href="/" className="underline underline-offset-4 hover:opacity-70">
            ← Tilbake til Klink
          </Link>
        </nav>

        <h1 className="font-display text-5xl font-black tracking-tight mb-4">Regler</h1>
        <p className="text-lg mb-8 opacity-80">
          Klink er et digitalt drikkespill med fire typer drikkeleker. Her er reglene.
        </p>

        <section className="mb-10">
          <h2 className="font-display text-2xl font-black mb-2">Kom i gang</h2>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Åpne klinkn.no på mobilen</li>
            <li>Legg til minst 2 spillere</li>
            <li>Trykk &quot;Start spill&quot; og velg spillpakke</li>
            <li>Følg instruksjonene på skjermen – skjermen sendes rundt mellom spillerne</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-2xl font-black mb-2">Jeg har aldri</h2>
          <p>
            Skjermen viser et utsagn: &quot;Jeg har aldri ...&quot;. Alle som <strong>har</strong>{' '}
            gjort det tar en slurk. Send skjermen videre til neste spiller.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-2xl font-black mb-2">Pekeleken</h2>
          <p>
            Skjermen viser et &quot;Hvem ...?&quot;-spørsmål. På tre peker alle samtidig på
            spilleren de synes passer best. Den som får flest pek drikker. Like mange pek =
            alle de utpekte drikker.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-2xl font-black mb-2">Snusboksen</h2>
          <p>
            Korte, raske &quot;Hvem ...?&quot;-spørsmål. Samme regel som Pekeleken, men med
            mer tempo og frekkere innhold.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-2xl font-black mb-2">Klink-pakker</h2>
          <p>
            Blandede festspørsmål og utfordringer i ulike kategorier. Følg instruksjonen på
            kortet. Noen kort er utfordringer som må utføres – klarer du det ikke drikker du.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-2xl font-black mb-2">Drøy modus</h2>
          <p>
            Flere pakker har en drøy variant med frekkere innhold. Velg modus før spillet
            starter. Anbefales kun blant venner som er komfortable med hardere innhold.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-2xl font-black mb-2">Ansvar</h2>
          <p>
            Drikk med måte. Drikk vann mellom rundene. Kjør aldri bil etter alkohol. Klink
            kan spilles helt uten alkohol – bytt ut &quot;drikk&quot; med en annen konsekvens.
          </p>
        </section>

        <Link
          href="/"
          className="inline-block bg-forest text-lime font-black px-6 py-3 rounded-2xl hover:opacity-90 transition"
        >
          Start spillet →
        </Link>
      </div>
    </main>
  )
}
