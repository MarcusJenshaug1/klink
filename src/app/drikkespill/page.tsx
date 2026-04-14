import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Drikkespill online – Gratis norsk drikkespill på nett',
  description:
    'Drikkespill gratis online. Norges festligste digitale drikkespill – Jeg har aldri, Pekeleken, Snusboksen og Klink-pakker. Spill rett i nettleseren, ingen nedlasting.',
  alternates: { canonical: '/drikkespill' },
  openGraph: {
    title: 'Drikkespill online – Gratis på norsk',
    description: 'Digitalt drikkespill på norsk. Spill rett i nettleseren. Gratis.',
    url: 'https://www.klinkn.no/drikkespill',
    type: 'website',
  },
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hva er det beste drikkespillet på norsk?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Klink samler de beste drikkespillene på ett sted: Jeg har aldri, Pekeleken, Snusboksen og Klink-pakker – alt på norsk, gratis og rett i nettleseren.',
      },
    },
    {
      '@type': 'Question',
      name: 'Er drikkespill online gratis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Klink er helt gratis. Ingen betaling, ingen reklame i spillet, ingen registrering.',
      },
    },
    {
      '@type': 'Question',
      name: 'Trenger man å laste ned en app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nei. Klink spilles rett i nettleseren. Du kan installere det som PWA om du vil, men det er ikke nødvendig.',
      },
    },
  ],
}

export default function DrikkespillPage() {
  return (
    <main className="min-h-dvh bg-lime text-forest">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <nav className="mb-8 text-sm">
          <Link href="/" className="underline underline-offset-4 hover:opacity-70">
            ← Tilbake til Klink
          </Link>
        </nav>

        <h1 className="font-display text-5xl sm:text-6xl font-black tracking-tight mb-4">
          Drikkespill online
        </h1>
        <p className="text-lg mb-8 opacity-80">
          Norges festligste digitale drikkespill. Spill klassiske drikkeleker som Jeg
          har aldri, Pekeleken og Snusboksen – rett i nettleseren, helt gratis og på
          norsk. Ingen nedlasting, ingen registrering.
        </p>

        <Link
          href="/"
          className="inline-block bg-forest text-lime font-black px-6 py-3 rounded-2xl mb-12 hover:opacity-90 transition"
        >
          Start drikkespillet →
        </Link>

        <h2 className="font-display text-3xl font-black mb-4">Hva er Klink?</h2>
        <p className="mb-10">
          Klink er et gratis, digitalt drikkespill for vorspiel, forspill og fest.
          Innholdet er skrevet på norsk av norske skribenter, og vi oppdaterer
          spørsmålsbiblioteket jevnlig. Velg mellom snille og drøye varianter – du
          styrer nivået selv.
        </p>

        <h2 className="font-display text-3xl font-black mb-4">Spillene</h2>
        <ul className="space-y-4 mb-10">
          <li className="bg-white/60 backdrop-blur-sm rounded-2xl p-5">
            <h3 className="font-display text-xl font-black mb-1">
              <Link href="/drikkeleker/jeg-har-aldri" className="hover:underline">Jeg har aldri</Link>
            </h3>
            <p className="opacity-80">Klassikeren. Utsagn vises – de som har gjort det drikker.</p>
          </li>
          <li className="bg-white/60 backdrop-blur-sm rounded-2xl p-5">
            <h3 className="font-display text-xl font-black mb-1">
              <Link href="/drikkeleker/pekeleken" className="hover:underline">Pekeleken</Link>
            </h3>
            <p className="opacity-80">Alle peker samtidig på den som passer best. Flest pek = drikk.</p>
          </li>
          <li className="bg-white/60 backdrop-blur-sm rounded-2xl p-5">
            <h3 className="font-display text-xl font-black mb-1">
              <Link href="/drikkeleker/snusboksen" className="hover:underline">Snusboksen</Link>
            </h3>
            <p className="opacity-80">Korte, direkte &quot;Hvem ...?&quot;-spørsmål i høyt tempo.</p>
          </li>
          <li className="bg-white/60 backdrop-blur-sm rounded-2xl p-5">
            <h3 className="font-display text-xl font-black mb-1">Klink-pakker</h3>
            <p className="opacity-80">Festspørsmål og utfordringer i flere kategorier.</p>
          </li>
        </ul>

        <h2 className="font-display text-3xl font-black mb-4">Derfor er Klink det beste drikkespillet</h2>
        <ul className="list-disc pl-6 space-y-2 mb-10">
          <li>Helt gratis – ingen skjulte kostnader</li>
          <li>Fungerer uten nedlasting</li>
          <li>Norsk innhold, norsk humor</li>
          <li>Både snille og drøye varianter</li>
          <li>2 til 20+ spillere</li>
          <li>Fungerer offline (PWA)</li>
        </ul>

        <h2 className="font-display text-3xl font-black mb-4">Ofte stilte spørsmål</h2>
        <dl className="space-y-5 mb-12">
          <div>
            <dt className="font-bold">Hva er det beste drikkespillet på norsk?</dt>
            <dd className="opacity-80 mt-1">Klink samler de beste drikkespillene på ett sted.</dd>
          </div>
          <div>
            <dt className="font-bold">Er drikkespill online gratis?</dt>
            <dd className="opacity-80 mt-1">Ja, Klink er helt gratis.</dd>
          </div>
          <div>
            <dt className="font-bold">Trenger man å laste ned en app?</dt>
            <dd className="opacity-80 mt-1">Nei – spill rett i nettleseren.</dd>
          </div>
        </dl>

        <div className="flex gap-3 flex-wrap">
          <Link href="/drikkeleker" className="underline underline-offset-4">Alle drikkeleker</Link>
          <span className="opacity-40">·</span>
          <Link href="/vorspiel-leker" className="underline underline-offset-4">Vorspiel-leker</Link>
          <span className="opacity-40">·</span>
          <Link href="/regler" className="underline underline-offset-4">Regler</Link>
        </div>
      </div>
    </main>
  )
}
