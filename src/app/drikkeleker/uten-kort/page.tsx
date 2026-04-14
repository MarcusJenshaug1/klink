import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Drikkeleker uten kort – Drikkespill uten utstyr',
  description:
    'Drikkeleker uten kort og uten utstyr. Klink spilles kun på mobilen – ingen kortstokk, ingen brett, ingen nedlasting. Gratis online på norsk.',
  alternates: { canonical: '/drikkeleker/uten-kort' },
  openGraph: {
    title: 'Drikkeleker uten kort – Kun mobilen',
    description: 'Ingen kortstokk. Ingen brett. Ingen nedlasting. Bare mobilen og dere.',
    url: 'https://www.klinkn.no/drikkeleker/uten-kort',
    type: 'website',
  },
}

export default function UtenKortPage() {
  return (
    <main className="min-h-dvh bg-lime text-forest">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <nav className="mb-8 text-sm">
          <Link href="/drikkeleker" className="underline underline-offset-4 hover:opacity-70">
            ← Alle drikkeleker
          </Link>
        </nav>

        <h1 className="font-display text-5xl sm:text-6xl font-black tracking-tight mb-4">
          Drikkeleker uten kort
        </h1>
        <p className="text-lg mb-8 opacity-80">
          Glemte kortstokken hjemme? Ingen panikk. Klink er drikkespill uten utstyr –
          alt du trenger er mobilen. Ingen kort, ingen brett, ingen nedlasting.
        </p>

        <Link
          href="/"
          className="inline-block bg-forest text-lime font-black px-6 py-3 rounded-2xl mb-12 hover:opacity-90 transition"
        >
          Start spill uten utstyr →
        </Link>

        <h2 className="font-display text-3xl font-black mb-4">Hvorfor spille uten kort?</h2>
        <ul className="list-disc pl-6 space-y-2 mb-10">
          <li>Ingenting å miste eller glemme</li>
          <li>Alltid tilgjengelig – mobilen har du uansett med deg</li>
          <li>Fungerer offline (PWA) når appen er åpnet én gang</li>
          <li>Oppdatert innhold – nye spørsmål kommer jevnlig</li>
          <li>Gratis – slipper å kjøpe ny kortstokk hver gang</li>
        </ul>

        <h2 className="font-display text-3xl font-black mb-4">Slik fungerer det</h2>
        <ol className="list-decimal pl-6 space-y-2 mb-10">
          <li>Gå til klinkn.no på mobilen</li>
          <li>Legg til spillere – minst 2</li>
          <li>Velg spillpakke: Jeg har aldri, Pekeleken, Snusboksen eller Klink</li>
          <li>Skjermen viser spørsmål / utsagn / utfordringer</li>
          <li>Send mobilen rundt – én skjerm holder for hele gjengen</li>
        </ol>

        <h2 className="font-display text-3xl font-black mb-4">Drikkespill du kan spille uten utstyr</h2>
        <p className="mb-4">Alle Klink-pakker spilles uten kort eller utstyr:</p>
        <ul className="list-disc pl-6 space-y-2 mb-10">
          <li><Link href="/drikkeleker/jeg-har-aldri" className="underline">Jeg har aldri</Link> – klassikeren</li>
          <li><Link href="/drikkeleker/pekeleken" className="underline">Pekeleken</Link> – alle peker samtidig</li>
          <li><Link href="/drikkeleker/snusboksen" className="underline">Snusboksen</Link> – raske &quot;Hvem ...?&quot;-spørsmål</li>
          <li>Klink-pakker – festspørsmål og utfordringer</li>
        </ul>

        <h2 className="font-display text-3xl font-black mb-4">Hvor kan dere spille?</h2>
        <p className="mb-10">
          Overalt hvor dere har mobil og wifi (eller 4G). Vorspiel, hytta, stranda,
          campingvogn, toget – Klink funker. Med PWA-modus kan du til og med spille
          offline etter første gangs lasting.
        </p>

        <div className="flex gap-3 flex-wrap">
          <Link href="/drikkeleker" className="underline underline-offset-4">Alle drikkeleker</Link>
          <span className="opacity-40">·</span>
          <Link href="/drikkeleker/2-personer" className="underline underline-offset-4">For 2 personer</Link>
          <span className="opacity-40">·</span>
          <Link href="/regler" className="underline underline-offset-4">Regler</Link>
        </div>
      </div>
    </main>
  )
}
