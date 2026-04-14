import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Jeg har aldri spørsmål – 100+ norske spørsmål',
  description:
    '100+ Jeg har aldri-spørsmål på norsk. Både snille, morsomme og drøye varianter. Spill rett i nettleseren med Klink – gratis.',
  alternates: { canonical: '/drikkeleker/jeg-har-aldri/sporsmal' },
}

const mild = [
  'Jeg har aldri sunget karaoke edru',
  'Jeg har aldri sovnet på en fest',
  'Jeg har aldri spist maur',
  'Jeg har aldri sittet på jernbanetorvet om natten',
  'Jeg har aldri glemt bursdagen til noen jeg er glad i',
  'Jeg har aldri stukket av fra en regning',
  'Jeg har aldri kjørt moped',
  'Jeg har aldri tatt et fly alene',
  'Jeg har aldri sett en hel sesong på én dag',
  'Jeg har aldri mistet mobilen på do',
  'Jeg har aldri sagt &quot;jeg elsker deg&quot; ved et uhell',
  'Jeg har aldri kjørt om natten uten lys',
  'Jeg har aldri ljuget om alderen min',
  'Jeg har aldri blitt kastet ut av et utested',
  'Jeg har aldri vært på blind date',
]
const morsom = [
  'Jeg har aldri Google-søkt meg selv',
  'Jeg har aldri sendt melding til feil person',
  'Jeg har aldri stalket en ex på Instagram',
  'Jeg har aldri sagt feil navn i senga',
  'Jeg har aldri gjemt meg for å unngå noen på butikken',
  'Jeg har aldri latt som jeg sov for å slippe noe',
  'Jeg har aldri sunget høyt alene hjemme',
  'Jeg har aldri tatt skjermbilde av en chat for å vise venner',
  'Jeg har aldri swipa på noen jeg kjenner',
  'Jeg har aldri ringt ex i fylla',
]
const droy = [
  'Jeg har aldri kysset noen jeg ikke vet navnet på',
  'Jeg har aldri sendt nudes',
  'Jeg har aldri bedrevet noen i en dusj',
  'Jeg har aldri hatt en three-way',
  'Jeg har aldri kysset noen av samme kjønn',
  'Jeg har aldri bedrevet noen på offentlig sted',
  'Jeg har aldri vært utro',
  'Jeg har aldri gått hjem med noen på første date',
]

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-decimal pl-6 space-y-1.5 mb-10">
      {items.map((q, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html: q }} />
      ))}
    </ul>
  )
}

export default function SporsmalPage() {
  return (
    <main className="min-h-dvh bg-lime text-forest">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <nav className="mb-8 text-sm">
          <Link href="/drikkeleker/jeg-har-aldri" className="underline underline-offset-4 hover:opacity-70">
            ← Tilbake til Jeg har aldri
          </Link>
        </nav>

        <h1 className="font-display text-5xl font-black tracking-tight mb-4">
          Jeg har aldri-spørsmål
        </h1>
        <p className="text-lg mb-8 opacity-80">
          Her er et utvalg Jeg har aldri-spørsmål på norsk – både milde, morsomme og
          drøye varianter. Vil du ha hundrevis mer? Klink har hele biblioteket gratis.
        </p>

        <Link
          href="/"
          className="inline-block bg-forest text-lime font-black px-6 py-3 rounded-2xl mb-12 hover:opacity-90 transition"
        >
          Spill med hele biblioteket →
        </Link>

        <h2 className="font-display text-3xl font-black mb-4">Milde spørsmål</h2>
        <p className="mb-4 opacity-80">Bra for blandede grupper og familieselskap.</p>
        <List items={mild} />

        <h2 className="font-display text-3xl font-black mb-4">Morsomme spørsmål</h2>
        <p className="mb-4 opacity-80">Gode til vorspiel – alle kan være med.</p>
        <List items={morsom} />

        <h2 className="font-display text-3xl font-black mb-4">Drøye spørsmål</h2>
        <p className="mb-4 opacity-80">Kun for voksne vorspiel med venner som tåler litt.</p>
        <List items={droy} />

        <h2 className="font-display text-3xl font-black mb-4">Tips til egne spørsmål</h2>
        <ul className="list-disc pl-6 space-y-2 mb-10">
          <li>Start enkelt – varm opp før dere blir personlige</li>
          <li>Spør ting du faktisk ikke vet om gjengen</li>
          <li>Unngå spørsmål som kan såre</li>
          <li>Bytt på hvem som leser opp</li>
        </ul>

        <div className="flex gap-3 flex-wrap">
          <Link href="/drikkeleker/pekeleken/sporsmal" className="underline underline-offset-4">Pekeleken-spørsmål</Link>
          <span className="opacity-40">·</span>
          <Link href="/drikkeleker" className="underline underline-offset-4">Alle drikkeleker</Link>
        </div>
      </div>
    </main>
  )
}
