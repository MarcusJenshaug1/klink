'use client'
import { RefreshCw, X } from 'lucide-react'
import { usePwaUpdate } from '@/hooks/use-pwa-update'
import { useAthina } from '@/context/athina-context'
import { cn } from '@/lib/utils'

export function PwaUpdateBanner() {
  const { needsUpdate, triggerUpdate, dismiss } = usePwaUpdate()
  const { isActive: athina } = useAthina()
  if (!needsUpdate) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[80] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className={cn(
        'max-w-2xl mx-auto text-white rounded-3xl shadow-2xl p-4 sm:p-5 animate-slide-up flex items-center gap-3',
        athina ? 'bg-[#FF69B4]' : 'bg-forest'
      )}>
        <RefreshCw className={cn('w-5 h-5 shrink-0', athina ? 'text-white' : 'text-lime')} />
        <p className="flex-1 text-sm font-semibold leading-snug">
          En ny versjon av Klink er klar!
        </p>
        <button
          onClick={triggerUpdate}
          className={cn(
            'shrink-0 px-3.5 py-1.5 rounded-full font-black text-sm active:scale-95 transition-all',
            athina ? 'bg-white/25 text-white hover:bg-white/35' : 'bg-lime text-forest hover:bg-lime/80'
          )}
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
