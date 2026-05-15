'use client'

import { useState } from 'react'
import { PartyPopper, RefreshCw, Package, Home, Share2, Check } from 'lucide-react'
import { useAthina } from '@/context/athina-context'
import { track } from '@/lib/analytics/events'
import { cn } from '@/lib/utils'

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

        <div className={cn('w-20 h-20 rounded-3xl flex items-center justify-center mb-6', athina ? 'bg-white/18' : 'bg-forest/10')}>
          <PartyPopper className={cn('w-10 h-10', athina ? 'text-white' : 'text-forest')} />
        </div>

        <h2 className={cn('font-display text-4xl font-black mb-2 text-center', athina ? 'text-white' : 'text-forest')}>
          Kortstokken er tom!
        </h2>
        <p className={cn('font-medium mb-10 text-center', athina ? 'text-white/70' : 'text-forest/50')}>
          Hva vil dere gjøre?
        </p>

        <div className="w-full space-y-3">
          <button
            onClick={onReshuffle}
            className={cn(
              'w-full min-h-[56px] rounded-2xl font-black text-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg',
              athina ? 'bg-white/30 text-white hover:bg-white/40' : 'bg-forest text-lime hover:bg-forest-light'
            )}
          >
            <RefreshCw className="w-5 h-5" />
            Stokk om og spill igjen
          </button>

          <button
            onClick={onNewPacks}
            className={cn(
              'w-full min-h-[52px] rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all',
              athina ? 'bg-white/18 text-white hover:bg-white/25' : 'bg-forest/10 text-forest hover:bg-forest/15'
            )}
          >
            <Package className="w-5 h-5" />
            Velg nye pakker
          </button>

          <button
            onClick={handleShare}
            className={cn(
              'w-full min-h-[52px] rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all',
              athina ? 'bg-white/18 text-white hover:bg-white/25' : 'bg-forest/10 text-forest hover:bg-forest/15'
            )}
          >
            {shared ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            {shared ? 'Kopiert!' : 'Del med venner'}
          </button>

          <button
            onClick={onReset}
            className={cn(
              'w-full min-h-[52px] rounded-2xl font-semibold text-base flex items-center justify-center gap-2 active:scale-95 transition-all',
              athina ? 'text-white/55 hover:text-white/75' : 'text-forest/40 hover:text-forest/60'
            )}
          >
            <Home className="w-4 h-4" />
            Tilbake til start
          </button>
        </div>
      </div>
    </div>
  )
}
