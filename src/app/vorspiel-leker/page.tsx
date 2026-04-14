import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Vorspiel-leker – Beste leker og drikkespill til vorspiel',
  description:
    'Vorspiel-leker og forspill-leker på norsk. Få festen i gang med drikkeleker, festspørsmål og utfordringer. Gratis online, ingen nedlasting.',
  alternates: { canonical: '/vorspiel-leker' },
  openGraph: {
    title: 'Vorspiel-leker – Gratis online',
    description: 'Få vorspielet i gang. Drikkeleker, festspørsmål og utfordringer.',
    url: 'https://www.klinkn.no/vorspiel-leker',
    type: 'website',
  },
}

export default function VorspielPage() {
  return (
    <main className="min-h-dvh bg-lime text-forest">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <nav className="mb-8 text-sm">
          <Link href="/" className="underline underline-offset-4 hover:opacity-70">
            ← Tilbake til Klink
          </Link>
        </nav>

        <h1 className="font-display text-5xl sm:text-6xl font-black tracking-tight mb-4">
          Vorspiel-leker
        </h1>
        <p className="text-lg mb-8 opacity-80">
          Vorspiel uten leker er som dans uten musikk. Her er de beste vorspiel-lekene
          og forspill-lekene – alle gratis, alle på norsk, alle rett i nettleseren.
        </p>

        <Link
          href="/"
          className="inline-block bg-forest text-lime font-black px-6 py-3 rounded-2xl mb-12 hover:opacity-90 transition"
        >
          Start vorspielet →
        </Link>

        <h2 className="font-display text-3xl font-black mb-4">Hva er et vorspiel?</h2>
        <p className="mb-10">
          Vorspiel (også kalt &quot;forspill&quot; eller &quot;pre&quot;) er samlingen
          hjemme før dere går ut. Stemningen bygges opp, alle er samlet, og det er
          perfekt tidspunkt for drikkeleker. En god vorspiel-lek bryter isen, får alle
          til å le og gjør kvelden minneverdig.
        </p>

        <h2 className="font-display text-3xl font-black mb-4">Beste leker til vorspiel</h2>
        <ul className="space-y-4 mb-10">
          <li className="bg-white/60 backdrop-blur-sm rounded-2xl p-5">
            <h3 className="font-display text-xl font-black mb-1">
              <Link href="/drikkeleker/jeg-har-aldri" className="hover:underline">Jeg har aldri</Link>
            </h3>
            <p className="opacity-80">Perfekt icebreaker. Lærer dere å kjenne – eller avslører ting dere ikke visste.</p>
          </li>
          <li className="bg-white/60 backdrop-blur-sm rounded-2xl p-5">
            <h3 className="font-display text-xl font-black mb-1">
              <Link href="/drikkeleker/pekeleken" className="hover:underline">Pekeleken</Link>
            </h3>
            <p className="opacity-80">Best når dere er 4+. Blir kaos og latter – klassisk vorspiel-moro.</p>
          </li>
          <li className="bg-white/60 backdrop-blur-sm rounded-2xl p-5">
            <h3 className="font-display text-xl font-black mb-1">
              <Link href="/drikkeleker/snusboksen" className="hover:underline">Snusboksen</Link>
            </h3>
            <p className="opacity-80">Høyt tempo. Funker når stemningen allerede er god og dere vil ha rask action.</p>
          </li>
          <li className="bg-white/60 backdrop-blur-sm rounded-2xl p-5">
            <h3 className="font-display text-xl font-black mb-1">Klink-pakker</h3>
            <p className="opacity-80">Miks av festspørsmål og utfordringer. Holder vorspielet levende lenge.</p>
          </li>
        </ul>

        <h2 className="font-display text-3xl font-black mb-4">Tips til et bra vorspiel</h2>
        <ul className="list-disc pl-6 space-y-2 mb-10">
          <li>Start med Jeg har aldri for å bryte isen</li>
          <li>Bytt spill hver 20–30 min for variasjon</li>
          <li>Ha vann og snacks tilgjengelig</li>
          <li>Spill drøy modus først når alle er varme i trøya</li>
          <li>Ikke glem å klinke – det er jo selve poenget</li>
        </ul>

        <h2 className="font-display text-3xl font-black mb-4">Forspill-leker = vorspiel-leker</h2>
        <p className="mb-10">
          Begge ordene brukes om det samme på norsk. Noen sier vorspiel (tysk opprinnelse),
          andre sier forspill (norsk oversettelse). Klink funker like bra uansett hva du
          kaller det.
        </p>

        <div className="flex gap-3 flex-wrap">
          <Link href="/drikkeleker" className="underline underline-offset-4">Alle drikkeleker</Link>
          <span className="opacity-40">·</span>
          <Link href="/drikkeleker/droye" className="underline underline-offset-4">Drøye varianter</Link>
          <span className="opacity-40">·</span>
          <Link href="/drikkespill" className="underline underline-offset-4">Drikkespill online</Link>
        </div>
      </div>
    </main>
  )
}
