'use client'
import { RefreshCw, X } from 'lucide-react'
import { usePwaUpdate } from '@/hooks/use-pwa-update'

export function PwaUpdateBanner() {
  const { needsUpdate, triggerUpdate, dismiss } = usePwaUpdate()
  if (!needsUpdate) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[80] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-2xl mx-auto bg-forest text-white rounded-3xl shadow-2xl p-4 sm:p-5 animate-slide-up flex items-center gap-3">
        <RefreshCw className="w-5 h-5 shrink-0 text-lime" />
        <p className="flex-1 text-sm font-semibold leading-snug">
          En ny versjon av Klink er klar!
        </p>
        <button
          onClick={triggerUpdate}
          className="shrink-0 px-3.5 py-1.5 rounded-full bg-lime text-forest font-black text-sm hover:bg-lime/80 active:scale-95 transition-all"
        >
          Oppdater nå
        </button>
        <button
          onClick={dismiss}
          aria-label="Lukk"
          className="shrink-0 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
