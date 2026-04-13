'use client'

import { Package, LogOut, ArrowLeft } from 'lucide-react'

interface ExitModalProps {
  open: boolean
  onClose: () => void
  onNewPacks: () => void
  onReset: () => void
}

export function ExitModal({ open, onClose, onNewPacks, onReset }: ExitModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      {/* Sheet */}
      <div
        className="relative w-full max-w-lg bg-lime rounded-t-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-forest/20 rounded-full mx-auto mb-6" />

        <h2 className="font-display text-3xl font-black text-forest mb-1">Pause</h2>
        <p className="text-forest/50 text-sm mb-6">Spillerne beholdes til neste runde.</p>

        <div className="space-y-3">
          <button
            onClick={onNewPacks}
            className="w-full min-h-[52px] bg-forest text-lime rounded-2xl font-black text-base flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-forest-light"
          >
            <Package className="w-5 h-5" />
            Velg nye pakker
          </button>

          <button
            onClick={onReset}
            className="w-full min-h-[52px] bg-forest/10 text-forest rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-forest/15"
          >
            <LogOut className="w-5 h-5" />
            Avslutt og nullstill
          </button>

          <button
            onClick={onClose}
            className="w-full min-h-[52px] text-forest/50 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 active:scale-95 transition-all hover:text-forest/70"
          >
            <ArrowLeft className="w-4 h-4" />
            Fortsett spillet
          </button>
        </div>
      </div>
    </div>
  )
}
