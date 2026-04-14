import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pekeleken – Drikkelek hvor alle peker samtidig',
  description:
    'Spill Pekeleken gratis online. "Hvem ...?"-spørsmål hvor alle peker samtidig på den som passer best. Klassisk drikkelek for vorspiel og fest.',
  alternates: { canonical: '/drikkeleker/pekeleken' },
  openGraph: {
    title: 'Pekeleken – Gratis drikkelek online',
    description: 'Alle peker samtidig. Den med flest pek drikker. Spill gratis i nettleseren.',
    url: 'https://www.klinkn.no/drikkeleker/pekeleken',
    type: 'website',
  },
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hvordan spiller man Pekeleken?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Skjermen viser et "Hvem ...?"-spørsmål. På tre peker alle samtidig på spilleren de synes passer best. Den som får flest pek drikker.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hva hvis flere får like mange pek?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alle de utpekte drikker. Det er en del av moroa.',
      },
    },
  ],
}

export default function PekelekenPage() {
  return (
    <main className="min-h-dvh bg-lime text-forest">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <nav className="mb-8 text-sm">
          <Link href="/drikkeleker" className="underline underline-offset-4 hover:opacity-70">
            ← Alle drikkeleker
          </Link>
        </nav>

        <h1 className="font-display text-5xl sm:text-6xl font-black tracking-tight leading-none mb-4">
          Pekeleken
        </h1>
        <p className="text-lg mb-8 opacity-80">
          &quot;Hvem ...?&quot;-spørsmål der alle peker samtidig på spilleren som passer
          best. En av de morsomste drikkelekene til vorspiel – nå gratis online.
        </p>

        <Link
          href="/"
          className="inline-block bg-forest text-lime font-black px-6 py-3 rounded-2xl mb-12 hover:opacity-90 transition"
        >
          Spill Pekeleken →
        </Link>

        <h2 className="font-display text-3xl font-black mb-4">Regler</h2>
        <ol className="list-decimal pl-6 space-y-2 mb-10">
          <li>Samle minst 3 spillere (funker best med 4+)</li>
          <li>Les spørsmålet høyt: &quot;Hvem er mest sannsynlig til å ...?&quot;</li>
          <li>Tell ned: 3, 2, 1 – alle peker samtidig</li>
          <li>Den som får flest pek tar en slurk</li>
          <li>Like mange pek? Alle drikker</li>
        </ol>

        <h2 className="font-display text-3xl font-black mb-4">Eksempelspørsmål</h2>
        <ul className="list-disc pl-6 space-y-2 mb-10">
          <li>Hvem er mest sannsynlig til å sovne først på festen?</li>
          <li>Hvem har sendt flest pinlige meldinger?</li>
          <li>Hvem ville klart seg best på en øde øy?</li>
          <li>Hvem er mest glad i oppmerksomhet?</li>
        </ul>

        <h2 className="font-display text-3xl font-black mb-4">Drøy Pekeleken</h2>
        <p className="mb-10">
          Velg drøy modus for frekkere &quot;Hvem ...?&quot;-spørsmål. Passer for voksne
          vorspiel der alle er komfortable med hardere innhold.
        </p>

        <h2 className="font-display text-3xl font-black mb-4">Tips</h2>
        <ul className="list-disc pl-6 space-y-2 mb-10">
          <li>Ikke ta det personlig – det er en lek</li>
          <li>Jo flere spillere, jo morsommere</li>
          <li>Bland med Jeg har aldri og Snusboksen for variasjon</li>
        </ul>

        <div className="flex gap-3 flex-wrap">
          <Link href="/drikkeleker/jeg-har-aldri" className="underline underline-offset-4">Jeg har aldri</Link>
          <span className="opacity-40">·</span>
          <Link href="/drikkeleker/snusboksen" className="underline underline-offset-4">Snusboksen</Link>
          <span className="opacity-40">·</span>
          <Link href="/regler" className="underline underline-offset-4">Alle regler</Link>
        </div>
      </div>
    </main>
  )
}
