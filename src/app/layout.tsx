import type { Metadata, Viewport } from 'next'
import { Nunito, Playfair_Display } from 'next/font/google'
import { GameProvider } from '@/context/game-context'
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

export const metadata: Metadata = {
  title: 'Klink - Drikkespill',
  description: 'Det festligste drikkespillet! Velg spillpakke, legg til spillere og klink!',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Klink',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#A8E63D',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nb" className={`${nunito.variable} ${playfair.variable}`}>
      <body>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  )
}
