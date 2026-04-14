import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Drøye drikkeleker – Frekke drikkespill for voksne vorspiel',
  description:
    'Drøye drikkeleker på norsk. Frekke festspørsmål, drøy Jeg har aldri, drøy Pekeleken og drøy Snusboksen. Gratis online – for voksne vorspiel.',
  alternates: { canonical: '/drikkeleker/droye' },
  openGraph: {
    title: 'Drøye drikkeleker – Gratis online',
    description: 'Frekke drikkeleker for voksne vorspiel. Drøy modus i alle spill.',
    url: 'https://www.klinkn.no/drikkeleker/droye',
    type: 'website',
  },
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hva er drøye drikkeleker?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Drøye drikkeleker har frekkere, mer intime eller grensesprengende spørsmål enn klassiske drikkeleker. Best blant venner som kjenner hverandre godt.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hvem bør spille drøye drikkeleker?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Voksne vorspiel der alle spillere er komfortable med hardere innhold. Ikke for familieselskap eller første gang dere møtes.',
      },
    },
  ],
}

export default function DroyePage() {
  return (
    <main className="min-h-dvh bg-lime text-forest">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <nav className="mb-8 text-sm">
          <Link href="/drikkeleker" className="underline underline-offset-4 hover:opacity-70">
            ← Alle drikkeleker
          </Link>
        </nav>

        <h1 className="font-display text-5xl sm:text-6xl font-black tracking-tight mb-4">
          Drøye drikkeleker
        </h1>
        <p className="text-lg mb-8 opacity-80">
          Frekke drikkeleker for voksne vorspiel. Alle spill i Klink har en drøy modus
          med hardere innhold – velg selv nivå før spillet starter.
        </p>

        <Link
          href="/"
          className="inline-block bg-forest text-lime font-black px-6 py-3 rounded-2xl mb-12 hover:opacity-90 transition"
        >
          Start drøy modus →
        </Link>

        <h2 className="font-display text-3xl font-black mb-4">Drøye spillpakker</h2>
        <ul className="space-y-4 mb-10">
          <li className="bg-white/60 backdrop-blur-sm rounded-2xl p-5">
            <h3 className="font-display text-xl font-black mb-1">Drøy Jeg har aldri</h3>
            <p className="opacity-80">Frekke utsagn som går på intimt, flaut og personlig. Drikker man? Da har man gjort det.</p>
          </li>
          <li className="bg-white/60 backdrop-blur-sm rounded-2xl p-5">
            <h3 className="font-display text-xl font-black mb-1">Drøy Pekeleken</h3>
            <p className="opacity-80">&quot;Hvem ...?&quot; med frekkere vri. Pek samtidig – den med flest pek drikker.</p>
          </li>
          <li className="bg-white/60 backdrop-blur-sm rounded-2xl p-5">
            <h3 className="font-display text-xl font-black mb-1">Drøy Snusboksen</h3>
            <p className="opacity-80">Korte, direkte og frekke &quot;Hvem ...?&quot;-spørsmål i høyt tempo.</p>
          </li>
          <li className="bg-white/60 backdrop-blur-sm rounded-2xl p-5">
            <h3 className="font-display text-xl font-black mb-1">Klink drøy-pakke</h3>
            <p className="opacity-80">Festspørsmål og utfordringer med frekk vri – den drøyeste samlingen.</p>
          </li>
        </ul>

        <h2 className="font-display text-3xl font-black mb-4">Når passer drøye drikkeleker?</h2>
        <ul className="list-disc pl-6 space-y-2 mb-10">
          <li>Voksne vorspiel med venner du kjenner godt</li>
          <li>Utdrikningslag og polterabend</li>
          <li>Bursdager for voksne</li>
          <li><strong>Ikke</strong> for familieselskap, jobbfester eller første gang gruppen møtes</li>
        </ul>

        <h2 className="font-display text-3xl font-black mb-4">Respekt</h2>
        <p className="mb-10">
          Drøye drikkeleker er moro når alle er med. Sjekk før spillet at alle er
          komfortable. Ingen skal presses til å svare eller drikke mot egen vilje.
          Ha det gøy – med måte.
        </p>

        <h2 className="font-display text-3xl font-black mb-4">Ofte stilte spørsmål</h2>
        <dl className="space-y-5 mb-12">
          <div>
            <dt className="font-bold">Hva er drøye drikkeleker?</dt>
            <dd className="opacity-80 mt-1">Drikkeleker med frekke, intime eller grensesprengende spørsmål.</dd>
          </div>
          <div>
            <dt className="font-bold">Hvem bør spille drøye drikkeleker?</dt>
            <dd className="opacity-80 mt-1">Voksne vorspiel der alle er komfortable med hardere innhold.</dd>
          </div>
        </dl>

        <div className="flex gap-3 flex-wrap">
          <Link href="/drikkeleker/jeg-har-aldri" className="underline underline-offset-4">Jeg har aldri</Link>
          <span className="opacity-40">·</span>
          <Link href="/drikkeleker/pekeleken" className="underline underline-offset-4">Pekeleken</Link>
          <span className="opacity-40">·</span>
          <Link href="/drikkeleker/snusboksen" className="underline underline-offset-4">Snusboksen</Link>
        </div>
      </div>
    </main>
  )
}
