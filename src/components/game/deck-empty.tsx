'use client'

import { useState } from 'react'
import { PartyPopper, RefreshCw, Package, Home, Share2, Check } from 'lucide-react'
import { useAthina } from '@/context/athina-context'
import { track } from '@/lib/analytics/events'

interface DeckEmptyProps {
  onReshuffle: () => void
  onNewPacks: () => void
  onReset: () => void
}

export function DeckEmpty({ onReshuffle, onNewPacks, onReset }: DeckEmptyProps) {
  const { isActive: athina } = useAthina()
  const [shared, setShared] = useState(false)

  async function handleShare() {
    track('share_clicked', { source: 'deck_empty' })
    const shareData = {
      title: 'Klink — Drikkespill',
      text: 'Prøv Klink — norsk drikkespill gratis i nettleseren!',
      url: 'https://www.klinkn.no/',
    }
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch {
      // user cancelled
    }
  }
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-8 transition-colors duration-700" style={{ backgroundColor: athina ? 'transparent' : '#A8E63D' }}>
      <div className="w-full max-w-sm animate-scale-in flex flex-col items-center">

        <div className="w-20 h-20 rounded-3xl bg-forest/10 flex items-center justify-center mb-6">
          <PartyPopper className="w-10 h-10 text-forest" />
        </div>

        <h2 className="font-display text-4xl font-black text-forest mb-2 text-center">
          Kortstokken er tom!
        </h2>
        <p className="text-forest/50 font-medium mb-10 text-center">
          Hva vil dere gjøre?
        </p>

        <div className="w-full space-y-3">
          <button
            onClick={onReshuffle}
            className="w-full min-h-[56px] bg-forest text-lime rounded-2xl font-black text-lg flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-forest-light shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Stokk om og spill igjen
          </button>

          <button
            onClick={onNewPacks}
            className="w-full min-h-[52px] bg-forest/10 text-forest rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-forest/15"
          >
            <Package className="w-5 h-5" />
            Velg nye pakker
          </button>

          <button
            onClick={handleShare}
            className="w-full min-h-[52px] bg-forest/10 text-forest rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-forest/15"
          >
            {shared ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            {shared ? 'Kopiert!' : 'Del med venner'}
          </button>

          <button
            onClick={onReset}
            className="w-full min-h-[52px] text-forest/40 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 active:scale-95 transition-all hover:text-forest/60"
          >
            <Home className="w-4 h-4" />
            Tilbake til start
          </button>
        </div>
      </div>
    </div>
  )
}
