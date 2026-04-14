import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Drikkeleker 2 personer – Drikkelek for to (og flere)',
  description:
    'Beste drikkeleker for 2 personer, 3 personer, 4 personer og mange spillere. Jeg har aldri, Pekeleken og Snusboksen – gratis online på norsk.',
  alternates: { canonical: '/drikkeleker/2-personer' },
  openGraph: {
    title: 'Drikkeleker 2 personer – Drikkelek for to',
    description:
      'Drikkelek for to, tre, fire eller mange. Gratis i nettleseren. Både snille og drøye varianter.',
    url: 'https://www.klinkn.no/drikkeleker/2-personer',
    type: 'website',
  },
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Finnes det drikkeleker for kun 2 personer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja. Jeg har aldri og Klink-pakker funker godt for 2 personer. Pekeleken og Snusboksen krever minst 3 spillere siden de er basert på peking.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hva er den beste drikkeleken for 4 personer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pekeleken og Snusboksen er laget for grupper på 3 og oppover. Med 4 personer får du mest ut av peke-mekanikken.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hvor mange spillere kan maks spille samtidig?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Klink har ingen øvre grense. Leker funker fint med 10+ personer – jo flere, jo morsommere blir Pekeleken.',
      },
    },
  ],
}

const buckets = [
  {
    count: '2 personer',
    id: '2-personer',
    best: ['Jeg har aldri', 'Klink-pakker'],
    note: 'For to spillere funker best de lekene som ikke krever peking. Jeg har aldri blir intim og morsom. Klink-pakker gir utfordringer og festspørsmål dere svarer på etter tur.',
    tip: 'Drikkelek for to funker perfekt som oppvarming før vorspiel – eller som date-aktivitet.',
  },
  {
    count: '3 personer',
    id: '3-personer',
    best: ['Pekeleken', 'Snusboksen', 'Jeg har aldri'],
    note: 'Med 3 spillere åpnes peke-lekene opp. Pekeleken og Snusboksen blir morsomme her – alle peker samtidig og en drikker.',
    tip: '3 personer er minimum for en "ekte" pekelek-kveld.',
  },
  {
    count: '4 personer',
    id: '4-personer',
    best: ['Pekeleken', 'Snusboksen', 'Klink-pakker', 'Jeg har aldri'],
    note: 'Fire er sweet spot for mange drikkeleker. Alle kommer til orde, og peke-lekene får nok variasjon.',
    tip: 'Kombiner 2–3 ulike drikkeleker på samme kveld for variasjon.',
  },
  {
    count: '5–6 personer',
    id: '5-6-personer',
    best: ['Pekeleken', 'Snusboksen', 'Jeg har aldri', 'Klink drøy'],
    note: 'Klassisk vorspiel-størrelse. Her skinner Pekeleken – jo flere meninger, jo mer uforutsigbare peke-runder.',
    tip: 'Prøv drøy modus når alle kjenner hverandre godt.',
  },
  {
    count: '7+ personer',
    id: '7-personer',
    best: ['Pekeleken', 'Snusboksen', 'Klink-pakker'],
    note: 'Store grupper? Ingen øvre grense. Pekeleken blir kaos på best mulig måte med 8–12 spillere.',
    tip: 'Del eventuelt i to grupper hvis det blir for tregt å sende skjermen rundt.',
  },
]

export default function AntallSpillerePage() {
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
          Drikkeleker 2 personer
        </h1>
        <p className="text-lg mb-8 opacity-80">
          Drikkelek for to? Eller tre, fire, seks eller tolv? Her er de beste
          drikkelekene sortert etter antall spillere – alle gratis i nettleseren.
        </p>

        <Link
          href="/"
          className="inline-block bg-forest text-lime font-black px-6 py-3 rounded-2xl mb-12 hover:opacity-90 transition"
        >
          Start spillet gratis →
        </Link>

        <h2 className="font-display text-3xl font-black mb-4">Velg etter antall spillere</h2>
        <ul className="flex flex-wrap gap-2 mb-10">
          {buckets.map((b) => (
            <li key={b.id}>
              <a
                href={`#${b.id}`}
                className="inline-block bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full font-semibold hover:bg-white/80 transition"
              >
                {b.count}
              </a>
            </li>
          ))}
        </ul>

        {buckets.map((b) => (
          <section key={b.id} id={b.id} className="mb-10 scroll-mt-8">
            <h2 className="font-display text-3xl font-black mb-2">Drikkeleker {b.count}</h2>
            <p className="mb-3">{b.note}</p>
            <p className="mb-3">
              <strong>Best for {b.count}:</strong> {b.best.join(', ')}.
            </p>
            <p className="opacity-70 italic">💡 {b.tip}</p>
          </section>
        ))}

        <h2 className="font-display text-3xl font-black mb-4">Drikkelek for to – litt ekstra</h2>
        <p className="mb-4">
          Er dere bare to? Glem ikke at Klink også kan brukes som oppvarmingsspill før
          andre kommer, eller som en måte å bli bedre kjent. Jeg har aldri-spørsmål
          egner seg spesielt godt når det bare er to – spørsmålene blir mer personlige,
          og dere får ærlige svar.
        </p>
        <p className="mb-10">
          Tips: Velg drøy modus hvis dere er komfortable, eller mild modus om det er
          første gang dere spiller sammen.
        </p>

        <h2 className="font-display text-3xl font-black mb-4">Drikkeleker for mange (vorspiel)</h2>
        <p className="mb-10">
          Med 6+ spillere blir Pekeleken og Snusboksen klassisk vorspiel-moro. Jo flere
          som peker, jo mer uforutsigbart – og alle får drikke en runde de ikke så komme.
          Klink har ingen øvre grense på antall spillere.
        </p>

        <h2 className="font-display text-3xl font-black mb-4">Ofte stilte spørsmål</h2>
        <dl className="space-y-5 mb-12">
          <div>
            <dt className="font-bold">Finnes det drikkeleker for kun 2 personer?</dt>
            <dd className="opacity-80 mt-1">
              Ja. Jeg har aldri og Klink-pakker funker godt for 2. Pekeleken og
              Snusboksen krever minst 3.
            </dd>
          </div>
          <div>
            <dt className="font-bold">Hva er den beste drikkeleken for 4 personer?</dt>
            <dd className="opacity-80 mt-1">
              Pekeleken og Snusboksen skinner med 4 spillere.
            </dd>
          </div>
          <div>
            <dt className="font-bold">Hvor mange spillere kan maks spille samtidig?</dt>
            <dd className="opacity-80 mt-1">
              Ingen øvre grense. 10+ funker helt fint – jo flere jo mer kaos.
            </dd>
          </div>
        </dl>

        <div className="flex gap-3 flex-wrap">
          <Link href="/drikkeleker/jeg-har-aldri" className="underline underline-offset-4">Jeg har aldri</Link>
          <span className="opacity-40">·</span>
          <Link href="/drikkeleker/pekeleken" className="underline underline-offset-4">Pekeleken</Link>
          <span className="opacity-40">·</span>
          <Link href="/drikkeleker/snusboksen" className="underline underline-offset-4">Snusboksen</Link>
          <span className="opacity-40">·</span>
          <Link href="/regler" className="underline underline-offset-4">Regler</Link>
        </div>
      </div>
    </main>
  )
}
