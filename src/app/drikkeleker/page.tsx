import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Drikkeleker – 20+ drøye og morsomme drikkeleker online',
  description:
    'Norges største samling drikkeleker på nett. Spill Jeg har aldri, Pekeleken, Snusboksen og drøye festspørsmål gratis. Perfekt for vorspiel, fest og forspill.',
  alternates: { canonical: '/drikkeleker' },
  openGraph: {
    title: 'Drikkeleker – Gratis drikkeleker online',
    description:
      'Drikkeleker på norsk. Drøye festspørsmål, Jeg har aldri, Pekeleken og mer. Gratis i nettleseren.',
    url: 'https://www.klinkn.no/drikkeleker',
    type: 'website',
  },
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hva er de beste drikkelekene til vorspiel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Jeg har aldri, Pekeleken og Snusboksen er klassikere som alltid funker. Klink har alle tre gratis online, med både snille og drøye varianter.',
      },
    },
    {
      '@type': 'Question',
      name: 'Finnes det drøye drikkeleker?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja. Klink har en egen drøy-pakke med frekke festspørsmål og utfordringer for de som tåler litt hardere innhold.',
      },
    },
    {
      '@type': 'Question',
      name: 'Trenger jeg kort eller utstyr?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nei. Alle drikkelekene spilles gratis i nettleseren på mobil. Ingen nedlasting, ingen kort, ingen registrering.',
      },
    },
  ],
}

const games = [
  {
    name: 'Jeg har aldri',
    slug: 'jeg-har-aldri',
    desc: 'Klassikeren. Spillerne sier ting de aldri har gjort. De som har gjort det drikker. Både snille og drøye spørsmål.',
  },
  {
    name: 'Pekeleken',
    slug: 'pekeleken',
    desc: 'Alle peker samtidig på spilleren som passer best til "Hvem ...?"-spørsmålet. Den med flest pek drikker.',
  },
  {
    name: 'Snusboksen',
    slug: 'snusboksen',
    desc: 'Korte, direkte "Hvem ...?"-spørsmål. Rask runde, mye latter.',
  },
  {
    name: 'Fem fingre',
    slug: 'fem-fingre',
    desc: 'Fem påstander. Bøy en finger per ting du har gjort. Drikk per treff – eller per miss. Du velger.',
  },
  {
    name: 'Klink-pakker',
    slug: 'klink',
    desc: 'Festspørsmål og utfordringer i flere kategorier – inkludert en drøy variant for de litt mer våghalsede.',
  },
]

export default function DrikkelekerPage() {
  return (
    <main className="min-h-dvh bg-lime text-forest">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <nav className="mb-8 text-sm">
          <Link href="/" className="underline underline-offset-4 hover:opacity-70">
            ← Tilbake til Klink
          </Link>
        </nav>

        <h1 className="font-display text-5xl sm:text-6xl font-black tracking-tight leading-none mb-4">
          Drikkeleker
        </h1>
        <p className="text-lg mb-8 opacity-80">
          Gratis drikkeleker på norsk – spill rett i nettleseren. Perfekt for vorspiel,
          fest og forspill. Både snille og drøye varianter for 2 spillere eller flere.
        </p>

        <Link
          href="/"
          className="inline-block bg-forest text-lime font-black px-6 py-3 rounded-2xl mb-12 hover:opacity-90 transition"
        >
          Start spillet gratis →
        </Link>

        <h2 className="font-display text-3xl font-black mb-4">Våre drikkeleker</h2>
        <ul className="space-y-4 mb-12">
          {games.map((g) => (
            <li key={g.slug} className="bg-white/60 backdrop-blur-sm rounded-2xl p-5">
              <h3 className="font-display text-xl font-black mb-1">{g.name}</h3>
              <p className="opacity-80">{g.desc}</p>
            </li>
          ))}
        </ul>

        <h2 className="font-display text-3xl font-black mb-4">Drøye drikkeleker</h2>
        <p className="mb-4">
          Leter du etter drøye drikkeleker? Klink har en egen drøy-modus med frekke
          festspørsmål og utfordringer. Passer best til voksne vorspiel der alle er
          komfortable med hardere innhold.
        </p>
        <p className="mb-12">
          Alle drikkelekene kan spilles både som milde og drøye varianter – du velger
          selv nivået før spillet starter.
        </p>

        <h2 className="font-display text-3xl font-black mb-4">Hvorfor Klink?</h2>
        <ul className="list-disc pl-6 space-y-2 mb-12">
          <li>Gratis – ingen betaling, ingen reklame i spillet</li>
          <li>Ingen nedlasting – fungerer rett i nettleseren på mobilen</li>
          <li>Norsk innhold – alle spørsmål er skrevet på norsk</li>
          <li>Fungerer offline som app (PWA)</li>
          <li>Fra 2 spillere og oppover</li>
        </ul>

        <h2 className="font-display text-3xl font-black mb-4">Ofte stilte spørsmål</h2>
        <dl className="space-y-5 mb-12">
          <div>
            <dt className="font-bold">Hva er de beste drikkelekene til vorspiel?</dt>
            <dd className="opacity-80 mt-1">
              Jeg har aldri, Pekeleken og Snusboksen er klassikere som alltid funker.
              Klink har alle tre gratis online.
            </dd>
          </div>
          <div>
            <dt className="font-bold">Finnes det drøye drikkeleker?</dt>
            <dd className="opacity-80 mt-1">
              Ja. Klink har en egen drøy-pakke med frekke festspørsmål.
            </dd>
          </div>
          <div>
            <dt className="font-bold">Trenger jeg kort eller utstyr?</dt>
            <dd className="opacity-80 mt-1">
              Nei. Alt spilles gratis i nettleseren på mobil.
            </dd>
          </div>
        </dl>

        <div className="flex gap-3 flex-wrap">
          <Link href="/drikkeleker/2-personer" className="underline underline-offset-4">Drikkeleker 2 personer</Link>
          <span className="opacity-40">·</span>
          <Link href="/regler" className="underline underline-offset-4">Regler</Link>
          <span className="opacity-40">·</span>
          <Link href="/om" className="underline underline-offset-4">Om Klink</Link>
        </div>
      </div>
    </main>
  )
}
