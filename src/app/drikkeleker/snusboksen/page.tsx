import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Snusboksen – Rask drikkelek med frekke spørsmål',
  description:
    'Snusboksen er drikkeleken for dere som liker tempo. Korte, direkte "Hvem ...?"-spørsmål. Spill gratis online i nettleseren.',
  alternates: { canonical: '/drikkeleker/snusboksen' },
  openGraph: {
    title: 'Snusboksen – Gratis drikkelek online',
    description: 'Rask, direkte drikkelek. Korte "Hvem ...?"-spørsmål med høyt tempo.',
    url: 'https://www.klinkn.no/drikkeleker/snusboksen',
    type: 'website',
  },
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hva er Snusboksen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Snusboksen er en rask drikkelek med korte, direkte "Hvem ...?"-spørsmål. Spillerne peker samtidig på den som passer best, og den med flest pek drikker.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hva er forskjellen på Snusboksen og Pekeleken?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Samme grunnregel, men Snusboksen har kortere og ofte frekkere spørsmål med høyere tempo.',
      },
    },
  ],
}

export default function SnusboksenPage() {
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
          Snusboksen
        </h1>
        <p className="text-lg mb-8 opacity-80">
          Drikkeleken for dere som liker tempo. Korte, direkte &quot;Hvem ...?&quot;-spørsmål
          – perfekt når stemningen er høy og rundene skal gå fort.
        </p>

        <Link
          href="/"
          className="inline-block bg-forest text-lime font-black px-6 py-3 rounded-2xl mb-12 hover:opacity-90 transition"
        >
          Spill Snusboksen →
        </Link>

        <h2 className="font-display text-3xl font-black mb-4">Regler</h2>
        <ol className="list-decimal pl-6 space-y-2 mb-10">
          <li>Minimum 3 spillere</li>
          <li>Les spørsmålet høyt – &quot;Hvem ...?&quot;</li>
          <li>Pek samtidig på 3</li>
          <li>Den med flest pek drikker. Like mange = alle drikker</li>
          <li>Neste kort – høy fart hele veien</li>
        </ol>

        <h2 className="font-display text-3xl font-black mb-4">Snusboksen vs Pekeleken</h2>
        <p className="mb-10">
          Samme grunnregel, men Snusboksen er raskere og har kortere, frekkere spørsmål.
          Pekeleken har mer utbroderte &quot;Hvem er mest sannsynlig til å ...&quot;-spørsmål.
          Kombiner gjerne begge på samme kveld.
        </p>

        <h2 className="font-display text-3xl font-black mb-4">Passer for</h2>
        <ul className="list-disc pl-6 space-y-2 mb-10">
          <li>Vorspiel med venner som kjenner hverandre godt</li>
          <li>Når energien er høy og dere vil ha rask action</li>
          <li>Blandet med andre drikkeleker for variasjon</li>
        </ul>

        <div className="flex gap-3 flex-wrap">
          <Link href="/drikkeleker/jeg-har-aldri" className="underline underline-offset-4">Jeg har aldri</Link>
          <span className="opacity-40">·</span>
          <Link href="/drikkeleker/pekeleken" className="underline underline-offset-4">Pekeleken</Link>
          <span className="opacity-40">·</span>
          <Link href="/regler" className="underline underline-offset-4">Alle regler</Link>
        </div>
      </div>
    </main>
  )
}
