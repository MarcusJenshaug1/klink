import type { Metadata, Viewport } from 'next'
import { Nunito, Playfair_Display } from 'next/font/google'
import { GameProvider } from '@/context/game-context'
import { AthinaProvider } from '@/context/athina-context'
import { TrackingGate } from '@/components/tracking-gate'
import { ConsentBanner } from '@/components/consent-banner'
import { PwaUpdateBanner } from '@/components/pwa-update-banner'
import { AdminQuickAccess } from '@/components/admin-quick-access'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const SITE_URL = 'https://www.klinkn.no'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Klink – Drikkeleker & Drikkespill for fest',
    template: '%s | Klink',
  },
  description:
    'Klink er det festligste digitale drikkespillet. Spill drikkeleker som Jeg har aldri, Pekeleken, Snusboksen og drøye festspørsmål – rett i nettleseren. Gratis, uten nedlasting.',
  applicationName: 'Klink',
  keywords: [
    'drikkeleker',
    'drikkeleker drøy',
    'drikkespill',
    'drikkespill app',
    'drikkespill online',
    'digitalt drikkespill',
    'drikkeleker uten kort',
    'klink',
    'klink drikkespill',
    'jeg har aldri',
    'pekeleken',
    'snusboksen',
    'festleker',
    'festspørsmål',
    'forspill',
    'vorspiel leker',
  ],
  authors: [{ name: 'Klink' }],
  creator: 'Klink',
  publisher: 'Klink',
  category: 'games',
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    url: SITE_URL,
    siteName: 'Klink',
    title: 'Klink – Drikkeleker & Drikkespill for fest',
    description:
      'Det festligste drikkespillet. Spill Jeg har aldri, Pekeleken, Snusboksen og drøye festspørsmål rett i nettleseren. Gratis.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Klink – Drikkespill',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Klink – Drikkeleker & Drikkespill',
    description: 'Jeg har aldri, Pekeleken, Snusboksen og drøye festspørsmål. Gratis i nettleseren.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Klink',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#A8E63D',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Klink',
      inLanguage: 'nb-NO',
      description:
        'Digitalt drikkespill med drikkeleker, festspørsmål og drøye utfordringer.',
    },
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}/#app`,
      name: 'Klink – Drikkespill',
      url: SITE_URL,
      applicationCategory: 'GameApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      inLanguage: 'nb-NO',
      description:
        'Digitalt drikkespill med drikkeleker som Jeg har aldri, Pekeleken, Snusboksen og drøye festspørsmål.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'NOK',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nb" className={`${nunito.variable} ${playfair.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AthinaProvider>
          <GameProvider>
            {children}
          </GameProvider>
        </AthinaProvider>
        <TrackingGate />
        <AdminQuickAccess />
        <ConsentBanner />
        <PwaUpdateBanner />
        <SpeedInsights />
      </body>
    </html>
  )
}
