import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Personvernerklæring',
  description: 'Hvordan Klink håndterer personopplysninger, cookies og analyseverktøy (GA4, Vercel Analytics, Supabase).',
  alternates: { canonical: '/personvern' },
}

export default function PersonvernPage() {
  return (
    <main className="min-h-dvh bg-lime text-forest">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <nav className="mb-8 text-sm">
          <Link href="/" className="underline underline-offset-4 hover:opacity-70">← Tilbake</Link>
        </nav>

        <h1 className="font-display text-5xl font-black tracking-tight mb-4">Personvernerklæring</h1>
        <p className="text-sm opacity-60 mb-10">Sist oppdatert: 14. april 2026</p>

        <section className="space-y-3 mb-8">
          <h2 className="font-display text-2xl font-black">1. Behandlingsansvarlig</h2>
          <p>Klink drives av et lite team som utvikler norske drikkespill. Kontakt: post@klinkn.no.</p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="font-display text-2xl font-black">2. Hvilke opplysninger samles inn</h2>
          <p><strong>Som spiller:</strong> Spillernavn du legger inn lagres kun lokalt på enheten (localStorage). Vi lagrer ikke navnene på våre servere.</p>
          <p><strong>Analyseverktøy (kun med samtykke):</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Google Analytics 4: anonymisert IP-adresse, sidevisninger, enhetstype, referrer.</li>
            <li>Vercel Analytics: anonym besøksstatistikk.</li>
            <li>Vercel Speed Insights: ytelses-målinger (Core Web Vitals).</li>
          </ul>
          <p><strong>Admin-brukere:</strong> E-post og navn lagres i Supabase for pålogging og tilgangsstyring.</p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="font-display text-2xl font-black">3. Rettslig grunnlag</h2>
          <p>Samtykke (GDPR art. 6.1.a) for analyse. Berettiget interesse (art. 6.1.f) for nødvendig drift og admin-tilgang.</p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="font-display text-2xl font-black">4. Cookies</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><code className="font-mono text-sm">klink-consent-v1</code>: husker ditt samtykkevalg.</li>
            <li><code className="font-mono text-sm">klink-age-verified-v1</code>: husker aldersbekreftelse.</li>
            <li><code className="font-mono text-sm">klink-players</code>: spillernavn (localStorage).</li>
            <li><code className="font-mono text-sm">_ga</code>, <code className="font-mono text-sm">_ga_*</code>: Google Analytics (kun ved samtykke).</li>
          </ul>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="font-display text-2xl font-black">5. Deling med tredjeparter</h2>
          <p>Vi deler data med følgende underleverandører: Supabase (database), Vercel (hosting + analyse), Google (analyse), Resend (e-post til admins). Alle har databehandleravtaler.</p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="font-display text-2xl font-black">6. Dine rettigheter</h2>
          <p>Du har rett til innsyn, retting, sletting og dataportabilitet. Send e-post til post@klinkn.no. Du kan også klage til Datatilsynet.</p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="font-display text-2xl font-black">7. Trekke samtykke</h2>
          <p>Åpne nettleserens utvikler-konsoll og kjør: <code className="font-mono text-sm bg-white/50 px-2 py-0.5 rounded">localStorage.setItem(&apos;klink-consent-v1&apos;, &apos;declined&apos;); location.reload()</code></p>
          <p>Eller besøk <Link href="/?notrack=1" className="underline">klinkn.no/?notrack=1</Link> som skrur av tracking permanent på denne nettleseren.</p>
        </section>

        <Link href="/" className="inline-block mt-6 bg-forest text-lime font-black px-6 py-3 rounded-2xl hover:opacity-90 transition">
          Tilbake til Klink
        </Link>
      </div>
    </main>
  )
}
