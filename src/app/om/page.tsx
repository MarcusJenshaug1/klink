import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Om Klink – Norges digitale drikkespill',
  description:
    'Klink er et norsk, gratis, digitalt drikkespill laget for vorspiel og fest. Drikkeleker, festspørsmål og drøye utfordringer – rett i nettleseren.',
  alternates: { canonical: '/om' },
}

export default function OmPage() {
  return (
    <main className="min-h-dvh bg-lime text-forest">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <nav className="mb-8 text-sm">
          <Link href="/" className="underline underline-offset-4 hover:opacity-70">
            ← Tilbake til Klink
          </Link>
        </nav>

        <h1 className="font-display text-5xl font-black tracking-tight mb-4">Om Klink</h1>
        <p className="text-lg mb-6 opacity-80">
          Klink er et norsk digitalt drikkespill laget for vorspiel, fest og forspill.
          Gratis, uten nedlasting, rett i nettleseren.
        </p>

        <p className="mb-4">
          Vi startet Klink fordi vi var lei av å lete etter nye drikkeleker før hver fest.
          Kortstokker blir mistet. Apper koster penger eller er fulle av reklame. Klink er
          løsningen: alle de beste drikkelekene på ett sted, alltid tilgjengelig på mobilen,
          helt gratis.
        </p>

        <p className="mb-4">
          Alt innhold er skrevet på norsk av norske skribenter. Vi oppdaterer
          spørsmålsbiblioteket jevnlig med nye kort – både snille drikkeleker for blandede
          forsamlinger og drøye varianter for de som tåler mer.
        </p>

        <h2 className="font-display text-2xl font-black mb-2 mt-10">Hva kan du spille?</h2>
        <ul className="list-disc pl-6 space-y-1 mb-8">
          <li>Jeg har aldri</li>
          <li>Pekeleken</li>
          <li>Snusboksen</li>
          <li>Klink-pakker med festspørsmål og utfordringer</li>
        </ul>

        <h2 className="font-display text-2xl font-black mb-2">Kontakt</h2>
        <p className="mb-8">
          Har du forslag til nye drikkeleker eller spørsmål? Send oss gjerne en melding.
        </p>

        <Link
          href="/"
          className="inline-block bg-forest text-lime font-black px-6 py-3 rounded-2xl hover:opacity-90 transition"
        >
          Start spillet →
        </Link>
      </div>
    </main>
  )
}
