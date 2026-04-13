'use client'

import { PartyPopper, RefreshCw, Package, Home } from 'lucide-react'

interface DeckEmptyProps {
  onReshuffle: () => void
  onNewPacks: () => void
  onReset: () => void
}

export function DeckEmpty({ onReshuffle, onNewPacks, onReset }: DeckEmptyProps) {
  return (
    <div className="min-h-dvh bg-lime flex flex-col items-center justify-center p-8">
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
