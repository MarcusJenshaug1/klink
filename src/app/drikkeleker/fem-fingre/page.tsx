import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Fem fingre – Drikkelek med 5 påstander',
  description:
    'Fem fingre er klassikeren der du bøyer en finger for hver påstand som passer på deg. Drikk per ting du har gjort – eller per ting du ikke har gjort. Spill gratis online.',
  alternates: { canonical: '/drikkeleker/fem-fingre' },
  openGraph: {
    title: 'Fem fingre – Gratis drikkelek online',
    description: 'Fem påstander per runde. Tell fingre. Drikk. Perfekt vorspielsklassiker.',
    url: 'https://www.klinkn.no/drikkeleker/fem-fingre',
    type: 'website',
  },
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hvordan spiller man Fem fingre?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hold opp fem fingre. Det leses fem påstander. Bøy en finger for hver påstand som stemmer på deg. Drikk deretter én slurk per finger nede — eller per finger oppe. Bestem retning før runden starter.',
      },
    },
    {
      '@type': 'Question',
      name: 'Skal man drikke per ting man har gjort eller ikke gjort?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Begge varianter er like gyldige. Gruppa bestemmer før runden: enten drikker alle per ting de har gjort, eller per ting de ikke har gjort. Den siste gjør de mer rolige straffet, noe som snur spillet på hodet.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hvor mange spillere trenger man?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fem fingre fungerer fra to spillere og oppover. Jo flere, jo mer gøy — fordi man hører andres påstander også.',
      },
    },
  ],
}

export default function FemFingrePage() {
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
          Fem fingre
        </h1>
        <p className="text-lg mb-8 opacity-80">
          Klassikeren med fem påstander per runde. Hold opp hånden, bøy en finger for
          hver ting du har gjort – og drikk etter fasiten. Du velger selv om du
          straffes for fortid eller for mangel på fortid.
        </p>

        <Link
          href="/"
          className="inline-block bg-forest text-lime font-black px-6 py-3 rounded-2xl mb-12 hover:opacity-90 transition"
        >
          Spill Fem fingre →
        </Link>

        <h2 className="font-display text-3xl font-black mb-4">Regler</h2>
        <ol className="list-decimal pl-6 space-y-2 mb-10">
          <li>Hold opp fem fingre.</li>
          <li>Bestem retning: drikk per finger <em>nede</em> (ting du har gjort) eller per finger <em>oppe</em> (ting du ikke har gjort).</li>
          <li>Trekk et kort – fem påstander avsløres én etter én.</li>
          <li>Bøy en finger for hver påstand som stemmer på deg.</li>
          <li>Drikk slurker i henhold til retningen dere valgte.</li>
          <li>Neste kort – ny runde, eventuelt ny retning.</li>
        </ol>

        <h2 className="font-display text-3xl font-black mb-4">Hvorfor Fem fingre er gøy</h2>
        <p className="mb-4">
          Fem fingre fungerer fordi du hører hva andre har gjort – og ikke gjort. De
          rolige får plutselig straff hvis retningen er «drikk per finger oppe», og
          de ville får det hardt om retningen er motsatt.
        </p>
        <p className="mb-10">
          Kortene i Klink er delt inn i kategorier (fest, dating, jobb, drøy, osv.)
          så dere kan velge tone etter gjengen.
        </p>

        <h2 className="font-display text-3xl font-black mb-4">Passer for</h2>
        <ul className="list-disc pl-6 space-y-2 mb-10">
          <li>Vorspiel der dere allerede kjenner hverandre litt</li>
          <li>Fra 2 spillere og oppover</li>
          <li>Folk som liker både drøye og rolige varianter</li>
        </ul>

        <div className="flex gap-3 flex-wrap">
          <Link href="/drikkeleker/jeg-har-aldri" className="underline underline-offset-4">Jeg har aldri</Link>
          <span className="opacity-40">·</span>
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
