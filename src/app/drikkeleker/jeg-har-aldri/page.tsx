import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Jeg har aldri – Spill drikkeleken gratis online',
  description:
    'Spill Jeg har aldri på norsk – gratis drikkelek med 500+ spørsmål. Både snille og drøye varianter. Klassikeren til vorspiel og fest. Ingen nedlasting.',
  alternates: { canonical: '/drikkeleker/jeg-har-aldri' },
  openGraph: {
    title: 'Jeg har aldri – Gratis drikkelek online',
    description: 'Spill Jeg har aldri gratis i nettleseren. Både snille og drøye spørsmål.',
    url: 'https://www.klinkn.no/drikkeleker/jeg-har-aldri',
    type: 'website',
  },
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hvordan spiller man Jeg har aldri?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Én spiller sier "Jeg har aldri ..." og et utsagn. Alle som har gjort det tar en slurk. I Klink sendes skjermen rundt og viser nye utsagn automatisk.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hvor mange spillere trenger man til Jeg har aldri?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Minimum 2 spillere, men leken funker best med 4–8 personer.',
      },
    },
    {
      '@type': 'Question',
      name: 'Finnes det drøye Jeg har aldri-spørsmål?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja. Klink har en egen drøy-modus med frekkere Jeg har aldri-spørsmål for voksne vorspiel.',
      },
    },
  ],
}

export default function JegHarAldriPage() {
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
          Jeg har aldri
        </h1>
        <p className="text-lg mb-8 opacity-80">
          Den klassiske drikkeleken – nå gratis i nettleseren. Perfekt for vorspiel,
          forspill og fest. Både snille spørsmål og drøye varianter.
        </p>

        <Link
          href="/"
          className="inline-block bg-forest text-lime font-black px-6 py-3 rounded-2xl mb-12 hover:opacity-90 transition"
        >
          Spill Jeg har aldri →
        </Link>

        <h2 className="font-display text-3xl font-black mb-4">Slik spilles det</h2>
        <ol className="list-decimal pl-6 space-y-2 mb-10">
          <li>Samle 2 eller flere spillere rundt bordet</li>
          <li>Åpne Klink og legg til spillernavn</li>
          <li>Velg pakken &quot;Jeg har aldri&quot;</li>
          <li>Les utsagnet høyt – alle som har gjort det tar en slurk</li>
          <li>Send skjermen videre for neste utsagn</li>
        </ol>

        <h2 className="font-display text-3xl font-black mb-4">Eksempelspørsmål</h2>
        <ul className="list-disc pl-6 space-y-2 mb-10">
          <li>Jeg har aldri sendt en melding til feil person</li>
          <li>Jeg har aldri kysset noen på første date</li>
          <li>Jeg har aldri sovnet på en fest</li>
          <li>Jeg har aldri ljuget på jobb/skole</li>
        </ul>
        <p className="mb-10 opacity-80">
          Klink har 500+ spørsmål fordelt på flere kategorier – fra helt milde til de
          drøyeste variantene.
        </p>

        <h2 className="font-display text-3xl font-black mb-4">Jeg har aldri drøy</h2>
        <p className="mb-10">
          Leter du etter drøye Jeg har aldri-spørsmål? Velg drøy modus i spillet for
          frekkere utsagn. Passer best for voksne vorspiel der alle er komfortable med
          hardere innhold.
        </p>

        <h2 className="font-display text-3xl font-black mb-4">Hvorfor spille i Klink?</h2>
        <ul className="list-disc pl-6 space-y-2 mb-10">
          <li>Gratis – ingen reklame midt i spillet</li>
          <li>Fungerer uten nedlasting, rett i nettleseren</li>
          <li>Norsk innhold, skrevet av norske skribenter</li>
          <li>Nye spørsmål hele tiden</li>
        </ul>

        <h2 className="font-display text-3xl font-black mb-4">Ofte stilte spørsmål</h2>
        <dl className="space-y-5 mb-12">
          <div>
            <dt className="font-bold">Hvordan spiller man Jeg har aldri?</dt>
            <dd className="opacity-80 mt-1">
              Én sier &quot;Jeg har aldri ...&quot; – de som har gjort det drikker. I Klink
              viser skjermen nye utsagn automatisk.
            </dd>
          </div>
          <div>
            <dt className="font-bold">Hvor mange spillere trenger man?</dt>
            <dd className="opacity-80 mt-1">Minst 2 – best med 4–8.</dd>
          </div>
          <div>
            <dt className="font-bold">Finnes det drøye Jeg har aldri-spørsmål?</dt>
            <dd className="opacity-80 mt-1">Ja, velg drøy modus i spillet.</dd>
          </div>
        </dl>

        <div className="flex gap-3 flex-wrap">
          <Link href="/drikkeleker/pekeleken" className="underline underline-offset-4">Pekeleken</Link>
          <span className="opacity-40">·</span>
          <Link href="/drikkeleker/snusboksen" className="underline underline-offset-4">Snusboksen</Link>
          <span className="opacity-40">·</span>
          <Link href="/regler" className="underline underline-offset-4">Alle regler</Link>
        </div>
      </div>
    </main>
  )
}
